import { z } from 'zod'

export const signupSchema = z
  .object({
    name: z.string().trim().min(1, '名前は必須です').max(50, '名前は50文字以内で入力してください'),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, 'メールアドレスは必須です')
      .email('有効なメールアドレスを入力してください'),
    password: z
      .string()
      .min(8, 'パスワードは8文字以上で入力してください')
      .max(100, 'パスワードは100文字以内で入力してください')
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&].*$/,
        'パスワードは英字と数字を含む必要があります'
      ),
    passwordConfirm: z.string().min(1, 'パスワード（確認）は必須です'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'パスワードが一致しません',
    path: ['passwordConfirm'], // エラーを特定のフィールドに関連付ける
  })

export type SignupInput = z.infer<typeof signupSchema>
