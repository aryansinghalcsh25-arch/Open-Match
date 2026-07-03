// ============================================================
// ContributorProfilePage.tsx
// ============================================================
// Public profile page for a contributor. Route: /contributors/:id
//
// LAYOUT — two column grid:
//
//  ┌──────────────────┬──────────────────────────────────────┐
//  │  LEFT (35%)      │  RIGHT (65%)                         │
//  │  ─────────────   │  ──────────────────────────────────  │
//  │  Avatar          │  Skills (grouped by category)        │
//  │  Display name    │  Contribution Activity               │
//  │  @username       │  Learning Paths Completed            │
//  │  TrustBadge      │                                      │
//  │  Location        │                                      │
//  │  Bio             │                                      │
//  │  GitHub link     │                                      │
//  │  Member since    │                                      │
//  │  [Message]       │                                      │
//  └──────────────────┴──────────────────────────────────────┘
//
// The page uses `useParams` from React Router to read the `:id`
// from the URL. Right now it displays mock data — when the
// backend is ready, we'll fetch real data using TanStack Query.
// ============================================================

import { useParams } from 'react-router-dom'
import type { CSSProperties } from 'react'
import {
  MapPin, Clock, GitFork, ExternalLink,
  MessageSquare, GitPullRequest, BookOpen,
  Calendar, Star,
} from 'lucide-react'
import TrustBadge from '../components/profile/TrustBadge'
import SkillPill from '../components/profile/SkillPill'
import type { Confidence } from '../components/profile/SkillPill'

// ---- Mock profile data ------------------------------------
// This represents what a real API response would look like.
// Replace with a real fetch call when the backend is ready.

interface Skill {
  name: string
  category: string
  confidence: Confidence
}

interface ContributedProject {
  name: string
  description: string
  prs: number
  lastActive: string
  language: string
  languageColor: string
}

interface LearningPath {
  skill: string
  provider: string
  completedDate: string
}

interface ContributorProfile {
  id: string
  displayName: string
  githubUsername: string
  avatarUrl: string | null
  trustLevel: 0 | 1 | 2 | 3 | 4
  location: string
  timezone: string
  bio: string
  memberSince: string
  skills: Skill[]
  contributedProjects: ContributedProject[]
  learningPaths: LearningPath[]
}

// A realistic-looking mock profile
const MOCK_PROFILE: ContributorProfile = {
  id: '1',
  displayName: 'Priya Sharma',
  githubUsername: 'priyasharma',
  avatarUrl: null,
  trustLevel: 3,
  location: 'Bangalore, India',
  timezone: 'UTC+05:30',
  bio: 'Full-stack developer passionate about open source. I love TypeScript, clean architecture, and helping newcomers find their first contribution. Currently exploring Rust and distributed systems.',
  memberSince: 'January 2024',
  skills: [
    { name: 'TypeScript', category: 'Languages',   confidence: 'advanced'     },
    { name: 'Python',     category: 'Languages',   confidence: 'intermediate' },
    { name: 'Go',         category: 'Languages',   confidence: 'beginner'     },
    { name: 'React',      category: 'Frameworks',  confidence: 'advanced'     },
    { name: 'Next.js',    category: 'Frameworks',  confidence: 'intermediate' },
    { name: 'FastAPI',    category: 'Frameworks',  confidence: 'intermediate' },
    { name: 'PostgreSQL', category: 'Databases',   confidence: 'intermediate' },
    { name: 'Redis',      category: 'Databases',   confidence: 'beginner'     },
    { name: 'Docker',     category: 'DevOps',      confidence: 'intermediate' },
    { name: 'GitHub Actions', category: 'DevOps',  confidence: 'advanced'     },
  ],
  contributedProjects: [
    {
      name: 'excalidraw',
      description: 'Virtual whiteboard for sketching diagrams.',
      prs: 14,
      lastActive: '3 days ago',
      language: 'TypeScript',
      languageColor: '#3178C6',
    },
    {
      name: 'cal.com',
      description: 'Open-source scheduling infrastructure.',
      prs: 7,
      lastActive: '2 weeks ago',
      language: 'TypeScript',
      languageColor: '#3178C6',
    },
    {
      name: 'fastapi',
      description: 'Modern, fast web framework for Python.',
      prs: 3,
      lastActive: '1 month ago',
      language: 'Python',
      languageColor: '#3572A5',
    },
  ],
  learningPaths: [
    { skill: 'TypeScript',      provider: 'TypeScript Handbook', completedDate: 'Mar 2024' },
    { skill: 'Open Source 101', provider: 'opensource.guide',    completedDate: 'Feb 2024' },
    { skill: 'Git & GitHub',    provider: 'GitHub Docs',         completedDate: 'Jan 2024' },
  ],
}

// ---- Helper: group skills by category ---------------------
function groupByCategory(skills: Skill[]): Record<string, Skill[]> {
  return skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)
}

// ---- Section heading style --------------------------------
const sectionHeadingStyle: CSSProperties = {
  fontSize: '0.72rem',
  fontFamily: 'var(--font-mono)',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: 'var(--text-tertiary)',
  marginBottom: '0.875rem',
}

// ---- Main component ---------------------------------------

export default function ContributorProfilePage() {
  // `useParams` reads the `:id` segment from the URL.
  // If you visit /contributors/42, then id = "42".
  const { id } = useParams<{ id: string }>()

  // In the future: fetch profile by id using TanStack Query.
  // For now, always show the mock profile.
  const profile = MOCK_PROFILE
  const grouped = groupByCategory(profile.skills)

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-base)',
        padding: '2rem 1rem',
        fontFamily: 'var(--font-display)',
      }}
    >
      {/* ── Page container ────────────────────────────────── */}
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* ── Two-column grid ───────────────────────────────
          On desktop: left 35% + right 65%
          On mobile:  stacks vertically (single column)
          We use a CSS grid with a media-query-like approach
          using inline style for desktop and Tailwind for mobile.
        ────────────────────────────────────────────────────── */}
        <div
          className="flex flex-col lg:grid"
          style={{ gap: '1.5rem' }}
        >
          <style>{`
            @media (min-width: 1024px) {
              .profile-grid {
                display: grid;
                grid-template-columns: 320px 1fr;
                gap: 1.5rem;
                align-items: start;
              }
            }
          `}</style>

          <div className="profile-grid" style={{ width: '100%' }}>

            {/* ══════════════════════════════════════════════
                LEFT COLUMN — identity card
            ══════════════════════════════════════════════ */}
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-xl)',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                // Sticky on desktop so it stays visible while scrolling right column
                position: 'sticky',
                top: '1.5rem',
              }}
            >
              {/* Avatar */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: '96px',
                    height: '96px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--bg-elevated)',
                    border: '3px solid var(--border-default)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                >
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.displayName}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    // Initials fallback when no avatar
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        fontSize: '2rem',
                        color: 'var(--accent-primary)',
                        userSelect: 'none',
                      }}
                    >
                      {profile.displayName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Name + username + badge */}
                <div style={{ textAlign: 'center' }}>
                  <h1
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.35rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      marginBottom: '0.25rem',
                    }}
                  >
                    {profile.displayName}
                  </h1>
                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.85rem',
                      color: 'var(--text-secondary)',
                      marginBottom: '0.625rem',
                    }}
                  >
                    @{profile.githubUsername}
                  </p>
                  <TrustBadge level={profile.trustLevel} />
                </div>
              </div>

              {/* Divider */}
              <div style={{ borderTop: '1px solid var(--border-default)' }} />

              {/* Meta info rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>

                {/* Location */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={14} color="var(--text-tertiary)" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {profile.location}
                  </span>
                </div>

                {/* Timezone */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={14} color="var(--text-tertiary)" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {profile.timezone}
                  </span>
                </div>

                {/* Member since */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={14} color="var(--text-tertiary)" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Member since {profile.memberSince}
                  </span>
                </div>

                {/* GitHub link */}
                <a
                  href={`https://github.com/${profile.githubUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: 'var(--accent-primary)',
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    transition: 'opacity 0.15s ease',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.75' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1' }}
                >
                  <GitFork size={14} style={{ flexShrink: 0 }} />
                  github.com/{profile.githubUsername}
                  <ExternalLink size={11} />
                </a>
              </div>

              {/* Divider */}
              <div style={{ borderTop: '1px solid var(--border-default)' }} />

              {/* Bio */}
              <p
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.7,
                }}
              >
                {profile.bio}
              </p>

              {/* Message button */}
                <button
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--accent-primary)',
                  backgroundColor: 'transparent',
                  color: 'var(--accent-primary)',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--accent-glow)'
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
                }}
              >
                <MessageSquare size={16} />
                Message
              </button>

            </div>

            {/* ══════════════════════════════════════════════
                RIGHT COLUMN — skills + activity
            ══════════════════════════════════════════════ */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              {/* ── Skills ──────────────────────────────── */}
              <section
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '1.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
                  <Star size={16} color="var(--accent-primary)" />
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Skills
                  </h2>
                  <span
                    style={{
                      marginLeft: 'auto',
                      fontSize: '0.78rem',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-tertiary)',
                    }}
                  >
                    {profile.skills.length} total
                  </span>
                </div>

                {/* Skills grouped by category */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {Object.entries(grouped).map(([category, skills]) => (
                    <div key={category}>
                      <p style={sectionHeadingStyle}>{category}</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {skills.map((skill) => (
                          <SkillPill
                            key={skill.name}
                            name={skill.name}
                            confidence={skill.confidence}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Confidence legend */}
                <div
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    flexWrap: 'wrap',
                    marginTop: '1.25rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--border-default)',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-tertiary)',
                  }}
                >
                  {(['beginner', 'intermediate', 'advanced'] as Confidence[]).map((level) => (
                    <span key={level} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span style={{
                        width: '7px', height: '7px', borderRadius: '50%',
                        backgroundColor: level === 'beginner' ? 'var(--accent-secondary)'
                          : level === 'intermediate' ? 'var(--accent-primary)'
                          : 'var(--accent-gold)',
                        display: 'inline-block',
                      }} />
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </span>
                  ))}
                </div>
              </section>

              {/* ── Trust Level Ladder ───────────────────── */}
              {/*
                Shows all 5 trust levels so the contributor can see:
                  - Where they currently are (highlighted row)
                  - What each level means
                  - What they need to do to level up
              */}
              <section
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '1.5rem',
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '1rem' }}>🏅</span>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Trust Level
                  </h2>
                  <span style={{ marginLeft: 'auto', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>
                    hover any level for details
                  </span>
                </div>

                {/* All 5 levels as a ladder */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {([
                    { level: 0, label: 'L0 · Registered', color: 'var(--trust-0)', bg: 'rgba(72,79,88,0.15)',    desc: 'Just joined. Complete your profile.'        },
                    { level: 1, label: 'L1 · Learning',    color: 'var(--trust-1)', bg: 'rgba(61,142,255,0.15)', desc: 'Onboarding done. Exploring projects.'        },
                    { level: 2, label: 'L2 · Emerging',    color: 'var(--trust-2)', bg: 'rgba(0,212,177,0.15)',  desc: 'First contributions made.'                  },
                    { level: 3, label: 'L3 · Active',      color: 'var(--trust-3)', bg: 'rgba(35,134,54,0.15)',  desc: 'Regularly contributing across projects.'    },
                    { level: 4, label: 'L4 · Verified',    color: 'var(--trust-4)', bg: 'rgba(245,166,35,0.15)', desc: 'Top contributor. Highly trusted. 🏆'         },
                  ] as const).map(({ level, label, color, bg, desc }) => {
                    const isCurrent = level === profile.trustLevel
                    const isPast    = level < profile.trustLevel
                    return (
                      <div
                        key={level}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '0.6rem 0.875rem',
                          borderRadius: 'var(--radius-md)',
                          // Current level gets a highlighted background
                          backgroundColor: isCurrent ? bg : 'transparent',
                          border: `1px solid ${isCurrent ? color : 'transparent'}`,
                          opacity: !isCurrent && !isPast ? 0.45 : 1,
                          transition: 'opacity 0.15s ease',
                        }}
                      >
                        {/* Dot indicator */}
                        <span
                          style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            backgroundColor: isPast || isCurrent ? color : 'var(--border-default)',
                            flexShrink: 0,
                            // Pulse animation on current level
                            boxShadow: isCurrent ? `0 0 8px ${color}` : 'none',
                          }}
                        />

                        {/* Level name */}
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            color: isCurrent ? color : isPast ? color : 'var(--text-tertiary)',
                            width: '110px',
                            flexShrink: 0,
                          }}
                        >
                          {label}
                        </span>

                        {/* Description */}
                        <span
                          style={{
                            fontSize: '0.8rem',
                            fontFamily: 'var(--font-display)',
                            color: isCurrent ? 'var(--text-primary)' : 'var(--text-secondary)',
                            flex: 1,
                          }}
                        >
                          {desc}
                        </span>

                        {/* "Current" badge */}
                        {isCurrent && (
                          <span
                            style={{
                              fontSize: '0.68rem',
                              fontFamily: 'var(--font-mono)',
                              fontWeight: 700,
                              color: color,
                              border: `1px solid ${color}`,
                              borderRadius: 'var(--radius-full)',
                              padding: '1px 7px',
                              flexShrink: 0,
                            }}
                          >
                            YOU
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </section>

              {/* ── Contribution Activity ────────────────── */}
              <section
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '1.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
                  <GitPullRequest size={16} color="var(--accent-primary)" />
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Contribution Activity
                  </h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  {profile.contributedProjects.map((project) => (
                    <div
                      key={project.name}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '0.875rem 1rem',
                        backgroundColor: 'var(--bg-elevated)',
                        border: '1px solid var(--border-default)',
                        borderRadius: 'var(--radius-lg)',
                        transition: 'border-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-active)'
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-default)'
                      }}
                    >
                      {/* Language dot */}
                      <span
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          backgroundColor: project.languageColor,
                          flexShrink: 0,
                        }}
                      />

                      {/* Project info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '2px' }}>
                          {project.name}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {project.description}
                        </div>
                      </div>

                      {/* Stats */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px', flexShrink: 0 }}>
                        <span
                          style={{
                            fontSize: '0.78rem',
                            fontFamily: 'var(--font-mono)',
                            color: 'var(--accent-primary)',
                            fontWeight: 700,
                          }}
                        >
                          {project.prs} PRs
                        </span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                          {project.lastActive}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── Learning Paths ───────────────────────── */}
              <section
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '1.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
                  <BookOpen size={16} color="var(--accent-primary)" />
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Learning Paths Completed
                  </h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {profile.learningPaths.map((path) => (
                    <div
                      key={path.skill}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '0.75rem 1rem',
                        backgroundColor: 'var(--bg-elevated)',
                        border: '1px solid var(--border-default)',
                        borderRadius: 'var(--radius-lg)',
                      }}
                    >
                      {/* Checkmark dot */}
                      <span
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--state-success-bg)',
                          border: '1px solid var(--state-success)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          fontSize: '0.65rem',
                          color: 'var(--state-success)',
                          fontWeight: 700,
                        }}
                      >
                        ✓
                      </span>

                      {/* Skill + provider */}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                          {path.skill}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '1px' }}>
                          via {path.provider}
                        </div>
                      </div>

                      {/* Completed date */}
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--text-tertiary)',
                          flexShrink: 0,
                        }}
                      >
                        {path.completedDate}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

            </div>
            {/* end right column */}
          </div>
          {/* end profile-grid */}
        </div>
        {/* end page container */}
      </div>
    </div>
  )
}
