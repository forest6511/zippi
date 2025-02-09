import type { Reply } from "~/data/mock"

interface CommentListProps {
  replies: Reply[]
  replyCount: number
}

export function CommentList({ replies, replyCount }: CommentListProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">コメント ({replyCount || 0})</h2>
      {replies.length > 0 ? (
        <ul className="space-y-4">
          {replies.map((reply) => (
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
  )
}

