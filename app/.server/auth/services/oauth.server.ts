import crypto from 'crypto'

export function createOAuthState(): string {
  return crypto.randomUUID()
}

export function createOAuthParams(options: {
  clientId: string
  redirectUri: string
  state: string
  scope: string
  authUrl: string
}) {
  const params = new URLSearchParams({
    client_id: options.clientId,
    redirect_uri: options.redirectUri,
    response_type: 'code',
    scope: options.scope,
    state: options.state,
  })

  return `${options.authUrl}?${params}`
}
