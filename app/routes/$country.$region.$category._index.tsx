import { useParams, useLoaderData, Outlet } from '@remix-run/react'
import { json, type LoaderFunction } from '@remix-run/node'
import { Header } from '~/components/header'
import { CategoryMenu } from '~/components/category-menu'
import { PostListItem } from '~/components/post-list-item'
import { PostListItemWithThumbnail } from '~/components/post-list-item-with-thumbnail'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '~/components/ui/pagination'
import { categories, type CategoryKey } from '~/data/mock/categories'
import { countries, posts, type Post } from '~/data/mock'
import { Breadcrumbs } from '~/components/common/breadcrumbs'

function isCategoryKey(key: string): key is CategoryKey {
  return Object.keys(categories).includes(key)
}

const POSTS_PER_PAGE = 20

type LoaderData = {
  posts: Post[]
  totalPages: number
  currentPage: number
}

export const loader: LoaderFunction = async ({ params }) => {
  const { category } = params
  const filteredPosts = posts.filter((post) => post.category === category)
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)

  return json<LoaderData>({
    posts: filteredPosts.slice(0, POSTS_PER_PAGE),
    totalPages,
    currentPage: 1,
  })
}

const categoriesWithThumbnails = ['local_news', 'food', 'housing']

export default function CategoryPage() {
  const { country, region, category, postId } = useParams<{
    country: string
    region: string
    category: string
    postId?: string
  }>()
  const { posts, totalPages, currentPage } = useLoaderData<LoaderData>()

  // newページへのアクセスの場合はOutletを返す
  const pathname = window.location.pathname
  if (pathname.endsWith('/new') || postId) {
    return <Outlet />
  }

  const countryName = country && countries[country] ? countries[country].name : country
  const regionName = (country && region && countries[country]?.regions[region]) || region
  const categoryName = category && isCategoryKey(category) ? categories[category].name : category
  const categoryData = category && isCategoryKey(category) ? categories[category] : null

  const showThumbnails = categoriesWithThumbnails.includes(category || '')

  return (
    <div className="min-h-screen bg-background">
      <Header categories={categories} country={country} region={region} />
      <main className="container mx-auto p-4 md:p-6 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-8 md:gap-4">
          <CategoryMenu country={country} region={region} />

          {/* メインコンテンツ */}
          <div className="md:w-full">
            <Breadcrumbs
              items={[
                { label: 'ホーム', href: '/' },
                { label: countryName, href: `/${country}` },
                { label: regionName, href: `/${country}/${region}` },
                { label: categoryName },
              ]}
            />
            <h1 className="text-3xl font-bold mb-6 flex items-center">
              {categoryData && (
                <categoryData.icon className="mr-2" style={{ color: categoryData.color }} />
              )}
              {categoryName}
            </h1>

            <div className="grid grid-cols-1">
              {posts.map((post: Post) =>
                showThumbnails ? (
                  <PostListItemWithThumbnail
                    key={post.id}
                    post={post}
                    country={country || ''}
                    region={region || ''}
                    category={category || ''}
                    linkTo={`/${country}/${region}/${category}/${post.id}`}
                  />
                ) : (
                  <PostListItem
                    key={post.id}
                    post={post}
                    country={country || ''}
                    region={region || ''}
                    category={category || ''}
                    linkTo={`/${country}/${region}/${category}/${post.id}`}
                  />
                )
              )}
            </div>

            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, i) => {
                      const pageNumber = i + 1
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={i}>
                            <PaginationLink href="#" isActive={currentPage === pageNumber}>
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      } else if (
                        (pageNumber === currentPage - 2 && currentPage > 3) ||
                        (pageNumber === currentPage + 2 && currentPage < totalPages - 2)
                      ) {
                        return (
                          <PaginationItem key={i}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )
                      }
                      return null
                    })}
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
