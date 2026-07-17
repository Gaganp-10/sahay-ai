import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const navItems = [
  { icon: '🏠', label: 'Dashboard', path: '/dashboard' },
  { icon: '📁', label: 'Records', path: '/records' },
  { icon: '📈', label: 'Tracker', path: '/tracker' },
  { icon: '👤', label: 'Profile', path: '/profile' },
]

export default function Sidebar({ user }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -240 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          width: 240,
          background: 'rgba(13,21,38,0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 100,
          padding: '24px 0',
        }}
        className="hidden md:flex"
      >
        {/* Logo */}
        <div style={{ padding: '0 24px 32px' }}>
          <motion.div
            whileHover={{ scale: 1.03 }}
            style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: '1.6rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #00C6FF, #00F5A0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/dashboard')}
          >
            MediApp
          </motion.div>
        </div>

        {/* User info */}
        {user && (
          <div style={{
            padding: '0 20px 24px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            marginBottom: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #00C6FF, #0072FF)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Syne, sans-serif',
                fontWeight: 700,
                fontSize: '16px',
                color: 'white',
                flexShrink: 0,
              }}>
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <p style={{ color: 'white', fontSize: '14px', fontWeight: 600, fontFamily: 'Inter, sans-serif', lineHeight: 1.3 }}>
                  {user.name || 'User'}
                </p>
                <p style={{ color: '#94A3B8', fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>
                  {user.email || ''}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Nav Links */}
        <nav style={{ flex: 1, padding: '0 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '12px',
                textDecoration: 'none',
                color: isActive ? '#00C6FF' : '#94A3B8',
                background: isActive ? 'rgba(0,198,255,0.1)' : 'transparent',
                borderLeft: isActive ? '3px solid #00C6FF' : '3px solid transparent',
                fontFamily: 'Inter, sans-serif',
                fontSize: '15px',
                fontWeight: isActive ? 600 : 400,
                transition: 'all 0.2s ease',
              })}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: '16px 12px 0', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '16px' }}>
          <motion.button
            whileHover={{ backgroundColor: 'rgba(255,107,107,0.1)', color: '#FF6B6B' }}
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '12px',
              background: 'transparent',
              border: 'none',
              color: '#94A3B8',
              fontFamily: 'Inter, sans-serif',
              fontSize: '15px',
              cursor: 'pointer',
              width: '100%',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{ fontSize: '18px' }}>🚪</span>
            Logout
          </motion.button>
        </div>
      </motion.aside>

      {/* Mobile Bottom Tab Bar */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(13,21,38,0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        zIndex: 100,
        padding: '8px 0',
      }}
      className="flex md:hidden"
      >
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              padding: '8px',
              textDecoration: 'none',
              color: isActive ? '#00C6FF' : '#94A3B8',
              fontSize: '10px',
              fontFamily: 'Inter, sans-serif',
            })}
          >
            <span style={{ fontSize: '20px' }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
        <button
          onClick={handleLogout}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            padding: '8px',
            background: 'transparent',
            border: 'none',
            color: '#94A3B8',
            fontSize: '10px',
            fontFamily: 'Inter, sans-serif',
            cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: '20px' }}>🚪</span>
          Logout
        </button>
      </div>
    </>
  )
}
