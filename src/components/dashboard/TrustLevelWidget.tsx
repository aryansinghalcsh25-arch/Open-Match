// Trust Ladder — visual path showing levels 0–4 with the user's position marked
// Replaces the generic number-in-a-box + progress bar pattern

interface Props {
  level: number        // 0, 1, 2, 3, or 4
  score: number        // current points e.g. 45
  maxScore: number     // points needed for next level e.g. 100
  levelName: string    // e.g. "Emerging"
}

const trustColors: Record<number, string> = {
  0: 'var(--trust-0)',
  1: 'var(--trust-1)',
  2: 'var(--trust-2)',
  3: 'var(--trust-3)',
  4: 'var(--trust-4)',
}

const levelLabels = ['New', 'Learning', 'Emerging', 'Established', 'Leader']

export default function TrustLevelWidget({ level, score, maxScore, levelName }: Props) {
  const color = trustColors[level]
  const progressPercent = (score / maxScore) * 100
  const pointsLeft = maxScore - score
  const isMaxLevel = level >= 4

  return (
    <div
      onClick={() => window.location.href = '/trust'}
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <p style={{
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-display)',
          fontSize: '13px',
          fontWeight: 500,
          margin: 0,
        }}>
          Trust Level
        </p>
        <span style={{
          color: color,
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          fontWeight: 700,
        }}>
          {levelName}
        </span>
      </div>

      {/* Trust ladder — visual path of 5 steps */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 0',
      }}>
        {[0, 1, 2, 3, 4].map((i) => {
          const isActive = i === level
          const isReached = i <= level
          const ladderColor = trustColors[i]
          return (
            <div key={i} style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
            }}>
              {/* Step indicator */}
              <div style={{
                width: isActive ? '36px' : '28px',
                height: isActive ? '36px' : '28px',
                borderRadius: '50%',
                backgroundColor: isReached ? ladderColor : 'transparent',
                border: `2px solid ${isReached ? ladderColor : 'var(--border-default)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 300ms ease',
                boxShadow: isActive ? `0 0 12px ${ladderColor}40` : 'none',
              }}>
                <span style={{
                  color: isReached ? 'var(--text-inverse)' : 'var(--text-tertiary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: isActive ? '13px' : '11px',
                  fontWeight: 700,
                }}>
                  {i}
                </span>
              </div>
              {/* Connector line to next step (except for last) */}
              {i < 4 && (
                <div style={{
                  width: '100%',
                  height: '2px',
                  backgroundColor: isReached && i < level ? ladderColor : 'var(--border-default)',
                  marginTop: '-4px',
                  opacity: isReached && i < level ? 1 : 0.4,
                }} />
              )}
              {/* Label */}
              <span style={{
                fontSize: '10px',
                color: isActive ? ladderColor : 'var(--text-tertiary)',
                fontFamily: 'var(--font-display)',
                fontWeight: isActive ? 600 : 400,
                whiteSpace: 'nowrap',
              }}>
                {levelLabels[i]}
              </span>
            </div>
          )
        })}
      </div>

      {/* Progress to next level */}
      {!isMaxLevel && (
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '6px',
          }}>
            <span style={{
              color: 'var(--text-tertiary)',
              fontFamily: 'var(--font-display)',
              fontSize: '11px',
            }}>
              Progress to Level {level + 1}
            </span>
            <span style={{
              color: color,
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 600,
            }}>
              {score}/{maxScore}
            </span>
          </div>
          <div style={{
            height: '6px',
            backgroundColor: 'var(--bg-elevated)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${progressPercent}%`,
              backgroundColor: color,
              borderRadius: 'var(--radius-full)',
              transition: 'width 600ms ease',
            }} />
          </div>
          <p style={{
            color: 'var(--text-tertiary)',
            fontFamily: 'var(--font-display)',
            fontSize: '11px',
            margin: '6px 0 0 0',
          }}>
            {pointsLeft} pts to {levelLabels[level + 1] || 'next level'}
          </p>
        </div>
      )}

      {isMaxLevel && (
        <p style={{
          color: trustColors[4],
          fontFamily: 'var(--font-display)',
          fontSize: '12px',
          fontWeight: 600,
          margin: 0,
          textAlign: 'center',
        }}>
          You've reached the highest level
        </p>
      )}
    </div>
  )
}