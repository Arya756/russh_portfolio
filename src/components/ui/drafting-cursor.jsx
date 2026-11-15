import { useEffect, useRef } from 'react'

export default function DraftingCursor() {
  const cursorRef = useRef(null)
  const coordsRef = useRef(null)
  const tagRef = useRef(null)

  useEffect(() => {
    const el = cursorRef.current
    if (!el) return

    let rafId = null
    let mouseX = -100
    let mouseY = -100
    let currentX = -100
    let currentY = -100
    let isVisible = false
    let isHovering = false

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY

      if (!isVisible) {
        isVisible = true
        currentX = mouseX
        currentY = mouseY
        el.style.opacity = '1'
      }

      // Check if hovering over clickable or interactive element
      const target = e.target
      const interactive = !!(
        target &&
        (target.closest('a, button, [role="button"], input, textarea, select, .gf-hit, .gf-sheet, .cursor-pointer') ||
          window.getComputedStyle(target).cursor === 'pointer')
      )

      if (interactive !== isHovering) {
        isHovering = interactive
        el.dataset.hover = interactive ? 'true' : 'false'
        if (tagRef.current) {
          tagRef.current.textContent = interactive ? 'SELECT' : ''
        }
      }
    }

    const onMouseLeave = () => {
      isVisible = false
      el.style.opacity = '0'
    }

    const onMouseEnter = () => {
      isVisible = true
      el.style.opacity = '1'
    }

    const render = () => {
      // Smooth coordinate interpolation (60% lerp for snappy responsiveness)
      currentX += (mouseX - currentX) * 0.65
      currentY += (mouseY - currentY) * 0.65

      el.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`

      if (coordsRef.current && isVisible) {
        coordsRef.current.textContent = `${Math.round(mouseX)}, ${Math.round(mouseY)}`
      }

      rafId = requestAnimationFrame(render)
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)
    rafId = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseenter', onMouseEnter)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      <div ref={cursorRef} className="cad-cursor" aria-hidden="true">
        {/* Architectural Crosshair Reticle */}
        <div className="cad-crosshair">
          {/* SVG for crisp, pixel-perfect rendering on retina screens */}
          <svg
            className="cad-reticle-svg"
            viewBox="0 0 48 48"
            width="48"
            height="48"
            fill="none"
          >
            {/* Center target circle */}
            <circle cx="24" cy="24" r="8" className="cad-svg-ring" />
            <circle cx="24" cy="24" r="1.75" className="cad-svg-dot" />

            {/* Crosshair lines with center gap for drafting precision */}
            <line x1="2" y1="24" x2="14" y2="24" className="cad-svg-line" />
            <line x1="34" y1="24" x2="46" y2="24" className="cad-svg-line" />
            <line x1="24" y1="2" x2="24" y2="14" className="cad-svg-line" />
            <line x1="24" y1="34" x2="24" y2="46" className="cad-svg-line" />
          </svg>
        </div>

        {/* CAD Trailing Coordinates Badge */}
        <div className="cad-hud">
          <span className="cad-coords" ref={coordsRef}>
            0, 0
          </span>
          <span className="cad-tag" ref={tagRef} />
        </div>
      </div>

      <style>{`
        /* Hide default OS cursor on non-touch screens */
        @media (hover: hover) and (pointer: fine) {
          *, *::before, *::after {
            cursor: none !important;
          }
        }

        /* Hide custom CAD cursor on touchscreens / mobile */
        @media (hover: none), (pointer: coarse) {
          .cad-cursor {
            display: none !important;
          }
        }

        .cad-cursor {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 9999999;
          pointer-events: none;
          user-select: none;
          opacity: 0;
          transition: opacity 0.15s ease;
          will-change: transform;
        }

        /* Center the reticle exactly on the cursor tip */
        .cad-crosshair {
          position: absolute;
          left: -24px;
          top: -24px;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cad-reticle-svg {
          display: block;
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.45));
          transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Hairlines with high contrast against both light and dark backgrounds */
        .cad-svg-line {
          stroke: #181424;
          stroke-width: 1.5;
          stroke-linecap: square;
        }

        .cad-svg-ring {
          stroke: #181424;
          stroke-width: 1.25;
          transition: r 0.2s cubic-bezier(0.16, 1, 0.3, 1), stroke-width 0.2s ease;
        }

        .cad-svg-dot {
          fill: #E4826A;
        }

        /* Trailing CAD HUD with Coordinates */
        .cad-hud {
          position: absolute;
          left: 14px;
          top: 14px;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 2.5px 6px;
          background: rgba(22, 17, 30, 0.88);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 4px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          font-family: ui-monospace, "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace;
          font-size: 9.5px;
          line-height: 1;
          letter-spacing: 0.05em;
          color: #ffee9b;
          white-space: nowrap;
          pointer-events: none;
        }

        .cad-coords {
          font-variant-numeric: tabular-nums;
          font-weight: 500;
        }

        .cad-tag {
          font-size: 8.5px;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #ffffff;
          background: #E4826A;
          padding: 1.5px 4.5px;
          border-radius: 2px;
          display: none;
        }

        /* Interactive Hover State when hovering over cards, buttons, links */
        .cad-cursor[data-hover="true"] .cad-reticle-svg {
          transform: scale(1.18);
        }

        .cad-cursor[data-hover="true"] .cad-svg-ring {
          r: 10;
          stroke: #E4826A;
          stroke-width: 1.5;
        }

        .cad-cursor[data-hover="true"] .cad-svg-line {
          stroke: #E4826A;
        }

        .cad-cursor[data-hover="true"] .cad-hud {
          border-color: rgba(228, 130, 106, 0.4);
          background: rgba(22, 17, 30, 0.95);
        }

        .cad-cursor[data-hover="true"] .cad-tag {
          display: inline-block;
        }
      `}</style>
    </>
  )
}
