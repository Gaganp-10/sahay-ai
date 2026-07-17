import Hero from '../components/landing/Hero'
import FeaturesScroll from '../components/landing/FeaturesScroll'
import StatsSection from '../components/landing/StatsSection'
import Testimonials from '../components/landing/Testimonials'
import FinalCTA from '../components/landing/FinalCTA'
import Footer from '../components/landing/Footer'

export default function LandingPage() {
  return (
    <main style={{ background: '#050B18', minHeight: '100vh' }}>
      <Hero />
      <FeaturesScroll />
      <StatsSection />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </main>
  )
}
