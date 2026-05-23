import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { ReactNode, useState } from 'react'
import { useAppStore } from '@/store/useAppStore'

const mainNav = [
  { to: '/',             label: 'Home',         icon: '⊞' },
  { to: '/goals',        label: 'Goals',        icon: '◎' },
  { to: '/check',        label: 'Afford?',      icon: '✓' },
  { to: '/transactions', label: 'Spending',     icon: '↕' },
  { to: '/more',         label: 'More',         icon: '⋯' },
]

const moreNav = [
  { to: '/vault',       label: 'Vault',             icon: '🔒', desc: 'Money you don\'t touch' },
  { to: '/calculator',  label: 'Goal calculator',   icon: '🧮', desc: 'How much to save per month' },
  { to: '/retirement',  label: 'Retirement plan',   icon: '🏖️', desc: 'Plan your future today' },
]

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const user = useAppStore((s) => s.user)
  const users = useAppStore((s) => s.users)
  const logout = useAppStore((s) => s.logout)
  const deleteUser = useAppStore((s) => s.deleteUser)
  const [showMore, setShowMore] = useState(false)
  const isMorePage = moreNav.some(n => location.pathname === n.to)

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-white">
      <main className="flex-1 overflow-auto pb-20 px-4 pt-6">{children}</main>

      {showMore && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 px-4 py-3 space-y-1 z-10">
          <div className="mb-3 rounded-2xl border border-gray-100 bg-gray-50 p-3">
            <p className="text-xs text-gray-400">Active profile</p>
            <p className="text-sm font-medium text-gray-900">{user?.name || 'No profile'}</p>
            <div className="mt-2 flex items-center justify-between gap-2">
              <p className="text-xs text-gray-400">{users.length} saved profile{users.length === 1 ? '' : 's'}</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setShowMore(false)
                    navigate('/onboarding')
                  }}
                  className="text-xs font-medium text-brand-500"
                >
                  Manage users
                </button>
                <button
                  onClick={() => {
                    logout()
                    setShowMore(false)
                    navigate('/onboarding')
                  }}
                  className="text-xs font-medium text-red-500"
                >
                  Log out
                </button>
                {user && (
                  <button
                    onClick={() => {
                      if (!window.confirm(`Delete profile \"${user.name}\"? This cannot be undone.`)) return
                      deleteUser(user.id)
                      setShowMore(false)
                      navigate('/onboarding')
                    }}
                    className="text-xs font-medium text-red-600"
                  >
                    Delete active profile
                  </button>
                )}
              </div>
            </div>
          </div>
          {moreNav.map((n) => (
            <NavLink key={n.to} to={n.to} onClick={() => setShowMore(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
              <span className="text-xl w-8 text-center">{n.icon}</span>
              <div>
                <p className="text-sm font-medium text-gray-900">{n.label}</p>
                <p className="text-xs text-gray-400">{n.desc}</p>
              </div>
            </NavLink>
          ))}
        </div>
      )}

      {showMore && <div className="fixed inset-0 z-0" onClick={() => setShowMore(false)} />}

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 z-20">
        <div className="grid grid-cols-5">
          {mainNav.map((n) => {
            const active = n.to === '/more' ? isMorePage || showMore : location.pathname === n.to
            return n.to === '/more' ? (
              <button key="more" onClick={() => setShowMore(!showMore)}
                className={`flex flex-col items-center py-3 text-xs gap-1 transition-colors ${active ? 'text-brand-400 font-medium' : 'text-gray-400'}`}>
                <span className="text-lg leading-none">{n.icon}</span>
                {n.label}
              </button>
            ) : (
              <NavLink key={n.to} to={n.to} end={n.to === '/'}
                className={({ isActive }) =>
                  `flex flex-col items-center py-3 text-xs gap-1 transition-colors ${isActive ? 'text-brand-400 font-medium' : 'text-gray-400'}`
                }>
                <span className="text-lg leading-none">{n.icon}</span>
                {n.label}
              </NavLink>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
