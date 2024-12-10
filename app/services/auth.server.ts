import { redirect } from "@remix-run/node";
import {destroySession, getSession} from "./session.server";

// https://remix.run/docs/en/main/utils/sessions
export async function requireUser(request: Request) {
    console.log("auth.server.ts requireUser start")
    // Cookieヘッダーを取得して渡す
    const session = await getSession(request.headers.get("Cookie"));
    const userId = session.get("userId");
    console.log("auth.server.ts requireUser userId", userId);
    if (!userId) {
        throw redirect("/login");
    }
    return userId;
}

export async function logout(request: Request) {
    console.log("auth.server.ts logout");

    const session = await getSession(request.headers.get("Cookie"));

    console.log("-------- auth.server.ts logout Cookie ----------");
    console.log("Cookie", session.data);
    console.log("-------- auth.server.ts logout Cookie ----------");
    return redirect("/login", {
        headers: {
            "Set-Cookie": await destroySession(session),
        },
    });
}