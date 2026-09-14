import type { Metadata } from 'next'
import { Fraunces, Source_Serif_4, IBM_Plex_Sans } from 'next/font/google'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  style: ['normal', 'italic'],
  display: 'swap',
})

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif',
  display: 'swap',
})

const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ReadTime — Reading Time Estimator & Text Analyzer',
  description: 'Paste any text to see its reading time, readability scores, and word statistics — set like a page, not a dashboard.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${sourceSerif.variable} ${plexSans.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  )
}
