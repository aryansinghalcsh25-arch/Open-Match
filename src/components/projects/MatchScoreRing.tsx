// Horizontal match score display — bold percentage + colored dot + mini bar
// Replaces the circular SVG ring which was extremely common in generated dashboards

interface Props {
  score: number           // 0 to 100
  size?: 'sm' | 'md' | 'lg'
}

const fontSizes = {
  sm: '14px',
  md: '18px',
  lg: '26px',
}

const barWidths = {
  sm: '60px',
  md: '80px',
  lg: '120px',
}

export default function MatchScoreRing({ score, size = 'md' }: Props) {
  let color = 'var(--match-high)'
  if (score < 50) color = 'var(--match-low)'
  else if (score < 70) color = 'var(--match-medium)'

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      flexShrink: 0,
    }}>
      {/* Colored dot */}
      <span style={{
        width: size === 'sm' ? '8px' : size === 'md' ? '10px' : '14px',
        height: size === 'sm' ? '8px' : size === 'md' ? '10px' : '14px',
        borderRadius: '50%',
        backgroundColor: color,
        flexShrink: 0,
      }} />

      {/* Bold percentage */}
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: fontSizes[size],
        fontWeight: 700,
        color: color,
        lineHeight: 1,
      }}>
        {score}%
      </span>

      {/* Mini horizontal bar */}
      <div style={{
        width: barWidths[size],
        height: size === 'sm' ? '4px' : size === 'md' ? '5px' : '7px',
        backgroundColor: 'var(--bg-elevated)',
        borderRadius: 'var(--radius-full)',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${score}%`,
          backgroundColor: color,
          borderRadius: 'var(--radius-full)',
          transition: 'width 600ms ease',
        }} />
      </div>
    </div>
  )
}