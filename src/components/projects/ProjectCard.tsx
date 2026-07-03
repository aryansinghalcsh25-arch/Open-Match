// A card showing a single project with match score, skills, and a view button
// Locked cards (minTrustLevel > current user level) are visually quieter/collapsed

import { useNavigate } from 'react-router-dom'
import MatchScoreRing from './MatchScoreRing'

interface Props {
  id: string
  name: string
  description: string
  skills: string[]       // e.g. ['TypeScript', 'Go', 'gRPC']
  matchScore: number     // 0-100
  minTrustLevel: number  // 0-4
  openIssues: number
  isLocked?: boolean     // if true, card renders collapsed/quieter
}

export default function ProjectCard({ id, name, description, skills, matchScore, minTrustLevel, openIssues, isLocked = false }: Props) {
  const navigate = useNavigate()

  const visibleSkills = skills.slice(0, 4)
  const extraSkills = skills.length - visibleSkills.length

  const isHighMatch = matchScore > 70

  if (isLocked) {
    // Locked cards — visually quieter, collapsed, shows less info
    return (
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          opacity: 0.55,
          cursor: 'not-allowed',
          filter: 'grayscale(0.6)',
        }}
      >
        {/* Lock icon */}
        <div style={{
          color: 'var(--text-tertiary)',
          fontSize: '18px',
          flexShrink: 0,
        }}>
          🔒
        </div>

        {/* Project name + trust level requirement */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-display)',
            fontSize: '14px',
            fontWeight: 500,
            margin: 0,
          }}>
            {name}
          </h3>
          <p style={{
            color: 'var(--text-tertiary)',
            fontFamily: 'var(--font-display)',
            fontSize: '11px',
            margin: '2px 0 0 0',
          }}>
            Trust Level {minTrustLevel}+ required
          </p>
        </div>

        {/* Match score — inline */}
        <MatchScoreRing score={matchScore} size="sm" />
      </div>
    )
  }

  // Eligible card — full detail
  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        borderLeft: isHighMatch ? '3px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
        cursor: 'pointer',
        transition: 'border-color 150ms, box-shadow 150ms'
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-glow)'
        ;(e.currentTarget as HTMLDivElement).style.borderColor = 'var(--accent-primary)'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
        ;(e.currentTarget as HTMLDivElement).style.borderColor = isHighMatch ? 'var(--accent-primary)' : 'var(--border-subtle)'
      }}
    >
      {/* TOP ROW — project name + match score */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h3 style={{
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-display)',
          fontSize: '16px',
          fontWeight: 600,
          margin: 0,
          flex: 1,
          paddingRight: '12px'
        }}>
          {name}
        </h3>
        <MatchScoreRing score={matchScore} size="md" />
      </div>

      {/* DESCRIPTION — max 2 lines */}
      <p style={{
        color: 'var(--text-secondary)',
        fontFamily: 'var(--font-display)',
        fontSize: '14px',
        margin: 0,
        lineHeight: '1.5',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }}>
        {description}
      </p>

      {/* SKILL PILLS */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {visibleSkills.map(skill => (
          <span key={skill} style={{
            backgroundColor: 'var(--bg-elevated)',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            padding: '3px 8px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)'
          }}>
            {skill}
          </span>
        ))}
        {extraSkills > 0 && (
          <span style={{
            backgroundColor: 'var(--bg-elevated)',
            color: 'var(--text-tertiary)',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            padding: '3px 8px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)'
          }}>
            +{extraSkills} more
          </span>
        )}
      </div>

      {/* BOTTOM ROW — open issues + view button */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '4px'
      }}>
        <div style={{
          color: 'var(--text-tertiary)',
          fontFamily: 'var(--font-display)',
          fontSize: '12px',
          display: 'flex',
          gap: '12px'
        }}>
          {/* Eligible badge instead of lock note */}
          <span style={{
            color: 'var(--state-success)',
            fontWeight: 600,
          }}>
            ✓ Eligible
          </span>
          <span>{openIssues} open issues</span>
        </div>

        <button
          onClick={() => navigate(`/projects/${id}`)}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-display)',
            fontSize: '13px',
            fontWeight: 500,
            padding: '6px 14px',
            cursor: 'pointer'
          }}
        >
          View →
        </button>
      </div>
    </div>
  )
}