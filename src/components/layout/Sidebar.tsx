// Left sidebar with grouped navigation sections
// Items are organized into functional groups with visual separators

import { useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Zap,
  FolderGit2,
  Search,
  Users,
  MessageSquare,
  BookOpen,
  Shield,
  Settings
} from 'lucide-react'

// Navigation groups with section headers — signals actual information architecture
const navGroups = [
  {
    label: 'Core',
    items: [
      { label: 'Dashboard',     icon: LayoutDashboard, path: '/dashboard' },
      { label: 'My Matches',    icon: Zap,             path: '/matches' },
      { label: 'My Projects',   icon: FolderGit2,      path: '/my-projects' },
      { label: 'Find Projects', icon: Search,          path: '/projects' },
    ],
  },
  {
    label: 'Growth',
    items: [
      { label: 'Mentorship',    icon: Users,           path: '/mentorship' },
      { label: 'Learning Paths',icon: BookOpen,        path: '/learning' },
      { label: 'Trust Score',   icon: Shield,          path: '/trust' },
    ],
  },
  {
    label: 'Account',
    items: [
      { label: 'Messages',      icon: MessageSquare,   path: '/messages' },
      { label: 'Settings',      icon: Settings,        path: '/settings' },
    ],
  },
]

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div style={{
      width: '240px',
      backgroundColor: 'var(--bg-surface)',
      borderRight: '1px solid var(--border-subtle)',
      flexShrink: 0,
      padding: '12px 0',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      overflowY: 'auto',
    }}>
      {/* Logo at top of sidebar */}
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '18px',
        fontWeight: 700,
        padding: '8px 16px 16px',
        margin: '0 8px 4px',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <span style={{ color: 'var(--text-primary)' }}>Open</span>
        <span style={{ color: 'var(--accent-primary)' }}>Match</span>
      </div>

      {navGroups.map((group) => (
        <div key={group.label} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {/* Section label */}
          <div style={{
            padding: '8px 16px 4px',
            margin: '0 8px',
            color: 'var(--text-tertiary)',
            fontFamily: 'var(--font-display)',
            fontSize: '10px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>
            {group.label}
          </div>

          {group.items.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon

            return (
              <div
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 16px',
                  margin: '0 8px',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  backgroundColor: isActive ? 'rgba(0,212,177,0.12)' : 'transparent',
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  borderLeft: isActive ? '2px solid var(--accent-primary)' : '2px solid transparent',
                  fontFamily: 'var(--font-display)',
                  fontSize: '14px',
                  fontWeight: 500,
                  transition: 'all 150ms ease',
                }}
              >
                <Icon size={20} />
                {item.label}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}