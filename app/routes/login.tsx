import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'

import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { Form, Link, useLoaderData } from '@remix-run/react'
import { getSession, commitSession } from '~/.server/session'

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'))

  console.log('login.tsx loader session', session.data.userId)

  if (session.has('userId')) {
    // すでにログインしている場合はホームにリダイレクト
    return redirect('/')
  }

  const data = { error: session.get('error') }

  return Response.json(data, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  })
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'))
  const form = await request.formData()
  const email = form.get('email')
  const password = form.get('password')

  // サーバー側のプロンプトに表示
  console.log('login.tsx action email', email)
  console.log('login.tsx action password', password)

  // 仮の実装 (認証OKとして画面遷移)
  if (email === 'test@example.com' && password === 'password') {
    // テスト用のセッション情報を設定
    const testUserData = {
      userId: '123',
      email: email as string,
      name: 'テストユーザー',
      role: 'user',
      lastLoginAt: new Date().toISOString(),
    }

    // セッションに情報を設定
    session.set('userId', testUserData.userId)
    session.set('email', testUserData.email)
    session.set('name', testUserData.name)
    session.set('role', testUserData.role)
    session.set('lastLoginAt', testUserData.lastLoginAt)

    // _index.tsxへ遷移
    return redirect('/', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    })
  }

  session.flash('error', 'メールアドレスまたはパスワードが正しくありません')
  return redirect('/login', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  })
}

export default function Login() {
  // loaderから返されたデータを取得
  // error: フラッシュメッセージとしてセッションに保存されたエラーメッセージ
  const { error } = useLoaderData<typeof loader>()

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>ログイン</CardTitle>
          <CardDescription>アカウントにログインしてください</CardDescription>
        </CardHeader>
        <CardContent>
          <Form method="post" className="space-y-4">
            {/* エラーメッセージが存在する場合のみ表示 */}
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">パスワード</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              ログイン
            </Button>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link to="/signup" className="text-sm text-blue-600 hover:underline">
            アカウントをお持ちでない方はこちら
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
