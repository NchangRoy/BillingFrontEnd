'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useLoading } from './LoadingContext'

export default function NavigationProgress() {
  const pathname = usePathname()
  const { showLoader, hideLoader } = useLoading()

  useEffect(() => {
    const originalPushState = window.history.pushState.bind(window.history)
    const originalReplaceState = window.history.replaceState.bind(window.history)

    window.history.pushState = function (...args) {
      showLoader('Loading page...')
      return originalPushState(...args)
    }

    window.history.replaceState = function (...args) {
      showLoader('Loading page...')
      return originalReplaceState(...args)
    }

    return () => {
      window.history.pushState = originalPushState
      window.history.replaceState = originalReplaceState
    }
  }, [showLoader])

  // Hide the overlay once the new page pathname is active
  useEffect(() => {
    hideLoader()
  }, [pathname, hideLoader])

  return null
}
