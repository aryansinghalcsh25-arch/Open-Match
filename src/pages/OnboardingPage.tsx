// ============================================================
// OnboardingPage.tsx
// ============================================================
// This is the full-screen page that wraps the entire wizard.
//
// It is responsible for:
//   1. The OpenMatch logo (top left)
//   2. The thin teal progress bar at the very top of the screen
//   3. The "Step X of 6" label above the card heading
//   4. The centered white card (max-width 560px) that holds the step
//   5. The Back button (only shown on Step 2+)
//   6. Rendering the correct step component based on currentStep
//
// Think of this page as the "frame" of the wizard.
// Each step component (StepRoleSelection, StepProfileBasics, etc.)
// only worries about its own content — not the progress bar or logo.
// ============================================================

import { ChevronLeft } from 'lucide-react'
import { useOnboardingStore } from '../store/onboardingStore'
import StepRoleSelection from '../components/onboarding/StepRoleSelection'
import StepProfileBasics from '../components/onboarding/StepProfileBasics'
import StepGitHubImport from '../components/onboarding/StepGitHubImport'
import StepSkillAssessment from '../components/onboarding/StepSkillAssessment'
import StepSkillGap from '../components/onboarding/StepSkillGap'
import StepMentor from '../components/onboarding/StepMentor'

// ---- Step labels ------------------------------------------
//
// These are the human-readable names for each step.
// We use them to show "Step 1 of 6 — Role Selection" etc.

const STEP_LABELS: Record<number, string> = {
  1: 'Role Selection',
  2: 'Profile Basics',
  3: 'GitHub Import',
  4: 'Skill Assessment',
  5: 'Preferences',
  6: 'Final Step',
}

// ---- Component --------------------------------------------

export default function OnboardingPage() {
  // Read the current step and the "go back" action from the store
  const { currentStep, prevStep } = useOnboardingStore()

  // Calculate progress percentage for the top bar
  // Step 1 = 16.67%, Step 6 = 100%
  const progressPercent = (currentStep / 6) * 100

  // ── Which step component do we render? ────────────────────
  //
  // As we build more steps, we'll add them here.
  // For now, only Step 1 exists.
  function renderStep() {
    switch (currentStep) {
      case 1:
        return <StepRoleSelection />
      case 2:
        return <StepProfileBasics />
      case 3:
        return <StepGitHubImport />
      case 4:
        return <StepSkillAssessment />
      case 5:
        return <StepSkillGap />
      case 6:
        return <StepMentor />
      default:
        return null
    }
  }

  return (
    // ── Full-screen dark background ────────────────────────
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-base)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >

      {/* ── Thin teal progress bar at very top ───────────── */}
      {/*
        This is TWO divs stacked:
          Outer div = the gray track (full width)
          Inner div = the teal fill (grows as steps progress)
      */}
      <div
        style={{
          position: 'fixed',   // Stays at top even when page scrolls
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          backgroundColor: 'var(--border-default)',
          zIndex: 50,          // Sits above everything else
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progressPercent}%`,
            backgroundColor: 'var(--accent-primary)',
            transition: 'width 0.4s ease',   // Smooth grow animation
            boxShadow: 'var(--shadow-glow)',   // Teal glow on the bar
          }}
        />
      </div>

      {/* ── Logo row ─────────────────────────────────────── */}
      <header
        style={{
          padding: '1.5rem 2rem',
          paddingTop: 'calc(1.5rem + 3px)',   // offset for the progress bar
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '1.25rem',
            color: 'var(--accent-primary)',
            letterSpacing: '-0.02em',
          }}
        >
          Open<span style={{ color: 'var(--text-primary)' }}>Match</span>
        </span>
      </header>

      {/* ── Main content area ────────────────────────────── */}
      {/*
        `flex: 1` makes this div take all remaining vertical space,
        centering the card both horizontally and vertically.
      */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',      // Center vertically
          justifyContent: 'center',  // Center horizontally
          padding: '2rem 1rem',      // Side padding for mobile
        }}
      >

        {/* ── Card ──────────────────────────────────────── */}
        {/*
          max-width 560px keeps the form readable on wide screens.
          On mobile it fills 100% of available width.
        */}
        <div
          style={{
            width: '100%',
            maxWidth: '560px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem',
            boxShadow: 'var(--shadow-modal)',
          }}
        >

          {/* ── Card top row: Back button + Step label ──── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '1.75rem',
              gap: '1rem',
            }}
          >

            {/* Back button — only visible on Step 2+ */}
            {currentStep > 1 && (
              <button
                onClick={prevStep}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.875rem',
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  // Highlight on hover — JavaScript inline hover trick
                  // (CSS hover pseudo-class doesn't work with inline styles)
                  ;(e.currentTarget as HTMLButtonElement).style.color =
                    'var(--text-primary)'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.color =
                    'var(--text-secondary)'
                }}
              >
                <ChevronLeft size={16} />
                Back
              </button>
            )}

            {/* Step counter — "Step 1 of 6 — Role Selection" */}
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                letterSpacing: '0.05em',
                marginLeft: currentStep === 1 ? '0' : 'auto',
                //                               ^^^^^^^^^^
                // On Step 1: flush left (no Back button).
                // On Step 2+: push to the right of the Back button.
              }}
            >
              Step {currentStep} of 6 &mdash; {STEP_LABELS[currentStep]}
            </span>
          </div>

          {/* ── The actual step content ──────────────────── */}
          {renderStep()}

        </div>
      </main>
    </div>
  )
}
