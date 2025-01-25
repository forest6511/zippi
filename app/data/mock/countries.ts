export type Country = {
  name: string
  regions: {
    [key: string]: string
  }
}

export type Countries = {
  [key: string]: Country
}

export const countries: Countries = {
  usa: {
    name: 'アメリカ',
    regions: {
      losangeles: 'ロサンジェルス',
      newyork: 'ニューヨーク',
    },
  },
  france: {
    name: 'フランス',
    regions: {
      paris: 'パリ',
    },
  },
}
