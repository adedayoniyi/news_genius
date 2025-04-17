import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Article } from "@/lib/types"

interface NewsCardProps {
    article: Article
    variant?: "default" | "compact"
}

export default function NewsCard({ article, variant = "default" }: NewsCardProps) {
    const { title, description, url, urlToImage, publishedAt, source, category, keywords } = article

    if (variant === "compact") {
        return (
            <Link href={`/article/${encodeURIComponent(url)}`}>
                <Card className="overflow-hidden h-24 hover:shadow-md transition-shadow">
                    <div className="flex h-full">
                        {urlToImage && (
                            <div className="relative w-24 h-full">
                                <Image
                                    src={urlToImage || "/placeholder.svg?height=96&width=96"}
                                    alt={title}
                                    fill
                                    className="object-cover"
                                    onError={(e) => {
                                        // Replace broken images with placeholder
                                        ; (e.target as HTMLImageElement).src = "/placeholder.svg?height=96&width=96"
                                    }}
                                />
                            </div>
                        )}
                        <CardContent className="p-3 flex-1">
                            <div className="flex flex-col justify-between h-full">
                                <h3 className="font-medium text-sm line-clamp-2">{title}</h3>
                                <div className="flex items-center justify-between mt-1">
                                    <span className="text-xs text-muted-foreground">{source.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(new Date(publishedAt), { addSuffix: true })}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </div>
                </Card>
            </Link>
        )
    }

    return (
        <Link href={`/article/${encodeURIComponent(url)}`}>
            <Card className="overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
                {urlToImage && (
                    <div className="relative w-full h-48">
                        <Image
                            src={urlToImage || "/placeholder.svg?height=192&width=384"}
                            alt={title}
                            fill
                            className="object-cover"
                            onError={(e) => {
                                // Replace broken images with placeholder
                                ; (e.target as HTMLImageElement).src = "/placeholder.svg?height=192&width=384"
                            }}
                        />
                    </div>
                )}
                <CardContent className="p-4 flex-1 flex flex-col">
                    {category && (
                        <Badge variant="outline" className="self-start mb-2">
                            {category}
                        </Badge>
                    )}
                    <h3 className="font-semibold text-lg line-clamp-2 mb-2">{title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{description}</p>
                    <div className="flex items-center justify-between mt-auto">
                        <span className="text-xs text-muted-foreground">{source.name}</span>
                        <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(publishedAt), { addSuffix: true })}
                        </span>
                    </div>
                    {keywords && keywords.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                            {keywords.slice(0, 3).map((keyword) => (
                                <Badge key={keyword} variant="secondary" className="text-xs">
                                    {keyword}
                                </Badge>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </Link>
    )
}
