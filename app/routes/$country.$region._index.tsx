import { useParams, Link } from '@remix-run/react'
import { Header } from '~/components/header'
import { CategoryMenu } from '~/components/category-menu'
import { categories, type CategoryKey } from '~/data/mock/categories'
import { countries, posts } from '~/data/mock'
import { Breadcrumbs } from '~/components/common/breadcrumbs'
import { Button } from '~/components/ui/button'

export default function RegionPage() {
  const { country, region } = useParams<{
    country: string
    region: string
  }>()

  const countryName = country && countries[country] ? countries[country].name : country
  const regionName = (country && region && countries[country]?.regions[region]) || region

  return (
    <div className="min-h-screen bg-background">
      <Header categories={categories} country={country} region={region} />
      <main className="container mx-auto p-4 md:p-6 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-8 md:gap-4">
          <CategoryMenu country={country} region={region} />

          {/* メインコンテンツ */}
          <div className="md:w-4/5">
            <Breadcrumbs
              items={[
                { label: 'ホーム', href: '/' },
                { label: countryName, href: `/${country}` },
                { label: regionName },
              ]}
            />
            <h1 className="text-3xl font-bold mb-6">{regionName}掲示板</h1>

            {/* カテゴリー別記事一覧 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-4">
              {(Object.entries(categories) as [CategoryKey, (typeof categories)[CategoryKey]][])
                .slice(0, 6)
                .map(([categoryKey, category]) => {
                  const categoryPosts = posts
                    .filter((post) => post.category === categoryKey)
                    .slice(0, 5)

                  return (
                    <div key={categoryKey} className="bg-white rounded-lg p-6 border">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold flex items-center">
                          <category.icon className="mr-2" style={{ color: category.color }} />
                          {category.name}
                        </h2>
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          style={{
                            backgroundColor: category.color,
                            borderColor: category.color,
                            color: 'white',
                          }}
                          className="hover:opacity-80 transition-opacity"
                        >
                          <Link to={`/${country}/${region}/${categoryKey}/new`}>新規投稿</Link>
                        </Button>
                      </div>
                      <div className="space-y-4">
                        {categoryPosts.map((post) => (
                          <article key={post.id} className="border-b pb-4 last:border-b-0">
                            <Link
                              to={`/${country}/${region}/${categoryKey}/${post.id}`}
                              className="block hover:text-primary"
                            >
                              <h3 className="font-medium mb-2">{post.title}</h3>
                              <div className="text-sm text-muted-foreground">
                                <span>閲覧数: {post.views}</span>
                                <span className="mx-2">•</span>
                                <span>返信: {post.replyCount ?? 0}</span>
                                <span className="mx-2">•</span>
                                <span>投稿: {post.date}</span>
                              </div>
                            </Link>
                          </article>
                        ))}
                      </div>
                      <div className="mt-4">
                        <Link
                          to={`/${country}/${region}/${categoryKey}`}
                          className="block w-full py-2 text-center border rounded hover:bg-muted transition-colors"
                        >
                          もっと見る
                        </Link>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
