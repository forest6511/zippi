import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { requireUser, logout } from '~/.server/auth/services/auth.server'
import { getSession } from '@/.server/session'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui'
import { Link } from '@remix-run/react'
import { countries } from '~/data/mock'

// ログアウト処理
export async function action({ request }: ActionFunctionArgs) {
  console.log('route.tsx action', request)
  return logout(request)
}

// ログイン済みチェック
export const loader = async ({ request }: LoaderFunctionArgs) => {
  console.log('route.tsx loader', request.url)
  await requireUser(request)

  // セッションからデータを取得して表示
  const session = await getSession(request.headers.get('Cookie'))
  console.log('Session Data:', {
    userId: session.get('userId'),
    email: session.get('email'),
    name: session.get('name'),
    role: session.get('role'),
    lastLoginAt: session.get('lastLoginAt'),
  })

  return null
}

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto p-4 md:p-6">
        <h1 className="text-3xl font-bold mb-6">掲示板</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(countries).map(([countryCode, country]) => (
            <Card key={countryCode}>
              <CardHeader>
                <CardTitle>{country.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {Object.entries(country.regions).map(([regionCode, region]) => (
                    <li key={regionCode}>
                      <Link
                        to={`/${countryCode}/${regionCode}`}
                        className="text-blue-600 hover:underline"
                      >
                        {region}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
