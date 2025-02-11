import { Form } from '@remix-run/react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { Label } from '~/components/ui/label'
import { Select } from '~/components/ui/select'
import { Checkbox } from '~/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'
import {
  mockJobTypes,
  mockEmploymentTypes,
  mockVisaTypes,
  mockLanguageSkills,
} from '~/data/mock/form/job-posting'

export function JobPostingForm() {
  return (
    <Form method="post" className="space-y-6">
      <div>
        <Label htmlFor="categoryTypeId">タイプ</Label>
        <Select name="categoryTypeId" required>
          <option value="">タイプを選択してください</option>
          {/* カテゴリタイプのオプションをここに追加 */}
        </Select>
      </div>

      <div>
        <Label>職種（複数選択可）</Label>
        {mockJobTypes.map((jobType) => (
          <div key={jobType.id}>
            <Checkbox name="jobTypes" value={jobType.id} id={`jobType-${jobType.id}`} />
            <Label htmlFor={`jobType-${jobType.id}`}>{jobType.name}</Label>
          </div>
        ))}
      </div>

      <div>
        <Label htmlFor="languageSkill">語学力</Label>
        <Select name="languageSkill">
          {mockLanguageSkills.map((skill) => (
            <option key={skill.value} value={skill.value}>
              {skill.label}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label>雇用形態</Label>
        {mockEmploymentTypes.map((type) => (
          <div key={type.value}>
            <Checkbox
              name="employmentTypes"
              value={type.value}
              id={`employmentType-${type.value}`}
            />
            <Label htmlFor={`employmentType-${type.value}`}>{type.label}</Label>
          </div>
        ))}
      </div>

      <div>
        <Label>ビザ</Label>
        {mockVisaTypes.map((type) => (
          <div key={type.value}>
            <Checkbox name="visaTypes" value={type.value} id={`visaType-${type.value}`} />
            <Label htmlFor={`visaType-${type.value}`}>{type.label}</Label>
          </div>
        ))}
      </div>

      {/* 残りのフォーム要素は変更なし */}

      <div>
        <Label htmlFor="tel">電話番号</Label>
        <Input type="tel" id="tel" name="tel" />
      </div>

      <div>
        <Label htmlFor="email">メールアドレス</Label>
        <Input type="email" id="email" name="email" />
      </div>

      <div>
        <Label htmlFor="name">担当者</Label>
        <Input type="text" id="name" name="name" required />
      </div>

      <div>
        <Label htmlFor="companyName">社名</Label>
        <Input type="text" id="companyName" name="companyName" />
      </div>

      <div>
        <Label htmlFor="url">URL</Label>
        <Input type="url" id="url" name="url" />
      </div>

      <div>
        <Label htmlFor="areaId">エリア</Label>
        <Select name="areaId" required>
          <option value="">エリアを選択してください</option>
          {/* エリアのオプションをここに追加 */}
        </Select>
      </div>

      <div>
        <Label htmlFor="detailedAreaName">詳細な地名</Label>
        <Input type="text" id="detailedAreaName" name="detailedAreaName" required />
      </div>

      <div>
        <Label htmlFor="stationId">最寄駅</Label>
        <Select name="stationId">
          <option value="">最寄駅を選択してください</option>
          {/* 駅のオプションをここに追加 */}
        </Select>
      </div>

      <div>
        <Label>住所と地図</Label>
        <RadioGroup name="showAddress">
          <div>
            <RadioGroupItem value="false" id="showAddressFalse" />
            <Label htmlFor="showAddressFalse">地図のみ表示する</Label>
          </div>
          <div>
            <RadioGroupItem value="true" id="showAddressTrue" />
            <Label htmlFor="showAddressTrue">住所と地図を表示する</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label htmlFor="address">住所</Label>
        <Input type="text" id="address" name="address" />
      </div>

      <div>
        <Label htmlFor="title">タイトル</Label>
        <Input type="text" id="title" name="title" required aria-describedby="title-error" />
      </div>

      <div>
        <Label htmlFor="detail">詳細</Label>
        <Textarea id="detail" name="detail" required rows={10} aria-describedby="detail-error" />
      </div>

      <div className="flex justify-between">
        <Button type="submit">投稿する</Button>
        <Button type="button" variant="outline">
          キャンセル
        </Button>
      </div>
    </Form>
  )
}
