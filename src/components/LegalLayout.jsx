import { Fragment, useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { legalPolicies } from '../data/siteLinks.js'

// Shared layout for the legal pages (Privacy Policy, Terms & Conditions, Refund Policy).
// Pages pass their text as data; this file only formats it.
//
// sections: [{ id, title, blocks }]
// Block types:
//   { type: 'p', text }            paragraph (or parts, see below)
//   { type: 'h3', text }           sub-heading
//   { type: 'ul', items }          list; items are text/parts or { label, text } for a bold lead-in
//   { type: 'card', lines }        boxed lines (e.g. contact details); the first line is bold
// Text can be a string or an array of parts: strings, { to, text } (router link) or
// { href, text, external } (normal link). Every support@medicalglobalacademy.com in a string
// becomes a mailto link automatically.

const EMAIL = 'support@medicalglobalacademy.com'
const EMAIL_RE = /(support@medicalglobalacademy\.com)/g
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

const legalLinkClass =
  'rounded-sm font-medium text-teal-ink underline decoration-teal-brand/50 underline-offset-4 transition-colors hover:text-indigo-deep hover:decoration-teal-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-brand motion-reduce:transition-none'

function EmailText({ text }) {
  return text.split(EMAIL_RE).map((part, i) =>
    part === EMAIL ? (
      <a key={i} href={`mailto:${EMAIL}`} className={`${legalLinkClass} break-all`}>
        {part}
      </a>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  )
}

function RichText({ value }) {
  const parts = Array.isArray(value) ? value : [value]
  return parts.map((part, i) => {
    if (typeof part === 'string') return <EmailText key={i} text={part} />
    if (part.to) {
      return (
        <Link key={i} to={part.to} className={legalLinkClass}>
          {part.text}
        </Link>
      )
    }
    return (
      <a
        key={i}
        href={part.href}
        className={legalLinkClass}
        {...(part.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {part.text}
      </a>
    )
  })
}

function Block({ block }) {
  switch (block.type) {
    case 'h3':
      return <h3 className="mt-6 font-display text-lg font-semibold text-ink first:mt-0">{block.text}</h3>
    case 'ul':
      return (
        <ul className="mt-4 space-y-3">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3">
              <span aria-hidden="true" className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-teal-brand" />
              <span>
                {item && item.label ? (
                  <>
                    <strong className="font-semibold text-ink">{item.label}:</strong> <RichText value={item.text} />
                  </>
                ) : (
                  <RichText value={item} />
                )}
              </span>
            </li>
          ))}
        </ul>
      )
    case 'card':
      return (
        <div className="mt-4 space-y-1 rounded-xl border border-slate-200 bg-page px-5 py-4">
          {block.lines.map((line, i) => (
            <p key={i} className={i === 0 ? 'font-display font-semibold text-ink' : undefined}>
              <RichText value={line} />
            </p>
          ))}
        </div>
      )
    default:
      return (
        <p className="mt-4 first:mt-0">
          <RichText value={block.text} />
        </p>
      )
  }
}

function TocList({ sections, activeId, onSelect }) {
  return (
    <ol className="space-y-1 text-sm">
      {sections.map((s, i) => {
        const isActive = activeId === s.id
        return (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              onClick={(e) => onSelect(e, s.id)}
              aria-current={isActive ? 'location' : undefined}
              className={`flex gap-2 rounded-r-md border-l-2 py-1.5 pr-2 pl-3 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-brand motion-reduce:transition-none ${
                isActive
                  ? 'border-teal-brand bg-teal-brand/5 font-semibold text-ink'
                  : 'border-transparent text-slate-600 hover:border-slate-300 hover:text-ink'
              }`}
            >
              <span className={isActive ? 'text-teal-ink' : 'text-slate-500'}>{i + 1}.</span>
              {s.title}
            </a>
          </li>
        )
      })}
    </ol>
  )
}

function scrollToSection(id, { smooth = false, focus = false } = {}) {
  const node = document.getElementById(id)
  if (!node) return false
  const behavior = smooth && !window.matchMedia(REDUCED_MOTION).matches ? 'smooth' : 'auto'
  node.scrollIntoView({ behavior, block: 'start' })
  // Move keyboard focus to the section heading so the next Tab continues from there
  if (focus) node.querySelector('h2')?.focus({ preventScroll: true })
  return true
}

function LegalLayout({
  title, // h1 text
  documentTitle, // browser tab title
  sections,
  tocLabel, // accessible name for the table of contents
  eyebrow, // small label above the h1, e.g. "Legal"
  subtitle, // short line under the h1
  lastUpdated, // shown only when not empty
  intro, // intro paragraph in the header
  bottomNote, // left side of the bottom strip (next to "Back to top")
}) {
  const { hash, pathname } = useLocation()
  const navigate = useNavigate()
  const [activeId, setActiveId] = useState(sections[0]?.id)
  const visibleRef = useRef(new Set())
  const mobileTocRef = useRef(null)
  const initialHash = useRef(hash)
  const sectionsRef = useRef(sections)

  useEffect(() => {
    const previousTitle = document.title
    document.title = documentTitle
    return () => {
      document.title = previousTitle
    }
  }, [documentTitle])

  // On open: go to the #section in the URL if there is one, otherwise start at the top
  useEffect(() => {
    const id = decodeURIComponent(initialHash.current.slice(1))
    if (id && sectionsRef.current.some((s) => s.id === id)) {
      scrollToSection(id)
      setActiveId(id)
    } else {
      window.scrollTo(0, 0)
    }
  }, [])

  // Highlight the section currently near the top of the viewport
  useEffect(() => {
    const list = sectionsRef.current
    const visible = visibleRef.current
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        })
        const first = list.find((s) => visible.has(s.id))
        if (first) setActiveId(first.id)
      },
      // Top margin clears the sticky navbar; bottom margin makes the upper part of the viewport count
      { rootMargin: '-120px 0px -55% 0px' }
    )
    list.forEach((s) => {
      const node = document.getElementById(s.id)
      if (node) observer.observe(node)
    })
    return () => {
      observer.disconnect()
      visible.clear()
    }
  }, [])

  const handleSelect = (e, id) => {
    e.preventDefault()
    if (!scrollToSection(id, { smooth: true, focus: true })) return
    navigate({ hash: `#${id}` }, { replace: true, preventScrollReset: true })
    setActiveId(id)
    if (mobileTocRef.current) mobileTocRef.current.open = false
  }

  const backToTop = (e) => {
    e.preventDefault()
    const smooth = !window.matchMedia(REDUCED_MOTION).matches
    window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' })
    document.getElementById('legal-title')?.focus({ preventScroll: true })
  }

  return (
    <div className="font-body text-body">
      {/* Header */}
      <section className="relative overflow-hidden bg-neuro-dark text-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 dot-grid-dark" />
        <div className="relative mx-auto max-w-[1140px] px-4 py-14 sm:px-6 md:py-20">
          {eyebrow && (
            <p className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-teal-brand">
              <span aria-hidden="true" className="h-px w-8 bg-teal-brand" />
              {eyebrow}
            </p>
          )}
          <h1
            id="legal-title"
            tabIndex={-1}
            className="font-display text-4xl font-bold leading-tight tracking-tight focus:outline-none sm:text-5xl md:text-6xl"
          >
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-teal-brand">
              <span aria-hidden="true" className="h-px w-8 bg-teal-brand" />
              {subtitle}
            </p>
          )}
          {lastUpdated && <p className="mt-3 text-sm text-slate-300">Last updated: {lastUpdated}</p>}
          {intro && (
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-slate-300 md:text-lg">
              <RichText value={intro} />
            </p>
          )}
        </div>
      </section>

      {/* Body */}
      <section className="bg-white py-12 md:py-16">
        <div className="mx-auto max-w-[1140px] px-4 sm:px-6 lg:grid lg:grid-cols-[260px_1fr] lg:gap-16">
          {/* Table of contents: desktop */}
          <aside className="hidden lg:block">
            <nav aria-label={tocLabel} className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pb-4">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-teal-ink">On this page</p>
              <TocList sections={sections} activeId={activeId} onSelect={handleSelect} />
            </nav>
          </aside>

          <div className="min-w-0">
            {/* Table of contents: mobile */}
            <details ref={mobileTocRef} className="group mb-10 rounded-xl border border-slate-200 bg-page lg:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl px-5 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-brand [&::-webkit-details-marker]:hidden">
                On this page
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-teal-ink group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </summary>
              <nav aria-label={tocLabel} className="px-3 pb-4">
                <TocList sections={sections} activeId={activeId} onSelect={handleSelect} />
              </nav>
            </details>

            {/* Text, about 70 characters per line */}
            <div className="max-w-[70ch] space-y-12 text-base leading-[1.8] text-slate-700 md:text-[17px]">
              {sections.map((s, i) => (
                <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="scroll-mt-28 md:scroll-mt-32">
                  <h2
                    id={`${s.id}-title`}
                    tabIndex={-1}
                    className="mb-4 font-display text-2xl font-bold text-ink focus:outline-none md:text-3xl"
                  >
                    <span className="text-teal-ink">{i + 1}.</span> {s.title}
                  </h2>
                  {s.blocks.map((block, j) => (
                    <Block key={j} block={block} />
                  ))}
                </section>
              ))}
            </div>

            {/* Bottom strip: page-specific note + back to top */}
            <div className="mt-14 flex max-w-[70ch] flex-col gap-4 rounded-xl border border-slate-200 bg-page p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-slate-700">{bottomNote && <RichText value={bottomNote} />}</div>
              <a
                href="#legal-title"
                onClick={backToTop}
                className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-md text-sm font-semibold text-teal-ink hover:text-indigo-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-brand sm:self-auto"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 19V5 M5 12l7-7 7 7" />
                </svg>
                Back to top
              </a>
            </div>

            {/* Related policies: every legal page, the current one marked */}
            <nav aria-label="Related policies" className="mt-8 max-w-[70ch]">
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-ink">Related policies</h2>
              <ul className="mt-3 flex flex-wrap gap-2.5">
                {legalPolicies.map((p) => {
                  const isCurrent = pathname === p.to
                  return (
                    <li key={p.to}>
                      <Link
                        to={p.to}
                        aria-current={isCurrent ? 'page' : undefined}
                        className={`inline-flex items-center rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-brand motion-reduce:transition-none ${
                          isCurrent
                            ? 'border-teal-brand bg-teal-brand/5 text-ink'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-teal-brand hover:text-teal-ink'
                        }`}
                      >
                        {p.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LegalLayout
