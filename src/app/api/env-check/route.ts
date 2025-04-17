import { NextResponse } from "next/server"

export async function GET() {
    const newsApiKey = process.env.NEWS_API_KEY
    const geminiApiKey = process.env.GEMINI_API_KEY

    const missingKeys = []
    if (!newsApiKey) missingKeys.push("NEWS_API_KEY")
    if (!geminiApiKey) missingKeys.push("GEMINI_API_KEY")

    if (missingKeys.length > 0) {
        return NextResponse.json(
            {
                status: "error",
                message: `Missing required environment variables: ${missingKeys.join(", ")}`,
                missingKeys,
            },
            { status: 400 },
        )
    }

    return NextResponse.json({
        status: "ok",
        message: "All required environment variables are set",
    })
}
