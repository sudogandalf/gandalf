import { AsciiDecode } from "@/components/ascii-decode"
import { AsciiHero } from "@/components/ascii-hero"
import { AsciiArt } from "@/components/ascii-art"
import { GANDALF_ART } from "@/components/ascii-gandalf"
import { AsciiRail } from "@/components/ascii-rail"
import { useParallax } from "@/components/parallax"
import { Reveal } from "@/components/reveal"
import { useScrollZoom } from "@/components/scroll-zoom"
import { SiteHeader } from "@/components/site-header"
import { useSmoothAnchors } from "@/components/smooth-scroll"

/* -------------------------------------------------------------------------- */
/* Content                                                                    */
/* -------------------------------------------------------------------------- */

const BUILD_ITEMS = [
  "Websites & marketing sites",
  "Web applications",
  "APIs & integrations",
  "Design systems & component libraries",
]

const HOST_ITEMS = [
  "Domain registration & DNS",
  "SSL certificates",
  "Business email",
  "cPanel web hosting",
  "Backups & monitoring",
]

const PROCESS = [
  {
    n: "01",
    title: "Discover",
    body: "We map the goal, the audience and the systems it has to talk to. You get a written scope, not a vague estimate.",
  },
  {
    n: "02",
    title: "Design",
    body: "Structure and interface, prototyped early. You react to something real before production code is written.",
  },
  {
    n: "03",
    title: "Build",
    body: "Small increments you can review every week. Progress stays visible and nothing is a surprise at handover.",
  },
  {
    n: "04",
    title: "Launch & care",
    body: "DNS, SSL, email and hosting configured. Monitoring, backups and support continue after go-live.",
  },
]

const PRINCIPLES = [
  {
    title: "You own everything",
    body: "Domain, source code and hosting account stay in your name. No lock-in and no hostage situations.",
  },
  {
    title: "Clear scope, real dates",
    body: "A written scope and a schedule before work starts. Changes are quoted, never absorbed quietly.",
  },
  {
    title: "Support that answers",
    body: "The people who built the site are the people who respond when something needs attention.",
  },
]

const EMAIL = "hello@gandalf.dev"

/**
 * The wordmark, drawn rather than set. Generated from a fixed 5x5 grid so every
 * row is exactly the same width — block art typed by hand is how you end up
 * with a ragged T and a drifting N.
 */
const WORDMARK = [
  " ###     #    #   #  ####     #    #      #####",
  "#   #   # #   ##  #  #   #   # #   #      #    ",
  "#      #####  # # #  #   #  #####  #      #### ",
  "#  ##  #   #  #  ##  #   #  #   #  #      #    ",
  " ###   #   #  #   #  ####   #   #  #####  #    ",
].join("\n")

/* -------------------------------------------------------------------------- */
/* Small pieces                                                               */
/* -------------------------------------------------------------------------- */

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

/** Section label, wrapped in ASCII brackets to echo the terminal motif. */
function Eyebrow({ children }: { children: string }) {
  return (
    <p className="eyebrow flex items-center gap-2">
      <span aria-hidden="true" className="eyebrow-mark">
        [
      </span>
      <AsciiDecode text={children} />
      <span aria-hidden="true" className="eyebrow-mark">
        ]
      </span>
    </p>
  )
}

/**
 * Rises into place as soon as the page loads.
 *
 * Deliberately *not* the scroll-reveal used further down the page: the hero is
 * on screen at load, and on a short window its lower half can sit below the
 * fold. Keying the hero off scroll position would leave the headline invisible
 * until the visitor happened to scroll, so it animates on load instead.
 */
function Rise({
  children,
  delay = 0,
}: {
  children: React.ReactNode
  delay?: number
}) {
  return (
    <div
      className="hero-rise"
      style={{ "--rise-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  )
}

/**
 * ASCII section rule — a C-style comment stretched across the full width.
 *
 * The optional index is the section's place in the page, so the rules read as
 * numbered lines rather than as six identical dashes.
 *
 * The dash run is a long literal clipped by `overflow: hidden`, so the rule
 * always reaches the right edge without measuring anything in JS.
 */
function AsciiRule({ label, index }: { label?: string; index?: string }) {
  const head = [index, label].filter(Boolean).join(" ")

  return (
    <div aria-hidden="true" className="ascii-rule bleed pl-5 sm:pl-0">
      <span>{head ? `/* ${head} ` : "/* "}</span>
      <span className="ascii-rule-fill">{"-".repeat(400)}</span>
      <span>{" */"}</span>
    </div>
  )
}

/**
 * Ink for the ASCII field on the black sections below the hero. The hero runs
 * its palette at full strength; this one steps down through near-invisible
 * hairlines and lets only the ridge of each ripple pick up the accent, so the
 * texture reads as a background rather than as content.
 */
const SECTION_FIELD = {
  levels: [
    "rgba(255, 255, 255, 0.06)",
    "rgba(255, 255, 255, 0.11)",
    "rgba(255, 255, 255, 0.17)",
    // Only the ridge of each ripple picks up the accent.
    "rgba(96, 165, 250, 0.42)",
  ],
  glowColor: "rgba(96, 165, 250, 0.5)",
  glowBlur: 5,
}

/**
 * Neutral variant for the Principles section: the same ripples rendered in
 * nothing but white — no accent tint on the ridge and no halo.
 */
const GREY_FIELD = {
  levels: [
    "rgba(255, 255, 255, 0.07)",
    "rgba(255, 255, 255, 0.12)",
    "rgba(255, 255, 255, 0.17)",
    "rgba(255, 255, 255, 0.24)",
  ],
  glowColor: "transparent",
  glowBlur: 0,
}

/**
 * Blue motes drifting around Gandalf. Fixed positions rather than runtime
 * randomness, so the scatter stays reviewable and identical on every render —
 * and can be nudged deliberately instead of re-rolled until it looks right.
 */
const GANDALF_MOTES = [
  { top: "-5.4%", left: "22.3%", size: 2, delay: 0.64, duration: 7.17, dx: -5.7, dy: -9.6 },
  { top: "9.9%", left: "24.2%", size: 4, delay: 0.45, duration: 6.32, dx: 4.0, dy: -10.6 },
  { top: "18.5%", left: "55.8%", size: 2, delay: 4.17, duration: 6.03, dx: -1.8, dy: -9.7 },
  { top: "18.6%", left: "-4.7%", size: 4, delay: 2.82, duration: 8.04, dx: 10.0, dy: -9.2 },
  { top: "19.7%", left: "44.8%", size: 2, delay: 1.7, duration: 6.29, dx: -6.5, dy: -9.0 },
  { top: "23.3%", left: "79.8%", size: 3, delay: 4.85, duration: 9.47, dx: 7.1, dy: -11.7 },
  { top: "24.2%", left: "97.7%", size: 4, delay: 5.92, duration: 8.77, dx: -3.5, dy: -11.2 },
  { top: "25.6%", left: "70.5%", size: 3, delay: 0.47, duration: 5.77, dx: -6.4, dy: -12.7 },
  { top: "32.2%", left: "13.5%", size: 3, delay: 2.67, duration: 5.62, dx: -10.4, dy: -11.8 },
  { top: "48.0%", left: "73.0%", size: 2, delay: 3.25, duration: 8.04, dx: -9.1, dy: -6.4 },
  { top: "48.1%", left: "81.3%", size: 3, delay: 6.0, duration: 5.84, dx: 3.5, dy: -6.7 },
  { top: "51.0%", left: "8.1%", size: 3, delay: 6.56, duration: 8.42, dx: -4.7, dy: -6.2 },
  { top: "67.5%", left: "37.3%", size: 2, delay: 5.69, duration: 6.69, dx: 3.1, dy: -13.3 },
  { top: "76.7%", left: "90.7%", size: 3, delay: 3.59, duration: 8.27, dx: 0.4, dy: -12.4 },
  { top: "82.9%", left: "85.2%", size: 3, delay: 7.18, duration: 6.1, dx: -7.1, dy: -12.1 },
  { top: "87.6%", left: "51.7%", size: 3, delay: 5.79, duration: 7.63, dx: 6.1, dy: -11.4 },
  { top: "89.8%", left: "10.0%", size: 2, delay: 5.54, duration: 7.09, dx: 9.2, dy: -10.0 },
  { top: "91.1%", left: "5.6%", size: 2, delay: 5.18, duration: 7.56, dx: 2.6, dy: -8.6 },
]

/**
 * Gandalf, drawn in ASCII, with blue motes drifting around him.
 *
 * The art itself lives in its own module because it is a generated string
 * literal — see `components/ascii-gandalf.tsx`.
 */
function AsciiWizard() {
  return (
    <div className="gandalf-stage shrink-0 self-center lg:self-end">
      <span aria-hidden="true" className="gandalf-glow" />
      {GANDALF_MOTES.map((mote, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="gandalf-mote"
          style={
            {
              top: mote.top,
              left: mote.left,
              width: `${mote.size}px`,
              height: `${mote.size}px`,
              "--mote-delay": `${mote.delay}s`,
              "--mote-duration": `${mote.duration}s`,
              "--mote-dx": `${mote.dx}px`,
              "--mote-dy": `${mote.dy}px`,
            } as React.CSSProperties
          }
        />
      ))}
      <pre aria-hidden="true" className="ascii-wizard">
        {GANDALF_ART}
      </pre>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Sections                                                                   */
/* -------------------------------------------------------------------------- */

function Hero() {
  const zoomRef = useScrollZoom<HTMLDivElement>()

  return (
    <section id="top" ref={zoomRef} className="hero-band hero-scroll relative">
      <div className="hero-sticky sticky top-0 flex h-svh flex-col justify-end overflow-hidden pt-20 pb-10 sm:pt-24 sm:pb-14">
        {/* Ambient accent wash, furthest back. */}
        <div aria-hidden="true" className="hero-bloom bloom-blue" />
        <div aria-hidden="true" className="hero-bloom bloom-ice" />

        {/* Animated ASCII field: the hero's texture is made of characters.
            Masked to a soft ellipse so it fades out rather than ending abruptly.
            The ellipse is centred above the copy block on purpose — the type is
            bottom-anchored, so the field can be at full strength up top and fall
            away before it reaches the eyebrow. */}
        <div
          aria-hidden="true"
          className="hero-field absolute inset-0 [mask-image:radial-gradient(76%_58%_at_55%_28%,black,transparent_96%)]"
        >
          <AsciiHero mode="field" fps={14} />
        </div>

        <div aria-hidden="true" className="hero-scrim" />

        <div className="hero-copy relative mx-auto w-full min-w-0 max-w-[1200px] px-5 sm:px-8">
        <Rise>
          <p className="eyebrow flex items-center gap-3 text-white/80">
            <span aria-hidden="true" className="dot-glow size-1.5 rounded-full" />
            <AsciiDecode text="Gandalf · software & infrastructure" delay={120} />
          </p>
        </Rise>

        <Rise delay={90}>
          <h1 className="display mt-4 text-[clamp(2.9rem,12vw,8.5rem)] text-white">
            <AsciiDecode text="GANDALF" duration={1100} delay={200} />
          </h1>
        </Rise>

        <div className="mt-8 grid gap-7 border-t border-white/15 pt-7 sm:mt-10 sm:pt-9 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <Rise delay={190}>
            <h2 className="display text-[clamp(1.4rem,3.1vw,2.5rem)] text-white">
              <AsciiDecode text="We build the software." delay={320} />
              <br />
              <span className="text-white/50">
                <AsciiDecode text="We run the infrastructure." delay={430} />
              </span>
            </h2>
          </Rise>

          <Rise delay={290}>
            <div className="lg:pb-1">
              <p className="max-w-md text-[0.9375rem] leading-relaxed text-white/55">
                Gandalf designs and builds websites and applications, then keeps
                them online — domains, SSL, business email and cPanel hosting,
                all handled by the same team.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#contact"
                  className="btn-glow inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-ui)] border border-white bg-[var(--solid-bg)] px-7 py-3.5 text-sm font-medium text-[var(--solid-fg)] hover:bg-transparent hover:text-white sm:w-auto"
                >
                  Start a project
                  <ArrowUpRight className="size-4" />
                </a>
                <a
                  href="#services"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-ui)] border border-white/25 px-7 py-3.5 text-sm font-medium text-white transition-colors duration-300 hover:border-white sm:w-auto"
                >
                  Explore services
                </a>
              </div>

              {/* The strip ends with an ASCII hint that there is more below the
                  fold. Kept on this line so the hero stays exactly one
                  viewport tall. */}
              <p className="mt-6 flex items-center gap-3 text-[0.625rem] tracking-[0.22em] text-white/35 uppercase">
                <AsciiDecode
                  text="Websites & apps · Domains · SSL · Email · cPanel"
                  delay={620}
                />
                <span aria-hidden="true" className="scroll-cue">
                  ↓
                </span>
              </p>
            </div>
          </Rise>
        </div>
      </div>
      </div>
    </section>
  )
}

function Services() {
  const artRef = useParallax<HTMLDivElement>(0.1)

  return (
    <section
      id="services"
      className="flex min-h-svh flex-col justify-center py-20 sm:py-28 lg:py-32"
    >
      <div className="mx-auto w-full min-w-0 max-w-[1200px] px-5 sm:px-8">
        <AsciiRule index="01" label="services" />
        <div className="mt-12 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <Reveal>
            <div className="max-w-2xl">
              <Eyebrow>Services</Eyebrow>
              <h2 className="display mt-5 text-[clamp(2rem,4.6vw,3.5rem)]">
                <AsciiDecode text="One contract." />
                <br />
                <span className="text-[var(--body)]">
                  <AsciiDecode text="One point of contact." delay={120} />
                </span>
              </h2>
            </div>
          </Reveal>

          <Reveal delay={140}>
            <AsciiWizard />
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-x-16 gap-y-12 lg:grid-cols-2">
          <Reveal delay={80}>
            <div>
              <div className="bleed flex items-baseline justify-between border-b border-[var(--ink)] px-5 pb-3 sm:px-0">
                <h3 className="text-lg font-medium tracking-[-0.02em]">
                  We design and build
                </h3>
                <span className="font-mono text-[0.625rem] tracking-[0.2em] text-[var(--faint-dim)] uppercase">
                  Software
                </span>
              </div>
              <ul className="mt-2">
                {BUILD_ITEMS.map((item) => (
                  <li
                    key={item}
                    className="bleed flex items-baseline gap-4 border-b border-[var(--line-soft)] px-5 py-4 text-[0.95rem] text-[var(--ink-soft)] sm:px-0"
                  >
                    <span
                      aria-hidden="true"
                      className="shrink-0 font-mono text-[var(--faint-dim)]"
                    >
                      &gt;
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-[0.8125rem] leading-relaxed text-[var(--faint)]">
                Interfaces that stay legible, code that stays maintainable, and
                a deploy you can repeat without drama.
              </p>
            </div>
          </Reveal>

          <Reveal delay={180}>
            <div>
              <div className="bleed flex items-baseline justify-between border-b border-[var(--ink)] px-5 pb-3 sm:px-0">
                <h3 className="text-lg font-medium tracking-[-0.02em]">
                  We run and maintain
                </h3>
                <span className="font-mono text-[0.625rem] tracking-[0.2em] text-[var(--faint-dim)] uppercase">
                  Infrastructure
                </span>
              </div>
              <ul className="mt-2">
                {HOST_ITEMS.map((item) => (
                  <li
                    key={item}
                    className="bleed flex items-baseline gap-4 border-b border-[var(--line-soft)] px-5 py-4 text-[0.95rem] text-[var(--ink-soft)] sm:px-0"
                  >
                    <span
                      aria-hidden="true"
                      className="shrink-0 font-mono text-[var(--faint-dim)]"
                    >
                      &gt;
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-[0.8125rem] leading-relaxed text-[var(--faint)]">
                Everything registered in your name, renewals tracked, and a
                certificate that never surprises you at 3am.
              </p>
            </div>
          </Reveal>
        </div>

        {/* A live piece from the ASCII Magic library, redrawn in the site's own
            ink with `mono` so it sits inside the palette instead of importing
            its own. The caption carries the meaning; the art is decoration. */}
        <Reveal delay={220}>
          <div className="svc-art bleed mt-14" ref={artRef}>
            {/* Sits over the top of the constellation, which the mask has
                already faded to black there, so the word needs no scrim. It
                lives outside .svc-art-stage so the mask can't fade it too. */}
            <span aria-hidden="true" className="svc-art-word">
              GANDALF
            </span>
            <div className="svc-art-stage">
              <AsciiArt
                piece="lorenz-attractor"
                sizes={{ base: 7, sm: 11, md: 13, lg: 18, xl: 22 }}
                speed={0.8}
                label="An animated Lorenz attractor traced in characters"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Process() {
  return (
    <section
      id="process"
      className="flex min-h-svh flex-col justify-center py-20 sm:py-28 lg:py-32"
    >
      <div className="mx-auto w-full min-w-0 max-w-[1200px] px-5 sm:px-8">
        <AsciiRule index="02" label="process" />
        <Reveal>
          <div className="mt-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-xl">
              <Eyebrow>Process</Eyebrow>
              <h2 className="display mt-5 text-[clamp(2rem,4.6vw,3.5rem)]">
                <AsciiDecode text="How the work happens." />
              </h2>
            </div>
            <p className="max-w-xs text-[0.8125rem] leading-relaxed text-[var(--faint)]">
              Four stages, each with something concrete to show for it. You
              always know where the project stands.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-px border-t border-[var(--line)] sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((step, i) => (
            <Reveal key={step.n} delay={i * 90}>
              {/* Padding-right has to clear the paragraph's 26ch measure cap
                  (~241px) before it has any effect on wider columns. */}
              <div className="bleed h-full border-b border-[var(--line)] py-8 pl-5 pr-8 sm:border-r sm:pl-0 sm:pr-12">
                <span className="font-mono text-[0.6875rem] tracking-[0.2em] text-[var(--faint-dim)]">
                  [{step.n}]
                  {/* The stages read as a pipeline. A plain ASCII arrowhead,
                      not U+25B6 — that glyph is the media play button and
                      reads as a video control on a site built from text. */}
                  {i < PROCESS.length - 1 && (
                    <span aria-hidden="true" className="step-flow hidden sm:inline">
                      {" -->"}
                    </span>
                  )}
                </span>
                <h3 className="mt-5 text-[1.15rem] font-medium tracking-[-0.02em]">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-[26ch] text-[0.875rem] leading-relaxed text-[var(--muted)]">
                  {step.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Principles() {
  return (
    <section className="relative flex min-h-svh flex-col justify-center overflow-hidden bg-[var(--surface)]">
      {/* The same ripple drawing as the hero, in nothing but light grey here. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-80 [mask-image:radial-gradient(75%_65%_at_50%_45%,black,transparent_95%)]"
      >
        {/* Drifts at a quarter of the base rate — barely moving, on purpose. */}
        <AsciiHero mode="field" fps={10} speed={0.25} {...GREY_FIELD} />
      </div>

      <div className="relative mx-auto w-full min-w-0 max-w-[1200px] px-5 py-20 sm:px-8 sm:py-28 lg:py-32">
        <AsciiRule index="03" label="principles" />
        <Reveal>
          <h2 className="display mt-12 max-w-4xl text-[clamp(1.9rem,4.4vw,3.25rem)]">
            <AsciiDecode text="One team, from the first commit to the renewal date." />
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8">
          {PRINCIPLES.map((item, i) => (
            <Reveal key={item.title} delay={i * 100}>
              <div className="bleed border-t border-[var(--ink)] px-5 pt-5 sm:px-0">
                <h3 className="text-[1.05rem] font-medium tracking-[-0.02em]">
                  {item.title}
                </h3>
                <p className="mt-3 text-[0.875rem] leading-relaxed text-[var(--muted)]">
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section
      id="contact"
      className="relative flex min-h-svh flex-col justify-center overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-50 [mask-image:radial-gradient(65%_60%_at_78%_34%,black,transparent_92%)]"
      >
        <AsciiHero mode="field" fps={10} {...SECTION_FIELD} />
      </div>

      <div className="relative mx-auto w-full min-w-0 max-w-[1200px] px-5 py-20 sm:px-8 sm:py-28 lg:py-32">
        <AsciiRule index="04" label="contact" />
        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <Reveal>
            <div>
              <Eyebrow>Contact</Eyebrow>
              <h2 className="display mt-5 text-[clamp(2.1rem,5.2vw,4rem)]">
                <AsciiDecode text="Tell us what you're building." />
              </h2>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="lg:pb-2">
              <p className="max-w-md text-[0.95rem] leading-relaxed text-[var(--body)]">
                Send a short description — what it does, who it&apos;s for and
                roughly when you need it. We&apos;ll reply with the next step,
                usually within one business day.
              </p>

              <a
                href={`mailto:${EMAIL}`}
                className="group mt-8 inline-flex items-baseline gap-3 text-[clamp(1.15rem,2.6vw,1.6rem)] font-medium tracking-[-0.03em]"
              >
                {/* Reads as a shell prompt, so the address line scans as a
                    command rather than as decoration. */}
                <span
                  aria-hidden="true"
                  className="font-mono text-[0.9rem] text-[var(--faint-dim)]"
                >
                  $
                </span>
                <span className="link-underline">
                  <AsciiDecode text={EMAIL} delay={120} />
                </span>
                <ArrowUpRight className="size-4 shrink-0 text-[var(--faint-dim)] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--ink)]" />
              </a>

              <p className="mt-6 text-[0.75rem] tracking-[0.14em] text-[var(--faint-dim)] uppercase">
                Already hosted elsewhere? We can migrate it.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer>
      <div className="mx-auto w-full min-w-0 max-w-[1200px] px-5 py-12 sm:px-8 sm:py-14">
        <AsciiRule index="05" label="gandalf" />
        <div className="mt-12 flex flex-col justify-between gap-10 sm:flex-row">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 text-[0.95rem] font-semibold tracking-[-0.02em]">
              <span aria-hidden="true" className="inline-block size-2.5 bg-[var(--ink)]" />
              <span>GANDALF</span>
            </div>
            <p className="mt-4 text-[0.8125rem] leading-relaxed text-[var(--faint)]">
              Software development, domains, SSL, business email and cPanel
              hosting.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-8 sm:gap-x-20">
            <div>
              <p className="text-[0.625rem] tracking-[0.2em] text-[var(--faint-dim)] uppercase">
                Services
              </p>
              <ul className="mt-4 space-y-2.5 text-[0.8125rem] text-[var(--body)]">
                <li>Websites &amp; apps</li>
                <li>Domains</li>
                <li>SSL certificates</li>
                <li>Email &amp; hosting</li>
              </ul>
            </div>
            <div>
              <p className="text-[0.625rem] tracking-[0.2em] text-[var(--faint-dim)] uppercase">
                Company
              </p>
              <ul className="mt-4 space-y-2.5 text-[0.8125rem] text-[var(--body)]">
                <li>
                  <a href="#process" className="link-underline">
                    Process
                  </a>
                </li>
                <li>
                  <a href="#services" className="link-underline">
                    Services
                  </a>
                </li>
                <li>
                  <a href="#contact" className="link-underline">
                    Contact
                  </a>
                </li>
                <li>
                  <a href={`mailto:${EMAIL}`} className="link-underline">
                    Email us
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* The wordmark drawn rather than set, above a terminal cursor blinking
            after the sign-off line. */}
        <div className="bleed mt-12 border-t border-[var(--line-soft)] px-5 pt-8 sm:px-0">
          <pre aria-hidden="true" className="ascii-wordmark">
            {WORDMARK}
          </pre>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-2 text-[0.6875rem] tracking-[0.12em] text-[var(--faint-dim)] uppercase">
              © {year} Gandalf. All rights reserved.
              <span aria-hidden="true" className="cursor-block" />
            </p>
            <a
              href="#top"
              className="link-underline text-[0.6875rem] tracking-[0.12em] text-[var(--faint-dim)] uppercase"
            >
              Back to top
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* -------------------------------------------------------------------------- */

export function App() {
  // Anchor clicks are scrolled in JS so the duration is capped and headings
  // clear the sticky header.
  useSmoothAnchors()

  return (
    <div className="min-h-svh bg-[var(--surface)] text-[var(--ink)] antialiased">
      <SiteHeader />
      <AsciiRail />
      <main>
        <Hero />
        <Services />
        <Process />
        <Principles />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
