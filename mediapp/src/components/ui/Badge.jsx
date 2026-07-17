const TYPE_CONFIG = {
  Checkup:     { color: '#00C6FF', bg: 'rgba(0,198,255,0.12)', icon: '🩺' },
  'Lab Test':  { color: '#00F5A0', bg: 'rgba(0,245,160,0.12)', icon: '🧪' },
  Prescription:{ color: '#A78BFA', bg: 'rgba(167,139,250,0.12)', icon: '💊' },
  Surgery:     { color: '#FF6B6B', bg: 'rgba(255,107,107,0.12)', icon: '🏥' },
  Vaccination: { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', icon: '💉' },
}

export default function Badge({ type, className = '' }) {
  const config = TYPE_CONFIG[type] || { color: '#94A3B8', bg: 'rgba(148,163,184,0.12)', icon: '📋' }
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '4px 12px',
        borderRadius: '50px',
        fontSize: '12px',
        fontWeight: 600,
        fontFamily: 'Inter, sans-serif',
        color: config.color,
        background: config.bg,
        border: `1px solid ${config.color}30`,
        whiteSpace: 'nowrap',
      }}
    >
      <span>{config.icon}</span>
      {type}
    </span>
  )
}

export { TYPE_CONFIG }
