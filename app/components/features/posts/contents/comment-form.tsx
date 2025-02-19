import { Form, Link } from '@remix-run/react'
import { useRouteLoaderData } from 'react-router'
import { Button } from '~/components/ui'


type RootLoaderData = {
  user: {
    userId: string | null
    name: string | null
  }
}

export function CommentForm() {
  const data = useRouteLoaderData('root') as RootLoaderData | null
  const isLoggedIn = !!data?.user?.userId

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">コメントを投稿</h2>
      {isLoggedIn ? (
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
            />
          </div>
          <Button type="submit">
            コメントを投稿
          </Button>
        </Form>
      ) : (
        <div className="text-center">
          <p className="text-gray-500 mb-4">
            コメントを投稿するにはログインが必要です
          </p>
          <Link
            to={`/login?redirectTo=${window.location.pathname}`}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ログインする
          </Link>
        </div>
      )}
    </div>
  )
}