import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import Sidebar from '../components/layout/Sidebar'
import GlassCard from '../components/ui/GlassCard'
import Modal from '../components/ui/Modal'
import Toast, { useToast } from '../components/ui/Toast'
import api, { mockDashboardData } from '../services/api'

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'rgba(13,21,38,0.97)',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: '12px',
      padding: '12px 16px',
      backdropFilter: 'blur(20px)',
    }}>
      <p style={{ color: '#94A3B8', fontSize: '12px', fontFamily: 'DM Mono', marginBottom: '6px' }}>{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color, fontSize: '14px', fontFamily: 'DM Mono', fontWeight: 500 }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  )
}

const summaryCards = [
  { key: 'heartRate', icon: '❤️', label: 'Heart Rate', unit: 'BPM', color: '#FF6B6B' },
  { key: 'bp', icon: '🩸', label: 'Blood Pressure', unit: 'mmHg', color: '#A78BFA' },
  { key: 'weight', icon: '⚖️', label: 'Weight', unit: 'kg', color: '#00C6FF' },
  { key: 'sleep', icon: '💤', label: 'Sleep', unit: 'hrs', color: '#00F5A0' },
]

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quickAddOpen, setQuickAddOpen] = useState(false)
  const [quickForm, setQuickForm] = useState({ heartRate: '', weight: '', sleep: '' })
  const { toasts, addToast, removeToast } = useToast()
  const user = (() => { try { return JSON.parse(localStorage.getItem('user')) } catch { return null } })()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/api/dashboard/summary')
        setData(res.data)
      } catch {
        setData(mockDashboardData)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const formatBP = (bp) => bp ? `${bp.systolic}/${bp.diastolic}` : '—'
  const formatValue = (key, val) => {
    if (key === 'bp') return formatBP(val)
    if (key === 'heartRate') return val || '—'
    if (key === 'sleep') return val ? `${val}` : '—'
    if (key === 'weight') return val ? `${val}` : '—'
    return '—'
  }

  const handleQuickAdd = (e) => {
    e.preventDefault()
    addToast('Health metrics logged successfully!', 'success')
    setQuickAddOpen(false)
    setQuickForm({ heartRate: '', weight: '', sleep: '' })
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#050B18' }}>
      <Sidebar user={user} />

      <main style={{ flex: 1, marginLeft: 0, padding: '32px 28px', paddingBottom: '100px' }} className="md-ml-240">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: '36px' }}
        >
          <h1
            style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: 'clamp(28px, 4vw, 42px)',
              fontWeight: 800,
              color: 'white',
              lineHeight: 1.2,
            }}
          >
            {getGreeting()}, {user?.name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p style={{ fontFamily: 'Inter, sans-serif', color: '#94A3B8', fontSize: '15px', marginTop: '6px' }}>
            Here's your health overview for today.
          </p>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '36px',
          }}
        >
          {summaryCards.map((card) => (
            <motion.div
              key={card.key}
              variants={fadeUp}
              whileHover={{ y: -8, boxShadow: `0 16px 40px ${card.color}22` }}
              style={{
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: `1px solid ${card.color}22`,
                borderRadius: '16px',
                padding: '24px',
                cursor: 'default',
                transition: 'box-shadow 0.3s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <span style={{ fontSize: '28px' }}>{card.icon}</span>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: card.color,
                  boxShadow: `0 0 8px ${card.color}`,
                  animation: 'pulse 2s infinite',
                }} />
              </div>
              <div>
                <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '26px', fontWeight: 500, color: 'white', lineHeight: 1 }}>
                  {loading ? '—' : formatValue(card.key, data?.[card.key])}
                </p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#94A3B8', marginTop: '4px' }}>
                  {card.unit} · {card.label}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Weekly Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '20px',
            padding: '28px',
            marginBottom: '32px',
          }}
        >
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: 700, color: 'white', marginBottom: '24px' }}>
            This Week's Trends
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data?.weeklyData || mockDashboardData.weeklyData}>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: '#94A3B8', fontSize: 12, fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="heartRate" stroke="#FF6B6B" strokeWidth={2.5} dot={false} name="Heart Rate" />
              <Line type="monotone" dataKey="sleep" stroke="#A78BFA" strokeWidth={2.5} dot={false} name="Sleep (hrs)" />
              <Line type="monotone" dataKey="steps" stroke="#00F5A0" strokeWidth={2.5} dot={false} name="Steps" />
            </LineChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '24px', marginTop: '16px', flexWrap: 'wrap' }}>
            {[{ color: '#FF6B6B', label: 'Heart Rate' }, { color: '#A78BFA', label: 'Sleep' }, { color: '#00F5A0', label: 'Steps' }].map((l) => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: 24, height: 3, borderRadius: 2, background: l.color }} />
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#94A3B8' }}>{l.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Records */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '20px',
            padding: '28px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: 700, color: 'white' }}>
              Recent Records
            </h2>
            <a href="/records" style={{ color: '#00C6FF', fontFamily: 'Inter', fontSize: '14px', textDecoration: 'none' }}>
              View all →
            </a>
          </div>

          {[
            { title: 'Annual Physical Checkup', type: 'Checkup', doctor: 'Dr. Priya Sharma', date: 'Jun 10, 2025', color: '#00C6FF', icon: '🩺' },
            { title: 'Complete Blood Count', type: 'Lab Test', doctor: 'Dr. Arjun Mehta', date: 'Jun 5, 2025', color: '#00F5A0', icon: '🧪' },
            { title: 'Metformin 500mg', type: 'Prescription', doctor: 'Dr. Priya Sharma', date: 'May 28, 2025', color: '#A78BFA', icon: '💊' },
          ].map((rec, i) => (
            <motion.div
              key={i}
              whileHover={{ x: 4 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px 0',
                borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: '12px',
                background: `${rec.color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '20px', flexShrink: 0,
              }}>
                {rec.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: 'Inter', fontSize: '15px', fontWeight: 600, color: 'white', marginBottom: '2px' }}>
                  {rec.title}
                </p>
                <p style={{ fontFamily: 'Inter', fontSize: '13px', color: '#94A3B8' }}>
                  {rec.doctor} · {rec.date}
                </p>
              </div>
              <span style={{
                padding: '4px 12px', borderRadius: '50px', fontSize: '11px',
                fontWeight: 600, fontFamily: 'Inter',
                color: rec.color, background: `${rec.color}15`,
                flexShrink: 0,
              }}>
                {rec.type}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Floating Quick Add Button */}
      <motion.button
        onClick={() => setQuickAddOpen(true)}
        whileHover={{ scale: 1.1, boxShadow: '0 10px 40px rgba(0,198,255,0.5)' }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #00C6FF, #0072FF)',
          border: 'none',
          color: 'white',
          fontSize: '28px',
          cursor: 'pointer',
          boxShadow: '0 4px 24px rgba(0,198,255,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
        }}
      >
        +
      </motion.button>

      {/* Quick Add Modal */}
      <Modal isOpen={quickAddOpen} onClose={() => setQuickAddOpen(false)} title="Quick Add Metric">
        <form onSubmit={handleQuickAdd} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { key: 'heartRate', label: 'Heart Rate (BPM)', placeholder: '72' },
            { key: 'weight', label: 'Weight (kg)', placeholder: '74.5' },
            { key: 'sleep', label: 'Sleep (hours)', placeholder: '7.5' },
          ].map((f) => (
            <div key={f.key}>
              <label style={{ color: '#94A3B8', fontSize: '13px', fontFamily: 'Inter', fontWeight: 500, display: 'block', marginBottom: '6px' }}>
                {f.label}
              </label>
              <input
                type="number"
                placeholder={f.placeholder}
                value={quickForm[f.key]}
                onChange={(e) => setQuickForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                className="medi-input"
              />
            </div>
          ))}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              background: 'linear-gradient(135deg, #00C6FF, #0072FF)',
              color: 'white', border: 'none', borderRadius: '50px',
              padding: '14px', fontFamily: 'Inter', fontWeight: 600, fontSize: '15px',
              cursor: 'pointer', marginTop: '8px',
            }}
          >
            Log Metrics
          </motion.button>
        </form>
      </Modal>

      <Toast toasts={toasts} removeToast={removeToast} />

      <style>{`
        @media (min-width: 768px) {
          .md-ml-240 { margin-left: 240px !important; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}
