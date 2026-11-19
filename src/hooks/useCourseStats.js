import { useEffect, useState } from 'react'
import { API_URL } from '../data/neurologyCourseApi.js'

// Shown when the API can't be reached, so the section never looks broken
export const FALLBACK_STATS = { total: 507, fellowship: 396, certificate: 47, pgDiploma: 64 }

const STORAGE_KEY = 'mga:course-stats'

// Counts across the whole MGA catalogue (every course, not only neurology).
// Types are compared trimmed and case-insensitively ("Pg Diploma" == "PG Diploma").
function countByType(list) {
  const stats = { total: list.length, fellowship: 0, certificate: 0, pgDiploma: 0 }
  for (const course of list) {
    const type = String(course?.type ?? '').trim().toLowerCase()
    if (type === 'fellowship') stats.fellowship += 1
    else if (type === 'certificate') stats.certificate += 1
    else if (type === 'pg diploma') stats.pgDiploma += 1
  }
  return stats
}

function readStorage() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY))
    return saved && Number.isFinite(saved.total) ? saved : null
  } catch {
    return null
  }
}

function writeStorage(stats) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
  } catch {
    // Storage blocked (private mode etc.): the in-memory cache still covers this page load
  }
}

// One request per session: kept in memory for this page load and in sessionStorage across reloads.
// A failed request is dropped, so the next visit to the page tries again.
let cached = readStorage()
let pending = null

function loadCourseStats() {
  if (!pending) {
    pending = fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`)
        return res.json()
      })
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.data
        if (!Array.isArray(list)) throw new Error('Unexpected course-list response')
        cached = countByType(list)
        writeStorage(cached)
        return cached
      })
      .finally(() => {
        pending = null
      })
  }
  return pending
}

// { stats: { total, fellowship, certificate, pgDiploma }, loading, error }
// On error, stats falls back to FALLBACK_STATS.
export function useCourseStats() {
  const [state, setState] = useState(() =>
    cached ? { stats: cached, loading: false, error: null } : { stats: null, loading: true, error: null },
  )

  useEffect(() => {
    if (cached) return
    let active = true
    loadCourseStats()
      .then((stats) => {
        if (active) setState({ stats, loading: false, error: null })
      })
      .catch((error) => {
        if (!active) return
        console.error('Could not load course stats:', error)
        setState({ stats: FALLBACK_STATS, loading: false, error })
      })
    return () => {
      active = false
    }
  }, [])

  return state
}
