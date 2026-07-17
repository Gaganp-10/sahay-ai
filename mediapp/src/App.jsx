import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Lenis from '@studio-freight/lenis'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { AnimatePresence } from 'framer-motion'

import CustomCursor from './components/CustomCursor'
import LoadingScreen from './components/LoadingScreen'
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import MedicalRecords from './pages/MedicalRecords'
import HealthTracker from './pages/HealthTracker'
import Profile from './pages/Profile'
import ProtectedRoute from './components/layout/ProtectedRoute'

gsap.registerPlugin(ScrollTrigger)

function NoiseOverlay() {
  return (
    <svg
      className="noise-overlay"
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
    >
      <filter id="noise">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.65"
          numOctaves="3"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
  )
}

export default function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const lenis = new Lenis()
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove((time) => lenis.raf(time * 1000))
      lenis.destroy()
    }
  }, [])

  return (
    <BrowserRouter>
      <CustomCursor />
      <NoiseOverlay />
      <AnimatePresence>
        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/records"
            element={
              <ProtectedRoute>
                <MedicalRecords />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tracker"
            element={
              <ProtectedRoute>
                <HealthTracker />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </BrowserRouter>
  )
}
