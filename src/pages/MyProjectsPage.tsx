import ProjectCard from '../components/projects/ProjectCard'
import { FolderGit2 } from 'lucide-react'

export default function MyProjectsPage() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '40px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-display)',
            margin: '0 0 8px 0',
            letterSpacing: '-0.01em',
          }}>
            My Projects
          </h1>
          <p style={{ 
            fontSize: '0.95rem', 
            color: 'var(--text-secondary)', 
            margin: 0,
            fontFamily: 'var(--font-display)' 
          }}>
            Projects you maintain or are actively contributing to.
          </p>
        </div>
        
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'var(--accent-primary)',
          color: 'var(--text-inverse)',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '8px',
          fontFamily: 'var(--font-display)',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer'
        }}>
          <FolderGit2 size={16} />
          New Project
        </button>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '24px',
        marginBottom: '24px',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div style={{
          paddingBottom: '12px',
          borderBottom: '2px solid var(--accent-primary)',
          color: 'var(--accent-primary)',
          fontFamily: 'var(--font-display)',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer'
        }}>
          Contributing (1)
        </div>
        <div style={{
          paddingBottom: '12px',
          borderBottom: '2px solid transparent',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-display)',
          fontSize: '14px',
          fontWeight: 500,
          cursor: 'pointer'
        }}>
          Maintaining (0)
        </div>
      </div>

      {/* Content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
        gap: '20px'
      }}>
        <ProjectCard 
          id="1"
          name="TypeScript Utility Library"
          description="A popular utility library for TypeScript developers. We need help with new features and documentation."
          skills={['TypeScript', 'Node.js', 'Jest', 'Rollup']}
          matchScore={85}
          minTrustLevel={1}
          openIssues={12}
          isLocked={false}
        />
      </div>
    </div>
  )
}
