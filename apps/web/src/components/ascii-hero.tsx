import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"

/**
 * Animated ASCII hero, rendered to a canvas.
 *
 * Ported from the Torva site. Two modes:
 *   - "field"    — a drifting wave field used as the hero's background texture
 *   - "wordmark" — `text` rendered as ASCII, sampled from an offscreen
 *                  coverage mask so the letterforms stay legible
 *
 * Character ramps run from "least ink" to "most ink". The renderer samples a
 * coverage mask (wordmark) or a wave field (backdrop) and picks a character per
 * cell, so this is real ASCII art driving the canvas rather than a dither.
 *
 * Adaptations for this project:
 *   - reduced motion comes from matchMedia instead of framer-motion, which is
 *     not a dependency here
 *   - the ink palette defaults to neutral greys for the light/grey theme
 *   - the font stack falls back to the app's `--font-sans` (Geist)
 */

/**
 * Density ramp, least ink to most.
 *
 * Kept short on purpose. The full ten-step ramp (` .:-=+*#%@`) puts heavy
 * glyphs like `#` and `%` on the ridges, which reads as noise at hero size —
 * the field looked like static rather than a wave. Four steps carry the same
 * information: the wave is legible from the ink levels, and the character only
 * needs to say "more" or "less". The result is a fine stipple with the ridges
 * picking up the accent, which is the cleaner texture the hero wanted.
 */
const RAMP = " .:+"

/**
 * Quantised ink levels keep canvas state changes cheap. The ramp runs from a
 * neutral haze up to the accent — cool blue into pale ice — so the ripple
 * ridges are the only thing that lights up in colour.
 */
const DEFAULT_LEVELS = [
  "rgba(255, 255, 255, 0.1)",
  "rgba(178, 208, 255, 0.26)",
  "rgba(120, 165, 255, 0.5)",
  "rgba(96, 165, 250, 0.92)",
]

/** Glow painted around the brightest ink level. */
const DEFAULT_GLOW = "rgba(96, 165, 250, 0.9)"
const DEFAULT_GLOW_BLUR = 7

/** Row count for field mode. Deriving the cell from the canvas HEIGHT (a fixed
 *  row count) rather than its width is what keeps the ripple texture identical
 *  across viewports — a portrait phone then shows the same pattern as a wide
 *  desktop, just with fewer characters across. */
const FIELD_ROWS = 18

type Mode = "wordmark" | "field"

/**
 * Ripple sources for field mode, in fractional band coordinates (0..1).
 * Each one emits a set of concentric rings; more sources means more ripples
 * on screen, while RIPPLE_FREQ sets how far apart the rings sit (lower =
 * bigger ripples).
 *
 * Four sources rather than seven: the extra three crowded the middle of the
 * band and turned the wave into interference. Fewer, further apart, and the
 * pattern reads as ripples again.
 */
const RIPPLES = [
  { x: 0.2, y: 0.26, phase: 0.0 },
  { x: 0.6, y: 0.14, phase: 1.7 },
  { x: 0.87, y: 0.42, phase: 3.1 },
  { x: 0.37, y: 0.6, phase: 0.9 },
]

/** Ring spacing = 2π / RIPPLE_FREQ (in band-height units). Lower = bigger. */
const RIPPLE_FREQ = 26
/** How fast the rings expand outward, in radians per second. */
const RIPPLE_SPEED = 1.1

export function AsciiHero({
  text = "gandalf",
  mode = "wordmark",
  cols,
  fps = 18,
  levels = DEFAULT_LEVELS,
  glowColor = DEFAULT_GLOW,
  glowBlur = DEFAULT_GLOW_BLUR,
  speed = 1,
  rowCount,
  className,
}: {
  text?: string
  mode?: Mode
  /** Columns for wordmark mode. Ignored by the field. */
  cols?: number
  /** Rows for field mode. Defaults to FIELD_ROWS. */
  rowCount?: number
  fps?: number
  /** Four ink colours, least to most. */
  levels?: string[]
  /** Colour of the halo around the brightest ink. */
  glowColor?: string
  /** Halo radius in px. 0 disables the glow entirely. */
  glowBlur?: number
  /**
   * Multiplier on how fast the ripples expand. 1 is the base rate; lower is
   * slower. Lets one instance drift gently while another stays lively.
   */
  speed?: number
  className?: string
}) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    /*
     * A next/font-style variable exposes an already-quoted font stack, so it
     * must not be wrapped in quotes again or the canvas font string becomes
     * invalid. Fall back to the app's sans stack, then to the system UI font.
     */
    const rootStyles = getComputedStyle(document.documentElement)
    const family =
      rootStyles.getPropertyValue("--font-display-raw").trim() ||
      rootStyles.getPropertyValue("--font-logo-raw").trim() ||
      rootStyles.getPropertyValue("--font-sans").trim() ||
      "ui-sans-serif"

    let width = 0
    let height = 0
    let cellW = 10
    let cellH = 16
    let rows = 0
    let columns = 0
    let mask: Float32Array | null = null
    let maskPeak = 1
    let raf = 0
    let last = 0
    let visible = true
    let start = 0

    /* Build a per-cell coverage mask by drawing the wordmark offscreen. */
    const buildMask = () => {
      const scale = 8
      const w = Math.max(1, columns * scale)
      const h = Math.max(1, rows * scale)
      const off = document.createElement("canvas")
      off.width = w
      off.height = h
      const octx = off.getContext("2d")
      if (!octx) return

      octx.fillStyle = "#ffffff"
      octx.textAlign = "center"
      octx.textBaseline = "middle"

      // Tracking keeps letterforms separated once reduced to character cells.
      ;(
        octx as CanvasRenderingContext2D & { letterSpacing?: string }
      ).letterSpacing = `${Math.round(h * 0.06)}px`

      octx.font = `700 ${Math.round(h * 0.9)}px ${family}, ui-sans-serif, sans-serif`

      // Measure at a known size, then scale so the glyphs span ~86% of the grid.
      const probeSize = Math.round(h * 0.9)
      let probeWidth = octx.measureText(text).width
      if (!Number.isFinite(probeWidth) || probeWidth < probeSize * 0.4) {
        probeWidth = probeSize * text.length * 0.55
      }
      const size = Math.max(
        8,
        Math.min(h * 1.6, (probeSize * (w * 0.93)) / probeWidth)
      )
      octx.font = `700 ${size}px ${family}, ui-sans-serif, sans-serif`
      octx.fillText(text, w / 2, h / 2)

      const pixels = octx.getImageData(0, 0, w, h).data
      const cells = new Float32Array(columns * rows)
      for (let y = 0; y < h; y++) {
        const rowOffset = Math.floor(y / scale) * columns
        for (let x = 0; x < w; x++) {
          const index = rowOffset + Math.floor(x / scale)
          const alpha = pixels[(y * w + x) * 4 + 3] ?? 0
          cells[index] = (cells[index] ?? 0) + alpha / 255
        }
      }
      const perCell = scale * scale
      let peak = 0
      for (const value of cells) {
        if (value > peak) peak = value
      }
      maskPeak = Math.max(peak / perCell, 0.001)
      // Normalise so stroke interiors reach full ink and edges fade out.
      mask = cells.map((value) => Math.min(1, value / perCell / maskPeak))
    }

    const layout = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = Math.max(1, rect.width)
      height = Math.max(1, rect.height)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Cell sizing.
      //
      // The wordmark derives its cell from the WIDTH so the text always fits
      // the box. The field derives it from the HEIGHT via a fixed row count:
      // that is what makes the ripple pattern hold the same scale relative to
      // the field on every viewport, instead of turning into fine speckle on a
      // narrow screen.
      let fontSize: number
      if (mode === "wordmark") {
        cellW = width / (cols ?? 62)
        fontSize = Math.max(7, cellW / 0.62)
        cellH = fontSize * 1.08
      } else {
        cellH = height / (rowCount ?? FIELD_ROWS)
        fontSize = Math.max(6, cellH / 1.08)
        cellW = fontSize * 0.62
      }

      columns = Math.max(8, Math.round(width / cellW))
      rows = Math.max(4, Math.floor(height / cellH))

      // The field's grid only stays in alignment if the glyphs are monospace,
      // so the variable's stack is followed by monospace fallbacks rather than
      // the hardcoded stack this used to be.
      ctx.font = `500 ${fontSize}px ${family}, ui-monospace, Menlo, monospace`
      ctx.textBaseline = "top"
      ctx.textAlign = "left"

      if (mode === "wordmark") buildMask()
    }

    type Cell = { x: number; y: number; char: string }
    const buckets: Cell[][] = levels.map(() => [])

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height)
      for (const bucket of buckets) bucket.length = 0

      const t = time * 0.001
      const scanY = ((t * 0.9) % (rows + 8)) - 4

      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          // Assigned in both branches below; declared without an initial value
          // so there is no dead write.
          let ink: number

          if (mode === "wordmark") {
            const raw = mask ? (mask[row * columns + column] ?? 0) : 0
            // Sharpen the glyph edge so letters stay legible at cell resolution.
            const sharpened = raw > 0.42 ? 1 : raw * 1.45
            const coverage = Math.min(1, sharpened)
            const shimmer =
              0.5 + 0.5 * Math.sin(column * 0.42 + row * 0.5 - t * 2.4)
            const scan = Math.max(0, 1 - Math.abs(row - scanY) / 3.2)
            ink = coverage * (0.62 + 0.38 * shimmer) + coverage * scan * 0.45

            if (coverage < 0.1) {
              const dust = Math.sin(column * 1.7 + row * 2.9 - t * 0.8)
              ink = dust > 0.958 ? 0.18 : 0
            }
          } else {
            // Concentric ripples expanding from each source. Distance is
            // measured in band-height units with the horizontal axis scaled by
            // the aspect ratio, so the rings stay circular rather than
            // stretching with the canvas. Taking the *nearest* source keeps
            // each ring system clean; the boundaries between systems fall
            // along the perpendicular bisectors.
            const px = column / columns
            const py = row / rows

            let nearest = Number.POSITIVE_INFINITY
            let sourcePhase = 0
            for (const source of RIPPLES) {
              const dx = (px - source.x) * (width / height)
              const dy = py - source.y
              const distance = Math.sqrt(dx * dx + dy * dy)
              if (distance < nearest) {
                nearest = distance
                sourcePhase = source.phase
              }
            }

            // Only the ridge of each ring gets ink, so the ripples read as
            // thin arcs of characters instead of filled discs.
            const ring = Math.sin(
              nearest * RIPPLE_FREQ - t * RIPPLE_SPEED * speed + sourcePhase
            )
            const ridge = 0.55
            ink = ring > ridge ? (ring - ridge) * 2 : 0
          }

          if (ink <= 0.03) continue

          const value = Math.min(1, ink)
          const level = Math.min(
            levels.length - 1,
            Math.floor(value * levels.length)
          )
          const index = Math.min(
            RAMP.length - 1,
            Math.max(1, Math.round(value * (RAMP.length - 1)))
          )
          buckets[level]?.push({
            x: column * cellW,
            y: row * cellH,
            char: RAMP.charAt(index) || "#",
          })
        }
      }

      for (let level = 0; level < buckets.length; level++) {
        const bucket = buckets[level]
        if (!bucket || bucket.length === 0) continue

        // Only the brightest ink gets a halo. Setting it once per bucket (not
        // per glyph) keeps the blur off the hot path — it applies to a single
        // fillStyle run rather than thousands of individual shadow states.
        const brightest = level === buckets.length - 1
        if (brightest && glowBlur > 0) {
          ctx.shadowColor = glowColor
          ctx.shadowBlur = glowBlur
        } else {
          ctx.shadowColor = "transparent"
          ctx.shadowBlur = 0
        }

        ctx.fillStyle = levels[level] ?? levels[0] ?? "#ffffff"
        for (const cell of bucket) ctx.fillText(cell.char, cell.x, cell.y)
      }

      // Never leave shadow state behind for the next frame.
      ctx.shadowBlur = 0
      ctx.shadowColor = "transparent"
    }

    const tick = (time: number) => {
      raf = window.requestAnimationFrame(tick)
      if (!visible || document.hidden) return
      if (time - last < 1000 / fps) return
      last = time
      draw(time - start)
    }

    layout()
    start = performance.now()

    if (reduce) {
      draw(0)
    } else {
      raf = window.requestAnimationFrame(tick)
    }

    const resizer = new ResizeObserver(() => {
      layout()
      if (reduce) draw(0)
    })
    resizer.observe(canvas)

    // Stop drawing entirely when the hero scrolls out of view.
    const watcher = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true
      },
      { rootMargin: "150px" }
    )
    watcher.observe(canvas)

    return () => {
      window.cancelAnimationFrame(raf)
      resizer.disconnect()
      watcher.disconnect()
    }
  }, [cols, fps, glowBlur, glowColor, levels, mode, rowCount, speed, text])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("pointer-events-none block h-full w-full", className)}
    />
  )
}
