// Home "Trending Courses": picked from the live API by slug, in this order.
// The slugs are real neurology courses from the API (checked 27 Oct 2026).
// description is only a fallback for when the API has none.
// TODO: confirm which courses to feature and the badge labels (TRENDING / TOP / NEW) with the MGA team.
// "fellowship-in-neurology" is the only neurology course the API marks as a top course.
export const trendingNeurologyCourses = [
  {
    slug: 'fellowship-in-neurology',
    badge: 'TOP',
    badgeClass: 'bg-teal-brand/10 text-teal-ink ring-1 ring-teal-brand/30',
    description: 'A fellowship program in clinical neurology from Medical Global Academy.',
  },
  {
    slug: 'pg-diploma-in-clinical-neurology',
    badge: 'TRENDING',
    badgeClass: 'bg-violet-brand/10 text-indigo-deep ring-1 ring-violet-brand/25',
    description: 'A PG Diploma program in clinical neurology from Medical Global Academy.',
  },
  {
    slug: 'certificate-in-neurology',
    badge: 'NEW',
    badgeClass: 'bg-cyan-glow/25 text-indigo-deep ring-1 ring-cyan-glow/60',
    description: 'A certificate program in neurology from Medical Global Academy.',
  },
]
