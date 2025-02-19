import { Button } from '~/components/ui/button'
import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '~/components/ui/sheet'
import { Form, Link } from '@remix-run/react'
import type { Category } from '~/data/mock/categories'
import { useRouteLoaderData } from 'react-router'

type HeaderProps = {
  categories: Record<string, Category>
  country: string | undefined
  region: string | undefined
}

export function Header({ categories, country, region }: HeaderProps) {
  const data = useRouteLoaderData('root') as {
    user: { userId: string | null; name: string | null }
  }
  const user = data?.user

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl flex h-14 items-center px-4">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold text-xl">掲示板</span>
        </Link>
        {country && region && (
          <>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="md:hidden" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">メニューを開く</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4">
                  {Object.entries(categories).map(([key, category]) => (
                    <Link
                      key={key}
                      to={`/${country}/${region}/${key}`}
                      className="flex items-center px-2 py-1 text-lg hover:text-primary"
                    >
                      <category.icon className="mr-2" style={{ color: category.color }} />
                      {category.name}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            <div className="flex flex-1 items-center justify-end space-x-2">
              {user?.userId ? (
                <Form action="/logout" method="post">
                  <Button type="submit" variant="outline">
                    ログアウト
                  </Button>
                </Form>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-medium">
                    ログイン
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium"
                  >
                    新規登録
                  </Link>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  )
}
