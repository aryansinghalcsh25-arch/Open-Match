export default function SkeletonCard() {
  return (
    <div style={{
      backgroundColor: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div className="skeleton" style={{ height: '18px', width: '60%', borderRadius: 'var(--radius-sm)' }} />
        <div className="skeleton" style={{ height: '48px', width: '48px', borderRadius: 'var(--radius-full)' }} />
      </div>
      <div className="skeleton" style={{ height: '14px', width: '100%', borderRadius: 'var(--radius-sm)' }} />
      <div className="skeleton" style={{ height: '14px', width: '80%', borderRadius: 'var(--radius-sm)' }} />
      <div style={{ display: 'flex', gap: '6px' }}>
        <div className="skeleton" style={{ height: '22px', width: '70px', borderRadius: 'var(--radius-sm)' }} />
        <div className="skeleton" style={{ height: '22px', width: '60px', borderRadius: 'var(--radius-sm)' }} />
        <div className="skeleton" style={{ height: '22px', width: '80px', borderRadius: 'var(--radius-sm)' }} />
      </div>
    </div>
  )
}