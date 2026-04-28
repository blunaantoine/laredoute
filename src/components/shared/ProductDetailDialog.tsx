'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Phone, Mail, MessageCircle, Package, Tag, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { useNavigation } from '@/context/NavigationContext'

interface Product {
  id: string
  category: string
  subcategory: string | null
  title: string
  description: string | null
  imageUrl: string | null
  variants: string | null
  order: number
  isActive: boolean
}

interface ProductDetailDialogProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
  categoryLabels: Record<string, string>
  categoryIcon: React.ElementType
}

export default function ProductDetailDialog({
  product,
  open,
  onOpenChange,
  categoryLabels,
  categoryIcon: CategoryIcon,
}: ProductDetailDialogProps) {
  const { navigateTo } = useNavigation()

  if (!product) return null

  const variants = product.variants ? product.variants.split(',').map(v => v.trim()) : []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
        {/* Product Image/Header */}
        <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-20 h-20 bg-white/80 rounded-2xl flex items-center justify-center shadow-sm">
                <CategoryIcon className="size-10 text-[#00A651]" />
              </div>
            </div>
          )}
          <div className="absolute top-4 left-4">
            <Badge className="bg-[#00A651] text-white shadow-md">
              {categoryLabels[product.category] || product.category}
            </Badge>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <DialogHeader className="space-y-2 p-0">
            <DialogTitle className="text-xl font-bold text-[#1a1a1a] leading-tight">
              {product.title}
            </DialogTitle>
            {product.description && (
              <p className="text-gray-600 text-sm leading-relaxed">
                {product.description}
              </p>
            )}
          </DialogHeader>

          <Separator />

          {/* Variants / Available formats */}
          {variants.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Package className="size-4 text-[#00A651]" />
                <h4 className="text-sm font-semibold text-[#1a1a1a]">Formats disponibles</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {variants.map((variant, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="border-[#00A651]/30 text-[#00A651] bg-[#00A651]/5 hover:bg-[#00A651]/10 py-1 px-3"
                  >
                    {variant}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Contact CTA */}
          <div className="bg-[#00A651]/5 border border-[#00A651]/10 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Tag className="size-4 text-[#00A651]" />
              <p className="text-sm font-semibold text-[#1a1a1a]">Intéressé par ce produit ?</p>
            </div>
            <p className="text-xs text-gray-500">
              Contactez-nous pour obtenir un devis personnalisé adapté à vos besoins.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                size="sm"
                className="bg-[#25D366] hover:bg-[#1da851] text-white flex-1"
                asChild
              >
                <a href="https://wa.me/22892501944" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 size-4" />
                  WhatsApp
                </a>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-[#00A651] text-[#00A651] hover:bg-[#00A651]/5 flex-1"
                asChild
              >
                <a href="tel:+22822251898">
                  <Phone className="mr-2 size-4" />
                  Appeler
                </a>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-gray-200 text-gray-600 hover:bg-gray-50 flex-1"
                asChild
              >
                <a href="mailto:contact@laredoutesarl.com">
                  <Mail className="mr-2 size-4" />
                  Email
                </a>
              </Button>
            </div>
          </div>

          {/* Navigate to category page */}
          {product.subcategory && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-gray-500 hover:text-[#00A651]"
              onClick={() => {
                onOpenChange(false)
                navigateTo(product.subcategory === 'automobile' ? 'automobile' : 'agroalimentaire')
              }}
            >
              Voir tous les produits {product.subcategory === 'automobile' ? 'Automobile' : 'Agro-alimentaire'}
              <ChevronRight className="ml-1 size-4" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
