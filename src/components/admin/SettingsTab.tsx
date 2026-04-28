'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Lock, Eye, EyeOff, Shield, CheckCircle2, AlertCircle, KeyRound, Smartphone } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function SettingsTab() {
  const { toast } = useToast()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChangePassword = async () => {
    // Validation
    if (!currentPassword) {
      toast({ title: 'Erreur', description: 'Veuillez entrer votre mot de passe actuel.', variant: 'destructive' })
      return
    }
    if (!newPassword) {
      toast({ title: 'Erreur', description: 'Veuillez entrer un nouveau mot de passe.', variant: 'destructive' })
      return
    }
    if (newPassword.length < 6) {
      toast({ title: 'Erreur', description: 'Le nouveau mot de passe doit contenir au moins 6 caractères.', variant: 'destructive' })
      return
    }
    if (newPassword !== confirmPassword) {
      toast({ title: 'Erreur', description: 'Les mots de passe ne correspondent pas.', variant: 'destructive' })
      return
    }
    if (currentPassword === newPassword) {
      toast({ title: 'Erreur', description: 'Le nouveau mot de passe doit être différent de l\'actuel.', variant: 'destructive' })
      return
    }

    setLoading(true)
    setSuccess(false)

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const data = await res.json()

      if (data.success) {
        setSuccess(true)
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        toast({ title: 'Succès', description: 'Mot de passe modifié avec succès.' })
      } else {
        toast({ title: 'Erreur', description: data.error || 'Impossible de modifier le mot de passe.', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Erreur', description: 'Erreur de connexion.', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const getPasswordStrength = (password: string) => {
    if (!password) return { level: 0, label: '', color: '' }
    let strength = 0
    if (password.length >= 6) strength++
    if (password.length >= 10) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++

    if (strength <= 2) return { level: 1, label: 'Faible', color: 'bg-red-500' }
    if (strength <= 3) return { level: 2, label: 'Moyen', color: 'bg-amber-500' }
    return { level: 3, label: 'Fort', color: 'bg-[#00A651]' }
  }

  const passwordStrength = getPasswordStrength(newPassword)

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Paramètres</h1>
        <p className="text-gray-500 mt-1 text-sm">Gérez les paramètres de votre compte administrateur</p>
      </div>

      {/* Security Section */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-[#0a1628] to-[#0d2847] p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00A651]/20 flex items-center justify-center">
              <Shield className="size-5 text-[#00A651]" />
            </div>
            <div>
              <h2 className="text-white font-semibold">Sécurité du compte</h2>
              <p className="text-white/50 text-xs mt-0.5">Modifiez votre mot de passe d&apos;accès administrateur</p>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          {/* Success message */}
          {success && (
            <div className="flex items-center gap-3 p-4 bg-[#00A651]/5 border border-[#00A651]/20 rounded-xl mb-6">
              <CheckCircle2 className="size-5 text-[#00A651] flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-[#00A651]">Mot de passe modifié avec succès</p>
                <p className="text-xs text-gray-500 mt-0.5">Votre nouveau mot de passe est actif immédiatement.</p>
              </div>
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); handleChangePassword() }} className="space-y-5">
            {/* Current Password */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <KeyRound className="size-3.5 text-gray-400" />
                Mot de passe actuel
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  placeholder="Entrez votre mot de passe actuel"
                  value={currentPassword}
                  onChange={(e) => { setCurrentPassword(e.target.value); setSuccess(false) }}
                  className="pl-10 pr-10 h-11 border-gray-200 focus:border-[#00A651] focus:ring-[#00A651]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium">Nouveau mot de passe</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">Nouveau mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Entrez le nouveau mot de passe"
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setSuccess(false) }}
                  className="pl-10 pr-10 h-11 border-gray-200 focus:border-[#00A651] focus:ring-[#00A651]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {/* Password strength indicator */}
              {newPassword && (
                <div className="space-y-1.5">
                  <div className="flex gap-1.5">
                    <div className={`h-1.5 flex-1 rounded-full transition-colors ${passwordStrength.level >= 1 ? passwordStrength.color : 'bg-gray-200'}`} />
                    <div className={`h-1.5 flex-1 rounded-full transition-colors ${passwordStrength.level >= 2 ? passwordStrength.color : 'bg-gray-200'}`} />
                    <div className={`h-1.5 flex-1 rounded-full transition-colors ${passwordStrength.level >= 3 ? passwordStrength.color : 'bg-gray-200'}`} />
                  </div>
                  <p className={`text-xs font-medium ${
                    passwordStrength.level === 1 ? 'text-red-500' :
                    passwordStrength.level === 2 ? 'text-amber-500' :
                    'text-[#00A651]'
                  }`}>
                    Force : {passwordStrength.label}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirmer le mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirmez le nouveau mot de passe"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setSuccess(false) }}
                  className="pl-10 pr-10 h-11 border-gray-200 focus:border-[#00A651] focus:ring-[#00A651]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {confirmPassword && newPassword && confirmPassword !== newPassword && (
                <div className="flex items-center gap-1.5 text-red-500">
                  <AlertCircle className="size-3.5" />
                  <span className="text-xs">Les mots de passe ne correspondent pas</span>
                </div>
              )}
              {confirmPassword && newPassword && confirmPassword === newPassword && (
                <div className="flex items-center gap-1.5 text-[#00A651]">
                  <CheckCircle2 className="size-3.5" />
                  <span className="text-xs">Les mots de passe correspondent</span>
                </div>
              )}
            </div>

            {/* Password requirements */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Exigences du mot de passe</p>
              <ul className="space-y-1.5">
                {[
                  { label: 'Au moins 6 caractères', met: newPassword.length >= 6 },
                  { label: 'Contient une majuscule', met: /[A-Z]/.test(newPassword) },
                  { label: 'Contient un chiffre', met: /[0-9]/.test(newPassword) },
                  { label: 'Contient un caractère spécial', met: /[^A-Za-z0-9]/.test(newPassword) },
                ].map((req) => (
                  <li key={req.label} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                      req.met ? 'bg-[#00A651]/10' : 'bg-gray-200'
                    }`}>
                      {req.met ? (
                        <CheckCircle2 className="size-3 text-[#00A651]" />
                      ) : (
                        <div className="size-1.5 rounded-full bg-gray-400" />
                      )}
                    </div>
                    <span className={`text-xs ${req.met ? 'text-[#00A651] font-medium' : 'text-gray-500'}`}>
                      {req.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                disabled={loading || !currentPassword || !newPassword || !confirmPassword}
                className="bg-[#00A651] hover:bg-[#008541] text-white font-medium h-11 px-6 gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Modification en cours...
                  </>
                ) : (
                  <>
                    <Shield className="size-4" />
                    Changer le mot de passe
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Session Info Card */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Smartphone className="size-4 text-gray-400" />
            Informations de session
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Durée de session</p>
              <p className="text-sm font-semibold text-[#1a1a1a] mt-1">7 jours</p>
              <p className="text-xs text-gray-400 mt-0.5">Après connexion</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Dernière modification</p>
              <p className="text-sm font-semibold text-[#1a1a1a] mt-1">
                {success ? 'À l\'instant' : 'Jamais'}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">Du mot de passe</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
