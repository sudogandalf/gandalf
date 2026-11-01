import * as React from "react"

/**
 * ASCII decode reveal.
 *
 * The text is resolved left-to-right out of a field of random ASCII glyphs —
 * the classic "terminal decoding" effect, which fits the site's character
 * theme better than a plain fade.
 *
 * Layout safety is the whole trick here. The real text is rendered first and
 * merely hidden (`visibility: hidden`), so it reserves the *exact* final
 * layout — including line wrapping. The animating copy is absolutely
 * positioned over that box, so the scramble can never reflow the page: no
 * content below the heading ever jumps, and the finished state is
 * pixel-identical to the reserved text.
 */

/** Glyphs used while a character is still unresolved. */
const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%*+=<>/\\_-.:"

type AsciiDecodeProps = {
  text: string
  className?: string
  /** Total reveal time in milliseconds. */
  duration?: number
  /** Milliseconds to wait after scrolling into view before starting. */
  delay?: number
  as?: "span" | "h1" | "h2" | "p"
}

/** Build a frame: characters before the cut-off are real, the rest are noise. */
function scramble(text: string, progress: number): string {
  const revealed = Math.floor(text.length * progress)
  let out = ""

  for (let i = 0; i < text.length; i++) {
    const char = text.charAt(i)

    // Keep whitespace intact so words stay in place while they resolve.
    if (char === " " || char === "\n") {
      out += char
    } else if (i < revealed) {
      out += char
    } else {
      out += CHARSET.charAt(Math.floor(Math.random() * CHARSET.length))
    }
  }

  return out
}

export function AsciiDecode({
  text,
  className = "",
  duration = 900,
  delay = 0,
  as: Tag = "span",
}: AsciiDecodeProps) {
  const ref = React.useRef<HTMLElement | null>(null)
  // Starts as the real text so the no-JS / pre-hydration render is correct.
  const [display, setDisplay] = React.useState(text)

  React.useEffect(() => {
    const node = ref.current
    if (!node) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let raf = 0
    let timer = 0
    let startedAt = 0
    let lastPaint = 0

    const step = (now: number) => {
      if (!startedAt) startedAt = now
      const progress = Math.min(1, (now - startedAt) / duration)

      // Repaint at roughly 22fps: fast enough to read as churn, cheap enough
      // that a screen full of headings stays smooth.
      if (now - lastPaint > 45 || progress >= 1) {
        lastPaint = now
        // Ease out so the text settles instead of stopping dead.
        setDisplay(scramble(text, 1 - Math.pow(1 - progress, 2)))
      }

      if (progress < 1) {
        raf = window.requestAnimationFrame(step)
      } else {
        setDisplay(text)
      }
    }

    // Note: the first `step` frame paints the scrambled state, so there is no
    // need to seed it synchronously here — and doing so would be a setState
    // during the effect. Every instance sits inside a Reveal/Rise that starts
    // transparent, so the pre-scramble frame is never visible.
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return
        observer.disconnect()
        timer = window.setTimeout(() => {
          raf = window.requestAnimationFrame(step)
        }, delay)
      },
      { threshold: 0.2, rootMargin: "0px 0px -5% 0px" }
    )

    observer.observe(node)

    return () => {
      observer.disconnect()
      window.cancelAnimationFrame(raf)
      window.clearTimeout(timer)
    }
  }, [delay, duration, text])

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={`ascii-decode ${className}`.trim()}
    >
      {/* Reserves the final layout; never visible itself. */}
      <span className="ascii-decode-base">{text}</span>
      {/* The animating copy, laid over the reserved box. */}
      <span aria-hidden="true" className="ascii-decode-live">
        {display}
      </span>
    </Tag>
  )
}
