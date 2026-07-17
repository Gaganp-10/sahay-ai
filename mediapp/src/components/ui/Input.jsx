import { forwardRef } from 'react'

const Input = forwardRef(({ label, error, type = 'text', className = '', ...props }, ref) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    {label && (
      <label style={{ color: '#94A3B8', fontSize: '13px', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
        {label}
      </label>
    )}
    <input
      ref={ref}
      type={type}
      className={`medi-input ${className}`}
      style={error ? { borderColor: '#FF6B6B', boxShadow: '0 0 0 3px rgba(255,107,107,0.15)' } : {}}
      {...props}
    />
    {error && (
      <p style={{ color: '#FF6B6B', fontSize: '12px', fontFamily: 'Inter, sans-serif', marginTop: '2px' }}>
        {error}
      </p>
    )}
  </div>
))
Input.displayName = 'Input'
export default Input

export function Select({ label, error, children, className = '', ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <label style={{ color: '#94A3B8', fontSize: '13px', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
          {label}
        </label>
      )}
      <select
        className={`medi-input ${className}`}
        style={{ appearance: 'none', cursor: 'pointer', ...(error ? { borderColor: '#FF6B6B' } : {}) }}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p style={{ color: '#FF6B6B', fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>{error}</p>
      )}
    </div>
  )
}

export function Textarea({ label, error, className = '', ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <label style={{ color: '#94A3B8', fontSize: '13px', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
          {label}
        </label>
      )}
      <textarea
        className={`medi-input ${className}`}
        style={{ resize: 'vertical', minHeight: 100, ...(error ? { borderColor: '#FF6B6B' } : {}) }}
        {...props}
      />
      {error && (
        <p style={{ color: '#FF6B6B', fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>{error}</p>
      )}
    </div>
  )
}
