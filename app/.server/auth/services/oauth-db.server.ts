import { prisma } from '@/.server/db/client'
import { UserRole } from '@prisma/client'
import type { OAuthUserData } from '../types/oauth'

export async function findOrCreateOAuthUser(userData: OAuthUserData) {
  const userRole = UserRole.USER

  const existingUserByEmail = userData.email
    ? await prisma.user.findUnique({
        where: { email: userData.email.toLowerCase() },
        include: {
          accounts: {
            where: { provider: userData.provider },
          },
        },
      })
    : null

  if (existingUserByEmail) {
    if (existingUserByEmail.accounts.length === 0) {
      await prisma.account.create({
        data: {
          userId: existingUserByEmail.id,
          type: 'oauth',
          provider: userData.provider,
          providerAccountId: userData.providerId,
          access_token: userData.accessToken,
          token_type: userData.tokenType,
          scope: userData.scope,
          id_token: userData.idToken,
        },
      })
    }
    return existingUserByEmail
  }

  return prisma.user.create({
    data: {
      email: userData.email,
      name: userData.name,
      provider: userData.provider,
      providerId: userData.providerId,
      role: userRole,
      active: true,
      accounts: {
        create: {
          type: 'oauth',
          provider: userData.provider,
          providerAccountId: userData.providerId,
          access_token: userData.accessToken,
          token_type: userData.tokenType,
          scope: userData.scope,
          id_token: userData.idToken,
        },
      },
    },
    include: {
      accounts: true,
    },
  })
}
