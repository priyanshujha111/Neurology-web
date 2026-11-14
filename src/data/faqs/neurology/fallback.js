// FAQs for a neurology course that has no file of its own in ./courses/.
// The general list without "Which neurology courses can I join?", which does not belong on a
// course page.
import neurologyGeneralFaqs, { whichCoursesFaq } from './general.js'

const fallbackFaqs = neurologyGeneralFaqs.filter((faq) => faq !== whichCoursesFaq)

export default fallbackFaqs
