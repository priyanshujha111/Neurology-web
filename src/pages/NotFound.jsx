import { useEffect } from 'react'
import NotFoundView from '../components/NotFoundView.jsx'

function NotFound() {
  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Page not found | Medical Global Academy'
    return () => {
      document.title = previousTitle
    }
  }, [])

  return (
    <NotFoundView
      heading="We couldn't find that page"
      message="The link may be broken, or the page may have moved. Check the address, or use one of the links below."
      primary={{ to: '/', label: 'Go to homepage' }}
      secondary={{ to: '/courses', label: 'Browse courses' }}
    />
  )
}

export default NotFound
