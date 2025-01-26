import type { CategoryKey } from "./categories"

export type Reply = {
  id: number
  author: string
  content: string
  date: string
}

export type Post = {
  id: number
  title: string
  content: string
  views: number
  replyCount?: number
  category: CategoryKey
  date: string
  thumbnail?: string
  images?: {
    url: string
    description: string
  }[]
  replies?: Reply[]
}

export const posts: Post[] = [
  // フリートーク
  {
    id: 1,
    title: "週末のおすすめイベント",
    content:
      "今週末、ロサンゼルスで開催される日本文化フェスティバルをご紹介します。伝統的な和太鼓演奏や茶道体験、寿司作り教室など、様々な日本文化を体験できるイベントです。家族や友人と一緒に参加して、日本の魅力を再発見しましょう。",
    views: 176,
    replyCount: 9,
    category: "free_talk",
    date: "2024/01/14",
    replies: [
      {
        id: 1,
        author: "たろう",
        content: "このイベント、とても楽しみです！家族で参加する予定です。",
        date: "2024/01/15",
      },
      {
        id: 2,
        author: "はなこ",
        content: "和太鼓演奏が特に気になります。チケットはどこで購入できますか？",
        date: "2024/01/16",
      },
    ],
  },
  {
    id: 2,
    title: "おすすめの日本食材店",
    content:
      "ロサンゼルスでおすすめの日本食材店をご紹介します。新鮮な魚介類や野菜、調味料など、日本の味が恋しくなった時にぜひ訪れてみてください。",
    views: 145,
    replyCount: 7,
    category: "free_talk",
    date: "2024/01/15",
    replies: [
      {
        id: 3,
        author: "ゆうこ",
        content: "日本食材店の情報、ありがとうございます！早速行ってみます。",
        date: "2024/01/16",
      },
    ],
  },
  // ローカルニュース
  {
    id: 6,
    title: "ロサンゼルスの観光スポット情報",
    content:
      "ロサンゼルスの観光スポット情報をまとめてみました。ハリウッドサイン、ディズニーランド、ユニバーサルスタジオなど、定番の観光スポットから穴場スポットまでご紹介します。",
    views: 302,
    category: "local_news",
    date: "2024/01/20",
    thumbnail: "https://placehold.jp/150x150.png?text=LA_Overview",
    images: [
      {
        url: "https://placehold.jp/800x600.png?text=Hollywood_Sign",
        description: "ハリウッドの丘の上に立つ象徴的な看板",
      },
      {
        url: "https://placehold.jp/800x600.png?text=Disneyland",
        description: "夢と魔法の王国、ディズニーランド",
      },
      {
        url: "https://placehold.jp/800x600.png?text=Universal_Studios",
        description: "映画の世界を体験できるユニバーサルスタジオ",
      },
      {
        url: "https://placehold.jp/800x600.png?text=Santa_Monica_Pier",
        description: "サンタモニカピアの観覧車と美しい海岸線",
      },
      {
        url: "https://placehold.jp/800x600.png?text=Griffith_Observatory",
        description: "グリフィス天文台からのロサンゼルスの街並み",
      },
    ],
  },
  // その他のカテゴリーの投稿データ...
]