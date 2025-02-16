import { AuthProvider } from '@prisma/client'
import { findOrCreateOAuthUser } from '../oauth-db.server'
import type { OAuthTokenResponse } from '../../types/oauth'

export async function getLineAccessToken(
  code: string,
  redirectUri: string
): Promise<OAuthTokenResponse> {
  const response = await fetch('https://api.line.me/oauth2/v2.1/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.LINE_CLIENT_ID!,
      client_secret: process.env.LINE_CLIENT_SECRET!,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error_description || 'トークンの取得に失敗しました')
  }
  return data
}

export async function getLineUserInfo(accessToken: string, idToken: string) {
  const profileResponse = await fetch('https://api.line.me/v2/profile', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!profileResponse.ok) throw new Error('ユーザー情報の取得に失敗しました')

  const profile = await profileResponse.json()

  // id_tokenをデコードしてemailを取得
  const [, payload] = idToken.split('.')
  const decodedPayload = JSON.parse(Buffer.from(payload, 'base64').toString())

  return {
    ...profile,
    email: decodedPayload.email,
  }
}

export function findOrCreateLineUser(userData: {
  userId: string
  name: string | null
  email: string
  accessToken: string
  tokenType: string | null
  scope: string | null
  idToken: string | null
}) {
  return findOrCreateOAuthUser({
    email: userData.email,
    name: userData.name,
    providerId: userData.userId,
    accessToken: userData.accessToken,
    tokenType: userData.tokenType,
    scope: userData.scope,
    idToken: userData.idToken,
    provider: AuthProvider.LINE,
  })
}
