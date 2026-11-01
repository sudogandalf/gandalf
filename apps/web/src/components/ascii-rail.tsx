import * as React from "react"

/** Number of glyphs in the rail — also its resolution. */
const TICKS = 28

/**
 * A scroll-progress rail drawn in box-drawing characters.
 *
 * Deliberately driven by real scroll position rather than a CSS transition, so
 * it stays truthful when the page is resized, when content reflows, and when
 * the visitor lands mid-page from an anchor.
 *
 * `passive` matters here: the listener never calls preventDefault, so the
 * browser is free to scroll without waiting on this handler. The rAF guard
 * keeps it to at most one paint per frame however fast the wheel spins.
 */
export function AsciiRail() {
  const ref = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    const node = ref.current
    if (!node) return

    const ticks = Array.from(
      node.querySelectorAll<HTMLElement>("[data-tick]")
    )

    let frame = 0

    const update = () => {
      frame = 0
      const doc = document.documentElement
      const travel = doc.scrollHeight - window.innerHeight
      const progress =
        travel > 0 ? Math.min(1, Math.max(0, window.scrollY / travel)) : 0

      // Which glyph the reading currently sits on. Floor rather than round, so
      // the marker reaches the last tick only once the page is truly at the
      // bottom.
      const at = Math.min(TICKS - 1, Math.floor(progress * TICKS))

      for (let i = 0; i < ticks.length; i += 1) {
        ticks[i].dataset.state = i < at ? "done" : i === at ? "at" : "todo"
      }
    }

    const onScroll = () => {
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

  return (
    <div ref={ref} aria-hidden="true" className="ascii-rail">
      {Array.from({ length: TICKS }, (_, i) => (
        <span key={i} data-tick data-state="todo" />
      ))}
    </div>
  )
}
