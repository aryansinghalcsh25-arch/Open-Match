// ============================================================
// StepSkillAssessment.tsx
// ============================================================
// Step 4 of the onboarding wizard — Skill Assessment
//
// LAYOUT (two columns side by side, stacks on mobile):
//
//  ┌────────────────────┬───────────────────────┐
//  │  🔍 Search skills  │  Your Skills (3)      │
//  │  ─────────────     │  ─────────────────    │
//  │  Languages         │  ● TypeScript  [B|I|A]│
//  │    TypeScript ✓    │  ● React       [B|I|A]│
//  │    Python          │  ● Docker  [×]        │
//  │  Frameworks        │                       │
//  │    React ✓         │                       │
//  │    …               │                       │
//  └────────────────────┴───────────────────────┘
//
// HOW IT WORKS:
//   - All skills live in a constant SKILL_CATALOG (grouped by category)
//   - Local state `added` holds the skills in the right panel
//   - Searching filters the left panel in real time
//   - Clicking a skill in left panel → adds it to right panel (Beginner default)
//   - Changing confidence on right panel → updates that skill's entry
//   - Clicking × → removes the skill from right panel
//   - Continue saves `added` to the store and advances
// ============================================================

import { useState, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import { useOnboardingStore, type SkillEntry } from '../../store/onboardingStore'

// ---- Skill catalog ----------------------------------------
// Skills grouped by category. Add more here any time.

const SKILL_CATALOG: Record<string, string[]> = {
  Languages: [
    'TypeScript', 'JavaScript', 'Python', 'Go', 'Rust',
    'Java', 'C++', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin',
    'Scala', 'Elixir', 'Haskell',
  ],
  Frameworks: [
    'React', 'Vue', 'Angular', 'Next.js', 'Svelte',
    'Express', 'Fastify', 'NestJS', 'FastAPI', 'Django',
    'Flask', 'Spring Boot', 'Rails', 'Laravel', 'Flutter',
  ],
  Databases: [
    'PostgreSQL', 'MySQL', 'SQLite', 'MongoDB', 'Redis',
    'Supabase', 'Firebase', 'Elasticsearch', 'Cassandra',
    'DynamoDB', 'CockroachDB',
  ],
  DevOps: [
    'Docker', 'Kubernetes', 'GitHub Actions', 'GitLab CI',
    'AWS', 'GCP', 'Azure', 'Terraform', 'Ansible',
    'Linux', 'Nginx', 'Prometheus', 'Grafana',
  ],
}

// Confidence levels — shown as a 3-segment selector
const CONFIDENCE_LEVELS = ['beginner', 'intermediate', 'advanced'] as const

// Human-readable short labels for the segment buttons
const CONFIDENCE_LABELS: Record<string, string> = {
  beginner:     'B',
  intermediate: 'I',
  advanced:     'A',
}

// Full label shown as a tooltip / aria-label
const CONFIDENCE_FULL: Record<string, string> = {
  beginner:     'Beginner',
  intermediate: 'Intermediate',
  advanced:     'Advanced',
}

// Color for each confidence level
const CONFIDENCE_COLORS: Record<string, string> = {
  beginner:     'var(--accent-secondary)',  // blue
  intermediate: 'var(--accent-primary)',    // teal
  advanced:     'var(--accent-gold)',       // gold
}

// ---- Component --------------------------------------------

export default function StepSkillAssessment() {
  const { data, setSkills, nextStep } = useOnboardingStore()

  // Local state — the right panel list. Pre-fill from store if user came back.
  const [added, setAdded] = useState<SkillEntry[]>(data.skills)

  // Search query typed in the left panel
  const [query, setQuery] = useState('')

  // ── Derived: filtered catalog ─────────────────────────────
  //
  // `useMemo` recalculates only when `query` or `added` changes.
  // It returns a new catalog object with matching skills only.
  // Also excludes skills already added to the right panel.

  const addedNames = new Set(added.map((s) => s.name))  // fast lookup

  const filteredCatalog = useMemo(() => {
    const q = query.toLowerCase().trim()
    const result: Record<string, string[]> = {}

    for (const [category, skills] of Object.entries(SKILL_CATALOG)) {
      const filtered = skills.filter(
        (skill) =>
          !addedNames.has(skill) &&                     // not already added
          (q === '' || skill.toLowerCase().includes(q)) // matches search
      )
      if (filtered.length > 0) {
        result[category] = filtered
      }
    }
    return result
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, added])

  // ── Add a skill ───────────────────────────────────────────
  function addSkill(name: string, category: string) {
    setAdded((prev) => [
      ...prev,
      { name, category, confidence: 'beginner' },  // default confidence
    ])
    setQuery('')  // clear search so the input resets after adding
  }

  // ── Remove a skill ────────────────────────────────────────
  function removeSkill(name: string) {
    setAdded((prev) => prev.filter((s) => s.name !== name))
  }

  // ── Change confidence ─────────────────────────────────────
  function setConfidence(name: string, confidence: SkillEntry['confidence']) {
    setAdded((prev) =>
      prev.map((s) => (s.name === name ? { ...s, confidence } : s))
    )
  }

  // ── Continue ──────────────────────────────────────────────
  function handleContinue() {
    if (added.length === 0) return  // safety guard
    setSkills(added)
    nextStep()
  }

  // ── Shared styles ─────────────────────────────────────────
  const panelStyle: React.CSSProperties = {
    backgroundColor: 'var(--bg-elevated)',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  }

  const sectionLabelStyle: React.CSSProperties = {
    fontSize: '0.7rem',
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    padding: '0.75rem 1rem 0.35rem',
  }

  // ── Render ────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-5">

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
          What are your skills?
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Search and add skills, then rate your confidence. Add at least one to continue.
        </p>
      </div>

      {/* ── Counter badge ─────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span
          style={{
            padding: '3px 12px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: added.length > 0 ? 'var(--accent-glow)' : 'transparent',
            border: `1px solid ${added.length > 0 ? 'var(--accent-primary)' : 'var(--border-default)'}`,
            fontSize: '0.8rem',
            fontFamily: 'var(--font-mono)',
            color: added.length > 0 ? 'var(--accent-primary)' : 'var(--text-tertiary)',
            transition: 'all 0.2s ease',
          }}
        >
          {added.length} {added.length === 1 ? 'skill' : 'skills'} added
        </span>
        {added.length === 0 && (
          <span style={{ fontSize: '0.8rem', color: 'var(--state-error)' }}>
            — minimum 1 required
          </span>
        )}
      </div>

      {/* ── Split panel ───────────────────────────────────── */}
      {/*
        On desktop: side by side (grid with 2 equal columns).
        On mobile (< 640px): stacked via Tailwind's sm: prefix.

        grid-template-columns is set inline for desktop,
        and Tailwind handles the mobile override via className.
      */}
      <div
        style={{ display: 'grid', gap: '12px' }}
        className="grid-cols-1 sm:grid-cols-2"
      >

        {/* ════════════════════════════════════════════════ */}
        {/*  LEFT PANEL — searchable skill list              */}
        {/* ════════════════════════════════════════════════ */}
        <div style={{ ...panelStyle, minHeight: '320px', maxHeight: '400px' }}>

          {/* Search input */}
          <div
            style={{
              padding: '0.75rem',
              borderBottom: '1px solid var(--border-default)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              position: 'sticky',
              top: 0,
              backgroundColor: 'var(--bg-elevated)',
              zIndex: 1,
            }}
          >
            <Search size={15} color="var(--text-tertiary)" style={{ flexShrink: 0 }} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search skills…"
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-display)',
                fontSize: '0.875rem',
              }}
            />
            {/* Clear button — only shown when query is not empty */}
            {query && (
              <button
                onClick={() => setQuery('')}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-tertiary)',
                  display: 'flex',
                  padding: '2px',
                }}
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Scrollable skill list by category */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {Object.entries(filteredCatalog).length === 0 ? (
              // Empty state — no skills match the search
              <div
                style={{
                  padding: '2rem 1rem',
                  textAlign: 'center',
                  color: 'var(--text-tertiary)',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-display)',
                }}
              >
                {query ? `No skills match "${query}"` : 'All skills added! 🎉'}
              </div>
            ) : (
              Object.entries(filteredCatalog).map(([category, skills]) => (
                <div key={category}>
                  {/* Category heading */}
                  <div style={sectionLabelStyle}>{category}</div>

                  {/* Skill rows */}
                  {skills.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => addSkill(skill, category)}
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.5rem 1rem',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.875rem',
                        color: 'var(--text-secondary)',
                        transition: 'background 0.15s ease, color 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLButtonElement
                        el.style.backgroundColor = 'var(--bg-overlay, rgba(33,38,45,0.8))'
                        el.style.color = 'var(--text-primary)'
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLButtonElement
                        el.style.backgroundColor = 'transparent'
                        el.style.color = 'var(--text-secondary)'
                      }}
                    >
                      + {skill}
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>

        {/* ════════════════════════════════════════════════ */}
        {/*  RIGHT PANEL — added skills with confidence      */}
        {/* ════════════════════════════════════════════════ */}
        <div style={{ ...panelStyle, minHeight: '320px', maxHeight: '400px' }}>

          {/* Panel header */}
          <div
            style={{
              padding: '0.75rem 1rem',
              borderBottom: '1px solid var(--border-default)',
              fontFamily: 'var(--font-display)',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              position: 'sticky',
              top: 0,
              backgroundColor: 'var(--bg-elevated)',
              zIndex: 1,
            }}
          >
            Your Skills
          </div>

          {/* Scrollable added skills list */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {added.length === 0 ? (
              // Empty state
              <div
                style={{
                  padding: '2rem 1rem',
                  textAlign: 'center',
                  color: 'var(--text-tertiary)',
                  fontSize: '0.85rem',
                  lineHeight: 1.6,
                  fontFamily: 'var(--font-display)',
                }}
              >
                No skills yet.
                <br />
                Click a skill on the left to add it.
              </div>
            ) : (
              added.map((skill) => (
                <div
                  key={skill.name}
                  style={{
                    padding: '0.6rem 0.75rem',
                    borderBottom: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  {/* Skill name */}
                  <span
                    style={{
                      flex: 1,
                      fontSize: '0.875rem',
                      fontFamily: 'var(--font-display)',
                      color: 'var(--text-primary)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {skill.name}
                  </span>

                  {/* Confidence selector — 3 segment buttons */}
                  {/*
                    This is a "segmented control": a row of buttons where
                    only one can be active at a time (like radio buttons
                    but styled as a pill group).
                  */}
                  <div
                    style={{
                      display: 'flex',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid var(--border-default)',
                      overflow: 'hidden',
                      flexShrink: 0,
                    }}
                  >
                    {CONFIDENCE_LEVELS.map((level) => {
                      const isActive = skill.confidence === level
                      return (
                        <button
                          key={level}
                          onClick={() => setConfidence(skill.name, level)}
                          title={CONFIDENCE_FULL[level]}
                          aria-label={`Set ${skill.name} to ${CONFIDENCE_FULL[level]}`}
                          style={{
                            padding: '3px 8px',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.7rem',
                            fontFamily: 'var(--font-mono)',
                            fontWeight: 700,
                            transition: 'all 0.15s ease',
                            // Active segment gets the confidence color
                            backgroundColor: isActive
                              ? CONFIDENCE_COLORS[level]
                              : 'transparent',
                            color: isActive
                              ? 'var(--text-inverse)'
                              : 'var(--text-tertiary)',
                          }}
                        >
                          {CONFIDENCE_LABELS[level]}
                        </button>
                      )
                    })}
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => removeSkill(skill.name)}
                    aria-label={`Remove ${skill.name}`}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-tertiary)',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '2px',
                      borderRadius: 'var(--radius-sm)',
                      flexShrink: 0,
                      transition: 'color 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color = 'var(--state-error)'
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-tertiary)'
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Legend: confidence colors ─────────────────────── */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          fontSize: '0.78rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-tertiary)',
        }}
      >
        {CONFIDENCE_LEVELS.map((level) => (
          <span key={level} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: CONFIDENCE_COLORS[level],
                display: 'inline-block',
              }}
            />
            {CONFIDENCE_FULL[level]}
          </span>
        ))}
      </div>

      {/* ── Continue button ───────────────────────────────── */}
      <button
        onClick={handleContinue}
        disabled={added.length === 0}
        style={{
          width: '100%',
          padding: '0.875rem',
          borderRadius: 'var(--radius-md)',
          border: 'none',
          cursor: added.length === 0 ? 'not-allowed' : 'pointer',
          fontFamily: 'var(--font-display)',
          fontWeight: 600,
          fontSize: '1rem',
          backgroundColor: added.length === 0
            ? 'var(--bg-elevated)'
            : 'var(--accent-primary)',
          color: added.length === 0
            ? 'var(--text-tertiary)'
            : 'var(--text-inverse)',
          transition: 'all 0.2s ease',
          boxShadow: added.length > 0 ? 'var(--shadow-glow)' : 'none',
        }}
      >
        Continue →
      </button>
    </div>
  )
}
