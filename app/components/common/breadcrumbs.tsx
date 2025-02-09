import { Link } from '@remix-run/react'

type BreadcrumbItem = {
  label: string | undefined
  href?: string
}

type BreadcrumbsProps = {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <div className="mb-4">
      {items.map((item, index) => (
        <span key={index}>
          {index > 0 && ' > '}
          {item.href ? (
            <Link to={item.href} className="text-blue-600 hover:underline">
              {item.label}
            </Link>
          ) : (
            <span>{item.label}</span>
          )}
        </span>
      ))}
    </div>
  )
}
