import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { Link } from 'react-router-dom'
import ImageLightbox from '../components/ImageLightbox.jsx'
import ProtectedImage from '../components/ProtectedImage.jsx'
import FaqSection from '../components/FaqSection.jsx'
import { neurologyFaqs } from '../data/neurologyFaqs.js'
import DoctorCard from '../components/DoctorCard.jsx'
import { trendingNeurologyCourses } from '../data/neurologyCourses.js'
import { loadNeurologyCourses } from '../data/neurologyCourseApi.js'

// Gradient text for highlighted words: teal-ink to violet on light backgrounds, teal to cyan on dark
const gradientLight = 'bg-linear-to-r from-teal-ink to-violet-brand bg-clip-text text-transparent'
const gradientDark = 'bg-linear-to-r from-teal-brand to-cyan-glow bg-clip-text text-transparent'

const focusRing =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-brand focus-visible:ring-offset-2'

const stats = [
  { value: 12500, suffix: '+', label: 'Happy Students' },
  { value: 25, suffix: '+', label: 'Years Experience' },
  { value: 15, suffix: '+', label: 'Expert Doctors' },
  { value: 98, suffix: '%', label: 'Success Rate' },
]

// Update these entries whenever the faculty list or specialities change.
// Confirm faculty details and IDs before publishing them on the live website.
const neurologyDoctors = [
  { id: 'dr-sumit', name: 'Dr Sumit', specialty: 'Stroke Neurology', facultyId: 'TBD' },
  { id: 'dr-ritik', name: 'Dr Ritik', specialty: 'Epilepsy & EEG', facultyId: 'TBD' },
  { id: 'dr-ronak', name: 'Dr Ronak', specialty: 'Movement Disorders', facultyId: 'TBD' },
  { id: 'dr-amit', name: 'Dr Amit', specialty: 'Neuromuscular & EMG', facultyId: 'TBD' },
]

const hospitals = [
  'Medanta',
  'Fortis',
  'Manipal Hospitals',
  'Jeeban Suraksha Hospital',
  'Max Hospital',
]

const pathwaySteps = [
  {
    num: '01',
    badge: 'STEP 1 · FOUNDATION',
    icon: '🎓',
    title: 'Enroll in Program',
    description:
      'Choose from our neurology certificate and fellowship programs tailored for working medical professionals.',
  },
  {
    num: '02',
    badge: 'STEP 2 · KNOWLEDGE',
    icon: '👨‍⚕️',
    title: 'Learn From Experts',
    description:
      'Learn from experienced neurologists through live and recorded sessions built around real case studies in stroke, epilepsy, headache and movement disorders.',
  },
  {
    num: '03',
    badge: 'STEP 3 · PRACTICE',
    icon: '🩺',
    title: 'Practical Training',
    description:
      'Practise EEG and EMG/NCV interpretation, work through stroke protocols, and apply what you learn to case-based neurology scenarios.',
  },
  {
    num: '04',
    badge: 'STEP 4 · ACHIEVE',
    icon: '📜',
    title: 'Get Certified',
    description:
      'Receive globally recognised certification to advance your medical career and open international opportunities.',
    badges: ['CPD', 'ACTD'],
  },
]

// TODO: add a real outcome figure here (e.g. graduates placed) only once you have neurology data.
const pathwayHighlights = [
  'Case-based learning',
  'Globally recognised',
  'Flexible learning',
  'Expert faculty',
]

// TODO: these are PLACEHOLDER testimonials for layout only, not real reviews.
// Replace every entry with a real, consented review (name, role, hospital, text) before launch.
// name is also the React key, so keep names unique.
// EDIT THESE SAMPLE TESTIMONIALS before publishing.
// Confirm each doctor's actual feedback and permission before displaying it publicly.
const testimonials = [
  {
    quote: 'The learning experience helped me explore neurology topics in a more structured way. I can update this text with my own feedback.',
    name: 'Dr Meet Jha',
    role: 'Medical Professional',
    rating: 5,
  },
  {
    quote: 'The course content was easy to follow, and the practical examples made the topics more engaging. Replace this with the doctor’s approved feedback.',
    name: 'Dr Rishu',
    role: 'Medical Professional',
    rating: 5,
  },
  {
    quote: 'I appreciated the organised learning material and the opportunity to revisit important concepts. Update this with the actual review.',
    name: 'Dr Suraj',
    role: 'Medical Professional',
    rating: 5,
  },
  {
    quote: 'The sessions offered a useful way to review key concepts and connect them with clinical learning. Replace this sample with approved feedback.',
    name: 'Dr Chandramani',
    role: 'Medical Professional',
    rating: 5,
  },
  {
    quote: 'The learning format was clear and convenient to follow alongside my other responsibilities. Edit this text to reflect the real experience.',
    name: 'Dr Neeraj',
    role: 'Medical Professional',
    rating: 5,
  },
  {
    quote: 'The programme gave me an opportunity to revisit important topics and build my understanding step by step. Replace this with the actual review.',
    name: 'Dr Amee',
    role: 'Medical Professional',
    rating: 5,
  },
]
// icon = SVG path(s) drawn on a 24x24 grid (stroke icons)
const features = [
  {
    icon: 'M16 19v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1 M9.5 10a3 3 0 100-6 3 3 0 000 6z M21 19v-1a4 4 0 00-3-3.87 M16 4.13a3 3 0 010 5.74',
    title: 'Expert Faculty',
    description: 'Learn from experienced neurologists who teach from real clinical practice.',
  },
  {
    icon: 'M22 12h-4l-3 9L9 3l-3 9H2',
    title: 'Advanced Training',
    description: 'Case-based modules that go beyond theory into day-to-day decision making.',
  },
  {
    icon: 'M12 15a6 6 0 100-12 6 6 0 000 12z M8.2 13.9L7 22l5-3 5 3-1.2-8.1',
    title: 'Certified Programs',
    description: 'Earn a certificate on completion to support your professional profile.',
  },
  {
    icon: 'M12 21a9 9 0 100-18 9 9 0 000 18z M3 12h18 M12 3a14 14 0 010 18 M12 3a14 14 0 000 18',
    title: 'Global Opportunities',
    description: 'Skills and knowledge that are relevant to neurology practice worldwide.',
  },
  {
    icon: 'M4 19.5A2.5 2.5 0 016.5 17H20 M4 19.5A2.5 2.5 0 006.5 22H20V2H6.5A2.5 2.5 0 004 4.5v15z',
    title: 'Advanced Curriculum',
    description: 'Regularly updated content aligned with current neurology guidelines.',
  },
  {
    icon: 'M3 17l6-6 4 4 8-8 M15 7h6v6',
    title: 'Career Growth',
    description: 'Strengthen your expertise and take the next step in your medical career.',
  },
]

// Bento grid placement, by index into `features`. The first card is the large dark one.
const bentoLayout = [
  'sm:col-span-2 lg:col-span-2 lg:row-span-2',
  'lg:col-span-2',
  '',
  '',
  '',
  'sm:col-span-2 lg:col-span-3',
]

const uploads = 'https://medicalglobalacademy.com/wp-content/uploads'

// All four share one card size (see AccreditationCard); kind picks how the image is fitted.
// width/height are given only for the certificates: the lightbox uses them to scale a
// certificate up to fill the screen, while the logos open at their natural size. To serve a
// sharper certificate in the lightbox, drop it into public/certificates/ and add one line,
// e.g. fullSrc: '/certificates/cpd-certificate.png'.
const accreditations = [
  {
    src: `${uploads}/2026/09/WhatsApp-Image-2026-09-25-at-4.27.09-PM.jpeg`,
    kind: 'logo',
    title: 'CPD Accredited Badge',
    alt: 'Accredited CPD & Training Excellence badge, PDCD1106 Dual Training & CPD Accreditation',
  },
  {
    src: `${uploads}/2026/09/WhatsApp-Image-2026-09-24-at-12.17.06-PM.jpeg`,
    kind: 'logo',
    title: 'ACTD Member Seal',
    alt: 'ACTD — American Council of Training and Development eagle seal',
  },
  {
    src: `${uploads}/2026/10/WhatsApp-Image-2026-10-17-at-10.15.41-AM.jpeg`,
    kind: 'certificate',
    width: 1024,
    height: 726,
    title: 'CPD Accreditation Certificate',
    alt: 'Official Certificate of CPD Accreditation certifying that Medical Global Academy has achieved Dual CPD & Provider of Training Excellence status with The CPD Standards Office, provider number PDCD1106, valid 2026–2028',
  },
  {
    src: `${uploads}/2026/10/WhatsApp-Image-2026-10-17-at-5.58.43-PM.jpeg`,
    kind: 'certificate',
    width: 1600,
    height: 1236,
    title: 'ACTD Certificate of Accreditation',
    alt: 'American Council of Training and Development Certificate of Accreditation certifying Medical Global Academy as an accredited professional training institution, accreditation number GNA452N, valid until September 12, 2027',
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

const checkPath = 'M3 8.5l3.5 3.5 6.5-7'

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
      className={`mt-4 h-1 w-14 rounded-full bg-linear-to-r from-teal-brand to-violet-brand ${center ? 'mx-auto' : ''}`}
    />
  )
}

function AccreditationCard({ item, onOpen, onError }) {
  // Every card is the same 3:2 white tile. The image sits in an absolute box so its intrinsic
  // size can't stretch the card. Logos are centred with white space around them and are only
  // ever scaled down (max-* with auto size); certificates fill the tile with a small even inset.
  const isLogo = item.kind === 'logo'
  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      aria-label={`View ${item.title} in full size`}
      className={`group relative block aspect-[3/2] w-full overflow-hidden rounded-xl border border-slate-200 border-t-2 border-t-teal-brand bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-glow ${focusRing}`}
    >
      <span className={isLogo ? 'absolute inset-0 flex items-center justify-center' : 'absolute inset-2'}>
        <ProtectedImage
          src={item.src}
          alt={item.alt}
          loading="lazy"
          decoding="async"
          onError={() => onError(item.src)}
          className={isLogo ? 'h-auto max-h-[75%] w-auto max-w-[85%] object-contain' : 'h-full w-full object-contain'}
        />
      </span>
      {/* Zoom cue: on hover/focus for mouse users, always visible on touch screens (no hover there). */}
      <span
        aria-hidden="true"
        className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-md bg-ink/85 text-teal-brand opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 sm:right-2 sm:top-2 sm:h-8 sm:w-8 [@media(hover:none)]:opacity-100"
      >
        <svg viewBox="0 0 24 24" className="h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round">
          <path d="M11 18a7 7 0 100-14 7 7 0 000 14z M20 20l-4-4 M11 8v6 M8 11h6" />
        </svg>
      </span>
    </button>
  )
}

function AccreditationSection() {
  const [openItem, setOpenItem] = useState(null)
  const [failed, setFailed] = useState(() => new Set())
  const closeLightbox = useCallback(() => setOpenItem(null), [])

  const markFailed = (src) => setFailed((prev) => new Set(prev).add(src))
  const items = accreditations.filter((a) => !failed.has(a.src))

  if (items.length === 0) return null

  return (
    <section id="accreditation" className="bg-page pt-12 pb-20 md:pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-10 text-center">
          <Eyebrow center>Accreditation</Eyebrow>
          <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-ink md:text-4xl">
            Globally recognised &amp; <span className={gradientLight}>CPD/ACTD</span> aligned
            certification
          </h2>
        </div>

        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 sm:gap-6">
          {items.map((item) => (
            <AccreditationCard key={item.src} item={item} onOpen={setOpenItem} onError={markFailed} />
          ))}
        </div>
      </div>

      <ImageLightbox item={openItem} onClose={closeLightbox} />
    </section>
  )
}

// Positions suit the illustration sitting in the LEFT column on desktop:
// both badges stay inside the hero's padding so nothing is clipped at the page edge.
const heroBadges = [
  {
    title: 'CPD Accredited',
    subtitle: 'The CPD Standards Office',
    position: '-left-3 top-8 sm:-left-8 lg:-left-4 xl:-left-8',
    delay: '',
  },
  {
    title: 'ACTD Aligned',
    subtitle: 'American Council of Training & Development',
    position: '-right-3 bottom-10 sm:-right-8',
    delay: '[animation-delay:1.5s]',
  },
]

const heroTrust = [
  { label: 'CPD Accredited', icon: 'M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z M9 12l2 2 4-4' },
  {
    label: 'Specialist-led Faculty',
    icon: 'M16 19v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1 M9.5 10a3 3 0 100-6 3 3 0 000 6z M21 19v-1a4 4 0 00-3-3.87 M16 4.13a3 3 0 010 5.74',
  },
  { label: 'Online & Flexible', icon: 'M3 5h18v11H3z M8 20h8 M12 16v4' },
  { label: 'Case-based Learning', icon: 'M9 4h6v3H9z M7 5H5v15h14V5h-2 M9 12h6 M9 16h4' },
]

// Hero illustration, drawn on a 400x500 grid (same 4:5 ratio as the card).
// The brain sits in the middle band (y 125–370) so neither floating badge covers it:
// "CPD Accredited" overlaps the top-left corner, "ACTD Aligned" the bottom-right.
const neuroNodes = [
  { x: 60, y: 215, r: 2.5, o: 0.6 },
  { x: 110, y: 175, r: 4, o: 1, hub: true },
  { x: 165, y: 160, r: 2.5, o: 0.7 },
  { x: 215, y: 150, r: 4, o: 1, hub: true },
  { x: 270, y: 145, r: 2.5, o: 0.6 },
  { x: 320, y: 175, r: 3, o: 0.8 },
  { x: 350, y: 230, r: 2.5, o: 0.5 },
  { x: 300, y: 215, r: 4, o: 1, hub: true },
  { x: 245, y: 200, r: 3, o: 0.8 },
  { x: 185, y: 215, r: 4, o: 1, hub: true },
  { x: 135, y: 245, r: 3, o: 0.7 },
  { x: 200, y: 265, r: 2.5, o: 0.6 },
  { x: 265, y: 255, r: 3, o: 0.8 },
  { x: 330, y: 290, r: 2.5, o: 0.5 },
  { x: 90, y: 300, r: 2.5, o: 0.5 },
  { x: 170, y: 330, r: 2.5, o: 0.6 },
  { x: 350, y: 120, r: 2, o: 0.4 },
  { x: 40, y: 380, r: 2, o: 0.4 },
]

// Pairs of indexes into neuroNodes
const neuroLinks = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [5, 7], [7, 6], [7, 8], [8, 3],
  [8, 9], [9, 2], [9, 10], [10, 1], [10, 0], [9, 11], [11, 12], [12, 7], [12, 13],
  [6, 13], [11, 15], [10, 14], [14, 15], [4, 16], [5, 16], [8, 12], [14, 17],
]

// Signals travel along existing links (each path is a chain of neuroLinks)
const neuroSignals = [
  { path: 'M110 175 L165 160 L215 150 L270 145', dur: '2.8s', begin: '0s' },
  { path: 'M60 215 L135 245 L185 215 L245 200 L300 215 L350 230', dur: '4.2s', begin: '1.2s' },
  { path: 'M170 330 L200 265 L265 255 L330 290', dur: '3.2s', begin: '2.4s' },
]

// One 100-unit EEG cycle, repeated so the line can scroll left by exactly one cycle
const eegCycle = 'c4 -14 10 -14 20 0 s8 10 16 0 s8 -20 18 0 s12 8 22 0 s12 -9 24 0'
const eegPath = `M-100 420 ${Array(7).fill(eegCycle).join(' ')}`

// All CSS motion is opt-in (no-preference), so prefers-reduced-motion users get a still image
const neuroStyles = `
@media (prefers-reduced-motion: no-preference) {
  @keyframes mga-neuro-pulse {
    0%, 100% { opacity: 0.35; }
    50% { opacity: 1; }
  }
  @keyframes mga-neuro-halo {
    0%, 100% { opacity: 0.45; transform: scale(0.8); }
    50% { opacity: 1; transform: scale(1.15); }
  }
  @keyframes mga-neuro-eeg {
    from { transform: translateX(0); }
    to { transform: translateX(-100px); }
  }
  .mga-neuro-node { animation: mga-neuro-pulse 3.6s ease-in-out infinite; }
  .mga-neuro-halo {
    transform-box: fill-box;
    transform-origin: center;
    animation: mga-neuro-halo 3.6s ease-in-out infinite;
  }
  .mga-neuro-eeg { animation: mga-neuro-eeg 6s linear infinite; }
}
`

// SMIL (<animateMotion>) ignores CSS media queries, so the travelling signals are only
// rendered when the user hasn't asked for reduced motion.
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

function subscribeReducedMotion(onChange) {
  const mq = window.matchMedia(REDUCED_MOTION)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => true
  )
}

// Gradient stops take the theme colours through CSS variables
const stop = (color, opacity = 1) => ({ stopColor: `var(--color-${color})`, stopOpacity: opacity })

function NeuroIllustration() {
  const reducedMotion = usePrefersReducedMotion()

  return (
    <svg
      viewBox="0 0 400 500"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Illustration of a brain with a network of connected neurons"
      className="absolute inset-0 h-full w-full"
    >
      <style>{neuroStyles}</style>
      <defs>
        <pattern id="mga-neuro-dots" width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" className="fill-white" fillOpacity="0.07" />
        </pattern>
        <radialGradient id="mga-neuro-fade" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <mask id="mga-neuro-dots-mask">
          <rect width="400" height="500" fill="url(#mga-neuro-fade)" />
        </mask>
        <radialGradient id="mga-neuro-glow">
          <stop offset="0%" style={stop('cyan-glow', 0.95)} />
          <stop offset="45%" style={stop('teal-brand', 0.35)} />
          <stop offset="100%" style={stop('teal-brand', 0)} />
        </radialGradient>
        <radialGradient id="mga-neuro-backlight" cx="50%" cy="45%" r="55%">
          <stop offset="0%" style={stop('violet-brand', 0.4)} />
          <stop offset="100%" style={stop('violet-brand', 0)} />
        </radialGradient>
      </defs>

      {/* Background: soft violet backlight + dot grid faded towards the edges */}
      <g aria-hidden="true">
        <rect width="400" height="500" fill="url(#mga-neuro-backlight)" />
        <rect width="400" height="500" fill="url(#mga-neuro-dots)" mask="url(#mga-neuro-dots-mask)" />
      </g>

      {/* Brain, side view (front to the left): cortex, folds, cerebellum, brain stem */}
      <g
        aria-hidden="true"
        fill="none"
        className="stroke-teal-brand"
        strokeOpacity="0.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M95 250 C80 200 105 150 160 135 C200 120 260 125 295 150 C330 172 345 210 335 245 C328 270 305 285 280 288 C250 300 215 300 190 292 C165 300 130 300 110 285 C95 275 92 262 95 250 Z"
          className="fill-ink"
          fillOpacity="0.4"
          strokeWidth="2"
        />
        <g strokeWidth="1.5" strokeOpacity="0.55">
          {/* Central sulcus and lateral (Sylvian) fissure */}
          <path d="M215 130 C210 160 225 185 212 215" />
          <path d="M130 262 C165 245 200 240 245 248" />
          {/* Gyri */}
          <path d="M150 150 C140 175 160 190 145 215" />
          <path d="M260 135 C255 160 275 180 262 205" />
          <path d="M300 165 C290 190 310 210 298 238" />
          <path d="M115 200 C140 205 150 225 175 222" />
          <path d="M180 170 C198 185 185 205 200 225" />
          <path d="M150 280 C175 270 205 272 230 280" />
        </g>
        {/* Cerebellum with a few folia */}
        <path
          d="M250 292 C258 318 298 326 318 308 C332 295 326 276 310 272"
          className="fill-ink"
          fillOpacity="0.4"
          strokeWidth="2"
        />
        <g strokeWidth="1.2" strokeOpacity="0.45">
          <path d="M262 300 C280 310 300 308 314 296" />
          <path d="M270 311 C285 316 300 314 310 306" />
        </g>
        {/* Brain stem */}
        <path d="M232 296 C236 320 238 345 236 370" strokeWidth="2" />
        <path d="M252 300 C254 325 256 348 258 370" strokeWidth="2" />
      </g>

      {/* Neural network */}
      <g aria-hidden="true">
        <g className="stroke-cyan-glow" strokeOpacity="0.22" strokeWidth="1">
          {neuroLinks.map(([a, b]) => (
            <line
              key={`${a}-${b}`}
              x1={neuroNodes[a].x}
              y1={neuroNodes[a].y}
              x2={neuroNodes[b].x}
              y2={neuroNodes[b].y}
            />
          ))}
        </g>
        {neuroNodes.map((n, i) =>
          n.hub ? (
            <circle
              key={`halo-${i}`}
              className="mga-neuro-halo"
              style={{ animationDelay: `${(i * 0.45) % 3.6}s` }}
              cx={n.x}
              cy={n.y}
              r="16"
              fill="url(#mga-neuro-glow)"
            />
          ) : null
        )}
        {neuroNodes.map((n, i) => (
          <circle
            key={`node-${i}`}
            className={`mga-neuro-node ${n.hub ? 'fill-cyan-glow' : i % 3 === 0 ? 'fill-white' : 'fill-violet-soft'}`}
            style={{ animationDelay: `${(i * 0.37) % 3.6}s` }}
            cx={n.x}
            cy={n.y}
            r={n.r}
            fillOpacity={n.o}
          />
        ))}

        {/* Signals firing along the connections */}
        {!reducedMotion &&
          neuroSignals.map((s) => (
            <g key={s.path} opacity="0">
              <circle r="7" fill="url(#mga-neuro-glow)" />
              <circle r="2.5" className="fill-white" />
              <animateMotion path={s.path} dur={s.dur} begin={s.begin} repeatCount="indefinite" />
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.1;0.85;1"
                dur={s.dur}
                begin={s.begin}
                repeatCount="indefinite"
              />
            </g>
          ))}
      </g>

      {/* EEG brainwave across the lower third, scrolling left by one cycle */}
      <g aria-hidden="true" opacity="0.4">
        <path
          className="mga-neuro-eeg stroke-teal-brand"
          d={eegPath}
          fill="none"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  )
}

function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[440px] motion-safe:animate-fade-in [animation-delay:300ms]">
      {/* Teal glow behind the card */}
      <div
        aria-hidden="true"
        className="absolute -inset-6 rounded-[2rem] bg-[radial-gradient(circle_at_50%_40%,color-mix(in_srgb,var(--color-teal-brand)_28%,transparent),transparent_70%)] blur-2xl"
      />
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-teal-brand/30 bg-linear-to-br from-indigo-deep via-ink to-violet-brand/50 shadow-glow">
        <NeuroIllustration />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-ink/60 via-transparent to-transparent"
        />
        {/* Bottom-left so it stays clear of the "ACTD Aligned" badge on the bottom-right */}
        <span className="absolute bottom-3 left-4 rounded-md border border-teal-brand/40 bg-ink/75 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-cyan-glow backdrop-blur sm:bottom-5 sm:left-5 sm:text-xs">
          Brain · Spine · Nerves
        </span>
      </div>

      {heroBadges.map((badge) => (
        <div
          key={badge.title}
          className={`absolute ${badge.position} flex max-w-[210px] items-center gap-3 rounded-xl border border-slate-200 bg-white/95 px-4 py-3 shadow-card backdrop-blur motion-safe:animate-float ${badge.delay}`}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-brand text-ink">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          </span>
          <span className="min-w-0">
            <span className="block font-display text-sm font-semibold text-ink">{badge.title}</span>
            <span className="block text-[11px] leading-snug text-slate-600">{badge.subtitle}</span>
          </span>
        </div>
      ))}
    </div>
  )
}

function CountUp({ end, suffix, start }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!start) return
    const duration = 1800
    let startTime = null
    let frame

    const tick = (time) => {
      if (startTime === null) startTime = time
      const progress = Math.min((time - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * end))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [start, end])

  return (
    <>
      {count.toLocaleString('en-US')}
      {suffix}
    </>
  )
}

function SectionHeading({ children, light = false }) {
  return (
    <div className="text-center mb-12">
      <h2
        className={`font-display text-3xl md:text-4xl font-bold tracking-tight ${
          light ? 'text-white' : 'text-ink'
        }`}
      >
        {children}
      </h2>
      <AccentRule center />
    </div>
  )
}

const starPath = 'M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z'

// Supports decimal ratings (e.g. 4.5) by clipping a teal row over a grey row.
function Stars({ rating }) {
  const pct = Math.max(0, Math.min(5, rating)) * 20
  const row = (
    <div className="flex gap-0.5">
      {[0, 1, 2, 3, 4].map((s) => (
        <svg key={s} viewBox="0 0 20 20" className="h-4 w-4 shrink-0" fill="currentColor" aria-hidden="true">
          <path d={starPath} />
        </svg>
      ))}
    </div>
  )
  return (
    <div className="relative" role="img" aria-label={`${rating} out of 5 stars`}>
      <div className="text-slate-200">{row}</div>
      <div className="absolute inset-y-0 left-0 overflow-hidden text-teal-brand" style={{ width: `${pct}%` }}>
        {row}
      </div>
    </div>
  )
}

function TestimonialCard({ t }) {
  return (
    <article className="mx-3 flex w-[300px] shrink-0 flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-teal-brand/50 hover:shadow-glow sm:w-[340px]">
      {/* Quote mark + rating */}
      <div className="flex items-center justify-between gap-3">
        <svg viewBox="0 0 32 24" className="h-6 w-8 text-violet-brand" fill="currentColor" aria-hidden="true">
          <path d="M0 24V14C0 6.3 4.1 1.6 12.3 0l1.3 3.1C9.3 4.4 7.1 6.9 6.8 10.6H13V24H0zm18 0V14c0-7.7 4.1-12.4 12.3-14l1.3 3.1c-4.3 1.3-6.5 3.8-6.8 7.5H31V24H18z" />
        </svg>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-600">{t.rating}</span>
          <Stars rating={t.rating} />
        </div>
      </div>

      {/* Review */}
      <p className="mt-4 line-clamp-4 flex-1 text-[15px] leading-relaxed text-body">{t.quote}</p>

      <div className="my-5 h-px bg-slate-200" />

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-brand/10 text-violet-brand ring-1 ring-violet-brand/25">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 12a4 4 0 100-8 4 4 0 000 8z" />
            <path d="M4 20v-1a5 5 0 015-5h6a5 5 0 015 5v1" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="truncate font-display font-semibold text-ink">{t.name}</p>
          <p className="truncate text-sm text-slate-500">{t.role}</p>
        </div>
      </div>
    </article>
  )
}

// Endless right-to-left scroll. The list is rendered twice and the track moves by exactly half,
// so the loop is seamless. Pauses on hover. Reduced-motion users get a normal swipeable row.
function TestimonialsMarquee() {
  return (
    <div className="relative">
      <style>{`
        @keyframes mga-testimonials-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .mga-testimonials-track { animation: mga-testimonials-scroll 45s linear infinite; }
        .mga-testimonials-viewport:hover .mga-testimonials-track,
        .mga-testimonials-viewport:focus-within .mga-testimonials-track { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .mga-testimonials-track { animation: none; }
          .mga-testimonials-viewport { overflow-x: auto; }
        }
      `}</style>

      <div className="mga-testimonials-viewport overflow-hidden py-6 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        <div className="mga-testimonials-track flex w-max">
          {testimonials.map((t) => (
            <TestimonialCard key={`a-${t.name}`} t={t} />
          ))}
          {testimonials.map((t) => (
            <div key={`b-${t.name}`} aria-hidden="true" className="flex">
              <TestimonialCard t={t} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const cardClass =
  'flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-teal-brand/50 hover:shadow-glow'

// Course badge colours on this site. The data file's badgeClass is the fallback for any new label.
const badgeTone = {
  TRENDING: 'bg-violet-brand/10 text-indigo-deep ring-1 ring-violet-brand/25',
  TOP: 'bg-teal-brand/10 text-teal-ink ring-1 ring-teal-brand/30',
  NEW: 'bg-cyan-glow/25 text-indigo-deep ring-1 ring-cyan-glow/60',
}

// Live API data picked by slug; badges and fallback descriptions come from neurologyCourses.js.
// Courses that fail to load or aren't found are skipped, and the section hides if none load.
function TrendingCourses() {
  const [cards, setCards] = useState(null) // null while loading

  useEffect(() => {
    let active = true

    loadNeurologyCourses()
      .then((list) => {
        if (!active) return
        setCards(
          trendingNeurologyCourses.flatMap((item) => {
            const course = list.find((c) => c.slug === item.slug)
            if (!course) return []
            return [
              {
                ...item,
                title: course.title,
                fee: course.fee,
                description: course.description || item.description || '',
              },
            ]
          }),
        )
      })
      .catch((err) => {
        if (!active) return
        console.error('Could not load trending courses:', err)
        setCards([])
      })

    return () => {
      active = false
    }
  }, [])

  if (cards && cards.length === 0) return null

  return (
    <section id="courses" className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading>Trending Courses</SectionHeading>
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          aria-busy={cards === null}
        >
          {cards === null
            ? trendingNeurologyCourses.map((item) => (
                <div key={item.slug} aria-hidden="true" className={`${cardClass} animate-pulse`}>
                  <div className="h-1.5 bg-slate-200" />
                  <div className="flex flex-1 flex-col p-6">
                    <div className="h-6 w-20 rounded-md bg-slate-200" />
                    <div className="mt-4 h-6 w-3/4 rounded bg-slate-200" />
                    <div className="mt-3 space-y-2">
                      <div className="h-3.5 rounded bg-slate-100" />
                      <div className="h-3.5 rounded bg-slate-100" />
                      <div className="h-3.5 w-2/3 rounded bg-slate-100" />
                    </div>
                    <div className="mt-5 flex justify-between border-t border-slate-100 pt-4">
                      <div className="h-4 w-24 rounded bg-slate-100" />
                      <div className="h-4 w-16 rounded bg-slate-200" />
                    </div>
                    <div className="mt-6 flex gap-3">
                      <div className="h-9 flex-1 rounded-lg bg-slate-200" />
                      <div className="h-9 flex-1 rounded-lg bg-slate-200" />
                    </div>
                  </div>
                </div>
              ))
            : cards.map((course) => (
                <div key={course.slug} className={cardClass}>
                  <div className="h-1.5 bg-linear-to-r from-teal-brand to-violet-brand" />
                  <div className="flex flex-1 flex-col p-6">
                    <span
                      className={`self-start rounded-md px-2.5 py-1 text-xs font-bold tracking-wider ${badgeTone[course.badge] ?? course.badgeClass}`}
                    >
                      {course.badge}
                    </span>
                    <h3 className="mt-4 font-display text-xl font-semibold text-ink">
                      {course.title}
                    </h3>
                    {/* flex-1 on a wrapper, not the clamped <p>, or a 4th line peeks out below the clamp */}
                    <div className="mt-2 flex-1">
                      <p className="text-sm text-slate-600 line-clamp-3">{course.description}</p>
                    </div>
                    <dl className="mt-5 flex items-baseline justify-between gap-3 border-t border-slate-100 pt-4">
                      <dt className="text-xs text-slate-500">Registration Fee</dt>
                      <dd className="font-display text-base font-semibold text-ink">{course.fee}</dd>
                    </dl>
                    <div className="mt-6 flex gap-3">
                      <Link
                        to={`/courses/${course.slug}`}
                        className={`flex-1 rounded-lg border border-indigo-deep/30 px-4 py-2 text-center text-sm font-semibold text-indigo-deep transition-colors hover:border-indigo-deep hover:bg-indigo-deep hover:text-white ${focusRing}`}
                      >
                        View Details
                      </Link>
                      <Link
                        to={`/courses/${course.slug}#enroll`}
                        className={`flex-1 rounded-lg bg-teal-brand px-4 py-2 text-center text-sm font-semibold text-ink transition-colors hover:bg-cyan-glow ${focusRing}`}
                      >
                        Enroll Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  )
}

// Decorative mini network for the large "Why choose us" card
function BentoNetwork() {
  const pts = [
    [30, 120], [80, 70], [140, 100], [190, 40], [240, 90], [200, 150], [120, 160], [260, 150],
  ]
  const links = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 2], [2, 6], [6, 0], [5, 7], [4, 7], [1, 3]]
  return (
    <svg aria-hidden="true" viewBox="0 0 290 190" className="pointer-events-none absolute top-10 -right-6 w-2/3 max-w-[300px] opacity-50">
      <g className="stroke-teal-brand" strokeOpacity="0.35" strokeWidth="1">
        {links.map(([a, b]) => (
          <line key={`${a}-${b}`} x1={pts[a][0]} y1={pts[a][1]} x2={pts[b][0]} y2={pts[b][1]} />
        ))}
      </g>
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 4 : 2.5} className={i % 3 === 0 ? 'fill-cyan-glow' : 'fill-violet-soft'} />
      ))}
    </svg>
  )
}

function NeurologyHome() {
  const statsRef = useRef(null)
  const [statsVisible, setStatsVisible] = useState(false)
  const [activeDoctor, setActiveDoctor] = useState(null)
  const [blinkCount, setBlinkCount] = useState(0)
  const [activeStep, setActiveStep] = useState(null)

  const selectDoctor = (i) => {
    setActiveDoctor(i)
    setBlinkCount((c) => c + 1)
  }

  useEffect(() => {
    const node = statsRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="font-body text-body">
      {/* 1. Hero */}
      {/* Top padding = fixed navbar height (Navbar is fixed on Home: py-3 + 44px logo + 1px border,
          md: py-4 + 52px logo + 1px border). Change both together. */}
      <section className="relative overflow-hidden bg-neuro-dark pt-17.25 text-white md:pt-21.25">
        {/* Dot grid, faded towards the edges */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 dot-grid-dark" />
        {/* EEG brainwave trace */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 w-full text-teal-brand opacity-[0.15]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        >
          <path d="M0 56 L8 56 L16 58 L24 55 L32 62 L40 67 L48 67 L56 58 L64 54 L72 59 L80 52 L88 61 L96 72 L104 64 L112 59 L120 56 L128 54 L136 53 L144 59 L152 74 L160 64 L168 57 L176 61 L184 49 L192 52 L200 63 L208 70 L216 67 L224 58 L232 61 L240 50 L248 48 L256 68 L264 67 L272 65 L280 64 L288 57 L296 51 L304 49 L312 66 L320 68 L328 61 L336 69 L344 57 L352 45 L360 54 L368 67 L376 68 L384 54 L392 65 L400 75 L408 47 L416 37 L424 62 L432 84 L440 67 L448 45 L456 60 L464 64 L472 54 L480 55 L488 60 L496 71 L504 66 L512 53 L520 55 L528 57 L536 60 L544 61 L552 65 L560 66 L568 55 L576 56 L584 59 L592 57 L600 62 L608 65 L616 63 L624 58 L632 56 L640 59 L648 57 L656 61 L664 65 L672 61 L680 59 L688 59 L696 58 L704 59 L712 61 L720 64 L728 61 L736 59 L744 60 L752 58 L760 58 L768 61 L776 63 L784 61 L792 58 L800 59 L808 63 L816 59 L824 53 L832 60 L840 75 L848 61 L856 41 L864 58 L872 75 L880 61 L888 50 L896 61 L904 69 L912 58 L920 53 L928 60 L936 62 L944 62 L952 61 L960 62 L968 59 L976 53 L984 60 L992 63 L1000 61 L1008 65 L1016 62 L1024 57 L1032 54 L1040 58 L1048 64 L1056 60 L1064 66 L1072 65 L1080 53 L1088 55 L1096 58 L1104 61 L1112 63 L1120 66 L1128 66 L1136 52 L1144 53 L1152 60 L1160 56 L1168 66 L1176 70 L1184 63 L1192 54 L1200 52" />
        </svg>

        {/* Text first in the DOM (and on mobile); on desktop the illustration moves to the left column.
            Extra bottom padding leaves room for the stats strip that overlaps the hero's lower edge. */}
        <div className="relative mx-auto grid w-full max-w-[1280px] grid-cols-1 items-center gap-14 px-4 pt-6 pb-28 sm:px-6 md:pt-10 md:pb-32 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12 lg:pt-12 xl:gap-20 xl:px-8">
          <div className="text-left lg:order-2">
            <div className="mb-6 flex items-center gap-3 motion-safe:animate-fade-up">
              <span className="h-px w-8 shrink-0 bg-teal-brand sm:w-12" />
              <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.14em] text-teal-brand sm:text-xs sm:tracking-[0.25em]">
                Welcome to Medical Global Academy
              </span>
            </div>
            <h1
              className="mb-6 font-display text-[clamp(1.75rem,6vw,3.75rem)] lg:text-[clamp(2.5rem,4.2vw,3.6rem)] font-bold leading-[1.08] tracking-tight motion-safe:animate-fade-up [animation-delay:100ms]"
            >
              {/* One phrase per line; sizes are capped so neither line wraps at any breakpoint */}
              <span className="block">
                Master <span className={gradientDark}>Neurology.</span>
              </span>
              <span className="block">
                Lead with <span className={gradientDark}>Confidence.</span>
              </span>
            </h1>
            <p className="mb-10 max-w-[540px] text-base leading-relaxed text-slate-300 md:text-lg motion-safe:animate-fade-up [animation-delay:200ms]">
              Specialist-led, case-based training in stroke, epilepsy, headache, movement disorders
              and neuromuscular disease, with practical EEG and EMG interpretation. Learn online and
              grow your career with expert guidance.
            </p>
            <div className="flex flex-col justify-start gap-4 sm:flex-row motion-safe:animate-fade-up [animation-delay:300ms]">
              <Link
                to="/courses"
                className="inline-flex w-full items-center justify-center rounded-lg bg-teal-brand px-8 py-3.5 text-sm font-semibold tracking-wide text-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-cyan-glow hover:shadow-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-glow focus-visible:ring-offset-2 focus-visible:ring-offset-ink sm:w-auto"
              >
                Our Courses
              </Link>
              <a
                href="tel:+919310027474"
                className="inline-flex w-full items-center justify-center rounded-lg border border-white/30 px-8 py-3.5 text-sm font-semibold tracking-wide text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-brand hover:text-cyan-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-brand focus-visible:ring-offset-2 focus-visible:ring-offset-ink sm:w-auto"
              >
                Talk to Counsellor
              </a>
            </div>

            <ul className="mt-10 grid max-w-135 grid-cols-2 gap-x-4 gap-y-4 border-t border-white/10 pt-6 motion-safe:animate-fade-up [animation-delay:400ms]">
              {heroTrust.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center gap-2 text-xs text-slate-300 sm:text-sm even:border-l even:border-white/15 even:pl-4"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-teal-brand" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={item.icon} />
                  </svg>
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:order-1">
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* 2. Stats bar: a glass strip that overlaps the bottom of the hero.
          The section's own background is transparent where it overlaps, then page grey below. */}
      <section
        ref={statsRef}
        className="relative z-10 -mt-16 bg-[linear-gradient(to_bottom,transparent_4rem,var(--color-page)_4rem)] px-4 sm:px-6"
      >
        <div className="mx-auto grid max-w-5xl grid-cols-2 overflow-hidden rounded-xl border border-teal-brand/25 bg-indigo-deep/80 shadow-glow backdrop-blur-xl md:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`px-4 py-6 text-center md:py-8 ${i % 2 === 0 ? 'border-r border-white/10' : ''} ${
                i < 2 ? 'border-b border-white/10 md:border-b-0' : ''
              } ${i === 1 ? 'md:border-r' : ''}`}
            >
              <div className="font-display text-3xl font-bold text-teal-brand md:text-4xl">
                <CountUp end={stat.value} suffix={stat.suffix} start={statsVisible} />
              </div>
              <div className="mt-2 text-sm text-slate-300 md:text-base">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Accreditation */}
      <AccreditationSection />

      {/* 4. Doctors preview */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Eyebrow center>Our Medical Experts</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink md:text-5xl">
              Meet Our <span className={gradientLight}>Expert Doctors</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              Our team of experienced neurologists and medical specialists provides advanced
              training and academic excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {neurologyDoctors.map((doctor, i) => (
              <DoctorCard
                key={activeDoctor === i ? `${doctor.id}-${blinkCount}` : doctor.id}
                doctor={doctor}
                selected={activeDoctor === i}
                onSelect={() => selectDoctor(i)}
              />
            ))}
          </div>

          {/* Confirm each doctor's credentials before describing the team as verified. */}
          <p className="mt-10 text-center text-sm text-slate-600">
            All doctors are verified · CPD &amp; ACTD accredited
          </p>
        </div>
      </section>

      {/* 5. Hospital partners */}
      <section className="bg-page py-14 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-center text-xs uppercase tracking-[0.25em] text-slate-600 font-semibold mb-8">
            Our Hospital Partners
          </p>
        </div>
        <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none">
            {[...hospitals, ...hospitals, ...hospitals, ...hospitals].map((name, i) => (
              <span
                key={`${name}-${i}`}
                aria-hidden={i >= hospitals.length}
                className="shrink-0 whitespace-nowrap px-8 font-display text-lg font-semibold text-slate-500 transition-colors hover:text-indigo-deep md:px-12 md:text-xl"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Trending courses */}
      <TrendingCourses />

      {/* 7. Career Pathway — vertical timeline (alternating on desktop, stacked on mobile) */}
      <section className="relative overflow-hidden bg-page py-20 md:py-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 dot-grid-light" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
          {/* Section header */}
          <div className="text-center">
            <Eyebrow center>Career Pathway</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink md:text-5xl">
              Your Path to <span className={gradientLight}>Medical Excellence</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              A structured, four-stage learning journey designed to take medical professionals from
              enrolment to globally recognised certification.
            </p>
          </div>

          <ol className="relative mt-14">
            {/* Timeline line: left on mobile, centred on desktop */}
            <div
              aria-hidden="true"
              className="absolute top-6 bottom-6 left-5 w-0.5 -translate-x-1/2 rounded-full bg-linear-to-b from-teal-brand via-cyan-glow to-violet-brand lg:left-1/2"
            />

            {pathwaySteps.map((step, i) => {
              const isActive = activeStep === i
              const isLast = i === pathwaySteps.length - 1
              const onLeft = i % 2 === 0
              return (
                <li
                  key={step.title}
                  className="relative pb-8 pl-14 last:pb-0 lg:grid lg:grid-cols-2 lg:gap-x-20 lg:pb-12 lg:pl-0"
                >
                  {/* Numbered dot on the line */}
                  <span
                    aria-hidden="true"
                    className={`absolute top-5 left-5 z-10 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border-2 border-teal-brand font-display text-sm font-bold transition-colors duration-300 lg:left-1/2 ${
                      isActive ? 'bg-teal-brand text-ink shadow-glow' : 'bg-white text-teal-ink'
                    }`}
                  >
                    {step.num}
                  </span>

                  <div
                    role="button"
                    tabIndex={0}
                    aria-pressed={isActive}
                    onClick={() => setActiveStep(i)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setActiveStep(i)
                      }
                    }}
                    className={`group relative flex cursor-pointer flex-col rounded-xl border bg-white p-6 transition-all duration-300 ${focusRing} lg:w-full lg:max-w-md ${
                      onLeft ? 'lg:col-start-1 lg:justify-self-end' : 'lg:col-start-2'
                    } ${
                      isActive
                        ? '-translate-y-1 border-teal-brand shadow-glow'
                        : isLast
                          ? 'border-violet-brand/40 shadow-card hover:-translate-y-0.5 hover:border-teal-brand/50 hover:shadow-glow'
                          : 'border-slate-200 shadow-card hover:-translate-y-0.5 hover:border-teal-brand/50 hover:shadow-glow'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Icon */}
                      <span
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-xl transition-colors duration-300 ${
                          isActive ? 'bg-teal-brand/15' : 'bg-page'
                        }`}
                      >
                        {step.icon}
                      </span>
                      {/* Step badge */}
                      <span className="rounded-md bg-teal-brand/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-teal-ink">
                        {step.badge}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="mt-4 font-display text-lg font-semibold text-ink">{step.title}</h3>

                    {/* Description */}
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.description}</p>

                    {/* Certification badges on last card */}
                    {step.badges && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {step.badges.map((badge) => (
                          <span
                            key={badge}
                            className="inline-flex items-center gap-1 rounded-md border border-teal-brand/30 bg-teal-brand/5 px-2.5 py-1 text-xs font-semibold text-ink"
                          >
                            <svg
                              viewBox="0 0 16 16"
                              className="h-3.5 w-3.5 text-teal-ink"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <path d={checkPath} />
                            </svg>
                            {badge}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </li>
              )
            })}
          </ol>

          {/* Bottom highlights bar */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {pathwayHighlights.map((item) => (
              <span key={item} className="flex items-center gap-2 text-sm text-slate-600">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-brand" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Why choose us — bento grid */}
      <section className="relative overflow-hidden bg-white py-20 md:py-24">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end">
            <div>
              <Eyebrow>Why Choose Us</Eyebrow>
              <h2 className="mt-4 font-display text-3xl font-bold leading-[1.15] tracking-tight text-ink md:text-5xl">
                Why Choose <span className={gradientLight}>Medical Global Academy</span>
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
                We provide specialist-led neurology education designed to help healthcare
                professionals advance their careers with confidence.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 lg:justify-end">
              {['CPD', 'ACTD'].map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-1.5 rounded-md border border-teal-brand/30 bg-teal-brand/5 px-3 py-1.5 text-sm font-semibold text-ink"
                >
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-teal-ink" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={checkPath} />
                  </svg>
                  {badge} Accredited
                </span>
              ))}
              <Link
                to="/courses"
                className={`group inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-teal-brand px-6 text-sm font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-cyan-glow hover:shadow-glow ${focusRing}`}
              >
                Explore Courses
                <svg viewBox="0 0 16 16" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {features.map((feature, i) => {
              const large = i === 0
              const wide = i === features.length - 1
              return (
                <article
                  key={feature.title}
                  className={`group relative flex overflow-hidden rounded-xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow ${bentoLayout[i]} ${
                    large
                      ? 'min-h-72 flex-col justify-end border-teal-brand/25 bg-neuro-dark text-white md:p-8'
                      : `border-slate-200 bg-white shadow-card hover:border-teal-brand/50 ${
                          wide ? 'flex-col sm:flex-row sm:items-center sm:gap-6' : 'flex-col'
                        }`
                  }`}
                >
                  {large && <BentoNetwork />}

                  {/* Small number */}
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute right-5 top-4 font-display text-sm font-semibold ${
                      large ? 'text-white/40' : 'text-slate-400'
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* Icon */}
                  <div
                    className={`relative flex shrink-0 items-center justify-center rounded-lg transition-colors duration-300 ${
                      large
                        ? 'h-14 w-14 bg-teal-brand text-ink'
                        : 'h-12 w-12 bg-teal-brand/10 text-teal-ink group-hover:bg-teal-brand group-hover:text-ink'
                    }`}
                  >
                    <Icon path={feature.icon} className={large ? 'h-7 w-7' : 'h-6 w-6'} />
                  </div>

                  <div className={`relative ${wide ? 'mt-5 sm:mt-0' : large ? 'mt-auto pt-10' : 'mt-5'}`}>
                    <h3
                      className={`font-display font-semibold ${
                        large ? 'text-2xl text-white md:text-3xl' : 'text-lg text-ink'
                      }`}
                    >
                      {feature.title}
                    </h3>
                    <p
                      className={`mt-2 leading-relaxed ${
                        large ? 'max-w-sm text-base text-slate-300 md:text-lg' : 'text-sm text-slate-600'
                      }`}
                    >
                      {feature.description}
                    </p>
                  </div>

                  {/* Bottom accent line grows on hover */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-linear-to-r from-teal-brand to-violet-brand transition-transform duration-500 group-hover:scale-x-100"
                  />
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* 9. Testimonials */}
      <section className="overflow-hidden bg-page py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink md:text-5xl">
              What Our <span className={gradientLight}>Doctors Say</span>
            </h2>
            <AccentRule center />
            <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-slate-600">
              Hear from healthcare professionals who advanced their careers with our
              specialist-led programs.
            </p>
          </div>
        </div>
        <TestimonialsMarquee />
      </section>

      {/* 10. FAQ */}
      <FaqSection
        variant="dark"
        defaultOpen={0}
        title="Frequently asked questions from our students"
        items={neurologyFaqs}
      />
    </div>
  )
}

export default NeurologyHome
