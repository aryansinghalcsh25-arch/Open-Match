import { Send, MoreVertical } from 'lucide-react'

export default function MessagesPage() {
  return (
    <div style={{ height: 'calc(100vh - 120px)', display: 'flex', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '12px', overflow: 'hidden' }}>
      
      {/* Left Pane - Inbox */}
      <div style={{ width: '320px', borderRight: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-default)' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>Messages</h2>
        </div>
        
        <div style={{ overflowY: 'auto', flex: 1 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'rgba(255,255,255,0.03)', cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>Sarah Chen</span>
              <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>10:42 AM</span>
            </div>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Hi! Are you still interested in helping out with the React Dashboard project?
            </p>
          </div>
        </div>
      </div>

      {/* Right Pane - Chat View */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-base)' }}>
        
        {/* Chat Header */}
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', fontWeight: 'bold' }}>
              S
            </div>
            <div>
              <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1rem' }}>Sarah Chen</h3>
              <p style={{ margin: 0, color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>Maintainer • React Dashboard</p>
            </div>
          </div>
          <button style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}>
            <MoreVertical size={20} />
          </button>
        </div>

        {/* Chat History */}
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ alignSelf: 'center', color: 'var(--text-tertiary)', fontSize: '0.75rem', margin: '8px 0' }}>Today</div>
          
          <div style={{ display: 'flex', gap: '12px', maxWidth: '80%' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', fontWeight: 'bold', flexShrink: 0 }}>S</div>
            <div style={{ backgroundColor: 'var(--bg-surface)', padding: '12px 16px', borderRadius: '0 12px 12px 12px', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Hi! Are you still interested in helping out with the React Dashboard project? I saw you matched with it yesterday.
            </div>
          </div>

        </div>

        {/* Chat Input */}
        <div style={{ padding: '20px', borderTop: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-surface)' }}>
          <div style={{ position: 'relative' }}>
            <input type="text" placeholder="Type a message..." style={{
              width: '100%',
              backgroundColor: 'var(--bg-base)',
              border: '1px solid var(--border-default)',
              borderRadius: '8px',
              padding: '12px 48px 12px 16px',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
              fontSize: '0.9rem',
              outline: 'none',
              boxSizing: 'border-box'
            }} />
            <button style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: 'var(--accent-primary)',
              cursor: 'pointer',
              padding: 0,
              display: 'flex'
            }}>
              <Send size={18} />
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
