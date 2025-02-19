import { AuthProvider } from '@prisma/client'
import { findOrCreateOAuthUser } from '../oauth-db.server'
import type { OAuthTokenResponse } from '../../types/oauth'

export async function getGoogleAccessToken(
  code: string,
  redirectUri: string
): Promise<OAuthTokenResponse> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
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

export async function getGoogleUserInfo(accessToken: string) {
  const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!response.ok) throw new Error('ユーザー情報の取得に失敗しました')
  return response.json()
}

export function findOrCreateGoogleUser(userData: {
  email: string
  name: string | null
  providerId: string
  accessToken: string
  tokenType: string | null
  scope: string | null
  idToken: string
}) {
  return findOrCreateOAuthUser({
    email: userData.email,
    name: userData.name,
    providerId: userData.providerId,
    accessToken: userData.accessToken,
    tokenType: userData.tokenType,
    scope: userData.scope,
    idToken: userData.idToken,
    provider: AuthProvider.GOOGLE,
  })
}
