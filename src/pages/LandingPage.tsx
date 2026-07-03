import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-base)',
      fontFamily: 'var(--font-display)',
    }}>

      {/* HERO SECTION — split layout: left text + right graph visualization */}
      <div style={{
        padding: '100px 40px 80px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '60px',
          alignItems: 'center',
        }}>
          {/* LEFT — headline + subhead + buttons */}
          <div>
            <h1 style={{
              fontSize: 'clamp(36px, 4.5vw, 52px)',
              fontWeight: '700',
              color: 'var(--text-primary)',
              lineHeight: '1.15',
              margin: '0 0 20px 0',
              letterSpacing: '-0.02em',
            }}>
              Matched by skill graph,<br />
              <span style={{ color: 'var(--accent-primary)' }}>not by keywords.</span>
            </h1>

            <p style={{
              fontSize: '17px',
              color: 'var(--text-secondary)',
              lineHeight: '1.7',
              margin: '0 0 36px 0',
              maxWidth: '440px',
            }}>
              OpenMatch maps contributor skills and project needs onto a shared trust graph — so the right match finds you, not the other way around.
            </p>

            <div style={{
              display: 'flex',
              gap: '20px',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}>
              <Link to="/login" style={{
                backgroundColor: 'var(--accent-primary)',
                color: 'var(--text-inverse)',
                padding: '14px 32px',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '16px',
                display: 'inline-block',
              }}>
                Sign up with GitHub
              </Link>
              <Link to="/login" style={{
                color: 'var(--text-secondary)',
                fontSize: '15px',
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
                textDecorationColor: 'var(--border-default)',
                fontWeight: '500',
              }}>
                Sign in
              </Link>
            </div>

            {/* Inline social proof — replaces stat bar */}
            <p style={{
              color: 'var(--text-tertiary)',
              fontSize: '13px',
              marginTop: '40px',
              lineHeight: '1.6',
            }}>
              Trusted by maintainers at <strong style={{ color: 'var(--text-secondary)' }}>Kubernetes SIGs</strong>,{' '}
              <strong style={{ color: 'var(--text-secondary)' }}>Astral</strong>, and{' '}
              <strong style={{ color: 'var(--text-secondary)' }}>HashiCorp</strong>.
            </p>
          </div>

          {/* RIGHT — graph visualization mockup */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '32px',
            position: 'relative',
            minHeight: '360px',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* Terminal-style header */}
            <div style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '24px',
              alignItems: 'center',
            }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#B5564F' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#C99A4B' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#6B9B6E' }} />
              <span style={{
                color: 'var(--text-tertiary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                marginLeft: '8px',
              }}>
                graph://match-engine/live
              </span>
            </div>

            {/* Graph nodes visualization */}
            <svg viewBox="0 0 400 280" style={{ width: '100%', height: 'auto' }}>
              {/* Edges */}
              <line x1="200" y1="30" x2="100" y2="120" stroke="var(--border-default)" strokeWidth="1.5" />
              <line x1="200" y1="30" x2="300" y2="120" stroke="var(--border-default)" strokeWidth="1.5" />
              <line x1="100" y1="120" x2="50" y2="220" stroke="var(--border-default)" strokeWidth="1.5" />
              <line x1="100" y1="120" x2="180" y2="220" stroke="var(--border-default)" strokeWidth="1.5" />
              <line x1="300" y1="120" x2="220" y2="220" stroke="var(--border-default)" strokeWidth="1.5" />
              <line x1="300" y1="120" x2="350" y2="220" stroke="var(--border-default)" strokeWidth="1.5" />
              <line x1="180" y1="220" x2="220" y2="220" stroke="var(--border-default)" strokeWidth="1.5" strokeDasharray="4 3" />
              {/* Highlighted match path */}
              <line x1="200" y1="30" x2="100" y2="120" stroke="var(--accent-primary)" strokeWidth="2.5" />
              <line x1="100" y1="120" x2="180" y2="220" stroke="var(--accent-primary)" strokeWidth="2.5" />
              {/* Nodes */}
              <circle cx="200" cy="30" r="18" fill="var(--bg-elevated)" stroke="var(--accent-primary)" strokeWidth="2.5" />
              <text x="200" y="35" textAnchor="middle" fill="var(--accent-primary)" fontFamily="var(--font-mono)" fontSize="10" fontWeight="700">YOU</text>
              <circle cx="100" cy="120" r="14" fill="var(--bg-elevated)" stroke="var(--border-default)" strokeWidth="1.5" />
              <text x="100" y="125" textAnchor="middle" fill="var(--text-secondary)" fontFamily="var(--font-mono)" fontSize="9">Go</text>
              <circle cx="300" cy="120" r="14" fill="var(--bg-elevated)" stroke="var(--border-default)" strokeWidth="1.5" />
              <text x="300" y="125" textAnchor="middle" fill="var(--text-secondary)" fontFamily="var(--font-mono)" fontSize="9">TS</text>
              <circle cx="50" cy="220" r="12" fill="var(--bg-elevated)" stroke="var(--border-default)" strokeWidth="1.5" />
              <text x="50" y="224" textAnchor="middle" fill="var(--text-tertiary)" fontFamily="var(--font-mono)" fontSize="8">K8s</text>
              <circle cx="180" cy="220" r="16" fill="var(--bg-elevated)" stroke="var(--accent-primary)" strokeWidth="2" />
              <text x="180" y="225" textAnchor="middle" fill="var(--accent-primary)" fontFamily="var(--font-mono)" fontSize="9" fontWeight="600">gRPC</text>
              <circle cx="220" cy="220" r="12" fill="var(--bg-elevated)" stroke="var(--border-default)" strokeWidth="1.5" />
              <text x="220" y="224" textAnchor="middle" fill="var(--text-tertiary)" fontFamily="var(--font-mono)" fontSize="8">Rust</text>
              <circle cx="350" cy="220" r="12" fill="var(--bg-elevated)" stroke="var(--border-default)" strokeWidth="1.5" />
              <text x="350" y="224" textAnchor="middle" fill="var(--text-tertiary)" fontFamily="var(--font-mono)" fontSize="8">React</text>
              {/* Match score label */}
              <rect x="130" y="150" width="100" height="24" rx="12" fill="var(--accent-primary)" opacity="0.15" />
              <text x="180" y="166" textAnchor="middle" fill="var(--accent-primary)" fontFamily="var(--font-mono)" fontSize="11" fontWeight="700">92% match</text>
            </svg>

            <p style={{
              color: 'var(--text-tertiary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              margin: '16px 0 0 0',
              textAlign: 'center',
            }}>
              Live skill graph — each edge is a verified capability
            </p>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{
        padding: '80px 40px',
        maxWidth: '1100px',
        margin: '0 auto',
      }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: 'var(--text-primary)',
          marginBottom: '48px',
          letterSpacing: '-0.01em',
        }}>
          How it works
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
        }}>
          {[
            { icon: '📋', title: 'Post your needs', desc: 'Maintainers list their project with required skills, open issues, and contribution types.' },
            { icon: '🤝', title: 'Get matched', desc: 'Our graph engine finds contributors whose skills align with your project requirements.' },
            { icon: '🚀', title: 'Build your path', desc: 'Newcomers earn trust through learning paths and mentorship to unlock more opportunities.' },
          ].map((card) => (
            <div key={card.title} style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '32px 24px',
              textAlign: 'left',
            }}>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>{card.icon}</div>
              <h3 style={{
                color: 'var(--text-primary)',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '12px',
                marginTop: 0,
              }}>
                {card.title}
              </h3>
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '14px',
                lineHeight: '1.6',
                margin: 0,
              }}>
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* PERSONA SECTION */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '80px 40px',
      }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
        }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: 'var(--text-primary)',
            marginBottom: '48px',
            letterSpacing: '-0.01em',
          }}>
            Built for everyone in open source
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}>
            {[
              {
                color: 'var(--accent-secondary)',
                name: 'Priya',
                role: 'Project Maintainer',
                quote: '"I used to spend hours reviewing mismatched PRs. Now I get contributors who actually know my stack."',
              },
              {
                color: 'var(--accent-primary)',
                name: 'Marcus',
                role: 'Experienced Contributor',
                quote: '"Finally a platform that surfaces projects that match my Go and distributed systems experience."',
              },
              {
                color: 'var(--accent-gold)',
                name: 'Aisha',
                role: 'Newcomer',
                quote: '"I had zero merged PRs. OpenMatch gave me a learning path and a mentor. Now I have three."',
              },
            ].map((persona) => (
              <div key={persona.name} style={{
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderTop: `3px solid ${persona.color}`,
                borderRadius: 'var(--radius-lg)',
                padding: '28px 24px',
                textAlign: 'left',
              }}>
                <div style={{
                  color: persona.color,
                  fontWeight: '700',
                  fontSize: '16px',
                  marginBottom: '4px',
                }}>
                  {persona.name}
                </div>
                <div style={{
                  color: 'var(--text-secondary)',
                  fontSize: '13px',
                  marginBottom: '16px',
                }}>
                  {persona.role}
                </div>
                <p style={{
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  margin: '0 0 20px',
                  fontStyle: 'italic',
                }}>
                  {persona.quote}
                </p>
                <Link to="/login" style={{
                  color: persona.color,
                  fontSize: '14px',
                  textDecoration: 'none',
                  fontWeight: '600',
                }}>
                  Get started →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER CTA */}
      <div style={{
        backgroundColor: 'var(--bg-base)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '80px 40px',
        textAlign: 'center',
      }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: 'var(--text-primary)',
          marginBottom: '16px',
        }}>
          Ready to start?
        </h2>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '16px',
          marginBottom: '32px',
        }}>
          Join thousands of contributors and maintainers already on OpenMatch.
        </p>
        <Link to="/login" style={{
          backgroundColor: 'var(--accent-primary)',
          color: 'var(--text-inverse)',
          padding: '14px 36px',
          borderRadius: 'var(--radius-md)',
          textDecoration: 'none',
          fontWeight: '600',
          fontSize: '16px',
        }}>
          Get Started
        </Link>
      </div>

      {/* FOOTER */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '24px 40px',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '24px',
          flexWrap: 'wrap',
        }}>
          {['About', 'Privacy Policy', 'Terms of Service'].map((link) => (
            <a key={link} href="#" style={{
              color: 'var(--text-secondary)',
              fontSize: '13px',
              textDecoration: 'none',
            }}>
              {link}
            </a>
          ))}
        </div>
        <p style={{
          color: 'var(--text-tertiary)',
          fontSize: '12px',
          marginTop: '12px',
        }}>
          © 2025 OpenMatch. Open Source Contributor Matching Platform.
        </p>
      </div>

    </div>
  )
}