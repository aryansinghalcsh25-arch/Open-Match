import { Users, Search, Star, MessageSquare } from 'lucide-react'

const MENTORS = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'Core Maintainer @ React',
    tags: ['React', 'Frontend', 'Architecture'],
    available: true
  },
  {
    id: '2',
    name: 'David Kim',
    role: 'Senior OSS Engineer',
    tags: ['Go', 'Kubernetes', 'Backend'],
    available: false
  }
]

export default function MentorshipPage() {
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
          Mentorship
        </h1>
        <p style={{ 
          fontSize: '0.95rem', 
          color: 'var(--text-secondary)', 
          margin: 0,
          fontFamily: 'var(--font-display)' 
        }}>
          Find a mentor to guide your open source journey, or offer to mentor others.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px'
      }}>
        
        {/* Left Column - Find a Mentor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', margin: 0, fontFamily: 'var(--font-display)' }}>Find a Mentor</h2>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input type="text" placeholder="Search skills..." style={{
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-default)',
                borderRadius: '20px',
                padding: '6px 12px 6px 30px',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-display)',
                fontSize: '0.85rem',
                outline: 'none',
                width: '150px'
              }} />
            </div>
          </div>

          {MENTORS.map(m => (
            <div key={m.id} style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', fontWeight: 'bold' }}>
                  {m.name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', margin: 0, fontFamily: 'var(--font-display)' }}>{m.name}</h3>
                    {m.available ? (
                      <span style={{ color: 'var(--state-success)', fontSize: '0.75rem', fontWeight: 600, fontFamily: 'var(--font-display)' }}>● Accepting Mentees</span>
                    ) : (
                      <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', fontWeight: 600, fontFamily: 'var(--font-display)' }}>Full</span>
                    )}
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '2px 0 0 0', fontFamily: 'var(--font-display)' }}>{m.role}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                {m.tags.map(t => (
                  <span key={t} style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-default)', borderRadius: '4px', padding: '2px 6px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{t}</span>
                ))}
              </div>

              <button disabled={!m.available} style={{
                backgroundColor: m.available ? 'var(--accent-primary)' : 'var(--bg-elevated)',
                color: m.available ? '#fff' : 'var(--text-tertiary)',
                border: 'none',
                padding: '8px',
                borderRadius: '6px',
                fontWeight: 600,
                cursor: m.available ? 'pointer' : 'not-allowed',
                marginTop: '4px',
                fontFamily: 'var(--font-display)'
              }}>
                Request Mentorship
              </button>
            </div>
          ))}
        </div>

        {/* Right Column - My Mentorships */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', margin: 0, fontFamily: 'var(--font-display)' }}>My Active Mentorships</h2>
          
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px dashed var(--border-default)',
            borderRadius: '12px',
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '12px'
          }}>
            <Users size={32} color="var(--text-tertiary)" />
            <div>
              <h3 style={{ color: 'var(--text-primary)', margin: '0 0 4px', fontSize: '1rem', fontFamily: 'var(--font-display)' }}>No active mentorships</h3>
              <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.85rem', fontFamily: 'var(--font-display)' }}>Request a mentor from the list, or update your profile to offer mentorship to others.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
