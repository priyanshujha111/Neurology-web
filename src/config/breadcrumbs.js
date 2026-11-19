// Breadcrumb labels for every route in src/App.jsx. Keep the two in sync.

// Base for the absolute URLs in the BreadcrumbList JSON-LD. The neurology site's own domain
// isn't decided yet (see scripts/generate-sitemap.mjs), so set VITE_SITE_URL once it is.
export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://medicalglobalacademy.com').replace(/\/+$/, '')

export const HOME = { path: '/', label: 'Home' }

// Static routes -> label
export const ROUTE_LABELS = {
  '/about': 'About',
  '/doctor': 'Doctors',
  '/courses': 'Courses',
  '/privacy': 'Privacy Policy',
  '/terms': 'Terms & Conditions',
  '/refund-policy': 'Refund Policy',
  '/sitemap': 'Sitemap',
}

// Pages whose header is light (the bar switches to its light style there)
export const LIGHT_ROUTES = ['/doctor']

export const NOT_FOUND_LABEL = 'Page not found'

// "fellowship-in-clinical-neurology" -> "Fellowship In Clinical Neurology"
export function prettifySlug(slug) {
  return decodeURIComponent(slug)
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// "/courses/abc/" -> "/courses/abc"
export function normalizePath(pathname) {
  return pathname.replace(/\/+$/, '') || '/'
}

// Trail for a path, without Home. Each item: { path, label } or, for a course page,
// { path, courseSlug } (the name is looked up from the course list).
// Returns { trail, notFound }; unknown paths give a single "Page not found" item.
export function buildTrail(pathname) {
  const path = normalizePath(pathname)
  if (path === '/') return { trail: [], notFound: false }

  if (ROUTE_LABELS[path]) return { trail: [{ path, label: ROUTE_LABELS[path] }], notFound: false }

  // /courses/:slug
  const course = /^\/courses\/([^/]+)$/.exec(path)
  if (course) {
    return {
      trail: [
        { path: '/courses', label: ROUTE_LABELS['/courses'] },
        { path, courseSlug: course[1] },
      ],
      notFound: false,
    }
  }

  return { trail: [{ path, label: NOT_FOUND_LABEL }], notFound: true }
}
