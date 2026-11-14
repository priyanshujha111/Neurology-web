// Writes public/sitemap.xml (static routes + every neurology course page) and public/robots.txt.
//
//   SITE_URL=https://your-domain.example npm run sitemap
//
// TODO: the production domain of the neurology site is not decided yet. Set SITE_URL when
// running this (no domain is assumed here), then rebuild so the files land in dist/.
// Needs Node 18+ (built-in fetch).

import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const API_URL = 'https://24x7.medicalglobalacademy.com/api/course-list'

// Copied from src/data/neurologyCourseApi.js (that file imports React, so it isn't imported
// here). Keep NEURO_RE, INCLUDE_SLUGS and EXCLUDE_SLUGS in sync with it.
const NEURO_RE =
  /neuro|epilep|stroke|headache|migraine|parkinson|dementia|\beeg\b|\bemg\b|\bncv\b|movement[- ]disorder/i
const INCLUDE_SLUGS = []
const EXCLUDE_SLUGS = []

function isNeurology(course) {
  const slug = course.slug || ''
  if (EXCLUDE_SLUGS.includes(slug)) return false
  if (INCLUDE_SLUGS.includes(slug)) return true
  return NEURO_RE.test(course.name || '') || NEURO_RE.test(slug.replace(/-/g, ' '))
}

// Keep in sync with the routes in src/App.jsx
const STATIC_ROUTES = ['/', '/about', '/doctor', '/courses', '/terms', '/privacy', '/refund-policy', '/sitemap']

const escapeXml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')

const siteUrl = (process.env.SITE_URL || '').trim().replace(/\/+$/, '')
if (!/^https?:\/\/[^/]+/.test(siteUrl)) {
  console.error('Set SITE_URL to the full site address, e.g. SITE_URL=https://example.com npm run sitemap')
  process.exit(1)
}

const res = await fetch(API_URL)
if (!res.ok) {
  console.error(`Course API request failed: ${res.status}`)
  process.exit(1)
}
const data = await res.json()
const list = Array.isArray(data) ? data : data?.data || []
const slugs = [...new Set(list.filter(isNeurology).map((c) => c.slug).filter(Boolean))]

const paths = [...STATIC_ROUTES, ...slugs.map((slug) => `/courses/${encodeURIComponent(slug)}`)]
const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...paths.map((p) => `  <url><loc>${escapeXml(siteUrl + p)}</loc></url>`),
  '</urlset>',
  '',
].join('\n')

const robots = ['User-agent: *', 'Allow: /', '', `Sitemap: ${siteUrl}/sitemap.xml`, ''].join('\n')

const publicDir = new URL('../public/', import.meta.url)
await writeFile(new URL('sitemap.xml', publicDir), xml)
await writeFile(new URL('robots.txt', publicDir), robots)

console.log(`Wrote ${paths.length} URLs (${slugs.length} courses) to ${fileURLToPath(new URL('sitemap.xml', publicDir))}`)
console.log(`Wrote ${fileURLToPath(new URL('robots.txt', publicDir))}`)
