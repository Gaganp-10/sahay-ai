import { useNavigate } from 'react-router-dom'

export default function Footer() {
  const navigate = useNavigate()
  const year = new Date().getFullYear()

  return (
    <footer
      style={{
        background: '#03070F',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '48px 20px 32px',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '24px',
            marginBottom: '40px',
          }}
        >
          {/* Logo */}
          <div
            style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: '1.8rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #00C6FF, #00F5A0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/')}
          >
            MediApp
          </div>

          {/* Links */}
          <nav style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
            {['Privacy', 'Terms', 'Contact'].map((link) => (
              <a
                key={link}
                href="#"
                style={{
                  color: '#94A3B8',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => { e.target.style.color = '#00C6FF' }}
                onMouseLeave={(e) => { e.target.style.color = '#94A3B8' }}
              >
                {link}
              </a>
            ))}
          </nav>
        </div>

        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.05)',
            paddingTop: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <p style={{ color: '#475569', fontFamily: 'Inter, sans-serif', fontSize: '13px' }}>
            © {year} MediApp. All rights reserved.
          </p>
          <p style={{ color: '#475569', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}>
            Your Health. Visualized.
          </p>
        </div>
      </div>
    </footer>
  )
}
