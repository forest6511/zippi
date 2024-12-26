import { prisma } from '@/.server/db/client'
import { AuthProvider, UserRole } from '@prisma/client'

export async function findOrCreateUser(userData: {
  email: string
  name: string | null
  providerId: string
  accessToken: string
  tokenType: string | null
  scope: string | null
  idToken: string | null
}) {
  const authProvider = AuthProvider.GOOGLE
  const userRole = UserRole.USER

  console.log('findOrCreateUser userData', userData)

  const existingUser = await prisma.user.findUnique({
    where: { email: userData.email.toLowerCase() },
    include: {
      accounts: {
        where: { provider: authProvider },
      },
    },
  })

  if (existingUser) {
    if (existingUser.accounts.length === 0) {
      await prisma.account.create({
        data: {
          userId: existingUser.id,
          type: 'oauth',
          provider: authProvider,
          providerAccountId: userData.providerId,
          access_token: userData.accessToken,
          token_type: userData.tokenType,
          scope: userData.scope,
          id_token: userData.idToken,
        },
      })
    }
    return existingUser
  }

  return prisma.user.create({
    data: {
      email: userData.email.toLowerCase(),
      name: userData.name,
      provider: authProvider,
      providerId: userData.providerId,
      role: userRole,
      active: true,
      accounts: {
        create: {
          type: 'oauth',
          provider: authProvider,
          providerAccountId: userData.providerId,
          access_token: userData.accessToken,
          token_type: userData.tokenType,
          scope: userData.scope,
          id_token: userData.idToken,
          refresh_token: null,
          expires_at: null,
          session_state: null,
        },
      },
    },
    include: {
      accounts: true,
    },
  })
}
