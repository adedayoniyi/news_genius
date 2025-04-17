import { fetchTrendingNews } from "@/lib/news-api"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default async function TrendingSection() {
    const trendingTopics = await fetchTrendingNews()

    if (trendingTopics.length === 0) {
        return (
            <div className="flex items-center justify-center h-40 bg-muted rounded-lg">
                <p className="text-muted-foreground">No trending topics available</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingTopics.map((topic) => (
                <Link key={topic.id} href={`/topic/${topic.id}`}>
                    <Card className="overflow-hidden hover:shadow-md transition-shadow h-full">
                        <CardContent className="p-6">
                            <Badge className="mb-3">{topic.category}</Badge>
                            <h3 className="text-xl font-semibold mb-2">{topic.title}</h3>
                            <p className="text-sm text-muted-foreground mb-4">{topic.description}</p>
                            <div className="flex flex-wrap gap-2">
                                {topic.keywords.slice(0, 4).map((keyword) => (
                                    <Badge key={keyword} variant="outline" className="text-xs">
                                        {keyword}
                                    </Badge>
                                ))}
                            </div>
                            <div className="mt-4 text-sm text-muted-foreground">{topic.articleCount} articles</div>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    )
}
