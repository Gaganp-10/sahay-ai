import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import Sidebar from '../components/layout/Sidebar'
import Toast, { useToast } from '../components/ui/Toast'
import api, { mockTrackerHistory } from '../services/api'

const defaultLog = {
  date: new Date().toISOString().split('T')[0],
  heartRate: '', bpSystolic: '', bpDiastolic: '',
  weight: '', sleep: '', steps: '', notes: '',
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'rgba(13,21,38,0.97)', border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: '12px', padding: '12px 16px', backdropFilter: 'blur(20px)',
    }}>
      <p style={{ color: '#94A3B8', fontSize: '12px', fontFamily: 'DM Mono', marginBottom: '6px' }}>{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color, fontSize: '13px', fontFamily: 'DM Mono', fontWeight: 500 }}>
          {typeof p.name === 'string' ? p.name : p.dataKey}: {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}
        </p>
      ))}
    </div>
  )
}

export default function HealthTracker() {
  const user = (() => { try { return JSON.parse(localStorage.getItem('user')) } catch { return null } })()
  const [history, setHistory] = useState([])
  const [form, setForm] = useState(defaultLog)
  const [submitting, setSubmitting] = useState(false)
  const [sortAsc, setSortAsc] = useState(false)
  const { toasts, addToast, removeToast } = useToast()

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/api/tracker/history')
        setHistory(res.data)
      } catch {
        setHistory(mockTrackerHistory)
      }
    }
    fetch()
  }, [])

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleLog = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await api.post('/api/tracker/log', {
        ...form,
        heartRate: Number(form.heartRate), bpSystolic: Number(form.bpSystolic),
        bpDiastolic: Number(form.bpDiastolic), weight: Number(form.weight),
        sleep: Number(form.sleep), steps: Number(form.steps),
      })
      setHistory((prev) => [res.data, ...prev])
    } catch {
      const newEntry = {
        id: Date.now().toString(), ...form,
        heartRate: Number(form.heartRate) || 0, bpSystolic: Number(form.bpSystolic) || 0,
        bpDiastolic: Number(form.bpDiastolic) || 0, weight: Number(form.weight) || 0,
        sleep: Number(form.sleep) || 0, steps: Number(form.steps) || 0,
      }
      setHistory((prev) => [newEntry, ...prev])
    }
    addToast('Health log added!', 'success')
    setForm(defaultLog)
    setSubmitting(false)
  }

  const handleDelete = (id) => {
    setHistory((prev) => prev.filter((e) => e.id !== id))
    addToast('Entry removed', 'info')
  }

  const chartData = [...history].reverse().slice(-30)
  const sorted = sortAsc ? [...history].sort((a, b) => a.date.localeCompare(b.date)) : history

  const inputStyle = {
    background: '#0D1526', color: 'white',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
    padding: '11px 14px', fontFamily: 'Inter, sans-serif', fontSize: '14px',
    outline: 'none', width: '100%',
  }
  const labelStyle = { color: '#94A3B8', fontSize: '12px', fontFamily: 'Inter', fontWeight: 500, display: 'block', marginBottom: '5px' }

  const charts = [
    {
      title: 'Heart Rate', color: '#FF6B6B',
      chart: (
        <LineChart data={chartData}>
          <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis dataKey="date" tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(d) => d.slice(5)} />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="heartRate" stroke="#FF6B6B" strokeWidth={2.5} dot={false} name="BPM" />
        </LineChart>
      ),
    },
    {
      title: 'Blood Pressure', color: '#A78BFA',
      chart: (
        <LineChart data={chartData}>
          <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis dataKey="date" tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(d) => d.slice(5)} />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="bpSystolic" stroke="#FF6B6B" strokeWidth={2.5} dot={false} name="Systolic" />
          <Line type="monotone" dataKey="bpDiastolic" stroke="#A78BFA" strokeWidth={2.5} dot={false} name="Diastolic" />
        </LineChart>
      ),
    },
    {
      title: 'Weight Trend', color: '#00C6FF',
      chart: (
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00C6FF" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#00C6FF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis dataKey="date" tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(d) => d.slice(5)} />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="weight" stroke="#00C6FF" strokeWidth={2.5} fill="url(#weightGrad)" dot={false} name="kg" />
        </AreaChart>
      ),
    },
    {
      title: 'Sleep Hours', color: '#A78BFA',
      chart: (
        <BarChart data={chartData}>
          <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis dataKey="date" tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(d) => d.slice(5)} />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="sleep" fill="#A78BFA" radius={[4, 4, 0, 0]} name="hrs" />
        </BarChart>
      ),
    },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#050B18' }}>
      <Sidebar user={user} />
      <main style={{ flex: 1, padding: '32px 28px', paddingBottom: '100px' }} className="md-ml-240">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '32px' }}>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, color: 'white' }}>
            Health Tracker
          </h1>
          <p style={{ fontFamily: 'Inter', color: '#94A3B8', fontSize: '15px', marginTop: '4px' }}>
            Log daily metrics, visualize trends.
          </p>
        </motion.div>

        {/* Log Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '20px',
            padding: '28px',
            marginBottom: '32px',
          }}
        >
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: 700, color: 'white', marginBottom: '24px' }}>
            Log Today's Metrics
          </h2>
          <form onSubmit={handleLog}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>Date</label>
                <input type="date" value={form.date} onChange={set('date')} style={{ ...inputStyle, colorScheme: 'dark' }} />
              </div>
              <div>
                <label style={labelStyle}>Heart Rate (BPM)</label>
                <input type="number" placeholder="72" value={form.heartRate} onChange={set('heartRate')} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>BP Systolic</label>
                <input type="number" placeholder="118" value={form.bpSystolic} onChange={set('bpSystolic')} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>BP Diastolic</label>
                <input type="number" placeholder="76" value={form.bpDiastolic} onChange={set('bpDiastolic')} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Weight (kg)</label>
                <input type="number" step="0.1" placeholder="74.5" value={form.weight} onChange={set('weight')} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Sleep (hrs)</label>
                <input type="number" step="0.5" min="0" max="24" placeholder="7.5" value={form.sleep} onChange={set('sleep')} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Steps</label>
                <input type="number" placeholder="9000" value={form.steps} onChange={set('steps')} style={inputStyle} />
              </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Notes (optional)</label>
              <textarea
                placeholder="How are you feeling today?"
                value={form.notes}
                onChange={set('notes')}
                style={{ ...inputStyle, resize: 'vertical', minHeight: '72px' }}
              />
            </div>
            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(0,198,255,0.4)' }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: 'linear-gradient(135deg, #00C6FF, #0072FF)',
                color: 'white', border: 'none', borderRadius: '50px',
                padding: '13px 36px', fontFamily: 'Inter', fontWeight: 600,
                fontSize: '15px', cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(0,198,255,0.3)',
              }}
            >
              {submitting ? 'Logging...' : 'Log Entry ✓'}
            </motion.button>
          </form>
        </motion.div>

        {/* Charts 2×2 Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          {charts.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${c.color}20`,
                borderRadius: '20px',
                padding: '24px',
              }}
            >
              <h3 style={{ fontFamily: 'Syne', fontSize: '16px', fontWeight: 700, color: 'white', marginBottom: '20px' }}>
                {c.title}
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                {c.chart}
              </ResponsiveContainer>
            </motion.div>
          ))}
        </div>

        {/* History Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '20px',
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontFamily: 'Syne', fontSize: '20px', fontWeight: 700, color: 'white' }}>History</h2>
            <button
              onClick={() => setSortAsc(!sortAsc)}
              style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px', color: '#94A3B8', fontFamily: 'Inter', fontSize: '13px',
                padding: '6px 14px', cursor: 'pointer',
              }}
            >
              Date {sortAsc ? '↑' : '↓'}
            </button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Date', 'Heart Rate', 'BP', 'Weight', 'Sleep', 'Steps', ''].map((h) => (
                    <th key={h} style={{
                      padding: '12px 20px', textAlign: 'left',
                      fontFamily: 'Inter', fontSize: '12px', color: '#94A3B8',
                      fontWeight: 500, letterSpacing: '0.05em', whiteSpace: 'nowrap',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.slice(0, 30).map((entry, i) => (
                  <motion.tr
                    key={entry.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                  >
                    {[
                      entry.date,
                      `${entry.heartRate || '—'} BPM`,
                      entry.bpSystolic ? `${entry.bpSystolic}/${entry.bpDiastolic}` : '—',
                      entry.weight ? `${entry.weight} kg` : '—',
                      entry.sleep ? `${entry.sleep} hrs` : '—',
                      entry.steps ? (entry.steps).toLocaleString() : '—',
                    ].map((val, j) => (
                      <td key={j} style={{
                        padding: '14px 20px',
                        fontFamily: 'DM Mono', fontSize: '13px',
                        color: j === 0 ? '#94A3B8' : 'white',
                        whiteSpace: 'nowrap',
                      }}>
                        {val}
                      </td>
                    ))}
                    <td style={{ padding: '14px 20px' }}>
                      <motion.button
                        onClick={() => handleDelete(entry.id)}
                        whileHover={{ color: '#FF6B6B' }}
                        style={{
                          background: 'none', border: 'none', color: '#475569',
                          cursor: 'pointer', fontSize: '15px',
                        }}
                      >
                        🗑
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>

      <Toast toasts={toasts} removeToast={removeToast} />
      <style>{`
        @media (min-width: 768px) { .md-ml-240 { margin-left: 240px !important; } }
      `}</style>
    </div>
  )
}
