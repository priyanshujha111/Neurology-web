import { useEffect, useState } from 'react'

export const API_URL = 'https://24x7.medicalglobalacademy.com/api/course-list'
// Checked: e.g. .../storage/uploads/course/1791019302_1.jpg returns the course image (200, image/jpeg).
export const IMAGE_BASE = 'https://24x7.medicalglobalacademy.com/storage/uploads/course/'

// Matched against the course NAME and SLUG only. The API's category is unreliable (e.g.
// "Fellowship in Pediatric Neurology" is tagged Orthopedic) and many general medicine
// descriptions mention neurology in passing, so neither is used.
const NEURO_RE =
  /neuro|epilep|stroke|headache|migraine|parkinson|dementia|\beeg\b|\bemg\b|\bncv\b|movement[- ]disorder/i

// Force a course in, whatever the keywords say (slugs).
const INCLUDE_SLUGS = []

// Force a course out (slugs). These match "neuro" but are surgery, radiology or pathology
// programs rather than clinical neurology.
// TODO: decide which of these belong on the neurology site and uncomment them to hide them.
const EXCLUDE_SLUGS = [
  // 'fellowship-in-neurosurgery',
  // 'fellowship-in-pediatric-neurosurgery',
  // 'fellowship-in-neuroendoscopy',
  // 'fellowship-in-neuroradiology',
  // 'fellowship-in-neuropathology',
  // 'certificate-in-neuropathology',
  // 'fellowship-in-neuro-oncology',
  // 'fellowship-in-pediatric-neuro-oncology',
]

function isNeurology(course) {
  const slug = course.slug || ''
  if (EXCLUDE_SLUGS.includes(slug)) return false
  if (INCLUDE_SLUGS.includes(slug)) return true
  // Hyphens become spaces so slug words hit the \b word boundaries (e.g. "certificate-in-eeg")
  return NEURO_RE.test(course.name || '') || NEURO_RE.test(slug.replace(/-/g, ' '))
}

const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

// "₹50,000"; empty string for missing values and 0 (0 means "not offered" in the API)
export function formatFee(value) {
  const n = Number(value)
  if (value === null || value === undefined || value === '' || !Number.isFinite(n) || n <= 0) return ''
  return inr.format(n)
}

const TYPE_LABELS = { 'Pg Diploma': 'PG Diploma' }

// Display label for the API type ("Pg Diploma" -> "PG Diploma")
export function typeLabel(type) {
  return TYPE_LABELS[type] ?? type ?? ''
}

// Badge colours per course type (light backgrounds). Full class strings so Tailwind finds them.
export function typeBadgeClass(type) {
  switch (type) {
    case 'Fellowship':
      return 'bg-teal-brand/10 text-teal-ink ring-1 ring-teal-brand/30'
    case 'Pg Diploma':
      return 'bg-violet-brand/10 text-indigo-deep ring-1 ring-violet-brand/25'
    case 'Certificate':
      return 'bg-cyan-glow/25 text-indigo-deep ring-1 ring-cyan-glow/60'
    default:
      return 'bg-slate-100 text-slate-700 ring-1 ring-slate-200'
  }
}

// 12 -> "12 months", 1 -> "1 month"; empty string when unknown
export function durationLabel(months) {
  const n = Number(months)
  if (!Number.isFinite(n) || n <= 0) return ''
  return `${n} ${n === 1 ? 'month' : 'months'}`
}

const dateFormat = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

// "1 Dec 2026" when the start date is still ahead; otherwise "Contact counsellor"
// (many API start dates are already in the past).
export function startLabel(isoDate) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(isoDate || '')
  if (!match) return 'Contact counsellor'
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date > today ? dateFormat.format(date) : 'Contact counsellor'
}

function cleanDescription(raw) {
  return (raw || '')
    .replace(/\\r\\n|\r\n|\r|\n/g, ' ')
    .replace(/^["'\s]+|["'\s]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function normalize(course) {
  return {
    id: course.id,
    slug: course.slug,
    title: (course.name || '').trim(),
    type: course.type || '',
    image: course.image ? `${IMAGE_BASE}${encodeURIComponent(course.image)}` : '',
    description: cleanDescription(course.description),
    fee: formatFee(course.fee),
    totalFee: formatFee(course.total_fee),
    onlineCpd: formatFee(course.online_cpd),
    hybridCpd: formatFee(course.hybrid_cpd),
    startDate: course.start_date || '',
    durationMonths: Number(course.duration) || 0,
    isTop: Number(course.top_courses) === 1,
    actd: Number(course.actd) === 1,
  }
}

// One request per page load, shared by every page. A failed request is dropped from the cache
// and the error rethrown, so the caller can show it and a retry fetches again.
let cached = null

export function loadNeurologyCourses({ force = false } = {}) {
  if (force) cached = null
  if (!cached) {
    cached = fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`)
        return res.json()
      })
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.data || []
        // Top courses first; otherwise keep the API order
        return list
          .filter(isNeurology)
          .map(normalize)
          .sort((a, b) => Number(b.isTop) - Number(a.isTop))
      })
      .catch((err) => {
        cached = null
        throw err
      })
  }
  return cached
}

// For pages: { status: 'loading' | 'ready' | 'error', courses, error, retry }
export function useNeurologyCourses() {
  const [state, setState] = useState({ status: 'loading', courses: [], error: null })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true
    loadNeurologyCourses({ force: attempt > 0 })
      .then((courses) => {
        if (active) setState({ status: 'ready', courses, error: null })
      })
      .catch((error) => {
        if (!active) return
        console.error('Could not load neurology courses:', error)
        setState({ status: 'error', courses: [], error })
      })
    return () => {
      active = false
    }
  }, [attempt])

  const retry = () => {
    setState({ status: 'loading', courses: [], error: null })
    setAttempt((a) => a + 1)
  }

  return { ...state, retry }
}

export const DETAILS_URL = 'https://24x7.medicalglobalacademy.com/api/course-details/'

// TEMPORARY: the last module of some courses ends with brochure text pasted in as sessions
// (accreditation blurbs, contact details, app links). From the first such session onwards,
// the rest of that module is dropped. Remove once the API data is cleaned up.
// Case-sensitive on purpose: real lessons say e.g. "contact investigation".
const BROCHURE_MARKERS = [
  'International Accreditation',
  'Pan-India Clinical Attachment',
  'Contact Us',
  'MEDICAL GLOBAL',
  'ACCREDITED WITH',
  'playgoogle',
  'ACTD ACCREDITATION',
]

function stripBrochureSessions(sessions) {
  const cut = sessions.findIndex((title) => BROCHURE_MARKERS.some((marker) => title.includes(marker)))
  return cut === -1 ? sessions : sessions.slice(0, cut)
}

const text = (value) => (typeof value === 'string' ? value.trim() : '')

// API rows -> { highlights, whatYouLearn, workshop, modules }; empty entries are dropped
function normalizeDetails(data) {
  const highlights = [
    ...new Set(
      (data?.highlight || []).flatMap((h) =>
        text(h?.highlight)
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter(Boolean),
      ),
    ),
  ]

  const whatYouLearn = (data?.what_you_learn || [])
    .map((w) => ({ heading: text(w?.heading), description: text(w?.description) }))
    .filter((w) => w.heading || w.description)

  const rawWorkshop = data?.workshop
  const workshop = rawWorkshop
    ? {
        title: text(rawWorkshop.title),
        subtitle: text(rawWorkshop.subtitle),
        parts: (rawWorkshop.parts || [])
          .map((p) => ({
            title: text(p?.title),
            subtitle: text(p?.subtitle),
            keyPoints: (p?.key_points || []).map((k) => text(k?.content)).filter(Boolean),
          }))
          .filter((p) => p.title || p.subtitle || p.keyPoints.length > 0),
      }
    : null

  const modules = (data?.module || [])
    .map((m) => ({
      title: text(m?.module),
      lessons: stripBrochureSessions((m?.sessions || []).map((s) => text(s?.title)).filter(Boolean)),
    }))
    .filter((m) => m.title || m.lessons.length > 0)

  return { highlights, whatYouLearn, workshop, modules }
}

// One request per slug per page load. A failed request is dropped from the cache and the
// error rethrown, so a retry fetches again.
const detailsCache = new Map()

export function loadCourseDetails(slug, { force = false } = {}) {
  if (force) detailsCache.delete(slug)
  if (!detailsCache.has(slug)) {
    const request = fetch(`${DETAILS_URL}${encodeURIComponent(slug)}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`)
        return res.json()
      })
      .then((data) => normalizeDetails(data?.data && !data.slug ? data.data : data))
      .catch((err) => {
        detailsCache.delete(slug)
        throw err
      })
    detailsCache.set(slug, request)
  }
  return detailsCache.get(slug)
}

// For the course page: { status: 'loading' | 'ready' | 'error', details, retry }
export function useCourseDetails(slug) {
  const [state, setState] = useState({ slug, status: 'loading', details: null })
  const [attempt, setAttempt] = useState(0)

  // A new slug starts in the loading state (adjusted during render, not in an effect)
  if (state.slug !== slug) setState({ slug, status: 'loading', details: null })

  useEffect(() => {
    if (!slug) return
    let active = true
    loadCourseDetails(slug, { force: attempt > 0 })
      .then((details) => {
        if (active) setState({ slug, status: 'ready', details })
      })
      .catch((error) => {
        if (!active) return
        console.error(`Could not load course details for "${slug}":`, error)
        setState({ slug, status: 'error', details: null })
      })
    return () => {
      active = false
    }
  }, [slug, attempt])

  const retry = () => {
    setState({ slug, status: 'loading', details: null })
    setAttempt((a) => a + 1)
  }

  return { details: state.details, status: state.status, retry }
}
