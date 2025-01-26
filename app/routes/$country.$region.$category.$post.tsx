import { useParams, Link, useLoaderData, Form } from "@remix-run/react"
import { json, type LoaderFunction, type ActionFunction } from "@remix-run/node"
import { ClientOnly } from "remix-utils/client-only"
import { Header } from "~/components/header"
import { CategoryMenu } from "~/components/category-menu"
import { ImageGallery } from "~/components/image-gallery"
import { categories, type CategoryKey } from "~/data/mock/categories"
import { countries, posts, type Post, type Reply } from "~/data/mock"

function isCategoryKey(key: string): key is CategoryKey {
  return Object.keys(categories).includes(key)
}

type LoaderData = {
  post: Post | null
}

export const loader: LoaderFunction = async ({ params }) => {
  const { post: postId } = params
  const post = posts.find((p) => p.id === Number(postId)) || null

  return json<LoaderData>({ post })
}

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData()
  const content = formData.get("content") as string
  const postId = Number(params.post)

  if (!content) {
    return json({ error: "コメントを入力してください。" }, { status: 400 })
  }

  const newReply: Reply = {
    id: Date.now(),
    author: "匿名",
    content,
    date: new Date().toISOString().split("T")[0],
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
            <div className="mb-4">
              <Link to="/" className="text-blue-600 hover:underline">
                ホーム
              </Link>
              {" > "}
              <Link to={`/${country}`} className="text-blue-600 hover:underline">
                {countryName}
              </Link>
              {" > "}
              <Link to={`/${country}/${region}`} className="text-blue-600 hover:underline">
                {regionName}
              </Link>
              {" > "}
              <Link to={`/${country}/${region}/${category}`} className="text-blue-600 hover:underline">
                {categoryName}
              </Link>
              {" > "}
              <span>{post.title}</span>
            </div>

            <article className="bg-white shadow-md rounded-lg p-6 mb-8">
              <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
              <div className="text-sm text-gray-500 mb-4">
                投稿日: {post.date} | 閲覧数: {post.views}
                {post.replyCount !== undefined && ` | コメント数: ${post.replyCount}`}
              </div>

              <ClientOnly fallback={<div>画像を読み込み中...</div>}>
                {() => post.images && post.images.length > 0 && <ImageGallery images={post.images} />}
              </ClientOnly>

              <div className="prose max-w-none">
                <p>{post.content}</p>
              </div>
            </article>

            {post.replies && (
              <div className="space-y-8">
                <div className="bg-white shadow-md rounded-lg p-6">
                  <h2 className="text-2xl font-bold mb-4">コメントを投稿</h2>
                  <Form method="post" className="space-y-4">
                    <div>
                      <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                        コメント
                      </label>
                      <textarea
                        id="content"
                        name="content"
                        rows={4}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      コメントを投稿
                    </button>
                  </Form>
                </div>

                <div className="bg-white shadow-md rounded-lg p-6">
                  <h2 className="text-2xl font-bold mb-4">コメント ({post.replyCount || 0})</h2>
                  {post.replies.length > 0 ? (
                    <ul className="space-y-4">
                      {post.replies.map((reply) => (
                        <li key={reply.id} className="border-b pb-4 last:border-b-0">
                          <div className="flex justify-between items-start">
                            <span className="font-semibold">{reply.author}</span>
                            <span className="text-sm text-gray-500">{reply.date}</span>
                          </div>
                          <p className="mt-2">{reply.content}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>まだコメントはありません。</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

