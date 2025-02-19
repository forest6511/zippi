// app/routes/logout.tsx
import type { ActionFunctionArgs } from '@remix-run/node'
import { logout } from '~/.server/auth/services/auth.server'

export async function action({ request }: ActionFunctionArgs) {
  return await logout(request)
}