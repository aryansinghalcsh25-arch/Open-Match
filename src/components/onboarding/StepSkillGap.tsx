// ============================================================
// StepSkillGap.tsx
// ============================================================
// Step 5 of the onboarding wizard.
//
// This step renders DIFFERENT content based on the user's role:
//
//   role === 'newcomer'
//     → "Here's your path to your first contribution"
//       - Top 5 matched open-source projects with overlap %
//       - Skill gap cards: what to learn + learning resources
//
//   role === 'contributor' | 'maintainer'
//     → "Set your preferences"
//       - Project type checkboxes (Libraries, CLI Tools, etc.)
//       - Contribution type checkboxes (Bug fixes, Features, etc.)
//       - Availability dropdown
//
// The [Continue] button is ALWAYS enabled on this step — no
// required fields. The user can proceed with zero selections.
// ============================================================

import { useState } from 'react'
import { BookOpen, ExternalLink, CheckSquare, Square } from 'lucide-react'
import {
  useOnboardingStore,
  type PreferencesPayload,
} from '../../store/onboardingStore'

// ════════════════════════════════════════════════════════════
//  NEWCOMER DATA — mock projects + learning resources
// ════════════════════════════════════════════════════════════

interface MockProject {
  name: string
  description: string
  language: string
  languageColor: string
  overlap: number   // % of user's skills that match
  stars: string
}

// Realistic-looking open-source projects a newcomer could contribute to.
// When the backend exists, this will come from a real matching API.
const MOCK_PROJECTS: MockProject[] = [
  {
    name: 'freeCodeCamp',
    description: 'Learn to code with a free, self-paced curriculum.',
    language: 'JavaScript',
    languageColor: '#F7DF1E',
    overlap: 88,
    stars: '405k',
  },
  {
    name: 'react',
    description: 'A declarative, component-based UI library.',
    language: 'TypeScript',
    languageColor: '#3178C6',
    overlap: 74,
    stars: '228k',
  },
  {
    name: 'excalidraw',
    description: 'Virtual whiteboard for sketching diagrams.',
    language: 'TypeScript',
    languageColor: '#3178C6',
    overlap: 70,
    stars: '91k',
  },
  {
    name: 'cal.com',
    description: 'Open-source scheduling infrastructure.',
    language: 'TypeScript',
    languageColor: '#3178C6',
    overlap: 65,
    stars: '33k',
  },
  {
    name: 'appwrite',
    description: 'Self-hosted backend-as-a-service platform.',
    language: 'TypeScript',
    languageColor: '#3178C6',
    overlap: 58,
    stars: '45k',
  },
]

interface LearningResource {
  skill: string
  provider: string
  duration: string
  url: string
  addedToPath: boolean
}

// Skills the newcomer might be missing + where to learn them
const INITIAL_RESOURCES: LearningResource[] = [
  { skill: 'Git & GitHub',    provider: 'GitHub Docs',          duration: '1 week',   url: 'https://docs.github.com', addedToPath: false },
  { skill: 'Open Source 101', provider: 'opensource.guide',     duration: '2 days',   url: 'https://opensource.guide', addedToPath: false },
  { skill: 'TypeScript',      provider: 'TypeScript Handbook',  duration: '2 weeks',  url: 'https://typescriptlang.org/docs', addedToPath: false },
  { skill: 'React',           provider: 'react.dev',            duration: '3 weeks',  url: 'https://react.dev/learn', addedToPath: false },
]

// ════════════════════════════════════════════════════════════
//  CONTRIBUTOR / MAINTAINER DATA — preference options
// ════════════════════════════════════════════════════════════

const PROJECT_TYPES = [
  'Libraries', 'CLI Tools', 'Web Apps',
  'Data Science', 'DevOps', 'Documentation',
]

const CONTRIBUTION_TYPES = [
  'Bug fixes', 'Features', 'Documentation',
  'Tests', 'Code review',
]

const AVAILABILITY_OPTIONS = [
  '< 2 hrs / week',
  '2 – 5 hrs / week',
  '5 – 10 hrs / week',
  '> 10 hrs / week',
]

// ════════════════════════════════════════════════════════════
//  SMALL HELPERS
// ════════════════════════════════════════════════════════════

// Returns a color for an overlap percentage bar
function overlapColor(pct: number): string {
  if (pct >= 75) return 'var(--state-success)'   // green — great match
  if (pct >= 55) return 'var(--accent-primary)'  // teal  — good match
  return 'var(--accent-secondary)'               // blue  — decent match
}

// A reusable checkbox row (used in contributor/maintainer section)
function CheckRow({
  label,
  checked,
  onToggle,
}: {
  label: string
  checked: boolean
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '6px 0',
        textAlign: 'left',
        width: '100%',
      }}
    >
      {checked
        ? <CheckSquare size={17} color="var(--accent-primary)" />
        : <Square size={17} color="var(--text-tertiary)" />
      }
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '0.9rem',
          color: checked ? 'var(--text-primary)' : 'var(--text-secondary)',
          transition: 'color 0.15s',
        }}
      >
        {label}
      </span>
    </button>
  )
}

// ════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ════════════════════════════════════════════════════════════

export default function StepSkillGap() {
  const { data, setPreferences, nextStep } = useOnboardingStore()
  const role = data.role

  // ── State for contributor / maintainer ────────────────────
  const [projectTypes, setProjectTypes]         = useState<string[]>(data.projectTypes)
  const [contributionTypes, setContributionTypes] = useState<string[]>(data.contributionTypes)
  const [availability, setAvailability]         = useState(data.availability)

  // ── State for newcomer ────────────────────────────────────
  const [resources, setResources] = useState<LearningResource[]>(INITIAL_RESOURCES)

  // ── Toggle helpers (for checkboxes) ──────────────────────
  // If the item is already in the array, remove it.
  // If it's not, add it. Classic toggle pattern.
  function toggleItem(list: string[], item: string, setter: (v: string[]) => void) {
    setter(
      list.includes(item)
        ? list.filter((x) => x !== item)
        : [...list, item]
    )
  }

  // ── "Add to path" handler (newcomer) ─────────────────────
  function togglePath(skill: string) {
    setResources((prev) =>
      prev.map((r) =>
        r.skill === skill ? { ...r, addedToPath: !r.addedToPath } : r
      )
    )
  }

  // ── Continue ──────────────────────────────────────────────
  function handleContinue() {
    if (role !== 'newcomer') {
      // Save preferences for contributor / maintainer
      const payload: PreferencesPayload = { projectTypes, contributionTypes, availability }
      setPreferences(payload)
    }
    // For newcomers we don't save anything extra here — just advance
    nextStep()
  }

  // ── Shared section label style ────────────────────────────
  const sectionLabel: React.CSSProperties = {
    fontSize: '0.7rem',
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    color: 'var(--text-tertiary)',
    marginBottom: '0.6rem',
    marginTop: '0.25rem',
  }

  // ════════════════════════════════════════════════════════
  //  NEWCOMER RENDER
  // ════════════════════════════════════════════════════════

  if (role === 'newcomer') {
    return (
      <div className="flex flex-col gap-5">

        {/* Heading */}
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Here's your path to your first contribution
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Based on your skills, these projects are a great starting point.
          </p>
        </div>

        {/* ── Top matched projects ───────────────────────── */}
        <div>
          <p style={sectionLabel}>Top matches for you</p>
          <div className="flex flex-col gap-3">
            {MOCK_PROJECTS.map((project) => (
              <div
                key={project.name}
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1rem 1.25rem',
                }}
              >
                {/* Top row: name + overlap % */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                  <div>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                      {project.name}
                    </span>
                    <span style={{ marginLeft: '8px', fontSize: '0.78rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                      ★ {project.stars}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      color: overlapColor(project.overlap),
                    }}
                  >
                    {project.overlap}% match
                  </span>
                </div>

                {/* Description */}
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                  {project.description}
                </p>

                {/* Overlap bar */}
                <div style={{ height: '4px', backgroundColor: 'var(--border-default)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${project.overlap}%`,
                      backgroundColor: overlapColor(project.overlap),
                      borderRadius: '2px',
                      transition: 'width 0.6s ease',
                    }}
                  />
                </div>

                {/* Bottom row: language dot */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '0.5rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: project.languageColor, display: 'inline-block' }} />
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                    {project.language}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Learning resources ─────────────────────────── */}
        <div>
          <p style={sectionLabel}>Fill your skill gaps</p>
          <div className="flex flex-col gap-3">
            {resources.map((r) => (
              <div
                key={r.skill}
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  border: `1px solid ${r.addedToPath ? 'var(--accent-primary)' : 'var(--border-default)'}`,
                  borderRadius: 'var(--radius-lg)',
                  padding: '0.9rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'border-color 0.2s ease',
                }}
              >
                <BookOpen size={18} color={r.addedToPath ? 'var(--accent-primary)' : 'var(--text-tertiary)'} style={{ flexShrink: 0 }} />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    {r.skill}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', gap: '8px', marginTop: '2px', flexWrap: 'wrap' }}>
                    <span>{r.provider}</span>
                    <span style={{ color: 'var(--text-tertiary)' }}>·</span>
                    <span>{r.duration}</span>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--accent-secondary)', display: 'inline-flex', alignItems: 'center', gap: '3px', textDecoration: 'none' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Open <ExternalLink size={11} />
                    </a>
                  </div>
                </div>

                {/* Add to path toggle button */}
                <button
                  onClick={() => togglePath(r.skill)}
                  style={{
                    flexShrink: 0,
                    padding: '5px 12px',
                    borderRadius: 'var(--radius-full)',
                    border: `1px solid ${r.addedToPath ? 'var(--accent-primary)' : 'var(--border-default)'}`,
                    backgroundColor: r.addedToPath ? 'var(--accent-glow)' : 'transparent',
                    color: r.addedToPath ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {r.addedToPath ? '✓ Added' : '+ Add to path'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Continue */}
        <ContinueButton onClick={handleContinue} />
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
          Set your preferences
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Help us surface the right projects for you. All fields are optional.
        </p>
      </div>

      {/* ── Project types ─────────────────────────────────── */}
      <div>
        <p style={sectionLabel}>What types of projects interest you?</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
          {PROJECT_TYPES.map((type) => (
            <CheckRow
              key={type}
              label={type}
              checked={projectTypes.includes(type)}
              onToggle={() => toggleItem(projectTypes, type, setProjectTypes)}
            />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid var(--border-default)' }} />

      {/* ── Contribution types ────────────────────────────── */}
      <div>
        <p style={sectionLabel}>What kind of contributions do you make?</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
          {CONTRIBUTION_TYPES.map((type) => (
            <CheckRow
              key={type}
              label={type}
              checked={contributionTypes.includes(type)}
              onToggle={() => toggleItem(contributionTypes, type, setContributionTypes)}
            />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid var(--border-default)' }} />

      {/* ── Availability ──────────────────────────────────── */}
      <div>
        <p style={sectionLabel}>How much time can you give per week?</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {AVAILABILITY_OPTIONS.map((option) => {
            const isSelected = availability === option
            return (
              <button
                key={option}
                onClick={() => setAvailability(isSelected ? '' : option)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '6px 0',
                  textAlign: 'left',
                }}
              >
                {/* Radio dot */}
                <span
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    border: `2px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-default)'}`,
                    backgroundColor: isSelected ? 'var(--accent-primary)' : 'transparent',
                    flexShrink: 0,
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {isSelected && (
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--text-inverse)',
                      }}
                    />
                  )}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.9rem',
                    color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                    transition: 'color 0.15s',
                  }}
                >
                  {option}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Continue */}
      <ContinueButton onClick={handleContinue} />
    </div>
  )
}

// ── Shared Continue button ────────────────────────────────
// Extracted so both branches (newcomer + contributor) use the same button.
// Step 5's Continue is ALWAYS enabled.

function ContinueButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
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
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.9' }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '1' }}
    >
      Continue →
    </button>
  )
}
