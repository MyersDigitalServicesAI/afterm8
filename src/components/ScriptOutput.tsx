'use client'

import { useState } from 'react'
import { Brain, Shield, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react'
import CopyButton from '@/components/ui/CopyButton'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import type { StreamingState, StreamingSection } from '@/lib/types'

const SCRIPT_META = [
  {
    id: 'script_1' as StreamingSection,
    label: 'Version 1',
    style: 'Consultative Authority Closer',
    gradient: 'from-blue-500/10 to-indigo-500/5',
    border: 'border-blue-500/25',
    badge: 'bg-blue-500/20 text-blue-300',
  },
  {
    id: 'script_2' as StreamingSection,
    label: 'Version 2',
    style: 'Emotional Storytelling Approach',
    gradient: 'from-purple-500/10 to-pink-500/5',
    border: 'border-purple-500/25',
    badge: 'bg-purple-500/20 text-purple-300',
  },
  {
    id: 'script_3' as StreamingSection,
    label: 'Version 3',
    style: 'ROI & Logic-Driven Approach',
    gradient: 'from-emerald-500/10 to-teal-500/5',
    border: 'border-emerald-500/25',
    badge: 'bg-emerald-500/20 text-emerald-300',
  },
  {
    id: 'script_4' as StreamingSection,
    label: 'Version 4',
    style: 'Challenger / Disruptive Style',
    gradient: 'from-orange-500/10 to-red-500/5',
    border: 'border-orange-500/25',
    badge: 'bg-orange-500/20 text-orange-300',
  },
  {
    id: 'script_5' as StreamingSection,
    label: 'Version 5',
    style: 'Luxury / High-Status Positioning',
    gradient: 'from-yellow-500/10 to-amber-500/5',
    border: 'border-yellow-500/25',
    badge: 'bg-yellow-500/20 text-yellow-300',
  },
]

export default function ScriptOutput({ state }: { state: StreamingState }) {
  const { currentSection, executiveSummary, scripts, objectionMatrix, conversionOptimizations, isComplete } = state

  return (
    <div className="space-y-6">
      {(executiveSummary || currentSection === 'executive_summary') && (
        <Section
          icon={<Brain className="w-5 h-5 text-brand-400" />}
          title="Executive Summary of Buyer Psychology"
          isStreaming={currentSection === 'executive_summary'}
        >
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">
            {executiveSummary || <StreamingCursor />}
          </p>
          {executiveSummary && <div className="mt-3 flex justify-end"><CopyButton text={executiveSummary} /></div>}
        </Section>
      )}

      {SCRIPT_META.map(meta => {
        const content = scripts[meta.id]
        const isStreaming = currentSection === meta.id
        if (!content && !isStreaming) return null
        return <ScriptCard key={meta.id} meta={meta} content={content ?? ''} isStreaming={isStreaming} />
      })}

      {(objectionMatrix || currentSection === 'objection_matrix') && (
        <Section
          icon={<Shield className="w-5 h-5 text-orange-400" />}
          title="Objection Handling Matrix"
          isStreaming={currentSection === 'objection_matrix'}
        >
          <pre className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-mono">
            {objectionMatrix || <StreamingCursor />}
          </pre>
          {objectionMatrix && <div className="mt-3 flex justify-end"><CopyButton text={objectionMatrix} /></div>}
        </Section>
      )}

      {(conversionOptimizations || currentSection === 'conversion_optimizations') && (
        <Section
          icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}
          title="Conversion Optimization Recommendations"
          isStreaming={currentSection === 'conversion_optimizations'}
        >
          <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
            {conversionOptimizations || <StreamingCursor />}
          </p>
          {conversionOptimizations && <div className="mt-3 flex justify-end"><CopyButton text={conversionOptimizations} /></div>}
        </Section>
      )}

      {isComplete && (
        <div className="text-center py-4 animate-fade-in">
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-500/10 border border-brand-500/25 text-brand-300 text-sm font-medium">
            ✓ All 5 scripts generated
          </span>
        </div>
      )}
    </div>
  )
}

function Section({ icon, title, isStreaming, children }: {
  icon: React.ReactNode; title: string; isStreaming: boolean; children: React.ReactNode
}) {
  return (
    <div className="bg-surface-card border border-surface-border rounded-2xl p-6 shadow-card animate-fade-in-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {icon}
          <h3 className="text-base font-semibold text-white">{title}</h3>
        </div>
        {isStreaming && (
          <div className="flex items-center gap-2 text-xs text-brand-400">
            <LoadingSpinner size="sm" />
            <span>Generating...</span>
          </div>
        )}
      </div>
      {children}
    </div>
  )
}

function ScriptCard({ meta, content, isStreaming }: {
  meta: typeof SCRIPT_META[0]; content: string; isStreaming: boolean
}) {
  const [expanded, setExpanded] = useState(true)

  return (
    <div className={`bg-gradient-to-br ${meta.gradient} border ${meta.border} rounded-2xl p-6 shadow-card animate-fade-in-up`}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase ${meta.badge}`}>
            {meta.label}
          </span>
          <h3 className="text-base font-semibold text-white">{meta.style}</h3>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isStreaming && (
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <LoadingSpinner size="sm" />
              <span>Writing...</span>
            </div>
          )}
          {content && !isStreaming && <CopyButton text={content} />}
          <button
            onClick={() => setExpanded(p => !p)}
            className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
          {content || <StreamingCursor />}
        </div>
      )}
    </div>
  )
}

function StreamingCursor() {
  return (
    <span className="inline-flex items-center gap-2 text-brand-400">
      <span className="w-2 h-4 bg-brand-500 animate-pulse rounded-sm" />
      <span className="text-sm text-gray-500">Generating...</span>
    </span>
  )
}
