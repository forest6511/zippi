import { useParams } from '@remix-run/react'
import { json, redirect, type ActionFunction, LoaderFunctionArgs } from '@remix-run/node'
import { Header } from '~/components/common/header'
import { CategoryMenu } from '~/components/category-menu'
import { categories, type CategoryKey } from '~/data/mock/categories'
import { countries, posts } from '~/data/mock'
import { Breadcrumbs } from '~/components/common/breadcrumbs'
import { JobPostingForm } from '~/components/features/posts/forms/job-posting-form'
import { requireAuth } from '~/.server/auth/services/auth.server'

function isCategoryKey(key: string): key is CategoryKey {
  return Object.keys(categories).includes(key)
}

type ActionData = {
  errors?: {
    title?: string
    content?: string
  }
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await requireAuth(request)

  const { country, region, category } = params
  if (!country || !region || !category || !isCategoryKey(category)) {
    throw new Response('Not Found', { status: 404 })
  }

  console.log(JSON.stringify(user))
  return json({ user })
}

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData()
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const { country, region, category } = params

  const errors: ActionData['errors'] = {}
  if (!title) errors.title = 'タイトルは必須です'
  if (!content) errors.content = '本文は必須です'

  if (Object.keys(errors).length) {
    return json<ActionData>({ errors })
  }

  const newPost = {
    id: posts.length + 1,
    title,
    content,
    author: '匿名',
    date: new Date().toISOString().split('T')[0],
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
                { label: 'ホーム', href: '/' },
                { label: countryName, href: `/${country}` },
                { label: regionName, href: `/${country}/${region}` },
                { label: categoryName, href: `/${country}/${region}/${category}` },
                { label: '新規投稿' },
              ]}
            />

            <h1 className="text-3xl font-bold mb-6 flex items-center">
              {categoryData && (
                <categoryData.icon className="mr-2" style={{ color: categoryData.color }} />
              )}
              {categoryName}に新規投稿
            </h1>

            <JobPostingForm />
          </div>
        </div>
      </main>
    </div>
  )
}
