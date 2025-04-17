import { fetchNewsByCategory } from "@/lib/news-api"
import NewsCard from "@/components/news-card"

interface CategorySectionProps {
    category: string
}

export default async function CategorySection({ category }: CategorySectionProps) {
    const articles = await fetchNewsByCategory(category)

    if (articles.length === 0) {
        return (
            <div className="flex items-center justify-center h-40 bg-muted rounded-lg">
                <p className="text-muted-foreground">No articles available for this category</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.slice(0, 6).map((article) => (
                <NewsCard key={article.url} article={article} />
            ))}
        </div>
    )
}
