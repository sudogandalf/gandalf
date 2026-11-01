import * as React from "react"

/**
 * Scroll-zoom hero.
 *
 * The structure this drives is a tall section with a viewport-height sticky
 * panel inside it: the panel stays put while you scroll through the extra
 * height, so the scroll distance becomes a timeline rather than a journey. This
 * hook turns that timeline into five custom properties, and CSS does the rest.
 *
 * Modelled on the Motion "scroll zoom hero" recipe — scale up, blur, fade —
 * but written by hand and writing CSS variables rather than animating React
 * state. That keeps the whole effect on the compositor: `transform`, `opacity`
 * and `filter` are the only things that change, so nothing re-renders and
 * nothing triggers layout while the user scrolls.
 *
 * The tuning knobs are here, together, because these are what get asked for:
 * "more zoom", "less blur", "faster".
 */

/** Extra scale reached at the end of the hero. 0.85 means 1 → 1.85. */
const ZOOM_GAIN = 0.85

/** Blur in px reached at the end. Deliberately small — a full-screen `filter`
 *  is a per-frame raster pass, unlike the transform, and this hero already
 *  runs a canvas underneath it. */
const BLUR_GAIN = 5

/** How far the copy lifts out of frame, in px. */
const LIFT_GAIN = 96

export function useScrollZoom<T extends HTMLElement>() {
  const ref = React.useRef<T | null>(null)

  React.useEffect(() => {
    const node = ref.current
    if (!node) return
    // No timeline means no effect: bail before attaching anything, and let CSS
    // collapse the section back to one viewport.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let frame = 0

    const update = () => {
      frame = 0
      const rect = node.getBoundingClientRect()
      const travel = rect.height - window.innerHeight
      if (travel <= 0) return

      // 0 at the top of the hero, 1 when its extra height is used up. Clamped,
      // so a fast flick past the section cannot overshoot the values.
      const p = Math.min(1, Math.max(0, -rect.top / travel))
      const eased = p * p * (3 - 2 * p) // smoothstep: soft in, soft out

      node.style.setProperty("--hero-zoom", (1 + eased * ZOOM_GAIN).toFixed(4))
      node.style.setProperty("--hero-blur", (eased * BLUR_GAIN).toFixed(2) + "px")
      // The field holds its brightness for the first half, then goes; the copy
      // starts leaving immediately, so the two do not vanish in lockstep.
      node.style.setProperty(
        "--hero-field-opacity",
        Math.max(0, 1 - Math.max(0, (p - 0.35) / 0.65)).toFixed(4)
      )
      node.style.setProperty(
        "--hero-copy-opacity",
        Math.max(0, 1 - Math.max(0, (p - 0.1) / 0.6)).toFixed(4)
      )
      node.style.setProperty(
        "--hero-lift",
        (-eased * LIFT_GAIN).toFixed(1) + "px"
      )
    }

    const onScroll = () => {
      // One write per frame however fast the wheel spins.
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  return ref
}
