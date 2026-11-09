import { useState, useEffect } from 'react'
import { ReactLenis, useLenis } from 'lenis/react'
import GlassFolder from './components/ui/glass-folder-cards'
import LanyardBadge from './components/ui/lanyard-badge'

const PROJECTS = [
  {
    title: "Helioshield",
    sub: "Godrej Design Lab · 6th rank",
    art: "olive",
    seed: 42,
    files: [
      { name: "System Overview", meta: "Façade Mechanism", art: "sage", href: "#helioshield" },
      { name: "Panel Fabrication", meta: "Modular Detail", art: "olive", href: "#helioshield" },
      { name: "Solar Simulation", meta: "Daylight Studies", art: "foliage", href: "#helioshield" },
      { name: "Competition Deck.pdf", meta: "PDF · 8.4 MB", href: "#helioshield" },
    ],
  },
  {
    title: "Spatial Intervention",
    sub: "Studio 02 · Academic",
    art: "sage",
    seed: 19,
    files: [
      { name: "Site Mapping", meta: "Circulation Flow", art: "sand" },
      { name: "Zoning & Section", meta: "Scale 1:50", art: "forest" },
      { name: "Physical Scale Model", meta: "Basswood & Acrylic" },
      { name: "Studio Review.pdf", meta: "PDF · 5.2 MB" },
    ],
  },
  {
    title: "Adaptive Reuse",
    sub: "Year 2 · Interior Arch",
    art: "clay",
    seed: 7,
    files: [
      { name: "Heritage Envelope", meta: "Structural Retention", art: "clay" },
      { name: "Interior Joinery", meta: "Custom Millwork", art: "sand" },
      { name: "Atmospheric Lighting", meta: "Lux Calculations", art: "olive" },
      { name: "Material Board", meta: "16 Finishes" },
    ],
  },
  {
    title: "Mio Emotion Fest",
    sub: "Exhibition & Stall Design",
    art: "foliage",
    seed: 23,
    files: [
      { name: "Stall Spatial Plan", meta: "Visitor Flow", art: "foliage" },
      { name: "Visual Identity", meta: "Graphics & Signage", art: "sage" },
      { name: "Fabrication Specs", meta: "Modular Framing" },
      { name: "Exhibition Renders", meta: "3D View" },
    ],
  },
  {
    title: "Biophilic Sanctuary",
    sub: "Residential Concept · 2025",
    art: "forest",
    seed: 88,
    files: [
      { name: "Microclimate Court", meta: "Passive Cooling", art: "forest" },
      { name: "Custom Earthware", meta: "Artisan Elements", art: "sand" },
      { name: "Spatial Renders", meta: "Twinmotion 4K", art: "sage" },
      { name: "Native Flora Guide", meta: "Spec Sheet" },
    ],
  },
  {
    title: "DesignX Pavilion",
    sub: "Departmental Curation",
    art: "sand",
    seed: 14,
    files: [
      { name: "Spatial Curation", meta: "Stage & Galleries", art: "sand" },
      { name: "Wayfinding Grid", meta: "Signage & Print", art: "clay" },
      { name: "Production Deck", meta: "Hospitality POC" },
      { name: "Event Retrospective", meta: "Photography" },
    ],
  },
]

const CHAPTERS = [
  ["Project overview", "A smart façade system using modular panels and solar-responsive mechanisms for urban heat and building performance."],
  ["Design brief", "Add the competition brief here."],
  ["Research and inspiration", "Add references, case studies and mood boards."],
  ["Problem identification", "Add the problem you identified."],
  ["Concept development", "Add how the idea took shape."],
  ["Design exploration", "Add the options you explored."],
  ["Sketches and iterations", "Add your sketches and how the design changed."],
  ["Technical drawings", "Add plans, sections and panel details."],
  ["Final design and renders", "Add your final renders."],
  ["Outcome", "Ranked 6th nationally in the Godrej Design Lab Campus Connect competition."],
]

function SectionScrollEffects() {
  const updateFades = () => {
    const sectionIds = ['home', 'about', 'cv', 'projects', 'contact']
    const windowHeight = window.innerHeight
    const startThreshold = windowHeight * 0.95
    const endThreshold = windowHeight * 0.15
    const distance = startThreshold - endThreshold

    for (let i = 0; i < sectionIds.length - 1; i++) {
      const currentEl = document.getElementById(sectionIds[i])
      const nextEl = document.getElementById(sectionIds[i + 1])
      if (!currentEl || !nextEl) continue

      const nextRect = nextEl.getBoundingClientRect()

      // Faster, responsive blend window
      const normalized = Math.max(0, Math.min(1, (nextRect.top - endThreshold) / distance))
      // Eased curve for a seamless dissolved blend into the next section
      const progress = Math.pow(normalized, 1.4)

      if (progress <= 0.01) {
        currentEl.style.opacity = '0'
        currentEl.style.filter = 'none'
        currentEl.style.pointerEvents = 'none'
      } else if (progress >= 0.99) {
        currentEl.style.opacity = '1'
        currentEl.style.filter = 'none'
        currentEl.style.pointerEvents = 'auto'
      } else {
        const opacity = progress.toFixed(3)
        const blurPx = ((1 - progress) * 6).toFixed(1)

        currentEl.style.opacity = opacity
        currentEl.style.filter = blurPx > 0.2 ? `blur(${blurPx}px)` : 'none'
        currentEl.style.pointerEvents = 'auto'
      }
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

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openChapters, setOpenChapters] = useState(false)
  return (
    <ReactLenis root options={{ lerp: 0.08, duration: 1.2, smoothWheel: true }}>
      <SectionScrollEffects />
      <div className="min-h-screen">
        <a href="#about" className="sr-only focus:not-sr-only fixed left-0 top-0 z-[99] bg-g2 text-white px-4 py-2">Skip to content</a>
        <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-end px-[clamp(1.25rem,5vw,5rem)] py-4 pointer-events-none transition-all">
          <button onClick={() => setMenuOpen(!menuOpen)} className="pointer-events-auto md:hidden w-10 h-10 relative" aria-label="Menu" aria-expanded={menuOpen}>
            <span className={`absolute left-2 right-2 h-[1.5px] bg-ink transition-all ${menuOpen ? 'top-1/2 rotate-45' : 'top-[1.05rem]'}`}></span>
            <span className={`absolute left-2 right-2 h-[1.5px] bg-ink transition-all ${menuOpen ? 'top-1/2 -rotate-45' : 'top-[1.55rem]'}`}></span>
          </button>
          <nav className={`fixed inset-0 bg-ivory grid place-items-center transition-all z-[-1] md:static md:bg-transparent md:grid-none md:place-items-start md:z-auto ${menuOpen ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible md:opacity-100 md:visible md:pointer-events-auto'}`}>
            <ul className="list-none flex flex-col md:flex-row gap-6 md:gap-10 text-center">
              {['Home', 'About', 'CV', 'Projects', 'Contact'].map(l => (
                <li key={l}><a href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)} className="no-underline text-[0.95rem] tracking-widest hover:text-g2 hover:border-b hover:border-g1 transition-all md:text-base">{l}</a></li>
              ))}
            </ul>
          </nav>
        </header>

        <main>
          <section id="home" className="sticky-section z-0 min-h-screen flex flex-col overflow-hidden" style={{ padding: 0 }}>
            {/* Top spacer */}
            <div className="flex-1" />

            {/* Name + PORTFOLIO — right-aligned with site gutter */}
            <div className="flex justify-end px-[clamp(2.5rem,8vw,8rem)] pb-4">
              <div className="text-right">
                <span className="block font-sans text-[clamp(1.75rem,3vw,2.5rem)] font-bold tracking-[0.25em] uppercase text-black">
                  Ruchita Rani
                </span>
                <h1
                  className="text-[clamp(2.8rem,8vw,8rem)] leading-[0.88] tracking-tight text-g2"
                  style={{ fontFamily: "'Duality', sans-serif" }}
                >
                  PORTFOLIO
                </h1>
              </div>
            </div>

            {/* Architectural drawing — same gutter so right edges align with text */}
            <div className="px-[clamp(2.5rem,8vw,8rem)]">
              <img
                src="/arch-drawing.jpg"
                alt="Architectural section drawing"
                className="w-full block"
                style={{ mixBlendMode: 'multiply' }}
                loading="eager"
              />
            </div>

            {/* Bottom label — left-aligned with same gutter */}
            <div className="px-[clamp(2.5rem,8vw,8rem)] py-6">
              <span className="font-sans text-[clamp(1.22rem,1.875vw,1.5rem)] font-semibold tracking-[0.18em] uppercase text-g2">
                Selected Work 2024–2026
              </span>
            </div>
          </section>

          <section
            id="about"
            className="sticky-section z-10 relative overflow-hidden bg-g2 text-ivory rounded-t-2xl md:rounded-t-[2.5rem] shadow-[0_-12px_40px_rgba(0,0,0,0.25)] border-t border-white/10 min-h-screen"
            style={{ backgroundColor: '#576c31', padding: 0 }}
          >
            <div className="absolute left-[clamp(2.5rem,8vw,8rem)] top-[clamp(2.5rem,5vw,4.5rem)] z-10 pointer-events-none max-w-xl md:max-w-2xl">
              <h2 className="text-[clamp(2rem,5vw,5rem)] text-ivory">About me</h2>
              <p className="text-ivory/85 text-sm md:text-base mt-2 font-light">
                Interior architecture student turning ideas into spaces people can use and feel. Drag to swing, tap to flip.
              </p>
            </div>

            <LanyardBadge
              height="100vh"
              title="Ruchita Rani"
              subtitle="Interior Architecture · B.Des 2026"
              name="Ruchita Rani"
              role="Space Planning & Visualization"
              strapText="turning ideas into spaces"
              strapLabel="RUCHITA RANI · DESIGN 2026"
              strapColor="#35302a"
              inkColor="#576c31"
              cardColor="#fbf7ee"
              cardWidth={240}
            />
          </section>

          <section
            id="cv"
            className="sticky-section z-20 bg-site min-h-screen flex flex-col justify-center rounded-t-2xl md:rounded-t-[2.5rem] shadow-[0_-12px_40px_rgba(0,0,0,0.18)] border-t border-black/5"
          >
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
                  <li>Associate Coordinator Intern, Sargaalaya International Arts &amp; Crafts Festival<small className="block text-mute text-sm">1 month</small></li>
                  <li>Design Team Member &amp; Stall Exhibitor, Mio Emotion Fest</li>
                  <li>Head, Hospitality &amp; Social Media Team / POC, DesignX<small className="block text-mute text-sm">Departmental fest</small></li>
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

          <section
            id="projects"
            className="sticky-section z-30 bg-site min-h-screen rounded-t-2xl md:rounded-t-[2.5rem] shadow-[0_-12px_40px_rgba(0,0,0,0.18)] border-t border-black/5"
            style={{ padding: 'clamp(2rem,4vw,3.5rem) clamp(2.5rem,8vw,8rem) clamp(2rem,4vw,3rem)' }}
          >
            <div className="flex justify-between items-end gap-8 flex-wrap">
              <div>
                <h2 className="text-[clamp(2rem,5vw,5rem)]">Projects</h2>
                <p className="max-w-[42ch] mt-2 text-mute">Selected academic, competition and exhibition work. Hover to lean a folder, click to explore its sheets.</p>
              </div>
              <p className="font-mono text-xs tracking-widest uppercase text-g2">
                Hover to lean · Click to open
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-8 justify-items-center mt-8">
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
                  width={280}
                />
              ))}
            </div>

            <article id="helioshield" className="mt-20">
              <h2 className="text-[clamp(2rem,5vw,5rem)]">Helioshield</h2>
              <p className="font-serif text-[clamp(1.5rem,2.6vw,2.2rem)] leading-[1.3] text-g2 mt-4 max-w-[62ch]">Godrej Design Lab Campus Connect. A smart façade system using modular panels and solar-responsive mechanisms, designed to address urban heat and building performance.</p>
              <span className="inline-block mt-4 border border-sage px-3 py-1 text-sm">Recognition: 6th rank nationally</span>
              <button onClick={() => setOpenChapters(!openChapters)} className="btn-outline mt-6">{openChapters ? 'Hide chapters' : 'Show chapters'}</button>
              {openChapters && (
                <ol className="mt-8 space-y-4 list-decimal pl-6">
                  {CHAPTERS.map(([t, d], i) => (
                    <li key={i}><strong className="font-serif text-g2">{t}</strong><p className="text-mute">{d}</p></li>
                  ))}
                </ol>
              )}
            </article>
          </section>

          <section
            id="contact"
            className="sticky-section z-40 bg-site min-h-screen flex flex-col justify-between rounded-t-2xl md:rounded-t-[2.5rem] shadow-[0_-12px_40px_rgba(0,0,0,0.22)] border-t border-black/5"
          >
            <h2 className="text-[clamp(2rem,5vw,5rem)]">Have an idea? Let's create something meaningful.</h2>
            <div className="mt-8 flex flex-col gap-4">
              <a href="mailto:ruchitarani99@gmail.com" className="border-b border-sage pb-2 flex justify-between max-w-md"><small className="text-mute">Email</small><span>ruchitarani99@gmail.com</span></a>
              <a href="tel:+918789473293" className="border-b border-sage pb-2 flex justify-between max-w-md"><small className="text-mute">Phone</small><span>+91 8789473293</span></a>
              <a href="https://www.behance.net/ruchitarani" target="_blank" rel="noopener" className="border-b border-sage pb-2 flex justify-between max-w-md"><small className="text-mute">Behance</small><span>behance.net/ruchitarani</span></a>
              <a href="https://www.linkedin.com/" target="_blank" rel="noopener" className="border-b border-sage pb-2 flex justify-between max-w-md"><small className="text-mute">LinkedIn</small><span>Add your profile link</span></a>
            </div>
            <footer className="mt-16 flex justify-between text-sm text-mute">
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