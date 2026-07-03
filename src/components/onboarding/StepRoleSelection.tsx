// ============================================================
// StepRoleSelection.tsx
// ============================================================
// This is the UI for Step 1 of the onboarding wizard.
//
// What it shows:
//   - A heading: "How will you use OpenMatch?"
//   - 3 large clickable cards (one per role)
//   - A [Continue] button — disabled until a card is picked
//
// How it works:
//   1. The user clicks a card → we call setRole() from the store
//   2. The selected card gets a teal border + teal glow
//   3. Once a card is selected, the Continue button becomes active
//   4. Clicking Continue calls nextStep() to go to Step 2
// ============================================================

import { Shield, Code2, Sprout } from 'lucide-react'
import { useOnboardingStore, type UserRole } from '../../store/onboardingStore'

// ---- Role card data ---------------------------------------
//
// Instead of copy-pasting 3 nearly-identical JSX blocks,
// we define an array of objects. Then we loop over them with .map()
// to render the cards. This keeps the code clean and easy to change.

interface RoleOption {
  id: UserRole           // The value saved to the store
  icon: React.ReactNode  // The Lucide icon component
  title: string          // Big bold text on the card
  description: string    // Smaller gray text below the title
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    id: 'maintainer',
    icon: <Shield size={28} />,
    title: "I'm a Project Maintainer",
    description:
      'I run an open-source project and want to find talented contributors who match my tech stack.',
  },
  {
    id: 'contributor',
    icon: <Code2 size={28} />,
    title: "I'm an Experienced Contributor",
    description:
      'I have open-source experience and want to discover meaningful projects to work on.',
  },
  {
    id: 'newcomer',
    icon: <Sprout size={28} />,
    title: "I'm a Newcomer to Open Source",
    description:
      'I want to make my first contribution with guidance, a mentor, and a clear learning path.',
  },
]

// ---- Component --------------------------------------------

export default function StepRoleSelection() {
  // Read data and actions from the shared store
  // `data.role` = what's currently selected (or null)
  // `setRole`   = function to save a selection
  // `nextStep`  = function to advance to Step 2
  const { data, setRole, nextStep } = useOnboardingStore()

  return (
    <div className="flex flex-col gap-6">

      {/* ── Heading ───────────────────────────────────────── */}
      <div>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.5rem',       // 24px — clear and readable
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '0.5rem',
          }}
        >
          How will you use OpenMatch?
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Choose your role. This personalises your entire experience.
        </p>
      </div>

      {/* ── Role Cards ────────────────────────────────────── */}
      {/*
        We loop over ROLE_OPTIONS and render a card for each.
        `key` is required by React whenever you use .map() — it
        helps React track which card is which.
      */}
      <div className="flex flex-col gap-3">
        {ROLE_OPTIONS.map((option) => {
          const isSelected = data.role === option.id  // Is THIS card selected?

          return (
            <button
              key={option.id}
              onClick={() => setRole(option.id)}
              style={{
                // Layout
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                width: '100%',
                padding: '1.25rem 1.5rem',
                textAlign: 'left',
                cursor: 'pointer',

                // Colors — switch between selected and default
                backgroundColor: isSelected
                  ? 'var(--accent-glow)'    // very subtle teal tint
                  : 'var(--bg-elevated)',   // dark gray surface

                // Border — teal when selected, gray when not
                border: `2px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-default)'}`,
                borderRadius: 'var(--radius-lg)',   // 12px rounded corners

                // Glow effect when selected
                boxShadow: isSelected ? 'var(--shadow-glow)' : 'none',

                // Smooth transition when selection changes
                transition: 'all 0.2s ease',
              }}
            >
              {/* Icon — colored teal if selected, gray otherwise */}
              <span
                style={{
                  color: isSelected ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  flexShrink: 0,      // Don't let the icon shrink
                  marginTop: '2px',   // Align with first line of text
                  transition: 'color 0.2s ease',
                }}
              >
                {option.icon}
              </span>

              {/* Text */}
              <span className="flex flex-col gap-1">
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                    fontSize: '1rem',
                    color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)',
                    transition: 'color 0.2s ease',
                  }}
                >
                  {option.title}
                </span>
                <span
                  style={{
                    fontSize: '0.875rem',   // 14px — smaller than title
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                  }}
                >
                  {option.description}
                </span>
              </span>
            </button>
          )
        })}
      </div>

      {/* ── Continue Button ───────────────────────────────── */}
      {/*
        This button is:
          - DISABLED (grayed, not clickable) if no role is selected
          - ACTIVE (teal) once a role is chosen

        `disabled` is a native HTML attribute. When true, the button
        cannot be clicked and gets a "not-allowed" cursor automatically.
      */}
      <button
        onClick={nextStep}
        disabled={data.role === null}
        style={{
          // Layout
          width: '100%',
          padding: '0.875rem',
          borderRadius: 'var(--radius-md)',
          border: 'none',
          cursor: data.role === null ? 'not-allowed' : 'pointer',
          fontFamily: 'var(--font-display)',
          fontWeight: 600,
          fontSize: '1rem',

          // Active vs disabled colors
          backgroundColor: data.role === null
            ? 'var(--bg-elevated)'
            : 'var(--accent-primary)',
          color: data.role === null
            ? 'var(--text-tertiary)'
            : 'var(--text-inverse)',   // dark text on teal button

          // Transition for smooth enable/disable
          transition: 'all 0.2s ease',
          boxShadow: data.role !== null ? 'var(--shadow-glow)' : 'none',
        }}
      >
        Continue →
      </button>
    </div>
  )
}
