import { createContext, useContext, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// { override: { path, label } | null, setOverride }; provided by BreadcrumbProvider (Breadcrumbs.jsx)
export const BreadcrumbContext = createContext({ override: null, setOverride: () => {} })

// Lets a page replace the label of the current (last) breadcrumb, e.g.
//   useBreadcrumbLabel(course?.title)
// Pass null/undefined to keep the default label. Cleared when the page unmounts.
export function useBreadcrumbLabel(label) {
  const { setOverride } = useContext(BreadcrumbContext)
  const { pathname } = useLocation()

  useEffect(() => {
    if (!label) return
    setOverride({ path: pathname, label })
    return () => setOverride(null)
  }, [label, pathname, setOverride])
}
