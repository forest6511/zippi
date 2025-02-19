// /app/.server/auth/services/auth.server.ts
import { redirect } from '@remix-run/node'
import { prisma } from '~/.server/db/client'
import { signupSchema } from '~/.server/auth/schemas/signup'
import bcrypt from 'bcryptjs'
import { AuthError } from '~/.server/util/errors'
import { getSession, destroySession } from '~/.server/session'
import { User } from '@prisma/client'
import { z } from 'zod'

// ref: auth
// https://zenn.dev/sc30gsw/articles/f908adb5579795
export async function signup(formData: FormData): Promise<User> {
  try {
    const rawInput = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      passwordConfirm: formData.get('passwordConfirm'),
    }

    const validatedData = signupSchema.parse(rawInput)

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      throw new AuthError('このメールアドレスは既に登録されています')
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10)

    return await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        name: validatedData.name,
        provider: 'EMAIL',
        role: 'USER',
      },
    })
  } catch (error) {
    // zodバリデーション
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0]
      throw new AuthError(firstError.message)
    }
    if (error instanceof AuthError) {
      throw error
    }
    // その他のエラー
    console.error('Signup error:', error)
    throw new AuthError('ユーザー登録に失敗しました')
  }
}

// https://remix.run/docs/en/main/utils/sessions
export async function requireAuth(request: Request, redirectTo?: string) {
  console.log('auth.server.ts requireAuth start')

  const session = await getSession(request.headers.get('Cookie'))
  const userId = session.get('userId')

  console.log('auth.server.ts requireAuth userId', userId)
  if (!userId) {
    // デフォルトでcurrent URLを使用、明示的な指定があればそちらを優先
    const loginRedirect = redirectTo || request.url
    throw redirect(`/login?redirectTo=${encodeURIComponent(loginRedirect)}`)
  }

  return {
    userId,
    email: session.get('email'),
    role: session.get('role')
  }
}

export async function logout(request: Request) {
  console.log('auth.server.ts logout')

  const session = await getSession(request.headers.get('Cookie'))

  console.log('-------- auth.server.ts logout Cookie ----------')
  console.log('Cookie', session.data)
  console.log('-------- auth.server.ts logout Cookie ----------')
  return redirect('/', {
    headers: {
      'Set-Cookie': await destroySession(session),
    },
  })
}
