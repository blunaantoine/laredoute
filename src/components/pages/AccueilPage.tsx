'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, Award, HeadphonesIcon, Heart, Car, Wheat, Phone, Mail, MapPin } from 'lucide-react'
import Image from 'next/image'
import { useNavigation } from '@/context/NavigationContext'
import ProductDetailDialog from '@/components/shared/ProductDetailDialog'

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

interface AccueilPageProps {
  content: Record<string, string>
  images: Record<string, string>
  products: Product[]
}

const values = [
  {
    icon: Award,
    title: 'Qualité',
    description: 'Nous sélectionnons rigoureusement chaque produit pour garantir la plus haute qualité à nos clients.',
  },
  {
    icon: HeadphonesIcon,
    title: 'Service Client',
    description: "Notre équipe dévouée est toujours à l'écoute pour répondre à vos besoins et vous accompagner.",
  },
  {
    icon: Heart,
    title: 'Engagement',
    description: 'Nous nous engageons envers nos partenaires et notre communauté pour un développement durable.',
  },
]

const categoryLabels: Record<string, string> = {
  pneus: 'Pneus',
  huiles: 'Huiles Moteurs',
  accessoires: 'Accessoires Auto',
  alimentation: 'Produits Alimentaires',
  boissons: 'Boissons',
  cereales: 'Céréales & Grains',
}

export default function AccueilPage({ content, images, products }: AccueilPageProps) {
  const { navigateTo } = useNavigation()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogIcon, setDialogIcon] = useState<React.ElementType>(Car)

  const autoProducts = products.filter(p => p.subcategory === 'automobile' && p.isActive)
  const agroProducts = products.filter(p => p.subcategory === 'agroalimentaire' && p.isActive)
  const autoVariants = [...new Set(autoProducts.map(p => p.category).filter(Boolean))]
  const agroVariants = [...new Set(agroProducts.map(p => p.category).filter(Boolean))]

  const featuredAuto = autoProducts.slice(0, 4)
  const featuredAgro = agroProducts.slice(0, 4)

  const handleProductClick = (product: Product, icon: React.ElementType) => {
    setSelectedProduct(product)
    setDialogIcon(icon)
    setDialogOpen(true)
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center hero-gradient overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="pattern-bg w-full h-full" />
        </div>
        <div className="absolute top-20 right-10 w-72 h-72 border border-white/10 rounded-full" />
        <div className="absolute bottom-20 left-10 w-48 h-48 border border-white/10 rounded-full" />
        <div className="absolute top-40 left-1/4 w-24 h-24 border border-white/5 rotate-45" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in-up">
              <Badge className="bg-white/15 text-white border-white/25 hover:bg-white/20 backdrop-blur-sm px-4 py-2 text-sm">
                {content['hero-badge'] || 'Votre partenaire de confiance depuis des années'}
              </Badge>
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white tracking-tight">
                  {content['hero-title'] || 'LA REDOUTE'}
                </h1>
                <p className="text-xl sm:text-2xl font-semibold text-white/90">
                  {content['hero-subtitle'] || 'SARL-U'}
                </p>
              </div>
              <p className="text-lg text-white/80 max-w-xl leading-relaxed">
                {content['hero-description'] || "Distribution professionnelle de pneus, huiles moteurs et produits d'alimentation générale au Togo. Qualité, fiabilité et service exceptionnel."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-white text-[#00A651] hover:bg-white/90 font-semibold btn-primary-hover"
                  onClick={() => navigateTo('automobile')}
                >
                  Nos Produits
                  <ArrowRight className="ml-2 size-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                  onClick={() => navigateTo('contact')}
                >
                  Nous Contacter
                </Button>
              </div>

              {/* Quick contact info in hero */}
              <div className="flex flex-wrap gap-4 pt-4">
                <a href="tel:+22822251898" className="flex items-center gap-2 text-white/60 hover:text-white/90 text-sm transition-colors">
                  <Phone className="size-4" />
                  +228 22 25 18 98
                </a>
                <a href="mailto:contact@laredoutesarl.com" className="flex items-center gap-2 text-white/60 hover:text-white/90 text-sm transition-colors">
                  <Mail className="size-4" />
                  contact@laredoutesarl.com
                </a>
                <span className="flex items-center gap-2 text-white/60 text-sm">
                  <MapPin className="size-4" />
                  Lomé, Togo
                </span>
              </div>
            </div>
            <div className="hidden lg:flex justify-center items-center">
              <div className="relative animate-float">
                <div className="absolute -inset-4 bg-white/10 rounded-3xl blur-2xl" />
                <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                  <Image
                    src={images['logo-alt'] || '/logo-alt.png'}
                    alt="LA REDOUTE SARL-U Logo"
                    width={400}
                    height={400}
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Overview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-[#00A651]/10 text-[#00A651] border-[#00A651]/20">
              Nos Produits
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a]">
              {content['products-title'] || "Deux Domaines d'Expertise"}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Automobile Card */}
            <Card className="overflow-hidden card-hover border-0 shadow-lg">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src="/products-tires.png"
                  alt="Automobile"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <div className="w-10 h-10 bg-[#00A651] rounded-lg flex items-center justify-center">
                    <Car className="size-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Automobile</h3>
                </div>
              </div>
              <CardContent className="p-6 space-y-4">
                <p className="text-gray-600">
                  {content['auto-description'] || "Large sélection de pneus, huiles moteurs et accessoires automobiles pour tous véhicules."}
                </p>
                <div className="flex flex-wrap gap-2">
                  {autoVariants.length > 0 ? autoVariants.map(v => (
                    <Badge key={v} variant="secondary" className="bg-[#00A651]/10 text-[#00A651]">
                      {categoryLabels[v] || v}
                    </Badge>
                  )) : (
                    <>
                      <Badge variant="secondary" className="bg-[#00A651]/10 text-[#00A651]">Pneus</Badge>
                      <Badge variant="secondary" className="bg-[#00A651]/10 text-[#00A651]">Huiles Moteurs</Badge>
                      <Badge variant="secondary" className="bg-[#00A651]/10 text-[#00A651]">Accessoires</Badge>
                    </>
                  )}
                </div>
                <Button
                  className="w-full bg-[#00A651] hover:bg-[#008541] text-white"
                  onClick={() => navigateTo('automobile')}
                >
                  Voir les produits Automobile
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Agro-alimentaire Card */}
            <Card className="overflow-hidden card-hover border-0 shadow-lg">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src="/products-food.png"
                  alt="Agro-alimentaire"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <div className="w-10 h-10 bg-[#00A651] rounded-lg flex items-center justify-center">
                    <Wheat className="size-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Agro-alimentaire</h3>
                </div>
              </div>
              <CardContent className="p-6 space-y-4">
                <p className="text-gray-600">
                  {content['agro-description'] || 'Distribution de produits alimentaires de qualité, boissons et céréales.'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {agroVariants.length > 0 ? agroVariants.map(v => (
                    <Badge key={v} variant="secondary" className="bg-[#00A651]/10 text-[#00A651]">
                      {categoryLabels[v] || v}
                    </Badge>
                  )) : (
                    <>
                      <Badge variant="secondary" className="bg-[#00A651]/10 text-[#00A651]">Alimentation</Badge>
                      <Badge variant="secondary" className="bg-[#00A651]/10 text-[#00A651]">Boissons</Badge>
                      <Badge variant="secondary" className="bg-[#00A651]/10 text-[#00A651]">Céréales</Badge>
                    </>
                  )}
                </div>
                <Button
                  className="w-full bg-[#00A651] hover:bg-[#008541] text-white"
                  onClick={() => navigateTo('agroalimentaire')}
                >
                  Voir les produits Agro-alimentaire
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products - Automobile */}
      {featuredAuto.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#00A651]/10 rounded-lg flex items-center justify-center">
                  <Car className="size-5 text-[#00A651]" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a]">Produits Automobiles</h2>
                  <p className="text-sm text-gray-500">Sélection de nos produits phares</p>
                </div>
              </div>
              <Button
                variant="ghost"
                className="text-[#00A651] hover:text-[#008541] hover:bg-[#00A651]/5"
                onClick={() => navigateTo('automobile')}
              >
                Voir tout
                <ArrowRight className="ml-1 size-4" />
              </Button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredAuto.map(product => (
                <Card
                  key={product.id}
                  className="overflow-hidden card-hover border-0 shadow-md group cursor-pointer"
                  onClick={() => handleProductClick(product, Car)}
                >
                  <div className="relative h-40 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                          <Car className="size-6 text-[#00A651]/40" />
                        </div>
                      </div>
                    )}
                    <Badge className="absolute top-2 left-2 bg-[#00A651] text-white text-xs">
                      {categoryLabels[product.category] || product.category}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-[#1a1a1a] text-sm mb-1 line-clamp-1">{product.title}</h3>
                    {product.description && (
                      <p className="text-xs text-gray-500 line-clamp-2">{product.description}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products - Agro-alimentaire */}
      {featuredAgro.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#00A651]/10 rounded-lg flex items-center justify-center">
                  <Wheat className="size-5 text-[#00A651]" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a]">Produits Agro-alimentaires</h2>
                  <p className="text-sm text-gray-500">Sélection de nos produits phares</p>
                </div>
              </div>
              <Button
                variant="ghost"
                className="text-[#00A651] hover:text-[#008541] hover:bg-[#00A651]/5"
                onClick={() => navigateTo('agroalimentaire')}
              >
                Voir tout
                <ArrowRight className="ml-1 size-4" />
              </Button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredAgro.map(product => (
                <Card
                  key={product.id}
                  className="overflow-hidden card-hover border-0 shadow-md group cursor-pointer"
                  onClick={() => handleProductClick(product, Wheat)}
                >
                  <div className="relative h-40 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                          <Wheat className="size-6 text-[#00A651]/40" />
                        </div>
                      </div>
                    )}
                    <Badge className="absolute top-2 left-2 bg-[#00A651] text-white text-xs">
                      {categoryLabels[product.category] || product.category}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-[#1a1a1a] text-sm mb-1 line-clamp-1">{product.title}</h3>
                    {product.description && (
                      <p className="text-xs text-gray-500 line-clamp-2">{product.description}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-[#00A651]/10 text-[#00A651] border-[#00A651]/20">
              Nos Valeurs
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a]">
              {content['values-title'] || 'Ce Qui Nous Définit'}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value) => (
              <Card key={value.title} className="text-center border-0 shadow-lg card-hover">
                <CardContent className="p-8 space-y-4">
                  <div className="w-16 h-16 bg-[#00A651]/10 rounded-2xl flex items-center justify-center mx-auto">
                    <value.icon className="size-8 text-[#00A651]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1a1a1a]">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#00A651] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            {content['cta-title'] || 'Prêt à Travailler Avec Nous ?'}
          </h2>
          <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
            {content['cta-description'] || "Contactez-nous dès aujourd'hui pour découvrir comment nous pouvons répondre à vos besoins."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-[#00A651] hover:bg-white/90 font-semibold btn-primary-hover"
              asChild
            >
              <a href="https://wa.me/22892501944" target="_blank" rel="noopener noreferrer">
                Contactez-nous
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 bg-transparent"
              onClick={() => navigateTo('about')}
            >
              En savoir plus
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
          {/* Contact info in CTA */}
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-white/60 text-sm">
            <a href="tel:+22822251898" className="flex items-center gap-2 hover:text-white/90 transition-colors">
              <Phone className="size-4" />
              +228 22 25 18 98
            </a>
            <a href="mailto:contact@laredoutesarl.com" className="flex items-center gap-2 hover:text-white/90 transition-colors">
              <Mail className="size-4" />
              contact@laredoutesarl.com
            </a>
          </div>
        </div>
      </section>

      {/* Product Detail Dialog */}
      <ProductDetailDialog
        product={selectedProduct}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        categoryLabels={categoryLabels}
        categoryIcon={dialogIcon}
      />
    </div>
  )
}
