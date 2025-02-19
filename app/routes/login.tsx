import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '~/components/ui'

type ActionData = { error: string } | undefined

import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { Form, Link, useActionData, useLoaderData } from '@remix-run/react'
import { getSession, commitSession } from '~/.server/session'
import { FcGoogle } from 'react-icons/fc'
import { SiLine } from 'react-icons/si'

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'))
  const url = new URL(request.url)
  const redirectTo = url.searchParams.get('redirectTo')

  console.log("-----------------login loader redirectTo------------", redirectTo)
  if (session.has('userId')) {
    return redirect(redirectTo || '/')
  }

  return json({ redirectTo })
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'))
  const form = await request.formData()
  const redirectTo = form.get('redirectTo') as string || '/'
  console.log("login action redirectTo", redirectTo)

  const email = form.get('email')
  const password = form.get('password')

  // サーバー側のプロンプトに表示
  console.log('route.tsx action email', email)
  console.log('route.tsx action password', password)

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

    return redirect(redirectTo, {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    })
  }
  // エラーの場合はオブジェクトをreturn
  return { error: 'メールアドレスまたはパスワードが正しくありません' }
}

export default function Login() {
  // actionから返されたデータを取得
  // error: actionから返されたエラーメッセージ
  const actionData = useActionData<ActionData>()
  const { redirectTo } = useLoaderData<typeof loader>()


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>ログイン</CardTitle>
          <CardDescription>アカウントにログインしてください</CardDescription>
        </CardHeader>
        <CardContent>
          <Form method="post" className="space-y-4">
            <input type="hidden" name="redirectTo" value={redirectTo || '/'} />
            {/* エラーメッセージが存在する場合のみ表示 */}
            {actionData?.error && <div className="text-red-500 text-sm">{actionData.error}</div>}
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
          <div className="mt-4 relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">または</span>
            </div>
          </div>
          <Form action={'/auth/google'} method="post">
            <input type="hidden" name="redirectTo" value={redirectTo || '/'} />
            <Button
              variant="outline"
              type="submit"
              className="w-full mt-4 flex items-center justify-center"
              name="provider"
              value="google"
            >
              <FcGoogle className="mr-2 h-4 w-4" />
              Googleでログイン
            </Button>
          </Form>
          <Form action={'/auth/line'} method="post">
            <input type="hidden" name="redirectTo" value={redirectTo || '/'} />
            <Button
              variant="outline"
              type="submit"
              className="w-full mt-2 flex items-center justify-center bg-[#00B900] text-white hover:bg-[#00B900]/90"
              name="provider"
              value="line"
            >
              <SiLine className="mr-2 h-4 w-4" />
              LINEでログイン
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
