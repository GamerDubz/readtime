type ReadabilityMeterProps = {
  label: string
  value: number
  max: number
  displayValue: string
}

/**
 * A horizontal ruler rather than a rounded progress pill — ticks every 10%
 * with a marker sitting at the current reading, in keeping with the
 * page-and-instrument feel of the rest of the layout.
 */
export function ReadabilityMeter({ label, value, max, displayValue }: ReadabilityMeterProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 mb-2">
        <span className="text-sm text-(--color-ink-soft)">{label}</span>
        <span className="font-(family-name:--font-display) text-lg tabular-nums text-(--color-accent)">
          {displayValue}
        </span>
      </div>
      <div
        className="relative h-3"
        role="img"
        aria-label={`${label}: ${displayValue}`}
      >
        <div
          className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2"
          style={{
            backgroundImage:
              'repeating-linear-gradient(to right, var(--color-rule-strong) 0, var(--color-rule-strong) 1px, transparent 1px, transparent 10%)',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute top-1/2 h-2.5 w-0.5 -translate-y-1/2 rounded-full bg-(--color-accent) transition-[left] duration-500"
          style={{ left: `calc(${percent}% - 1px)` }}
          aria-hidden="true"
        />
      </div>
    </div>
  )
}
