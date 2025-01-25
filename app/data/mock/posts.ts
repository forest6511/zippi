import type { CategoryKey } from './categories'

export type Post = {
  id: number
  title: string
  content: string
  views: number
  replies: number
  category: CategoryKey
  date: string
  thumbnail?: string
}

export const posts: Post[] = [
  // フリートーク
  {
    id: 1,
    title: '週末のおすすめイベント',
    content:
      '今週末、ロサンゼルスで開催される日本文化フェスティバルをご紹介します。伝統的な和太鼓演奏や茶道体験、寿司作り教室など、様々な日本文化を体験できるイベントです。家族や友人と一緒に参加して、日本の魅力を再発見しましょう。',
    views: 176,
    replies: 9,
    category: 'free_talk',
    date: '2024/01/14',
  },
  {
    id: 2,
    title: 'おすすめの日本食材店',
    content:
      'ロサンゼルスでおすすめの日本食材店をご紹介します。新鮮な魚介類や野菜、調味料など、日本の味が恋しくなった時にぜひ訪れてみてください。',
    views: 145,
    replies: 7,
    category: 'free_talk',
    date: '2024/01/15',
  },
  {
    id: 3,
    title: '現地の日本人コミュニティ',
    content:
      'ロサンゼルスの日本人コミュニティについてご紹介します。様々なイベントや交流会が開催されており、現地の日本人と交流する絶好の機会です。',
    views: 210,
    replies: 15,
    category: 'free_talk',
    date: '2024/01/16',
  },
  {
    id: 4,
    title: '日本語で楽しめる趣味の会',
    content:
      'ロサンゼルスで日本語で楽しめる趣味の会をご紹介します。書道、俳句、茶道など、様々な趣味の会がありますので、興味のある方はぜひ参加してみてください。',
    views: 132,
    replies: 6,
    category: 'free_talk',
    date: '2024/01/17',
  },
  {
    id: 5,
    title: 'おすすめの日本語書店',
    content:
      'ロサンゼルスでおすすめの日本語書店をご紹介します。最新の書籍から定番の書籍まで、幅広いジャンルの日本語書籍を取り揃えています。',
    views: 189,
    replies: 11,
    category: 'free_talk',
    date: '2024/01/18',
  },

  // ローカルニュース
  {
    id: 6,
    title: 'ロサンゼルスの観光スポット情報',
    content:
      'ロサンゼルスの観光スポット情報をまとめてみました。ハリウッドサイン、ディズニーランド、ユニバーサルスタジオなど、定番の観光スポットから穴場スポットまでご紹介します。',
    views: 302,
    replies: 20,
    category: 'local_news',
    date: '2024/01/20',
    thumbnail: 'https://placehold.jp/150x150.png',
  },
  {
    id: 7,
    title: '地域の日本人向けイベント',
    content: 'ロサンゼルス近郊で開催される日本人向けのイベント情報をまとめてみました。',
    views: 256,
    replies: 18,
    category: 'local_news',
    date: '2024/01/21',
    thumbnail: 'https://placehold.jp/150x150.png',
  },
  {
    id: 8,
    title: '新しい日本食レストランのオープン情報',
    content:
      'ロサンゼルスに新しい日本食レストランがオープンしました！こだわりのラーメンや寿司、天ぷらなど、本格的な日本料理が楽しめます。',
    views: 289,
    replies: 22,
    category: 'local_news',
    date: '2024/01/22',
    thumbnail: 'https://placehold.jp/150x150.png',
  },
  {
    id: 9,
    title: '地域の交通情報アップデート',
    content:
      'ロサンゼルスの交通情報に関するアップデートです。最新の道路状況や交通規制情報などをまとめています。',
    views: 198,
    replies: 12,
    category: 'local_news',
    date: '2024/01/23',
    thumbnail: 'https://placehold.jp/150x150.png',
  },
  {
    id: 10,
    title: '地域のお祭り情報',
    content:
      'ロサンゼルス近郊で開催されるお祭り情報をまとめてみました。日本の伝統的なお祭りから現地のユニークなイベントまで、様々な催しをご紹介します。',
    views: 275,
    replies: 19,
    category: 'local_news',
    date: '2024/01/24',
    thumbnail: 'https://placehold.jp/150x150.png',
  },

  // お悩み・相談
  {
    id: 11,
    title: 'ホームシックの対処法',
    content:
      'ホームシックになった時の対処法について、経験者からのアドバイスなどをまとめてみました。',
    views: 198,
    replies: 14,
    category: 'troubles',
    date: '2024/01/16',
  },
  {
    id: 12,
    title: '言語の壁を乗り越える方法',
    content: '海外で生活する上で、言語の壁にぶつかった時の対処法についてご紹介します。',
    views: 234,
    replies: 17,
    category: 'troubles',
    date: '2024/01/17',
  },
  {
    id: 13,
    title: '文化の違いへの適応について',
    content: '異文化への適応について、様々な視点から解説しています。',
    views: 187,
    replies: 13,
    category: 'troubles',
    date: '2024/01/18',
  },
  {
    id: 14,
    title: '長期滞在のストレス解消法',
    content: '長期滞在によるストレスを解消するための方法についてご紹介します。',
    views: 156,
    replies: 9,
    category: 'troubles',
    date: '2024/01/19',
  },
  {
    id: 15,
    title: '現地の友人を作る方法',
    content: '現地の友人を作るためのヒントやコツをご紹介します。',
    views: 209,
    replies: 16,
    category: 'troubles',
    date: '2024/01/20',
  },

  // その他のカテゴリーの投稿データ...
]
