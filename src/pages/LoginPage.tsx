import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import AuthCard from '../components/auth/AuthCard'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const isDisabled = !email || !password

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('Incorrect email or password.')
  }

  return (
    <AuthCard>
      <button style={{
        width: '100%',
        backgroundColor: 'var(--accent-primary)',
        color: 'var(--text-inverse)',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        padding: '10px 20px',
        fontFamily: 'var(--font-display)',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        marginBottom: '24px',
      }}>
        Continue with GitHub
      </button>

      <div style={{
        textAlign: 'center',
        color: 'var(--text-secondary)',
        marginBottom: '24px',
        fontSize: '14px',
      }}>
        — or —
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <div style={{
            backgroundColor: 'var(--state-error-bg)',
            border: '1px solid var(--state-error)',
            color: 'var(--state-error)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 14px',
            marginBottom: '16px',
            fontSize: '14px',
          }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            color: 'var(--text-primary)',
            fontSize: '14px',
            marginBottom: '6px',
            fontFamily: 'var(--font-display)',
          }}>
            Email address
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{
              width: '100%',
              backgroundColor: 'var(--bg-base)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '8px' }}>
          <label style={{
            display: 'block',
            color: 'var(--text-primary)',
            fontSize: '14px',
            marginBottom: '6px',
            fontFamily: 'var(--font-display)',
          }}>
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                backgroundColor: 'var(--bg-base)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 40px 10px 14px',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-display)',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                padding: 0,
              }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'right', marginBottom: '24px' }}>
          <Link to="/forgot-password" style={{
            color: 'var(--accent-primary)',
            fontSize: '13px',
            textDecoration: 'none',
            fontFamily: 'var(--font-display)',
          }}>
            Forgot your password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isDisabled}
          style={{
            width: '100%',
            backgroundColor: isDisabled ? 'var(--bg-elevated)' : 'var(--accent-primary)',
            color: isDisabled ? 'var(--text-tertiary)' : 'var(--text-inverse)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            padding: '10px 20px',
            fontFamily: 'var(--font-display)',
            fontSize: '15px',
            fontWeight: '600',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            marginBottom: '24px',
          }}
        >
          Sign in
        </button>
      </form>

      <div style={{
        textAlign: 'center',
        color: 'var(--text-secondary)',
        fontSize: '14px',
        fontFamily: 'var(--font-display)',
      }}>
        Don't have an account?{' '}
        <Link to="/" style={{
          color: 'var(--accent-primary)',
          textDecoration: 'none',
        }}>
          Sign up
        </Link>
      </div>
    </AuthCard>
  )
}