import crypto from 'crypto'

export function createOAuthState(): string {
  return crypto.randomUUID()
}

// LINEユーザー情報を取得
export async function getLineUserInfo(accessToken: string, idToken: string) {
  // プロファイル情報を取得
  const profileResponse = await fetch('https://api.line.me/v2/profile', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!profileResponse.ok) throw new Error('ユーザー情報の取得に失敗しました')
  const profile = await profileResponse.json()

  // IDトークンをデコードしてemailを取得
  const [, payload] = idToken.split('.')
  const decodedPayload = JSON.parse(Buffer.from(payload, 'base64').toString())

  console.log('getLineUserInfo', profile)
  console.log('getLineUserInfo', decodedPayload.email)

  return {
    ...profile,
    email: decodedPayload.email
  }
}

// LINEアクセストークンを取得
export async function getLineAccessToken(code: string, redirectUri: string) {
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