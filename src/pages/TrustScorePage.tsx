import TrustLevelWidget from '../components/dashboard/TrustLevelWidget'
import { Shield, GitMerge, CheckCircle, MessageSquare } from 'lucide-react'

export default function TrustScorePage() {
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
          Trust Score
        </h1>
        <p style={{ 
          fontSize: '0.95rem', 
          color: 'var(--text-secondary)', 
          margin: 0,
          fontFamily: 'var(--font-display)' 
        }}>
          Your trust score determines which projects you can join. Build trust by contributing consistently.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Left: Current Level */}
        <div>
          <TrustLevelWidget
            level={2}
            score={45}
            maxScore={100}
            levelName="Emerging"
          />
          
          <div style={{ marginTop: '24px', padding: '20px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
            <h3 style={{ color: 'var(--text-primary)', margin: '0 0 16px', fontSize: '1rem', fontFamily: 'var(--font-display)' }}>Next Level Requirements</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={16} color="var(--state-success)"/> 50 points total (45/50)</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={16} color="var(--state-success)"/> Complete Level 2 Path</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-tertiary)' }}><div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '1px solid var(--border-default)' }}/> Have 3 PRs merged (1/3)</li>
            </ul>
          </div>
        </div>

        {/* Right: History */}
        <div style={{ padding: '20px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
          <h3 style={{ color: 'var(--text-primary)', margin: '0 0 16px', fontSize: '1rem', fontFamily: 'var(--font-display)' }}>Recent Trust Activity</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(0, 212, 177, 0.1)', color: 'var(--state-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <GitMerge size={16} />
              </div>
              <div>
                <p style={{ margin: '0 0 4px', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 500 }}>PR Merged in React Dashboard</p>
                <p style={{ margin: 0, color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>2 days ago • +15 pts</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(156, 150, 144, 0.1)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MessageSquare size={16} />
              </div>
              <div>
                <p style={{ margin: '0 0 4px', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 500 }}>Helped triage 3 issues</p>
                <p style={{ margin: 0, color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>1 week ago • +5 pts</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(156, 150, 144, 0.1)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CheckCircle size={16} />
              </div>
              <div>
                <p style={{ margin: '0 0 4px', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 500 }}>Completed Level 1 Path</p>
                <p style={{ margin: 0, color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>1 month ago • +25 pts</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
