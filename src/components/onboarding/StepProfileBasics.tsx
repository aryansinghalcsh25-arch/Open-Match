// ============================================================
// StepProfileBasics.tsx
// ============================================================
// Step 2 of the onboarding wizard — "Tell us about yourself"
//
// Fields:
//   - Display name   (text input, required)
//   - Bio            (textarea, max 300 chars, live counter)
//   - Location       (text input, optional)
//   - Timezone       (dropdown, required)
//   - Avatar         (file picker, JPG/PNG/GIF max 2 MB)
//
// How it works:
//   - We use React's `useState` to track the form values locally
//     while the user is typing. Only when they click Continue do
//     we save everything to the shared Zustand store.
//   - Validation runs on Continue click — red error messages
//     appear under fields that are missing or invalid.
// ============================================================

import { useState, useRef, type ChangeEvent } from 'react'
import { Camera, User } from 'lucide-react'
import {
  useOnboardingStore,
  type ProfileBasicsPayload,
} from '../../store/onboardingStore'

// ---- Timezone list ----------------------------------------
// A curated list of common timezones shown in the dropdown.
// Format: { label: what the user sees, value: what we store }

const TIMEZONES = [
  { label: 'UTC−12:00 — Baker Island',          value: 'Etc/GMT+12'          },
  { label: 'UTC−08:00 — Los Angeles (PST)',      value: 'America/Los_Angeles' },
  { label: 'UTC−07:00 — Denver (MST)',           value: 'America/Denver'      },
  { label: 'UTC−06:00 — Chicago (CST)',          value: 'America/Chicago'     },
  { label: 'UTC−05:00 — New York (EST)',         value: 'America/New_York'    },
  { label: 'UTC−03:00 — São Paulo (BRT)',        value: 'America/Sao_Paulo'   },
  { label: 'UTC+00:00 — London (GMT)',           value: 'Europe/London'       },
  { label: 'UTC+01:00 — Paris / Berlin (CET)',   value: 'Europe/Paris'        },
  { label: 'UTC+02:00 — Cairo (EET)',            value: 'Africa/Cairo'        },
  { label: 'UTC+03:00 — Moscow / Nairobi',       value: 'Europe/Moscow'       },
  { label: 'UTC+04:00 — Dubai (GST)',            value: 'Asia/Dubai'          },
  { label: 'UTC+05:00 — Karachi (PKT)',          value: 'Asia/Karachi'        },
  { label: 'UTC+05:30 — Mumbai / New Delhi',     value: 'Asia/Kolkata'        },
  { label: 'UTC+06:00 — Dhaka (BST)',            value: 'Asia/Dhaka'          },
  { label: 'UTC+07:00 — Bangkok / Jakarta',      value: 'Asia/Bangkok'        },
  { label: 'UTC+08:00 — Singapore / Beijing',    value: 'Asia/Singapore'      },
  { label: 'UTC+09:00 — Tokyo / Seoul',          value: 'Asia/Tokyo'          },
  { label: 'UTC+10:00 — Sydney (AEST)',          value: 'Australia/Sydney'    },
  { label: 'UTC+12:00 — Auckland (NZST)',        value: 'Pacific/Auckland'    },
]

// ---- Max lengths ------------------------------------------
const BIO_MAX = 300

// ---- Validation -------------------------------------------
// Returns an object with field names mapped to error strings.
// Empty string = no error for that field.

interface FormErrors {
  displayName: string
  timezone: string
  avatar: string
}

function validate(
  displayName: string,
  timezone: string,
): FormErrors {
  return {
    displayName: displayName.trim() === ''
      ? 'Display name is required.'
      : displayName.trim().length < 2
        ? 'Must be at least 2 characters.'
        : '',
    timezone: timezone === ''
      ? 'Please select your timezone.'
      : '',
    avatar: '',  // avatar errors are set separately during file pick
  }
}

// ---- Component --------------------------------------------

export default function StepProfileBasics() {
  // Pull existing data + actions from the shared store
  const { data, setProfileBasics, nextStep } = useOnboardingStore()

  // ── Local form state ──────────────────────────────────────
  // We use local state while the user types. Saving to the store
  // only happens when they click Continue. This is the standard
  // React pattern for forms — it prevents unnecessary re-renders.

  const [displayName, setDisplayName] = useState(data.displayName)
  const [bio, setBio]                 = useState(data.bio)
  const [location, setLocation]       = useState(data.location)
  const [timezone, setTimezone]       = useState(data.timezone)
  const [avatarUrl, setAvatarUrl]     = useState<string | null>(data.avatarUrl)
  const [errors, setErrors]           = useState<FormErrors>({ displayName: '', timezone: '', avatar: '' })

  // `useRef` gives us a reference to the hidden <input type="file">
  // so we can trigger it programmatically when the user clicks the avatar.
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── Avatar file handler ───────────────────────────────────
  // Called when the user picks a file from their computer.

  function handleAvatarChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowed = ['image/jpeg', 'image/png', 'image/gif']
    if (!allowed.includes(file.type)) {
      setErrors((prev) => ({ ...prev, avatar: 'Only JPG, PNG, or GIF files are allowed.' }))
      return
    }

    // Validate file size (2 MB = 2 × 1024 × 1024 bytes)
    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, avatar: 'File must be under 2 MB.' }))
      return
    }

    // Convert the file to a data URL so we can preview it immediately.
    // FileReader is built into browsers — no library needed.
    const reader = new FileReader()
    reader.onload = () => {
      setAvatarUrl(reader.result as string)
      setErrors((prev) => ({ ...prev, avatar: '' }))
    }
    reader.readAsDataURL(file)
  }

  // ── Continue handler ──────────────────────────────────────
  // Validates the form. If everything is fine, saves to the store
  // and advances to Step 3.

  function handleContinue() {
    const newErrors = validate(displayName, timezone)
    setErrors(newErrors)

    // If any error exists, stop here — don't advance
    const hasErrors = Object.values(newErrors).some((e) => e !== '')
    if (hasErrors) return

    // Build the payload and save it
    const payload: ProfileBasicsPayload = {
      displayName: displayName.trim(),
      bio: bio.trim(),
      location: location.trim(),
      timezone,
      avatarUrl,
    }
    setProfileBasics(payload)
    nextStep()
  }

  // ── Shared input style ────────────────────────────────────
  // Defined once here so we don't repeat it for every input field.

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem 1rem',
    backgroundColor: 'var(--bg-elevated)',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-display)',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.15s ease',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '0.4rem',
    fontFamily: 'var(--font-display)',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: 'var(--text-secondary)',
  }

  const errorStyle: React.CSSProperties = {
    marginTop: '0.35rem',
    fontSize: '0.8rem',
    color: 'var(--state-error)',
    fontFamily: 'var(--font-display)',
  }

  // ── Render ────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-6">

      {/* ── Heading ───────────────────────────────────────── */}
      <div>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '0.5rem',
          }}
        >
          Tell us about yourself
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          This is your public profile. Keep it real — people will see this.
        </p>
      </div>

      {/* ── Avatar upload ─────────────────────────────────── */}
      {/*
        This is a BUTTON that looks like an avatar circle.
        Clicking it triggers the hidden <input type="file"> below.
        We show a preview if a photo is chosen, or a placeholder icon otherwise.
      */}
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            position: 'relative',
            width: '88px',
            height: '88px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2px dashed var(--border-default)',
            backgroundColor: 'var(--bg-elevated)',
            cursor: 'pointer',
            transition: 'border-color 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--accent-primary)'
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-default)'
          }}
          title="Upload profile photo"
        >
          {avatarUrl ? (
            // Show the chosen image as a preview
            <img
              src={avatarUrl}
              alt="Avatar preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            // No photo yet — show a person icon
            <User size={36} color="var(--text-tertiary)" />
          )}

          {/* Camera icon overlay — always visible on hover via the parent hover */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              backgroundColor: 'var(--accent-primary)',
              borderRadius: '50%',
              width: '26px',
              height: '26px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Camera size={13} color="var(--text-inverse)" />
          </div>
        </button>

        {/* Hidden real file input — triggered by the button above */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif"
          onChange={handleAvatarChange}
          style={{ display: 'none' }}
        />

        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          JPG, PNG, or GIF · Max 2 MB
        </span>
        {errors.avatar && <p style={errorStyle}>{errors.avatar}</p>}
      </div>

      {/* ── Display name ──────────────────────────────────── */}
      <div>
        <label style={labelStyle}>
          Display name <span style={{ color: 'var(--state-error)' }}>*</span>
        </label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="e.g. Priya Sharma"
          style={{
            ...inputStyle,
            borderColor: errors.displayName ? 'var(--state-error)' : 'var(--border-default)',
          }}
          onFocus={(e) => {
            if (!errors.displayName)
              (e.target as HTMLInputElement).style.borderColor = 'var(--border-active)'
          }}
          onBlur={(e) => {
            if (!errors.displayName)
              (e.target as HTMLInputElement).style.borderColor = 'var(--border-default)'
          }}
        />
        {errors.displayName && <p style={errorStyle}>{errors.displayName}</p>}
      </div>

      {/* ── Bio ───────────────────────────────────────────── */}
      <div>
        <label style={labelStyle}>Bio</label>
        <div style={{ position: 'relative' }}>
          <textarea
            value={bio}
            onChange={(e) => {
              // Enforce the 300-character max by slicing extra input
              if (e.target.value.length <= BIO_MAX) setBio(e.target.value)
            }}
            placeholder="A short description about yourself, your interests, and what kind of projects you love…"
            rows={4}
            style={{
              ...inputStyle,
              resize: 'none',      // Prevent user from resizing the box
              paddingBottom: '2rem', // Make room for the character counter
            }}
            onFocus={(e) => {
              (e.target as HTMLTextAreaElement).style.borderColor = 'var(--border-active)'
            }}
            onBlur={(e) => {
              (e.target as HTMLTextAreaElement).style.borderColor = 'var(--border-default)'
            }}
          />
          {/* Live character counter — bottom right of the textarea */}
          <span
            style={{
              position: 'absolute',
              bottom: '0.6rem',
              right: '0.75rem',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              // Turn red when close to the limit
              color: bio.length >= BIO_MAX - 20
                ? 'var(--state-error)'
                : 'var(--text-tertiary)',
            }}
          >
            {bio.length} / {BIO_MAX}
          </span>
        </div>
      </div>

      {/* ── Location (optional) ───────────────────────────── */}
      <div>
        <label style={labelStyle}>
          Location{' '}
          <span style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>(optional)</span>
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Bangalore, India"
          style={inputStyle}
          onFocus={(e) => {
            (e.target as HTMLInputElement).style.borderColor = 'var(--border-active)'
          }}
          onBlur={(e) => {
            (e.target as HTMLInputElement).style.borderColor = 'var(--border-default)'
          }}
        />
      </div>

      {/* ── Timezone (required) ───────────────────────────── */}
      <div>
        <label style={labelStyle}>
          Timezone <span style={{ color: 'var(--state-error)' }}>*</span>
        </label>
        <select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          style={{
            ...inputStyle,
            // Dropdowns need a custom arrow color on dark backgrounds
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238B949E' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 1rem center',
            paddingRight: '2.5rem',
            cursor: 'pointer',
            borderColor: errors.timezone ? 'var(--state-error)' : 'var(--border-default)',
          }}
        >
          <option value="" disabled>Select your timezone…</option>
          {TIMEZONES.map((tz) => (
            <option key={tz.value} value={tz.value}
              style={{ backgroundColor: 'var(--bg-elevated)' }}
            >
              {tz.label}
            </option>
          ))}
        </select>
        {errors.timezone && <p style={errorStyle}>{errors.timezone}</p>}
      </div>

      {/* ── Continue button ───────────────────────────────── */}
      <button
        onClick={handleContinue}
        style={{
          width: '100%',
          padding: '0.875rem',
          borderRadius: 'var(--radius-md)',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'var(--font-display)',
          fontWeight: 600,
          fontSize: '1rem',
          backgroundColor: 'var(--accent-primary)',
          color: 'var(--text-inverse)',
          transition: 'all 0.2s ease',
          boxShadow: 'var(--shadow-glow)',
          marginTop: '0.5rem',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.opacity = '0.9'
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.opacity = '1'
        }}
      >
        Continue →
      </button>

    </div>
  )
}
