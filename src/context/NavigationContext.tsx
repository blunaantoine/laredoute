'use client'

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react'

export type PageName = 'accueil' | 'automobile' | 'agroalimentaire' | 'about' | 'contact'

const pathToPage: Record<string, PageName> = {
  '/': 'accueil',
  '/automobile': 'automobile',
  '/agroalimentaire': 'agroalimentaire',
  '/a-propos': 'about',
  '/contact': 'contact',
}

const pageToPath: Record<PageName, string> = {
  accueil: '/',
  automobile: '/automobile',
  agroalimentaire: '/agroalimentaire',
  about: '/a-propos',
  contact: '/contact',
}

function getInitialPage(): PageName {
  if (typeof window === 'undefined') return 'accueil'
  const path = window.location.pathname
  return pathToPage[path] || 'accueil'
}

interface NavigationContextType {
  currentPage: PageName
  navigateTo: (page: PageName) => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<PageName>(getInitialPage)

  const navigateTo = useCallback((page: PageName) => {
    setCurrentPage(page)
    const path = pageToPath[page]
    // Update browser URL without full page reload
    if (typeof window !== 'undefined' && window.location.pathname !== path) {
      window.history.pushState({ page }, '', path)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Listen for browser back/forward buttons
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      const page = e.state?.page as PageName | undefined
      if (page && pageToPath[page]) {
        setCurrentPage(page)
      } else {
        // Fallback: determine page from current URL
        setCurrentPage(getInitialPage())
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  return (
    <NavigationContext.Provider value={{ currentPage, navigateTo }}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}
