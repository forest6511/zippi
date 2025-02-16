import type { ActionFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { getSession, commitSession } from '@/.server/session'
import { createOAuthState, createOAuthParams } from '@/.server/auth/services/oauth.server'

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'))
  const state = createOAuthState()
  session.set('oauthState', state)

  const redirectUrl = createOAuthParams({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    redirectUri: `${process.env.APP_URL}/auth/google/callback`,
    state,
    scope: 'openid email profile',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  })

  return redirect(redirectUrl, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  })
}
