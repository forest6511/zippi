import { createSessionStorage } from "@remix-run/node";
import { client } from "./redis.server";

// セッション関連の定数定義
const COOKIE_NAME = "_remix-session";
const REDIS_SESSION_PREFIX = `${COOKIE_NAME}:`;
const SESSION_EXPIRY = process.env.SESSION_EXPIRY ?
    parseInt(process.env.SESSION_EXPIRY) : 60; // デフォルト1分
const SESSION_SECRET = process.env.SESSION_SECRET || "s3cr3t";

// セッションデータの型定義
type SessionData = {
    userId: string;
    email: string;
    name: string;
    role: string;
    lastLoginAt: string;
};

type SessionFlashData = {
    error: string;
    success?: string;
};

// Redisを使用したセッションストレージを作成
// https://remix.run/docs/en/main/utils/sessions#createsessionstorage
const { getSession, commitSession, destroySession } = createSessionStorage<SessionData, SessionFlashData>({
    cookie: {
        name: COOKIE_NAME,
        httpOnly: true,
        maxAge: SESSION_EXPIRY,  // Cookieの有効期限をRedisと合わせる
        path: "/",
        sameSite: "lax",
        secrets: [SESSION_SECRET],
        secure: process.env.NODE_ENV === "production",
    },
    // セッションデータの作成
    async createData(data) {
        try {
            const id = crypto.randomUUID();
            console.log(`Creating session: ${REDIS_SESSION_PREFIX}${id}`);
            await client.set(
                `${REDIS_SESSION_PREFIX}${id}`,
                JSON.stringify(data),
                { EX: SESSION_EXPIRY }
            );
            console.log('Session data:', data);
            return id;
        } catch (e) {
            console.error('Failed to create session:', e);
            throw new Error('Session creation failed');
        }
    },
    // セッションデータの読み取り
    async readData(id) {
        try {
            console.log(`Reading session: ${REDIS_SESSION_PREFIX}${id}`);
            const data = await client.get(`${REDIS_SESSION_PREFIX}${id}`);
            if (!data) {
                console.log('No session data found');
                return null;
            }
            const parsed = JSON.parse(data) as SessionData;
            console.log('Retrieved session data:', parsed);
            return parsed;
        } catch (e) {
            console.error('Failed to read session:', e);
            return null;
        }
    },
    // セッションデータの更新
    async updateData(id, data) {
        try {
            console.log(`Updating session: ${REDIS_SESSION_PREFIX}${id}`);
            console.log('New data:', data);
            await client.set(
                `${REDIS_SESSION_PREFIX}${id}`,
                JSON.stringify(data),
                { EX: SESSION_EXPIRY }
            );
        } catch (e) {
            console.error('Failed to update session:', e);
            throw new Error('Session update failed');
        }
    },
    // セッションデータの削除
    async deleteData(id) {
        try {
            console.log(`Deleting session: ${REDIS_SESSION_PREFIX}${id}`);
            await client.del(`${REDIS_SESSION_PREFIX}${id}`);
            console.log('Session deleted successfully');
        } catch (e) {
            console.error('Failed to delete session:', e);
        }
    },
});

export { getSession, commitSession, destroySession };