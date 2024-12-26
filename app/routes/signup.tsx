import { Form, useActionData } from '@remix-run/react'
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
import { FcGoogle } from 'react-icons/fc'
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'

import { signup } from '~/.server/auth/service'
import { getSession, commitSession } from '~/.server/session'

type ActionData = { error: string } | undefined

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'))

  try {
    const formData = await request.formData()

    console.log('Start route.tsx action.')
    const user = await signup(formData)

    session.set('userId', user.id)
    session.set('email', user.email)
    session.set('name', user?.name ?? '')
    session.set('role', user.role)
    session.set('lastLoginAt', new Date().toISOString())

    return redirect('/', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    })
  } catch (error) {
    console.log('Start route.tsx action error', error)
    return {
      error: error instanceof Error ? error.message : 'アカウント作成に失敗しました',
    }
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  console.log('Start route.tsx loader.')
  const session = await getSession(request.headers.get('Cookie'))

  if (session.has('userId')) {
    return redirect('/')
  }

  return null
}

export default function Signup() {
  // actionから返されたデータを取得
  // error: actionから返されたエラーメッセージ
  const actionData = useActionData<ActionData>()

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>サインアップ</CardTitle>
          <CardDescription>新しいアカウントを作成してください</CardDescription>
        </CardHeader>
        <CardContent>
          <Form method="post" className="space-y-4">
            {/* エラーメッセージが存在する場合のみ表示 */}
            {actionData?.error && <div className="text-red-500 text-sm">{actionData.error}</div>}
            <div className="space-y-2">
              <Label htmlFor="name">名前</Label>
              <Input id="name" name="name" type="text" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">パスワード</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passwordConfirm">パスワード（確認）</Label>
              <Input id="passwordConfirm" name="passwordConfirm" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              アカウント作成
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
            <Button
              variant="outline"
              type="submit"
              className="w-full mt-4 flex items-center justify-center"
              name="provider"
              value="google"
            >
              <FcGoogle className="mr-2 h-4 w-4" />
              Googleでサインアップ
            </Button>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <a href="/login" className="text-sm text-blue-600 hover:underline">
            既にアカウントをお持ちの方はこちら
          </a>
        </CardFooter>
      </Card>
    </div>
  )
}
