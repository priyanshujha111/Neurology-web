import { useEffect, useId, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { typeBadgeClass, typeLabel, useNeurologyCourses } from '../data/neurologyCourseApi.js'
import {
  EMAIL,
  MAIN_SITE_URL,
  PHONE_DISPLAY,
  PHONE_HREF,
  coursesOfType,
  legalPolicies,
  mainPages,
  socials,
} from '../data/siteLinks.js'

// Human-readable map of every route in App.jsx. Course pages (/courses/:slug) come live from
// the API; if it fails, the Courses card falls back to a single "All courses" link.

// One line per page, taken from what the page actually shows
const descriptions = {
  '/': 'Specialist-led, case-based neurology training, our expert doctors, the learning path and what doctors say.',
  '/about': 'Who we are, the neurology specializations we teach and how programs fit around working doctors.',
  '/courses': 'All Fellowships, PG Diplomas and Certificates in neurology, with type filters and search.',
  '/doctor': 'Meet our expert neurologists and browse the faculty by department.',
}

// Same order as the Courses page filters; any other API type comes after these
const TYPE_ORDER = ['Fellowship', 'Pg Diploma', 'Certificate']
const rank = (type) => {
  const i = TYPE_ORDER.indexOf(type)
  return i === -1 ? TYPE_ORDER.length : i
}

const focusRing = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-brand'

const textLink = `rounded-sm text-slate-700 underline decoration-transparent underline-offset-4 transition-colors hover:text-teal-ink hover:decoration-teal-brand motion-reduce:transition-none ${focusRing}`

const chipLink = `inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:border-teal-brand hover:text-teal-ink motion-reduce:transition-none ${focusRing}`

const icons = {
  chevron: 'M9 6l6 6-6 6',
  arrow: 'M5 12h14 M13 6l6 6-6 6',
  external: 'M14 4h6v6 M20 4l-9 9 M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z M21 21l-4.35-4.35',
  mail: 'M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z M3 7l9 6 9-6',
  phone:
    'M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z',
}

function Icon({ path, className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={`shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={path} />
    </svg>
  )
}

function NewTabNote() {
  return <span className="sr-only"> (opens in a new tab)</span>
}

// White card with an h2; the teal bar matches the accent rules used across the site
function Card({ title, className = '', children }) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:p-7 ${className}`}>
      <h2 className="flex items-center gap-3 font-display text-xl font-bold text-ink">
        <span aria-hidden="true" className="h-5 w-1 rounded-full bg-teal-brand" />
        {title}
      </h2>
      {children}
    </div>
  )
}

function CoursesSkeleton() {
  return (
    <div aria-hidden="true" className="mt-6 animate-pulse motion-reduce:animate-none">
      <div className="flex flex-wrap gap-2.5">
        {[24, 28, 32, 28].map((w, i) => (
          <div key={i} className="h-9 rounded-full bg-slate-200" style={{ width: `${w * 4}px` }} />
        ))}
      </div>
      {[0, 1].map((g) => (
        <div key={g} className="mt-8">
          <div className="h-5 w-36 rounded bg-slate-200" />
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="h-4 rounded bg-slate-100" style={{ width: `${70 + ((i * 13) % 30)}%` }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function CoursesCard() {
  const { status, courses } = useNeurologyCourses()
  const [query, setQuery] = useState('')
  const searchId = useId()

  // Courses grouped by type in filter order, A-Z inside each group
  const groups = useMemo(() => {
    const byType = new Map()
    for (const c of courses) {
      const key = c.type || 'Other'
      if (!byType.has(key)) byType.set(key, [])
      byType.get(key).push(c)
    }
    return [...byType.entries()]
      .sort(([a], [b]) => rank(a) - rank(b))
      .map(([type, list]) => ({ type, courses: [...list].sort((a, b) => a.title.localeCompare(b.title)) }))
  }, [courses])

  const q = query.trim().toLowerCase()
  const visibleGroups = groups
    .map((g) => ({ ...g, courses: q ? g.courses.filter((c) => c.title.toLowerCase().includes(q)) : g.courses }))
    .filter((g) => g.courses.length > 0)
  const shown = visibleGroups.reduce((n, g) => n + g.courses.length, 0)
  const hasCourses = status === 'ready' && courses.length > 0

  return (
    <Card title="Courses" className="md:col-span-2 lg:col-span-3">
      {status === 'loading' && (
        <>
          <p role="status" className="sr-only">
            Loading courses…
          </p>
          <CoursesSkeleton />
        </>
      )}

      {/* API failed or returned nothing: just the link to the Courses page, no error screen */}
      {!hasCourses && status !== 'loading' && (
        <ul className="mt-5">
          <li>
            <Link to="/courses" className={chipLink}>
              All courses
              <Icon path={icons.arrow} className="h-3.5 w-3.5" />
            </Link>
          </li>
        </ul>
      )}

      {hasCourses && (
        <>
          <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-ink">Browse by type</h3>
              <ul className="mt-3 flex flex-wrap gap-2.5">
                <li>
                  <Link to="/courses" className={chipLink}>
                    All courses <span className="text-slate-500">{courses.length}</span>
                  </Link>
                </li>
                {groups
                  .filter((g) => g.type !== 'Other')
                  .map((g) => (
                    <li key={g.type}>
                      <Link to={coursesOfType(g.type)} className={chipLink}>
                        {typeLabel(g.type)} <span className="text-slate-500">{g.courses.length}</span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>

            <div className="relative w-full lg:max-w-xs">
              <label htmlFor={searchId} className="sr-only">
                Filter courses by title
              </label>
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500">
                <Icon path={icons.search} />
              </span>
              <input
                id={searchId}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter by course title"
                className="h-10 w-full rounded-lg border border-slate-300 bg-white pr-3 pl-9 text-sm text-ink placeholder:text-slate-500 transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/25 focus:outline-none motion-reduce:transition-none"
              />
            </div>
          </div>

          <p role="status" aria-live="polite" className="mt-4 text-sm text-slate-600">
            Showing {shown} {shown === 1 ? 'course' : 'courses'}
          </p>

          {visibleGroups.map((g) => (
            <div key={g.type} className="mt-7">
              <h3 className="flex items-center gap-2.5 font-display text-base font-semibold text-ink">
                {typeLabel(g.type)}
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${typeBadgeClass(g.type)}`}>
                  {g.courses.length}
                </span>
              </h3>
              <ul className="mt-3 gap-x-8 sm:columns-2 lg:columns-3">
                {g.courses.map((c) => (
                  <li key={c.slug} className="break-inside-avoid py-1.5">
                    <Link to={`/courses/${c.slug}`} className={`inline-flex items-start gap-1.5 text-sm leading-snug ${textLink}`}>
                      <Icon path={icons.chevron} className="mt-0.5 h-3.5 w-3.5 text-teal-ink" />
                      {c.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {shown === 0 && (
            <div className="mt-6 rounded-xl border border-slate-200 bg-page px-5 py-4 text-sm text-slate-700">
              No course titles match “{query.trim()}”.{' '}
              <button
                type="button"
                onClick={() => setQuery('')}
                className={`rounded-sm font-semibold text-teal-ink underline underline-offset-4 hover:text-indigo-deep ${focusRing}`}
              >
                Clear filter
              </button>
            </div>
          )}
        </>
      )}
    </Card>
  )
}

function Sitemap() {
  useEffect(() => {
    document.title = 'Sitemap | Medical Global Academy'
  }, [])

  return (
    <div className="font-body text-body">
      {/* Header */}
      <section className="relative overflow-hidden bg-neuro-dark text-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 dot-grid-dark" />
        <div className="relative mx-auto max-w-[1140px] px-4 py-14 sm:px-6 md:py-20">
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">Sitemap</h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
            Every page on the site in one place, including all current neurology courses.
          </p>
        </div>
      </section>

      {/* Cards */}
      <section className="bg-page py-12 md:py-16">
        <nav aria-label="Sitemap" className="mx-auto grid max-w-[1140px] gap-6 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3">
          <Card title="Main pages" className="md:col-span-2 lg:col-span-3">
            <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {mainPages.map((p) => (
                <li key={p.to} className="flex">
                  <Link
                    to={p.to}
                    className={`group flex w-full flex-col rounded-xl border border-slate-200 bg-page p-4 transition-colors hover:border-teal-brand/60 hover:bg-white hover:shadow-glow motion-reduce:transition-none ${focusRing}`}
                  >
                    <span className="flex items-center justify-between gap-2 font-display font-semibold text-ink group-hover:text-teal-ink">
                      {p.label}
                      <Icon path={icons.arrow} className="h-4 w-4 text-teal-ink" />
                    </span>
                    <span className="mt-1.5 text-sm leading-relaxed text-slate-600">{descriptions[p.to]}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>

          <CoursesCard />

          <Card title="Legal">
            <ul className="mt-5 grid gap-3">
              {legalPolicies.map((p) => (
                <li key={p.to}>
                  <Link to={p.to} className={`inline-flex items-center gap-1.5 ${textLink}`}>
                    <Icon path={icons.chevron} className="h-3.5 w-3.5 text-teal-ink" />
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Contact and social">
            <ul className="mt-5 grid gap-3">
              <li>
                <a href={`mailto:${EMAIL}`} className={`inline-flex min-w-0 items-start gap-2.5 ${textLink}`}>
                  <Icon path={icons.mail} className="mt-0.5 h-4 w-4 text-teal-ink" />
                  {/* Break after the @ (not mid-word) when the card is narrow */}
                  <span className="min-w-0">
                    {EMAIL.split('@')[0]}@<wbr />
                    {EMAIL.split('@')[1]}
                  </span>
                </a>
              </li>
              <li>
                <a href={PHONE_HREF} className={`inline-flex items-start gap-2.5 ${textLink}`}>
                  <Icon path={icons.phone} className="mt-0.5 h-4 w-4 text-teal-ink" />
                  {PHONE_DISPLAY}
                </a>
              </li>
            </ul>
            <h3 className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-teal-ink">Follow us</h3>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5">
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2.5 text-sm ${textLink}`}>
                    {/* Dark circle, as in the footer, so every brand colour stays visible */}
                    <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-deep">
                      <svg viewBox="0 0 24 24" fill={s.color} focusable="false" className="h-3.5 w-3.5">
                        <path d={s.path} />
                      </svg>
                    </span>
                    {s.label}
                    <NewTabNote />
                  </a>
                </li>
              ))}
            </ul>
          </Card>

          <div className="relative overflow-hidden rounded-2xl bg-neuro-dark p-6 text-white shadow-card sm:p-7 md:col-span-2 lg:col-span-1">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 dot-grid-dark" />
            <div className="relative">
              <h2 className="flex items-center gap-3 font-display text-xl font-bold">
                <span aria-hidden="true" className="h-5 w-1 rounded-full bg-teal-brand" />
                Main website
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">The Medical Global Academy main website.</p>
              <a
                href={MAIN_SITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-teal-brand px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-cyan-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-glow focus-visible:ring-offset-2 focus-visible:ring-offset-ink motion-reduce:transition-none"
              >
                medicalglobalacademy.com
                <Icon path={icons.external} />
                <NewTabNote />
              </a>
            </div>
          </div>
        </nav>
      </section>
    </div>
  )
}

export default Sitemap
