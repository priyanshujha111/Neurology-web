import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import CourseCard, { Icon, StatePanel } from '../components/CourseCard.jsx'
import FaqSection from '../components/FaqSection.jsx'
import { COUNSELLOR_TEL, buttonOutline, buttonPrimary, icons } from '../components/courseUi.js'
import { durationLabel, startLabel, typeLabel, useNeurologyCourses } from '../data/neurologyCourseApi.js'
import { neurologyCourseFallbackFaqs, neurologyCourseFaqs } from '../data/neurologyFaqs.js'

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

function scrollToEnroll(focus = false) {
  const section = document.getElementById('enroll')
  if (!section) return
  const smooth = !window.matchMedia(REDUCED_MOTION).matches
  section.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' })
  // Move keyboard focus too, so the next Tab continues from the enrol section
  if (focus) document.getElementById('enroll-heading')?.focus({ preventScroll: true })
}

// Up to 3 other neurology courses, same type first
function relatedCourses(courses, course) {
  const others = courses.filter((c) => c.slug !== course.slug)
  return [...others.filter((c) => c.type === course.type), ...others.filter((c) => c.type !== course.type)].slice(0, 3)
}

function MetaChip({ icon, label, value }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-slate-300">
      <Icon path={icon} className="h-4 w-4 text-teal-brand" />
      {label}: <span className="font-semibold text-white">{value}</span>
    </span>
  )
}

function DetailSkeleton() {
  return (
    <div aria-hidden="true">
      <section className="bg-neuro-dark">
        <div className="mx-auto max-w-6xl px-4 pt-10 pb-14 sm:px-6 md:pt-14 motion-safe:animate-pulse">
          <div className="h-4 w-40 rounded bg-white/10" />
          <div className="mt-8 h-6 w-28 rounded-md bg-white/10" />
          <div className="mt-5 h-10 w-3/4 max-w-xl rounded bg-white/15" />
          <div className="mt-6 flex gap-3">
            <div className="h-9 w-40 rounded-lg bg-white/10" />
            <div className="h-9 w-48 rounded-lg bg-white/10" />
          </div>
        </div>
      </section>
      <section className="bg-page py-12 md:py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_360px] motion-safe:animate-pulse">
          <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-8">
            <div className="h-6 w-48 rounded bg-slate-200" />
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="h-3.5 rounded bg-slate-100" />
            ))}
          </div>
          <div className="h-72 rounded-xl border border-slate-200 bg-white" />
        </div>
      </section>
    </div>
  )
}

function CourseDetail() {
  const { slug } = useParams()
  const { hash } = useLocation()
  const { status, courses, retry } = useNeurologyCourses()
  const [imgFailed, setImgFailed] = useState(false)
  const originalTitle = useRef(document.title)

  const course = status === 'ready' ? courses.find((c) => c.slug === slug) : undefined

  // Reset the image error when moving to another course (adjusted during render, not in an effect)
  const [imageSlug, setImageSlug] = useState(slug)
  if (imageSlug !== slug) {
    setImageSlug(slug)
    setImgFailed(false)
  }

  // Page title; restored when leaving the page
  useEffect(() => {
    const previous = originalTitle.current
    return () => {
      document.title = previous
    }
  }, [])
  useEffect(() => {
    if (status !== 'ready') return
    document.title = course
      ? `${course.title} | Medical Global Academy`
      : 'Course not found | Medical Global Academy'
  }, [status, course])

  // Without #enroll, every course starts at the top (also when switching between courses)
  useEffect(() => {
    if (hash !== '#enroll') window.scrollTo(0, 0)
  }, [slug, hash])

  // With #enroll, wait until the course has rendered, then scroll to the enrol section
  useEffect(() => {
    if (status === 'ready' && course && hash === '#enroll') scrollToEnroll()
  }, [status, course, hash])

  if (status === 'loading') {
    return (
      <div className="font-body text-body">
        <p role="status" className="sr-only">
          Loading course details…
        </p>
        <DetailSkeleton />
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="bg-page px-4 py-20 font-body text-body sm:px-6">
        <StatePanel
          title="We couldn't load this course"
          actions={
            <>
              <button type="button" onClick={retry} className={buttonPrimary}>
                Try again
              </button>
              <a href={COUNSELLOR_TEL} className={buttonOutline}>
                <Icon path={icons.phone} className="h-4 w-4" />
                Call a counsellor
              </a>
            </>
          }
        >
          Please check your connection and try again, or call us on +91 9310027474.
        </StatePanel>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="bg-page px-4 py-20 font-body text-body sm:px-6">
        <StatePanel
          icon={icons.search}
          title="We couldn't find that course"
          actions={
            <Link to="/courses" className={buttonPrimary}>
              View all neurology courses
            </Link>
          }
        >
          It may have been renamed or is no longer offered.
        </StatePanel>
      </div>
    )
  }

  const duration = durationLabel(course.durationMonths)
  const start = startLabel(course.startDate)
  const related = relatedCourses(courses, course)
  const showImage = course.image && !imgFailed

  // Only rows with a value are shown (0 / missing means "not offered").
  // TODO: confirm the "Online with CPD" / "Hybrid with CPD" labels (API fields online_cpd and
  // hybrid_cpd) with the MGA team.
  const feeRows = [
    { label: 'Registration fee', value: course.fee },
    { label: 'Total program fee', value: course.totalFee },
    { label: 'Online with CPD', value: course.onlineCpd },
    { label: 'Hybrid with CPD', value: course.hybridCpd },
  ].filter((row) => row.value)

  const enrollButton = (
    <a
      href="#enroll"
      onClick={(e) => {
        e.preventDefault()
        scrollToEnroll(true)
      }}
      className={buttonPrimary}
    >
      Enroll Now
    </a>
  )
  const counsellorButton = (dark = false) => (
    <a
      href={COUNSELLOR_TEL}
      className={
        dark
          ? 'inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/30 px-6 text-sm font-semibold text-white transition-colors hover:border-teal-brand hover:text-cyan-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-brand focus-visible:ring-offset-2 focus-visible:ring-offset-ink'
          : buttonOutline
      }
    >
      <Icon path={icons.phone} className="h-4 w-4" />
      Talk to Counsellor
    </a>
  )

  return (
    <div className="font-body text-body">
      {/* Hero */}
      <section className="relative overflow-hidden bg-neuro-dark text-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 dot-grid-dark" />
        <div
          className={`relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 pt-8 pb-14 sm:px-6 md:pt-10 md:pb-16 ${
            showImage ? 'lg:grid-cols-[1.2fr_1fr]' : ''
          }`}
        >
          <div>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 rounded-sm text-sm font-semibold text-teal-brand transition-colors hover:text-cyan-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-brand focus-visible:ring-offset-4 focus-visible:ring-offset-ink"
            >
              <Icon path="M15 6l-6 6 6 6" className="h-4 w-4" strokeWidth={2} />
              All neurology courses
            </Link>

            <div className="mt-8 flex flex-wrap items-center gap-2">
              <span className="rounded-md border border-teal-brand/40 bg-teal-brand/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-teal-brand">
                {typeLabel(course.type)}
              </span>
              {course.actd && (
                <span className="inline-flex items-center gap-1 rounded-md border border-white/20 bg-white/5 px-2 py-1 text-xs font-semibold text-white">
                  <Icon path={icons.check} className="h-3.5 w-3.5 text-cyan-glow" strokeWidth={2.2} />
                  ACTD
                </span>
              )}
              {course.isTop && (
                <span className="rounded-md bg-violet-soft px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-indigo-deep">
                  Top
                </span>
              )}
            </div>

            <h1 className="mt-5 font-display text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl md:text-5xl">
              {course.title}
            </h1>

            <div className="mt-6 flex flex-wrap gap-3">
              {duration && <MetaChip icon={icons.clock} label="Duration" value={duration} />}
              <MetaChip icon={icons.calendar} label="Starts" value={start} />
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {enrollButton}
              {counsellorButton(true)}
            </div>
          </div>

          {showImage && (
            <div className="overflow-hidden rounded-xl border border-white/10 shadow-glow">
              {/* The heading names the course, so the image is decorative */}
              <img
                src={course.image}
                alt=""
                decoding="async"
                onError={() => setImgFailed(true)}
                className="aspect-[776/450] h-full w-full object-cover"
              />
            </div>
          )}
        </div>
      </section>

      {/* Body */}
      <section className="bg-page py-12 md:py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_360px] lg:gap-10">
          <div className="space-y-8">
            <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-card md:p-8">
              <h2 className="font-display text-2xl font-semibold text-ink">About this program</h2>
              <div aria-hidden="true" className="mt-4 h-1 w-14 rounded-full bg-linear-to-r from-teal-brand to-violet-brand" />
              <p className="mt-6 max-w-prose leading-relaxed text-slate-700">
                {course.description || 'Please contact a counsellor for the full program details.'}
              </p>
            </article>

            {/* Enrol. scroll-mt keeps the heading clear of the sticky navbar. */}
            <section
              id="enroll"
              aria-labelledby="enroll-heading"
              className="scroll-mt-28 rounded-xl border border-teal-brand/40 bg-white p-6 shadow-glow md:p-8"
            >
              <h2 id="enroll-heading" tabIndex={-1} className="font-display text-2xl font-semibold text-ink focus:outline-none">
                Enrol in this program
              </h2>
              <p className="mt-3 max-w-prose leading-relaxed text-slate-600">
                Talk to our counsellors to check your eligibility, confirm the fees and next start
                date, and complete your enrolment in the {course.title}.
              </p>
              {/* TODO: replace this with an enrolment form once the admission endpoint is known.
                  No endpoint exists in this project yet, so nothing is submitted from here. */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">{counsellorButton()}</div>
            </section>
          </div>

          {/* Fee card */}
          <aside aria-labelledby="fees-heading" className="lg:sticky lg:top-28">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
              <div aria-hidden="true" className="h-1.5 bg-linear-to-r from-teal-brand to-violet-brand" />
              <div className="p-6">
                <h2 id="fees-heading" className="font-display text-lg font-semibold text-ink">
                  Program fees
                </h2>
                {feeRows.length > 0 ? (
                  <dl className="mt-4 divide-y divide-slate-100">
                    {feeRows.map((row) => (
                      <div key={row.label} className="flex items-baseline justify-between gap-4 py-3">
                        <dt className="text-sm text-slate-600">{row.label}</dt>
                        <dd className="font-display text-base font-semibold text-ink">{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="mt-3 text-sm text-slate-600">Please contact a counsellor for fee details.</p>
                )}
                <div className="mt-6 flex flex-col gap-3">
                  {enrollButton}
                  {counsellorButton()}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* More courses */}
      {related.length > 0 && (
        <section className="bg-white py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-teal-ink">
                  <span aria-hidden="true" className="h-px w-8 bg-teal-ink" />
                  Keep exploring
                </span>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink">More neurology courses</h2>
              </div>
              <Link
                to="/courses"
                className="rounded-sm text-sm font-semibold text-teal-ink hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-brand focus-visible:ring-offset-2"
              >
                View all courses
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((c) => (
                <CourseCard key={c.slug} course={c} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Course FAQs; courses without their own file get the fallback list */}
      <FaqSection
        variant="dark"
        defaultOpen={0}
        title="Frequently asked questions about this program"
        items={neurologyCourseFaqs[slug] ?? neurologyCourseFallbackFaqs}
      />
    </div>
  )
}

export default CourseDetail
