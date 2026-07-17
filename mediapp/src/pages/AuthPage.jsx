import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../services/api'
import useAuth from '../hooks/useAuth'

const floatingIcons = ['🫀', '🧬', '💊', '🩺', '📊', '🏥', '💉', '🔬']

function validate(mode, form) {
  const errors = {}
  if (mode === 'register' && !form.name?.trim()) errors.name = 'Name is required'
  if (!form.email?.trim()) errors.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Invalid email format'
  if (!form.password) errors.password = 'Password is required'
  else if (form.password.length < 8) errors.password = 'Password must be at least 8 characters'
  if (mode === 'register') {
    if (!form.confirmPassword) errors.confirmPassword = 'Please confirm your password'
    else if (form.password !== form.confirmPassword) errors.confirmPassword = 'Passwords do not match'
    if (!form.dob) errors.dob = 'Date of birth is required'
    if (!form.gender) errors.gender = 'Gender is required'
  }
  return errors
}

export default function AuthPage({ mode: initialMode }) {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [mode, setMode] = useState(initialMode || 'login')
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', dob: '', gender: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    setErrors((e) => ({ ...e, [field]: '' }))
  }

  const switchMode = (m) => {
    setMode(m)
    setErrors({})
    setApiError('')
    navigate(m === 'login' ? '/login' : '/register', { replace: true })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate(mode, form)
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    setApiError('')
    try {
      if (mode === 'login') {
        const res = await api.post('/api/auth/login', { email: form.email, password: form.password })
        login(res.data.token, res.data.user)
        navigate('/dashboard')
      } else {
        const res = await api.post('/api/auth/register', {
          name: form.name, email: form.email, password: form.password, dob: form.dob, gender: form.gender
        })
        login(res.data.token, res.data.user)
        navigate('/dashboard')
      }
    } catch (err) {
      // Demo fallback: if backend unreachable, fake login
      if (!err.response || err.code === 'ERR_NETWORK') {
        const fakeUser = { name: form.name || 'Alex Johnson', email: form.email, id: '1' }
        login('demo-token-' + Date.now(), fakeUser)
        navigate('/dashboard')
      } else {
        setApiError(err.response?.data?.message || 'Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = (field) => ({
    width: '100%',
    background: '#0D1526',
    color: 'white',
    border: `1px solid ${errors[field] ? '#FF6B6B' : 'rgba(255,255,255,0.1)'}`,
    borderRadius: '10px',
    padding: '13px 16px',
    fontFamily: 'Inter, sans-serif',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.25s ease',
    boxShadow: errors[field] ? '0 0 0 3px rgba(255,107,107,0.15)' : 'none',
  })

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        background: '#050B18',
        overflow: 'hidden',
      }}
    >
      {/* Left panel */}
      <div
        style={{
          flex: 1,
          display: 'none',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #050B18 0%, #001a3d 100%)',
        }}
        className="auth-left"
      >
        {/* Floating icons */}
        {floatingIcons.map((icon, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.sin(i) * 15, 0],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 5 + i * 0.7,
              repeat: Infinity,
              delay: i * 0.4,
              ease: 'easeInOut',
            }}
            style={{
              position: 'absolute',
              left: `${10 + (i % 4) * 23}%`,
              top: `${15 + Math.floor(i / 4) * 45}%`,
              fontSize: '48px',
              opacity: 0.15,
              filter: 'blur(0.5px)',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            {icon}
          </motion.div>
        ))}

        {/* ECG Line */}
        <svg
          style={{ position: 'absolute', bottom: '25%', left: 0, right: 0, width: '100%', opacity: 0.25 }}
          viewBox="0 0 600 120"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0,60 L80,60 L110,20 L140,100 L170,10 L200,110 L230,20 L260,60 L400,60 L430,20 L460,100 L490,10 L520,110 L550,20 L580,60 L600,60"
            fill="none"
            stroke="#00F5A0"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity, repeatType: 'loop', repeatDelay: 1 }}
          />
        </svg>

        {/* Brand content */}
        <div
          style={{
            position: 'absolute',
            bottom: '12%',
            left: '10%',
            right: '10%',
          }}
        >
          <h1
            style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: '3rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #00C6FF, #00F5A0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '12px',
            }}
          >
            MediApp
          </h1>
          <p style={{ fontFamily: 'Inter, sans-serif', color: '#94A3B8', fontSize: '16px', lineHeight: 1.6 }}>
            Your Health. Visualized.<br />
            <span style={{ color: '#00F5A0', fontFamily: 'DM Mono, monospace', fontSize: '13px', letterSpacing: '0.1em' }}>
              Track. Understand. Thrive.
            </span>
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          position: 'relative',
        }}
      >
        {/* Radial glow */}
        <div
          style={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, rgba(0,198,255,0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <motion.div
          key={mode}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: '100%',
            maxWidth: 440,
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: '24px',
            padding: '44px 40px',
            position: 'relative',
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: '36px' }}>
            <h2
              style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: '2rem',
                fontWeight: 800,
                color: 'white',
                marginBottom: '8px',
              }}
            >
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </h2>
            <p style={{ fontFamily: 'Inter, sans-serif', color: '#94A3B8', fontSize: '15px' }}>
              {mode === 'login'
                ? 'Sign in to your MediApp account'
                : 'Start your health journey today'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {mode === 'register' && (
              <div>
                <label style={{ color: '#94A3B8', fontSize: '13px', fontFamily: 'Inter, sans-serif', fontWeight: 500, display: 'block', marginBottom: '6px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Alex Johnson"
                  value={form.name}
                  onChange={set('name')}
                  style={inputStyle('name')}
                  onFocus={(e) => { e.target.style.borderColor = '#00C6FF'; e.target.style.boxShadow = '0 0 0 3px rgba(0,198,255,0.15)' }}
                  onBlur={(e) => { e.target.style.borderColor = errors.name ? '#FF6B6B' : 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
                />
                {errors.name && <p style={{ color: '#FF6B6B', fontSize: '12px', marginTop: '4px', fontFamily: 'Inter' }}>{errors.name}</p>}
              </div>
            )}

            <div>
              <label style={{ color: '#94A3B8', fontSize: '13px', fontFamily: 'Inter, sans-serif', fontWeight: 500, display: 'block', marginBottom: '6px' }}>
                Email address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={set('email')}
                style={inputStyle('email')}
                onFocus={(e) => { e.target.style.borderColor = '#00C6FF'; e.target.style.boxShadow = '0 0 0 3px rgba(0,198,255,0.15)' }}
                onBlur={(e) => { e.target.style.borderColor = errors.email ? '#FF6B6B' : 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
              />
              {errors.email && <p style={{ color: '#FF6B6B', fontSize: '12px', marginTop: '4px', fontFamily: 'Inter' }}>{errors.email}</p>}
            </div>

            <div>
              <label style={{ color: '#94A3B8', fontSize: '13px', fontFamily: 'Inter, sans-serif', fontWeight: 500, display: 'block', marginBottom: '6px' }}>
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={set('password')}
                style={inputStyle('password')}
                onFocus={(e) => { e.target.style.borderColor = '#00C6FF'; e.target.style.boxShadow = '0 0 0 3px rgba(0,198,255,0.15)' }}
                onBlur={(e) => { e.target.style.borderColor = errors.password ? '#FF6B6B' : 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
              />
              {errors.password && <p style={{ color: '#FF6B6B', fontSize: '12px', marginTop: '4px', fontFamily: 'Inter' }}>{errors.password}</p>}
            </div>

            {mode === 'register' && (
              <>
                <div>
                  <label style={{ color: '#94A3B8', fontSize: '13px', fontFamily: 'Inter, sans-serif', fontWeight: 500, display: 'block', marginBottom: '6px' }}>
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={form.confirmPassword}
                    onChange={set('confirmPassword')}
                    style={inputStyle('confirmPassword')}
                    onFocus={(e) => { e.target.style.borderColor = '#00C6FF'; e.target.style.boxShadow = '0 0 0 3px rgba(0,198,255,0.15)' }}
                    onBlur={(e) => { e.target.style.borderColor = errors.confirmPassword ? '#FF6B6B' : 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
                  />
                  {errors.confirmPassword && <p style={{ color: '#FF6B6B', fontSize: '12px', marginTop: '4px', fontFamily: 'Inter' }}>{errors.confirmPassword}</p>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ color: '#94A3B8', fontSize: '13px', fontFamily: 'Inter, sans-serif', fontWeight: 500, display: 'block', marginBottom: '6px' }}>
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={form.dob}
                      onChange={set('dob')}
                      style={{ ...inputStyle('dob'), colorScheme: 'dark' }}
                      onFocus={(e) => { e.target.style.borderColor = '#00C6FF'; e.target.style.boxShadow = '0 0 0 3px rgba(0,198,255,0.15)' }}
                      onBlur={(e) => { e.target.style.borderColor = errors.dob ? '#FF6B6B' : 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
                    />
                    {errors.dob && <p style={{ color: '#FF6B6B', fontSize: '12px', marginTop: '4px', fontFamily: 'Inter' }}>{errors.dob}</p>}
                  </div>
                  <div>
                    <label style={{ color: '#94A3B8', fontSize: '13px', fontFamily: 'Inter, sans-serif', fontWeight: 500, display: 'block', marginBottom: '6px' }}>
                      Gender
                    </label>
                    <select
                      value={form.gender}
                      onChange={set('gender')}
                      style={{ ...inputStyle('gender'), appearance: 'none', cursor: 'pointer' }}
                      onFocus={(e) => { e.target.style.borderColor = '#00C6FF' }}
                      onBlur={(e) => { e.target.style.borderColor = errors.gender ? '#FF6B6B' : 'rgba(255,255,255,0.1)' }}
                    >
                      <option value="" style={{ background: '#0D1526' }}>Select</option>
                      <option value="Male" style={{ background: '#0D1526' }}>Male</option>
                      <option value="Female" style={{ background: '#0D1526' }}>Female</option>
                      <option value="Other" style={{ background: '#0D1526' }}>Other</option>
                    </select>
                    {errors.gender && <p style={{ color: '#FF6B6B', fontSize: '12px', marginTop: '4px', fontFamily: 'Inter' }}>{errors.gender}</p>}
                  </div>
                </div>
              </>
            )}

            {mode === 'login' && (
              <div style={{ textAlign: 'right', marginTop: '-8px' }}>
                <a href="#" style={{ color: '#00C6FF', fontSize: '13px', fontFamily: 'Inter', textDecoration: 'none' }}>
                  Forgot password?
                </a>
              </div>
            )}

            {/* API Error */}
            <AnimatePresence>
              {apiError && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    background: 'rgba(255,107,107,0.12)',
                    border: '1px solid rgba(255,107,107,0.3)',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    color: '#FF6B6B',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                  }}
                >
                  {apiError}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.02, filter: 'brightness(1.1)' } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              style={{
                background: 'linear-gradient(135deg, #00C6FF, #0072FF)',
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                padding: '15px',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                fontSize: '16px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.8 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 4px 20px rgba(0,198,255,0.3)',
                marginTop: '4px',
              }}
            >
              {loading ? (
                <>
                  <span className="spinner" style={{ width: 20, height: 20 }} />
                  <span>{mode === 'login' ? 'Signing in...' : 'Creating account...'}</span>
                </>
              ) : (
                mode === 'login' ? 'Sign In →' : 'Create Account →'
              )}
            </motion.button>
          </form>

          {/* Switch mode */}
          <p
            style={{
              textAlign: 'center',
              marginTop: '28px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              color: '#94A3B8',
            }}
          >
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
              style={{
                background: 'none',
                border: 'none',
                color: '#00C6FF',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: 600,
                padding: 0,
              }}
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </motion.div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .auth-left { display: flex !important; }
        }
      `}</style>
    </div>
  )
}
