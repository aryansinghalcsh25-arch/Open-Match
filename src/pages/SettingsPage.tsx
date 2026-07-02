// ============================================================
// SettingsPage.tsx
// ============================================================
// Route: /settings  (inside DashboardLayout — has sidebar)
//
// SECTIONS
//   1. Profile      — quick link to edit profile + preview
//   2. Notifications — toggles for every notification type
//   3. Privacy      — visibility and contact preferences
//   4. Account      — sign out + danger zone
//
// All toggles are local state right now.
// When backend is ready: swap useState with TanStack mutations.
// ============================================================

import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  User, Bell, Lock, AlertTriangle,
  ChevronRight, Check, MapPin, Globe,
} from 'lucide-react'
import TrustBadge from '../components/profile/TrustBadge'

// ─── Toggle component ────────────────────────────────────────

function Toggle({
  id,
  checked,
  onChange,
}: {
  id: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      style={{
        width: '40px',
        height: '22px',
        borderRadius: '999px',
        border: 'none',
        backgroundColor: checked ? 'var(--accent-primary)' : 'var(--bg-overlay)',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        flexShrink: 0,
        padding: 0,
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: '3px',
          left: checked ? '21px' : '3px',
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          backgroundColor: '#fff',
          transition: 'left 0.2s ease',
          boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
        }}
      />
    </button>
  )
}

// ─── Section wrapper ─────────────────────────────────────────

function Section({
  id,
  icon,
  title,
  subtitle,
  children,
}: {
  id?: string
  icon: React.ReactNode
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: '14px',
        overflow: 'hidden',
      }}
    >
      {/* Section header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <span style={{ color: 'var(--accent-primary)' }}>{icon}</span>
        <div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.975rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            {title}
          </h2>
          {subtitle && (
            <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', margin: '2px 0 0' }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {children}
    </section>
  )
}

// ─── Setting row — label + description + control ─────────────

function SettingRow({
  label,
  description,
  control,
  noBorder,
}: {
  label: React.ReactNode
  description?: React.ReactNode
  control: React.ReactNode
  noBorder?: boolean
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px',
        padding: '1rem 1.5rem',
        borderBottom: noBorder ? 'none' : '1px solid var(--border-subtle)',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.9rem',
            fontWeight: 500,
            color: 'var(--text-primary)',
            margin: 0,
          }}
        >
          {label}
        </p>
        {description && (
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '3px 0 0', lineHeight: 1.5 }}>
            {description}
          </p>
        )}
      </div>
      <div style={{ flexShrink: 0 }}>{control}</div>
    </div>
  )
}

// ─── Main component ──────────────────────────────────────────

export default function SettingsPage() {

  // ── Notification prefs ──────────────────────────────────────
  const [notifs, setNotifs] = useState({
    matchAlerts:      true,
    newMessages:      true,
    projectUpdates:   true,
    mentorRequests:   true,
    weeklyDigest:     false,
    marketingEmails:  false,
  })

  function setNotif(key: keyof typeof notifs, val: boolean) {
    setNotifs(prev => ({ ...prev, [key]: val }))
  }

  // ── Privacy prefs ───────────────────────────────────────────
  const [privacy, setPrivacy] = useState({
    publicProfile:    true,
    showLocation:     true,
    openToContact:    true,
    showTrustScore:   true,
  })

  function setPriv(key: keyof typeof privacy, val: boolean) {
    setPrivacy(prev => ({ ...prev, [key]: val }))
  }

  // ── Danger zone confirm ─────────────────────────────────────
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', fontFamily: 'var(--font-display)' }}>

      {/* Page title */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1
          style={{
            fontSize: '1.35rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            margin: 0,
            letterSpacing: '-0.01em',
          }}
        >
          Settings
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
          Manage your account preferences and privacy
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* ═══════════════════════════════════════════════
            SECTION 1 — Profile
        ═══════════════════════════════════════════════ */}
        <Section id="settings-profile" icon={<User size={16} />} title="Profile" subtitle="Your public contributor identity">

          {/* Profile preview card */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-elevated)',
                border: '2px solid var(--border-default)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span style={{ fontWeight: 700, fontSize: '1.35rem', color: 'var(--accent-primary)' }}>P</span>
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                  Priya Sharma
                </span>
                <TrustBadge level={3} />
              </div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
                @priyasharma
              </p>
              <div style={{ display: 'flex', gap: '12px', marginTop: '5px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                  <MapPin size={11} /> Bangalore, India
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                  <Globe size={11} /> priyasharma.dev
                </span>
              </div>
            </div>

            {/* Edit link */}
            <Link
              to="/profile/edit"
              id="settings-edit-profile-link"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid var(--accent-primary)',
                backgroundColor: 'var(--accent-glow)',
                color: 'var(--accent-primary)',
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: '0.85rem',
                textDecoration: 'none',
                flexShrink: 0,
                transition: 'background-color 0.15s ease, color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent-primary)'
                e.currentTarget.style.color = 'var(--text-inverse)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent-glow)'
                e.currentTarget.style.color = 'var(--accent-primary)'
              }}
            >
              Edit profile
              <ChevronRight size={14} />
            </Link>
          </div>

          {/* GitHub connection */}
          <SettingRow
            label="GitHub account"
            description="Connected as @priyasharma — used for skill verification and contribution tracking"
            noBorder
            control={
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  backgroundColor: 'var(--state-success-bg)',
                  border: '1px solid var(--state-success)',
                  color: 'var(--state-success)',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                }}
              >
                <Check size={11} /> Connected
              </span>
            }
          />
        </Section>

        {/* ═══════════════════════════════════════════════
            SECTION 2 — Notifications
        ═══════════════════════════════════════════════ */}
        <Section
          id="settings-notifications"
          icon={<Bell size={16} />}
          title="Notifications"
          subtitle="Choose what you get notified about"
        >
          <SettingRow
            label="Match alerts"
            description="Get notified when a new project matches your skill graph"
            control={<Toggle id="toggle-match-alerts" checked={notifs.matchAlerts} onChange={v => setNotif('matchAlerts', v)} />}
          />
          <SettingRow
            label="New messages"
            description="Notify when a maintainer or mentor sends you a message"
            control={<Toggle id="toggle-messages" checked={notifs.newMessages} onChange={v => setNotif('newMessages', v)} />}
          />
          <SettingRow
            label="Project updates"
            description="Updates on projects you've contributed to or starred"
            control={<Toggle id="toggle-project-updates" checked={notifs.projectUpdates} onChange={v => setNotif('projectUpdates', v)} />}
          />
          <SettingRow
            label="Mentor requests"
            description="When someone sends you a mentorship request"
            control={<Toggle id="toggle-mentor-requests" checked={notifs.mentorRequests} onChange={v => setNotif('mentorRequests', v)} />}
          />
          <SettingRow
            label="Weekly digest"
            description="A summary of your top matches and activity every Monday"
            control={<Toggle id="toggle-weekly-digest" checked={notifs.weeklyDigest} onChange={v => setNotif('weeklyDigest', v)} />}
          />
          <SettingRow
            label="Marketing emails"
            description="Product news, feature announcements, and tips"
            noBorder
            control={<Toggle id="toggle-marketing" checked={notifs.marketingEmails} onChange={v => setNotif('marketingEmails', v)} />}
          />
        </Section>

        {/* ═══════════════════════════════════════════════
            SECTION 3 — Privacy
        ═══════════════════════════════════════════════ */}
        <Section
          id="settings-privacy"
          icon={<Lock size={16} />}
          title="Privacy"
          subtitle="Control who can see your profile and contact you"
        >
          <SettingRow
            label="Public profile"
            description="Anyone can view your contributor profile at /contributors/your-id"
            control={<Toggle id="toggle-public-profile" checked={privacy.publicProfile} onChange={v => setPriv('publicProfile', v)} />}
          />
          <SettingRow
            label="Show location"
            description="Display your city/region on your public profile"
            control={<Toggle id="toggle-show-location" checked={privacy.showLocation} onChange={v => setPriv('showLocation', v)} />}
          />
          <SettingRow
            label="Open to contact"
            description="Allow maintainers and mentors to send you messages directly"
            control={<Toggle id="toggle-open-contact" checked={privacy.openToContact} onChange={v => setPriv('openToContact', v)} />}
          />
          <SettingRow
            label="Show trust score"
            description="Display your trust level badge on your public profile"
            noBorder
            control={<Toggle id="toggle-trust-score" checked={privacy.showTrustScore} onChange={v => setPriv('showTrustScore', v)} />}
          />
        </Section>

        {/* ═══════════════════════════════════════════════
            SECTION 4 — Account
        ═══════════════════════════════════════════════ */}
        <Section
          id="settings-account"
          icon={<AlertTriangle size={16} />}
          title="Account"
          subtitle="Sign out or permanently delete your account"
        >
          {/* Sign out */}
          <SettingRow
            label="Sign out"
            description="Log out of your current session on this device"
            control={
              <button
                id="btn-sign-out"
                style={{
                  padding: '7px 18px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-default)',
                  backgroundColor: 'transparent',
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s ease, color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-active)'
                  e.currentTarget.style.color = 'var(--text-primary)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-default)'
                  e.currentTarget.style.color = 'var(--text-secondary)'
                }}
              >
                Sign out
              </button>
            }
          />

          {/* Danger zone */}
          <SettingRow
            noBorder
            label={
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--state-error)', fontWeight: 700 }}>
                <AlertTriangle size={14} />
                Delete account
              </span>
            }
            description={
              <span>
                Permanently removes your profile, skills, contributions and trust history.{' '}
                <strong style={{ color: 'var(--text-primary)' }}>This cannot be undone.</strong>
              </span>
            }
            control={
              !deleteConfirm ? (
                <button
                  id="btn-delete-account-confirm"
                  onClick={() => setDeleteConfirm(true)}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: 'var(--state-error)',
                    color: '#fff',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'opacity 0.15s ease',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85' }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
                >
                  Delete account
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <button
                    id="btn-delete-account-cancel"
                    onClick={() => setDeleteConfirm(false)}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-default)',
                      backgroundColor: 'transparent',
                      color: 'var(--text-secondary)',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 500,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    id="btn-delete-account-final"
                    style={{
                      padding: '7px 14px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: 'var(--state-error)',
                      color: '#fff',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                    }}
                  >
                    Yes, delete permanently
                  </button>
                </div>
              )
            }
          />
        </Section>

      </div>
    </div>
  )
}
