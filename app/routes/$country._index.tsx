import { useParams, Link } from '@remix-run/react'
import { CategoryMenu } from '~/components/category-menu'
import { categories } from '~/data/mock/categories'
import { countries } from '~/data/mock'
import { Breadcrumbs } from '~/components/common/breadcrumbs'
import { Header } from '~/components/header'

export default function CountryPage() {
  const { country } = useParams<{
    country: string
  }>()

  const countryName = country && countries[country] ? countries[country].name : country

  return (
    <div className="min-h-screen bg-background">
      <Header categories={categories} country={country} region={undefined} />
      <main className="container mx-auto p-4 md:p-6 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-8 md:gap-4">
          <CategoryMenu country={country} />

          {/* メインコンテンツ */}
          <div className="md:w-4/5">
            <Breadcrumbs items={[{ label: 'ホーム', href: '/' }, { label: countryName }]} />
            <h1 className="text-3xl font-bold mb-6">{countryName}掲示板</h1>

            {/* 地域一覧 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-4 mb-8">
              {country &&
                countries[country]?.regions &&
                Object.entries(countries[country].regions).map(([regionKey, regionName]) => (
                  <Link
                    key={regionKey}
                    to={`/${country}/${regionKey}`}
                    className="bg-white rounded-lg p-6 border hover:shadow-md transition-shadow"
                  >
                    <h2 className="text-xl font-bold mb-2">{regionName}</h2>
                    <p className="text-muted-foreground">この地域の掲示板を見る</p>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
