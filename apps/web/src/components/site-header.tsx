import * as React from "react"
import { AsciiHero } from "@/components/ascii-hero"

const NAV = [
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
]

/** Long right arrow — the affordance carried by every menu row. */
function ArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  )
}

function ArrowUpRight({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="square"
      className={className}
      aria-hidden="true"
    >
      <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" />
    </svg>
  )
}

/**
 * Sticky header. Transparent at the top of the page, then gains a frosted black
 * background and a hairline border once the visitor scrolls.
 *
 * On mobile the links open a FULL-SCREEN panel rather than a dropdown: the
 * page's own dark band colour, the ASCII ripple field as texture, and each row
 * rising in on its own delay so the list assembles rather than appearing all at
 * once. Every row carries a right arrow that slides out and warms to the accent
 * on hover or tap.
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = React.useState(false)
  const [open, setOpen] = React.useState(false)

  const panelRef = React.useRef<HTMLDivElement>(null)
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll() // set the correct state on a restored scroll position
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Note: there is deliberately no "close when the viewport grows past the
  // breakpoint" effect here. The full-screen menu is available at every size,
  // so a resize is not a reason to dismiss it.

  /**
   * Restores scrolling *before* closing. The smooth-scroll handler for anchors
   * runs on a document-level listener that fires after this click handler, so a
   * still-locked body would make that scroll silently do nothing.
   */
  const closeMenu = React.useCallback(() => {
    document.body.style.overflow = ""
    setOpen(false)
  }, [])

  // Lock the page behind the panel, seed focus, and keep Tab inside the menu.
  React.useEffect(() => {
    if (!open) return

    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const focusables = () => {
      const inPanel = panelRef.current
        ? Array.from(
            panelRef.current.querySelectorAll<HTMLElement>(
              "a[href], button:not([disabled])"
            )
          )
        : []
      // The close button sits in the header, outside the panel, so add it
      // explicitly instead of trapping focus away from the only way out.
      return [buttonRef.current, ...inPanel].filter(
        (el): el is HTMLElement => el !== null
      )
    }

    focusables()[0]?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu()
        return
      }
      if (event.key !== "Tab") return

      const items = focusables()
      const first = items[0]
      const last = items[items.length - 1]
      if (!first || !last) return

      // Cycle within the menu rather than leaking focus to the page behind it.
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.overflow = previous
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open, closeMenu])

  return (
    <>
      <header
        className={`site-header fixed inset-x-0 top-0 z-50 ${
          scrolled ? "is-scrolled" : ""
        } ${open ? "is-menu-open" : ""}`}
      >
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5 sm:px-8">
          {/* Wordmark */}
          <a
            href="#top"
            className="text-[0.95rem] font-semibold tracking-[-0.02em]"
            aria-label="Gandalf — home"
          >
            GANDALF
          </a>

          {/* Desktop nav */}
          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-9">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="nav-link link-underline text-[0.8125rem] font-medium"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="header-cta hidden items-center gap-2 px-5 py-2.5 text-[0.8125rem] font-medium md:inline-flex"
            >
              Start a project
            </a>

            {/* Menu button — the two rules fold into a cross when open. */}
            <button
              ref={buttonRef}
              type="button"
              onClick={() => (open ? closeMenu() : setOpen(true))}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="menu-btn flex size-10 shrink-0 flex-col items-center justify-center gap-[5px]"
            >
              <span
                className={`block h-px w-4 bg-current transition-transform duration-300 ${
                  open ? "translate-y-[3px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-px w-4 bg-current transition-transform duration-300 ${
                  open ? "-translate-y-[3px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen menu — available at every viewport size, not just phones. */}
      {open && (
        <div
          id="site-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="menu-overlay fixed inset-0 z-40"
        >
          {/* The hero's ASCII field, reused as the panel's texture. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-60 [mask-image:radial-gradient(85%_70%_at_50%_35%,black,transparent_97%)]"
          >
            <AsciiHero mode="field" fps={10} speed={0.18} />
          </div>

          <div className="relative mx-auto flex h-full w-full min-w-0 max-w-[1200px] flex-col px-5 pt-24 pb-8 sm:px-8">
            <p className="font-mono text-[0.625rem] tracking-[0.24em] text-white/35 uppercase">
              [ Menu ]
            </p>

            <nav aria-label="Sections" className="mt-6 flex-1">
              <ul className="lg:flex lg:h-full lg:flex-col">
                {NAV.map((item, i) => (
                  <li key={item.href} className="lg:flex-1">
                    <a
                      href={item.href}
                      onClick={closeMenu}
                      style={
                        {
                          "--menu-delay": `${120 + i * 70}ms`,
                        } as React.CSSProperties
                      }
                      className="menu-item group flex h-full items-center justify-between gap-4 border-b border-white/10 py-5 lg:py-4"
                    >
                      <span className="text-[1.75rem] font-medium tracking-[-0.03em] text-white sm:text-[2.25rem] lg:text-[2.75rem]">
                        {item.label}
                      </span>
                      <ArrowRight className="menu-arrow size-6 shrink-0 text-white/35 lg:size-8" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div
              className="menu-item mt-8 lg:mt-10"
              style={
                {
                  "--menu-delay": `${120 + NAV.length * 70}ms`,
                } as React.CSSProperties
              }
            >
              {/* Side by side on desktop, stacked on a phone. */}
              <div className="lg:flex lg:items-center lg:justify-between lg:gap-10">
                <a
                  href="#contact"
                  onClick={closeMenu}
                  className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-ui)] border border-white bg-white px-6 py-4 text-sm font-medium text-[#101010] transition-colors duration-300 hover:bg-transparent hover:text-white lg:w-auto lg:px-9"
                >
                  Start a project
                  <ArrowUpRight className="size-4" />
                </a>

                <p className="mt-6 font-mono text-[0.625rem] tracking-[0.2em] text-white/30 uppercase lg:mt-0">
                  Gandalf · software &amp; infrastructure
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
