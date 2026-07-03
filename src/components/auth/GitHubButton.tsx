interface GitHubButtonProps {
  onClick?: () => void
  loading?: boolean
}

export default function GitHubButton({ onClick, loading = false }: GitHubButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      style={{
        width: '100%',
        backgroundColor: loading ? 'var(--bg-elevated)' : 'var(--accent-primary)',
        color: loading ? 'var(--text-tertiary)' : 'var(--text-inverse)',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        padding: '10px 20px',
        fontFamily: 'var(--font-display)',
        fontSize: '15px',
        fontWeight: '600',
        cursor: loading ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        marginBottom: '24px',
      }}
    >
      {loading ? (
        <>
          <div style={{
            width: '16px',
            height: '16px',
            border: '2px solid var(--text-tertiary)',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          Connecting to GitHub...
        </>
      ) : (
        <>
          🐙 Continue with GitHub
        </>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  )
}