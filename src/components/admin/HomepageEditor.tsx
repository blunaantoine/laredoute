'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Loader2, Save, FileText, Image as ImageIcon, Plus, Trash2, Pencil, Upload } from 'lucide-react'
import Image from 'next/image'
import { useToast } from '@/hooks/use-toast'

interface SiteContent {
  id: string
  key: string
  category: string
  title: string | null
  content: string
}

interface SiteImage {
  id: string
  key: string
  category: string
  title: string
  description: string | null
  imageUrl: string
  altText: string | null
  order: number
  isActive: boolean
}

const contentSections = [
  {
    key: 'accueil',
    label: 'Page d\'accueil',
    keys: ['hero-badge', 'hero-title', 'hero-subtitle', 'hero-description', 'products-title', 'auto-description', 'agro-description', 'values-title', 'cta-title', 'cta-description'],
  },
  {
    key: 'automobile',
    label: 'Page Automobile',
    keys: ['auto-description', 'auto-page-title', 'auto-page-subtitle'],
  },
  {
    key: 'agroalimentaire',
    label: 'Page Agro-alimentaire',
    keys: ['agro-description', 'agro-page-title', 'agro-page-subtitle'],
  },
  {
    key: 'about',
    label: 'Page À Propos',
    keys: ['about-title', 'about-description', 'about-mission', 'about-vision', 'about-story', 'about-story2'],
  },
  {
    key: 'contact',
    label: 'Page Contact',
    keys: ['cta-title', 'cta-description', 'contact-info'],
  },
]

const imageCategories = [
  { key: 'logo', label: 'Logos' },
  { key: 'hero', label: 'Hero' },
  { key: 'about', label: 'À Propos' },
  { key: 'product', label: 'Produits' },
  { key: 'partner', label: 'Partenaires' },
  { key: 'general', label: 'Général' },
]

export default function HomepageEditor() {
  const { toast } = useToast()
  const [contents, setContents] = useState<SiteContent[]>([])
  const [images, setImages] = useState<SiteImage[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [editedContents, setEditedContents] = useState<Record<string, string>>({})

  const [newContent, setNewContent] = useState({ key: '', category: 'homepage', title: '', content: '' })
  const [addingContent, setAddingContent] = useState(false)

  const [newImage, setNewImage] = useState({
    key: '',
    category: 'general',
    title: '',
    description: '',
    altText: '',
  })
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [addingImage, setAddingImage] = useState(false)

  // Edit image state
  const [editingImage, setEditingImage] = useState<SiteImage | null>(null)
  const [editFile, setEditFile] = useState<File | null>(null)
  const [savingImage, setSavingImage] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const [contentRes, imagesRes] = await Promise.all([
        fetch('/api/content'),
        fetch('/api/images'),
      ])
      const contentData = await contentRes.json()
      const imageData = await imagesRes.json()
      setContents(Array.isArray(contentData) ? contentData : [])
      setImages(Array.isArray(imageData) ? imageData : [])

      const edited: Record<string, string> = {}
      if (Array.isArray(contentData)) {
        contentData.forEach((c: SiteContent) => { edited[c.key] = c.content })
      }
      setEditedContents(edited)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const saveContent = async (key: string) => {
    setSaving(key)
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, content: editedContents[key] }),
      })
      if (res.ok) {
        toast({ title: 'Contenu sauvegardé', description: `Le contenu "${key}" a été mis à jour.` })
        fetchData()
      } else {
        toast({ title: 'Erreur', description: 'Impossible de sauvegarder.', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Erreur', description: 'Erreur de connexion.', variant: 'destructive' })
    } finally {
      setSaving(null)
    }
  }

  const handleAddContent = async () => {
    if (!newContent.key || !newContent.content) {
      toast({ title: 'Erreur', description: 'La clé et le contenu sont requis.', variant: 'destructive' })
      return
    }
    setAddingContent(true)
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: newContent.key,
          category: newContent.category,
          title: newContent.title || null,
          content: newContent.content,
        }),
      })
      if (res.ok) {
        toast({ title: 'Contenu ajouté' })
        setNewContent({ key: '', category: 'homepage', title: '', content: '' })
        fetchData()
      }
    } catch {
      toast({ title: 'Erreur', variant: 'destructive' })
    } finally {
      setAddingContent(false)
    }
  }

  const handleDeleteContent = async (key: string) => {
    if (!confirm(`Supprimer le contenu "${key}" ?`)) return
    try {
      const res = await fetch(`/api/content?key=${key}`, { method: 'DELETE' })
      if (res.ok) {
        toast({ title: 'Contenu supprimé' })
        fetchData()
      }
    } catch {
      toast({ title: 'Erreur', variant: 'destructive' })
    }
  }

  const handleAddImage = async () => {
    if (!newImage.key || !newImage.title) {
      toast({ title: 'Erreur', description: 'La clé et le titre sont requis.', variant: 'destructive' })
      return
    }
    setAddingImage(true)
    try {
      let imageUrl = ''
      if (uploadFile) {
        const formData = new FormData()
        formData.append('file', uploadFile)
        formData.append('category', newImage.category)
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
        const uploadData = await uploadRes.json()
        if (uploadData.success) imageUrl = uploadData.url
      }
      const res = await fetch('/api/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: newImage.key,
          category: newImage.category,
          title: newImage.title,
          description: newImage.description || null,
          imageUrl: imageUrl || '/placeholder.png',
          altText: newImage.altText || null,
          order: 0,
        }),
      })
      if (res.ok) {
        toast({ title: 'Image ajoutée' })
        setNewImage({ key: '', category: 'general', title: '', description: '', altText: '' })
        setUploadFile(null)
        fetchData()
      }
    } catch {
      toast({ title: 'Erreur', variant: 'destructive' })
    } finally {
      setAddingImage(false)
    }
  }

  const handleDeleteImage = async (id: string) => {
    if (!confirm('Supprimer cette image ?')) return
    try {
      const res = await fetch(`/api/images?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast({ title: 'Image supprimée' })
        fetchData()
      }
    } catch {
      toast({ title: 'Erreur', variant: 'destructive' })
    }
  }

  const handleSaveImage = async () => {
    if (!editingImage) return
    setSavingImage(editingImage.id)
    try {
      let imageUrl = editingImage.imageUrl
      if (editFile) {
        const formData = new FormData()
        formData.append('file', editFile)
        formData.append('category', editingImage.category)
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
        const uploadData = await uploadRes.json()
        if (uploadData.success) imageUrl = uploadData.url
      }
      const res = await fetch('/api/images', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingImage.id,
          imageUrl,
          title: editingImage.title,
          description: editingImage.description,
          altText: editingImage.altText,
        }),
      })
      if (res.ok) {
        toast({ title: 'Image mise à jour', description: `"${editingImage.title}" a été modifiée.` })
        setEditingImage(null)
        setEditFile(null)
        fetchData()
      } else {
        toast({ title: 'Erreur', description: 'Impossible de mettre à jour l\'image.', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Erreur', variant: 'destructive' })
    } finally {
      setSavingImage(null)
    }
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
      <div>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Pages du site</h1>
        <p className="text-gray-500 mt-1 text-sm">Gérez le contenu et les images de chaque page</p>
      </div>

      <Tabs defaultValue="textes">
        <TabsList>
          <TabsTrigger value="textes" className="gap-2">
            <FileText className="size-4" />
            Textes
          </TabsTrigger>
          <TabsTrigger value="images" className="gap-2">
            <ImageIcon className="size-4" />
            Images
          </TabsTrigger>
        </TabsList>

        <TabsContent value="textes" className="space-y-4 mt-6">
          {/* Add new content */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Plus className="size-4 text-[#00A651]" />
                Ajouter un contenu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">Clé (unique)</Label>
                  <Input
                    placeholder="ex: about-story"
                    value={newContent.key}
                    onChange={(e) => setNewContent({ ...newContent, key: e.target.value })}
                    className="focus:border-[#00A651] focus:ring-[#00A651]/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Titre (optionnel)</Label>
                  <Input
                    placeholder="Titre descriptif"
                    value={newContent.title}
                    onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                    className="focus:border-[#00A651] focus:ring-[#00A651]/20"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label className="text-sm">Contenu</Label>
                  <Textarea
                    placeholder="Le texte à afficher..."
                    value={newContent.content}
                    onChange={(e) => setNewContent({ ...newContent, content: e.target.value })}
                    rows={3}
                    className="focus:border-[#00A651] focus:ring-[#00A651]/20"
                  />
                </div>
              </div>
              <Button
                onClick={handleAddContent}
                disabled={addingContent}
                className="bg-[#00A651] hover:bg-[#008541] gap-2"
              >
                {addingContent ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                Ajouter
              </Button>
            </CardContent>
          </Card>

          {/* Content sections */}
          {contentSections.map((section) => {
            const sectionContents = contents.filter((c) => section.keys.includes(c.key))
            return (
              <Card key={section.key} className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    {section.label}
                    <Badge variant="secondary" className="text-[10px]">{sectionContents.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sectionContents.length === 0 ? (
                    <p className="text-gray-400 text-sm py-4">Aucun contenu pour cette page</p>
                  ) : (
                    sectionContents.map((content, i) => (
                      <div key={content.id}>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor={content.key} className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              {content.key}
                              {content.title && <span className="text-gray-300 font-normal ml-2 normal-case">({content.title})</span>}
                            </Label>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteContent(content.key)}
                              className="text-gray-300 hover:text-red-500 h-6 px-2"
                            >
                              <Trash2 className="size-3" />
                            </Button>
                          </div>
                          {content.content.length > 100 ? (
                            <Textarea
                              id={content.key}
                              value={editedContents[content.key] ?? content.content}
                              onChange={(e) =>
                                setEditedContents((prev) => ({ ...prev, [content.key]: e.target.value }))
                              }
                              rows={3}
                              className="resize-none focus:border-[#00A651] focus:ring-[#00A651]/20"
                            />
                          ) : (
                            <Input
                              id={content.key}
                              value={editedContents[content.key] ?? content.content}
                              onChange={(e) =>
                                setEditedContents((prev) => ({ ...prev, [content.key]: e.target.value }))
                              }
                              className="focus:border-[#00A651] focus:ring-[#00A651]/20"
                            />
                          )}
                          <Button
                            size="sm"
                            onClick={() => saveContent(content.key)}
                            disabled={saving === content.key}
                            className="bg-[#00A651] hover:bg-[#008541] h-8 gap-1.5"
                          >
                            {saving === content.key ? (
                              <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                              <Save className="size-3.5" />
                            )}
                            Sauvegarder
                          </Button>
                        </div>
                        {i < sectionContents.length - 1 && <Separator className="mt-4" />}
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            )
          })}

          {/* Other uncategorized content */}
          {(() => {
            const allKeys = contentSections.flatMap(s => s.keys)
            const otherContents = contents.filter(c => !allKeys.includes(c.key))
            if (otherContents.length === 0) return null
            return (
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    Autres contenus
                    <Badge variant="secondary" className="text-[10px]">{otherContents.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {otherContents.map((content) => (
                    <div key={content.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          {content.key}
                        </Label>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteContent(content.key)} className="text-gray-300 hover:text-red-500 h-6 px-2">
                          <Trash2 className="size-3" />
                        </Button>
                      </div>
                      <Input
                        value={editedContents[content.key] ?? content.content}
                        onChange={(e) => setEditedContents((prev) => ({ ...prev, [content.key]: e.target.value }))}
                        className="focus:border-[#00A651] focus:ring-[#00A651]/20"
                      />
                      <Button size="sm" onClick={() => saveContent(content.key)} disabled={saving === content.key} className="bg-[#00A651] hover:bg-[#008541] h-8 gap-1.5">
                        {saving === content.key ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
                        Sauvegarder
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )
          })()}
        </TabsContent>

        <TabsContent value="images" className="space-y-4 mt-6">
          {/* Add new image */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Plus className="size-4 text-[#00A651]" />
                Ajouter une image
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">Clé</Label>
                  <Input placeholder="ex: hero-banner" value={newImage.key} onChange={(e) => setNewImage({ ...newImage, key: e.target.value })} className="focus:border-[#00A651] focus:ring-[#00A651]/20" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Catégorie</Label>
                  <select className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm" value={newImage.category} onChange={(e) => setNewImage({ ...newImage, category: e.target.value })}>
                    {imageCategories.map((cat) => (<option key={cat.key} value={cat.key}>{cat.label}</option>))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Titre</Label>
                  <Input placeholder="Titre de l'image" value={newImage.title} onChange={(e) => setNewImage({ ...newImage, title: e.target.value })} className="focus:border-[#00A651] focus:ring-[#00A651]/20" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Description</Label>
                  <Input placeholder="Description (optionnel)" value={newImage.description} onChange={(e) => setNewImage({ ...newImage, description: e.target.value })} className="focus:border-[#00A651] focus:ring-[#00A651]/20" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Fichier image</Label>
                  <Input type="file" accept="image/*" onChange={(e) => setUploadFile(e.target.files?.[0] || null)} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Texte alternatif</Label>
                  <Input placeholder="Alt text (optionnel)" value={newImage.altText} onChange={(e) => setNewImage({ ...newImage, altText: e.target.value })} className="focus:border-[#00A651] focus:ring-[#00A651]/20" />
                </div>
              </div>
              <Button onClick={handleAddImage} disabled={addingImage} className="bg-[#00A651] hover:bg-[#008541] gap-2">
                {addingImage ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                Ajouter
              </Button>
            </CardContent>
          </Card>

          {/* Images by category */}
          {imageCategories.map((cat) => {
            const catImages = images.filter((img) => img.category === cat.key)
            if (catImages.length === 0) return null
            return (
              <Card key={cat.key} className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    {cat.label}
                    <Badge variant="secondary" className="text-[10px]">{catImages.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {catImages.map((image) => (
                      <div key={image.id} className="group border border-gray-100 rounded-lg overflow-hidden hover:border-gray-200 transition-colors">
                        <div className="relative aspect-video bg-gray-50">
                          <Image src={image.imageUrl} alt={image.altText || image.title} fill className="object-cover" unoptimized />
                        </div>
                        <div className="p-3 space-y-2">
                          <p className="font-medium text-sm truncate">{image.title}</p>
                          <p className="text-[10px] text-gray-400 truncate">{image.key}</p>
                          {image.description && (
                            <p className="text-[11px] text-gray-500 truncate">{image.description}</p>
                          )}

                          {/* Edit mode for this image */}
                          {editingImage?.id === image.id ? (
                            <div className="space-y-2 pt-2 border-t border-gray-100">
                              <div className="space-y-1">
                                <Label className="text-[10px] text-gray-500">Nouvelle image</Label>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => setEditFile(e.target.files?.[0] || null)}
                                  className="text-xs h-8"
                                />
                              </div>
                              <div className="flex gap-1.5">
                                <Button
                                  size="sm"
                                  onClick={handleSaveImage}
                                  disabled={savingImage === image.id}
                                  className="bg-[#00A651] hover:bg-[#008541] h-7 text-xs gap-1 flex-1"
                                >
                                  {savingImage === image.id ? (
                                    <Loader2 className="size-3 animate-spin" />
                                  ) : (
                                    <Upload className="size-3" />
                                  )}
                                  Sauvegarder
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => { setEditingImage(null); setEditFile(null) }}
                                  className="h-7 text-xs"
                                >
                                  Annuler
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex gap-1.5 pt-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingImage(image)}
                                className="flex-1 h-7 text-xs gap-1"
                              >
                                <Pencil className="size-3" />
                                Modifier
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteImage(image.id)}
                                className="h-7 text-xs gap-1"
                              >
                                <Trash2 className="size-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>
      </Tabs>
    </div>
  )
}
