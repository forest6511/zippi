import { Link } from '@remix-run/react'
import type { Post } from '~/data/mock/posts'

type PostListItemWithThumbnailProps = {
  post: Post
  country: string
  region: string
  category: string
}

export function PostListItemWithThumbnail({
  post,
  country,
  region,
  category,
}: PostListItemWithThumbnailProps) {
  return (
    <div className="bg-white p-4 border-t border-b flex">
      <div className="flex-shrink-0 mr-4">
        <img
          src={post.thumbnail || 'https://placehold.jp/150x150.png'}
          alt=""
          className="w-[80px] h-[80px] object-cover"
        />
      </div>
      <div className="flex-grow">
        <Link
          to={`/${country}/${region}/${category}/${post.id}`}
          className="block hover:text-primary"
        >
          <h2 className="text-xl font-bold mb-2">{post.title}</h2>
          <p className="text-sm text-gray-600 mt-2">
            {post.content && post.content.length > 80
              ? post.content.slice(0, 80) + '...'
              : post.content}
          </p>
          <div className="text-sm text-muted-foreground mt-2">
            <span>投稿: {post.date}</span>
            <span className="mx-2">•</span>
            <span>閲覧数: {post.views}</span>
            {post.replyCount !== undefined && (
              <>
                <span className="mx-2">•</span>
                <span>返信: {post.replyCount}</span>
              </>
            )}
          </div>
        </Link>
      </div>
    </div>
  )
}
