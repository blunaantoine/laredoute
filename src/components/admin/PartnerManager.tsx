'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Loader2, Plus, Pencil, Trash2, Users, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import { useToast } from '@/hooks/use-toast'

interface Partner {
  id: string
  name: string
  description: string | null
  logoUrl: string | null
  documentUrl: string | null
  order: number
  isActive: boolean
}

interface PartnerForm {
  name: string
  description: string
  logoFile: File | null
  documentFile: File | null
}

const emptyForm: PartnerForm = {
  name: '',
  description: '',
  logoFile: null,
  documentFile: null,
}

export default function PartnerManager() {
  const { toast } = useToast()
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<PartnerForm>({ ...emptyForm })

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)
  const [editForm, setEditForm] = useState<PartnerForm>({ ...emptyForm })

  const fetchPartners = useCallback(async () => {
    try {
      const res = await fetch('/api/partners')
      const data = await res.json()
      setPartners(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching partners:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPartners()
  }, [fetchPartners])

  const handleAddPartner = async () => {
    if (!form.name) {
      toast({ title: 'Erreur', description: 'Le nom est requis.', variant: 'destructive' })
      return
    }
    setSaving(true)
    try {
      let logoUrl = ''
      let documentUrl = ''
      if (form.logoFile) {
        const formData = new FormData()
        formData.append('file', form.logoFile)
        formData.append('category', 'partner')
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
        const uploadData = await uploadRes.json()
        if (uploadData.success) logoUrl = uploadData.url
      }
      if (form.documentFile) {
        const formData = new FormData()
        formData.append('file', form.documentFile)
        formData.append('category', 'partner')
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
        const uploadData = await uploadRes.json()
        if (uploadData.success) documentUrl = uploadData.url
      }
      const res = await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          description: form.description || null,
          logoUrl: logoUrl || null,
          documentUrl: documentUrl || null,
          order: 0,
        }),
      })
      if (res.ok) {
        toast({ title: 'Partenaire ajouté' })
        setForm({ ...emptyForm })
        fetchPartners()
      }
    } catch {
      toast({ title: 'Erreur', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleEditPartner = async () => {
    if (!editingPartner || !editForm.name) return
    setSaving(true)
    try {
      let logoUrl = editingPartner.logoUrl || ''
      let documentUrl = editingPartner.documentUrl || ''
      if (editForm.logoFile) {
        const formData = new FormData()
        formData.append('file', editForm.logoFile)
        formData.append('category', 'partner')
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
        const uploadData = await uploadRes.json()
        if (uploadData.success) logoUrl = uploadData.url
      }
      if (editForm.documentFile) {
        const formData = new FormData()
        formData.append('file', editForm.documentFile)
        formData.append('category', 'partner')
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
        const uploadData = await uploadRes.json()
        if (uploadData.success) documentUrl = uploadData.url
      }
      const res = await fetch('/api/partners', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingPartner.id,
          name: editForm.name,
          description: editForm.description || null,
          logoUrl: logoUrl || null,
          documentUrl: documentUrl || null,
        }),
      })
      if (res.ok) {
        toast({ title: 'Partenaire modifié' })
        setEditDialogOpen(false)
        fetchPartners()
      }
    } catch {
      toast({ title: 'Erreur', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleDeletePartner = async (id: string) => {
    if (!confirm('Supprimer ce partenaire ?')) return
    try {
      const res = await fetch(`/api/partners?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast({ title: 'Partenaire supprimé' })
        fetchPartners()
      }
    } catch {
      toast({ title: 'Erreur', variant: 'destructive' })
    }
  }

  const openEditDialog = (partner: Partner) => {
    setEditingPartner(partner)
    setEditForm({
      name: partner.name,
      description: partner.description || '',
      logoFile: null,
      documentFile: null,
    })
    setEditDialogOpen(true)
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
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Partenaires</h1>
        <p className="text-gray-500 mt-1 text-sm">{partners.length} partenaire{partners.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Add Partner Form */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Plus className="size-4 text-[#00A651]" />
            Ajouter un partenaire
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm">Nom *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nom du partenaire" className="focus:border-[#00A651] focus:ring-[#00A651]/20" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Logo</Label>
              <Input type="file" accept="image/*" onChange={(e) => setForm({ ...form, logoFile: e.target.files?.[0] || null })} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Document</Label>
              <Input type="file" onChange={(e) => setForm({ ...form, documentFile: e.target.files?.[0] || null })} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label className="text-sm">Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description du partenaire" rows={3} className="focus:border-[#00A651] focus:ring-[#00A651]/20" />
            </div>
          </div>
          <Button onClick={handleAddPartner} disabled={saving} className="bg-[#00A651] hover:bg-[#008541] gap-2">
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
            Ajouter
          </Button>
        </CardContent>
      </Card>

      {/* Partners List */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Liste des partenaires</CardTitle>
        </CardHeader>
        <CardContent>
          {partners.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="size-7 text-gray-300" />
              </div>
              <p className="text-gray-500 text-sm font-medium">Aucun partenaire</p>
              <p className="text-gray-400 text-xs mt-1">Ajoutez votre premier partenaire</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {partners.map((partner) => (
                <div key={partner.id} className="flex items-center gap-4 py-3.5 hover:bg-gray-50/50 transition-colors -mx-2 px-2 rounded-lg">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                    {partner.logoUrl ? (
                      <Image src={partner.logoUrl} alt={partner.name} fill className="object-cover" unoptimized />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Users className="size-5 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm text-[#1a1a1a]">{partner.name}</p>
                      {partner.documentUrl && (
                        <a href={partner.documentUrl} target="_blank" rel="noopener noreferrer" className="text-[#00A651] hover:text-[#008541]">
                          <ExternalLink className="size-3" />
                        </a>
                      )}
                    </div>
                    {partner.description && (
                      <p className="text-xs text-gray-400 truncate mt-0.5">{partner.description}</p>
                    )}
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-gray-700" onClick={() => openEditDialog(partner)}>
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-red-600" onClick={() => handleDeletePartner(partner.id)}>
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Modifier le partenaire</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nom *</Label>
                <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="focus:border-[#00A651] focus:ring-[#00A651]/20" />
              </div>
              <div className="space-y-2">
                <Label>Nouveau logo</Label>
                <Input type="file" accept="image/*" onChange={(e) => setEditForm({ ...editForm, logoFile: e.target.files?.[0] || null })} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Description</Label>
                <Textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} rows={3} className="focus:border-[#00A651] focus:ring-[#00A651]/20" />
              </div>
              <div className="space-y-2">
                <Label>Nouveau document</Label>
                <Input type="file" onChange={(e) => setEditForm({ ...editForm, documentFile: e.target.files?.[0] || null })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleEditPartner} disabled={saving} className="bg-[#00A651] hover:bg-[#008541]">
              {saving ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
              Sauvegarder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
