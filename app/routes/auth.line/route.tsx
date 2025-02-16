import type { ActionFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { getSession, commitSession } from '@/.server/session'
import { createOAuthState } from './oauth-utils'

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'))
  const state = createOAuthState()
  session.set('oauthState', state)

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.LINE_CLIENT_ID!,
    redirect_uri: `${process.env.APP_URL}/auth/line/callback`,
    state: state,
    scope: 'profile openid email',
  })

  return redirect(`https://access.line.me/oauth2/v2.1/authorize?${params}`, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  })
}