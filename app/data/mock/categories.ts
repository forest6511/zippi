import {
  FaComments,
  FaNewspaper,
  FaQuestionCircle,
  FaBriefcase,
  FaLaptopCode,
  FaUtensils,
  FaHome,
  FaHeartbeat,
  FaPaw,
} from 'react-icons/fa'
import { IoMdHelpCircle } from 'react-icons/io'
import type { IconType } from 'react-icons'

export type CategoryKey =
  | 'free_talk'
  | 'local_news'
  | 'troubles'
  | 'qa'
  | 'work'
  | 'it_tech'
  | 'food'
  | 'housing'
  | 'lifestyle'
  | 'pets'

export type Category = {
  name: string
  icon: IconType
  color: string
}

export const categories: Record<CategoryKey, Category> = {
  free_talk: { name: 'フリートーク', icon: FaComments, color: '#4299E1' },
  local_news: { name: 'ローカルニュース', icon: FaNewspaper, color: '#48BB78' },
  troubles: { name: 'お悩み・相談', icon: IoMdHelpCircle, color: '#ED8936' },
  qa: { name: '質問・回答', icon: FaQuestionCircle, color: '#9F7AEA' },
  work: { name: '働く', icon: FaBriefcase, color: '#F56565' },
  it_tech: { name: 'IT・テクノロジー', icon: FaLaptopCode, color: '#38B2AC' },
  food: { name: '食・グルメ', icon: FaUtensils, color: '#ED64A6' },
  housing: { name: '住まい', icon: FaHome, color: '#ECC94B' },
  lifestyle: { name: '生活', icon: FaHeartbeat, color: '#667EEA' },
  pets: { name: 'ペット・動物', icon: FaPaw, color: '#975A16' },
}
