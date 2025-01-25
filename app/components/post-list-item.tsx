import { Link } from '@remix-run/react'
import type { Post } from '~/data/mock/posts'

type PostListItemProps = {
  post: Post
  country: string
  region: string
  category: string
}

export function PostListItem({ post, country, region, category }: PostListItemProps) {
  return (
    <div className="bg-white p-4 border-t border-b">
      <Link
        to={`/${country}/${region}/${category}/${post.id}`}
        className="block hover:text-primary"
      >
        <h2 className="text-xl font-bold mb-2">{post.title}</h2>
        <p className="text-sm text-gray-600 mt-2">
          {post.content && post.content.length > 100
            ? post.content.slice(0, 100) + '...'
            : post.content}
        </p>
        <div className="text-sm text-muted-foreground mt-2">
          <span>投稿: {post.date}</span>
          <span className="mx-2">•</span>
          <span>閲覧数: {post.views}</span>
          <span className="mx-2">•</span>
          <span>返信: {post.replies}</span>
        </div>
      </Link>
    </div>
  )
}
