import LegalLayout from '../components/LegalLayout.jsx'

const LAST_UPDATED = '2026'

const INTRO =
  'Please read our refund policy carefully before enrolling in any course. By enrolling in any of our courses, you acknowledge that you have read, understood, and agreed to this refund policy.'

// The policy text. Edit wording here only; LegalLayout just formats it and adds the section
// numbers. Anchor ids match the original site. Every support@medicalglobalacademy.com becomes
// a mailto link.
const sections = [
  {
    id: 'overview',
    title: 'Overview',
    blocks: [
      { type: 'p', text: 'At Medical Global Academy, we strive to provide high-quality training and educational content for MBBS, MD, and other degree holders in the medical field. However, we understand that there may be circumstances where you may request a refund. Please read our refund policy carefully before enrolling in any course.' },
    ],
  },
  {
    id: 'no-refunds',
    title: 'No Refunds',
    blocks: [
      { type: 'p', text: 'Due to the nature of digital educational content, once access to the course materials has been granted, no refunds will be issued. By completing the registration and payment process, you agree that all sales are final.' },
    ],
  },
  {
    id: 'cancellation',
    title: 'Course Cancellation',
    blocks: [
      { type: 'p', text: 'In the event that Medical Global Academy cancels a course due to unforeseen circumstances or technical issues, we will provide a full refund to all registered participants. The refund will be processed within 10 business days from the date of cancellation.' },
    ],
  },
  {
    id: 'duplicate-payment',
    title: 'Duplicate Payment',
    blocks: [
      { type: 'p', text: 'If you mistakenly make multiple payments for the same course, please notify us immediately at support@medicalglobalacademy.com. We will process a refund for the duplicate payment after verifying the details, typically within 7 business days.' },
      { type: 'p', text: 'Email: support@medicalglobalacademy.com' },
    ],
  },
  {
    id: 'technical-issues',
    title: 'Technical Issues',
    blocks: [
      { type: 'p', text: 'If you experience any technical issues that prevent you from accessing course content, please contact our support team. While we do not offer refunds for technical problems, we will make every effort to resolve the issue and ensure you have access to the course material.' },
    ],
  },
  {
    id: 'exceptions',
    title: 'Exceptions',
    blocks: [
      { type: 'p', text: 'Refunds will only be considered under exceptional circumstances, such as:' },
      {
        type: 'ul',
        items: [
          'Incorrect payment made due to system error.',
          'Special cases with documented medical emergencies.',
        ],
      },
      { type: 'p', text: 'All exceptions will be considered on a case-by-case basis, and the decision of Medical Global Academy will be final.' },
    ],
  },
  {
    id: 'refund-processing',
    title: 'Refund Processing',
    blocks: [
      { type: 'p', text: 'Approved refunds will be processed back to the original payment method. Depending on the payment provider, it may take up to 7–10 business days for the refund to reflect in your account.' },
    ],
  },
  {
    id: 'contact',
    title: 'Contact Us',
    blocks: [
      { type: 'p', text: 'For any inquiries related to refunds or payments, please contact us at:' },
      {
        type: 'card',
        lines: [
          'Medical Global Academy — Support',
          'Email: support@medicalglobalacademy.com',
          ['Phone: ', { href: 'tel:+919289994218', text: '+91 9289994218' }],
        ],
      },
    ],
  },
]

function RefundPolicy() {
  return (
    <LegalLayout
      title="Refund Policy"
      documentTitle="Refund Policy | Medical Global Academy"
      breadcrumb
      eyebrow="Legal"
      lastUpdated={LAST_UPDATED}
      intro={INTRO}
      tocLabel="Refund policy sections"
      sections={sections}
      bottomNote="Questions? Email support@medicalglobalacademy.com"
    />
  )
}

export default RefundPolicy
