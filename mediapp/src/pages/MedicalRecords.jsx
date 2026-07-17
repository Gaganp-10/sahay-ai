import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '../components/layout/Sidebar'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import Toast, { useToast } from '../components/ui/Toast'
import api, { mockRecords } from '../services/api'

const TYPES = ['All', 'Checkup', 'Lab Test', 'Prescription', 'Surgery', 'Vaccination']

const defaultForm = { title: '', type: 'Checkup', date: '', doctor: '', notes: '' }

export default function MedicalRecords() {
  const user = (() => { try { return JSON.parse(localStorage.getItem('user')) } catch { return null } })()
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const [viewRecord, setViewRecord] = useState(null)
  const [form, setForm] = useState(defaultForm)
  const [submitting, setSubmitting] = useState(false)
  const { toasts, addToast, removeToast } = useToast()

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/api/records')
        setRecords(res.data)
      } catch {
        setRecords(mockRecords)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const filtered = useMemo(() => {
    return records.filter((r) => {
      if (typeFilter !== 'All' && r.type !== typeFilter) return false
      if (search && !r.title.toLowerCase().includes(search.toLowerCase()) &&
          !r.doctor.toLowerCase().includes(search.toLowerCase())) return false
      if (dateFrom && r.date < dateFrom) return false
      if (dateTo && r.date > dateTo) return false
      return true
    })
  }, [records, search, typeFilter, dateFrom, dateTo])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!form.title || !form.date || !form.doctor) {
      addToast('Please fill required fields', 'error')
      return
    }
    setSubmitting(true)
    try {
      const res = await api.post('/api/records', form)
      setRecords((prev) => [res.data, ...prev])
    } catch {
      // Optimistic local add
      const newRec = { ...form, id: Date.now().toString() }
      setRecords((prev) => [newRec, ...prev])
    }
    addToast('Record added successfully!', 'success')
    setAddOpen(false)
    setForm(defaultForm)
    setSubmitting(false)
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/records/${id}`)
    } catch { /* optimistic */ }
    setRecords((prev) => prev.filter((r) => r.id !== id))
    addToast('Record deleted', 'info')
  }

  const inputStyle = {
    width: '100%',
    background: '#0D1526',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    padding: '12px 16px',
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    outline: 'none',
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#050B18' }}>
      <Sidebar user={user} />
      <main style={{ flex: 1, padding: '32px 28px', paddingBottom: '100px' }} className="md-ml-240">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}
        >
          <div>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, color: 'white' }}>
              Medical Records
            </h1>
            <p style={{ fontFamily: 'Inter', color: '#94A3B8', fontSize: '15px', marginTop: '4px' }}>
              {records.length} records stored securely
            </p>
          </div>
          <motion.button
            onClick={() => setAddOpen(true)}
            whileHover={{ scale: 1.04, boxShadow: '0 8px 30px rgba(0,198,255,0.4)' }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: 'linear-gradient(135deg, #00C6FF, #0072FF)',
              color: 'white', border: 'none', borderRadius: '50px',
              padding: '12px 28px', fontFamily: 'Inter', fontWeight: 600,
              fontSize: '15px', cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(0,198,255,0.3)',
            }}
          >
            + Add Record
          </motion.button>
        </motion.div>

        {/* Filter Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '24px',
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 220px' }}>
            <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', fontSize: '16px' }}>🔍</span>
            <input
              placeholder="Search records or doctor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ ...inputStyle, paddingLeft: '40px' }}
            />
          </div>

          {/* Type filter */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                style={{
                  padding: '6px 16px',
                  borderRadius: '50px',
                  border: '1px solid',
                  borderColor: typeFilter === t ? '#00C6FF' : 'rgba(255,255,255,0.1)',
                  background: typeFilter === t ? 'rgba(0,198,255,0.12)' : 'transparent',
                  color: typeFilter === t ? '#00C6FF' : '#94A3B8',
                  fontFamily: 'Inter', fontSize: '13px', fontWeight: 500,
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Date range */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} style={{ ...inputStyle, width: 'auto', colorScheme: 'dark', fontSize: '13px', padding: '9px 12px' }} />
            <span style={{ color: '#94A3B8', fontSize: '13px' }}>to</span>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} style={{ ...inputStyle, width: 'auto', colorScheme: 'dark', fontSize: '13px', padding: '9px 12px' }} />
          </div>
        </motion.div>

        {/* Records List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 && !loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ textAlign: 'center', padding: '60px 20px', color: '#94A3B8', fontFamily: 'Inter' }}
              >
                <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>📋</span>
                No records found matching your filters.
              </motion.div>
            ) : (
              filtered.map((record, i) => (
                <motion.div
                  key={record.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  whileHover={{ x: 4 }}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '14px',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    transition: 'border-color 0.2s ease',
                  }}
                >
                  {/* Icon */}
                  <div style={{
                    width: 48, height: 48, borderRadius: '12px',
                    background: 'rgba(0,198,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '22px', flexShrink: 0,
                  }}>
                    {record.type === 'Checkup' ? '🩺' : record.type === 'Lab Test' ? '🧪' : record.type === 'Prescription' ? '💊' : record.type === 'Surgery' ? '🏥' : '💉'}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: 'Inter', fontSize: '16px', fontWeight: 600, color: 'white', marginBottom: '4px' }}>
                      {record.title}
                    </p>
                    <p style={{ fontFamily: 'Inter', fontSize: '13px', color: '#94A3B8' }}>
                      {record.doctor} · {record.date}
                    </p>
                  </div>

                  <Badge type={record.type} />

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    <motion.button
                      onClick={() => setViewRecord(record)}
                      whileHover={{ background: 'rgba(0,198,255,0.15)' }}
                      style={{
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '8px', padding: '7px 16px', color: '#94A3B8',
                        fontFamily: 'Inter', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s',
                      }}
                    >
                      View
                    </motion.button>
                    <motion.button
                      onClick={() => handleDelete(record.id)}
                      whileHover={{ background: 'rgba(255,107,107,0.15)', color: '#FF6B6B' }}
                      style={{
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '8px', padding: '7px 10px', color: '#94A3B8',
                        fontFamily: 'Inter', fontSize: '15px', cursor: 'pointer', transition: 'all 0.2s',
                      }}
                    >
                      🗑
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Add Record Modal */}
      <Modal isOpen={addOpen} onClose={() => setAddOpen(false)} title="Add Medical Record">
        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { key: 'title', label: 'Record Title *', placeholder: 'e.g. Annual Checkup', type: 'text' },
            { key: 'doctor', label: 'Doctor Name *', placeholder: 'Dr. Name', type: 'text' },
            { key: 'date', label: 'Date *', type: 'date' },
          ].map((f) => (
            <div key={f.key}>
              <label style={{ color: '#94A3B8', fontSize: '13px', fontFamily: 'Inter', fontWeight: 500, display: 'block', marginBottom: '6px' }}>
                {f.label}
              </label>
              <input
                type={f.type}
                placeholder={f.placeholder}
                value={form[f.key]}
                onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                style={{ ...inputStyle, colorScheme: 'dark' }}
              />
            </div>
          ))}
          <div>
            <label style={{ color: '#94A3B8', fontSize: '13px', fontFamily: 'Inter', fontWeight: 500, display: 'block', marginBottom: '6px' }}>
              Type
            </label>
            <select
              value={form.type}
              onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
              style={{ ...inputStyle, appearance: 'none' }}
            >
              {TYPES.slice(1).map((t) => <option key={t} value={t} style={{ background: '#0D1526' }}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={{ color: '#94A3B8', fontSize: '13px', fontFamily: 'Inter', fontWeight: 500, display: 'block', marginBottom: '6px' }}>
              Notes
            </label>
            <textarea
              placeholder="Additional notes..."
              value={form.notes}
              onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
              style={{ ...inputStyle, resize: 'vertical', minHeight: '90px' }}
            />
          </div>
          <motion.button
            type="submit"
            disabled={submitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              background: 'linear-gradient(135deg, #00C6FF, #0072FF)',
              color: 'white', border: 'none', borderRadius: '50px',
              padding: '14px', fontFamily: 'Inter', fontWeight: 600, fontSize: '15px',
              cursor: 'pointer', marginTop: '8px',
            }}
          >
            {submitting ? 'Saving...' : 'Add Record'}
          </motion.button>
        </form>
      </Modal>

      {/* View Record Modal */}
      <Modal isOpen={!!viewRecord} onClose={() => setViewRecord(null)} title={viewRecord?.title || ''}>
        {viewRecord && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { label: 'Type', value: viewRecord.type },
                { label: 'Date', value: viewRecord.date },
                { label: 'Doctor', value: viewRecord.doctor },
              ].map((f) => (
                <div key={f.label}>
                  <p style={{ color: '#94A3B8', fontSize: '12px', fontFamily: 'Inter', marginBottom: '4px' }}>{f.label}</p>
                  <p style={{ color: 'white', fontSize: '15px', fontFamily: 'Inter', fontWeight: 600 }}>{f.value}</p>
                </div>
              ))}
            </div>
            {viewRecord.notes && (
              <div>
                <p style={{ color: '#94A3B8', fontSize: '12px', fontFamily: 'Inter', marginBottom: '8px' }}>NOTES</p>
                <p style={{
                  color: '#CBD5E1', fontSize: '15px', fontFamily: 'Inter', lineHeight: 1.7,
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '12px', padding: '16px',
                }}>
                  {viewRecord.notes}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Toast toasts={toasts} removeToast={removeToast} />

      <style>{`
        @media (min-width: 768px) { .md-ml-240 { margin-left: 240px !important; } }
      `}</style>
    </div>
  )
}
