export interface SalesScriptFormData {
  niche: string
  targetAudience: string
  offer: string
  pricePoint: string
  salesChannel: string
  tone: string
  desiredOutcome: string
  mainPainPoints: string
  uniqueMechanism: string
}

export type StreamingSection =
  | 'executive_summary'
  | 'script_1'
  | 'script_2'
  | 'script_3'
  | 'script_4'
  | 'script_5'
  | 'objection_matrix'
  | 'conversion_optimizations'

export interface StreamingState {
  currentSection: StreamingSection | null
  executiveSummary: string
  scripts: Partial<Record<StreamingSection, string>>
  objectionMatrix: string
  conversionOptimizations: string
  isComplete: boolean
  error: string | null
}
