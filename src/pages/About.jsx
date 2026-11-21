import { Link } from 'react-router-dom'
import StatsCounter from '../components/StatsCounter.jsx'
import ValuesSection from '../components/ValuesSection.jsx'
import { PHONE_HREF } from '../data/siteLinks.js'

// Gradient text for highlighted words: teal-ink to violet on light backgrounds, teal to cyan on dark
const gradientLight = 'bg-linear-to-r from-teal-ink to-violet-brand bg-clip-text text-transparent'
const gradientDark = 'bg-linear-to-r from-teal-brand to-cyan-glow bg-clip-text text-transparent'

// TODO: verify these company numbers before launch.
// icon = SVG path(s) drawn on a 24x24 grid (stroke icons)
const stats = [
  {
    icon: 'M6 3v6a4 4 0 008 0V3 M10 13v3a5 5 0 0010 0v-2 M20 14a2 2 0 100-4 2 2 0 000 4z',
    value: '200+',
    label: 'Practicing Physicians',
  },
  {
    icon: 'M4 19.5A2.5 2.5 0 016.5 17H20 M4 19.5A2.5 2.5 0 006.5 22H20V2H6.5A2.5 2.5 0 004 4.5v15z',
    value: '150+',
    label: 'Specialized Programs',
  },
  {
    icon: 'M6 18h8 M3 22h18 M14 22a7 7 0 100-14h-1 M9 14h2 M9 12a2 2 0 01-2-2V6h6v4a2 2 0 01-2 2z M12 6V3a1 1 0 00-1-1H9a1 1 0 00-1 1v3',
    value: '25+',
    label: 'Medical Specializations',
  },
  {
    icon: 'M12 3L2 8l10 5 10-5-10-5z M6 10.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-5.5',
    value: '10K+',
    label: 'Students Trained',
  },
  {
    // Calendar
    icon: 'M3 5h18v16H3z M3 10h18 M8 3v4 M16 3v4',
    value: '2020',
    label: 'Founded',
  },
]

// Company-wide specialties (Medical Global Academy teaches all of these); Neurology is listed first on this site.
const specialties = [
  'Neurology',
  'Cardiology',
  'Medicine',
  'Oncology',
  'Nephrology',
  'Orthopedics',
  'Obstetrics & Gynecology',
]

// Hero "What we offer" tiles. Each line restates the hero copy; no new claims.
const offerings = [
  {
    title: 'PG Diplomas',
    line: 'Built for the professional development of healthcare practitioners.',
    icon: 'M12 3L2 8l10 5 10-5-10-5z M6 10.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-5.5',
    delay: '[animation-delay:350ms]',
  },
  {
    title: 'Fellowships',
    line: 'Flexible learning with attending and non-attending classes.',
    icon: 'M12 15a4 4 0 100-8 4 4 0 000 8z M9 14.5L8 21l4-2 4 2-1-6.5',
    delay: '[animation-delay:425ms]',
  },
  {
    title: 'Certificates',
    line: 'Pursue your education at your convenience, without compromising on quality.',
    icon: 'M6 3h9l4 4v14H6z M14 3v5h5 M9 13h7 M9 17h5',
    delay: '[animation-delay:500ms]',
  },
]

const recognitions = ['CPD Accredited', 'ACTD Accredited', 'Global Recognition', 'Established 2020']

// Teaching approach strip. Describes how the programs are delivered; no outcome claims.
const approach = [
  {
    title: 'Case-Based Learning',
    line: 'Topics are taught through clinical cases, from presentation to management.',
    icon: 'M9 4h6v3H9z M7 5H5v15h14V5h-2 M9 12h6 M9 16h4',
  },
  {
    title: 'Specialist-Led Faculty',
    line: 'Sessions are led by experienced specialists in the field.',
    icon: 'M16 19v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1 M9.5 10a3 3 0 100-6 3 3 0 000 6z M21 19v-1a4 4 0 00-3-3.87 M16 4.13a3 3 0 010 5.74',
  },
  {
    title: 'Flexible Online Access',
    line: 'Live and recorded sessions you can fit around clinical work.',
    icon: 'M3 5h18v11H3z M8 20h8 M12 16v4',
  },
  {
    title: 'Certification',
    line: 'A certificate on completion, from a CPD and ACTD accredited provider.',
    icon: 'M12 15a6 6 0 100-12 6 6 0 000 12z M8.2 13.9L7 22l5-3 5 3-1.2-8.1',
  },
]

// line = topic summary only (what the area covers), no claims about the programs
const specializations = [
  {
    title: 'Clinical Neurology',
    line: 'Neurological examination, localisation and common presentations.',
    // Brain seen from above: two hemispheres
    icon: 'M11 4.5a3 3 0 00-5.2 1.7A3 3 0 003.5 11a3 3 0 001.2 4.6A3 3 0 009 19.5h2z M13 4.5a3 3 0 015.2 1.7 3 3 0 012.3 4.8 3 3 0 01-1.2 4.6 3 3 0 01-4.3 3.9h-2z M7.5 10.5h2 M14.5 13.5h2',
  },
  {
    title: 'Stroke Medicine',
    line: 'Acute stroke assessment, treatment pathways and secondary prevention.',
    // Head in profile with a lightning bolt ("brain attack")
    icon: 'M15 21v-3.5a6.5 6.5 0 10-9.6-5.7L3.5 15.5h2.3V19H9 M13.5 7l-2.5 3.5h3l-2.5 3.5',
  },
  {
    title: 'Epilepsy & EEG',
    line: 'Seizure types, management and EEG interpretation.',
    // Spike-and-wave trace
    icon: 'M2 13c1.5 0 1.5-3 3-3s1.5 3 3 3 M8 13l1.5-8 1.5 13 1.5-7 M12.5 11c1.2 0 1.2 2 2.5 2s1.5-3 3-3 1.5 3 4 3',
  },
  {
    title: 'Neuromuscular (EMG/NCV)',
    line: 'Nerve conduction studies and EMG for neuromuscular presentations.',
    // Neuron: cell body, dendrites and axon
    icon: 'M12 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5z M10 5L6.5 3 M14 5l3.5-2 M9.7 7.6L6 9 M14.3 7.6L18 9 M12 9v7 M12 16l-3.5 5 M12 16l3.5 5 M10 14h4',
  },
  {
    title: 'Headache & Movement Disorders',
    line: 'Primary headache, tremor, Parkinsonism and related conditions.',
    // Head with pain rays
    icon: 'M12 18a5 5 0 100-10 5 5 0 000 10z M12 2.5v2.5 M5.3 5.3l1.7 1.7 M18.7 5.3L17 7 M2.5 13H5 M19 13h2.5 M10 13h.01 M14 13h.01 M10.5 15.5h3',
  },
]

// "How it works" steps. Describes the enrolment path only; no outcome claims.
const steps = [
  {
    title: 'Choose your program',
    line: 'Browse Fellowship, PG Diploma and Certificate options in neurology.',
    icon: 'M11 19a8 8 0 100-16 8 8 0 000 16z M21 21l-4.35-4.35',
  },
  {
    title: 'Enroll online',
    line: 'Pick the attending or non-attending format that suits your schedule.',
    icon: 'M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M19 8v6 M22 11h-6',
  },
  {
    title: 'Learn your way',
    line: 'Online learning, live faculty-led sessions and recorded sessions where available.',
    icon: 'M3 5h18v11H3z M8 20h8 M12 16v4 M10 8.5v4l3.5-2-3.5-2z',
  },
  {
    title: 'Get certified',
    line: 'Complete your program and receive your certification.',
    icon: 'M12 15a6 6 0 100-12 6 6 0 000 12z M8.2 13.9L7 22l5-3 5 3-1.2-8.1',
  },
]

// Mission / vision pair shown in the closing dark section
const missionVision = [
  {
    label: 'Our Mission',
    text: 'To equip healthcare professionals with the neurology knowledge, clinical judgement and confidence they need to deliver better care for every patient they treat.',
    // Target
    icon: 'M12 21a9 9 0 100-18 9 9 0 000 18z M12 17a5 5 0 100-10 5 5 0 000 10z M12 13a1 1 0 100-2 1 1 0 000 2z',
  },
  {
    label: 'Our Vision',
    text: 'To be a trusted name in neurology education, helping every doctor diagnose and treat neurological conditions with confidence.',
    // Eye
    icon: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z M12 15a3 3 0 100-6 3 3 0 000 6z',
  },
]

// Eligibility groups. Degree lists as supplied by the academic team.
// TODO: confirm these apply to every neurology program, or link to per-course eligibility.
const eligibility = [
  {
    group: 'NMC',
    degrees: ['MBBS', 'MD', 'MS', 'DGO', 'DCH', 'DNB', 'DM', 'MCh'],
    // Stethoscope (same icon as the "Practicing Physicians" stat)
    icon: 'M6 3v6a4 4 0 008 0V3 M10 13v3a5 5 0 0010 0v-2 M20 14a2 2 0 100-4 2 2 0 000 4z',
  },
  {
    group: 'AYUSH',
    degrees: ['BAMS', 'BHMS', 'BUMS'],
    // Leaf
    icon: 'M11 20A7 7 0 014 13c0-5 4-9 16-10-1 12-5 16-10 16z M4 21c4-4 7-7 11-11',
  },
  {
    group: 'Dental',
    degrees: ['BDS', 'MDS'],
    // Tooth
    icon: 'M12 5.5C10.5 4 8.5 3 6.5 3.5 4 4.2 3.5 7 4 9.5c.5 2.6 1.5 4.5 2 7 .4 2 1 4 2.3 4 1.6 0 1.7-3.5 2.2-5 .3-1 .7-1.5 1.5-1.5s1.2.5 1.5 1.5c.5 1.5.6 5 2.2 5 1.3 0 1.9-2 2.3-4 .5-2.5 1.5-4.4 2-7 .5-2.5 0-5.3-2.5-6-2-.5-4 .5-5.5 2z',
  },
]

const learningModes = [
  {
    label: 'Live Online Classes',
    icon: 'M3 5h18v11H3z M8 20h8 M12 16v4 M10 8.5v4l3.5-2-3.5-2z',
  },
  {
    label: 'Self-Paced Learning',
    icon: 'M12 21a9 9 0 100-18 9 9 0 000 18z M12 7v5l3 2',
  },
  {
    label: 'Clinical Mentorship',
    icon: 'M16 19v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1 M9.5 10a3 3 0 100-6 3 3 0 000 6z M21 19v-1a4 4 0 00-3-3.87 M16 4.13a3 3 0 010 5.74',
  },
]

function Icon({ path, className = 'h-5 w-5', strokeWidth = 1.8 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  )
}

// Thin teal line + small caps label, used above section headings
function Eyebrow({ children, light = false, center = false }) {
  const tone = light ? 'text-teal-brand' : 'text-teal-ink'
  const line = light ? 'bg-teal-brand' : 'bg-teal-ink'
  return (
    <span className={`inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] ${tone}`}>
      <span aria-hidden="true" className={`h-px w-8 ${line}`} />
      {children}
      {center && <span aria-hidden="true" className={`h-px w-8 ${line}`} />}
    </span>
  )
}

function AccentRule({ center = false }) {
  return (
    <div
      aria-hidden="true"
      className={`mt-5 h-1 w-14 rounded-full bg-linear-to-r from-teal-brand to-violet-brand ${center ? 'mx-auto' : ''}`}
    />
  )
}

function EegTrace({ className = '' }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-x-0 bottom-0 h-24 w-full text-teal-brand ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    >
      <path d="M0 55 C3.3 54.3 13.3 51.2 20 51 C26.7 50.8 33.3 54 40 54 C46.7 54 53.3 50.2 60 51 C66.7 51.8 73.3 54.5 80 59 C86.7 63.5 93.3 75.5 100 78 C106.7 80.5 113.3 77.7 120 74 C126.7 70.3 133.3 59.7 140 56 C146.7 52.3 153.3 52.5 160 52 C166.7 51.5 173.3 53.8 180 53 C186.7 52.2 193.3 46.2 200 47 C206.7 47.8 213.3 52.8 220 58 C226.7 63.2 233.3 75.3 240 78 C246.7 80.7 253.3 77.3 260 74 C266.7 70.7 273.3 61 280 58 C286.7 55 293.3 56.8 300 56 C306.7 55.2 313.3 54.8 320 53 C326.7 51.2 333.3 44.5 340 45 C346.7 45.5 353.3 51 360 56 C366.7 61 373.3 72.5 380 75 C386.7 77.5 393.3 73.7 400 71 C406.7 68.3 413.3 59.8 420 59 C426.7 58.2 433.3 68.2 440 66 C446.7 63.8 453.3 49.2 460 46 C466.7 42.8 473.3 42.2 480 47 C486.7 51.8 493.3 75.2 500 75 C506.7 74.8 513.3 46.2 520 46 C526.7 45.8 533.3 69.7 540 74 C546.7 78.3 553.3 76 560 72 C566.7 68 573.3 51.8 580 50 C586.7 48.2 593.3 60.5 600 61 C606.7 61.5 613.3 53.8 620 53 C626.7 52.2 633.3 54.2 640 56 C646.7 57.8 653.3 62.8 660 64 C666.7 65.2 673.3 63.5 680 63 C686.7 62.5 693.3 61.2 700 61 C706.7 60.8 713.3 62.3 720 62 C726.7 61.7 733.3 60 740 59 C746.7 58 753.3 56.2 760 56 C766.7 55.8 773.3 57 780 58 C786.7 59 793.3 61.3 800 62 C806.7 62.7 813.3 61.8 820 62 C826.7 62.2 833.3 63.7 840 63 C846.7 62.3 853.3 58.2 860 58 C866.7 57.8 873.3 61.5 880 62 C886.7 62.5 893.3 64.7 900 61 C906.7 57.3 913.3 37.5 920 40 C926.7 42.5 933.3 71.8 940 76 C946.7 80.2 953.3 69 960 65 C966.7 61 973.3 50.8 980 52 C986.7 53.2 993.3 71 1000 72 C1006.7 73 1013.3 61.8 1020 58 C1026.7 54.2 1033.3 49.5 1040 49 C1046.7 48.5 1053.3 52.8 1060 55 C1066.7 57.2 1073.3 60.7 1080 62 C1086.7 63.3 1093.3 62.2 1100 63 C1106.7 63.8 1113.3 65.7 1120 67 C1126.7 68.3 1133.3 72.3 1140 71 C1146.7 69.7 1153.3 63.3 1160 59 C1166.7 54.7 1173.3 46.2 1180 45 C1186.7 43.8 1196.7 50.8 1200 52" />
    </svg>
  )
}

// Faint neuron network behind the "Credibility & Recognition" card
function NeuronPattern() {
  const pts = [
    [40, 60], [120, 30], [200, 80], [290, 40], [360, 100], [320, 190], [230, 160], [140, 210], [60, 170], [380, 260], [260, 270],
  ]
  const links = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 2], [6, 7], [7, 8], [8, 0], [5, 9], [6, 10], [10, 9], [1, 6]]
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <g className="stroke-white" strokeOpacity="0.08" strokeWidth="1">
        {links.map(([a, b]) => (
          <line key={`${a}-${b}`} x1={pts[a][0]} y1={pts[a][1]} x2={pts[b][0]} y2={pts[b][1]} />
        ))}
      </g>
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 3.5 : 2.2} className="fill-cyan-glow" fillOpacity={i % 3 === 0 ? 0.3 : 0.18} />
      ))}
    </svg>
  )
}

// 2-column list: icon, title and one line per item, separated by thin lines
function IconList({ items }) {
  return (
    <ul className="grid grid-cols-1 gap-x-12 border-t border-slate-200 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item.title} className="group flex items-start gap-4 border-b border-slate-200 py-5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-teal-brand/10 text-teal-ink ring-1 ring-teal-brand/20 transition-colors duration-300 group-hover:bg-teal-brand group-hover:text-ink">
            <Icon path={item.icon} />
          </span>
          <span className="min-w-0">
            <span className="block font-display font-semibold text-ink">{item.title}</span>
            <span className="mt-1 block text-sm leading-snug text-slate-600">{item.line}</span>
          </span>
        </li>
      ))}
    </ul>
  )
}

function OfferingsBlock() {
  return (
    <div className="mt-10">
      <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-teal-brand motion-safe:animate-fade-up [animation-delay:300ms]">
        What we offer
        <span className="h-px flex-1 bg-linear-to-r from-teal-brand/40 to-transparent" />
      </p>

      <ul className="mt-5 space-y-3">
        {offerings.map((item) => (
          <li key={item.title} className={`motion-safe:animate-fade-up ${item.delay}`}>
            <Link
              to="/courses"
              className="group relative flex items-center gap-4 overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-brand/50 hover:bg-white/[0.07] hover:shadow-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-brand"
            >
              {/* Teal edge appears on hover */}
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-0.5 origin-top scale-y-0 bg-linear-to-b from-teal-brand to-cyan-glow transition-transform duration-300 group-hover:scale-y-100"
              />
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-teal-brand/15 text-teal-brand ring-1 ring-teal-brand/40 transition-colors duration-300 group-hover:bg-teal-brand group-hover:text-ink">
                <Icon path={item.icon} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-base font-semibold text-white">{item.title}</span>
                <span className="mt-0.5 block text-xs leading-snug text-slate-300">{item.line}</span>
              </span>
              <span className="shrink-0 text-teal-brand/60 transition-all duration-300 group-hover:translate-x-1 group-hover:text-teal-brand">
                <Icon path="M9 6l6 6-6 6" className="h-4 w-4" strokeWidth={2} />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <Link
        to="/courses"
        className="group mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-teal-brand px-7 text-sm font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-cyan-glow hover:shadow-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-glow focus-visible:ring-offset-2 focus-visible:ring-offset-ink sm:w-auto motion-safe:animate-fade-up [animation-delay:575ms]"
      >
        Explore Courses
        <svg viewBox="0 0 20 20" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 10h12 M11 5l5 5-5 5" />
        </svg>
      </Link>
    </div>
  )
}

function About() {
  return (
    <div className="font-body text-body">
      {/* 1. Hero */}
      {/* overflow-clip, not overflow-hidden: hidden would make this section the sticky
          column's scroll container, so the column would never stick to the viewport */}
      <section className="relative overflow-clip bg-neuro-dark text-white">
        {/* Dot grid, faded towards the edges */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 dot-grid-dark" />
        <EegTrace className="opacity-[0.12]" />

        {/* Navbar is sticky (in flow) here, so the top padding is just the gap below it */}
        <div className="relative mx-auto grid max-w-[1140px] grid-cols-1 gap-10 px-4 pt-5 pb-16 sm:px-6 md:pt-8 md:pb-20 lg:grid-cols-[5fr_7fr] lg:gap-16 lg:pt-10">
          {/* Left: label, heading, offerings + CTA (sticky on desktop).
              top = 85px navbar + the same 40px gap it starts with, so it doesn't jump when it sticks */}
          <div className="lg:sticky lg:top-31 lg:self-start">
            <div className="flex items-center gap-3 motion-safe:animate-fade-up">
              <span className="h-px w-8 shrink-0 bg-teal-brand sm:w-12" />
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-brand">
                About Us
              </span>
            </div>
            <h1
              className="mt-6 font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.25rem] motion-safe:animate-fade-up [animation-delay:100ms]"
            >
              About Medical
              <span className={`block ${gradientDark}`}>Global Academy</span>
            </h1>

            <div className="mt-6 flex items-center gap-4 text-teal-brand motion-safe:animate-fade-up [animation-delay:200ms]">
              <span className="h-px w-8 shrink-0 bg-teal-brand/50" />
              <span className="text-[11px] font-semibold tracking-[0.2em] sm:text-xs">
                TRUSTED · ACCREDITED · CAREER FOCUSED
              </span>
            </div>

            <OfferingsBlock />
          </div>

          {/* Right: story */}
          {/* TODO: verify the "200 doctors" and "150 programs" figures in this story (same as the stat cards). */}
          <div className="space-y-6 text-left text-base leading-relaxed text-slate-300 md:text-lg">
            <div className="relative rounded-xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur motion-safe:animate-fade-up [animation-delay:200ms] md:p-8">
              {/* Teal quote mark */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-5 left-6 select-none font-display text-7xl leading-none text-teal-brand/50"
              >
                &ldquo;
              </span>
              <p className="text-lg text-white md:text-xl">
                Medical Global Academy is a leading platform for medical education in India, trusted
                by more than 200 doctors and recognized for its commitment to excellence in
                healthcare training. Our courses are{' '}
                <strong className="font-semibold text-cyan-glow">CPD &amp; ACTD accredited</strong>,
                ensuring high standards and credibility.
              </p>
            </div>
            <p className="motion-safe:animate-fade-up [animation-delay:300ms]">
              We offer a diverse range of programs, including{' '}
              <strong className="font-medium text-white">PG Diplomas</strong>,{' '}
              <strong className="font-medium text-white">Fellowships</strong>, and{' '}
              <strong className="font-medium text-white">Certificates</strong>, designed to meet the
              professional development needs of healthcare practitioners. Our extensive course
              catalog spans over 150 programs covering specialties such as Neurology, Cardiology,
              Medicine, Oncology, Nephrology, Orthopedics, Obstetrics &amp; Gynecology, and many
              more. Whether you are seeking to enhance your expertise in a specific field or broaden
              your medical knowledge, Medical Global Academy has a course tailored to your goals.
            </p>
            <ul
              aria-label="Specialties"
              className="flex flex-wrap gap-2 motion-safe:animate-fade-up [animation-delay:350ms]"
            >
              {specialties.map((name) => (
                <li
                  key={name}
                  className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/90 transition-colors duration-300 hover:border-teal-brand/60 hover:text-white sm:text-sm"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-brand" aria-hidden="true" />
                  {name}
                </li>
              ))}
            </ul>
            <p className="motion-safe:animate-fade-up [animation-delay:400ms]">
              Understanding the demanding schedules of medical professionals, we provide{' '}
              <strong className="font-medium text-white">flexible learning</strong> options with both
              attending and non-attending classes. This ensures that you can pursue your education
              at your convenience without compromising on quality.
            </p>
            <p className="border-l-2 border-teal-brand/60 pl-5 motion-safe:animate-fade-up [animation-delay:500ms]">
              At Medical Global Academy, we are committed to empowering healthcare professionals
              with the knowledge and skills needed to excel in their careers and contribute to
              improved patient outcomes. Join us to advance your medical journey with courses
              designed to inspire growth, innovation, and excellence in healthcare.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Stat strip */}
      <section className="relative bg-white px-4 pt-16 sm:px-6 md:pt-20">
        {/* 1px gaps over a slate background draw the dividers, so any tile count works */}
        <div className="mx-auto grid max-w-[1140px] grid-cols-2 gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 shadow-card md:grid-cols-5">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              // Odd tile out on mobile spans the full row
              className={`flex flex-col items-center bg-white px-4 py-8 text-center md:py-10 ${
                i === stats.length - 1 && stats.length % 2 === 1 ? 'col-span-2 md:col-span-1' : ''
              }`}
            >
              <span className="text-teal-ink">
                <Icon path={stat.icon} className="h-6 w-6" />
              </span>
              <div className="mt-3 font-display text-4xl font-bold text-teal-ink lining-nums md:text-5xl">
                {stat.value}
              </div>
              <div className="mt-2 text-sm font-medium text-slate-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Who we are: visual card on the left (desktop), text on the right */}
      <section className="relative overflow-hidden bg-white py-20 md:py-24">
        <div className="relative mx-auto grid max-w-[1140px] grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
          <div className="lg:order-2">
            <Eyebrow>Who We Are</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-bold leading-[1.15] tracking-tight text-ink md:text-4xl">
              Advancing Neurology Education for{' '}
              <span className={gradientLight}>Modern Healthcare</span>
            </h2>
            <AccentRule />
            {/* TODO: confirm the faculty claim ("experienced specialists") with the academic team. */}
            <p className="mt-6 leading-relaxed text-slate-600">
              Since 2020, Medical Global Academy has been helping doctors build their clinical
              practice, grounded in a commitment to clinical excellence. Our neurology programs
              are shaped around what doctors meet in everyday practice, from
              acute stroke and seizures to headache, movement disorders and neuromuscular disease,
              with teaching from experienced specialists.
            </p>
            <p className="mt-4 leading-relaxed text-slate-600">
              We aim to bridge the gap between general medical training and neurology
              specialisation, giving MBBS graduates and practising physicians a structured,
              case-based path to build confidence in neurological assessment, EEG and EMG
              interpretation, and neuro-imaging.
            </p>
          </div>

          <div className="relative lg:order-1">
            {/* Teal glow behind the card */}
            <div
              aria-hidden="true"
              className="absolute -inset-4 rounded-[2rem] bg-[radial-gradient(circle_at_40%_40%,color-mix(in_srgb,var(--color-teal-brand)_22%,transparent),transparent_70%)] blur-2xl"
            />
            <div className="relative overflow-hidden rounded-xl border border-violet-brand/30 bg-linear-to-br from-indigo-deep from-40% to-violet-brand p-8 text-white shadow-glow md:p-10">
              <NeuronPattern />
              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-teal-brand text-ink">
                  <Icon
                    path="M3 21h18 M5 21V10 M19 21V10 M9 21V10 M15 21V10 M2 10l10-6 10 6"
                    className="h-7 w-7"
                  />
                </div>
                <h3 className="mt-6 font-display text-2xl font-semibold">Credibility &amp; Recognition</h3>
                <p className="mt-4 leading-relaxed text-white">
                  Our programs carry CPD and ACTD accreditation, so the qualifications you earn are
                  recognised and support your continuing professional development wherever you practise.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  {recognitions.map((r) => (
                    <span
                      key={r}
                      className="inline-flex items-center gap-1.5 rounded-md border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white"
                    >
                      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-cyan-glow" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M3 8.5l3.5 3.5 6.5-7" />
                      </svg>
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <ValuesSection />

      {/* Teaching approach */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-[1140px] px-4 sm:px-6">
          <div className="mb-8 text-center">
            <Eyebrow center>Our Teaching Approach</Eyebrow>
          </div>
          <IconList items={approach} />
        </div>
      </section>

      {/* Our faculty (copy matches the Doctors page intro) */}
      <section className="relative overflow-hidden bg-page py-16 md:py-20">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 dot-grid-light" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Eyebrow center>Our Faculty</Eyebrow>
          <h2 className="mt-4 font-display text-3xl font-bold leading-[1.15] tracking-tight text-ink md:text-4xl">
            Taught by <span className={gradientLight}>Experienced Specialists</span>
          </h2>
          <AccentRule center />
          <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-slate-600 md:text-lg">
            Our faculty teach across the areas doctors meet in everyday neurology practice, from
            stroke, epilepsy and headache to movement disorders and neuromuscular disease, with
            practical guidance on EEG and EMG.
          </p>
        </div>
      </section>

      {/* Live course counts from the MGA course API */}
      <StatsCounter />

      {/* 4. Specializations */}
      <section className="relative overflow-hidden bg-page py-20 md:py-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 dot-grid-light" />
        <div className="relative mx-auto grid max-w-[1140px] grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <div className="lg:sticky lg:top-31 lg:self-start">
            <Eyebrow>Programs</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-bold leading-[1.15] tracking-tight text-ink md:text-4xl">
              High-Demand <span className={gradientLight}>Neurology Specializations</span>
            </h2>
            <AccentRule />
          </div>
          <div>
            <IconList items={specializations} />
            <Link
              to="/courses"
              className="group mt-6 inline-flex items-center gap-2 rounded-md text-sm font-semibold text-teal-ink transition-colors duration-300 hover:text-violet-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-brand focus-visible:ring-offset-2"
            >
              View all programs
              <svg viewBox="0 0 20 20" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 10h12 M11 5l5 5-5 5" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Eligibility: Values-style cards holding Credibility-style chips */}
      <section className="relative overflow-hidden bg-neuro-dark py-20 text-white md:py-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 dot-grid-dark" />
        <div className="relative mx-auto max-w-[1140px] px-4 sm:px-6">
          <div className="text-center">
            <Eyebrow light center>Eligibility</Eyebrow>
            <h2 className="mt-5 font-display text-3xl font-bold tracking-tight md:text-5xl">
              Who Can <span className={gradientDark}>Enroll</span>
            </h2>
          </div>

          <ul className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-5">
            {eligibility.map((g) => (
              <li
                key={g.group}
                className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-teal-brand/50 hover:bg-white/[0.07] hover:shadow-glow"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-brand/15 text-teal-brand ring-1 ring-teal-brand/40 transition-colors duration-300 group-hover:bg-teal-brand group-hover:text-ink">
                  <Icon path={g.icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-6 font-display text-lg font-semibold">{g.group}</h3>
                <ul aria-label={`${g.group} degrees`} className="mt-4 flex flex-wrap gap-2">
                  {g.degrees.map((d) => (
                    <li
                      key={d}
                      className="inline-flex items-center gap-1.5 rounded-md border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white"
                    >
                      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-cyan-glow" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M3 8.5l3.5 3.5 6.5-7" />
                      </svg>
                      {d}
                    </li>
                  ))}
                </ul>
                {/* Bottom accent line grows on hover (as in Our Values) */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-linear-to-r from-teal-brand to-violet-soft transition-transform duration-500 group-hover:scale-x-100"
                />
              </li>
            ))}
          </ul>

          <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-slate-400">
            Eligibility can vary by program. Check the course page for its specific requirements.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-slate-200 bg-white py-20 md:py-24">
        <div className="mx-auto max-w-[1140px] px-4 sm:px-6">
          <div className="text-center">
            <Eyebrow center>How It Works</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-bold leading-[1.15] tracking-tight text-ink md:text-4xl">
              Four Steps to <span className={gradientLight}>Your Certification</span>
            </h2>
            <AccentRule center />
          </div>

          <ol className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {steps.map((step, i) => (
              <li
                key={step.title}
                className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-brand/50"
              >
                {/* Teal-to-violet bar along the top edge */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-teal-brand to-violet-brand opacity-60 transition-opacity duration-300 group-hover:opacity-100"
                />
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-teal-brand/10 text-teal-ink ring-1 ring-teal-brand/20 transition-colors duration-300 group-hover:bg-teal-brand group-hover:text-ink">
                    <Icon path={step.icon} />
                  </span>
                  <span aria-hidden="true" className={`font-display text-3xl font-bold lining-nums ${gradientLight}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="mt-5 font-display font-semibold text-ink">
                  <span className="sr-only">Step {i + 1}: </span>
                  {step.title}
                </h3>
                <p className="mt-1 text-sm leading-snug text-slate-600">{step.line}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 5. Flexible learning */}
      <section className="relative overflow-hidden bg-white py-20 md:py-24">
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink md:text-5xl">
            Designed for <span className={gradientLight}>Working Medical Professionals</span>
          </h2>
          <AccentRule center />
          <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-slate-600 md:text-lg">
            We know doctors don&apos;t have time to step away from practice. Our programs combine
            live sessions, recorded lectures and mentorship so you can build neurology expertise
            on a schedule that works around your shifts.
          </p>

          {/* Connected row: a thin teal line runs through the icons (vertical on mobile) */}
          <ul className="relative mx-auto mt-14 flex max-w-xs flex-col gap-8 text-left sm:max-w-none sm:flex-row sm:justify-between sm:gap-4 sm:text-center">
            <li
              aria-hidden="true"
              className="absolute top-6 bottom-6 left-6 w-px bg-linear-to-b from-teal-brand to-violet-brand sm:top-6 sm:right-[16.66%] sm:bottom-auto sm:left-[16.66%] sm:h-px sm:w-auto sm:bg-linear-to-r"
            />
            {learningModes.map((m) => (
              <li key={m.label} className="group relative flex items-center gap-4 sm:flex-1 sm:flex-col sm:gap-4">
                <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-teal-brand/50 bg-white text-teal-ink transition-all duration-300 group-hover:border-teal-brand group-hover:bg-teal-brand group-hover:text-ink group-hover:shadow-glow">
                  <Icon path={m.icon} className="h-6 w-6" />
                </span>
                <span className="font-display font-semibold text-ink">{m.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6. Mission banner */}
      <section className="relative overflow-hidden bg-neuro-dark py-20 text-white md:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_30%,color-mix(in_srgb,var(--color-teal-brand)_20%,transparent),transparent_70%)]"
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 dot-grid-dark" />
        <EegTrace className="opacity-[0.15]" />

        <div className="relative mx-auto max-w-[1140px] px-4 text-center sm:px-6">
          <Eyebrow light center>Mission &amp; Vision</Eyebrow>
          <h2 className="mt-6 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-6xl">
            Empowering <span className={gradientDark}>Neurology Excellence</span>
          </h2>
          <AccentRule center />

          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-5 text-left md:grid-cols-2 md:gap-6">
            {missionVision.map((item) => (
              <div
                key={item.label}
                className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur transition-all duration-300 hover:border-teal-brand/50 hover:bg-white/[0.07] hover:shadow-glow md:p-8"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-teal-brand/15 text-teal-brand ring-1 ring-teal-brand/40 transition-colors duration-300 group-hover:bg-teal-brand group-hover:text-ink">
                  <Icon path={item.icon} />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold text-white">{item.label}</h3>
                <p className="mt-3 leading-relaxed text-slate-300">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/courses"
              className="group inline-flex h-13 w-full items-center justify-center gap-2 rounded-lg bg-teal-brand px-9 py-3.5 font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-cyan-glow hover:shadow-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-glow focus-visible:ring-offset-2 focus-visible:ring-offset-ink sm:w-auto"
            >
              Explore Programs
              <svg viewBox="0 0 20 20" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 10h12 M11 5l5 5-5 5" />
              </svg>
            </Link>
            <a
              href={PHONE_HREF}
              className="inline-flex h-13 w-full items-center justify-center rounded-lg border border-white/30 px-9 py-3.5 font-semibold text-white transition-colors hover:border-teal-brand hover:text-cyan-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-brand focus-visible:ring-offset-2 focus-visible:ring-offset-ink sm:w-auto"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
