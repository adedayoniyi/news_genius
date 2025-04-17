import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Article } from "@/lib/types"

interface FeaturedArticleProps {
    article: Article
}

export default function FeaturedArticle({ article }: FeaturedArticleProps) {
    const { title, description, url, urlToImage, publishedAt, source, category, aiSummary } = article

    return (
        <Link href={`/article/${encodeURIComponent(url)}`}>
            <Card className="overflow-hidden hover:shadow-md transition-shadow h-full">
                <div className="relative w-full h-[300px] md:h-[400px]">
                    <Image
                        src={urlToImage || "/placeholder.svg?height=400&width=800"}
                        alt={title}
                        fill
                        className="object-cover"
                        onError={(e) => {
                            // Replace broken images with placeholder
                            ; (e.target as HTMLImageElement).src = "/placeholder.svg?height=400&width=800"
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        {category && <Badge className="mb-2 bg-primary text-primary-foreground">{category}</Badge>}
                        <h2 className="text-2xl md:text-3xl font-bold mb-2">{title}</h2>
                        <p className="text-sm md:text-base text-gray-200 line-clamp-2 mb-2">{description}</p>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-300">{source.name}</span>
                            <span className="text-sm text-gray-300">
                                {formatDistanceToNow(new Date(publishedAt), { addSuffix: true })}
                            </span>
                        </div>
                    </div>
                </div>
                {aiSummary && (
                    <CardContent className="p-4 bg-muted/50">
                        <div className="flex items-start gap-2">
                            <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded">AI Summary</span>
                            <p className="text-sm line-clamp-2">{aiSummary}</p>
                        </div>
                    </CardContent>
                )}
            </Card>
        </Link>
    )
}
