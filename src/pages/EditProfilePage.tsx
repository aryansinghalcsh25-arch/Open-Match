// ============================================================
// EditProfilePage.tsx
// ============================================================
// Authenticated user's profile editor. Route: /profile/edit
//
// SECTIONS
//   1. Avatar + display name + GitHub username (read-only)
//   2. Identity  — display name, location, timezone
//   3. Bio       — free-form text area
//   4. Skills    — add / remove skills with confidence level
//   5. Social    — GitHub URL, personal website, Twitter handle
//
// All state is local (React useState). When the backend is
// ready, replace handleSave() with a TanStack Mutation.
// ============================================================

import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft, Camera, MapPin, Clock, Globe,
  AtSign, Link2, Plus, X, Check, AlertCircle,
  Save, Loader2,
} from 'lucide-react'
import type { Confidence } from '../components/profile/SkillPill'
import TrustBadge from '../components/profile/TrustBadge'

// ─── Types ──────────────────────────────────────────────────

interface Skill {
  name: string
  category: string
  confidence: Confidence
}

interface FormState {
  displayName: string
  location: string
  timezone: string
  bio: string
  githubUrl: string
  website: string
  twitter: string
  skills: Skill[]
}

// ─── Mock "current user" seed data ──────────────────────────
// Replace with a real fetch when auth + backend are ready.

const INITIAL: FormState = {
  displayName: 'Priya Sharma',
  location: 'Bangalore, India',
  timezone: 'UTC+05:30',
  bio: 'Full-stack developer passionate about open source. I love TypeScript, clean architecture, and helping newcomers find their first contribution. Currently exploring Rust and distributed systems.',
  githubUrl: 'https://github.com/priyasharma',
  website: 'https://priyasharma.dev',
  twitter: '@priyasharma',
  skills: [
    { name: 'TypeScript',      category: 'Languages',  confidence: 'advanced'     },
    { name: 'Python',          category: 'Languages',  confidence: 'intermediate' },
    { name: 'Go',              category: 'Languages',  confidence: 'beginner'     },
    { name: 'React',           category: 'Frameworks', confidence: 'advanced'     },
    { name: 'Next.js',         category: 'Frameworks', confidence: 'intermediate' },
    { name: 'FastAPI',         category: 'Frameworks', confidence: 'intermediate' },
    { name: 'PostgreSQL',      category: 'Databases',  confidence: 'intermediate' },
    { name: 'Redis',           category: 'Databases',  confidence: 'beginner'     },
    { name: 'Docker',          category: 'DevOps',     confidence: 'intermediate' },
    { name: 'GitHub Actions',  category: 'DevOps',     confidence: 'advanced'     },
  ],
}

const TIMEZONES = [
  'UTC-12:00', 'UTC-11:00', 'UTC-10:00', 'UTC-09:00', 'UTC-08:00',
  'UTC-07:00', 'UTC-06:00', 'UTC-05:00', 'UTC-04:00', 'UTC-03:00',
  'UTC-02:00', 'UTC-01:00', 'UTC+00:00', 'UTC+01:00', 'UTC+02:00',
  'UTC+03:00', 'UTC+03:30', 'UTC+04:00', 'UTC+04:30', 'UTC+05:00',
  'UTC+05:30', 'UTC+05:45', 'UTC+06:00', 'UTC+06:30', 'UTC+07:00',
  'UTC+08:00', 'UTC+09:00', 'UTC+09:30', 'UTC+10:00', 'UTC+11:00',
  'UTC+12:00',
]

const CATEGORIES = ['Languages', 'Frameworks', 'Databases', 'DevOps', 'Tools', 'Other']

const CONFIDENCE_META: Record<Confidence, { label: string; color: string }> = {
  beginner:     { label: 'Beginner',     color: 'var(--accent-secondary)' },
  intermediate: { label: 'Intermediate', color: 'var(--accent-primary)'   },
  advanced:     { label: 'Advanced',     color: 'var(--accent-gold)'      },
}

// ─── Shared input style ─────────────────────────────────────

const inputStyle: CSSProperties = {
  width: '100%',
  backgroundColor: 'var(--bg-elevated)',
  border: '1px solid var(--border-default)',
  borderRadius: '8px',
  padding: '10px 14px',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-display)',
  fontSize: '0.9rem',
  outline: 'none',
  transition: 'border-color 0.15s ease',
  boxSizing: 'border-box',
}

const labelStyle: CSSProperties = {
  display: 'block',
  fontSize: '0.78rem',
  fontWeight: 600,
  color: 'var(--text-secondary)',
  marginBottom: '6px',
  letterSpacing: '0.03em',
  textTransform: 'uppercase',
  fontFamily: 'var(--font-mono)',
}

// ─── Section wrapper ────────────────────────────────────────

function Section({
  title,
  icon,
  children,
}: {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: '14px',
        padding: '1.5rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '1.25rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <span style={{ color: 'var(--accent-primary)' }}>{icon}</span>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            margin: 0,
          }}
        >
          {title}
        </h2>
      </div>
      {children}
    </div>
  )
}

// ─── Field wrapper ───────────────────────────────────────────

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
      {hint && (
        <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '5px', lineHeight: 1.5 }}>
          {hint}
        </p>
      )}
    </div>
  )
}

// ─── Main component ─────────────────────────────────────────

export default function EditProfilePage() {
  const [form, setForm] = useState<FormState>(INITIAL)
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  // Skill adder state
  const [newSkillName, setNewSkillName] = useState('')
  const [newSkillCategory, setNewSkillCategory] = useState('Languages')
  const [newSkillConfidence, setNewSkillConfidence] = useState<Confidence>('beginner')
  const [skillError, setSkillError] = useState('')

  // Avatar hover state
  const [avatarHover, setAvatarHover] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── Field updaters ─────────────────────────────────────────

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  // ── Skill management ───────────────────────────────────────

  function addSkill() {
    const trimmed = newSkillName.trim()
    if (!trimmed) { setSkillError('Skill name is required.'); return }
    if (form.skills.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) {
      setSkillError('This skill is already in your list.')
      return
    }
    setForm((prev) => ({
      ...prev,
      skills: [...prev.skills, { name: trimmed, category: newSkillCategory, confidence: newSkillConfidence }],
    }))
    setNewSkillName('')
    setSkillError('')
  }

  function removeSkill(name: string) {
    setForm((prev) => ({ ...prev, skills: prev.skills.filter((s) => s.name !== name) }))
  }

  function updateSkillConfidence(name: string, confidence: Confidence) {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => s.name === name ? { ...s, confidence } : s),
    }))
  }

  // ── Save ───────────────────────────────────────────────────

  async function handleSave() {
    setSaveState('saving')
    // Simulate async save — swap with real mutation when ready
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setSaveState('saved')
    setTimeout(() => setSaveState('idle'), 2500)
  }

  // ── Group skills by category ────────────────────────────────

  const grouped = form.skills.reduce<Record<string, Skill[]>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = []
    acc[s.category].push(s)
    return acc
  }, {})

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-base)',
        padding: '2rem 1rem 4rem',
        fontFamily: 'var(--font-display)',
      }}
    >
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>

        {/* ── Page header ──────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              to="/dashboard"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--text-secondary)',
                fontSize: '0.875rem',
                textDecoration: 'none',
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-default)',
                backgroundColor: 'var(--bg-surface)',
                transition: 'border-color 0.15s ease, color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-active)'
                e.currentTarget.style.color = 'var(--text-primary)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-default)'
                e.currentTarget.style.color = 'var(--text-secondary)'
              }}
            >
              <ArrowLeft size={14} />
              Back to dashboard
            </Link>

            <div>
              <h1
                style={{
                  fontSize: '1.35rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  margin: 0,
                  letterSpacing: '-0.01em',
                }}
              >
                Edit Profile
              </h1>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', margin: '2px 0 0' }}>
                Changes are saved to your account
              </p>
            </div>
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={saveState === 'saving'}
            id="save-profile-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 24px',
              borderRadius: '8px',
              backgroundColor: saveState === 'saved'
                ? 'var(--state-success-bg)'
                : 'var(--accent-primary)',
              color: saveState === 'saved' ? 'var(--state-success)' : 'var(--text-inverse)',
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: saveState === 'saving' ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s ease, opacity 0.15s ease',
              opacity: saveState === 'saving' ? 0.75 : 1,
              border: saveState === 'saved' ? '1px solid var(--state-success)' : 'none',
            }}
          >
            {saveState === 'saving' && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
            {saveState === 'saved'  && <Check size={16} />}
            {saveState === 'idle'   && <Save size={16} />}
            {saveState === 'saving' ? 'Saving…'      : ''}
            {saveState === 'saved'  ? 'Saved!'        : ''}
            {saveState === 'idle'   ? 'Save changes' : ''}
            {saveState === 'error'  ? 'Try again'    : ''}
          </button>
        </div>

        {/* ── Content grid ─────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* ═══════════════════════════════════════════════
              SECTION 1 — Avatar + identity summary card
          ═══════════════════════════════════════════════ */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              borderRadius: '14px',
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              flexWrap: 'wrap',
            }}
          >
            {/* Avatar picker */}
            <div
              style={{ position: 'relative', cursor: 'pointer', flexShrink: 0 }}
              onMouseEnter={() => setAvatarHover(true)}
              onMouseLeave={() => setAvatarHover(false)}
              onClick={() => fileInputRef.current?.click()}
            >
              <div
                style={{
                  width: '88px',
                  height: '88px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-elevated)',
                  border: `3px solid ${avatarHover ? 'var(--accent-primary)' : 'var(--border-default)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  transition: 'border-color 0.15s ease',
                }}
              >
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: '2rem',
                    color: 'var(--accent-primary)',
                    userSelect: 'none',
                  }}
                >
                  {form.displayName.charAt(0).toUpperCase()}
                </span>
              </div>
              {/* Camera overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0,0,0,0.55)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: avatarHover ? 1 : 0,
                  transition: 'opacity 0.15s ease',
                  flexDirection: 'column',
                  gap: '3px',
                }}
              >
                <Camera size={18} color="#fff" />
                <span style={{ color: '#fff', fontSize: '0.6rem', fontWeight: 600 }}>Change</span>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} aria-label="Upload avatar" />
            </div>

            {/* Identity snapshot */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
                <span
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {form.displayName || 'Your Name'}
                </span>
                <TrustBadge level={3} />
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  color: 'var(--text-secondary)',
                  margin: '0 0 6px',
                }}
              >
                @priyasharma
              </p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', margin: 0 }}>
                GitHub username is set at signup and cannot be changed here.
              </p>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════
              SECTION 2 — Identity fields
          ═══════════════════════════════════════════════ */}
          <Section title="Identity" icon={<MapPin size={16} />}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Field label="Display Name" hint="Shown on your public profile.">
                <input
                  id="field-display-name"
                  style={inputStyle}
                  value={form.displayName}
                  onChange={(e) => set('displayName', e.target.value)}
                  placeholder="Your full name"
                  maxLength={64}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)' }}
                  onBlur={(e)  => { e.currentTarget.style.borderColor = 'var(--border-default)' }}
                />
              </Field>

              <Field label="Location" hint="City, country, or region — optional.">
                <div style={{ position: 'relative' }}>
                  <MapPin
                    size={14}
                    color="var(--text-tertiary)"
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                  />
                  <input
                    id="field-location"
                    style={{ ...inputStyle, paddingLeft: '34px' }}
                    value={form.location}
                    onChange={(e) => set('location', e.target.value)}
                    placeholder="e.g. Berlin, Germany"
                    maxLength={80}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)' }}
                    onBlur={(e)  => { e.currentTarget.style.borderColor = 'var(--border-default)' }}
                  />
                </div>
              </Field>

              <Field label="Timezone">
                <div style={{ position: 'relative' }}>
                  <Clock
                    size={14}
                    color="var(--text-tertiary)"
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                  />
                  <select
                    id="field-timezone"
                    value={form.timezone}
                    onChange={(e) => set('timezone', e.target.value)}
                    style={{
                      ...inputStyle,
                      paddingLeft: '34px',
                      appearance: 'none',
                      cursor: 'pointer',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)' }}
                    onBlur={(e)  => { e.currentTarget.style.borderColor = 'var(--border-default)' }}
                  >
                    {TIMEZONES.map((tz) => (
                      <option key={tz} value={tz} style={{ backgroundColor: 'var(--bg-elevated)' }}>
                        {tz}
                      </option>
                    ))}
                  </select>
                </div>
              </Field>
            </div>
          </Section>

          {/* ═══════════════════════════════════════════════
              SECTION 3 — Bio
          ═══════════════════════════════════════════════ */}
          <Section title="Bio" icon={<Globe size={16} />}>
            <Field
              label="About you"
              hint="Write a short bio — shown on your public contributor profile. Max 300 characters."
            >
              <textarea
                id="field-bio"
                style={{
                  ...inputStyle,
                  minHeight: '110px',
                  resize: 'vertical',
                  lineHeight: 1.65,
                }}
                value={form.bio}
                onChange={(e) => set('bio', e.target.value)}
                placeholder="Tell the community about yourself, your interests, and what you're working on."
                maxLength={300}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)' }}
                onBlur={(e)  => { e.currentTarget.style.borderColor = 'var(--border-default)' }}
              />
              <div
                style={{
                  textAlign: 'right',
                  fontSize: '0.72rem',
                  color: form.bio.length > 260 ? 'var(--state-warning)' : 'var(--text-tertiary)',
                  marginTop: '4px',
                  fontFamily: 'var(--font-mono)',
                  transition: 'color 0.2s',
                }}
              >
                {form.bio.length} / 300
              </div>
            </Field>
          </Section>

          {/* ═══════════════════════════════════════════════
              SECTION 4 — Skills
          ═══════════════════════════════════════════════ */}
          <Section title="Skills" icon={<Check size={16} />}>

            {/* Existing skills grouped by category */}
            {Object.entries(grouped).map(([category, skills]) => (
              <div key={category} style={{ marginBottom: '1.25rem' }}>
                <p
                  style={{
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'var(--text-tertiary)',
                    marginBottom: '0.625rem',
                  }}
                >
                  {category}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {skills.map((skill) => (
                    <div
                      key={skill.name}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: 'var(--bg-elevated)',
                        border: '1px solid var(--border-default)',
                        borderRadius: '999px',
                        padding: '4px 10px 4px 12px',
                      }}
                    >
                      {/* Confidence dot */}
                      <span
                        style={{
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          backgroundColor: CONFIDENCE_META[skill.confidence].color,
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '0.82rem',
                          color: 'var(--text-secondary)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {skill.name}
                      </span>

                      {/* Confidence selector */}
                      <select
                        aria-label={`Confidence for ${skill.name}`}
                        value={skill.confidence}
                        onChange={(e) => updateSkillConfidence(skill.name, e.target.value as Confidence)}
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: CONFIDENCE_META[skill.confidence].color,
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          outline: 'none',
                          padding: '0 2px',
                        }}
                      >
                        <option value="beginner"     style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>Beginner</option>
                        <option value="intermediate" style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>Intermediate</option>
                        <option value="advanced"     style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>Advanced</option>
                      </select>

                      {/* Remove button */}
                      <button
                        aria-label={`Remove ${skill.name}`}
                        onClick={() => removeSkill(skill.name)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          border: 'none',
                          backgroundColor: 'transparent',
                          color: 'var(--text-tertiary)',
                          cursor: 'pointer',
                          padding: 0,
                          transition: 'color 0.15s ease, background-color 0.15s ease',
                          flexShrink: 0,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = 'var(--state-error)'
                          e.currentTarget.style.backgroundColor = 'var(--state-error-bg)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'var(--text-tertiary)'
                          e.currentTarget.style.backgroundColor = 'transparent'
                        }}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Add new skill row */}
            <div
              style={{
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid var(--border-subtle)',
              }}
            >
              <p style={{ ...labelStyle, marginBottom: '10px' }}>Add a skill</p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto auto auto',
                  gap: '8px',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                }}
              >
                {/* Skill name input */}
                <input
                  id="new-skill-name"
                  style={{
                    ...inputStyle,
                    borderColor: skillError ? 'var(--state-error)' : 'var(--border-default)',
                  }}
                  placeholder="e.g. Rust, Docker, Redis"
                  value={newSkillName}
                  onChange={(e) => { setNewSkillName(e.target.value); setSkillError('') }}
                  onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                  onFocus={(e) => { e.currentTarget.style.borderColor = skillError ? 'var(--state-error)' : 'var(--accent-primary)' }}
                  onBlur={(e)  => { e.currentTarget.style.borderColor = skillError ? 'var(--state-error)' : 'var(--border-default)' }}
                />

                {/* Category */}
                <select
                  id="new-skill-category"
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value)}
                  style={{ ...inputStyle, width: 'auto', cursor: 'pointer', appearance: 'none', paddingRight: '28px' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)' }}
                  onBlur={(e)  => { e.currentTarget.style.borderColor = 'var(--border-default)' }}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} style={{ backgroundColor: 'var(--bg-elevated)' }}>{c}</option>
                  ))}
                </select>

                {/* Confidence */}
                <select
                  id="new-skill-confidence"
                  value={newSkillConfidence}
                  onChange={(e) => setNewSkillConfidence(e.target.value as Confidence)}
                  style={{ ...inputStyle, width: 'auto', cursor: 'pointer', appearance: 'none', paddingRight: '28px' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)' }}
                  onBlur={(e)  => { e.currentTarget.style.borderColor = 'var(--border-default)' }}
                >
                  <option value="beginner"     style={{ backgroundColor: 'var(--bg-elevated)' }}>Beginner</option>
                  <option value="intermediate" style={{ backgroundColor: 'var(--bg-elevated)' }}>Intermediate</option>
                  <option value="advanced"     style={{ backgroundColor: 'var(--bg-elevated)' }}>Advanced</option>
                </select>

                {/* Add button */}
                <button
                  id="add-skill-btn"
                  onClick={addSkill}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--accent-primary)',
                    backgroundColor: 'transparent',
                    color: 'var(--accent-primary)',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--accent-glow)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                >
                  <Plus size={15} />
                  Add
                </button>
              </div>

              {/* Error message */}
              {skillError && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginTop: '8px',
                    color: 'var(--state-error)',
                    fontSize: '0.78rem',
                  }}
                >
                  <AlertCircle size={13} />
                  {skillError}
                </div>
              )}
            </div>
          </Section>

          {/* ═══════════════════════════════════════════════
              SECTION 5 — Social links
          ═══════════════════════════════════════════════ */}
          <Section title="Social & Links" icon={<Globe size={16} />}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              <Field label="GitHub URL" hint="Your full GitHub profile URL.">
                <div style={{ position: 'relative' }}>
                  <Link2
                    size={14}
                    color="var(--text-tertiary)"
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                  />
                  <input
                    id="field-github-url"
                    style={{ ...inputStyle, paddingLeft: '34px' }}
                    value={form.githubUrl}
                    onChange={(e) => set('githubUrl', e.target.value)}
                    placeholder="https://github.com/your-username"
                    type="url"
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)' }}
                    onBlur={(e)  => { e.currentTarget.style.borderColor = 'var(--border-default)' }}
                  />
                </div>
              </Field>

              <Field label="Personal website">
                <div style={{ position: 'relative' }}>
                  <Globe
                    size={14}
                    color="var(--text-tertiary)"
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                  />
                  <input
                    id="field-website"
                    style={{ ...inputStyle, paddingLeft: '34px' }}
                    value={form.website}
                    onChange={(e) => set('website', e.target.value)}
                    placeholder="https://yoursite.dev"
                    type="url"
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)' }}
                    onBlur={(e)  => { e.currentTarget.style.borderColor = 'var(--border-default)' }}
                  />
                </div>
              </Field>

              <Field label="Twitter / X">
                <div style={{ position: 'relative' }}>
                  <AtSign
                    size={14}
                    color="var(--text-tertiary)"
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                  />
                  <input
                    id="field-twitter"
                    style={{ ...inputStyle, paddingLeft: '34px' }}
                    value={form.twitter}
                    onChange={(e) => set('twitter', e.target.value)}
                    placeholder="@handle"
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)' }}
                    onBlur={(e)  => { e.currentTarget.style.borderColor = 'var(--border-default)' }}
                  />
                </div>
              </Field>
            </div>
          </Section>

          {/* ── Bottom save bar ───────────────────────────── */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              paddingTop: '0.5rem',
            }}
          >
            <Link
              to="/dashboard"
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: '1px solid var(--border-default)',
                backgroundColor: 'transparent',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-display)',
                fontWeight: 500,
                fontSize: '0.9rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                transition: 'border-color 0.15s ease, color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-active)'
                e.currentTarget.style.color = 'var(--text-primary)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-default)'
                e.currentTarget.style.color = 'var(--text-secondary)'
              }}
            >
              Discard
            </Link>
            <button
              onClick={handleSave}
              disabled={saveState === 'saving'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 24px',
                borderRadius: '8px',
                backgroundColor: saveState === 'saved' ? 'var(--state-success-bg)' : 'var(--accent-primary)',
                color: saveState === 'saved' ? 'var(--state-success)' : 'var(--text-inverse)',
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: saveState === 'saving' ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s ease',
                border: saveState === 'saved' ? '1px solid var(--state-success)' : 'none',
              }}
            >
              {saveState === 'saving' && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
              {saveState === 'saved'  && <Check size={16} />}
              {saveState === 'idle'   && <Save size={16} />}
              {saveState === 'saving' ? 'Saving…'      : ''}
              {saveState === 'saved'  ? 'Saved!'        : ''}
              {saveState === 'idle'   ? 'Save changes' : ''}
            </button>
          </div>

        </div>
      </div>

      {/* Spinner keyframe */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
      `}</style>
    </div>
  )
}
