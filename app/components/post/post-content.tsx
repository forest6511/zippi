import { ClientOnly } from "remix-utils/client-only"
import { ImageGallery } from "~/components/image-gallery"
import { MessageCircle } from "lucide-react"
import type { Post } from "~/data/mock"

interface PostContentProps {
  post: Post
}

export function PostContent({ post }: PostContentProps) {
  return (
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

      {post.images && post.images.length > 0 && (
        <div className="mt-6">
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <MessageCircle className="mr-2 h-5 w-5" />
            メッセージを送る
          </button>
        </div>
      )}
    </article>
  )
}