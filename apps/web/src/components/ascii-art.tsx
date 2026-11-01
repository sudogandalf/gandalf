import * as React from "react"

/** Font size in px per breakpoint, smallest first. `base` is required. */
export type ArtSizes = {
  base: number
  sm?: number
  md?: number
  lg?: number
  xl?: number
}

type AsciiArtProps = {
  /** Piece slug from the animated ASCII library, e.g. "dns-resolver-chain". */
  piece: string
  /**
   * Font size in px at each breakpoint. A piece is a FIXED grid of columns —
   * most of the library is 80 to 100 wide — so the only lever on its footprint
   * is the type size. Sizing per breakpoint is what lets a piece fill its
   * container at every width instead of overflowing a phone or floating small
   * in a desktop column.
   */
  sizes?: ArtSizes
  /** Playback speed, 1 is normal. */
  speed?: number
  /** Redraw the piece in one colour — the element's own CSS `color`. */
  mono?: boolean
  /** Redraw the shading in another character set, e.g. "ascii", "dots". */
  look?: string
  className?: string
  /** Screen-reader label. The art is decoration; keep real text beside it. */
  label?: string
}

/** Widest first, so the first match wins. */
const BREAKPOINTS: { key: "sm" | "md" | "lg" | "xl"; query: string }[] = [
  { key: "xl", query: "(min-width: 1280px)" },
  { key: "lg", query: "(min-width: 1024px)" },
  { key: "md", query: "(min-width: 768px)" },
  { key: "sm", query: "(min-width: 640px)" },
]

/**
 * Resolves the size for the current viewport and keeps it in step with resizes.
 *
 * Takes the sizes as separate primitives rather than the object, so the effect
 * depends on values rather than on an object identity that changes every
 * render — otherwise the listeners would be torn down and re-added constantly.
 */
function useResponsiveSize(
  base: number,
  sm?: number,
  md?: number,
  lg?: number,
  xl?: number
) {
  const [px, setPx] = React.useState(base)

  React.useEffect(() => {
    const update = () => {
      const byKey: Record<string, number | undefined> = { base, sm, md, lg, xl }
      const match = BREAKPOINTS.find(
        (bp) =>
          byKey[bp.key] !== undefined && window.matchMedia(bp.query).matches
      )
      setPx(match ? (byKey[match.key] as number) : base)
    }

    const lists = BREAKPOINTS.map((bp) => window.matchMedia(bp.query))
    lists.forEach((list) => list.addEventListener("change", update))
    update()

    return () => {
      lists.forEach((list) => list.removeEventListener("change", update))
    }
  }, [base, sm, md, lg, xl])

  return px
}

/**
 * Thin wrapper around the `<ascii-art>` custom element from ASCII Magic
 * (https://www.ascii-magic.com/ascii — MIT licensed).
 *
 * Attributes are set imperatively from an effect rather than passed through
 * JSX. The element restarts its piece whenever an attribute changes, so
 * letting React re-apply attributes on every render would restart the
 * animation constantly. This way they are written once per actual change.
 *
 * The script that defines the element is loaded once, in index.html.
 */
export function AsciiArt({
  piece,
  sizes = { base: 7 },
  speed,
  mono = true,
  look,
  className = "",
  label,
}: AsciiArtProps) {
  const ref = React.useRef<HTMLElement | null>(null)
  const px = useResponsiveSize(
    sizes.base,
    sizes.sm,
    sizes.md,
    sizes.lg,
    sizes.xl
  )

  React.useEffect(() => {
    const node = ref.current
    if (!node) return

    node.setAttribute("piece", piece)
    node.setAttribute("size", String(px))
    if (speed !== undefined) node.setAttribute("speed", String(speed))
    if (look) node.setAttribute("look", look)
    // `mono` is a switch: its presence is what turns it on.
    if (mono) node.setAttribute("mono", "")
    else node.removeAttribute("mono")
  }, [piece, px, speed, look, mono])

  return React.createElement("ascii-art", {
    ref,
    className,
    role: "img",
    "aria-label": label ?? `${piece.replace(/-/g, " ")}, animated ASCII art`,
  })
}
