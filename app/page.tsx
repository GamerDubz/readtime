'use client'

import { useCallback, useMemo, useState } from 'react'
import { X } from 'lucide-react'
import { Logo } from '@/components/logo'
import { ReadabilityMeter } from '@/components/readability-meter'

const STOP_WORDS = new Set(['the','a','an','and','or','but','in','on','at','to','for','of','with','is','was','are','were','be','been','being','have','has','had','do','does','did','will','would','should','could','may','might','shall','this','that','these','those','i','you','he','she','it','we','they','me','him','her','us','them','my','your','his','its','our','their','from','not','all','as','if','by','so','up','out','about','into','than','then','when','what','who','how'])

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, '')
  if (!word) return 0
  if (word.length <= 3) return 1
  word = word.replace(/(?:[^laeiouy]|ed|[^laeiouy]e)$/, '').replace(/^y/, '')
  const m = word.match(/[aeiouy]{1,2}/g)
  return Math.max(1, m ? m.length : 1)
}

type Analysis = {
  wordCount: number
  charCount: number
  sentenceCount: number
  paragraphCount: number
  uniqueWords: number
  readingTimes: { slow: number; avg: number; fast: number }
  fleschEase: number
  fkGrade: number
  gunningFog: number
  easeLabel: string
  topWords: [string, number][]
}

function analyze(text: string): Analysis | null {
  if (!text.trim()) return null
  const words = text.match(/\b\w+\b/g) ?? []
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 3)
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim())
  const wordCount = words.length
  const charCount = text.length
  const sentenceCount = Math.max(1, sentences.length)
  const paragraphCount = Math.max(1, paragraphs.length)
  const uniqueWords = new Set(words.map((w) => w.toLowerCase())).size
  const totalSyllables = words.reduce((acc, w) => acc + countSyllables(w), 0)
  const avgWordsPerSentence = wordCount / sentenceCount
  const avgSyllablesPerWord = totalSyllables / Math.max(1, wordCount)

  const fleschEase = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord
  const fkGrade = 0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59
  const complexWords = words.filter((w) => countSyllables(w) >= 3).length
  const gunningFog = 0.4 * (avgWordsPerSentence + 100 * (complexWords / wordCount))

  const readingTimes = { slow: Math.ceil(wordCount / 150), avg: Math.ceil(wordCount / 238), fast: Math.ceil(wordCount / 350) }

  const freq: Record<string, number> = {}
  words.forEach((w) => {
    const lw = w.toLowerCase()
    if (!STOP_WORDS.has(lw) && lw.length > 2) freq[lw] = (freq[lw] ?? 0) + 1
  })
  const topWords = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 10) as [string, number][]

  let easeLabel = 'Very Difficult'
  if (fleschEase >= 90) easeLabel = 'Very Easy'
  else if (fleschEase >= 70) easeLabel = 'Easy'
  else if (fleschEase >= 60) easeLabel = 'Standard'
  else if (fleschEase >= 50) easeLabel = 'Fairly Difficult'
  else if (fleschEase >= 30) easeLabel = 'Difficult'

  return { wordCount, charCount, sentenceCount, paragraphCount, uniqueWords, readingTimes, fleschEase: Math.min(100, Math.max(0, fleschEase)), fkGrade: Math.max(0, fkGrade), gunningFog: Math.max(0, gunningFog), easeLabel, topWords }
}

const SAMPLES = [
  { label: 'Simple paragraph', text: 'The cat sat on the mat. It was a sunny day outside. Birds were singing in the trees. The children played happily in the park nearby. Everything felt peaceful and calm.' },
  { label: 'Technical writing', text: 'The implementation utilizes a recursive descent parser combined with a predictive lookahead mechanism to efficiently disambiguate syntactic constructs. Furthermore, the semantic analysis phase employs a sophisticated type inference algorithm, enabling polymorphic dispatch resolution at compile time.' },
  { label: 'News excerpt', text: 'Scientists have discovered a new species of deep-sea fish in the Pacific Ocean. The creature, found at depths exceeding 4,000 meters, possesses bioluminescent properties never before observed in marine biology. Researchers from three universities collaborated on the expedition.' },
]

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-3 border-b border-(--color-rule) last:border-none">
      <span className="text-sm text-(--color-ink-soft)">{label}</span>
      <span className="text-right">
        <span className="font-(family-name:--font-display) text-xl tabular-nums">{value}</span>
        {sub && <span className="block text-xs text-(--color-ink-faint) mt-0.5">{sub}</span>}
      </span>
    </div>
  )
}

export default function ReadTimePage() {
  const [text, setText] = useState('')
  const result = useMemo(() => analyze(text), [text])

  const load = useCallback((sample: string) => setText(sample), [])
  const clear = useCallback(() => setText(''), [])

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-14">
        {/* Masthead */}
        <header className="mb-10 md:mb-14">
          <div className="flex items-center gap-3 text-(--color-ink)">
            <Logo size={34} />
            <span className="font-(family-name:--font-display) text-3xl md:text-4xl font-semibold tracking-tight">
              ReadTime
            </span>
          </div>
          <p className="mt-2 font-(family-name:--font-display) italic text-(--color-ink-soft) text-lg max-w-xl">
            A quiet instrument for measuring how long a piece of writing takes to read.
          </p>
          <hr className="mt-6 border-t-2 border-(--color-ink)" />
        </header>

        <main className="grid lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-16">
          {/* The manuscript */}
          <section aria-labelledby="manuscript-heading">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 mb-3">
              <h2
                id="manuscript-heading"
                className="font-(family-name:--font-sans) text-xs font-semibold uppercase tracking-[0.14em] text-(--color-ink-soft)"
              >
                The Text
              </h2>
              <p className="font-(family-name:--font-sans) text-xs text-(--color-ink-faint)">
                Try:{' '}
                {SAMPLES.map((s, i) => (
                  <span key={s.label}>
                    <button
                      type="button"
                      onClick={() => load(s.text)}
                      className="underline decoration-(--color-rule-strong) decoration-1 underline-offset-2 hover:text-(--color-accent) hover:decoration-(--color-accent) transition-colors min-h-11 inline-flex items-center py-1 -my-1"
                    >
                      {s.label}
                    </button>
                    {i < SAMPLES.length - 1 && <span aria-hidden="true"> · </span>}
                  </span>
                ))}
              </p>
            </div>

            <div className="relative bg-(--color-paper-raised) shadow-[0_1px_2px_rgba(42,33,24,0.08),0_8px_24px_-12px_rgba(42,33,24,0.25)] rounded-sm">
              <textarea
                id="text-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste or type your text here…"
                className="manuscript w-full h-96 md:h-[30rem] bg-transparent p-6 pt-5 text-lg text-(--color-ink) resize-none outline-none font-(family-name:--font-serif) placeholder:not-italic"
                aria-label="Text to analyze"
              />
              {text && (
                <button
                  type="button"
                  onClick={clear}
                  aria-label="Clear text"
                  className="absolute top-2 right-2 flex items-center justify-center w-11 h-11 rounded-full text-(--color-ink-faint) hover:text-(--color-accent) hover:bg-(--color-paper) transition-colors"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              )}
            </div>
            <div className="mt-2 font-(family-name:--font-sans) text-xs text-(--color-ink-faint) tabular-nums">
              {text.length.toLocaleString()} characters
            </div>
          </section>

          {/* The reading */}
          <section aria-label="Analysis results">
            {result ? (
              <div className="space-y-10">
                {/* Pull-quote: reading time */}
                <div className="border-y-2 border-(--color-ink) py-6 text-center">
                  <div className="font-(family-name:--font-display) italic font-semibold text-(--color-accent) text-7xl md:text-8xl leading-none tabular-nums">
                    {result.readingTimes.avg}
                  </div>
                  <div className="mt-2 font-(family-name:--font-sans) text-xs font-semibold uppercase tracking-[0.2em] text-(--color-ink-soft)">
                    Minutes to Read
                  </div>
                  <div className="mt-4 font-(family-name:--font-sans) text-xs text-(--color-ink-faint)">
                    a careful reader takes {result.readingTimes.slow} min · a quick one takes {result.readingTimes.fast} min
                  </div>
                </div>

                {/* Colophon stats */}
                <div>
                  <h2 className="font-(family-name:--font-sans) text-xs font-semibold uppercase tracking-[0.14em] text-(--color-ink-soft) mb-1">
                    At a Glance
                  </h2>
                  <div>
                    <Stat label="Words" value={result.wordCount.toLocaleString()} />
                    <Stat label="Sentences" value={result.sentenceCount.toLocaleString()} />
                    <Stat label="Paragraphs" value={result.paragraphCount.toLocaleString()} />
                    <Stat
                      label="Unique words"
                      value={result.uniqueWords.toLocaleString()}
                      sub={`${Math.round((result.uniqueWords / result.wordCount) * 100)}% vocabulary diversity`}
                    />
                  </div>
                </div>

                {/* Readability */}
                <div>
                  <h2 className="font-(family-name:--font-sans) text-xs font-semibold uppercase tracking-[0.14em] text-(--color-ink-soft) mb-4">
                    Readability
                  </h2>
                  <div className="space-y-5">
                    <ReadabilityMeter
                      label={`Flesch Reading Ease — ${result.easeLabel}`}
                      value={result.fleschEase}
                      max={100}
                      displayValue={`${result.fleschEase.toFixed(1)}/100`}
                    />
                    <ReadabilityMeter
                      label="Flesch-Kincaid Grade Level"
                      value={Math.min(result.fkGrade, 16)}
                      max={16}
                      displayValue={`Grade ${result.fkGrade.toFixed(1)}`}
                    />
                    <ReadabilityMeter
                      label="Gunning Fog Index"
                      value={Math.min(result.gunningFog, 20)}
                      max={20}
                      displayValue={result.gunningFog.toFixed(1)}
                    />
                  </div>
                </div>

                {/* Word index */}
                {result.topWords.length > 0 && (
                  <div>
                    <h2 className="font-(family-name:--font-sans) text-xs font-semibold uppercase tracking-[0.14em] text-(--color-ink-soft) mb-3">
                      Index of Frequent Words
                    </h2>
                    <ul className="grid sm:grid-cols-2 gap-x-6">
                      {result.topWords.map(([word, count]) => (
                        <li key={word} className="flex items-baseline py-1 font-(family-name:--font-serif) text-(--color-ink)">
                          <span>{word}</span>
                          <span className="index-leader" aria-hidden="true" />
                          <span className="text-sm text-(--color-ink-soft) tabular-nums">{count}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full min-h-[24rem] flex items-center justify-center border-y-2 border-(--color-ink)/20">
                <p className="font-(family-name:--font-display) italic text-(--color-ink-faint) text-xl text-center max-w-xs px-6">
                  &ldquo;Begin, and the rest will follow.&rdquo;
                  <span className="block mt-3 font-(family-name:--font-sans) not-italic text-xs uppercase tracking-[0.14em]">
                    Paste text to see its reading time
                  </span>
                </p>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}
