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
