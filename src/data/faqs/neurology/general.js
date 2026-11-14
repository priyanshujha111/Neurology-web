// General neurology FAQs, shown on the Home and Courses pages and used as the base for the
// course fallback list. Each item is { question, answer }; questions must stay unique because
// FaqSection uses them as React keys.

export const eligibilityAnswer =
  'Medical Global Academy provides training facilities for MBBS, MD, and other degree holders in the medical field. To enroll in our courses, you must hold a valid degree in a related field (e.g., MBBS, MD, etc.) from a recognized institution.'

// Exported on its own so fallback.js can leave it out: on a course page it would send the
// visitor away from the course they are reading about. Course names are not listed here
// because they come from the live API and change.
export const whichCoursesFaq = {
  question: 'Which neurology courses can I join?',
  answer:
    'All of our current neurology programs are listed on the Courses page, with the details and fees for each one. The list is updated as programs open, so please check there for the latest options.',
}

const neurologyGeneralFaqs = [
  {
    question: 'What is the eligibility criteria for the neurology programs?',
    answer: eligibilityAnswer,
  },
  {
    question: 'How are the neurology programs delivered?',
    // TODO: confirm with the academic team that the neurology programs are taught by
    // specialist-led faculty through case-based learning.
    answer:
      'Our programs are taught by specialist-led faculty through case-based learning. You work through real neurology cases, so the focus is on diagnosis and management decisions, not just theory.',
  },
  {
    question: 'How do I enrol in a neurology program?',
    answer:
      'Click the "Talk to Counsellor" button or call us on +91 9310027474. Our counsellors will check your eligibility, explain the program options and help you complete your enrolment.',
  },
  {
    question: 'Is the certification recognised?',
    // TODO: confirm CPD accreditation and ACTD alignment for the neurology programs. The course
    // API currently returns "actd": 0 for every neurology course.
    answer:
      'Yes. Our programs are CPD accredited and aligned with the American Council of Training & Development (ACTD). You receive a certificate when you complete your program.',
  },
  whichCoursesFaq,
  {
    question: 'Can I study online while I keep working?',
    // TODO: confirm that the neurology programs are online and flexible enough to fit around
    // clinical work.
    answer:
      'Yes. Learning is online and flexible, so you can fit it around your clinical work. Each course page explains how that program is delivered, and our counsellors can confirm the details.',
  },
]

export default neurologyGeneralFaqs
