/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai"
import { Article, ArticleInsights, ChatMessage } from "./types"

// This will be provided by the user
const GEMINI_API_KEY = process.env.GEMINI_API_KEY

// Initialize the Google Generative AI
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || "")

// Configure safety settings
const safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
]

export async function generateArticleInsights(article: Article): Promise<ArticleInsights> {
    try {
        if (!GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY is not set")
        }

        // Get the Gemini model
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            safetySettings,
        })

        const prompt = `
      Analyze the following news article and provide insights:
      
      Title: ${article.title}
      Description: ${article.description}
      Content: ${article.content}
      
      Please provide the following in JSON format:
      {
        "summary": "A concise summary (2-3 sentences)",
        "keyPoints": ["3-5 key points from the article"],
        "keywords": ["5-7 relevant keywords"],
        "sentiment": "The overall sentiment (Positive, Negative, or Neutral)"
      }
    `

        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()

        // Extract JSON from the response
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/({[\s\S]*})/)
        let parsedData: any

        if (jsonMatch && jsonMatch[1]) {
            parsedData = JSON.parse(jsonMatch[1])
        } else {
            try {
                parsedData = JSON.parse(text)
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (e) {
                // If we can't parse JSON, extract data using regex
                const summary = text.match(/summary["\s:]+([^"]+)/i)?.[1] || "Unable to generate summary."
                const keyPointsMatch = text.match(/keyPoints["\s:]+\[([\s\S]*?)\]/i)?.[1] || ""
                const keyPoints = keyPointsMatch
                    .split(",")
                    .map((point: string) => point.replace(/["]/g, "").trim())
                    .filter(Boolean)
                const keywordsMatch = text.match(/keywords["\s:]+\[([\s\S]*?)\]/i)?.[1] || ""
                const keywords = keywordsMatch
                    .split(",")
                    .map((keyword: string) => keyword.replace(/["]/g, "").trim())
                    .filter(Boolean)
                const sentiment = text.match(/sentiment["\s:]+([^"]+)/i)?.[1]?.trim() || "Neutral"

                parsedData = { summary, keyPoints, keywords, sentiment }
            }
        }

        return {
            summary: parsedData.summary || "Unable to generate summary.",
            keyPoints: parsedData.keyPoints || ["Error analyzing article content."],
            keywords: parsedData.keywords || extractKeywords(article.title + " " + article.description),
            sentiment: (parsedData.sentiment as "Positive" | "Negative" | "Neutral") || "Neutral",
        }
    } catch (error) {
        console.error("Error generating article insights:", error)
        return {
            summary: "Unable to generate summary at this time.",
            keyPoints: ["Error analyzing article content."],
            keywords: extractKeywords(article.title + " " + article.description),
            sentiment: "Neutral",
        }
    }
}

export async function chatWithAi(
    previousMessages: ChatMessage[],
    userMessage: string,
    article: Article | null,
): Promise<string> {
    try {
        if (!GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY is not set")
        }

        // Get the Gemini model
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            safetySettings,
        })

        // Format the history correctly for Gemini
        // The history should only contain previous messages, not the current user message
        // And we need to ensure we're using the correct role mapping
        const history = previousMessages.map((msg) => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }],
        }))

        // If the first message is from the assistant, we need to handle it differently
        // because Gemini requires the first message to be from the user
        let chat

        if (previousMessages.length > 0 && previousMessages[0].role === "assistant") {
            // If chat starts with assistant message, we'll start a fresh chat
            // and handle the context in our prompt instead
            chat = model.startChat({
                generationConfig: {
                    temperature: 0.7,
                    topP: 0.95,
                    topK: 40,
                },
            })

            // Include the assistant's context in our prompt
            const assistantContext = previousMessages[0].content
            let prompt = `${assistantContext}\n\nUser: ${userMessage}`

            // If there's an article context, add it to the prompt
            if (article) {
                prompt = `
          ${assistantContext}
          
          Article context:
          Title: ${article.title}
          Source: ${article.source.name}
          Description: ${article.description}
          
          User: ${userMessage}
        `
            }

            // Send the message and get the response
            const result = await chat.sendMessage(prompt)
            const response = await result.response
            return response.text()
        } else {
            // Normal case: we have a proper history with user as first message
            chat = model.startChat({
                history,
                generationConfig: {
                    temperature: 0.7,
                    topP: 0.95,
                    topK: 40,
                },
            })

            let prompt = userMessage

            // If there's an article context, add it to the prompt
            if (article) {
                prompt = `
          I'm asking about this article:
          Title: ${article.title}
          Source: ${article.source.name}
          Description: ${article.description}
          
          My question is: ${userMessage}
        `
            }

            // Send the message and get the response
            const result = await chat.sendMessage(prompt)
            const response = await result.response
            return response.text()
        }
    } catch (error) {
        console.error("Error chatting with AI:", error)
        return "I'm sorry, I encountered an error processing your request. Please try again."
    }
}

// Helper function to extract keywords from text
function extractKeywords(text: string): string[] {
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
        .slice(0, 7)
        .map(([word]) => word)
}
