import { BookOpen, CheckCircle, PlayCircle, Clock } from 'lucide-react'

const PATHS = [
  {
    id: '1',
    title: 'Open Source Contributor: Level 1',
    description: 'Learn the basics of Git, GitHub workflows, and how to find your first issue.',
    progress: 100,
    status: 'completed',
    modules: 5,
    time: '2 hours'
  },
  {
    id: '2',
    title: 'Advanced React Patterns',
    description: 'Master compound components, render props, and custom hooks to build robust UIs.',
    progress: 45,
    status: 'in-progress',
    modules: 8,
    time: '4 hours'
  },
  {
    id: '3',
    title: 'Maintainer Bootcamp',
    description: 'Learn how to triage issues, review PRs, and build a welcoming community.',
    progress: 0,
    status: 'not-started',
    modules: 6,
    time: '3 hours'
  }
]

export default function LearningPathsPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '40px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-display)',
          margin: '0 0 8px 0',
          letterSpacing: '-0.01em',
        }}>
          Learning Paths
        </h1>
        <p style={{ 
          fontSize: '0.95rem', 
          color: 'var(--text-secondary)', 
          margin: 0,
          fontFamily: 'var(--font-display)' 
        }}>
          Level up your skills and unlock new project tiers.
        </p>
      </div>

      {/* Path List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {PATHS.map(path => (
          <div key={path.id} style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            transition: 'border-color 0.2s',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-default)' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)' }}
          >
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  margin: '0 0 8px 0'
                }}>
                  {path.title}
                </h3>
                <p style={{
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.9rem',
                  margin: 0,
                  lineHeight: 1.5
                }}>
                  {path.description}
                </p>
              </div>

              {/* Status Badge */}
              <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, fontFamily: 'var(--font-display)' }}>
                {path.status === 'completed' && <><CheckCircle size={14} color="var(--state-success)" /><span style={{ color: 'var(--state-success)' }}>Completed</span></>}
                {path.status === 'in-progress' && <><PlayCircle size={14} color="var(--accent-primary)" /><span style={{ color: 'var(--accent-primary)' }}>In Progress</span></>}
                {path.status === 'not-started' && <><BookOpen size={14} color="var(--text-tertiary)" /><span style={{ color: 'var(--text-tertiary)' }}>Not Started</span></>}
              </div>
            </div>

            {/* Meta */}
            <div style={{ display: 'flex', gap: '16px', color: 'var(--text-tertiary)', fontSize: '0.8rem', fontFamily: 'var(--font-display)', marginTop: '4px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><BookOpen size={12}/> {path.modules} Modules</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12}/> {path.time}</span>
            </div>

            {/* Progress Bar */}
            {path.progress > 0 && (
              <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-elevated)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ 
                  height: '100%', 
                  width: `${path.progress}%`, 
                  backgroundColor: path.progress === 100 ? 'var(--state-success)' : 'var(--accent-primary)',
                  borderRadius: '3px'
                }} />
              </div>
            )}
            
          </div>
        ))}
      </div>
    </div>
  )
}
