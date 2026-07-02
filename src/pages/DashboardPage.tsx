import { Link } from 'react-router-dom'
import TrustLevelWidget from '../components/dashboard/TrustLevelWidget'
import ProjectCard from '../components/projects/ProjectCard'

export default function DashboardPage() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

      {/* Functional header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
      }}>
        <div>
          <p style={{
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-display)',
            fontSize: '14px',
            fontWeight: 600,
            margin: 0,
          }}>
            3 projects need your trust level
          </p>
          <p style={{
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-display)',
            fontSize: '12px',
            margin: '3px 0 0 0',
          }}>
            Tuesday, July 2
          </p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: '24px'
      }}>

        <TrustLevelWidget
          level={2}
          score={45}
          maxScore={100}
          levelName="Emerging"
        />

        {/* Top Matches panel */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
              fontSize: '16px',
              fontWeight: 600,
              margin: 0
            }}>
              Your Top Matches
            </h2>
            <Link to="/projects" style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-display)', fontSize: '13px', textDecoration: 'none' }}>
              See all →
            </Link>
          </div>

          {/* Eligible (unlocked) card — full detail */}
          <ProjectCard
            id="1"
            name="TypeScript Utility Library"
            description="A popular utility library for TypeScript developers. We need help with new features and documentation."
            skills={['TypeScript', 'Node.js', 'Jest', 'Rollup', 'GitHub Actions']}
            matchScore={85}
            minTrustLevel={1}
            openIssues={12}
            isLocked={false}
          />

          {/* Locked card — collapsed, quieter */}
          <ProjectCard
            id="2"
            name="Go gRPC Framework"
            description="High performance gRPC framework for Go. Looking for contributors with distributed systems experience."
            skills={['Go', 'gRPC', 'Protobuf']}
            matchScore={62}
            minTrustLevel={2}
            openIssues={7}
            isLocked={true}
          />

        </div>
      </div>
    </div>
  )
}