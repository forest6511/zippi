import {createCookieSessionStorage} from "@remix-run/node";

type SessionData = {
    userId: string;
};

type SessionFlashData = {
    error: string;
    success?: string;
};

// セッションストレージの作成
// https://remix.run/docs/en/main/utils/sessions
const { getSession, commitSession, destroySession } =
    createCookieSessionStorage<SessionData, SessionFlashData>({
        cookie: {
            name: "_session", // クッキー名
            httpOnly: true,   // JavaScriptからアクセス不可
            maxAge: 60 * 60 * 24 * 7, // 1週間
            path: "/",
            sameSite: "lax",
            secrets: ["s3cr3t"], // 本番環境では環境変数から取得すべき
            secure: process.env.NODE_ENV === "production",
        },
    });

export { getSession, commitSession, destroySession };