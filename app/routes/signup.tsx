import { Form } from "@remix-run/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FcGoogle } from 'react-icons/fc'

export default function Signup() {
  return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>サインアップ</CardTitle>
            <CardDescription>新しいアカウントを作成してください</CardDescription>
          </CardHeader>
          <CardContent>
            <Form method="post" className="space-y-4">
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
              <Button type="submit" className="w-full">
                アカウント作成
              </Button>
            </Form>
            <div className="mt-4 relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">
                または
              </span>
              </div>
            </div>
            <Form action="/auth/google" method="post">
              <Button
                  variant="outline"
                  type="submit"
                  className="w-full mt-4 flex items-center justify-center"
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