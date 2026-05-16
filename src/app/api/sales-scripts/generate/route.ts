import { NextRequest } from 'next/server'
import { getAnthropicClient } from '@/lib/anthropic'
import type { SalesScriptFormData } from '@/lib/types'

export const runtime = 'nodejs'
export const maxDuration = 120

const REQUIRED_FIELDS: (keyof SalesScriptFormData)[] = [
  'niche', 'targetAudience', 'offer', 'pricePoint',
  'salesChannel', 'tone', 'desiredOutcome', 'mainPainPoints', 'uniqueMechanism',
]

function buildPrompt(d: SalesScriptFormData): string {
  return `You are a world-class sales strategist with 20+ years closing high-ticket deals across every channel and industry. You have deep mastery of buyer psychology, persuasion architecture, and identity-based selling. Your scripts have generated hundreds of millions in revenue.

BRIEF:
- Niche: ${d.niche}
- Target Audience: ${d.targetAudience}
- Offer: ${d.offer}
- Price Point: ${d.pricePoint}
- Sales Channel: ${d.salesChannel}
- Tone: ${d.tone}
- Desired Outcome: ${d.desiredOutcome}
- Main Pain Points: ${d.mainPainPoints}
- Unique Mechanism: ${d.uniqueMechanism}

Produce a complete Sales Intelligence Package. Structure your ENTIRE response using these XML section markers — output nothing outside them.

<SECTION:executive_summary>
Write a 4-paragraph Executive Summary of Buyer Psychology for this exact audience. Cover:
1. Core identity and self-image of this buyer — who they believe they are and who they want to be
2. Emotional drivers beneath the surface pain points — the fear, shame, or desire underneath the stated problem
3. What they're REALLY buying — transformation, status, certainty, belonging, freedom?
4. Belief barriers and the persuasion pathway that dissolves them fastest

Be hyper-specific. Reference the niche, price point, and channel. No generic sales-book language.
</SECTION:executive_summary>

<SECTION:script_1>
VERSION 1 — CONSULTATIVE AUTHORITY CLOSER

Write a complete word-for-word sales script for ${d.salesChannel}. This approach:
- Opens by establishing expertise immediately, without bragging
- Uses Socratic diagnostic questions to surface pain before presenting the offer
- Positions you as a trusted advisor, not a vendor
- Moves through: credibility → discovery → insight → solution → commitment
- Language is authoritative but collaborative — you're solving their problem together

Include: exact dialogue, [stage directions in brackets], transition phrases between sections, and a strong close with a specific CTA. Minimum 700 words.
</SECTION:script_1>

<SECTION:script_2>
VERSION 2 — EMOTIONAL STORYTELLING APPROACH

Write a complete word-for-word sales script for ${d.salesChannel}. This approach:
- Opens with a narrative hook — a story that mirrors the prospect's exact situation
- Uses a before/during/after transformation arc
- Builds emotional resonance before any logical argument
- Deploys social proof through story, not generic testimonial-speak
- Creates urgency through the emotional consequence of inaction, not pressure tactics

Include: exact dialogue, [narrative beats in brackets], emotional escalation cues, and a close that feels like a natural next step. Minimum 700 words.
</SECTION:script_2>

<SECTION:script_3>
VERSION 3 — ROI & LOGIC-DRIVEN APPROACH

Write a complete word-for-word sales script for ${d.salesChannel}. This approach:
- Opens with a compelling data point or business case framing question
- Builds a mathematical/logical argument for the investment
- Quantifies both the cost of the problem and the value of the solution
- Preemptively dissolves "it's too expensive" with ROI math before it's raised
- Appeals to analytical, left-brain buyers who need to justify decisions with numbers

Include: exact dialogue, [calculation frameworks in brackets], logical proof sequences, and a close that frames next steps as the only rational decision. Minimum 700 words.
</SECTION:script_3>

<SECTION:script_4>
VERSION 4 — CHALLENGER / DISRUPTIVE STYLE

Write a complete word-for-word sales script for ${d.salesChannel}. This approach:
- Opens by challenging a comfortable assumption or conventional belief the prospect holds
- Teaches them something genuinely new about their own problem
- Creates constructive tension — they feel the discomfort of their current thinking
- Positions your offer as the only logical conclusion to the insight you've just delivered
- Bold and confident without being aggressive or disrespectful

Include: exact dialogue, [reframe moments in brackets], challenger pivots, and a close that positions the prospect as someone who "gets it." Minimum 700 words.
</SECTION:script_4>

<SECTION:script_5>
VERSION 5 — LUXURY / HIGH-STATUS POSITIONING

Write a complete word-for-word sales script for ${d.salesChannel}. This approach:
- Opens by qualifying the prospect — signaling this isn't for everyone
- Frames the offer as rare access, not a product being sold
- Uses language of aspiration, identity elevation, and inner circle belonging
- Never chases or pressures — creates desire through scarcity and selectivity
- The prospect should feel that being accepted is the win, not closing the deal

Include: exact dialogue, [exclusivity signals in brackets], status-elevation language, and a close that makes saying yes feel like an identity upgrade. Minimum 700 words.
</SECTION:script_5>

<SECTION:objection_matrix>
OBJECTION HANDLING MATRIX

For each of the 5 objections below, provide a response calibrated to this specific buyer persona, price point (${d.pricePoint}), niche (${d.niche}), and channel (${d.salesChannel}).

Format each as:
OBJECTION: "[exact words the prospect says]"
ROOT CAUSE: [the real fear or belief underneath]
RESPONSE: [word-for-word reply — 100-150 words, natural and conversational]
BRIDGE: [the one sentence that transitions back toward the close]

---
1. "It's too expensive."
2. "I need to think about it."
3. "Now isn't the right time."
4. "I tried something similar before and it didn't work."
5. "Can you send me more information?"
</SECTION:objection_matrix>

<SECTION:conversion_optimizations>
CONVERSION OPTIMIZATION RECOMMENDATIONS

Provide 8 specific, actionable recommendations for this exact scenario. Each must reference the specific niche, channel, or offer — no generic advice.

Cover: pre-call preparation, environmental optimizations for the channel, follow-up sequence, psychological priming, words/phrases to use and avoid, timing and cadence, trust-acceleration tactics, and one unconventional tactic most competitors aren't using.

Format as numbered list. 2-3 sentences per item.
</SECTION:conversion_optimizations>`
}

export async function POST(req: NextRequest) {
  try {
    const body: SalesScriptFormData = await req.json()

    for (const field of REQUIRED_FIELDS) {
      if (!body[field]?.trim()) {
        return new Response(
          JSON.stringify({ error: `Missing required field: ${field}` }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        )
      }
    }

    const anthropic = getAnthropicClient()

    const stream = new ReadableStream({
      async start(controller) {
        const enc = new TextEncoder()
        const send = (data: object) =>
          controller.enqueue(enc.encode(JSON.stringify(data) + '\n'))

        try {
          const anthropicStream = anthropic.messages.stream({
            model: 'claude-sonnet-4-6',
            max_tokens: 8192,
            messages: [{ role: 'user', content: buildPrompt(body) }],
          })

          for await (const event of anthropicStream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              send({ type: 'delta', text: event.delta.text })
            }
          }

          send({ type: 'done' })
        } catch (err) {
          send({ type: 'error', message: err instanceof Error ? err.message : 'Generation failed' })
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'application/x-ndjson',
        'Cache-Control': 'no-cache, no-store',
      },
    })
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
