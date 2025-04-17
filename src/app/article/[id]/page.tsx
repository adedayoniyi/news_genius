import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { fetchArticleById } from "@/lib/news-api"
import { formatDate } from "@/lib/utils"
import { Clock, Globe, User } from "lucide-react"
import ArticleActions from "@/components/article-actions"
import ArticleAiInsights from "@/components/article-ai-insights"
import ArticleChat from "@/components/article-chat"
import RelatedArticles from "@/components/related-articles"

interface ArticlePageProps {
    params: {
        id: string
    }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
    const decodedUrl = decodeURIComponent(params.id)
    const article = await fetchArticleById(decodedUrl)

    if (!article) {
        notFound()
    }

    const { title, description, content, url, urlToImage, publishedAt, source, author, category } = article

    return (
        <div className="container py-6">
            <div className="max-w-4xl mx-auto mb-8">
                {category && (
                    <Link href={`/category/${category.toLowerCase()}`}>
                        <Badge className="mb-4">{category}</Badge>
                    </Link>
                )}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">{title}</h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
                    {author && (
                        <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{author}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatDate(publishedAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        <span>{source.name}</span>
                    </div>
                </div>
            </div>

            {urlToImage && (
                <div className="relative w-full max-w-5xl mx-auto h-[300px] md:h-[500px] rounded-lg overflow-hidden mb-8">
                    <Image
                        src={urlToImage || "/placeholder.svg?height=500&width=1000"}
                        alt={title}
                        fill
                        className="object-cover"
                        // onError={(e) => {
                        //     ; (e.target as HTMLImageElement).src = "/placeholder.svg?height=500&width=1000"
                        // }}
                        priority
                    />
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-card rounded-lg shadow-sm p-6 md:p-8">
                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            <p className="text-xl font-medium mb-6 leading-relaxed">{description}</p>
                            <div dangerouslySetInnerHTML={{ __html: content }} />
                        </div>

                        <div className="flex items-center justify-between py-4 mt-8 border-t">
                            <ArticleActions article={article} />
                            <Link href={url} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline">Read original article</Button>
                            </Link>
                        </div>
                    </div>

                    <Suspense fallback={<Skeleton className="h-[400px] w-full rounded-xl" />}>
                        <ArticleChat article={article} />
                    </Suspense>
                </div>

                <div className="space-y-8">
                    <Suspense fallback={<Skeleton className="h-[400px] w-full rounded-xl" />}>
                        <ArticleAiInsights article={article} />
                    </Suspense>

                    <Suspense
                        fallback={
                            <div className="space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <Skeleton key={i} className="h-24 w-full" />
                                ))}
                            </div>
                        }
                    >
                        <RelatedArticles articleUrl={url} />
                    </Suspense>
                </div>
            </div>
        </div>
    )
}
