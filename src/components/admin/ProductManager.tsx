'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Plus, Pencil, Trash2, Search, Car, Wheat, SlidersHorizontal, Package } from 'lucide-react'
import Image from 'next/image'
import { useToast } from '@/hooks/use-toast'

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

const mainCategories = [
  { value: 'automobile', label: 'Automobile', icon: Car },
  { value: 'agroalimentaire', label: 'Agro-alimentaire', icon: Wheat },
]

const subcategories: Record<string, { value: string; label: string }[]> = {
  automobile: [
    { value: 'pneus', label: 'Pneus' },
    { value: 'huiles', label: 'Huiles Moteurs' },
    { value: 'accessoires', label: 'Accessoires Auto' },
  ],
  agroalimentaire: [
    { value: 'riz', label: 'Riz' },
    { value: 'pates', label: 'Pâtes Alimentaires' },
    { value: 'huiles-alimentaires', label: 'Huiles Alimentaires' },
  ],
}

const categoryLabels: Record<string, string> = {
  pneus: 'Pneus',
  huiles: 'Huiles Moteurs',
  accessoires: 'Accessoires Auto',
  riz: 'Riz',
  pates: 'Pâtes Alimentaires',
  'huiles-alimentaires': 'Huiles Alimentaires',
  alimentation: 'Produits Alimentaires',
  boissons: 'Boissons',
  cereales: 'Céréales & Grains',
}

const categoryColors: Record<string, string> = {
  pneus: 'bg-[#00A651]/10 text-[#00A651]',
  huiles: 'bg-emerald-50 text-emerald-600',
  accessoires: 'bg-teal-50 text-teal-600',
  riz: 'bg-amber-50 text-amber-600',
  pates: 'bg-orange-50 text-orange-600',
  'huiles-alimentaires': 'bg-yellow-50 text-yellow-700',
  alimentation: 'bg-amber-50 text-amber-600',
  boissons: 'bg-sky-50 text-sky-600',
  cereales: 'bg-lime-50 text-lime-600',
}

interface ProductForm {
  mainCategory: string
  subcategory: string
  title: string
  description: string
  variants: string
  imageFile: File | null
}

const emptyForm: ProductForm = {
  mainCategory: 'automobile',
  subcategory: 'pneus',
  title: '',
  description: '',
  variants: '',
  imageFile: null,
}

export default function ProductManager() {
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<ProductForm>({ ...emptyForm })
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<string>('all')

  // Edit dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editForm, setEditForm] = useState<ProductForm>({ ...emptyForm })

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/products?all=true')
      const data = await res.json()
      setProducts(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleAddProduct = async () => {
    if (!form.title) {
      toast({ title: 'Erreur', description: 'Le titre est requis.', variant: 'destructive' })
      return
    }

    setSaving(true)
    try {
      let imageUrl = ''
      if (form.imageFile) {
        const formData = new FormData()
        formData.append('file', form.imageFile)
        formData.append('category', form.subcategory)
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
        const uploadData = await uploadRes.json()
        if (uploadData.success) {
          imageUrl = uploadData.url
        }
      }

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: form.subcategory,
          subcategory: form.mainCategory,
          title: form.title,
          description: form.description || null,
          imageUrl: imageUrl || null,
          variants: form.variants || null,
          order: 0,
        }),
      })

      if (res.ok) {
        toast({ title: 'Produit ajouté', description: 'Le produit a été créé avec succès.' })
        setForm({ ...emptyForm })
        setShowAddForm(false)
        fetchProducts()
      } else {
        const data = await res.json()
        toast({ title: 'Erreur', description: data.error || 'Impossible d\'ajouter le produit.', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Erreur', description: 'Erreur de connexion.', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleEditProduct = async () => {
    if (!editingProduct || !editForm.title) return

    setSaving(true)
    try {
      let imageUrl = editingProduct.imageUrl || ''
      if (editForm.imageFile) {
        const formData = new FormData()
        formData.append('file', editForm.imageFile)
        formData.append('category', 'edit-product')
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
        const uploadData = await uploadRes.json()
        if (uploadData.success) {
          imageUrl = uploadData.url
        }
      }

      const res = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingProduct.id,
          category: editForm.subcategory,
          subcategory: editForm.mainCategory,
          title: editForm.title,
          description: editForm.description || null,
          imageUrl: imageUrl || null,
          variants: editForm.variants || null,
        }),
      })

      if (res.ok) {
        toast({ title: 'Produit modifié', description: 'Le produit a été mis à jour.' })
        setEditDialogOpen(false)
        setEditingProduct(null)
        fetchProducts()
      } else {
        toast({ title: 'Erreur', description: 'Impossible de modifier le produit.', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Erreur', description: 'Erreur de connexion.', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Supprimer ce produit ?')) return
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast({ title: 'Produit supprimé' })
        fetchProducts()
      }
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de supprimer.', variant: 'destructive' })
    }
  }

  const handleToggleActive = async (product: Product) => {
    try {
      const res = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: product.id,
          isActive: !product.isActive,
        }),
      })
      if (res.ok) {
        toast({ title: product.isActive ? 'Produit désactivé' : 'Produit activé' })
        fetchProducts()
      }
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de modifier.', variant: 'destructive' })
    }
  }

  const openEditDialog = (product: Product) => {
    setEditingProduct(product)
    const mainCat = product.subcategory || 'automobile'
    const sub = product.category
    setEditForm({
      mainCategory: mainCat,
      subcategory: sub,
      title: product.title,
      description: product.description || '',
      variants: product.variants || '',
      imageFile: null,
    })
    setEditDialogOpen(true)
  }

  const autoProducts = products.filter((p) => p.subcategory === 'automobile')
  const agroProducts = products.filter((p) => p.subcategory === 'agroalimentaire')

  // Filter products based on search and active filter
  const getFilteredProducts = (productList: Product[]) => {
    return productList.filter(p => {
      const matchesSearch = searchQuery === '' ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
      const matchesActive = activeFilter === 'all' ||
        (activeFilter === 'active' && p.isActive) ||
        (activeFilter === 'inactive' && !p.isActive)
      return matchesSearch && matchesActive
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-[#00A651]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Produits</h1>
          <p className="text-gray-500 mt-1 text-sm">{products.length} produits au total</p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[#00A651] hover:bg-[#008541] gap-2"
        >
          <Plus className="size-4" />
          Nouveau produit
        </Button>
      </div>

      {/* Add Product Form */}
      {showAddForm && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Nouveau produit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Catégorie principale</Label>
                <select
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm focus:border-[#00A651] focus:ring-[#00A651]/20"
                  value={form.mainCategory}
                  onChange={(e) => {
                    const mainCat = e.target.value
                    setForm({
                      ...form,
                      mainCategory: mainCat,
                      subcategory: subcategories[mainCat]?.[0]?.value || '',
                    })
                  }}
                >
                  {mainCategories.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Sous-catégorie</Label>
                <select
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm focus:border-[#00A651] focus:ring-[#00A651]/20"
                  value={form.subcategory}
                  onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                >
                  {(subcategories[form.mainCategory] || []).map((sub) => (
                    <option key={sub.value} value={sub.value}>{sub.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Titre *</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Nom du produit"
                  className="focus:border-[#00A651] focus:ring-[#00A651]/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Variants (séparés par des virgules)</Label>
                <Input
                  value={form.variants}
                  onChange={(e) => setForm({ ...form, variants: e.target.value })}
                  placeholder="ex: 195/65R15, 205/55R16"
                  className="focus:border-[#00A651] focus:ring-[#00A651]/20"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label className="text-sm">Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Description du produit"
                  rows={3}
                  className="focus:border-[#00A651] focus:ring-[#00A651]/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setForm({ ...form, imageFile: e.target.files?.[0] || null })}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleAddProduct}
                disabled={saving}
                className="bg-[#00A651] hover:bg-[#008541] gap-2"
              >
                {saving ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                Ajouter le produit
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>Annuler</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input
            placeholder="Rechercher un produit..."
            className="pl-9 h-9 border-gray-200 focus:border-[#00A651]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-1.5">
          {[
            { value: 'all', label: 'Tous' },
            { value: 'active', label: 'Actifs' },
            { value: 'inactive', label: 'Inactifs' },
          ].map((filter) => (
            <Button
              key={filter.value}
              variant={activeFilter === filter.value ? 'default' : 'outline'}
              size="sm"
              className={activeFilter === filter.value ? 'bg-[#00A651] hover:bg-[#008541] text-white h-8' : 'h-8'}
              onClick={() => setActiveFilter(filter.value)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Product Tabs */}
      <Tabs defaultValue="automobile">
        <TabsList className="bg-gray-100">
          <TabsTrigger value="automobile" className="gap-2 data-[state=active]:bg-white">
            <Car className="size-3.5" />
            Automobile
            <Badge variant="secondary" className="text-[10px] h-4 px-1.5">{autoProducts.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="agroalimentaire" className="gap-2 data-[state=active]:bg-white">
            <Wheat className="size-3.5" />
            Agro-alimentaire
            <Badge variant="secondary" className="text-[10px] h-4 px-1.5">{agroProducts.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="automobile" className="mt-4">
          <ProductTable
            products={getFilteredProducts(autoProducts)}
            onEdit={openEditDialog}
            onDelete={handleDeleteProduct}
            onToggleActive={handleToggleActive}
          />
        </TabsContent>

        <TabsContent value="agroalimentaire" className="mt-4">
          <ProductTable
            products={getFilteredProducts(agroProducts)}
            onEdit={openEditDialog}
            onDelete={handleDeleteProduct}
            onToggleActive={handleToggleActive}
          />
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Modifier le produit</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Catégorie principale</Label>
                <select
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                  value={editForm.mainCategory}
                  onChange={(e) => {
                    const mainCat = e.target.value
                    setEditForm({
                      ...editForm,
                      mainCategory: mainCat,
                      subcategory: subcategories[mainCat]?.[0]?.value || '',
                    })
                  }}
                >
                  {mainCategories.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Sous-catégorie</Label>
                <select
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                  value={editForm.subcategory}
                  onChange={(e) => setEditForm({ ...editForm, subcategory: e.target.value })}
                >
                  {(subcategories[editForm.mainCategory] || []).map((sub) => (
                    <option key={sub.value} value={sub.value}>{sub.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Titre *</Label>
                <Input
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Variants</Label>
                <Input
                  value={editForm.variants}
                  onChange={(e) => setEditForm({ ...editForm, variants: e.target.value })}
                  placeholder="séparés par des virgules"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Description</Label>
                <Textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Nouvelle image (laisser vide pour garder l&apos;actuelle)</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditForm({ ...editForm, imageFile: e.target.files?.[0] || null })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleEditProduct} disabled={saving} className="bg-[#00A651] hover:bg-[#008541]">
              {saving ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
              Sauvegarder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ProductTable({
  products,
  onEdit,
  onDelete,
  onToggleActive,
}: {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (id: string) => void
  onToggleActive: (product: Product) => void
}) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <SlidersHorizontal className="size-8 text-gray-300" />
        </div>
        <p className="text-gray-500 font-medium">Aucun produit trouvé</p>
        <p className="text-gray-400 text-sm mt-1">Essayez de modifier vos filtres</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      {/* Table Header */}
      <div className="hidden sm:grid grid-cols-[1fr_2fr_1fr_80px_100px] gap-4 px-5 py-3 bg-gray-50/80 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        <span>Image</span>
        <span>Produit</span>
        <span>Catégorie</span>
        <span className="text-center">Statut</span>
        <span className="text-right">Actions</span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-50">
        {products.map((product) => (
          <div
            key={product.id}
            className={`grid grid-cols-1 sm:grid-cols-[1fr_2fr_1fr_80px_100px] gap-2 sm:gap-4 px-5 py-3.5 items-center hover:bg-gray-50/50 transition-colors ${
              !product.isActive ? 'opacity-50' : ''
            }`}
          >
            {/* Image */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
              {product.imageUrl ? (
                <Image src={product.imageUrl} alt={product.title} fill className="object-cover" unoptimized />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="size-5 text-gray-300" />
                </div>
              )}
            </div>

            {/* Product info */}
            <div className="min-w-0">
              <p className="font-medium text-sm text-[#1a1a1a] truncate">{product.title}</p>
              {product.description && (
                <p className="text-xs text-gray-400 truncate mt-0.5">{product.description}</p>
              )}
              {product.variants && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {product.variants.split(',').slice(0, 2).map((v, i) => (
                    <Badge key={i} variant="outline" className="text-[10px] h-4 px-1.5 text-gray-400 border-gray-200">
                      {v.trim()}
                    </Badge>
                  ))}
                  {product.variants.split(',').length > 2 && (
                    <Badge variant="outline" className="text-[10px] h-4 px-1.5 text-gray-300 border-gray-200">
                      +{product.variants.split(',').length - 2}
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Category */}
            <div>
              <Badge
                variant="secondary"
                className={`text-[10px] font-medium ${categoryColors[product.category] || 'bg-gray-100 text-gray-600'}`}
              >
                {categoryLabels[product.category] || product.category}
              </Badge>
            </div>

            {/* Active toggle */}
            <div className="flex justify-center">
              <Switch
                checked={product.isActive}
                onCheckedChange={() => onToggleActive(product)}
                className="data-[state=checked]:bg-[#00A651]"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-1 justify-end">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-gray-400 hover:text-gray-700"
                onClick={() => onEdit(product)}
              >
                <Pencil className="size-3.5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-gray-400 hover:text-red-600"
                onClick={() => onDelete(product.id)}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
