'use client'

import { useState } from 'react'
import { Zap, ChevronDown } from 'lucide-react'
import type { SalesScriptFormData } from '@/lib/types'

const SALES_CHANNELS = [
  'Phone / Cold Call',
  'Direct Message (DM)',
  'Email',
  'In-Person / Face-to-Face',
  'Video Call (Zoom, Teams)',
  'Social Media',
  'Webinar / Live Event',
  'Text / SMS',
]

const TONES = [
  'Professional & Authoritative',
  'Casual & Conversational',
  'Aggressive & Urgency-Driven',
  'Consultative & Empathetic',
  'Luxury & Exclusive',
  'Direct & No-Nonsense',
  'Warm & Relationship-Focused',
  'Challenger / Provocative',
]

const INITIAL: SalesScriptFormData = {
  niche: '',
  targetAudience: '',
  offer: '',
  pricePoint: '',
  salesChannel: '',
  tone: '',
  desiredOutcome: '',
  mainPainPoints: '',
  uniqueMechanism: '',
}

interface Props {
  onSubmit: (data: SalesScriptFormData) => void
  isLoading: boolean
}

export default function SalesScriptForm({ onSubmit, isLoading }: Props) {
  const [form, setForm] = useState<SalesScriptFormData>(INITIAL)

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const isValid = Object.values(form).every(v => v.trim().length > 0)

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(form) }} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field name="niche" label="Niche" value={form.niche} onChange={set}
          placeholder="e.g. B2B SaaS, Real Estate, Executive Coaching" />
        <Field name="targetAudience" label="Target Audience" value={form.targetAudience} onChange={set}
          placeholder="e.g. Founders doing $1M–$5M ARR looking to scale" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field name="offer" label="Offer" value={form.offer} onChange={set}
          placeholder="e.g. 6-month sales acceleration program with weekly coaching" />
        <Field name="pricePoint" label="Price Point" value={form.pricePoint} onChange={set}
          placeholder="e.g. $15,000 one-time or $2,500/month" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <SelectField name="salesChannel" label="Sales Channel" value={form.salesChannel}
          onChange={set} options={SALES_CHANNELS} placeholder="Select a channel..." />
        <SelectField name="tone" label="Tone" value={form.tone}
          onChange={set} options={TONES} placeholder="Select a tone..." />
      </div>

      <TextareaField name="desiredOutcome" label="Desired Outcome" value={form.desiredOutcome}
        onChange={set} placeholder="What transformation or result do you want the prospect to commit to?" rows={2} />

      <TextareaField name="mainPainPoints" label="Main Pain Points" value={form.mainPainPoints}
        onChange={set} placeholder="What keeps them up at night? What frustrations do they experience daily?" rows={3} />

      <TextareaField name="uniqueMechanism" label="Unique Mechanism" value={form.uniqueMechanism}
        onChange={set} placeholder="What proprietary method, framework, or approach makes your offer work differently?" rows={3} />

      <button
        type="submit"
        disabled={!isValid || isLoading}
        className={`w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg tracking-wide transition-all duration-300
          ${isValid && !isLoading
            ? 'bg-brand-gradient text-white shadow-brand-md hover:shadow-brand-lg hover:scale-[1.02] active:scale-[0.99]'
            : 'bg-surface-border text-gray-500 cursor-not-allowed'
          }`}
      >
        <Zap className={`w-5 h-5 ${isLoading ? 'animate-pulse' : ''}`} />
        {isLoading ? 'Generating Your Scripts...' : 'Generate Sales Scripts'}
      </button>
    </form>
  )
}

function Field({ label, name, value, onChange, placeholder }: {
  label: string; name: string; value: string
  onChange: React.ChangeEventHandler<HTMLInputElement>; placeholder: string
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-gray-400 tracking-wider uppercase">{label}</label>
      <input type="text" name={name} value={value} onChange={onChange} placeholder={placeholder}
        className="w-full px-4 py-3 rounded-lg bg-surface border border-surface-border text-gray-100 placeholder-gray-600
          focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200" />
    </div>
  )
}

function SelectField({ label, name, value, onChange, options, placeholder }: {
  label: string; name: string; value: string
  onChange: React.ChangeEventHandler<HTMLSelectElement>; options: string[]; placeholder: string
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-gray-400 tracking-wider uppercase">{label}</label>
      <div className="relative">
        <select name={name} value={value} onChange={onChange}
          className="w-full px-4 py-3 rounded-lg bg-surface border border-surface-border text-gray-100 appearance-none cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200">
          <option value="" disabled className="text-gray-600">{placeholder}</option>
          {options.map(o => <option key={o} value={o} className="bg-surface-card">{o}</option>)}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
      </div>
    </div>
  )
}

function TextareaField({ label, name, value, onChange, placeholder, rows }: {
  label: string; name: string; value: string
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>; placeholder: string; rows: number
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-gray-400 tracking-wider uppercase">{label}</label>
      <textarea name={name} value={value} onChange={onChange} placeholder={placeholder} rows={rows}
        className="w-full px-4 py-3 rounded-lg bg-surface border border-surface-border text-gray-100 placeholder-gray-600 resize-none
          focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200" />
    </div>
  )
}
