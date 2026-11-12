import { useState, useEffect } from 'react'
import { ReactLenis, useLenis } from 'lenis/react'
import GlassFolder from './components/ui/glass-folder-cards'
import LanyardBadge from './components/ui/lanyard-badge'

const PROJECTS = [
  { title: "Helioshield", sub: "Godrej Design Lab · 6th rank", art: "none", seed: 42, files: [
    { name: "System Overview", meta: "Façade Mechanism", href: "#helioshield" },
    { name: "Panel Fabrication", meta: "Modular Detail", href: "#helioshield" },
    { name: "Solar Simulation", meta: "Daylight Studies", href: "#helioshield" },
    { name: "Competition Deck.pdf", meta: "PDF · 8.4 MB", href: "#helioshield" },
  ]},
  { title: "Spatial Intervention", sub: "Studio 02 · Academic", art: "none", seed: 19, files: [
    { name: "Site Mapping", meta: "Circulation Flow" },
    { name: "Zoning & Section", meta: "Scale 1:50" },
    { name: "Physical Scale Model", meta: "Basswood & Acrylic" },
    { name: "Studio Review.pdf", meta: "PDF · 5.2 MB" },
  ]},
  { title: "Adaptive Reuse", sub: "Year 2 · Interior Arch", art: "none", seed: 7, files: [
    { name: "Heritage Envelope", meta: "Structural Retention" },
    { name: "Interior Joinery", meta: "Custom Millwork" },
    { name: "Atmospheric Lighting", meta: "Lux Calculations" },
    { name: "Material Board", meta: "16 Finishes" },
  ]},
  { title: "Mio Emotion Fest", sub: "Exhibition & Stall Design", art: "none", seed: 23, files: [
    { name: "Stall Spatial Plan", meta: "Visitor Flow" },
    { name: "Visual Identity", meta: "Graphics & Signage" },
    { name: "Fabrication Specs", meta: "Modular Framing" },
    { name: "Exhibition Renders", meta: "3D View" },
  ]},
  { title: "Biophilic Sanctuary", sub: "Residential Concept · 2025", art: "none", seed: 88, files: [
    { name: "Microclimate Court", meta: "Passive Cooling" },
    { name: "Custom Earthware", meta: "Artisan Elements" },
    { name: "Spatial Renders", meta: "Twinmotion 4K" },
    { name: "Native Flora Guide", meta: "Spec Sheet" },
  ]},
  { title: "DesignX Pavilion", sub: "Departmental Curation", art: "none", seed: 14, files: [
    { name: "Spatial Curation", meta: "Stage & Galleries" },
    { name: "Wayfinding Grid", meta: "Signage & Print" },
    { name: "Production Deck", meta: "Hospitality POC" },
    { name: "Event Retrospective", meta: "Photography" },
  ]},
]

function getSectionScrollTop(id) {
  const sectionIds = ['home', 'about', 'cv', 'projects', 'contact']
  const cleanId = id.replace('#', '').toLowerCase()
  const index = sectionIds.indexOf(cleanId)
  if (index <= 0) return 0

  let top = 0
  for (let i = 0; i < index; i++) {
    const el = document.getElementById(sectionIds[i])
    if (el) {
      top += el.offsetHeight
    }
  }
  return top
}

function SectionScrollEffects() {
  const updateFades = () => {
    const sectionIds = ['home', 'about', 'cv', 'projects', 'contact']
    const windowHeight = window.innerHeight

    for (let i = 0; i < sectionIds.length - 1; i++) {
      const currentEl = document.getElementById(sectionIds[i])
      const nextEl = document.getElementById(sectionIds[i + 1])
      if (!currentEl || !nextEl) continue

      const nextRect = nextEl.getBoundingClientRect()
      const rawProgress = nextRect.top / windowHeight
      const progress = Math.max(0, Math.min(1, rawProgress))

      currentEl.style.opacity = progress.toFixed(3)
      currentEl.style.pointerEvents = progress < 0.05 ? 'none' : 'auto'
    }
  }

  useLenis(updateFades)

  useEffect(() => {
    updateFades()
    window.addEventListener('scroll', updateFades, { passive: true })
    window.addEventListener('resize', updateFades)
    return () => {
      window.removeEventListener('scroll', updateFades)
      window.removeEventListener('resize', updateFades)
    }
  }, [])

  return null
}

function Navigation({ menuOpen, setMenuOpen }) {
  const lenis = useLenis()

  const handleNavClick = (id) => {
    setMenuOpen(false)
    const targetScroll = getSectionScrollTop(id)
    if (lenis) {
      lenis.scrollTo(targetScroll, { duration: 1.2 })
    } else {
      window.scrollTo({ top: targetScroll, behavior: 'smooth' })
    }
  }

  return (
    <>
      <a
        href="#about"
        onClick={(e) => {
          e.preventDefault()
          handleNavClick('about')
        }}
        className="sr-only focus:not-sr-only fixed left-0 top-0 z-[99] bg-g2 text-white px-4 py-2"
      >
        Skip to content
      </a>
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-end px-[clamp(1.25rem,5vw,5rem)] py-4 pointer-events-none transition-all">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="pointer-events-auto md:hidden w-10 h-10 relative"
          aria-label="Menu"
          aria-expanded={menuOpen}
        >
          <span className={`absolute left-2 right-2 h-[1.5px] bg-ink transition-all ${menuOpen ? 'top-1/2 rotate-45' : 'top-[1.05rem]'}`}></span>
          <span className={`absolute left-2 right-2 h-[1.5px] bg-ink transition-all ${menuOpen ? 'top-1/2 -rotate-45' : 'top-[1.55rem]'}`}></span>
        </button>
        <nav
          className={`fixed inset-0 bg-ivory grid place-items-center transition-all z-[-1] md:static md:bg-ivory/60 md:backdrop-blur-md md:px-6 md:py-2 md:rounded-full md:border md:border-black/5 md:shadow-xs md:grid-none md:place-items-start md:z-auto ${
            menuOpen ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible md:opacity-100 md:visible md:pointer-events-auto'
          }`}
        >
          <ul className="list-none flex flex-col md:flex-row gap-6 md:gap-10 text-center">
            {['Home', 'About', 'CV', 'Projects', 'Contact'].map((l) => (
              <li key={l}>
                <a
                  href={`#${l.toLowerCase()}`}
                  onClick={(e) => {
                    e.preventDefault()
                    handleNavClick(l.toLowerCase())
                  }}
                  className="no-underline text-[0.95rem] tracking-widest hover:text-black transition-all md:text-base font-medium cursor-pointer"
                >
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>
    </>
  )
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <ReactLenis root options={{ lerp: 0.08, duration: 1.2, smoothWheel: true }}>
      <SectionScrollEffects />
      <Navigation menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div className="min-h-screen">
        <main>
          <section id="home" className="sticky-section z-0 min-h-screen flex flex-col overflow-hidden" style={{ backgroundColor: '#F7F0E6', padding: 0 }}>
            <div className="flex-1" />
            <div className="flex justify-end px-[clamp(2.5rem,8vw,8rem)] pb-4">
              <div className="text-right">
                <span className="block font-sans text-[clamp(1.75rem,3vw,2.5rem)] font-bold tracking-[0.25em] uppercase text-black">Ruchita Rani</span>
                <h1 className="text-[clamp(2.8rem,8vw,8rem)] leading-[0.88] tracking-tight text-[#E4826A]" style={{ fontFamily: "'Duality', sans-serif" }}>
                  PORTFOLIO
                </h1>
              </div>
            </div>
            <div className="px-[clamp(2.5rem,8vw,8rem)]">
              <img src="/hero.jpg" alt="Architectural section drawing" className="w-full block" style={{ mixBlendMode: 'multiply' }} loading="eager" />
            </div>
            <div className="px-[clamp(2.5rem,8vw,8rem)] py-6">
              <span className="font-sans text-[clamp(1.22rem,1.875vw,1.5rem)] font-semibold tracking-[0.18em] uppercase text-[#E4826A]">Selected Work 2024–2026</span>
            </div>
          </section>

          <section id="about" className="sticky-section z-10 relative overflow-hidden text-ink rounded-t-2xl md:rounded-t-[2.5rem] shadow-[0_-12px_40px_rgba(0,0,0,0.18)] border-t border-black/5 min-h-screen" style={{ backgroundColor: '#B6C4A3', padding: 0 }}>
            <div className="absolute left-[clamp(2.5rem,8vw,8rem)] top-[clamp(2.5rem,5vw,4.5rem)] z-10 pointer-events-none max-w-xl md:max-w-2xl">
              <h2 className="text-[clamp(2rem,5vw,5rem)] text-ink">About me</h2>
              <p className="text-ink/80 text-sm md:text-base mt-2 font-light">Interior architecture student turning ideas into spaces people can use and feel. Drag to swing, tap to flip.</p>
            </div>
            <LanyardBadge height="100vh" title="Ruchita Rani" subtitle="Interior Architecture · B.Des 2026" name="Ruchita Rani" role="Space Planning & Visualization" strapText="turning ideas into spaces" strapLabel="RUCHITA RANI · DESIGN 2026" strapColor="#35302a" inkColor="#35302a" cardColor="#fbf7ee" cardWidth={240} />
          </section>

          <section id="cv" className="sticky-section z-20 min-h-screen flex flex-col justify-center rounded-t-2xl md:rounded-t-[2.5rem] shadow-[0_-12px_40px_rgba(0,0,0,0.18)] border-t border-black/5" style={{ backgroundColor: '#E2B549' }}>
            <div className="flex justify-between items-end flex-wrap gap-6">
              <h2 className="text-[clamp(2rem,5vw,5rem)]">My CV</h2>
              <a href="/cv.pdf" download className="btn-solid">Download CV (PDF)</a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-6 mt-14">
              <div className="md:col-span-4 border-t border-g1 pt-4">
                <h3 className="text-2xl mb-4 text-g2">Education</h3>
                <ul className="list-none m-0 p-0 space-y-4">
                  <li>Rishihood University<small className="block text-mute text-sm">Bachelor of Design, 2nd year</small></li>
                  <li>Sita Saran Memorial School<small className="block text-mute text-sm">Class 11–12</small></li>
                  <li>Kendriya Vidyalaya Harnaut<small className="block text-mute text-sm">Class 1–10</small></li>
                </ul>
              </div>
              <div className="md:col-span-8 border-t border-g1 pt-4">
                <h3 className="text-2xl mb-4 text-g2">Experience</h3>
                <ul className="list-none m-0 p-0 space-y-4">
                  <li>Associate Coordinator Intern, Sargaalaya International Arts & Crafts Festival<small className="block text-mute text-sm">1 month</small></li>
                  <li>Design Team Member & Stall Exhibitor, Mio Emotion Fest</li>
                  <li>Head, Hospitality & Social Media Team / POC, DesignX<small className="block text-mute text-sm">Departmental fest</small></li>
                  <li>Placement Coordinator, Rishihood University</li>
                </ul>
              </div>
              <div className="md:col-span-4 border-t border-g1 pt-4">
                <h3 className="text-2xl mb-4 text-g2">Skills</h3>
                <ul className="list-none m-0 p-0 space-y-2">
                  {['Space planning', 'Visualization', 'Layout development', 'Concept development', 'Mood boards', 'Basic knowledge of materials, finishes and lighting'].map(s => <li key={s}>{s}</li>)}
                </ul>
              </div>
              <div className="md:col-span-4 border-t border-g1 pt-4">
                <h3 className="text-2xl mb-4 text-g2">Software</h3>
                <ul className="list-none m-0 p-0 columns-2 gap-8 space-y-1">
                  {['AutoCAD', 'Twinmotion', 'Rhino', 'Unreal Engine', 'Canva', 'ZBrush', 'Photoshop', 'Figma'].map(s => <li key={s} className="break-inside-avoid">{s}</li>)}
                </ul>
              </div>
              <div className="md:col-span-4 bg-g2 text-ivory p-6 border-0">
                <h3 className="text-2xl mb-4 text-ivory">Achievement</h3>
                <strong className="font-serif text-[1.7rem] leading-[1.1] block mb-3">6th rank nationally</strong>
                <p className="max-w-none">Godrej Design Lab Campus Connect, national competition. Developed Helioshield, a smart façade system using modular panels and solar-responsive mechanisms, an innovative solution for urban heat and building performance.</p>
              </div>
            </div>
          </section>

          <section id="projects" className="sticky-section z-30 min-h-screen flex flex-col justify-center rounded-t-2xl md:rounded-t-[2.5rem] shadow-[0_-12px_40px_rgba(0,0,0,0.18)] border-t border-black/5" style={{ backgroundColor: '#FD892B', padding: 'clamp(2.5rem,5vw,4rem) clamp(2.5rem,8vw,8rem)' }}>
            <div className="flex justify-between items-end gap-8 flex-wrap">
              <div>
                <h2 className="text-[clamp(2rem,5vw,5rem)]">Projects</h2>
                <p className="max-w-[42ch] mt-2 text-ink/80">Selected academic, competition and exhibition work. Hover to lean a folder, click to explore its sheets.</p>
              </div>
              <p className="font-mono text-xs tracking-widest uppercase text-ink">Hover to lean · Click to open</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-7 justify-items-center mt-6">
              {PROJECTS.map((p, i) => (
                <GlassFolder
                  key={p.title}
                  label={p.title}
                  meta={p.sub}
                  art={p.art}
                  seed={p.seed}
                  files={p.files}
                  action="none"
                  appearDelay={i * 90}
                  width={250}
                  folderColor="#0070FF"
                />
              ))}
            </div>
          </section>

          <section id="contact" className="sticky-section z-40 min-h-screen flex flex-col justify-between rounded-t-2xl md:rounded-t-[2.5rem] shadow-[0_-12px_40px_rgba(0,0,0,0.22)] border-t border-white/10 text-ivory" style={{ backgroundColor: '#9E6B50' }}>
            <h2 className="text-[clamp(2rem,5vw,5rem)] text-ivory">Have an idea? Let's create something meaningful.</h2>
            <div className="mt-8 flex flex-col gap-4">
              <a href="mailto:ruchitarani99@gmail.com" className="border-b border-ivory/30 pb-2 flex justify-between max-w-md"><small className="text-ivory/70">Email</small><span>ruchitarani99@gmail.com</span></a>
              <a href="tel:+918****3293" className="border-b border-ivory/30 pb-2 flex justify-between max-w-md"><small className="text-ivory/70">Phone</small><span>+91 8789473293</span></a>
              <a href="https://www.behance.net/ruchitarani" target="_blank" rel="noopener" className="border-b border-ivory/30 pb-2 flex justify-between max-w-md"><small className="text-ivory/70">Behance</small><span>behance.net/ruchitarani</span></a>
              <a href="https://www.linkedin.com/" target="_blank" rel="noopener" className="border-b border-ivory/30 pb-2 flex justify-between max-w-md"><small className="text-ivory/70">LinkedIn</small><span>Add your profile link</span></a>
            </div>
            <footer className="mt-16 flex justify-between text-sm text-ivory/70">
              <span>Ruchita Rani</span>
              <span>© 2026 Ruchita Rani. All rights reserved.</span>
            </footer>
          </section>
        </main>

        <style>{` 
          .btn-solid { display:inline-block; font:400 .95rem "Jost",system-ui,sans-serif; letter-spacing:.04em; text-decoration:none; padding:.95rem 1.8rem; border:1px solid #576c31; background:#576c31; color:#fbf7ee; cursor:pointer; transition:background .3s; }
          .btn-solid:hover { background:#35302a; border-color:#35302a; }
          .btn-outline { display:inline-block; font:400 .95rem "Jost",system-ui,sans-serif; letter-spacing:.04em; text-decoration:none; padding:.95rem 1.8rem; border:1px solid #576c31; background:none; color:#576c31; cursor:pointer; transition:background .3s,color .3s; }
          .btn-outline:hover { background:#678539; color:#fbf7ee; border-color:#678539; }
        `}</style>
      </div>
    </ReactLenis>
  )
}
