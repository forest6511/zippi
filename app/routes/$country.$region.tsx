import { useParams, Link, Outlet } from '@remix-run/react'
import { Header } from '~/components/ui'
import { CategoryMenu } from '~/components/category-menu'
import { categories, type CategoryKey } from '~/data/mock/categories'
import { countries, posts } from '~/data/mock'

export default function RegionPage() {
  const { country, region, category } = useParams<{
    country: string
    region: string
    category?: string
  }>()
  const countryName = country && countries[country] ? countries[country].name : country
  const regionName = (country && region && countries[country]?.regions[region]) || region
  if (category) {
    return <Outlet />
  }

  return (
    <div className="min-h-screen bg-background">
      <Header categories={categories} country={country} region={region} />
      <main className="container mx-auto p-4 md:p-6 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-8 md:gap-4">
          <CategoryMenu country={country} region={region} />

          {/* メインコンテンツ */}
          <div className="md:w-4/5">
            <div className="mb-4">
              <Link to="/" className="text-blue-600 hover:underline">
                ホーム
              </Link>
              {' > '}
              <Link to={`/${country}`} className="text-blue-600 hover:underline">
                {countryName}
              </Link>
              {' > '}
              <span>{regionName}</span>
            </div>
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
                      <h2 className="text-xl font-bold mb-4 flex items-center">
                        <category.icon className="mr-2" style={{ color: category.color }} />
                        {category.name}
                      </h2>
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
                                <span>返信: {post.replies}</span>
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
