import type React from 'react'
import { Form } from '@remix-run/react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { Label } from '~/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Checkbox } from '~/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import {
  mockJobTypes,
  mockEmploymentTypes,
  mockVisaTypes,
  mockLanguageSkills,
} from '~/data/mock/form/job-posting'
import { ClientOnly } from 'remix-utils/client-only'
import { useState } from 'react'

interface FormSectionProps {
  title: string
  children: React.ReactNode
}

function FormSection({ title, children }: FormSectionProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="md:grid md:grid-cols-2 md:gap-6">{children}</CardContent>
    </Card>
  )
}

function ImageUpload() {
  const [previews, setPreviews] = useState<string[]>([])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newPreviews = Array.from(files).map((file) => URL.createObjectURL(file))
      setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews])
    }
  }

  return (
    <div>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
        <div className="space-y-1 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor="images"
              className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
            >
              <span>ファイルを選択</span>
              <input
                id="images"
                name="images"
                type="file"
                className="sr-only"
                multiple
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
            <p className="pl-1">またはドラッグ＆ドロップ</p>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
        </div>
      </div>
      {previews.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative">
              <img
                src={preview || '/placeholder.svg'}
                alt={`アップロード画像 ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function JobPostingForm() {
  return (
    <Form method="post" className="space-y-6 w-full mx-auto">
      <FormSection title="求人情報">
        <div className="space-y-6 md:space-y-4 md:col-span-2">
          <div className="space-y-3">
            <Label htmlFor="categoryTypeId" className="mb-2">
              タイプ <span className="text-red-500">*</span>
            </Label>
            <Select name="categoryTypeId" required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="タイプを選択してください" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">タイプを選択してください</SelectItem>
                {/* カテゴリタイプのオプションをここに追加 */}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="mb-2">職種（複数選択可）</Label>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
              {mockJobTypes.map((jobType) => (
                <div key={jobType.id} className="flex items-center space-x-3">
                  <Checkbox name="jobTypes" value={jobType.id} id={`jobType-${jobType.id}`} />
                  <Label htmlFor={`jobType-${jobType.id}`}>{jobType.name}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="languageSkill" className="mb-2">
              語学力
            </Label>
            <Select name="languageSkill">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="語学力を選択してください" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">語学力を選択してください</SelectItem>
                {mockLanguageSkills.map((skill) => (
                  <SelectItem key={skill.value} value={skill.value}>
                    {skill.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="mb-2">雇用形態</Label>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
              {mockEmploymentTypes.map((type) => (
                <div key={type.value} className="flex items-center space-x-3">
                  <Checkbox
                    name="employmentTypes"
                    value={type.value}
                    id={`employmentType-${type.value}`}
                  />
                  <Label htmlFor={`employmentType-${type.value}`}>{type.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="mb-2">ビザ</Label>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
              {mockVisaTypes.map((type) => (
                <div key={type.value} className="flex items-center space-x-3">
                  <Checkbox name="visaTypes" value={type.value} id={`visaType-${type.value}`} />
                  <Label htmlFor={`visaType-${type.value}`}>{type.label}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FormSection>

      <FormSection title="連絡先情報">
        <div className="space-y-6 md:space-y-4 md:col-span-2">
          <div className="space-y-3">
            <Label htmlFor="tel" className="mb-2">
              電話番号
            </Label>
            <Input type="tel" id="tel" name="tel" className="mt-1" />
          </div>

          <div className="space-y-3">
            <Label htmlFor="email" className="mb-2">
              メールアドレス
            </Label>
            <Input type="email" id="email" name="email" className="mt-1" />
          </div>

          <div className="space-y-3">
            <Label htmlFor="name" className="mb-2">
              担当者 <span className="text-red-500">*</span>
            </Label>
            <Input type="text" id="name" name="name" required className="mt-1" />
          </div>

          <div className="space-y-3">
            <Label htmlFor="companyName" className="mb-2">
              社名
            </Label>
            <Input type="text" id="companyName" name="companyName" className="mt-1" />
          </div>

          <div className="space-y-3">
            <Label htmlFor="url" className="mb-2">
              URL
            </Label>
            <Input type="url" id="url" name="url" className="mt-1" />
          </div>
        </div>
      </FormSection>

      <FormSection title="勤務地情報">
        <div className="space-y-6 md:space-y-4 md:col-span-2">
          <div className="space-y-3">
            <Label htmlFor="areaId" className="mb-2">
              エリア <span className="text-red-500">*</span>
            </Label>
            <Select name="areaId" required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="エリアを選択してください" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">エリアを選択してください</SelectItem>
                {/* エリアのオプションをここに追加 */}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label htmlFor="detailedAreaName" className="mb-2">
              詳細な地名 <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              id="detailedAreaName"
              name="detailedAreaName"
              required
              className="mt-1"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="stationId" className="mb-2">
              最寄駅
            </Label>
            <Select name="stationId">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="最寄駅を選択してください" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">最寄駅を選択してください</SelectItem>
                {/* 駅のオプションをここに追加 */}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="mb-2">住所と地図</Label>
            <RadioGroup name="showAddress" className="flex space-x-6">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="false" id="showAddressFalse" />
                <Label htmlFor="showAddressFalse">地図のみ表示する</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="true" id="showAddressTrue" />
                <Label htmlFor="showAddressTrue">住所と地図を表示する</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label htmlFor="address" className="mb-2">
              住所
            </Label>
            <Input type="text" id="address" name="address" className="mt-1" />
          </div>
        </div>
      </FormSection>

      <FormSection title="求人詳細">
        <div className="space-y-6 md:space-y-4 md:col-span-2">
          <div className="space-y-3">
            <Label htmlFor="title" className="mb-2">
              タイトル <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              id="title"
              name="title"
              required
              aria-describedby="title-error"
              className="mt-1"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="detail" className="mb-2">
              詳細 <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="detail"
              name="detail"
              required
              rows={10}
              aria-describedby="detail-error"
              className="mt-1"
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="画像をアップロード（複数可）">
        <div className="mb-6 md:col-span-2">
          <ClientOnly fallback={<div>画像アップロードの準備中...</div>}>
            {() => <ImageUpload />}
          </ClientOnly>
        </div>
      </FormSection>

      <div className="flex flex-col md:flex-row justify-between gap-4">
        <Button type="submit" className="w-full md:w-auto">
          投稿する
        </Button>
        <Button type="button" variant="outline" className="w-full md:w-auto">
          キャンセル
        </Button>
      </div>
    </Form>
  )
}
