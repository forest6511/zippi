import { createSessionStorage, Session } from '@remix-run/node'
import { initializeRedisClient } from '@/.server/session/redis'

// セッション関連の定数定義
const COOKIE_NAME = '_remix-session'
const REDIS_SESSION_PREFIX = `${COOKIE_NAME}:`
// TODO: デフォルト60秒
// テスト用: Redisから指定秒を超えると、自動的にsession情報が削除されること.
// ex: _remix-session:2a7ead9f-765a-49f5-9aa2-6ad66c9e4329
const SESSION_EXPIRY = process.env.SESSION_EXPIRY ? parseInt(process.env.SESSION_EXPIRY) : 60
const SESSION_SECRET = process.env.SESSION_SECRET || 's3cr3t'

// セッションデータの型定義
export type SessionData = {
  userId: string
  email: string
  name: string
  role: string
  lastLoginAt: string
}

export type SessionFlashData = {
  error: string
  success?: string
}

// セッションストレージの作成と初期化を行う関数
async function createRedisSessionStorage() {
  const client = await initializeRedisClient()

  return createSessionStorage<SessionData, SessionFlashData>({
    cookie: {
      name: COOKIE_NAME,
      httpOnly: true,
      maxAge: SESSION_EXPIRY,
      path: '/',
      sameSite: 'lax',
      secrets: [SESSION_SECRET],
      secure: process.env.NODE_ENV === 'production',
    },
    async createData(data) {
      try {
        const id = crypto.randomUUID()
        console.log(`Creating session: ${REDIS_SESSION_PREFIX}${id}`)
        await client.set(`${REDIS_SESSION_PREFIX}${id}`, JSON.stringify(data), {
          EX: SESSION_EXPIRY,
        })
        console.log('Session data:', data)
        return id
      } catch (e) {
        console.error('Failed to create session:', e)
        throw new Error('Session creation failed')
      }
    },
    async readData(id) {
      try {
        console.log(`Reading session: ${REDIS_SESSION_PREFIX}${id}`)
        const data = await client.get(`${REDIS_SESSION_PREFIX}${id}`)
        if (!data) {
          console.log('No session data found')
          return null
        }
        const parsed = JSON.parse(data) as SessionData
        console.log('Retrieved session data:', parsed)
        return parsed
      } catch (e) {
        console.error('Failed to read session:', e)
        return null
      }
    },
    async updateData(id, data) {
      try {
        console.log(`Updating session: ${REDIS_SESSION_PREFIX}${id}`)
        console.log('New data:', data)
        await client.set(`${REDIS_SESSION_PREFIX}${id}`, JSON.stringify(data), {
          EX: SESSION_EXPIRY,
        })
      } catch (e) {
        console.error('Failed to update session:', e)
        throw new Error('Session update failed')
      }
    },
    async deleteData(id) {
      try {
        console.log(`Deleting session: ${REDIS_SESSION_PREFIX}${id}`)
        await client.del(`${REDIS_SESSION_PREFIX}${id}`)
        console.log('Session deleted successfully')
      } catch (e) {
        console.error('Failed to delete session:', e)
      }
    },
  })
}

// セッションストレージのインスタンスを初期化
let sessionStorage: Awaited<ReturnType<typeof createRedisSessionStorage>>

async function initializeSessionStorage() {
  if (!sessionStorage) {
    console.log('Initialize Session Storage')
    sessionStorage = await createRedisSessionStorage()
  }
  return sessionStorage
}

// セッション関連の関数をエクスポート
export async function getSession(cookieHeader: string | null) {
  const storage = await initializeSessionStorage()
  return storage.getSession(cookieHeader)
}

export async function commitSession(session: Session<SessionData, SessionFlashData>) {
  const storage = await initializeSessionStorage()
  return storage.commitSession(session)
}

export async function destroySession(session: Session<SessionData, SessionFlashData>) {
  const storage = await initializeSessionStorage()
  return storage.destroySession(session)
}
