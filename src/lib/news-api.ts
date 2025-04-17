/* eslint-disable @typescript-eslint/no-explicit-any */
import { Article, TrendingTopic } from "./types"

// NewsAPI.org base URL
const NEWS_API_BASE_URL = "https://newsapi.org/v2"
// This will be provided by the user
const NEWS_API_KEY = process.env.NEWS_API_KEY

// Helper function to transform NewsAPI response to our Article type
function transformNewsApiArticle(article: any): Article {
    return {
        source: {
            id: article.source.id,
            name: article.source.name,
        },
        author: article.author,
        title: article.title,
        description: article.description || "No description available",
        url: article.url,
        urlToImage: article.urlToImage,
        publishedAt: article.publishedAt,
        content: article.content || article.description || "No content available",
        category: getCategoryFromUrl(article.url),
    }
}

// Helper function to extract category from URL or source
function getCategoryFromUrl(url: string): string | undefined {
    const categories = ["world", "business", "technology", "science", "health", "sports", "entertainment", "politics"]

    const urlLower = url.toLowerCase()
    for (const category of categories) {
        if (urlLower.includes(category)) {
            return category
        }
    }

    return undefined
}

export async function fetchTopHeadlines(): Promise<Article[]> {
    try {
        const response = await fetch(
            `${NEWS_API_BASE_URL}/top-headlines?country=us&pageSize=10&apiKey=${NEWS_API_KEY}`,
            { next: { revalidate: 3600 } }, // Cache for 1 hour
        )

        if (!response.ok) {
            throw new Error(`News API error: ${response.status}`)
        }

        const data = await response.json()
        return data.articles.map(transformNewsApiArticle)
    } catch (error) {
        console.error("Error fetching top headlines:", error)
        return []
    }
}

export async function fetchNewsByCategory(category: string): Promise<Article[]> {
    try {
        const response = await fetch(
            `${NEWS_API_BASE_URL}/top-headlines?country=us&category=${category}&pageSize=6&apiKey=${NEWS_API_KEY}`,
            { next: { revalidate: 3600 } }, // Cache for 1 hour
        )

        if (!response.ok) {
            throw new Error(`News API error: ${response.status}`)
        }

        const data = await response.json()
        return data.articles.map(transformNewsApiArticle)
    } catch (error) {
        console.error(`Error fetching news for category ${category}:`, error)
        return []
    }
}

export async function fetchTrendingNews(): Promise<TrendingTopic[]> {
    try {
        // For trending topics, we'll fetch news with high popularity
        const response = await fetch(
            `${NEWS_API_BASE_URL}/top-headlines?country=us&pageSize=20&apiKey=${NEWS_API_KEY}`,
            { next: { revalidate: 3600 } }, // Cache for 1 hour
        )

        if (!response.ok) {
            throw new Error(`News API error: ${response.status}`)
        }

        const data = await response.json()

        // Group articles by category and extract trending topics
        const articlesByCategory: Record<string, any[]> = {}

        data.articles.forEach((article: any) => {
            const category = getCategoryFromUrl(article.url) || "general"
            if (!articlesByCategory[category]) {
                articlesByCategory[category] = []
            }
            articlesByCategory[category].push(article)
        })

        // Create trending topics from the grouped articles
        const trendingTopics: TrendingTopic[] = Object.entries(articlesByCategory)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .filter(([_, articles]) => articles.length >= 2) // Only categories with at least 2 articles
            .map(([category, articles]) => {
                // Extract common keywords from article titles
                const allTitles = articles.map((a) => a.title).join(" ")
                const keywords = extractKeywords(allTitles, 5)

                return {
                    id: category.toLowerCase(),
                    title: category.charAt(0).toUpperCase() + category.slice(1),
                    description: `Latest news and updates about ${category}`,
                    category: category.charAt(0).toUpperCase() + category.slice(1),
                    keywords,
                    articleCount: articles.length,
                }
            })
            .slice(0, 4) // Limit to 4 trending topics

        return trendingTopics
    } catch (error) {
        console.error("Error fetching trending news:", error)
        return []
    }
}

export async function fetchArticleById(url: string): Promise<Article | null> {
    try {
        // NewsAPI doesn't have a direct endpoint to fetch by URL
        // We'll search for articles with the URL and find a match
        const encodedUrl = encodeURIComponent(url)
        const response = await fetch(
            `${NEWS_API_BASE_URL}/everything?qInTitle=${encodedUrl}&apiKey=${NEWS_API_KEY}`,
            { next: { revalidate: 3600 } }, // Cache for 1 hour
        )

        if (!response.ok) {
            throw new Error(`News API error: ${response.status}`)
        }

        const data = await response.json()

        // Find the article that matches our URL
        const matchingArticle = data.articles.find((article: any) => article.url === url)

        if (!matchingArticle) {
            // If we can't find it by URL search, try a more general search
            const titleParts = url.split("/").pop()?.split("-") || []
            if (titleParts.length > 0) {
                const searchQuery = titleParts.slice(0, 3).join(" ")
                const fallbackResponse = await fetch(
                    `${NEWS_API_BASE_URL}/everything?q=${searchQuery}&pageSize=5&apiKey=${NEWS_API_KEY}`,
                    { next: { revalidate: 3600 } },
                )

                if (fallbackResponse.ok) {
                    const fallbackData = await fallbackResponse.json()
                    if (fallbackData.articles.length > 0) {
                        return transformNewsApiArticle(fallbackData.articles[0])
                    }
                }
            }
            return null
        }

        return transformNewsApiArticle(matchingArticle)
    } catch (error) {
        console.error("Error fetching article by ID:", error)
        return null
    }
}

export async function fetchRelatedArticles(articleUrl: string): Promise<Article[]> {
    try {
        // Extract keywords from the URL to find related articles
        const urlParts = articleUrl.split("/").pop()?.split("-") || []
        const searchQuery = urlParts.slice(0, 3).join(" ")

        const response = await fetch(
            `${NEWS_API_BASE_URL}/everything?q=${searchQuery}&pageSize=3&apiKey=${NEWS_API_KEY}`,
            { next: { revalidate: 3600 } }, // Cache for 1 hour
        )

        if (!response.ok) {
            throw new Error(`News API error: ${response.status}`)
        }

        const data = await response.json()

        // Filter out the original article
        const relatedArticles = data.articles
            .filter((article: any) => article.url !== articleUrl)
            .map(transformNewsApiArticle)
            .slice(0, 3)

        return relatedArticles
    } catch (error) {
        console.error("Error fetching related articles:", error)
        return []
    }
}

// Helper function to extract keywords from text
function extractKeywords(text: string, count = 7): string[] {
    const commonWords = new Set([
        "the",
        "and",
        "a",
        "an",
        "in",
        "on",
        "at",
        "to",
        "for",
        "of",
        "with",
        "by",
        "as",
        "is",
        "are",
        "was",
        "were",
        "be",
        "this",
        "that",
        "it",
        "from",
        "or",
        "but",
        "not",
        "what",
        "all",
        "about",
        "who",
        "which",
        "when",
        "there",
        "new",
        "more",
        "their",
        "has",
        "will",
        "one",
        "after",
        "said",
        "would",
        "have",
        "they",
        "you",
        "been",
        "its",
    ])

    const words = text.toLowerCase().match(/\b\w+\b/g) || []
    const wordCounts: Record<string, number> = {}

    words.forEach((word) => {
        if (!commonWords.has(word) && word.length > 3) {
            wordCounts[word] = (wordCounts[word] || 0) + 1
        }
    })

    return Object.entries(wordCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, count)
        .map(([word]) => word)
}
