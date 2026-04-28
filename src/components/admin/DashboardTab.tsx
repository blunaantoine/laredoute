'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Package, Image as ImageIcon, Users, TrendingUp, Car, Wheat, ArrowRight, Activity, Clock } from 'lucide-react'

interface Stats {
  totalProducts: number
  autoProducts: number
  agroProducts: number
  totalImages: number
  totalPartners: number
  recentProducts: Array<{
    id: string
    title: string
    category: string
    subcategory: string | null
    createdAt: string
  }>
}

export default function DashboardTab() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    autoProducts: 0,
    agroProducts: 0,
    totalImages: 0,
    totalPartners: 0,
    recentProducts: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const [productsRes, imagesRes, partnersRes] = await Promise.all([
          fetch('/api/products?all=true'),
          fetch('/api/images'),
          fetch('/api/partners'),
        ])
        const products = await productsRes.json()
        const images = await imagesRes.json()
        const partners = await partnersRes.json()

        const allProducts = Array.isArray(products) ? products : []
        const activeProducts = allProducts.filter((p: { isActive: boolean }) => p.isActive)
        const activePartners = Array.isArray(partners) ? partners.filter((p: { isActive: boolean }) => p.isActive) : []

        setStats({
          totalProducts: activeProducts.length,
          autoProducts: allProducts.filter((p: { subcategory: string; isActive: boolean }) => p.subcategory === 'automobile' && p.isActive).length,
          agroProducts: allProducts.filter((p: { subcategory: string; isActive: boolean }) => p.subcategory === 'agroalimentaire' && p.isActive).length,
          totalImages: Array.isArray(images) ? images.length : 0,
          totalPartners: activePartners.length,
          recentProducts: activeProducts.slice(0, 6).map((p: { id: string; title: string; category: string; subcategory: string | null; createdAt: string }) => ({
            id: p.id,
            title: p.title,
            category: p.category,
            subcategory: p.subcategory,
            createdAt: p.createdAt,
          })),
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00A651]" />
      </div>
    )
  }

  const statCards = [
    { label: 'Total Produits', value: stats.totalProducts, icon: Package, color: '#00A651', bgColor: '#00A651', sub: `${stats.autoProducts} auto / ${stats.agroProducts} agro` },
    { label: 'Images', value: stats.totalImages, icon: ImageIcon, color: '#0ea5e9', bgColor: '#0ea5e9', sub: 'Média du site' },
    { label: 'Partenaires', value: stats.totalPartners, icon: Users, color: '#f59e0b', bgColor: '#f59e0b', sub: 'Partenaires actifs' },
  ]

  const categoryLabels: Record<string, string> = {
    pneus: 'Pneus',
    huiles: 'Huiles',
    accessoires: 'Accessoires',
    riz: 'Riz',
    pates: 'Pâtes',
    'huiles-alimentaires': 'Huiles',
    alimentation: 'Alimentation',
    boissons: 'Boissons',
    cereales: 'Céréales',
  }

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0a1628] to-[#0d2847] p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00A651]/10 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#00A651]/5 rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="size-5 text-[#00A651]" />
            <span className="text-sm text-[#00A651] font-medium">Bienvenue</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">LA REDOUTE SARL-U</h1>
          <p className="text-white/50 text-sm max-w-lg">
            Panneau d&apos;administration. Gérez vos produits automobiles et agro-alimentaires, modifiez le contenu du site et consultez vos statistiques.
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{stat.label}</p>
                  <p className="text-3xl font-bold text-[#1a1a1a] mt-1">{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
                </div>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${stat.bgColor}12` }}
                >
                  <stat.icon className="size-5" style={{ color: stat.color }} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Product Distribution & Recent Products */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Product Distribution */}
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <TrendingUp className="size-4 text-[#00A651]" />
              Distribution Produits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Automobile */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Car className="size-4 text-[#00A651]" />
                  <span className="text-sm font-medium text-gray-700">Automobile</span>
                </div>
                <span className="text-sm font-bold text-[#1a1a1a]">{stats.autoProducts}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div
                  className="bg-[#00A651] h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${stats.totalProducts > 0 ? (stats.autoProducts / stats.totalProducts) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Agro-alimentaire */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Wheat className="size-4 text-amber-500" />
                  <span className="text-sm font-medium text-gray-700">Agro-alimentaire</span>
                </div>
                <span className="text-sm font-bold text-[#1a1a1a]">{stats.agroProducts}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div
                  className="bg-amber-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${stats.totalProducts > 0 ? (stats.agroProducts / stats.totalProducts) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Visual bar chart */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-end gap-1 h-20">
                {[
                  { label: 'Pneus', count: stats.recentProducts.filter(p => p.category === 'pneus').length || 7, color: '#00A651' },
                  { label: 'Huiles', count: stats.recentProducts.filter(p => p.category === 'huiles').length || 6, color: '#00C762' },
                  { label: 'Access.', count: stats.recentProducts.filter(p => p.category === 'accessoires').length || 8, color: '#4ade80' },
                  { label: 'Riz', count: stats.recentProducts.filter(p => p.category === 'riz').length || 8, color: '#f59e0b' },
                  { label: 'Pâtes', count: stats.recentProducts.filter(p => p.category === 'pates').length || 2, color: '#fb923c' },
                  { label: 'Huiles A.', count: stats.recentProducts.filter(p => p.category === 'huiles-alimentaires').length || 3, color: '#fbbf24' },
                ].map((item, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t transition-all duration-500"
                      style={{
                        height: `${Math.max((item.count / 8) * 100, 10)}%`,
                        backgroundColor: item.color,
                        opacity: 0.8,
                      }}
                    />
                    <span className="text-[9px] text-gray-400 leading-tight text-center">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Products */}
        <Card className="lg:col-span-3 border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Clock className="size-4 text-[#00A651]" />
              Produits récents
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentProducts.length === 0 ? (
              <p className="text-gray-400 text-center py-8 text-sm">Aucun produit pour le moment</p>
            ) : (
              <div className="space-y-2">
                {stats.recentProducts.map((product, i) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#00A651]/8 flex items-center justify-center flex-shrink-0">
                      {product.subcategory === 'automobile' ? (
                        <Car className="size-4 text-[#00A651]" />
                      ) : (
                        <Wheat className="size-4 text-amber-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1a1a1a] truncate">{product.title}</p>
                      <p className="text-xs text-gray-400">{categoryLabels[product.category] || product.category}</p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`text-[10px] ${
                        product.subcategory === 'automobile'
                          ? 'bg-[#00A651]/10 text-[#00A651]'
                          : 'bg-amber-50 text-amber-600'
                      }`}
                    >
                      {product.subcategory === 'automobile' ? 'Auto' : 'Agro'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-gray-700">Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-[#00A651]/30 hover:bg-[#00A651]/5 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-[#00A651]/10 flex items-center justify-center flex-shrink-0">
                <Package className="size-5 text-[#00A651]" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-[#1a1a1a]">Ajouter un produit</p>
                <p className="text-xs text-gray-400">Nouveau produit dans le catalogue</p>
              </div>
              <ArrowRight className="size-4 text-gray-300 group-hover:text-[#00A651] transition-colors" />
            </button>

            <button className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-sky-300/50 hover:bg-sky-50/50 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center flex-shrink-0">
                <ImageIcon className="size-5 text-sky-500" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-[#1a1a1a]">Gérer les images</p>
                <p className="text-xs text-gray-400">Ajouter ou modifier les visuels</p>
              </div>
              <ArrowRight className="size-4 text-gray-300 group-hover:text-sky-500 transition-colors" />
            </button>

            <button className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-amber-300/50 hover:bg-amber-50/50 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                <Users className="size-5 text-amber-500" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-[#1a1a1a]">Partenaires</p>
                <p className="text-xs text-gray-400">Gérer vos partenaires</p>
              </div>
              <ArrowRight className="size-4 text-gray-300 group-hover:text-amber-500 transition-colors" />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
