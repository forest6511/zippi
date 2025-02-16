import { prisma } from '@/.server/db/client'
import { AuthProvider, UserRole } from '@prisma/client'

export async function findOrCreateLineUser(userData: {
  userId: string
  name: string | null
  email: string
  accessToken: string
  tokenType: string | null
  scope: string | null
  idToken: string | null
}) {
  const authProvider = AuthProvider.LINE
  const userRole = UserRole.USER

  const existingUser = await prisma.user.findFirst({
    where: {
      providerId: userData.userId,
      provider: authProvider
    },
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
          providerAccountId: userData.userId,
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
      email: userData.email,
      name: userData.name,
      provider: authProvider,
      providerId: userData.userId,
      role: userRole,
      active: true,
      accounts: {
        create: {
          type: 'oauth',
          provider: authProvider,
          providerAccountId: userData.userId,
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