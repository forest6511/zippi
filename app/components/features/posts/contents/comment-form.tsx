import { Form } from '@remix-run/react'

export function CommentForm() {
  return (
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
        <p className="text-sm text-gray-500">
          ※コメントを投稿するにはログインが必要です
        </p>
      </Form>
    </div>
  )
}
