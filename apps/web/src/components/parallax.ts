import * as React from "react"

/**
 * Returns a ref that drifts its element as the page scrolls.
 *
 * The movement is tied to how far the element sits from the centre of the
 * viewport, so it settles to zero when centred and grows as it leaves —
 * which reads as depth rather than as the whole page sliding. It writes a
 * `--parallax` custom property and leaves the transform to CSS, so the work
 * stays on the compositor instead of triggering layout.
 *
 * Bails out entirely under `prefers-reduced-motion`, before any listener is
 * attached. A transform-only effect can still cause trouble for motion
 * sensitivity, and there is nothing here worth arguing about.
 */
export function useParallax<T extends HTMLElement>(strength = 0.12) {
  const ref = React.useRef<T | null>(null)

  React.useEffect(() => {
    const node = ref.current
    if (!node) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let frame = 0

    const update = () => {
      frame = 0
      const rect = node.getBoundingClientRect()
      const fromCentre = rect.top + rect.height / 2 - window.innerHeight / 2
      node.style.setProperty(
        "--parallax",
        `${(-fromCentre * strength).toFixed(1)}px`
      )
    }

    const onScroll = () => {
      // One write per frame however fast the wheel spins, matching the rail.
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
  }, [strength])

  return ref
}
