// ============================================================
// StepMentor.tsx
// ============================================================
// Step 6 — the FINAL step of the onboarding wizard.
//
// FOR NEWCOMERS:
//   Two large card options:
//   - "Yes, match me with a mentor" (selected by default)
//   - "No thanks, I'll explore on my own"
//   If yes: a teal info note appears below
//
// FOR CONTRIBUTORS / MAINTAINERS:
//   An optional textarea: "What are your goals for the next 3 months?"
//   Max 500 characters with a live counter.
//
// FINISHING:
//   The [Finish Setup] button is always enabled.
//   On click:
//     1. Save data to the store
//     2. Trigger a confetti burst animation
//     3. After 1.8 seconds, navigate to /dashboard
//
// CONFETTI:
//   Pure CSS + JS — no external library needed.
//   We create 60 small divs, give each one a random:
//     - color (from our design palette)
//     - size, position, rotation, fall speed
//   They animate with a CSS keyframe (@keyframes confettiFall)
//   and are removed after the animation completes.
// ============================================================

import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Compass, UserCheck } from 'lucide-react'
import { useOnboardingStore } from '../../store/onboardingStore'

// ---- Confetti config --------------------------------------

// Colors from our design system — confetti pieces use these
const CONFETTI_COLORS = [
  '#00D4B1',  // teal (accent-primary)
  '#3D8EFF',  // blue (accent-secondary)
  '#F5A623',  // gold (accent-gold)
  '#238636',  // green (state-success)
  '#E6EDF3',  // light (text-primary)
]

const CONFETTI_COUNT = 60  // number of pieces

// ---- Goals textarea config --------------------------------
const GOALS_MAX = 500

// ---- Component --------------------------------------------

export default function StepMentor() {
  const { data, setFinalStep } = useOnboardingStore()
  const navigate = useNavigate()
  const role = data.role

  // ── Local state ───────────────────────────────────────────
  // Pre-fill from store in case user navigates back
  const [wantsMentor, setWantsMentor] = useState(data.wantsMentor)
  const [goals, setGoals]             = useState(data.goals)
  const [isFinishing, setIsFinishing] = useState(false)

  // ── Confetti burst ────────────────────────────────────────
  //
  // `useCallback` memoizes this function so it doesn't get
  // recreated on every render — good practice for functions
  // passed as event handlers.

  const launchConfetti = useCallback(() => {
    // Create a container div that sits over the entire screen
    const container = document.createElement('div')
    container.style.cssText = `
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      pointer-events: none;
      z-index: 9999;
      overflow: hidden;
    `
    document.body.appendChild(container)

    // Inject the CSS keyframe animation once into the document
    const styleId = 'confetti-style'
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style')
      style.id = styleId
      style.textContent = `
        @keyframes confettiFall {
          0%   { transform: translateY(-20px) rotate(0deg);   opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `
      document.head.appendChild(style)
    }

    // Spawn CONFETTI_COUNT pieces
    for (let i = 0; i < CONFETTI_COUNT; i++) {
      const piece = document.createElement('div')

      // Random properties for each piece
      const color    = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]
      const size     = Math.random() * 10 + 6    // 6px – 16px
      const left     = Math.random() * 100        // 0% – 100% from left
      const delay    = Math.random() * 0.8        // 0s – 0.8s start delay
      const duration = Math.random() * 1.5 + 1.2 // 1.2s – 2.7s fall time
      const isCircle = Math.random() > 0.5        // half circles, half squares

      piece.style.cssText = `
        position: absolute;
        top: 0;
        left: ${left}%;
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border-radius: ${isCircle ? '50%' : '2px'};
        animation: confettiFall ${duration}s ease-in ${delay}s forwards;
        opacity: 0;
      `
      container.appendChild(piece)
    }

    // Remove the container after all animations finish (~3.5s total)
    setTimeout(() => {
      container.remove()
    }, 3500)
  }, [])

  // ── Finish handler ────────────────────────────────────────

  function handleFinish() {
    if (isFinishing) return  // prevent double-clicks

    // 1. Save Step 6 data to the store
    setFinalStep({
      wantsMentor: role === 'newcomer' ? wantsMentor : false,
      goals:       role !== 'newcomer' ? goals.trim() : '',
    })

    // 2. Trigger confetti
    setIsFinishing(true)
    launchConfetti()

    // 3. Navigate to dashboard after a short celebration pause
    setTimeout(() => {
      navigate('/dashboard')
    }, 1800)
  }

  // ── Shared styles ─────────────────────────────────────────

  const sectionLabel: React.CSSProperties = {
    fontSize: '0.7rem',
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    color: 'var(--text-tertiary)',
    marginBottom: '0.75rem',
  }

  // ════════════════════════════════════════════════════════
  //  NEWCOMER RENDER
  // ════════════════════════════════════════════════════════

  if (role === 'newcomer') {
    return (
      <div className="flex flex-col gap-6">

        {/* Heading */}
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Would you like a mentor?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            A mentor can guide you through your first contribution and answer questions.
          </p>
        </div>

        {/* ── Two option cards ──────────────────────────────── */}
        <div className="flex flex-col gap-3">

          {/* Yes card */}
          <MentorCard
            icon={<UserCheck size={26} />}
            title="Yes, match me with a mentor"
            description="We'll pair you with an experienced contributor who shares your tech stack."
            selected={wantsMentor === true}
            onClick={() => setWantsMentor(true)}
          />

          {/* No card */}
          <MentorCard
            icon={<Compass size={26} />}
            title="No thanks, I'll explore on my own"
            description="You can always request a mentor later from your profile settings."
            selected={wantsMentor === false}
            onClick={() => setWantsMentor(false)}
          />
        </div>

        {/* Teal info note — only visible when "Yes" is selected */}
        {wantsMentor && (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              padding: '0.875rem 1rem',
              backgroundColor: 'var(--accent-glow)',
              border: '1px solid var(--accent-primary)',
              borderRadius: 'var(--radius-md)',
              // Fade in smoothly
              animation: 'fadeSlideIn 0.25s ease',
            }}
          >
            <style>{`
              @keyframes fadeSlideIn {
                from { opacity: 0; transform: translateY(6px); }
                to   { opacity: 1; transform: translateY(0); }
              }
            `}</style>
            <Users size={18} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ fontSize: '0.875rem', color: 'var(--accent-primary)', fontFamily: 'var(--font-display)', lineHeight: 1.5 }}>
              We'll find a mentor with <strong>≥ 60% skill overlap</strong> with yours. You'll receive a match notification within 24 hours.
            </p>
          </div>
        )}

        <FinishButton isFinishing={isFinishing} onClick={handleFinish} />
      </div>
    )
  }

  // ════════════════════════════════════════════════════════
  //  CONTRIBUTOR / MAINTAINER RENDER
  // ════════════════════════════════════════════════════════

  return (
    <div className="flex flex-col gap-6">

      {/* Heading */}
      <div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          Almost there!
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          One last optional question to personalise your experience.
        </p>
      </div>

      {/* Goals textarea */}
      <div>
        <p style={sectionLabel}>
          What are your goals for the next 3 months?{' '}
          <span style={{ color: 'var(--text-tertiary)', textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
        </p>
        <div style={{ position: 'relative' }}>
          <textarea
            value={goals}
            onChange={(e) => {
              if (e.target.value.length <= GOALS_MAX) setGoals(e.target.value)
            }}
            placeholder={
              role === 'maintainer'
                ? 'e.g. Grow my project to 100 contributors, improve CI/CD pipeline, write better docs…'
                : 'e.g. Merge my first PR, learn Rust basics, contribute to a CLI tool I use daily…'
            }
            rows={6}
            style={{
              width: '100%',
              padding: '0.875rem 1rem',
              paddingBottom: '2.25rem',   // room for counter
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
              fontSize: '0.95rem',
              lineHeight: 1.65,
              outline: 'none',
              resize: 'none',
              transition: 'border-color 0.15s ease',
            }}
            onFocus={(e) => {
              (e.target as HTMLTextAreaElement).style.borderColor = 'var(--border-active)'
            }}
            onBlur={(e) => {
              (e.target as HTMLTextAreaElement).style.borderColor = 'var(--border-default)'
            }}
          />
          {/* Live character counter */}
          <span
            style={{
              position: 'absolute',
              bottom: '0.6rem',
              right: '0.75rem',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              color: goals.length >= GOALS_MAX - 30
                ? 'var(--state-error)'
                : 'var(--text-tertiary)',
            }}
          >
            {goals.length} / {GOALS_MAX}
          </span>
        </div>
      </div>

      <FinishButton isFinishing={isFinishing} onClick={handleFinish} />
    </div>
  )
}

// ════════════════════════════════════════════════════════════
//  SUB-COMPONENTS
// ════════════════════════════════════════════════════════════

// ── Mentor option card ────────────────────────────────────
// The two big clickable cards in the newcomer view.

function MentorCard({
  icon,
  title,
  description,
  selected,
  onClick,
}: {
  icon: React.ReactNode
  title: string
  description: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '1rem',
        width: '100%',
        padding: '1.25rem 1.5rem',
        textAlign: 'left',
        cursor: 'pointer',
        backgroundColor: selected ? 'var(--accent-glow)' : 'var(--bg-elevated)',
        border: `2px solid ${selected ? 'var(--accent-primary)' : 'var(--border-default)'}`,
        borderRadius: 'var(--radius-lg)',
        boxShadow: selected ? 'var(--shadow-glow)' : 'none',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Icon */}
      <span
        style={{
          color: selected ? 'var(--accent-primary)' : 'var(--text-secondary)',
          flexShrink: 0,
          marginTop: '2px',
          transition: 'color 0.2s ease',
        }}
      >
        {icon}
      </span>

      {/* Text */}
      <span className="flex flex-col gap-1">
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: '1rem',
            color: selected ? 'var(--accent-primary)' : 'var(--text-primary)',
            transition: 'color 0.2s ease',
          }}
        >
          {title}
        </span>
        <span
          style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
          }}
        >
          {description}
        </span>
      </span>
    </button>
  )
}

// ── Finish Setup button ───────────────────────────────────
// Shows a pulsing state when finishing (during the confetti + redirect delay)

function FinishButton({
  isFinishing,
  onClick,
}: {
  isFinishing: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      disabled={isFinishing}
      style={{
        width: '100%',
        padding: '0.875rem',
        borderRadius: 'var(--radius-md)',
        border: 'none',
        cursor: isFinishing ? 'default' : 'pointer',
        fontFamily: 'var(--font-display)',
        fontWeight: 600,
        fontSize: '1rem',
        backgroundColor: 'var(--accent-primary)',
        color: 'var(--text-inverse)',
        transition: 'all 0.2s ease',
        boxShadow: 'var(--shadow-glow)',
        // Pulse animation while the confetti plays
        animation: isFinishing ? 'pulse 0.8s ease-in-out infinite' : 'none',
      }}
    >
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.6; }
        }
      `}</style>
      {isFinishing ? '🎉 Setting up your account…' : 'Finish Setup 🎉'}
    </button>
  )
}
