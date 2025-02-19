import { AuthProvider } from '@prisma/client'

export type OAuthUserData = {
  email: string
  name: string | null
  providerId: string
  accessToken: string
  tokenType: string | null
  scope: string | null
  idToken: string
  provider: AuthProvider
}

export type OAuthTokenResponse = {
  access_token: string
  token_type: string
  scope: string
  id_token: string
}
