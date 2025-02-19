import type { LoaderFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { AuthError } from '@/.server/util/errors'
import { getSession, commitSession } from '@/.server/session'
import {
  getLineAccessToken,
  getLineUserInfo,
  findOrCreateLineUser,
} from '@/.server/auth/services/providers/line.server'

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
    const tokenData = await getLineAccessToken(code, `${process.env.APP_URL}/auth/line/callback`)
    const userData = await getLineUserInfo(tokenData.access_token, tokenData.id_token)

    const user = await findOrCreateLineUser({
      userId: userData.userId,
      name: userData.displayName,
      email: userData.email, // emailを追加
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
    return redirect(savedRedirectTo || '/', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    })
  } catch (error) {
    console.error('LINE認証エラー:', error)
    throw new AuthError('LINE認証に失敗しました')
  }
}
