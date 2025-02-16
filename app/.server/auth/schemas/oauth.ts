import { z } from 'zod'

export const oauthUserSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().optional(),
  providerId: z.string(),
  accessToken: z.string(),
  tokenType: z.string().optional(),
  scope: z.string().optional(),
  idToken: z.string().optional(),
})

export type OAuthUserInput = z.infer<typeof oauthUserSchema>
