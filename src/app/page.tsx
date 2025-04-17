import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchTopHeadlines } from "@/lib/news-api"
import NewsCard from "@/components/news-card"
import FeaturedArticle from "@/components/featured-article"
import CategorySection from "@/components/category-section"
import TrendingSection from "@/components/trending-section"
import EnvCheck from "@/components/env-check"

export default async function Home() {
  const topHeadlines = await fetchTopHeadlines()
  const featuredArticle = topHeadlines[0]
  const latestNews = topHeadlines.slice(1, 5)

  return (
    <div className="container py-6 space-y-8">
      <EnvCheck />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Today&apos;s Highlights</h2>
          <Link href="/top-stories">
            <Button variant="ghost">View all</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Suspense fallback={<Skeleton className="h-[500px] w-full rounded-xl" />}>
              {featuredArticle ? (
                <FeaturedArticle article={featuredArticle} />
              ) : (
                <div className="h-[500px] w-full rounded-xl flex items-center justify-center bg-muted">
                  <p className="text-muted-foreground">No featured articles available</p>
                </div>
              )}
            </Suspense>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Latest News</h3>
            <div className="space-y-4">
              {latestNews.length > 0 ? (
                latestNews.map((article) => (
                  <Suspense key={article.url} fallback={<Skeleton className="h-24 w-full" />}>
                    <NewsCard article={article} variant="compact" />
                  </Suspense>
                ))
              ) : (
                <div className="text-muted-foreground">No latest news available</div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Tabs defaultValue="world" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="world">World</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="technology">Technology</TabsTrigger>
            <TabsTrigger value="science">Science</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
          </TabsList>
          <Link href="/categories">
            <Button variant="ghost">All categories</Button>
          </Link>
        </div>

        <TabsContent value="world" className="space-y-4">
          <Suspense
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-[300px] w-full rounded-xl" />
                ))}
              </div>
            }
          >
            <CategorySection category="world" />
          </Suspense>
        </TabsContent>

        <TabsContent value="business" className="space-y-4">
          <Suspense
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-[300px] w-full rounded-xl" />
                ))}
              </div>
            }
          >
            <CategorySection category="business" />
          </Suspense>
        </TabsContent>

        <TabsContent value="technology" className="space-y-4">
          <Suspense
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-[300px] w-full rounded-xl" />
                ))}
              </div>
            }
          >
            <CategorySection category="technology" />
          </Suspense>
        </TabsContent>

        <TabsContent value="science" className="space-y-4">
          <Suspense
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-[300px] w-full rounded-xl" />
                ))}
              </div>
            }
          >
            <CategorySection category="science" />
          </Suspense>
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <Suspense
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-[300px] w-full rounded-xl" />
                ))}
              </div>
            }
          >
            <CategorySection category="health" />
          </Suspense>
        </TabsContent>
      </Tabs>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Trending Topics</h2>
          <Link href="/trending">
            <Button variant="ghost">View all</Button>
          </Link>
        </div>

        <Suspense fallback={<Skeleton className="h-[400px] w-full rounded-xl" />}>
          <TrendingSection />
        </Suspense>
      </section>
    </div>
  )
}
