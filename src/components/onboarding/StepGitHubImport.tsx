// ============================================================
// StepGitHubImport.tsx
// ============================================================
// Step 3 of the onboarding wizard — GitHub Profile Import
//
// What it shows:
//   PHASE 1 — Loading (2.5 seconds):
//     - Animated teal spinner ring
//     - Text crawl: lines of mono-font status messages that
//       appear one by one, like a terminal output
//
//   PHASE 2 — Results (after loading):
//     - Language pills (TypeScript, Go, Python, etc.)
//     - Repo count card
//     - PR count card
//     - Contribution bar chart (last 12 months)
//     - [Confirm & Continue] button
//     - "Skip import" link
//
// HOW THE PHASES WORK:
//   We use a `phase` state variable:
//     'loading'  → show spinner + crawl text
//     'done'     → show results
//     'error'    → show error + skip link
//
//   A `useEffect` runs once when the component mounts.
//   It uses `setTimeout` to simulate a real API call taking ~2.5s.
//   Then it sets the mock data into both local state AND the store.
// ============================================================

import { useEffect, useState } from 'react'
import { GitBranch, GitPullRequest, BookOpen, SkipForward } from 'lucide-react'
import { useOnboardingStore } from '../../store/onboardingStore'

// ---- Types ------------------------------------------------

type Phase = 'loading' | 'done' | 'error'

interface Language {
  name: string
  color: string  // Hex color for the pill
}

interface GitHubResult {
  languages: Language[]
  repoCount: number
  prCount: number
  contributions: number[]  // 12 values, one per month
}

// ---- Mock data --------------------------------------------
// This simulates what a real GitHub API would return.
// When real auth is wired up later, replace this with actual API data.

const MOCK_RESULT: GitHubResult = {
  languages: [
    { name: 'TypeScript', color: '#3178C6' },
    { name: 'Python',     color: '#3572A5' },
    { name: 'Go',         color: '#00ADD8' },
    { name: 'Rust',       color: '#DEA584' },
    { name: 'CSS',        color: '#563D7C' },
    { name: 'Shell',      color: '#89E051' },
  ],
  repoCount: 47,
  prCount: 132,
  // Contribution activity for Jan–Dec (higher = more active)
  contributions: [12, 8, 19, 24, 31, 27, 14, 9, 22, 36, 29, 41],
}

// ---- Crawl messages ---------------------------------------
// These appear one by one during the loading phase,
// like a terminal printing output.

const CRAWL_MESSAGES = [
  'Connecting to GitHub API…',
  'Fetching public profile…',
  'Scanning repositories…',
  `Analyzing ${MOCK_RESULT.repoCount} repos…`,
  'Detecting languages and frameworks…',
  `Counting merged pull requests…`,
  'Building contribution graph…',
  'Almost done…',
]

// Month labels for the bar chart x-axis
const MONTHS = ['J','F','M','A','M','J','J','A','S','O','N','D']

// ---- Component --------------------------------------------

export default function StepGitHubImport() {
  const { setGitHubData, nextStep } = useOnboardingStore()

  // Which UI phase are we in?
  const [phase, setPhase]       = useState<Phase>('loading')

  // The final GitHub data (set when loading finishes)
  const [result, setResult]     = useState<GitHubResult | null>(null)

  // Which crawl messages have appeared so far
  const [visibleLines, setVisibleLines] = useState<string[]>([])

  // ── Simulate the import on mount ─────────────────────────
  //
  // `useEffect` with an empty `[]` dependency array runs
  // exactly once — right after the component first appears on screen.
  // This is the right place for "do something when page loads" logic.

  useEffect(() => {
    // Show crawl messages one by one, 280ms apart
    const timers: ReturnType<typeof setTimeout>[] = []

    CRAWL_MESSAGES.forEach((msg, i) => {
      timers.push(
        setTimeout(() => {
          // Add the next message to the visible list
          setVisibleLines((prev) => [...prev, msg])
        }, i * 280)
      )
    })

    // After all messages shown + a short pause, reveal results
    timers.push(
      setTimeout(() => {
        setResult(MOCK_RESULT)
        setPhase('done')

        // Also save to the Zustand store right away
        setGitHubData({
          githubImported: true,
          githubLanguages: MOCK_RESULT.languages,
          githubRepoCount: MOCK_RESULT.repoCount,
          githubPrCount: MOCK_RESULT.prCount,
          githubContributions: MOCK_RESULT.contributions,
        })
      }, CRAWL_MESSAGES.length * 280 + 600)
    )

    // Cleanup: if the component is removed before timers fire,
    // cancel them to avoid memory leaks.
    return () => timers.forEach(clearTimeout)
  }, [setGitHubData])  // Empty array = run once on mount

  // ── Skip handler ──────────────────────────────────────────
  // If the user clicks "Skip import", we save empty data and advance.

  function handleSkip() {
    setGitHubData({
      githubImported: false,
      githubLanguages: [],
      githubRepoCount: 0,
      githubPrCount: 0,
      githubContributions: [],
    })
    nextStep()
  }

  // ── Bar chart helper ──────────────────────────────────────
  // The contribution chart is just a row of <div> bars.
  // Each bar's height is a percentage of the tallest bar (max value).

  function ContributionChart({ data }: { data: number[] }) {
    const maxVal = Math.max(...data)  // Find the tallest bar

    return (
      <div>
        {/* Bars */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '4px',
            height: '64px',
          }}
        >
          {data.map((val, i) => (
            <div
              key={i}
              title={`${MONTHS[i]}: ${val} contributions`}
              style={{
                flex: 1,
                // Height is proportional to the max value
                height: `${(val / maxVal) * 100}%`,
                minHeight: '4px',
                backgroundColor: 'var(--accent-primary)',
                borderRadius: '2px 2px 0 0',
                opacity: 0.75,
                transition: 'opacity 0.15s ease',
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.opacity = '1'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.opacity = '0.75'
              }}
            />
          ))}
        </div>

        {/* Month labels */}
        <div
          style={{
            display: 'flex',
            gap: '4px',
            marginTop: '4px',
          }}
        >
          {MONTHS.map((m, i) => (
            <span
              key={i}
              style={{
                flex: 1,
                textAlign: 'center',
                fontSize: '0.65rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-tertiary)',
              }}
            >
              {m}
            </span>
          ))}
        </div>
      </div>
    )
  }

  // ── Render ────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-6">

      {/* ── Heading ───────────────────────────────────────── */}
      <div>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '0.5rem',
          }}
        >
          {phase === 'loading'
            ? 'Importing your GitHub profile…'
            : 'Here\'s what we found'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          {phase === 'loading'
            ? 'This only takes a moment.'
            : 'Confirm your GitHub stats below. We\'ll use these to match you with projects.'}
        </p>
      </div>

      {/* ════════════════════════════════════════════════════ */}
      {/*  PHASE: LOADING                                      */}
      {/* ════════════════════════════════════════════════════ */}
      {phase === 'loading' && (
        <div className="flex flex-col gap-5">

          {/* Spinner ring */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                border: '3px solid var(--border-default)',
                borderTopColor: 'var(--accent-primary)',
                animation: 'spin 0.9s linear infinite',
              }}
            />
          </div>

          {/* CSS for the spin animation — injected inline */}
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
            @keyframes fadeSlideIn {
              from { opacity: 0; transform: translateY(4px); }
              to   { opacity: 1; transform: translateY(0); }
            }
          `}</style>

          {/* Crawl text — terminal-style messages */}
          <div
            style={{
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem 1.25rem',
              minHeight: '140px',
            }}
          >
            {visibleLines.map((line, i) => (
              <div
                key={i}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  color: i === visibleLines.length - 1
                    ? 'var(--accent-primary)'    // Latest line is teal
                    : 'var(--text-secondary)',   // Older lines are gray
                  lineHeight: 1.7,
                  animation: 'fadeSlideIn 0.25s ease',
                }}
              >
                {/* Leading angle bracket — terminal prompt look */}
                <span style={{ color: 'var(--text-tertiary)', marginRight: '8px' }}>›</span>
                {line}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════ */}
      {/*  PHASE: DONE — show results                          */}
      {/* ════════════════════════════════════════════════════ */}
      {phase === 'done' && result && (
        <div className="flex flex-col gap-4">

          {/* ── Languages detected ──────────────────────── */}
          <div
            style={{
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
            }}
          >
            <div
              style={{
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-secondary)',
                marginBottom: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Languages detected
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {result.languages.map((lang) => (
                <span
                  key={lang.name}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: `${lang.color}22`,  // color at ~13% opacity
                    border: `1px solid ${lang.color}55`,  // color at ~33% opacity
                    fontSize: '0.8rem',
                    fontFamily: 'var(--font-mono)',
                    color: lang.color,
                    fontWeight: 500,
                  }}
                >
                  {/* Color dot */}
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: lang.color,
                      flexShrink: 0,
                    }}
                  />
                  {lang.name}
                </span>
              ))}
            </div>
          </div>

          {/* ── Repo + PR counts (side by side) ─────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>

            {/* Repo count */}
            <div
              style={{
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <BookOpen size={22} color="var(--accent-secondary)" />
              <div>
                <div
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-display)',
                    color: 'var(--text-primary)',
                    lineHeight: 1,
                  }}
                >
                  {result.repoCount}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  public repos
                </div>
              </div>
            </div>

            {/* PR count */}
            <div
              style={{
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <GitPullRequest size={22} color="var(--accent-primary)" />
              <div>
                <div
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-display)',
                    color: 'var(--text-primary)',
                    lineHeight: 1,
                  }}
                >
                  {result.prCount}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  merged PRs
                </div>
              </div>
            </div>
          </div>

          {/* ── Contribution sparkline ───────────────────── */}
          <div
            style={{
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '1rem',
              }}
            >
              <GitBranch size={16} color="var(--text-secondary)" />
              <span
                style={{
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                Contributions — last 12 months
              </span>
            </div>
            <ContributionChart data={result.contributions} />
          </div>

          {/* ── Confirm & Continue button ────────────────── */}
          <button
            onClick={nextStep}
            style={{
              width: '100%',
              padding: '0.875rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: '1rem',
              backgroundColor: 'var(--accent-primary)',
              color: 'var(--text-inverse)',
              transition: 'opacity 0.2s ease',
              boxShadow: 'var(--shadow-glow)',
              marginTop: '0.25rem',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = '0.9'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = '1'
            }}
          >
            Confirm & Continue →
          </button>

          {/* ── Skip link ────────────────────────────────── */}
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={handleSkip}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-display)',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'
              }}
            >
              <SkipForward size={14} />
              Skip import
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
