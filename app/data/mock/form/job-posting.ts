export type JobType = {
  id: string
  name: string
}

export type EmploymentType = 'full_time' | 'part_time' | 'temporary'

export type VisaType = 'working_holiday' | 'student'

export type LanguageSkill = 'ignore' | 'very_easy' | 'easy' | 'normal' | 'hard' | 'very_hard'

// モックデータを追加
export const mockJobTypes: JobType[] = [
  { id: '01', name: 'シェフ・調理師' },
  { id: '02', name: '飲食店スタッフ' },
  { id: '03', name: 'ホテルスタッフ' },
  { id: '04', name: '販売員' },
  { id: '05', name: 'オフィスワーク' },
]

export const mockEmploymentTypes: { value: EmploymentType; label: string }[] = [
  { value: 'full_time', label: 'フルタイム' },
  { value: 'part_time', label: 'パートタイム' },
  { value: 'temporary', label: 'テンポラリー' },
]

export const mockVisaTypes: { value: VisaType; label: string }[] = [
  { value: 'working_holiday', label: 'YMS(旧ワーホリ)' },
  { value: 'student', label: '学生' },
]

export const mockLanguageSkills: { value: LanguageSkill; label: string }[] = [
  { value: 'ignore', label: '不問' },
  { value: 'very_easy', label: '簡単な意思の疎通ができる' },
  { value: 'easy', label: 'ある程度の意思の疎通ができる' },
  { value: 'normal', label: '仕事である程度使える' },
  { value: 'hard', label: '全般的に仕事で使える' },
  { value: 'very_hard', label: '高度に仕事で使える' },
]
