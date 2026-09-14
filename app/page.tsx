'use client'

import { useState, useMemo, useCallback } from 'react'

const STOP_WORDS = new Set(['the','a','an','and','or','but','in','on','at','to','for','of','with','is','was','are','were','be','been','being','have','has','had','do','does','did','will','would','should','could','may','might','shall','this','that','these','those','i','you','he','she','it','we','they','me','him','her','us','them','my','your','his','its','our','their','from','not','all','as','if','by','so','up','out','about','into','than','then','when','what','who','how'])

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, '')
  if (!word) return 0
  if (word.length <= 3) return 1
  word = word.replace(/(?:[^laeiouy]|ed|[^laeiouy]e)$/, '').replace(/^y/, '')
  const m = word.match(/[aeiouy]{1,2}/g)
  return Math.max(1, m ? m.length : 1)
}

function analyze(text: string) {
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

  // Flesch Reading Ease
  const fleschEase = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord
  // Flesch-Kincaid Grade Level
  const fkGrade = 0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59
  // Gunning Fog
  const complexWords = words.filter((w) => countSyllables(w) >= 3).length
  const gunningFog = 0.4 * (avgWordsPerSentence + 100 * (complexWords / wordCount))

  const readingTimes = { slow: Math.ceil(wordCount / 150), avg: Math.ceil(wordCount / 238), fast: Math.ceil(wordCount / 350) }

  // Word frequency
  const freq: Record<string, number> = {}
  words.forEach((w) => {
    const lw = w.toLowerCase()
    if (!STOP_WORDS.has(lw) && lw.length > 2) freq[lw] = (freq[lw] ?? 0) + 1
  })
  const topWords = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 10)

  let easeLabel = 'Very Difficult'
  if (fleschEase >= 90) easeLabel = 'Very Easy'
  else if (fleschEase >= 70) easeLabel = 'Easy'
  else if (fleschEase >= 60) easeLabel = 'Standard'
  else if (fleschEase >= 50) easeLabel = 'Fairly Difficult'
  else if (fleschEase >= 30) easeLabel = 'Difficult'

  return { wordCount, charCount, sentenceCount, paragraphCount, uniqueWords, readingTimes, fleschEase: Math.min(100, Math.max(0, fleschEase)), fkGrade: Math.max(0, fkGrade), gunningFog: Math.max(0, gunningFog), easeLabel, topWords }
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-xl p-4">
      <div className="text-xs text-neutral-500 mb-1 uppercase tracking-wider">{label}</div>
      <div className="text-2xl font-bold text-neutral-100 tabular-nums">{value}</div>
      {sub && <div className="text-xs text-neutral-600 mt-0.5">{sub}</div>}
    </div>
  )
}

const SAMPLES = [
  { label: 'Simple paragraph', text: 'The cat sat on the mat. It was a sunny day outside. Birds were singing in the trees. The children played happily in the park nearby. Everything felt peaceful and calm.' },
  { label: 'Technical writing', text: 'The implementation utilizes a recursive descent parser combined with a predictive lookahead mechanism to efficiently disambiguate syntactic constructs. Furthermore, the semantic analysis phase employs a sophisticated type inference algorithm, enabling polymorphic dispatch resolution at compile time.' },
  { label: 'News article excerpt', text: 'Scientists have discovered a new species of deep-sea fish in the Pacific Ocean. The creature, found at depths exceeding 4,000 meters, possesses bioluminescent properties never before observed in marine biology. Researchers from three universities collaborated on the expedition.' },
]

export default function ReadTimePage() {
  const [text, setText] = useState('')
  const result = useMemo(() => analyze(text), [text])

  const load = useCallback((sample: string) => setText(sample), [])

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-slate-100 selection:bg-emerald-500 selection:text-white">
      <div className="max-w-5xl mx-auto p-6 md:p-10">
        <header className="mb-8 flex items-center justify-between pb-5 border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
              <svg className="w-full h-full p-1.5" viewBox="0 0 32 32" fill="none">
                <path d="M7 21C9.5 20 13 20 16 22C19 20 22.5 20 25 21V10C22.5 9 19 9 16 11C13 9 9.5 9 7 10V21Z" fill="#0F172A" stroke="#94A3B8" strokeWidth="1.2"/>
                <line x1="16" y1="11" x2="16" y2="22" stroke="#38BDF8" strokeWidth="1.2"/>
                <circle cx="23" cy="9" r="5.5" fill="#064E3B" stroke="#34D399" strokeWidth="1.5"/>
                <path d="M23 6.5V9L24.5 10.5" stroke="#F0FDF4" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                ReadTime
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-medium">
                  Analyzer
                </span>
              </h1>
              <p className="text-xs text-slate-400">Reading time estimator, readability scorer &amp; text analyzer</p>
            </div>
          </div>
          {result && (
            <div className="hidden sm:flex items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 font-semibold font-mono">
                {result.wordCount} Words
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-semibold">
                {result.easeLabel}
              </span>
            </div>
          )}
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500" htmlFor="text-input">Text</label>
              <div className="flex gap-2">
                {SAMPLES.map((s) => (
                  <button key={s.label} onClick={() => load(s.text)} className="text-xs px-2 py-1 bg-[#1a1a1a] border border-[#2e2e2e] hover:border-[#444] rounded text-neutral-500 hover:text-neutral-200 transition-colors">{s.label}</button>
                ))}
              </div>
            </div>
            <textarea
              id="text-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or type your text here…"
              className="w-full h-80 bg-[#1a1a1a] border border-[#2e2e2e] rounded-xl p-4 text-sm text-neutral-200 resize-none outline-none focus:border-blue-500 leading-relaxed"
              aria-label="Input text for analysis"
            />
            <div className="text-xs text-neutral-600 mt-1.5">{text.length} characters</div>
          </div>

          {/* Results */}
          <div className="space-y-5">
            {result ? (
              <>
                {/* Reading times */}
                <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-xl p-5">
                  <h2 className="text-sm font-semibold text-neutral-300 mb-3">Reading Time</h2>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { speed: 'Slow', wpm: '150 WPM', mins: result.readingTimes.slow },
                      { speed: 'Average', wpm: '238 WPM', mins: result.readingTimes.avg },
                      { speed: 'Fast', wpm: '350 WPM', mins: result.readingTimes.fast },
                    ].map(({ speed, wpm, mins }) => (
                      <div key={speed} className="text-center p-3 bg-[#242424] rounded-lg">
                        <div className="text-2xl font-bold tabular-nums text-blue-400">{mins}</div>
                        <div className="text-xs text-neutral-400">min</div>
                        <div className="text-xs text-neutral-600 mt-1">{speed}</div>
                        <div className="text-xs text-neutral-700">{wpm}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-3">
                  <StatCard label="Words" value={result.wordCount.toLocaleString()} />
                  <StatCard label="Sentences" value={result.sentenceCount.toLocaleString()} />
                  <StatCard label="Paragraphs" value={result.paragraphCount.toLocaleString()} />
                  <StatCard label="Unique Words" value={result.uniqueWords.toLocaleString()} sub={`${Math.round(result.uniqueWords / result.wordCount * 100)}% vocabulary diversity`} />
                </div>

                {/* Readability */}
                <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-xl p-5 space-y-3">
                  <h2 className="text-sm font-semibold text-neutral-300">Readability</h2>
                  {[
                    { label: `Flesch Reading Ease — ${result.easeLabel}`, value: result.fleschEase, max: 100, color: result.fleschEase > 60 ? '#4ade80' : result.fleschEase > 40 ? '#fbbf24' : '#f87171', suffix: '/100' },
                    { label: `Flesch-Kincaid Grade Level — Grade ${result.fkGrade.toFixed(1)}`, value: Math.min(result.fkGrade, 16), max: 16, color: '#60a5fa', suffix: '' },
                    { label: `Gunning Fog Index — ${result.gunningFog.toFixed(1)}`, value: Math.min(result.gunningFog, 20), max: 20, color: '#a78bfa', suffix: '' },
                  ].map(({ label, value, max, color, suffix }) => (
                    <div key={label}>
                      <div className="flex justify-between text-xs text-neutral-500 mb-1.5">
                        <span>{label}</span>
                        <span style={{ color }}>{value.toFixed(1)}{suffix}</span>
                      </div>
                      <div className="h-1.5 bg-[#2e2e2e] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(value / max) * 100}%`, background: color }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Top words */}
                {result.topWords.length > 0 && (
                  <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-xl p-5">
                    <h2 className="text-sm font-semibold text-neutral-300 mb-3">Top Words</h2>
                    <div className="flex flex-wrap gap-2">
                      {result.topWords.map(([word, count]) => (
                        <span key={word} className="px-2.5 py-1 bg-[#242424] rounded-full text-xs text-neutral-300">
                          {word} <span className="text-neutral-600">×{count}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-neutral-600 text-sm">
                Enter some text to see analysis
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
