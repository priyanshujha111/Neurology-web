import { useContext, useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { HOME, LIGHT_ROUTES, SITE_URL, buildTrail, normalizePath, prettifySlug } from '../config/breadcrumbs.js'
import { loadNeurologyCourses } from '../data/neurologyCourseApi.js'
import { BreadcrumbContext } from '../hooks/useBreadcrumbLabel.js'

// Wraps the app so pages can set the current breadcrumb's label (see useBreadcrumbLabel)
export function BreadcrumbProvider({ children }) {
  const [override, setOverride] = useState(null)
  const value = useMemo(() => ({ override, setOverride }), [override])
  return <BreadcrumbContext.Provider value={value}>{children}</BreadcrumbContext.Provider>
}

// Course name for a slug from the neurology course list (the same cached request the course
// pages use, so no extra fetch). Until it loads, or if it fails, the prettified slug is shown;
// a slug that isn't in the list is "Course not found", matching what the page shows.
// Returns { label, missing } (missing = the slug isn't a course).
function useCourseLabel(slug) {
  const [result, setResult] = useState({ slug: null, label: null, missing: false })

  useEffect(() => {
    if (!slug) return
    let active = true
    loadNeurologyCourses()
      .then((courses) => {
        const course = courses.find((c) => c.slug === slug)
        if (!active) return
        setResult(
          course
            ? { slug, label: course.title, missing: false }
            : { slug, label: 'Course not found', missing: true },
        )
      })
      .catch(() => {
        // Keep the prettified slug; the page shows its own error state
      })
    return () => {
      active = false
    }
  }, [slug])

  if (!slug) return { label: null, missing: false }
  return result.slug === slug ? result : { label: prettifySlug(slug), missing: false }
}

// schema.org BreadcrumbList in <head>; replaced on every route change, removed on unmount
function useBreadcrumbJsonLd(items) {
  const json = items
    ? JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: item.label,
          item: `${SITE_URL}${item.path === '/' ? '/' : item.path}`,
        })),
      })
    : null

  useEffect(() => {
    if (!json) return
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.dataset.breadcrumbs = ''
    script.textContent = json
    document.head.appendChild(script)
    return () => script.remove()
  }, [json])
}

const focusRing = 'rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-brand focus-visible:ring-offset-2'

const tones = {
  dark: {
    bar: 'border-b border-white/10 bg-ink',
    link: 'text-slate-400 hover:text-teal-brand focus-visible:ring-offset-ink',
    separator: 'text-slate-600',
    current: 'text-white',
  },
  light: {
    bar: 'bg-page',
    link: 'text-slate-500 hover:text-teal-ink focus-visible:ring-offset-page',
    separator: 'text-slate-400',
    current: 'text-ink',
  },
}

// Trail under the Navbar on every page except Home: Home > Section > Current page
function Breadcrumbs() {
  const { pathname } = useLocation()
  const { override } = useContext(BreadcrumbContext)
  const path = normalizePath(pathname)
  const { trail, notFound } = buildTrail(path)

  const courseSlug = trail.at(-1)?.courseSlug
  const { label: courseLabel, missing: courseMissing } = useCourseLabel(courseSlug)

  const items =
    trail.length === 0
      ? []
      : [
          HOME,
          ...trail.map((item, i) => {
            const isLast = i === trail.length - 1
            const label =
              isLast && override?.path === pathname ? override.label : (item.label ?? courseLabel)
            return { path: item.path, label }
          }),
        ]

  // No structured data for Home (no trail) or for pages that don't exist
  useBreadcrumbJsonLd(items.length > 0 && !notFound && !courseMissing ? items : null)

  if (items.length === 0) return null

  const tone = tones[LIGHT_ROUTES.includes(path) ? 'light' : 'dark']

  return (
    <div className={`font-body ${tone.bar}`}>
      {/* Same width and side padding as the page headers below it */}
      <nav aria-label="Breadcrumb" className="mx-auto max-w-[1140px] px-4 py-3 sm:px-6">
        <ol className="flex min-w-0 items-center gap-1.5 text-sm">
          {items.map((item, i) => {
            const isLast = i === items.length - 1
            return (
              <li key={item.path} className={`flex items-center gap-1.5 ${isLast ? 'min-w-0' : 'shrink-0'}`}>
                {i > 0 && (
                  <ChevronRight aria-hidden="true" className={`h-3.5 w-3.5 shrink-0 ${tone.separator}`} strokeWidth={2} />
                )}
                {isLast ? (
                  // Long course names are cut with an ellipsis; the full name is in the title
                  <span
                    aria-current="page"
                    title={item.label}
                    className={`block max-w-[60vw] truncate font-medium sm:max-w-md lg:max-w-xl ${tone.current}`}
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    to={item.path}
                    className={`inline-flex items-center gap-1.5 transition-colors duration-200 motion-reduce:transition-none ${focusRing} ${tone.link}`}
                  >
                    {i === 0 && <Home aria-hidden="true" className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />}
                    {item.label}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </div>
  )
}

export default Breadcrumbs
