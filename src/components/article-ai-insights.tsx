import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generateArticleInsights } from "@/lib/ai-service"
import { Brain, Key, MessageSquare, Sparkles, TrendingUp } from "lucide-react"
import type { Article } from "@/lib/types"

interface ArticleAiInsightsProps {
    article: Article
}

export default async function ArticleAiInsights({ article }: ArticleAiInsightsProps) {
    const insights = await generateArticleInsights(article)

    return (
        <Card className="overflow-hidden border-primary/20">
            <CardHeader className="bg-primary/5 pb-3">
                <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    <span>AI Insights</span>
                    <Badge variant="outline" className="ml-auto text-xs font-normal">
                        Powered by Gemini
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <Tabs defaultValue="summary" className="w-full">
                    <TabsList className="w-full grid grid-cols-3 rounded-none">
                        <TabsTrigger value="summary">Summary</TabsTrigger>
                        <TabsTrigger value="keyPoints">Key Points</TabsTrigger>
                        <TabsTrigger value="keywords">Keywords</TabsTrigger>
                    </TabsList>

                    <TabsContent value="summary" className="p-4 space-y-2">
                        <div className="flex items-start gap-2">
                            <Sparkles className="h-5 w-5 text-primary shrink-0 mt-1" />
                            <p className="text-sm">{insights.summary}</p>
                        </div>

                        {insights.sentiment && (
                            <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                                <span className="text-sm font-medium">Sentiment:</span>
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
                    </TabsContent>

                    <TabsContent value="keyPoints" className="p-4">
                        <ul className="space-y-3">
                            {insights.keyPoints.map((point, index) => (
                                <li key={index} className="flex items-start gap-2">
                                    <TrendingUp className="h-5 w-5 text-primary shrink-0 mt-1" />
                                    <span className="text-sm">{point}</span>
                                </li>
                            ))}
                        </ul>
                    </TabsContent>

                    <TabsContent value="keywords" className="p-4">
                        <div className="flex flex-wrap gap-2">
                            {insights.keywords.map((keyword) => (
                                <div
                                    key={keyword}
                                    className="flex items-center gap-1 bg-primary/10 text-primary rounded-full px-3 py-1"
                                >
                                    <Key className="h-3 w-3" />
                                    <span className="text-sm">{keyword}</span>
                                </div>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="p-4 bg-muted/30 border-t">
                    <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-primary" />
                        <p className="text-xs text-muted-foreground">Ask questions about this article in the chat section below</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
