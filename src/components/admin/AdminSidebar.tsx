'use client'

import { LayoutDashboard, Home, Package, Image as ImageIcon, Users, LogOut, X, ChevronRight } from 'lucide-react'
import Image from 'next/image'

interface AdminSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  onLogout: () => void
  onClose: () => void
  isMobile?: boolean
}

const navItems = [
  { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard, section: 'main' },
  { id: 'homepage', label: 'Pages du site', icon: Home, section: 'content' },
  { id: 'products', label: 'Produits', icon: Package, section: 'content' },
  { id: 'images', label: 'Images', icon: ImageIcon, section: 'content' },
  { id: 'partners', label: 'Partenaires', icon: Users, section: 'content' },
]

const sections = [
  { id: 'main', label: '' },
  { id: 'content', label: 'CONTENU' },
]

export default function AdminSidebar({ activeTab, onTabChange, onLogout, onClose, isMobile }: AdminSidebarProps) {
  return (
    <aside className="w-[280px] h-full bg-[#0a1628] text-white flex flex-col">
      {/* Logo Header */}
      <div className="p-5 border-b border-white/[0.06]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#00A651] flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">LR</span>
            </div>
            <div>
              <p className="font-semibold text-sm leading-tight">LA REDOUTE</p>
              <p className="text-[10px] text-white/40 uppercase tracking-wider">Administration</p>
            </div>
          </div>
          {isMobile && (
            <button onClick={onClose} className="text-white/40 hover:text-white p-1">
              <X className="size-5" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {sections.map((section) => {
          const sectionItems = navItems.filter((item) => item.section === section.id)
          return (
            <div key={section.id}>
              {section.label && (
                <p className="px-3 py-2 text-[10px] font-semibold text-white/30 uppercase tracking-widest">
                  {section.label}
                </p>
              )}
              {sectionItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group mb-0.5 ${
                    activeTab === item.id
                      ? 'bg-[#00A651] text-white shadow-lg shadow-[#00A651]/20'
                      : 'text-white/60 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <item.icon className="size-[18px] flex-shrink-0" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {activeTab === item.id && (
                    <ChevronRight className="size-4 opacity-60" />
                  )}
                </button>
              ))}
            </div>
          )
        })}
      </nav>

      {/* User / Bottom actions */}
      <div className="p-3 border-t border-white/[0.06] space-y-1">
        <div className="px-3 py-2.5 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <span className="text-xs font-semibold text-white/70">A</span>
            </div>
            <div>
              <p className="text-xs font-medium text-white/80">Administrateur</p>
              <p className="text-[10px] text-white/30">En ligne</p>
            </div>
            <div className="ml-auto w-2 h-2 rounded-full bg-[#00A651]" />
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/[0.06] transition-all"
        >
          <Home className="size-[18px]" />
          Voir le site
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400/80 hover:text-red-300 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="size-[18px]" />
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
