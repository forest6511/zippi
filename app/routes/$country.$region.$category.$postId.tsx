import { useParams, useLoaderData } from '@remix-run/react'
import { json, type LoaderFunction, type ActionFunction, redirect } from '@remix-run/node'
import { Header } from '~/components/common/header'
import { CategoryMenu } from '~/components/category-menu'
import { PostContent } from '~/components/features/posts/contents/post-content'
import { CommentForm } from '~/components/features/posts/contents/comment-form'
import { CommentList } from '~/components/features/posts/contents/comment-list'
import { categories, type CategoryKey } from '~/data/mock/categories'
import { countries, posts, type Post, type Reply } from '~/data/mock'
import { Breadcrumbs } from '~/components/common/breadcrumbs'
import { requireAuth } from '~/.server/auth/services/auth.server'

function isCategoryKey(key: string): key is CategoryKey {
  return Object.keys(categories).includes(key)
}

type LoaderData = {
  post: Post | null
}

export const loader: LoaderFunction = async ({ params }) => {
  const { postId } = params
  console.log(params)
  const post = posts.find((p) => p.id === Number(postId)) || null
  return json<LoaderData>({ post })
}

export const action: ActionFunction = async ({ request, params }) => {
  // 認証チェック
  try {
    await requireAuth(request)
  } catch (error) {
    // リダイレクト先として現在のURLを設定
    throw redirect(`/login?redirectTo=${encodeURIComponent(request.url)}`)
  }

  const formData = await request.formData()
  const content = formData.get('content') as string
  const postId = Number(params.postId)

  if (!content) {
    return json({ error: 'コメントを入力してください。' }, { status: 400 })
  }

  const newReply: Reply = {
    id: Date.now(),
    author: '匿名',
    content,
    date: new Date().toISOString().split('T')[0],
  }

  const postIndex = posts.findIndex((p) => p.id === postId)
  if (postIndex !== -1 && posts[postIndex].replies) {
    posts[postIndex].replies.push(newReply)
    posts[postIndex].replyCount = (posts[postIndex].replyCount || 0) + 1
  }

  return json({ success: true })
}

export default function PostPage() {
  const { country, region, category } = useParams<{
    country: string
    region: string
    category: string
  }>()
  const { post } = useLoaderData<LoaderData>()

  const countryName = country && countries[country] ? countries[country].name : country
  const regionName = (country && region && countries[country]?.regions[region]) || region
  const categoryName = category && isCategoryKey(category) ? categories[category].name : category

  if (!post) {
    return <div>記事が見つかりません。</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <Header categories={categories} country={country} region={region} />
      <main className="container mx-auto p-4 md:p-6 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-8 md:gap-4">
          <CategoryMenu country={country} region={region} />

          <div className="md:w-full">
            <Breadcrumbs
              items={[
                { label: 'ホーム', href: '/' },
                { label: countryName, href: `/${country}` },
                { label: regionName, href: `/${country}/${region}` },
                { label: categoryName, href: `/${country}/${region}/${category}` },
                { label: post.title },
              ]}
            />

            <PostContent post={post} />

            {post.replies && (
              <div className="space-y-8">
                <CommentForm />
                <CommentList replies={post.replies} replyCount={post.replyCount || 0} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
