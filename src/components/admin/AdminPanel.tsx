'use client'

import { useState, useCallback } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminLogin from './AdminLogin'
import DashboardTab from './DashboardTab'
import HomepageEditor from './HomepageEditor'
import ProductManager from './ProductManager'
import ImageManager from './ImageManager'
import PartnerManager from './PartnerManager'
import { Button } from '@/components/ui/button'
import { X, Menu, ExternalLink } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

interface AdminPanelProps {
  isAuthenticated: boolean
  onLogin: (password: string) => Promise<boolean>
  onLogout: () => void
  onClose: () => void
  onRefresh?: () => void
}

const tabMeta: Record<string, { label: string; description: string }> = {
  dashboard: { label: 'Tableau de bord', description: "Vue d'ensemble de votre site" },
  homepage: { label: 'Pages du site', description: 'Gérez le contenu et les images' },
  products: { label: 'Produits', description: 'Gérez votre catalogue de produits' },
  images: { label: 'Images', description: 'Gérez les images du site' },
  partners: { label: 'Partenaires', description: 'Gérez vos partenaires' },
}

export default function AdminPanel({ isAuthenticated, onLogin, onLogout, onClose, onRefresh }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogin = useCallback(async (password: string): Promise<boolean> => {
    return onLogin(password)
  }, [onLogin])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setMobileOpen(false)
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} onBack={onClose} />
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab />
      case 'homepage':
        return <HomepageEditor />
      case 'products':
        return <ProductManager />
      case 'images':
        return <ImageManager />
      case 'partners':
        return <PartnerManager />
      default:
        return <DashboardTab />
    }
  }

  const currentTab = tabMeta[activeTab] || tabMeta.dashboard

  return (
    <div className="fixed inset-0 z-50 bg-[#f8fafc] flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <AdminSidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onLogout={onLogout}
          onClose={onClose}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile menu trigger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-[280px]">
                <AdminSidebar
                  activeTab={activeTab}
                  onTabChange={handleTabChange}
                  onLogout={onLogout}
                  onClose={onClose}
                  isMobile
                />
              </SheetContent>
            </Sheet>

            <div>
              <h2 className="text-sm font-semibold text-[#1a1a1a]">{currentTab.label}</h2>
              <p className="text-xs text-gray-500">{currentTab.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-gray-600 gap-1.5"
            >
              <ExternalLink className="size-3.5" />
              <span className="hidden sm:inline">Voir le site</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="lg:hidden text-gray-500"
            >
              <X className="size-5" />
            </Button>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}
