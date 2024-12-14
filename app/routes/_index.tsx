import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { requireUser, logout } from "~/services/auth.server";
import { Button } from "~/components/ui/button";
import {getSession} from "~/services/session.server";

// ログアウト処理
export async function action({ request }: ActionFunctionArgs) {
  console.log("_index.tsx action", request);
  return logout(request);
}

// ログイン済みチェック
export const loader = async ({ request }: LoaderFunctionArgs) => {
  console.log("_index.tsx loader", request.url);
  await requireUser(request);

  // セッションからデータを取得して表示
  const session = await getSession(request.headers.get("Cookie"));
  console.log("Session Data:", {
    userId: session.get("userId"),
    email: session.get("email"),
    name: session.get("name"),
    role: session.get("role"),
    lastLoginAt: session.get("lastLoginAt")
  });

  return null;
};

export default function Index() {
  return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-16">
          <header className="flex flex-col items-center gap-9">
            <h1 className="text-2xl font-bold">ダッシュボード</h1>
          </header>
          <Form method="post">
            <Button type="submit" variant="outline">
              ログアウト
            </Button>
          </Form>
        </div>
      </div>
  );
}