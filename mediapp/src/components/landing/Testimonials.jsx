import { motion } from 'framer-motion'

const testimonials = [
  {
    quote: "MediApp completely changed how I track my health. The interface is so beautiful I actually enjoy logging my stats every day.",
    name: 'Sarah K.',
    role: 'Patient',
    avatar: 'S',
    color: '#00C6FF',
  },
  {
    quote: "The medical records system is incredibly intuitive. My patients can share their history with me in seconds.",
    name: 'Dr. Raj M.',
    role: 'Cardiologist',
    avatar: 'R',
    color: '#00F5A0',
  },
  {
    quote: "My entire family uses this now. The health tracker charts help us stay motivated together.",
    name: 'James T.',
    role: 'User',
    avatar: 'J',
    color: '#A78BFA',
  },
]

export default function Testimonials() {
  return (
    <section
      style={{
        padding: '100px 20px',
        background: '#050B18',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '64px' }}
        >
          <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '13px', color: '#00F5A0', letterSpacing: '0.15em', marginBottom: '12px' }}>
            TESTIMONIALS
          </p>
          <h2
            style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: 'clamp(28px, 5vw, 48px)',
              fontWeight: 800,
              color: 'white',
            }}
          >
            Trusted by patients and doctors
          </h2>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, borderColor: `${t.color}40` }}
              style={{
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '20px',
                padding: '36px 32px',
                transition: 'border-color 0.3s ease, transform 0.3s ease',
                cursor: 'default',
              }}
            >
              {/* Stars */}
              <div style={{ marginBottom: '20px', display: 'flex', gap: '4px' }}>
                {[...Array(5)].map((_, si) => (
                  <span key={si} style={{ color: '#F59E0B', fontSize: '16px' }}>★</span>
                ))}
              </div>

              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '16px',
                  color: '#CBD5E1',
                  lineHeight: 1.75,
                  marginBottom: '28px',
                  fontStyle: 'italic',
                }}
              >
                "{t.quote}"
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${t.color}, ${t.color}80)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'Syne, sans-serif',
                    fontWeight: 700,
                    fontSize: '18px',
                    color: 'white',
                    flexShrink: 0,
                  }}
                >
                  {t.avatar}
                </div>
                <div>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '15px', color: 'white' }}>
                    {t.name}
                  </p>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: t.color }}>
                    {t.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
