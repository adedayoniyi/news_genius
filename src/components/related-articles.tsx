import { fetchRelatedArticles } from "@/lib/news-api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Newspaper } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"

interface RelatedArticlesProps {
    articleUrl: string
}

export default async function RelatedArticles({ articleUrl }: RelatedArticlesProps) {
    const relatedArticles = await fetchRelatedArticles(articleUrl)

    if (relatedArticles.length === 0) {
        return null
    }

    return (
        <Card className="overflow-hidden border-primary/20">
            <CardHeader className="bg-primary/5 pb-3">
                <CardTitle className="flex items-center gap-2">
                    <Newspaper className="h-5 w-5 text-primary" />
                    <span>Related Articles</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y">
                    {relatedArticles.slice(0, 3).map((article) => (
                        <Link
                            key={article.url}
                            href={`/article/${encodeURIComponent(article.url)}`}
                            className="block p-4 hover:bg-muted/50 transition-colors"
                        >
                            <div className="flex gap-3">
                                {article.urlToImage && (
                                    <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                                        <Image
                                            src={article.urlToImage || "/placeholder.svg?height=64&width=64"}
                                            alt={article.title}
                                            fill
                                            className="object-cover"
                                        // onError={(e) => {
                                        //     ; (e.target as HTMLImageElement).src = "/placeholder.svg?height=64&width=64"
                                        // }}
                                        />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <h3 className="font-medium text-sm line-clamp-2 mb-1">{article.title}</h3>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground">{article.source.name}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="p-3 bg-muted/30 border-t">
                    <Link href="/search" className="text-xs text-primary flex items-center justify-center gap-1 hover:underline">
                        <span>Find more related articles</span>
                        <ArrowRight className="h-3 w-3" />
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}
