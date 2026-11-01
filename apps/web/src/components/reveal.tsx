import * as React from "react"

type RevealProps = {
  children: React.ReactNode
  /** Milliseconds to wait before this element animates. Use it to stagger. */
  delay?: number
  className?: string
  as?: "div" | "section" | "li" | "header" | "footer" | "article"
}

/**
 * Fades + lifts its children into view the first time they are scrolled to.
 *
 * Uses IntersectionObserver rather than a scroll listener: the browser does
 * the work off the main thread and the callback fires once, so there is no
 * per-frame cost. Once revealed we disconnect — this is a one-way entrance,
 * not a looping effect.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: RevealProps) {
  const ref = React.useRef<HTMLElement | null>(null)
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    const node = ref.current
    if (!node) return

    // Visitors who prefer reduced motion are handled entirely in CSS: the
    // `prefers-reduced-motion` block in site.css makes `.reveal` fully visible
    // and transition-free, so there is nothing to branch on here. Keeping it
    // out of JS also avoids a synchronous setState during the effect.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.disconnect()
          }
        }
      },
      // Start the animation slightly before the element reaches the viewport
      // edge so it has finished by the time it is properly in frame.
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`.trim()}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  )
}
