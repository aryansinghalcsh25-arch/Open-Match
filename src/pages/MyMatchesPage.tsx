import ProjectCard from '../components/projects/ProjectCard'

const MATCHES = [
  {
    id: '1',
    name: 'TypeScript Utility Library',
    description: 'A popular utility library for TypeScript developers. We need help with new features and documentation.',
    skills: ['TypeScript', 'Node.js', 'Jest', 'Rollup'],
    matchScore: 85,
    minTrustLevel: 1,
    openIssues: 12,
    isLocked: false,
  },
  {
    id: '3',
    name: 'React Dashboard Framework',
    description: 'An open-source admin dashboard framework using React and Material-UI. Looking for component contributions.',
    skills: ['React', 'Material-UI', 'TypeScript', 'Figma'],
    matchScore: 78,
    minTrustLevel: 1,
    openIssues: 24,
    isLocked: false,
  },
  {
    id: '2',
    name: 'Go gRPC Framework',
    description: 'High performance gRPC framework for Go. Looking for contributors with distributed systems experience.',
    skills: ['Go', 'gRPC', 'Protobuf'],
    matchScore: 62,
    minTrustLevel: 2,
    openIssues: 7,
    isLocked: true,
  },
  {
    id: '4',
    name: 'Rust CLI Toolkit',
    description: 'A toolkit for building robust command-line applications in Rust.',
    skills: ['Rust', 'CLI', 'Testing'],
    matchScore: 45,
    minTrustLevel: 2,
    openIssues: 3,
    isLocked: true,
  }
]

export default function MyMatchesPage() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '40px' }}>
      
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
          My Matches
        </h1>
        <p style={{ 
          fontSize: '0.95rem', 
          color: 'var(--text-secondary)', 
          margin: 0,
          fontFamily: 'var(--font-display)' 
        }}>
          Projects recommended for you based on your skill graph and interests.
        </p>
      </div>

      {/* Filters (Mock) */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <button style={{
          backgroundColor: 'var(--bg-elevated)',
          border: '1px solid var(--border-default)',
          color: 'var(--text-primary)',
          padding: '6px 12px',
          borderRadius: '20px',
          fontFamily: 'var(--font-display)',
          fontSize: '13px',
          fontWeight: 500,
          cursor: 'pointer'
        }}>
          All Matches
        </button>
        <button style={{
          backgroundColor: 'transparent',
          border: '1px solid var(--border-subtle)',
          color: 'var(--text-secondary)',
          padding: '6px 12px',
          borderRadius: '20px',
          fontFamily: 'var(--font-display)',
          fontSize: '13px',
          fontWeight: 500,
          cursor: 'pointer'
        }}>
          Eligible Only
        </button>
        <button style={{
          backgroundColor: 'transparent',
          border: '1px solid var(--border-subtle)',
          color: 'var(--text-secondary)',
          padding: '6px 12px',
          borderRadius: '20px',
          fontFamily: 'var(--font-display)',
          fontSize: '13px',
          fontWeight: 500,
          cursor: 'pointer'
        }}>
          Sort: Highest Score
        </button>
      </div>

      {/* Matches Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
        gap: '20px'
      }}>
        {MATCHES.map(project => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </div>
    </div>
  )
}
