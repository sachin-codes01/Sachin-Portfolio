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
import { useSmoothScroll } from './lib/useSmoothScroll'

export default function App() {
  useSmoothScroll()

  return (
    <>
      <ScrollProgress />
      <Navbar />
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
