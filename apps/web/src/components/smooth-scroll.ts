import * as React from "react"

/**
 * Smooth in-page anchor scrolling.
 *
 * Native `scroll-behavior: smooth` hands the duration to the browser, which
 * makes long jumps (footer back to the top) crawl for several seconds and
 * short ones feel sluggish. This drives the scroll itself instead:
 *
 *   - duration scales with distance but is capped, so a long jump stays brisk
 *   - the sticky header's height is subtracted so headings never land under it
 *   - the hash is still pushed, so deep links and the back button work
 *   - `prefers-reduced-motion` falls back to an instant jump
 *
 * CSS `scroll-behavior` is set to `auto` alongside this, otherwise the browser
 * would animate the same scroll a second time and fight the rAF loop.
 */

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

export function useSmoothAnchors() {
  React.useEffect(() => {
    let raf = 0

    const onClick = (event: MouseEvent) => {
      // Leave modified clicks and non-primary buttons to the browser.
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const target = event.target as HTMLElement | null
      const anchor = target?.closest?.('a[href^="#"]') as HTMLAnchorElement | null
      if (!anchor) return

      const href = anchor.getAttribute("href")
      if (!href || href === "#") return

      const destination = document.getElementById(href.slice(1))
      if (!destination) return

      event.preventDefault()

      const header = document.querySelector(".site-header")
      const offset = header ? header.getBoundingClientRect().height : 0

      const start = window.scrollY
      const end = destination.getBoundingClientRect().top + start - offset

      const commit = () => window.history.pushState(null, "", href)

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        window.scrollTo(0, end)
        commit()
        return
      }

      const distance = end - start
      if (Math.abs(distance) < 2) {
        commit()
        return
      }

      // Roughly 0.5ms per pixel, clamped so nothing drags or snaps.
      const duration = Math.min(1100, Math.max(420, Math.abs(distance) * 0.5))
      const startedAt = performance.now()

      window.cancelAnimationFrame(raf)

      const step = (now: number) => {
        const progress = Math.min(1, (now - startedAt) / duration)
        window.scrollTo(0, start + distance * easeOutCubic(progress))
        if (progress < 1) {
          raf = window.requestAnimationFrame(step)
        } else {
          commit()
        }
      }

      raf = window.requestAnimationFrame(step)
    }

    document.addEventListener("click", onClick)

    return () => {
      document.removeEventListener("click", onClick)
      window.cancelAnimationFrame(raf)
    }
  }, [])
}
