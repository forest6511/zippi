import { Link } from '@remix-run/react'
import { categories, type CategoryKey } from '~/data/mock/categories'

type CategoryMenuProps = {
  country?: string
  region?: string
}

export function CategoryMenu({ country, region }: CategoryMenuProps) {
  return (
    <nav className="hidden md:block md:w-40">
      <ul className="space-y-1 sticky top-20">
        {(Object.entries(categories) as [CategoryKey, (typeof categories)[CategoryKey]][]).map(
          ([key, category]) => (
            <li key={key}>
              <Link
                to={`/${country}/${region}/${key}`}
                className="flex items-center p-1 rounded-lg hover:bg-gray-100 transition-colors text-sm"
              >
                <category.icon className="mr-2" style={{ color: category.color }} />
                <span>{category.name}</span>
              </Link>
            </li>
          )
        )}
      </ul>
    </nav>
  )
}
