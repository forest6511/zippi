import { useParams, useActionData, Form, useNavigate, Outlet } from '@remix-run/react'
import { json, redirect, type ActionFunction, type LoaderFunction } from "@remix-run/node"
import { Header } from "~/components/header"
import { CategoryMenu } from "~/components/category-menu"
import { categories, type CategoryKey } from "~/data/mock/categories"
import { countries, posts } from "~/data/mock"
import { Breadcrumbs } from "~/components/common/breadcrumbs"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Label } from "~/components/ui/label"

function isCategoryKey(key: string): key is CategoryKey {
  return Object.keys(categories).includes(key)
}

type ActionData = {
  errors?: {
    title?: string
    content?: string
  }
}

export const loader: LoaderFunction = async ({ params }) => {
  console.log("test")
  const { country, region, category } = params
  if (!country || !region || !category || !isCategoryKey(category)) {
    throw new Response("Not Found", { status: 404 })
  }
  return json({})
}

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData()
  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const { country, region, category } = params

  const errors: ActionData["errors"] = {}
  if (!title) errors.title = "タイトルは必須です"
  if (!content) errors.content = "本文は必須です"

  if (Object.keys(errors).length) {
    return json<ActionData>({ errors })
  }

  const newPost = {
    id: posts.length + 1,
    title,
    content,
    author: "匿名",
    date: new Date().toISOString().split("T")[0],
    category: category as CategoryKey,
    views: 0,
    replyCount: 0,
    replies: [],
  }

  posts.push(newPost)

  return redirect(`/${country}/${region}/${category}/post/${newPost.id}`)
}

export default function NewPostPage() {
  const { country, region, category } = useParams<{
    country: string
    region: string
    category: string
  }>()
  const actionData = useActionData<ActionData>()
  const navigate = useNavigate()

  const countryName = country && countries[country] ? countries[country].name : country
  const regionName = (country && region && countries[country]?.regions[region]) || region
  const categoryName = category && isCategoryKey(category) ? categories[category].name : category
  const categoryData = category && isCategoryKey(category) ? categories[category] : null

  return (
    <div className="min-h-screen bg-background">
      <Header categories={categories} country={country} region={region} />
      <main className="container mx-auto p-4 md:p-6 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-8 md:gap-4">
          <CategoryMenu country={country} region={region} />

          <div className="md:w-full">
            <Breadcrumbs
              items={[
                { label: "ホーム", href: "/" },
                { label: countryName, href: `/${country}` },
                { label: regionName, href: `/${country}/${region}` },
                { label: categoryName, href: `/${country}/${region}/${category}` },
                { label: "新規投稿" },
              ]}
            />

            <h1 className="text-3xl font-bold mb-6 flex items-center">
              {categoryData && <categoryData.icon className="mr-2" style={{ color: categoryData.color }} />}
              {categoryName}に新規投稿
            </h1>

            <Form method="post" className="space-y-6">
              <div>
                <Label htmlFor="title">タイトル</Label>
                <Input
                  id="title"
                  name="title"
                  required
                  aria-invalid={actionData?.errors?.title ? true : undefined}
                  aria-describedby="title-error"
                />
                {actionData?.errors?.title && (
                  <p className="text-red-500 text-sm mt-1" id="title-error">
                    {actionData.errors.title}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="content">本文</Label>
                <Textarea
                  id="content"
                  name="content"
                  required
                  rows={10}
                  aria-invalid={actionData?.errors?.content ? true : undefined}
                  aria-describedby="content-error"
                />
                {actionData?.errors?.content && (
                  <p className="text-red-500 text-sm mt-1" id="content-error">
                    {actionData.errors.content}
                  </p>
                )}
              </div>

              <div className="flex justify-between">
                <Button type="submit">投稿する</Button>
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                  キャンセル
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </main>
    </div>
  )
}

