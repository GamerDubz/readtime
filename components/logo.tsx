type LogoProps = {
  size?: number
  className?: string
}

/**
 * Original mark: an open book whose spine continues upward to become the
 * hand of a clock, set inside a partial dial that stays open where the
 * book sits. Built from a handful of geometric strokes so it stays legible
 * from a 16px favicon up to a 512px mark.
 */
export function Logo({ size = 32, className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="ReadTime"
    >
      {/* dial, left open at the base where the book sits */}
      <path
        d="M 9 27 A 15 15 0 1 1 39 27"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.75"
        strokeLinecap="round"
      />
      {/* hour hand */}
      <path
        d="M 24 18 L 30.5 14.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.75"
        strokeLinecap="round"
      />
      {/* minute hand, continues down into the book's spine */}
      <path
        d="M 24 10.5 L 24 33"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.75"
        strokeLinecap="round"
      />
      {/* open book */}
      <path
        d="M 24 33 C 20 28.5, 13.5 28, 7.5 30.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 24 33 C 28 28.5, 34.5 28, 40.5 30.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
