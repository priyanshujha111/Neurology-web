import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from './CourseCard.jsx'
import { buttonPrimary, focusRing, icons } from './courseUi.js'
import { EMAIL, PHONE_DISPLAY, PHONE_HREF, mainPages } from '../data/siteLinks.js'

const ARROW = 'M5 12h14 M13 6l6 6-6 6'

const buttonOutlineDark =
  'inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/30 px-6 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-brand focus-visible:ring-offset-2 focus-visible:ring-offset-ink motion-reduce:transition-none'

// The site is a client-rendered SPA, so the server answers 200 for missing URLs. This tag keeps
// them out of search results (the page's document.title is set by whoever renders this view).
function useNoIndex() {
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex'
    document.head.appendChild(meta)
    return () => meta.remove()
  }, [])
}

// Shared by the catch-all route (pages/NotFound.jsx) and unknown /courses/:slug URLs
function NotFoundView({ heading, message, primary, secondary }) {
  useNoIndex()

  return (
    <div className="font-body text-body">
      <section className="relative overflow-hidden bg-neuro-dark text-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 dot-grid-dark" />
        <div className="relative mx-auto max-w-[1140px] px-4 py-16 text-center sm:px-6 md:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-brand">Error 404</p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">{heading}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">{message}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to={primary.to} className={buttonPrimary}>
              {primary.label}
            </Link>
            <Link to={secondary.to} className={buttonOutlineDark}>
              {secondary.label}
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-page py-12 md:py-16">
        <div className="mx-auto max-w-[1140px] px-4 sm:px-6">
          <h2 className="flex items-center gap-3 font-display text-xl font-bold text-ink">
            <span aria-hidden="true" className="h-5 w-1 rounded-full bg-teal-brand" />
            Try one of these pages
          </h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {mainPages.map((p) => (
              <li key={p.to} className="flex">
                <Link
                  to={p.to}
                  className={`flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white p-4 font-display font-semibold text-ink transition-colors hover:border-teal-brand/60 hover:text-teal-ink motion-reduce:transition-none ${focusRing}`}
                >
                  {p.label}
                  <Icon path={ARROW} className="h-4 w-4 text-teal-ink" />
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm leading-relaxed text-slate-600">
            Still can't find it? Call us on{' '}
            <a href={PHONE_HREF} className={`rounded-sm font-semibold text-teal-ink underline underline-offset-4 hover:text-indigo-deep ${focusRing}`}>
              <Icon path={icons.phone} className="mr-1 inline h-3.5 w-3.5" />
              {PHONE_DISPLAY}
            </a>{' '}
            or email{' '}
            <a href={`mailto:${EMAIL}`} className={`rounded-sm font-semibold break-words text-teal-ink underline underline-offset-4 hover:text-indigo-deep ${focusRing}`}>
              {EMAIL}
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  )
}

export default NotFoundView
