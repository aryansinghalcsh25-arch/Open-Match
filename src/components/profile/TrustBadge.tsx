// ============================================================
// TrustBadge.tsx
// ============================================================
// A small pill-shaped badge that shows a user's trust level.
//
// Trust levels go from 0 (just registered) to 4 (verified).
// Each level has its own color from our design system.
//
// USAGE:
//   <TrustBadge level={2} />        → "L2 · Emerging" in teal
//   <TrustBadge level={4} />        → "L4 · Verified" in gold
//
// TOOLTIP:
//   Hovering over the badge shows a small popup card explaining
//   what the current level means and what the next level is.
//   This is built with pure CSS positioning — no library needed.
// ============================================================

import { useState } from 'react'

// ---- Trust level config -----------------------------------
// Each level has:
//   label       → the pill text e.g. "L3 · Active"
//   color       → text + border color (CSS variable)
//   bgColor     → background tint
//   description → what this level means (shown in tooltip)
//   requirement → what the user did to earn this level

interface TrustConfig {
  label: string
  color: string
  bgColor: string
  description: string
  requirement: string
}

const TRUST_CONFIG: Record<number, TrustConfig> = {
  0: {
    label:       'L0 · Registered',
    color:       'var(--trust-0)',
    bgColor:     'rgba(72, 79, 88, 0.15)',
    description: 'Just joined OpenMatch.',
    requirement: 'Complete your profile to reach L1.',
  },
  1: {
    label:       'L1 · Learning',
    color:       'var(--trust-1)',
    bgColor:     'rgba(61, 142, 255, 0.15)',
    description: 'Onboarding complete. Exploring projects.',
    requirement: 'Make your first merged PR to reach L2.',
  },
  2: {
    label:       'L2 · Emerging',
    color:       'var(--trust-2)',
    bgColor:     'rgba(0, 212, 177, 0.15)',
    description: 'Made first open-source contributions.',
    requirement: 'Contribute to 3+ projects to reach L3.',
  },
  3: {
    label:       'L3 · Active',
    color:       'var(--trust-3)',
    bgColor:     'rgba(35, 134, 54, 0.15)',
    description: 'Regularly contributing across projects.',
    requirement: '10+ merged PRs + peer reviews to reach L4.',
  },
  4: {
    label:       'L4 · Verified',
    color:       'var(--trust-4)',
    bgColor:     'rgba(245, 166, 35, 0.15)',
    description: 'Top contributor. Highly trusted by the community.',
    requirement: 'Maximum level reached. 🏆',
  },
}

// ---- Props ------------------------------------------------

interface TrustBadgeProps {
  level: 0 | 1 | 2 | 3 | 4
  className?: string
}

// ---- Component --------------------------------------------

export default function TrustBadge({ level, className }: TrustBadgeProps) {
  const config = TRUST_CONFIG[level] ?? TRUST_CONFIG[0]

  // We track hover state ourselves to show/hide the tooltip.
  // CSS :hover doesn't work on inline styles, so we use
  // onMouseEnter / onMouseLeave instead.
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    // Wrapper div — needed so the tooltip can be positioned
    // relative to the badge (position: relative here, absolute on tooltip)
    <div
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >

      {/* ── The badge pill ──────────────────────────────── */}
      <span
        className={className}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '3px 10px',
          borderRadius: 'var(--radius-full)',
          border: `1px solid ${config.color}`,
          backgroundColor: config.bgColor,
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          fontWeight: 700,
          color: config.color,
          letterSpacing: '0.03em',
          whiteSpace: 'nowrap',
          cursor: 'default',
        }}
      >
        {config.label}
      </span>

      {/* ── Tooltip popup ───────────────────────────────── */}
      {/*
        Only rendered when the user hovers.
        `position: absolute` + `bottom: calc(100% + 8px)` places it
        8px ABOVE the badge. `left: 50%` + `translateX(-50%)` centers it.
        `zIndex: 100` makes sure it floats above everything else.
      */}
      {showTooltip && (
        <div
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 8px)',   // 8px above the badge
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
            width: '220px',

            backgroundColor: 'var(--bg-elevated)',
            border: `1px solid ${config.color}`,
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem',
            boxShadow: 'var(--shadow-modal)',

            // Fade in smoothly
            animation: 'trustTooltipIn 0.15s ease',
          }}
        >
          <style>{`
            @keyframes trustTooltipIn {
              from { opacity: 0; transform: translateX(-50%) translateY(4px); }
              to   { opacity: 1; transform: translateX(-50%) translateY(0); }
            }
          `}</style>

          {/* Level label in color */}
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: config.color,
              marginBottom: '0.4rem',
            }}
          >
            {config.label}
          </div>

          {/* What this level means */}
          <div
            style={{
              fontSize: '0.8rem',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
              marginBottom: '0.5rem',
              lineHeight: 1.5,
            }}
          >
            {config.description}
          </div>

          {/* How to reach the next level */}
          {level < 4 && (
            <div
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-display)',
                paddingTop: '0.5rem',
                borderTop: '1px solid var(--border-default)',
                lineHeight: 1.5,
              }}
            >
              <span style={{ color: 'var(--text-tertiary)' }}>Next: </span>
              {config.requirement}
            </div>
          )}

          {/* Level 4 — max level message */}
          {level === 4 && (
            <div
              style={{
                fontSize: '0.75rem',
                color: config.color,
                fontFamily: 'var(--font-display)',
                paddingTop: '0.5rem',
                borderTop: '1px solid var(--border-default)',
              }}
            >
              {config.requirement}
            </div>
          )}

          {/* Small triangle pointer at the bottom of the tooltip */}
          <div
            style={{
              position: 'absolute',
              bottom: '-5px',
              left: '50%',
              transform: 'translateX(-50%) rotate(45deg)',
              width: '8px',
              height: '8px',
              backgroundColor: 'var(--bg-elevated)',
              border: `1px solid ${config.color}`,
              borderTop: 'none',
              borderLeft: 'none',
            }}
          />
        </div>
      )}
    </div>
  )
}
