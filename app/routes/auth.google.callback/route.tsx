import type { LoaderFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { AuthError } from '@/.server/util/errors'
import { getSession, commitSession } from '@/.server/session'
import { getGoogleAccessToken, getGoogleUserInfo } from '@/routes/auth.google/oauth-utils'
import { findOrCreateUser } from './user-service'

export async function loader({ request }: LoaderFunctionArgs) {
  console.log('auth.google loader request', request)
  console.log('auth.google loader url', request.url)
  console.log('auth.google loader Header', request.headers)
  console.log('auth.google loader Cookie', request.headers.get('Cookie'))

  const session = await getSession(request.headers.get('Cookie'))
  // コールバックURLからcode, stateを取得
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const savedState = session.get('oauthState')

  console.log('callback code', code)
  console.log('callback state', state)

  if (!state || !savedState || state !== savedState) {
    throw new AuthError('不正なリクエストです')
  }

  if (!code) {
    throw new AuthError('認証コードが取得できませんでした')
  }

  try {
    const tokenData = await getGoogleAccessToken(
      code,
      `${process.env.APP_URL}/auth/google/callback`
    )

    const userData = await getGoogleUserInfo(tokenData.access_token)

    const user = await findOrCreateUser({
      email: userData.email,
      name: userData.name,
      providerId: userData.id,
      accessToken: tokenData.access_token,
      tokenType: tokenData.token_type,
      scope: tokenData.scope,
      idToken: tokenData.id_token,
    })

    session.set('userId', user.id)
    session.set('email', user.email)
    session.set('name', user.name ?? '')
    session.set('role', user.role)
    session.set('lastLoginAt', new Date().toISOString())
    session.unset('oauthState')

    return redirect('/', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    })
  } catch (error) {
    console.error('Google認証エラー:', error)
    throw new AuthError('Google認証に失敗しました')
  }
}
