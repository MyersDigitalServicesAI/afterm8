'use client'

import { useState, useCallback } from 'react'
import { Zap, AlertCircle } from 'lucide-react'
import SalesScriptForm from '@/components/SalesScriptForm'
import ScriptOutput from '@/components/ScriptOutput'
import { StreamSectionParser } from '@/lib/parse-stream'
import type { SalesScriptFormData, StreamingState, StreamingSection } from '@/lib/types'

const INITIAL_STATE: StreamingState = {
  currentSection: null,
  executiveSummary: '',
  scripts: {},
  objectionMatrix: '',
  conversionOptimizations: '',
  isComplete: false,
  error: null,
}

export default function SalesScriptsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [state, setState] = useState<StreamingState>(INITIAL_STATE)
  const [hasGenerated, setHasGenerated] = useState(false)

  const handleSubmit = useCallback(async (formData: SalesScriptFormData) => {
    setIsLoading(true)
    setHasGenerated(true)
    setState(INITIAL_STATE)

    try {
      const res = await fetch('/api/sales-scripts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Request failed')
      }
      if (!res.body) throw new Error('No response body')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let lineBuffer = ''

      const parser = new StreamSectionParser((section, content, isDone) => {
        setState(prev => {
          const next: StreamingState = {
            ...prev,
            currentSection: isDone ? null : (section as StreamingSection),
          }
          if (section === 'executive_summary') {
            next.executiveSummary = content
          } else if (section.startsWith('script_')) {
            next.scripts = { ...prev.scripts, [section as StreamingSection]: content }
          } else if (section === 'objection_matrix') {
            next.objectionMatrix = content
          } else if (section === 'conversion_optimizations') {
            next.conversionOptimizations = content
            if (isDone) next.isComplete = true
          }
          return next
        })
      })

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        lineBuffer += decoder.decode(value, { stream: true })
        const lines = lineBuffer.split('\n')
        lineBuffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.trim()) continue
          try {
            const event = JSON.parse(line)
            if (event.type === 'delta') {
              parser.feed(event.text)
            } else if (event.type === 'done') {
              parser.flush()
              setState(prev => ({ ...prev, isComplete: true, currentSection: null }))
            } else if (event.type === 'error') {
              throw new Error(event.message)
            }
          } catch {
            // skip malformed lines
          }
        }
      }
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'An unexpected error occurred',
      }))
    } finally {
      setIsLoading(false)
    }
  }, [])

  return (
    <div className="min-h-screen bg-hero-gradient">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-surface-border bg-surface-card/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center shadow-brand-sm">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">afterm8</span>
            <span className="hidden sm:inline text-sm text-gray-500">/ Sales Scripts</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 bg-surface border border-surface-border rounded-full px-3 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Powered by Claude
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium mb-6">
            <Zap className="w-3.5 h-3.5" />
            Sales Scripts Generator
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            5 Precision Scripts.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-300">
              Zero Guesswork.
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Fill in your brief once. Get a complete sales intelligence package — buyer psychology, 5 unique scripts, objection handling, and conversion strategy.
          </p>
        </div>

        {/* Layout: centered form, then split after first generate */}
        <div className={`grid gap-8 ${hasGenerated ? 'lg:grid-cols-[420px_1fr]' : 'max-w-2xl mx-auto'}`}>
          {/* Form */}
          <div className="bg-surface-card border border-surface-border rounded-2xl p-6 sm:p-8 shadow-card h-fit">
            <div className="flex items-center gap-3 mb-7">
              <div className="w-1.5 h-6 bg-brand-gradient rounded-full" />
              <h2 className="text-lg font-semibold text-white">Your Sales Brief</h2>
            </div>
            <SalesScriptForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>

          {/* Output */}
          {hasGenerated && (
            <div>
              {state.error ? (
                <div className="bg-red-950/30 border border-red-500/30 rounded-2xl p-6 flex gap-4">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-300 font-medium mb-1">Generation Failed</p>
                    <p className="text-red-400/80 text-sm">{state.error}</p>
                  </div>
                </div>
              ) : (
                <ScriptOutput state={state} />
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
