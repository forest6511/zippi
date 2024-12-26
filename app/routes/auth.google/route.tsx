import type { ActionFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { getSession, commitSession } from '@/.server/session'
import { createOAuthState } from './oauth-utils'

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'))

  console.log('auth.google session', session)

  // コールバック前後に同じIDが検証用
  const state = createOAuthState()
  session.set('oauthState', state)

  // OAuth2.0認証用のパラメータを設定
  // https://developers.google.com/identity/protocols/oauth2/web-server?hl=ja#node.js_3
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: `${process.env.APP_URL}/auth/google/callback`,
    response_type: 'code',
    scope: 'openid email profile',
    state: state,
  })

  // Google認証画面へリダイレクト
  return redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  })
}
