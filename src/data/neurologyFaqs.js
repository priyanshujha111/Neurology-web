// Neurology FAQs. Each item is { question, answer }.
//   neurologyFaqs                general FAQs (Home and Courses pages, FaqSection default)
//   neurologyCourseFallbackFaqs  for a course without its own file
//   neurologyCourseFaqs          { [slug]: items }, one file per course in faqs/neurology/courses/
// To add FAQs for a course, create faqs/neurology/courses/<exact API slug>.js with a default
// export array. It is picked up automatically, nothing else needs to change.
import neurologyGeneralFaqs from './faqs/neurology/general.js'
import fallbackFaqs from './faqs/neurology/fallback.js'

export { eligibilityAnswer } from './faqs/neurology/general.js'

export const neurologyFaqs = neurologyGeneralFaqs

export const neurologyCourseFallbackFaqs = fallbackFaqs

const courseModules = import.meta.glob('./faqs/neurology/courses/*.js', { eager: true })

// './faqs/neurology/courses/fellowship-in-neurology.js' -> 'fellowship-in-neurology'
export const neurologyCourseFaqs = Object.fromEntries(
  Object.entries(courseModules).map(([path, mod]) => [path.split('/').pop().replace(/\.js$/, ''), mod.default]),
)
