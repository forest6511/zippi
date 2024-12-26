import crypto from 'crypto'

export function createOAuthState(): string {
  return crypto.randomUUID()
}

// コールバック後にGoogleユーザー情報を取得
export async function getGoogleUserInfo(accessToken: string) {
  const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!response.ok) throw new Error('ユーザー情報の取得に失敗しました')
  return response.json()
}

// コールバック後にGoogleアクセストークンを取得
export async function getGoogleAccessToken(code: string, redirectUri: string) {
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
