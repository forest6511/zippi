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
