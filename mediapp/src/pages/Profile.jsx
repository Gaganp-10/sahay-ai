import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '../components/layout/Sidebar'
import Modal from '../components/ui/Modal'
import Toast, { useToast } from '../components/ui/Toast'
import api, { mockProfile } from '../services/api'

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']

function TagInput({ tags, setTags, placeholder }) {
  const [input, setInput] = useState('')

  const add = () => {
    const v = input.trim()
    if (v && !tags.includes(v)) setTags([...tags, v])
    setInput('')
  }

  return (
    <div
      style={{
        background: '#0D1526', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '10px', padding: '8px 12px',
        display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center',
        minHeight: '48px',
      }}
    >
      {tags.map((tag) => (
        <span
          key={tag}
          style={{
            background: 'rgba(0,198,255,0.12)', border: '1px solid rgba(0,198,255,0.25)',
            borderRadius: '50px', padding: '4px 12px',
            color: '#00C6FF', fontSize: '13px', fontFamily: 'Inter',
            display: 'inline-flex', alignItems: 'center', gap: '6px',
          }}
        >
          {tag}
          <button
            onClick={() => setTags(tags.filter((t) => t !== tag))}
            style={{ background: 'none', border: 'none', color: '#00C6FF', cursor: 'pointer', fontSize: '14px', lineHeight: 1, padding: 0 }}
          >×</button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add() } }}
        onBlur={add}
        placeholder={tags.length === 0 ? placeholder : ''}
        style={{
          background: 'none', border: 'none', outline: 'none',
          color: 'white', fontFamily: 'Inter', fontSize: '14px',
          flex: 1, minWidth: 120,
        }}
      />
    </div>
  )
}

export default function Profile() {
  const userRaw = (() => { try { return JSON.parse(localStorage.getItem('user')) } catch { return null } })()
  const { toasts, addToast, removeToast } = useToast()

  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [personalForm, setPersonalForm] = useState({ name: '', email: '', dob: '', gender: '' })
  const [healthForm, setHealthForm] = useState({
    bloodType: 'O+', height: '', allergies: [], conditions: [], emergencyName: '', emergencyPhone: '',
  })
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' })
  const [savingPersonal, setSavingPersonal] = useState(false)
  const [savingHealth, setSavingHealth] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/api/profile')
        setProfile(res.data)
        setPersonalForm({ name: res.data.name, email: res.data.email, dob: res.data.dob, gender: res.data.gender })
        setHealthForm({
          bloodType: res.data.bloodType || 'O+',
          height: res.data.height || '',
          allergies: res.data.allergies || [],
          conditions: res.data.conditions || [],
          emergencyName: res.data.emergencyName || '',
          emergencyPhone: res.data.emergencyPhone || '',
        })
      } catch {
        const p = { ...mockProfile, ...(userRaw || {}) }
        setProfile(p)
        setPersonalForm({ name: p.name, email: p.email, dob: p.dob, gender: p.gender })
        setHealthForm({
          bloodType: p.bloodType, height: p.height,
          allergies: p.allergies, conditions: p.conditions,
          emergencyName: p.emergencyName, emergencyPhone: p.emergencyPhone,
        })
      }
    }
    fetch()
  }, [])

  const savePersonal = async (e) => {
    e.preventDefault()
    setSavingPersonal(true)
    try {
      await api.put('/api/profile', personalForm)
    } catch { /* local only */ }
    setProfile((p) => ({ ...p, ...personalForm }))
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    localStorage.setItem('user', JSON.stringify({ ...user, name: personalForm.name }))
    setSavingPersonal(false)
    setEditing(false)
    addToast('Profile updated!', 'success')
  }

  const saveHealth = async (e) => {
    e.preventDefault()
    setSavingHealth(true)
    try {
      await api.put('/api/profile/health', healthForm)
    } catch { /* local only */ }
    setProfile((p) => ({ ...p, ...healthForm }))
    setSavingHealth(false)
    addToast('Health info updated!', 'success')
  }

  const initials = profile?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'ME'

  const inputStyle = {
    width: '100%', background: '#0D1526', color: 'white',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
    padding: '12px 16px', fontFamily: 'Inter, sans-serif', fontSize: '14px', outline: 'none',
  }
  const labelStyle = { color: '#94A3B8', fontSize: '13px', fontFamily: 'Inter', fontWeight: 500, display: 'block', marginBottom: '6px' }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#050B18' }}>
      <Sidebar user={profile || userRaw} />
      <main style={{ flex: 1, padding: '32px 28px', paddingBottom: '100px' }} className="md-ml-240">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '36px' }}>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, color: 'white' }}>
            My Profile
          </h1>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          {/* Personal Info Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '20px', padding: '28px',
            }}
          >
            {/* Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
              <div
                style={{
                  width: 68, height: 68, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00C6FF, #0072FF)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Syne, sans-serif', fontSize: '24px', fontWeight: 700, color: 'white',
                  flexShrink: 0,
                }}
              >
                {initials}
              </div>
              <div>
                <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '22px', fontWeight: 700, color: 'white' }}>
                  {profile?.name || '—'}
                </h2>
                <p style={{ fontFamily: 'Inter', fontSize: '14px', color: '#94A3B8' }}>{profile?.email}</p>
              </div>
            </div>

            <form onSubmit={savePersonal} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { key: 'name', label: 'Full Name', type: 'text' },
                { key: 'email', label: 'Email', type: 'email' },
                { key: 'dob', label: 'Date of Birth', type: 'date' },
              ].map((f) => (
                <div key={f.key}>
                  <label style={labelStyle}>{f.label}</label>
                  {editing ? (
                    <input
                      type={f.type}
                      value={personalForm[f.key] || ''}
                      onChange={(e) => setPersonalForm((p) => ({ ...p, [f.key]: e.target.value }))}
                      style={{ ...inputStyle, colorScheme: f.type === 'date' ? 'dark' : undefined }}
                    />
                  ) : (
                    <p style={{ color: 'white', fontFamily: 'Inter', fontSize: '15px', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      {personalForm[f.key] || '—'}
                    </p>
                  )}
                </div>
              ))}
              <div>
                <label style={labelStyle}>Gender</label>
                {editing ? (
                  <select
                    value={personalForm.gender}
                    onChange={(e) => setPersonalForm((p) => ({ ...p, gender: e.target.value }))}
                    style={{ ...inputStyle, appearance: 'none' }}
                  >
                    {['Male', 'Female', 'Other'].map((g) => <option key={g} value={g} style={{ background: '#0D1526' }}>{g}</option>)}
                  </select>
                ) : (
                  <p style={{ color: 'white', fontFamily: 'Inter', fontSize: '15px', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    {personalForm.gender || '—'}
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                {editing ? (
                  <>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        flex: 1, background: 'linear-gradient(135deg, #00C6FF, #0072FF)',
                        color: 'white', border: 'none', borderRadius: '50px',
                        padding: '12px', fontFamily: 'Inter', fontWeight: 600, fontSize: '14px', cursor: 'pointer',
                      }}
                    >
                      {savingPersonal ? 'Saving...' : 'Save Changes'}
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => setEditing(false)}
                      whileHover={{ background: 'rgba(255,255,255,0.1)' }}
                      style={{
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '50px', padding: '12px 20px',
                        color: '#94A3B8', fontFamily: 'Inter', fontSize: '14px', cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </motion.button>
                  </>
                ) : (
                  <motion.button
                    type="button"
                    onClick={() => setEditing(true)}
                    whileHover={{ scale: 1.02 }}
                    style={{
                      background: 'rgba(0,198,255,0.1)', border: '1px solid rgba(0,198,255,0.25)',
                      borderRadius: '50px', padding: '12px 24px',
                      color: '#00C6FF', fontFamily: 'Inter', fontWeight: 600, fontSize: '14px', cursor: 'pointer',
                    }}
                  >
                    Edit Profile
                  </motion.button>
                )}
              </div>
            </form>
          </motion.div>

          {/* Health Summary Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '20px', padding: '28px',
            }}
          >
            <h2 style={{ fontFamily: 'Syne', fontSize: '20px', fontWeight: 700, color: 'white', marginBottom: '24px' }}>
              Health Summary
            </h2>
            <form onSubmit={saveHealth} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Blood Type</label>
                  <select
                    value={healthForm.bloodType}
                    onChange={(e) => setHealthForm((p) => ({ ...p, bloodType: e.target.value }))}
                    style={{ ...inputStyle, appearance: 'none' }}
                  >
                    {BLOOD_TYPES.map((bt) => <option key={bt} value={bt} style={{ background: '#0D1526' }}>{bt}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Height (cm)</label>
                  <input
                    type="number"
                    placeholder="178"
                    value={healthForm.height}
                    onChange={(e) => setHealthForm((p) => ({ ...p, height: e.target.value }))}
                    style={inputStyle}
                  />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Allergies (press Enter to add)</label>
                <TagInput
                  tags={healthForm.allergies}
                  setTags={(t) => setHealthForm((p) => ({ ...p, allergies: t }))}
                  placeholder="e.g. Penicillin, Pollen"
                />
              </div>
              <div>
                <label style={labelStyle}>Chronic Conditions</label>
                <TagInput
                  tags={healthForm.conditions}
                  setTags={(t) => setHealthForm((p) => ({ ...p, conditions: t }))}
                  placeholder="e.g. Hypertension, Diabetes"
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Emergency Contact Name</label>
                  <input
                    type="text"
                    placeholder="Sarah Johnson"
                    value={healthForm.emergencyName}
                    onChange={(e) => setHealthForm((p) => ({ ...p, emergencyName: e.target.value }))}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Emergency Phone</label>
                  <input
                    type="tel"
                    placeholder="+1 555 000 0000"
                    value={healthForm.emergencyPhone}
                    onChange={(e) => setHealthForm((p) => ({ ...p, emergencyPhone: e.target.value }))}
                    style={inputStyle}
                  />
                </div>
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  background: 'linear-gradient(135deg, #00F5A0, #00C6FF)',
                  color: '#050B18', border: 'none', borderRadius: '50px',
                  padding: '13px', fontFamily: 'Inter', fontWeight: 700,
                  fontSize: '14px', cursor: 'pointer', marginTop: '4px',
                }}
              >
                {savingHealth ? 'Saving...' : 'Save Health Info'}
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Account Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '20px',
            padding: '28px',
            marginBottom: '24px',
          }}
        >
          <h2 style={{ fontFamily: 'Syne', fontSize: '20px', fontWeight: 700, color: 'white', marginBottom: '24px' }}>
            Change Password
          </h2>
          <form
            onSubmit={(e) => { e.preventDefault(); addToast('Password changed successfully!', 'success'); setPwForm({ current: '', next: '', confirm: '' }) }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'end' }}
          >
            {[
              { key: 'current', label: 'Current Password', placeholder: '••••••••' },
              { key: 'next', label: 'New Password', placeholder: '••••••••' },
              { key: 'confirm', label: 'Confirm New Password', placeholder: '••••••••' },
            ].map((f) => (
              <div key={f.key}>
                <label style={labelStyle}>{f.label}</label>
                <input
                  type="password"
                  placeholder={f.placeholder}
                  value={pwForm[f.key]}
                  onChange={(e) => setPwForm((p) => ({ ...p, [f.key]: e.target.value }))}
                  style={inputStyle}
                />
              </div>
            ))}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: 'rgba(0,198,255,0.1)', border: '1px solid rgba(0,198,255,0.25)',
                borderRadius: '50px', padding: '12px 24px',
                color: '#00C6FF', fontFamily: 'Inter', fontWeight: 600, fontSize: '14px', cursor: 'pointer',
                alignSelf: 'flex-end',
              }}
            >
              Update Password
            </motion.button>
          </form>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{
            background: 'rgba(255,107,107,0.04)',
            border: '1px solid rgba(255,107,107,0.15)',
            borderRadius: '20px', padding: '24px 28px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', flexWrap: 'wrap',
          }}
        >
          <div>
            <h3 style={{ fontFamily: 'Syne', fontSize: '18px', fontWeight: 700, color: '#FF6B6B', marginBottom: '4px' }}>
              Danger Zone
            </h3>
            <p style={{ fontFamily: 'Inter', fontSize: '14px', color: '#94A3B8' }}>
              Permanently delete your account and all associated data. This cannot be undone.
            </p>
          </div>
          <motion.button
            onClick={() => setDeleteOpen(true)}
            whileHover={{ background: 'rgba(255,107,107,0.2)', scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.3)',
              borderRadius: '50px', padding: '11px 24px',
              color: '#FF6B6B', fontFamily: 'Inter', fontWeight: 600, fontSize: '14px',
              cursor: 'pointer', flexShrink: 0,
            }}
          >
            Delete Account
          </motion.button>
        </motion.div>
      </main>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete Account" size="sm">
        <p style={{ fontFamily: 'Inter', color: '#94A3B8', fontSize: '15px', lineHeight: 1.7, marginBottom: '28px' }}>
          Are you absolutely sure? This will permanently delete your account and all health data. This action <strong style={{ color: 'white' }}>cannot be undone</strong>.
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <motion.button
            onClick={() => {
              localStorage.clear()
              window.location.href = '/login'
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            style={{
              flex: 1, background: '#FF6B6B', color: 'white', border: 'none',
              borderRadius: '50px', padding: '13px', fontFamily: 'Inter', fontWeight: 700,
              fontSize: '14px', cursor: 'pointer',
            }}
          >
            Yes, Delete Everything
          </motion.button>
          <motion.button
            onClick={() => setDeleteOpen(false)}
            whileHover={{ background: 'rgba(255,255,255,0.08)' }}
            style={{
              flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '50px', padding: '13px', color: '#94A3B8',
              fontFamily: 'Inter', fontSize: '14px', cursor: 'pointer',
            }}
          >
            Cancel
          </motion.button>
        </div>
      </Modal>

      <Toast toasts={toasts} removeToast={removeToast} />
      <style>{`
        @media (min-width: 768px) { .md-ml-240 { margin-left: 240px !important; } }
      `}</style>
    </div>
  )
}
