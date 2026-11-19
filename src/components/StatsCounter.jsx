import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { Award, BookOpen, GraduationCap, ScrollText } from 'lucide-react'
import { useCourseStats } from '../hooks/useCourseStats.js'

const COUNT_DURATION = 2000 // ms
const STAGGER = 120 // ms between cards
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

const numberFormat = new Intl.NumberFormat('en-IN')

const cards = [
  { key: 'total', label: 'Active Programs', Icon: BookOpen },
  { key: 'fellowship', label: 'Fellowships', Icon: GraduationCap },
  { key: 'certificate', label: 'Certificates', Icon: Award },
  { key: 'pgDiploma', label: 'PG Diplomas', Icon: ScrollText },
]

const easeOutCubic = (t) => 1 - (1 - t) ** 3

function subscribeReducedMotion(onChange) {
  const mq = window.matchMedia(REDUCED_MOTION)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  )
}

// true once the element is at least `threshold` visible; never goes back to false
function useInViewOnce(ref, threshold) {
  // Without IntersectionObserver (very old browsers), just show everything straight away
  const [inView, setInView] = useState(() => typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    const el = ref.current
    if (!el || inView) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, threshold, inView])

  return inView
}

// Counts 0 -> target once `run` turns true (easeOutCubic). With `instant`, jumps straight to target.
function useCountUp(target, run, instant) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!run || instant) return
    let frame
    let start
    const tick = (now) => {
      start ??= now
      const progress = Math.min((now - start) / COUNT_DURATION, 1)
      setValue(Math.round(easeOutCubic(progress) * target))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, run, instant])

  return instant ? target : value
}

const cardBase =
  'relative flex flex-col items-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-7 text-center shadow-[0_18px_40px_-24px_color-mix(in_srgb,var(--color-teal-brand)_55%,transparent)] backdrop-blur-md sm:px-6 sm:py-9'

function StatCard({ label, Icon, target, run, reducedMotion }) {
  const value = useCountUp(target, run, reducedMotion)

  return (
    <div
      className={`${cardBase} transition-[border-color,box-shadow] duration-300 hover:border-teal-brand/50 hover:shadow-glow`}
    >
      {/* Faint teal glow at the top of each card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-10 h-24 bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--color-teal-brand)_22%,transparent),transparent_70%)]"
      />
      <span className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-teal-brand/30 bg-teal-brand/10 text-teal-brand">
        <Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
      </span>
      <div className="relative mt-4 bg-linear-to-r from-teal-brand to-cyan-glow bg-clip-text font-display text-4xl font-bold tabular-nums text-transparent sm:text-5xl">
        {/* Screen readers get the final number, not every frame of the count */}
        <span aria-hidden="true">
          {numberFormat.format(value)}+
        </span>
        <span className="sr-only">{numberFormat.format(target)}+</span>
      </div>
      <div className="relative mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300 sm:text-xs">
        {label}
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className={cardBase} aria-hidden="true">
      <span className="h-11 w-11 rounded-xl bg-white/[0.07]" />
      <span className="mt-4 h-10 w-24 rounded-lg bg-white/[0.07] sm:h-12" />
      <span className="mt-3 h-3 w-20 rounded bg-white/[0.07]" />
      {/* Shimmer sweep */}
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/[0.07] to-transparent motion-safe:animate-shimmer" />
    </div>
  )
}

function StatsCounter() {
  const { stats, loading } = useCourseStats()
  const sectionRef = useRef(null)
  const inView = useInViewOnce(sectionRef, 0.3)
  const reducedMotion = usePrefersReducedMotion()

  return (
    <section
      ref={sectionRef}
      aria-labelledby="course-stats-heading"
      aria-busy={loading}
      className="relative overflow-hidden bg-neuro-dark py-16 text-white md:py-20"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 dot-grid-dark" />

      <div className="relative mx-auto max-w-[1140px] px-4 sm:px-6">
        <div className="text-center">
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-teal-brand">
            <span aria-hidden="true" className="h-px w-8 bg-teal-brand" />
            By the numbers
            <span aria-hidden="true" className="h-px w-8 bg-teal-brand" />
          </span>
          <h2
            id="course-stats-heading"
            className="mt-5 font-display text-3xl font-bold leading-tight tracking-tight md:text-4xl"
          >
            Programs across{' '}
            <span className="bg-linear-to-r from-teal-brand to-cyan-glow bg-clip-text text-transparent">
              Medical Global Academy
            </span>
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 md:mt-12 lg:grid-cols-4">
          {cards.map((card, i) => (
            <div
              key={card.key}
              // Cards stay hidden until the section is on screen, then fade/slide up in turn
              className={inView ? 'motion-safe:animate-fade-up' : 'motion-safe:opacity-0'}
              style={inView ? { animationDelay: `${i * STAGGER}ms` } : undefined}
            >
              {loading ? (
                <SkeletonCard />
              ) : (
                <StatCard
                  label={card.label}
                  Icon={card.Icon}
                  target={stats[card.key]}
                  run={inView}
                  reducedMotion={reducedMotion}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsCounter
