import Navbar from './components/Navbar'
import Hero from './components/Hero'
import HowWeWork from './components/HowWeWork'
import About from './components/About'
import Gallery from './components/Gallery'
import RealPerson from './components/RealPerson'
import Process from './components/Process'
import Included from './components/Included'
import Faq from './components/Faq'
import Contact from './components/Contact'
import WorkTogether from './components/WorkTogether'
import Footer from './components/Footer'
import ScrollProgress from './components/ScrollProgress'
import CrimsonTree from './components/CrimsonTree'
import { useSmoothScroll } from './lib/useSmoothScroll'
import { useLeavesPaused } from './lib/useLeavesPaused'

const reducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function App() {
  useSmoothScroll()
  const [leavesPaused, setLeavesPaused] = useLeavesPaused()

  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[-1]">
        <CrimsonTree paused={reducedMotion} leavesPaused={leavesPaused} />
      </div>

      <ScrollProgress />
      <Navbar leavesPaused={leavesPaused} onToggleLeaves={() => setLeavesPaused((p) => !p)} />
      <main>
        <Hero />
        <HowWeWork />
        <About />
        <Gallery />
        <RealPerson />
        <Process />
        <Included />
        <Faq />
        <Contact />
        <WorkTogether />
      </main>
      <Footer />
    </>
  )
}
