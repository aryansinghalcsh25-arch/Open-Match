// ============================================================
// SkillPill.tsx
// ============================================================
// A small colored pill that shows a skill name + confidence dot.
//
// USAGE:
//   <SkillPill name="TypeScript" confidence="advanced" />
//   <SkillPill name="React" confidence="intermediate" />
//   <SkillPill name="Docker" confidence="beginner" />
//
// Each confidence level uses a different color dot:
//   beginner     → blue  dot
//   intermediate → purple dot (accent-primary)
//   advanced     → gold  dot
// ============================================================

// ---- Props ------------------------------------------------

export type Confidence = 'beginner' | 'intermediate' | 'advanced'

interface SkillPillProps {
  name: string
  confidence: Confidence
  size?: 'sm' | 'md'   // sm = compact (for dense lists), md = default
}

// ---- Confidence dot colors --------------------------------

const DOT_COLOR: Record<Confidence, string> = {
  beginner:     'var(--accent-secondary)',  // blue
  intermediate: 'var(--accent-primary)',    // purple (our new accent)
  advanced:     'var(--accent-gold)',       // gold
}

// ---- Component --------------------------------------------

export default function SkillPill({ name, confidence, size = 'md' }: SkillPillProps) {
  const isSmall = size === 'sm'

  return (
    <span
      title={`${name} — ${confidence}`}   // tooltip on hover
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: isSmall ? '5px' : '6px',
        padding: isSmall ? '3px 8px' : '4px 12px',
        borderRadius: 'var(--radius-full)',
        backgroundColor: 'var(--bg-elevated)',
        border: '1px solid var(--border-default)',
        fontFamily: 'var(--font-display)',
        fontSize: isSmall ? '0.75rem' : '0.82rem',
        color: 'var(--text-secondary)',
        whiteSpace: 'nowrap',
        transition: 'border-color 0.15s ease, color 0.15s ease',
      }}
    >
      {/* Confidence dot */}
      <span
        style={{
          width: isSmall ? '6px' : '7px',
          height: isSmall ? '6px' : '7px',
          borderRadius: '50%',
          backgroundColor: DOT_COLOR[confidence],
          flexShrink: 0,
        }}
      />
      {name}
    </span>
  )
}
