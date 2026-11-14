// Shared by the Home "Meet Our Expert Doctors" section and the Doctors page.
// Colours and fonts come from the theme tokens in index.css (var(--color-...), var(--font-...)),
// so the card matches the rest of the site.
const styles = `
.doctor-card-root {
  --doctor-card-ink: var(--color-indigo-deep);
  --doctor-card-muted: #475569;
  --doctor-card-accent: var(--color-teal-brand);
  --doctor-card-accent-text: var(--color-teal-ink);
  --doctor-card-accent-bg: color-mix(in srgb, var(--color-teal-brand) 10%, white);
  --doctor-card-line: #e2e8f0;

  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  min-width: 0;
  padding: 32px 24px 28px;
  border: 1px solid var(--doctor-card-line);
  border-radius: 12px;
  background: #ffffff;
  text-align: center;
  font-family: var(--font-body);
  color: var(--doctor-card-ink);
  box-shadow: var(--shadow-card);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  overflow: hidden;
}

.doctor-card-root:hover,
.doctor-card-selected {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--doctor-card-accent) 55%, white);
  box-shadow: var(--shadow-glow);
}

/* Optional indigo strip behind the avatar (Doctors page) */
.doctor-card-cover {
  padding-top: 0;
}

.doctor-card-cover::before {
  content: '';
  position: absolute;
  inset: 0 0 auto 0;
  height: 84px;
  background:
    radial-gradient(ellipse 70% 90% at 85% 0%, color-mix(in srgb, var(--color-teal-brand) 30%, transparent), transparent 70%),
    linear-gradient(135deg, var(--color-indigo-deep), var(--color-ink));
}

/* Clickable cards (Home): teal-to-violet top bar on hover / when selected */
.doctor-card-interactive {
  cursor: pointer;
}

.doctor-card-interactive::after {
  content: '';
  position: absolute;
  inset: 0 0 auto 0;
  height: 3px;
  background: linear-gradient(90deg, var(--color-teal-brand), var(--color-violet-brand));
  opacity: 0;
  transition: opacity 0.25s ease;
}

.doctor-card-interactive:hover::after,
.doctor-card-selected::after {
  opacity: 1;
}

.doctor-card-interactive:focus {
  outline: none;
}

.doctor-card-interactive:focus-visible {
  outline: 2px solid var(--doctor-card-accent);
  outline-offset: 3px;
}

.doctor-card-selected {
  animation: doctor-card-blink 0.9s ease-in-out;
}

@keyframes doctor-card-blink {
  0%, 50%, 100% {
    opacity: 1;
  }
  25%, 75% {
    opacity: 0.55;
    box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-teal-brand) 45%, transparent);
  }
}

/* ---------- Avatar ---------- */
.doctor-card-avatar-wrap {
  position: relative;
  z-index: 1;
  padding: 4px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--doctor-card-accent) 40%, white);
}

.doctor-card-cover .doctor-card-avatar-wrap {
  margin-top: 40px;
}

.doctor-card-avatar {
  display: grid;
  place-items: center;
  width: 84px;
  height: 84px;
  border-radius: 50%;
  background: linear-gradient(145deg, var(--doctor-card-accent-bg), color-mix(in srgb, var(--color-violet-brand) 14%, white));
  color: var(--doctor-card-ink);
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  user-select: none;
}

.doctor-card-avatar-img {
  display: block;
  object-fit: cover;
}

/* ---------- Info ---------- */
.doctor-card-info {
  position: relative;
  z-index: 1;
  flex: 1;
  width: 100%;
  margin-top: 16px;
}

.doctor-card-name {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.3;
  color: var(--doctor-card-ink);
  overflow-wrap: anywhere;
}

.doctor-card-dept {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin: 10px 0 0;
  padding: 6px 12px;
  border-radius: 6px;
  background: var(--doctor-card-accent-bg);
  color: var(--doctor-card-accent-text);
  font-size: 0.85rem;
  font-weight: 600;
}

.doctor-card-dept svg {
  flex-shrink: 0;
}

.doctor-card-divider {
  width: 100%;
  height: 1px;
  margin: 20px 0 18px;
  background: linear-gradient(90deg, transparent, var(--doctor-card-line) 20%, var(--doctor-card-line) 80%, transparent);
}

.doctor-card-id {
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
  max-width: 100%;
  margin: 0;
  padding: 6px 12px;
  border: 1px dashed color-mix(in srgb, var(--doctor-card-accent) 50%, white);
  border-radius: 6px;
  background: #ffffff;
  color: var(--doctor-card-muted);
  font-size: 0.8rem;
  font-weight: 400;
}

.doctor-card-id strong {
  color: var(--doctor-card-ink);
  font-weight: 600;
  letter-spacing: 0.02em;
  overflow-wrap: anywhere;
}

@media (prefers-reduced-motion: reduce) {
  .doctor-card-root,
  .doctor-card-interactive::after {
    transition: none;
  }
  .doctor-card-root:hover,
  .doctor-card-selected {
    transform: none;
  }
  .doctor-card-selected {
    animation: none;
  }
}
`

// "Dr. Ambuj" -> "A", "Dr. Meet Jha" -> "MJ"
function getInitials(name = '') {
  const parts = name
    .replace(/^dr\.?\s*/i, '')
    .split(/\s+/)
    .filter(Boolean)
  if (parts.length === 0) return 'Dr'
  const first = parts[0][0]
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}

// Small neuron: cell body, dendrites and axon
function NeuronIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5z M10 5L6.5 3 M14 5l3.5-2 M9.7 7.6L6 9 M14.3 7.6L18 9 M12 9v7 M12 16l-3.5 5 M12 16l3.5 5" />
    </svg>
  )
}

// `cover` adds the indigo strip behind the avatar. Passing `onSelect` makes the
// card clickable (keyboard too); `selected` highlights it and plays the blink.
function DoctorCard({ doctor, cover = false, selected = false, onSelect }) {
  const interactive = typeof onSelect === 'function'

  const className = [
    'doctor-card-root',
    cover && 'doctor-card-cover',
    interactive && 'doctor-card-interactive',
    selected && 'doctor-card-selected',
  ]
    .filter(Boolean)
    .join(' ')

  const interactiveProps = interactive
    ? {
        role: 'button',
        tabIndex: 0,
        'aria-pressed': selected,
        onClick: onSelect,
        onKeyDown: (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onSelect()
          }
        },
      }
    : {}

  return (
    <article className={className} {...interactiveProps}>
      {/* href + precedence: React 19 hoists this once instead of per card */}
      <style href="doctor-card" precedence="default">
        {styles}
      </style>

      <div className="doctor-card-avatar-wrap">
        {doctor.image ? (
          <img
            className="doctor-card-avatar doctor-card-avatar-img"
            src={doctor.image}
            alt=""
            width="84"
            height="84"
            loading="lazy"
          />
        ) : (
          <div className="doctor-card-avatar" aria-hidden="true">
            {getInitials(doctor.name)}
          </div>
        )}
      </div>

      <div className="doctor-card-info">
        <h3 className="doctor-card-name">{doctor.name}</h3>
        {doctor.department && (
          <p className="doctor-card-dept">
            <NeuronIcon />
            <span>{doctor.department}</span>
          </p>
        )}
      </div>

      <div className="doctor-card-divider" aria-hidden="true" />

      <p className="doctor-card-id">
        <span>Faculty ID:</span>
        <strong>{doctor.facultyId}</strong>
      </p>
    </article>
  )
}

export default DoctorCard
