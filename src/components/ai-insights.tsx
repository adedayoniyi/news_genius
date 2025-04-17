import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { generateArticleInsights } from "@/lib/ai-service"
import type { Article } from "@/lib/types"

interface AiInsightsProps {
    article: Article
}

export default async function AiInsights({ article }: AiInsightsProps) {
    const insights = await generateArticleInsights(article)

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                    <span>AI Insights</span>
                    <Badge variant="outline" className="text-xs font-normal">
                        Powered by Gemini
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h4 className="text-sm font-medium mb-2">Summary</h4>
                    <p className="text-sm text-muted-foreground">{insights.summary}</p>
                </div>

                <div>
                    <h4 className="text-sm font-medium mb-2">Key Points</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                        {insights.keyPoints.map((point, index) => (
                            <li key={index} className="flex items-start gap-2">
                                <span className="text-primary">•</span>
                                <span>{point}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="text-sm font-medium mb-2">Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                        {insights.keywords.map((keyword) => (
                            <Badge key={keyword} variant="secondary" className="text-xs">
                                {keyword}
                            </Badge>
                        ))}
                    </div>
                </div>

                {insights.sentiment && (
                    <div>
                        <h4 className="text-sm font-medium mb-2">Sentiment</h4>
                        <Badge
                            className={
                                insights.sentiment === "Positive"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                    : insights.sentiment === "Negative"
                                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                            }
                        >
                            {insights.sentiment}
                        </Badge>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
