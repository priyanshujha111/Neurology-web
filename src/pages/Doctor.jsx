import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import DoctorCard from '../components/DoctorCard.jsx'
import { neurologyDoctors } from '../data/neurologyDoctors.js'

const ALL = 'All'

// Update doctor names and specialties here.
const doctorDetails = [
  {
    name: 'Dr Sumit',
    department: 'Stroke Neurology',
    specialty: 'Stroke Neurology',
  },
  {
    name: 'Dr Ritik',
    department: 'Epilepsy & EEG',
    specialty: 'Epilepsy & EEG',
  },
  {
    name: 'Dr Ronak',
    department: 'Movement Disorders',
    specialty: 'Movement Disorders',
  },
  {
    name: 'Dr Amit',
    department: 'Neuromuscular & EMG',
    specialty: 'Neuromuscular & EMG',
  },
]

// Preserve the existing card data (images, IDs and other fields),
// while updating the names and specialties shown on this page.
// facultyId is removed so no Faculty ID is shown on the cards.
const displayDoctors = doctorDetails.map((details, index) => {
  const doctor = {
    ...(neurologyDoctors[index] || {}),
    ...details,
    id: neurologyDoctors[index]?.id ?? `neurology-doctor-${index + 1}`,
  }

  delete doctor.facultyId

  return doctor
})

const focusRing =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-brand focus-visible:ring-offset-2'

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px] shrink-0 text-teal-ink"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3 4 6v6c0 4.5 3.2 7.8 8 9 4.8-1.2 8-4.5 8-9V6l-8-3Z" />
      <path d="m9 12 2.2 2.2L15.5 10" />
    </svg>
  )
}

// Faint neural network + EEG line behind the header (decorative)
function HeaderNetwork() {
  const pts = [
    [60, 90],
    [170, 40],
    [270, 110],
    [380, 50],
    [480, 130],
    [600, 60],
    [700, 120],
    [820, 45],
    [930, 105],
    [120, 190],
    [330, 210],
    [560, 200],
    [780, 215],
    [890, 190],
  ]

  const links = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 8],
    [0, 9],
    [9, 2],
    [2, 10],
    [10, 4],
    [4, 11],
    [11, 6],
    [6, 12],
    [12, 8],
    [12, 13],
    [13, 8],
    [1, 3],
    [5, 7],
  ]

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1000 260"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-x-0 top-0 h-64 w-full opacity-60 md:h-72"
    >
      <g
        className="stroke-teal-brand"
        strokeOpacity="0.18"
        strokeWidth="1"
      >
        {links.map(([a, b]) => (
          <line
            key={`${a}-${b}`}
            x1={pts[a][0]}
            y1={pts[a][1]}
            x2={pts[b][0]}
            y2={pts[b][1]}
          />
        ))}
      </g>

      {pts.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={i % 4 === 0 ? 3.5 : 2.2}
          className={
            i % 4 === 0
              ? 'fill-teal-brand'
              : 'fill-violet-brand'
          }
          fillOpacity="0.22"
        />
      ))}

      {/* Decorative EEG trace */}
      <path
        d="M0 240 C30 232 45 248 70 240 S110 226 135 240 S170 252 200 238 S240 222 265 240 S300 250 330 236 S370 228 400 240 S440 252 470 238 S510 224 540 240 S580 250 610 236 S650 228 680 240 S720 252 750 238 S790 224 820 240 S860 250 890 236 S930 228 960 240 S990 246 1000 240"
        fill="none"
        className="stroke-violet-brand"
        strokeOpacity="0.14"
        strokeWidth="1.5"
      />
    </svg>
  )
}

function Doctor() {
  const [department, setDepartment] = useState(ALL)

  useEffect(() => {
    document.title = 'Our Neurologists | Medical Global Academy'
  }, [])

  // Filter departments based on the four displayed doctors.
  const departments = useMemo(
    () => [
      ...new Set(
        displayDoctors
          .map((doctor) => doctor.department)
          .filter(Boolean)
      ),
    ],
    []
  )

  const shown =
    department === ALL
      ? displayDoctors
      : displayDoctors.filter(
          (doctor) => doctor.department === department
        )

  return (
    <div className="font-body text-body">
      <section className="relative overflow-hidden bg-page">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 dot-grid-light"
        />

        <HeaderNetwork />

        <div className="relative mx-auto max-w-[1160px] px-4 pt-5 pb-16 sm:px-6 md:pt-8 md:pb-20 lg:pt-10">
          <header className="mx-auto max-w-2xl pt-6 text-center md:pt-10">
            <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-teal-ink">
              <span
                aria-hidden="true"
                className="h-px w-8 bg-teal-ink"
              />
              Our Medical Experts
              <span
                aria-hidden="true"
                className="h-px w-8 bg-teal-ink"
              />
            </span>

            <h1 className="mt-5 font-display text-[clamp(2rem,4.6vw,3.1rem)] font-bold leading-[1.15] tracking-tight text-ink">
              Meet Our{' '}
              <span className="bg-linear-to-r from-teal-ink to-violet-brand bg-clip-text italic text-transparent">
                Expert Neurologists
              </span>
            </h1>

            <p className="mx-auto mt-4 text-base leading-relaxed text-slate-600 md:text-lg">
              Our faculty teach across the areas doctors meet in
              everyday neurology practice, from stroke, epilepsy and
              headache to movement disorders and neuromuscular disease,
              with practical guidance on EEG and EMG.
            </p>
          </header>

          {/* Department filter */}
          {departments.length > 1 && (
            <div
              role="group"
              aria-label="Filter doctors by department"
              className="mt-10 flex flex-wrap justify-center gap-2 md:mt-12"
            >
              {[ALL, ...departments].map((d) => {
                const active = department === d

                return (
                  <button
                    key={d}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setDepartment(d)}
                    className={`inline-flex h-10 items-center rounded-lg border px-4 text-sm font-semibold transition-colors ${focusRing} ${
                      active
                        ? 'border-indigo-deep bg-indigo-deep text-white'
                        : 'border-slate-300 bg-white text-slate-700 hover:border-teal-brand hover:text-teal-ink'
                    }`}
                  >
                    {d}
                  </button>
                )
              })}
            </div>
          )}

          <p
            role="status"
            aria-live="polite"
            className="mt-6 text-center text-sm text-slate-600"
          >
            Showing {shown.length} of {displayDoctors.length} doctors
          </p>

          {/* Responsive doctor cards */}
          {shown.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-[18px] min-[641px]:grid-cols-2 min-[641px]:gap-6 min-[1001px]:grid-cols-4 [&_.border-dashed]:hidden">
              {shown.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  cover
                />
              ))}
            </div>
          ) : (
            <div className="mx-auto mt-8 max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-card">
              <p className="font-display text-lg font-semibold text-ink">
                No doctors in this department yet
              </p>

              <button
                type="button"
                onClick={() => setDepartment(ALL)}
                className={`mt-5 inline-flex h-11 items-center justify-center rounded-lg bg-teal-brand px-6 text-sm font-semibold text-ink transition-colors hover:bg-cyan-glow ${focusRing}`}
              >
                Show all doctors
              </button>
            </div>
          )}

          {/* Verify credentials before publishing this claim. */}
          <div className="mt-12 flex justify-center md:mt-14">
            <div className="inline-flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-[0.82rem] text-slate-600 shadow-card sm:px-5 sm:text-sm">
              <ShieldIcon />
              <span>
                All doctors are verified · CPD &amp; ACTD accredited
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="relative overflow-hidden bg-neuro-dark py-14 text-white md:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 dot-grid-dark"
        />

        <div className="relative mx-auto flex max-w-[1160px] flex-col items-start gap-6 px-4 sm:px-6 md:flex-row md:items-center md:justify-between">
          <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
            Want to learn from{' '}
            <span className="bg-linear-to-r from-teal-brand to-cyan-glow bg-clip-text text-transparent">
              our faculty?
            </span>
          </h2>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              to="/courses"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-teal-brand px-7 text-sm font-semibold text-ink transition-colors hover:bg-cyan-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-glow focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              View Courses
            </Link>

            <a
              href="tel:+919310027474"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-white/30 px-7 text-sm font-semibold text-white transition-colors hover:border-teal-brand hover:text-cyan-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-brand focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              Talk to Counsellor
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Doctor