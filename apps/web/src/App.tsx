import * as React from "react"
import gandalfArt from "@/assets/gandalf.png"
import { AsciiArt } from "@/components/ascii-art"
import { AsciiDecode } from "@/components/ascii-decode"
import { AsciiHero } from "@/components/ascii-hero"
import { Reveal } from "@/components/reveal"
import { SiteHeader } from "@/components/site-header"
import { useSmoothAnchors } from "@/components/smooth-scroll"

/* -------------------------------------------------------------------------- */
/* Content                                                                    */
/* -------------------------------------------------------------------------- */

const EMAIL = "hello@gandalf.dev"
const PROJECT_MAIL = `mailto:${EMAIL}?subject=${encodeURIComponent("New project")}`

type ListItem = { label: string; tag: string }

const BUILD_ITEMS: ListItem[] = [
  { label: "Websites & marketing sites", tag: "web" },
  { label: "Web applications", tag: "app" },
  { label: "APIs & integrations", tag: "api" },
  { label: "Design systems & component libraries", tag: "ui" },
]

const RUN_ITEMS: ListItem[] = [
  { label: "Domain registration & DNS", tag: "dns" },
  { label: "SSL certificates", tag: "tls" },
  { label: "Business email", tag: "mx" },
  { label: "cPanel web hosting", tag: "cpanel" },
  { label: "Backups & monitoring", tag: "ops" },
]

/**
 * The process. The durations are sample content — the brief gives no timings —
 * and are listed for the client to confirm.
 */
const PROCESS = [
  {
    stage: "Discover",
    when: "week 1",
    takes: "2–3 days",
    outcome: "A written scope: the goal, the audience and the systems it has to talk to.",
  },
  {
    stage: "Design",
    when: "week 1",
    takes: "4–5 days",
    outcome: "Structure and interface, prototyped early, so you react to something real.",
  },
  {
    stage: "Build",
    when: "weeks 2–6",
    takes: "3–5 weeks",
    outcome: "Weekly increments you can review. Nothing is a surprise at handover.",
  },
  {
    stage: "Launch & care",
    when: "after launch",
    takes: "ongoing",
    outcome: "DNS, SSL, email and hosting configured; monitoring, backups and support.",
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

const INFO_FACTS: { key: string; value: React.ReactNode }[] = [
  { key: "type", value: "Software studio" },
  { key: "builds", value: "Websites, web apps, APIs" },
  { key: "runs", value: "Domains, DNS, SSL, email, cPanel hosting" },
  { key: "contract", value: "One, end to end" },
  { key: "ownership", value: "Everything in your name" },
  { key: "replies", value: "Usually within one business day" },
  { key: "email", value: <a href={`mailto:${EMAIL}`}>{EMAIL}</a> },
]

/** The contents tree, drawn with box characters. */
const TOC = [
  { id: "overview", label: "overview", branch: "├── " },
  { id: "services", label: "services", branch: "├── " },
  { id: "build", label: "build", branch: "│   ├── " },
  { id: "run", label: "run", branch: "│   └── " },
  { id: "process", label: "process", branch: "├── " },
  { id: "principles", label: "principles", branch: "├── " },
  { id: "contact", label: "contact", branch: "└── " },
]

/**
 * The wordmark, drawn rather than set: a fixed 5×5 grid per letter, so every
 * row is exactly the same width and no column drifts.
 */
const WORDMARK = [
  " ###     #    #   #  ####     #    #      #####",
  "#   #   # #   ##  #  #   #   # #   #      #    ",
  "#      #####  # # #  #   #  #####  #      #### ",
  "#  ##  #   #  #  ##  #   #  #   #  #      #    ",
  " ###   #   #  #   #  ####   #   #  #####  #    ",
].join("\n")

/** Motes around Gandalf — fixed positions, so the scatter is reviewable. */
const GANDALF_MOTES = [
  { top: "-4%", left: "22%", size: 2, delay: 0.64, duration: 7.17, dx: -5.7, dy: -9.6 },
  { top: "10%", left: "84%", size: 3, delay: 0.45, duration: 6.32, dx: 4.0, dy: -10.6 },
  { top: "19%", left: "-6%", size: 3, delay: 2.82, duration: 8.04, dx: 9.0, dy: -9.2 },
  { top: "34%", left: "98%", size: 2, delay: 5.92, duration: 8.77, dx: -3.5, dy: -11.2 },
  { top: "48%", left: "6%", size: 2, delay: 3.25, duration: 8.04, dx: -6.1, dy: -6.4 },
  { top: "62%", left: "92%", size: 3, delay: 6.0, duration: 5.84, dx: 3.5, dy: -6.7 },
  { top: "78%", left: "2%", size: 2, delay: 5.69, duration: 6.69, dx: 3.1, dy: -13.3 },
  { top: "88%", left: "70%", size: 2, delay: 3.59, duration: 8.27, dx: 0.4, dy: -12.4 },
]

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

/** A heading with a permalink, the way a wiki sets every section title. */
function Heading({
  id,
  level,
  children,
}: {
  id: string
  level: 2 | 3
  children: string
}) {
  const Tag = level === 2 ? "h2" : "h3"
  return (
    <Tag id={id} className={level === 2 ? "wiki-h2" : "wiki-h3"}>
      {children}
      <a href={`#${id}`} className="anchor" aria-label={`Link to ${children}`}>
        #
      </a>
    </Tag>
  )
}

function List({ items }: { items: ListItem[] }) {
  return (
    <ul className="list">
      {items.map((item) => (
        <li key={item.label}>
          <span aria-hidden="true" className="list-mark">
            &gt;
          </span>
          {item.label}
          <span aria-hidden="true" className="list-tag">
            {item.tag}
          </span>
        </li>
      ))}
    </ul>
  )
}

/**
 * Tracks which section the reader is in: the last heading whose top has passed
 * a line just under the header. A passive, rAF-throttled scroll read — no
 * layout writes, one measurement pass per frame at most.
 */
function useActiveSection(ids: string[]) {
  const [active, setActive] = React.useState(ids[0])

  React.useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const line = 120
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= line) current = id
      }
      // The last section is too short to scroll its heading up to the line,
      // so reaching the bottom of the page selects it.
      const doc = document.documentElement
      if (window.scrollY + window.innerHeight >= doc.scrollHeight - 4) {
        current = ids[ids.length - 1]
      }
      setActive(current)
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
  }, [ids])

  return active
}

const TOC_IDS = TOC.map((item) => item.id)

function TocTree({ active }: { active: string }) {
  return (
    <ul className="toc-list">
      <li>
        <a href="#top">
          <span>gandalf/</span>
        </a>
      </li>
      {TOC.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            aria-current={active === item.id ? "true" : undefined}
          >
            <span aria-hidden="true" className="toc-branch">
              {item.branch}
            </span>
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  )
}

function Contents() {
  const active = useActiveSection(TOC_IDS)

  return (
    <aside className="wiki-toc">
      <nav aria-label="Contents" className="toc-side">
        <p className="toc-title mono">contents</p>
        <TocTree active={active} />
      </nav>
      <details className="toc-mobile">
        <summary>contents</summary>
        <nav aria-label="Contents">
          <TocTree active={active} />
        </nav>
      </details>
    </aside>
  )
}

function GandalfFigure() {
  return (
    <div className="gandalf-stage">
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
      <img
        src={gandalfArt}
        alt="Gandalf, drawn entirely in ASCII characters"
        width={440}
        height={538}
        className="gandalf-art"
      />
    </div>
  )
}

function Infobox() {
  return (
    <aside className="wiki-info" aria-label="Gandalf at a glance">
      <div className="infobox">
        <div className="infobox-title mono">
          <span>gandalf</span>
          <span>infobox</span>
        </div>
        <figure className="infobox-figure">
          <GandalfFigure />
          <figcaption className="mono">gandalf, drawn in characters</figcaption>
        </figure>
        <dl className="infobox-facts">
          {INFO_FACTS.map((fact) => (
            <div key={fact.key}>
              <dt>{fact.key}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
        <div className="infobox-action">
          <a href={PROJECT_MAIL} className="btn btn-block">
            Start a project
            <ArrowUpRight className="size-4" />
          </a>
        </div>
      </div>
    </aside>
  )
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

function Cover() {
  return (
    <div id="top" className="cover">
      <div aria-hidden="true" className="absolute inset-0">
        <AsciiHero mode="field" fps={12} speed={0.6} />
      </div>
      <p aria-hidden="true" className="cover-path mono">
        ~/gandalf/wiki
      </p>
    </div>
  )
}

function ArticleHead() {
  return (
    <header id="overview" className="wiki-head">
      <p className="crumbs mono">
        <span>gandalf</span>
        <span aria-hidden="true">/</span>
        <span>studio</span>
        <span aria-hidden="true">/</span>
        <span>overview</span>
      </p>
      <h1 className="wiki-title">
        <AsciiDecode text="Gandalf" duration={900} delay={150} />
      </h1>
      <ul className="wiki-meta mono">
        <li>software studio</li>
        <li>websites &amp; applications</li>
        <li>domains &amp; hosting</li>
      </ul>
      <p className="wiki-lede">
        <strong>Gandalf</strong> is a software studio that designs and builds
        websites and applications, then keeps them online. Domains, SSL
        certificates, business email and cPanel hosting are handled by the same
        team, under one contract and one point of contact.
      </p>
    </header>
  )
}

function ArticleBody() {
  const [lead, ...rest] = PRINCIPLES

  return (
    <article className="wiki-body prose">
      <section className="wiki-section" aria-labelledby="services">
        <Heading id="services" level={2}>
          Services
        </Heading>
        <p>
          The work splits into two halves: building the software, and running
          the infrastructure underneath it. Both sit under the same contract, so
          the people who wrote the code are the people who renew the
          certificate.
        </p>

        <Heading id="build" level={3}>
          Build
        </Heading>
        <List items={BUILD_ITEMS} />
        <p className="note">
          Interfaces that stay legible, code that stays maintainable, and a
          deploy you can repeat without drama.
        </p>

        <Heading id="run" level={3}>
          Run
        </Heading>
        <List items={RUN_ITEMS} />
        <p className="note">
          Everything registered in your name, renewals tracked, and a
          certificate that never surprises you at 3am.
        </p>

        <Reveal>
          <figure className="fig">
            <div className="fig-art">
              <span aria-hidden="true" className="fig-word">
                GANDALF
              </span>
              <div className="fig-stage">
                <AsciiArt
                  piece="lorenz-attractor"
                  mono
                  sizes={{ base: 6, sm: 9, md: 10, lg: 11, xl: 12 }}
                  speed={0.7}
                  label="An animated Lorenz attractor traced in characters"
                />
              </div>
            </div>
            <figcaption className="mono">
              <b>fig. 1</b> — a lorenz attractor, traced live in ascii
              characters: structure rendered as text.
            </figcaption>
          </figure>
        </Reveal>
      </section>

      <section className="wiki-section" aria-labelledby="process">
        <Heading id="process" level={2}>
          Process
        </Heading>
        <p>
          Four stages, each with something concrete to show for it, so you
          always know where the project stands.
        </p>
        <Reveal>
          <div className="table-wrap">
            <table className="wiki-table">
              <thead>
                <tr>
                  <th scope="col">stage</th>
                  <th scope="col">when</th>
                  <th scope="col">duration</th>
                  <th scope="col">what you get</th>
                </tr>
              </thead>
              <tbody>
                {PROCESS.map((row) => (
                  <tr key={row.stage}>
                    <th scope="row">{row.stage}</th>
                    <td className="when">{row.when}</td>
                    <td className="num">{row.takes}</td>
                    <td>{row.outcome}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row">total</th>
                  <td />
                  <td className="num">4–8 weeks</td>
                  <td>A live site, monitored and backed up.</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Reveal>
      </section>

      <section className="wiki-section" aria-labelledby="principles">
        <Heading id="principles" level={2}>
          Principles
        </Heading>
        <p>One team, from the first commit to the renewal date.</p>
        <dl className="defs">
          {[lead, ...rest].map((item) => (
            <div key={item.title}>
              <dt>{item.title}</dt>
              <dd>{item.body}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="wiki-section" aria-labelledby="contact">
        <Heading id="contact" level={2}>
          Contact
        </Heading>
        <p>
          Tell us what you're building — what it does, who it's for and roughly
          when. If it's hosted somewhere else already, we can migrate it.
        </p>
        <a href={PROJECT_MAIL} className="contact-mail">
          <span className="contact-addr">{EMAIL}</span>
          <span aria-hidden="true" className="caret" />
        </a>
        <p className="note">Usually answered within one business day.</p>
      </section>
    </article>
  )
}

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <pre aria-hidden="true" className="ascii-wordmark">
          {WORDMARK}
        </pre>
        <div className="footer-base">
          <p>
            © {year} gandalf
            <span aria-hidden="true" className="cursor-block" />
          </p>
          <nav aria-label="Footer" className="footer-links">
            <a href="#services">
              <span className="link-underline">services</span>
            </a>
            <a href="#process">
              <span className="link-underline">process</span>
            </a>
            <a href="#contact">
              <span className="link-underline">contact</span>
            </a>
            <a href="#top">
              <span className="link-underline">top</span>
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export function App() {
  useSmoothAnchors()

  return (
    <div className="min-h-svh bg-[var(--surface)] antialiased">
      <SiteHeader />
      <Cover />
      <main className="wiki">
        <Contents />
        <ArticleHead />
        <Infobox />
        <ArticleBody />
      </main>
      <Footer />
    </div>
  )
}
