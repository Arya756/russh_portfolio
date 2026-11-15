import { useEffect, useRef, useState } from 'react'

export default function DraftingCursor() {
  const cursorRef = useRef(null)
  const coordsRef = useRef(null)
  const labelRef = useRef(null)
  const pos = useRef({ x: -100, y: -100, targetX: -100, targetY: -100 })
  const isHovering = useRef(false)
  const isVisible = useRef(false)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    // Only enable on non-touch devices with fine pointers
    if (typeof window === 'undefined') return
    const isFinePointer = window.matchMedia('(pointer: fine)').matches
    if (!isFinePointer) return
    setEnabled(true)

    const el = cursorRef.current
    if (!el) return

    let rafId = null

    const onMouseMove = (e) => {
      pos.current.targetX = e.clientX
      pos.current.targetY = e.clientY

      if (!isVisible.current) {
        isVisible.current = true
        el.style.opacity = '1'
        pos.current.x = e.clientX
        pos.current.y = e.clientY
      }

      // Check if hovering clickable / interactive target
      const target = e.target
      const interactive = !!(
        target &&
        (target.closest('a, button, [role="button"], input, textarea, select, .gf-hit, .gf-sheet, .cursor-pointer') ||
          window.getComputedStyle(target).cursor === 'pointer')
      )

      if (interactive !== isHovering.current) {
        isHovering.current = interactive
        el.dataset.hover = interactive ? 'true' : 'false'
        if (labelRef.current) {
          labelRef.current.textContent = interactive ? 'SELECT' : ''
        }
      }
    }

    const onMouseLeave = () => {
      isVisible.current = false
      el.style.opacity = '0'
    }

    const onMouseEnter = () => {
      isVisible.current = true
      el.style.opacity = '1'
    }

    const loop = () => {
      // Smooth interpolation for coords, direct for crosshair
      const p = pos.current
      p.x += (p.targetX - p.x) * 0.4
      p.y += (p.targetY - p.y) * 0.4

      el.style.transform = `translate3d(${p.targetX}px, ${p.targetY}px, 0)`

      if (coordsRef.current && isVisible.current) {
        const xCoord = Math.round(p.targetX)
        const yCoord = Math.round(p.targetY)
        coordsRef.current.textContent = `${xCoord}, ${yCoord}`
      }

      rafId = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)
    rafId = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseenter', onMouseEnter)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  if (!enabled) return null

  return (
    <>
      <div ref={cursorRef} className="cad-cursor" style={{ opacity: 0 }} aria-hidden="true">
        {/* Reticle / Crosshair */}
        <div className="cad-crosshair">
          <span className="cad-hair-h" />
          <span className="cad-hair-v" />
          <span className="cad-ring" />
          <span className="cad-dot" />
        </div>

        {/* Trailing Coordinates HUD */}
        <div className="cad-hud">
          <span className="cad-coords" ref={coordsRef}>
            0, 0
          </span>
          <span className="cad-tag" ref={labelRef} />
        </div>
      </div>

      <style>{`
        /* Hide system cursor on fine pointer devices */
        @media (pointer: fine) {
          body, a, button, input, textarea, select, [role="button"], .cursor-pointer {
            cursor: none !important;
          }
        }

        .cad-cursor {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 9999999;
          pointer-events: none;
          mix-blend-mode: difference;
          will-change: transform;
          user-select: none;
          transition: opacity 0.2s ease;
        }

        /* The Crosshair Reticle centered on the exact cursor point */
        .cad-crosshair {
          position: absolute;
          left: 0;
          top: 0;
          width: 0;
          height: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Horizontal Hairline */
        .cad-hair-h {
          position: absolute;
          left: -16px;
          top: 0;
          width: 32px;
          height: 1px;
          background: #ffffff;
          transition: width 0.2s cubic-bezier(0.16, 1, 0.3, 1), left 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Vertical Hairline */
        .cad-hair-v {
          position: absolute;
          top: -16px;
          left: 0;
          width: 1px;
          height: 32px;
          background: #ffffff;
          transition: height 0.2s cubic-bezier(0.16, 1, 0.3, 1), top 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* CAD Precision Ring */
        .cad-ring {
          position: absolute;
          width: 18px;
          height: 18px;
          border: 1px solid rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          left: 0;
          top: 0;
          transition: all 0.24s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Center Dot */
        .cad-dot {
          position: absolute;
          width: 2.5px;
          height: 2.5px;
          background: #ffffff;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          left: 0;
          top: 0;
          transition: opacity 0.2s ease;
        }

        /* CAD HUD Coordinates: Offset to bottom right of crosshair */
        .cad-hud {
          position: absolute;
          left: 14px;
          top: 14px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: ui-monospace, "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace;
          font-size: 9.5px;
          line-height: 1;
          letter-spacing: 0.06em;
          color: rgba(255, 255, 255, 0.75);
          white-space: nowrap;
          pointer-events: none;
        }

        .cad-coords {
          font-variant-numeric: tabular-nums;
        }

        .cad-tag {
          font-size: 8.5px;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #ffffff;
          background: rgba(255, 255, 255, 0.15);
          padding: 1px 4px;
          border-radius: 2px;
          opacity: 0;
          transform: scale(0.85);
          transition: opacity 0.18s ease, transform 0.18s ease;
        }

        /* Hover States when over clickable/interactive elements */
        .cad-cursor[data-hover="true"] .cad-ring {
          width: 32px;
          height: 32px;
          border-color: rgba(255, 255, 255, 0.95);
          background: rgba(255, 255, 255, 0.08);
        }

        .cad-cursor[data-hover="true"] .cad-hair-h {
          width: 44px;
          left: -22px;
          background: #ffffff;
        }

        .cad-cursor[data-hover="true"] .cad-hair-v {
          height: 44px;
          top: -22px;
          background: #ffffff;
        }

        .cad-cursor[data-hover="true"] .cad-tag {
          opacity: 1;
          transform: scale(1);
        }
      `}</style>
    </>
  )
}
