// app/routes/auth.google.callback/route.tsx
import type { LoaderFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { AuthError } from '@/.server/util/errors'
import { getSession, commitSession } from '@/.server/session'
import {
  getGoogleAccessToken,
  getGoogleUserInfo,
  findOrCreateGoogleUser,
} from '@/.server/auth/services/providers/google.server'

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'))
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const savedState = session.get('oauthState')

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

    const user = await findOrCreateGoogleUser({
      email: userData.email,
      name: userData.name,
      providerId: userData.id,
      accessToken: tokenData.access_token,
      tokenType: tokenData.token_type,
      scope: tokenData.scope,
      idToken: userData.idToken,
    })

    session.set('userId', user.id)
    session.set('email', user.email)
    session.set('name', user.name ?? '')
    session.set('role', user.role)
    session.set('lastLoginAt', new Date().toISOString())
    session.unset('oauthState')

    // 保存されていたリダイレクト先へ遷移
    const savedRedirectTo = session.get('redirectTo')
    console.log("savedRedirectTo",savedRedirectTo)
    return redirect(savedRedirectTo || '/', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    })
  } catch (error) {
    console.error('Google認証エラー:', error)
    throw new AuthError('Google認証に失敗しました')
  }
}
