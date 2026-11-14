import LegalLayout from '../components/LegalLayout.jsx'

const LAST_UPDATED = 'September 25, 2026'

const INTRO =
  'Please read these Terms & Conditions carefully before using the Medical Global Academy website or enrolling in any of our courses. By accessing our website, you accept these terms in full.'

// The terms text. Edit wording here only; LegalLayout just formats it.
// Anchor ids match the original site. Every support@medicalglobalacademy.com becomes a
// mailto link; { to } is a router link and { href, external } opens in a new tab.
const sections = [
  {
    id: 'acceptance',
    title: 'Acceptance of Terms',
    blocks: [
      { type: 'p', text: 'Welcome to Medical Global Academy. These terms and conditions outline the rules and regulations for the use of our website and services. By accessing this website, we assume you accept these terms and conditions. Do not continue to use Medical Global Academy if you do not agree to all the terms and conditions stated on this page.' },
    ],
  },
  {
    id: 'eligibility',
    title: 'Eligibility',
    blocks: [
      { type: 'p', text: 'Medical Global Academy provides training facilities for MBBS, MD, and other degree holders in the medical field. To enroll in our courses, you must hold a valid degree in a related field (e.g., MBBS, MD, etc.) from a recognized institution.' },
    ],
  },
  {
    id: 'services',
    title: 'Services Offered',
    blocks: [
      { type: 'p', text: 'Medical Global Academy offers professional training programs aimed at enhancing the skills and knowledge of medical professionals. Our training programs are developed by experts in the field, but they do not substitute for any medical board certification or licensing requirements.' },
    ],
  },
  {
    id: 'user-responsibilities',
    title: 'User Responsibilities',
    blocks: [
      { type: 'p', text: 'By using our website and enrolling in our courses, you agree to:' },
      {
        type: 'ul',
        items: [
          'Provide accurate information during registration.',
          'Use the website and training materials solely for your personal, professional development.',
          'Comply with all applicable laws and regulations.',
        ],
      },
    ],
  },
  {
    id: 'payment',
    title: 'Payment and Fees',
    blocks: [
      { type: 'p', text: 'All courses offered by Medical Global Academy are subject to fees, which are listed on the website. Payments must be made in full at the time of registration. No refunds will be issued once access to the course materials has been granted.' },
    ],
  },
  {
    id: 'ip',
    title: 'Intellectual Property',
    blocks: [
      { type: 'p', text: 'All content on the Medical Global Academy website, including course materials, videos, and resources, is the property of Medical Global Academy.' },
      { type: 'p', text: 'Users may not reproduce, distribute, or use the content for any purpose other than personal education without prior written consent.' },
    ],
  },
  {
    id: 'privacy',
    title: 'Privacy Policy',
    blocks: [
      {
        type: 'p',
        text: [
          'Your privacy is important to us. We collect and use personal information according to our ',
          { to: '/privacy', text: 'Privacy Policy' },
          ', which is available on our website.',
        ],
      },
    ],
  },
  {
    id: 'liability',
    title: 'Limitation of Liability',
    blocks: [
      { type: 'p', text: 'Medical Global Academy is not responsible for any errors or omissions in the content provided or any adverse outcomes that arise from applying the skills learned in our courses. Use of the information provided is at your own risk.' },
    ],
  },
  {
    id: 'termination',
    title: 'Termination of Access',
    blocks: [
      { type: 'p', text: 'Medical Global Academy reserves the right to terminate your access to the website and its services if you breach any of these terms.' },
    ],
  },
  {
    id: 'changes',
    title: 'Changes to the Terms',
    blocks: [
      { type: 'p', text: 'Medical Global Academy may update these terms and conditions from time to time. Any changes will be posted on this page, and continued use of the website implies acceptance of the updated terms.' },
    ],
  },
  {
    id: 'governing',
    title: 'Governing Law',
    blocks: [
      { type: 'p', text: 'These terms and conditions are governed by and construed in accordance with the laws of India. Any disputes related to these terms will be subject to the exclusive jurisdiction of the courts in India.' },
    ],
  },
  {
    id: 'contact',
    title: 'Contact Us',
    blocks: [
      { type: 'p', text: 'If you have any questions or need further clarification on these terms, please contact us at:' },
      {
        type: 'card',
        lines: [
          'Medical Global Academy',
          'Email: support@medicalglobalacademy.com',
          ['Website: ', { href: 'https://medicalglobalacademy.com/', text: 'medicalglobalacademy.com', external: true }],
        ],
      },
    ],
  },
]

function Terms() {
  return (
    <LegalLayout
      title="Terms & Conditions"
      documentTitle="Terms & Conditions | Medical Global Academy"
      breadcrumb
      eyebrow="Legal"
      lastUpdated={LAST_UPDATED}
      intro={INTRO}
      tocLabel="Terms and conditions sections"
      sections={sections}
      bottomNote={['Related: ', { to: '/privacy', text: 'Privacy Policy' }]}
    />
  )
}

export default Terms
