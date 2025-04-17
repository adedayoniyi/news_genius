export interface Source {
    id: string | null
    name: string
}

export interface Article {
    source: Source
    author: string | null
    title: string
    description: string
    url: string
    urlToImage: string | null
    publishedAt: string
    content: string
    category?: string
    aiSummary?: string
    keywords?: string[]
}

export interface TrendingTopic {
    id: string
    title: string
    description: string
    category: string
    keywords: string[]
    articleCount: number
}

export interface ArticleInsights {
    summary: string
    keyPoints: string[]
    keywords: string[]
    sentiment?: "Positive" | "Negative" | "Neutral"
}

export interface ChatMessage {
    role: "user" | "assistant"
    content: string
}
