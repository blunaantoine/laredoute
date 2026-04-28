'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lock, Eye, EyeOff, ArrowLeft, Loader2, Shield } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

interface AdminLoginProps {
  onLogin: (password: string) => Promise<boolean>
  onBack: () => void
}

export default function AdminLogin({ onLogin, onBack }: AdminLoginProps) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const success = await onLogin(password)
    if (!success) {
      setError('Mot de passe incorrect')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0a1628] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full">
            {/* Decorative circles */}
            <div className="absolute top-20 left-20 w-64 h-64 border border-[#00A651]/20 rounded-full" />
            <div className="absolute top-40 left-40 w-96 h-96 border border-[#00A651]/10 rounded-full" />
            <div className="absolute bottom-20 right-20 w-48 h-48 border border-white/5 rounded-full" />
            <div className="absolute bottom-40 right-40 w-72 h-72 border border-white/[0.03] rounded-full" />
            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '60px 60px'
            }} />
          </div>
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12">
          <div className="max-w-md text-center space-y-6">
            <div className="w-20 h-20 rounded-2xl bg-[#00A651]/20 flex items-center justify-center mx-auto mb-4">
              <Shield className="size-10 text-[#00A651]" />
            </div>
            <h2 className="text-3xl font-bold text-white">LA REDOUTE</h2>
            <p className="text-lg text-white/40">SARL-U</p>
            <p className="text-white/50 text-sm leading-relaxed">
              Panneau d&apos;administration sécurisé. Gérez vos produits, contenus et paramètres du site.
            </p>
            <div className="flex items-center justify-center gap-6 pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-[#00A651]">39+</p>
                <p className="text-xs text-white/30 mt-1">Produits</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center">
                <p className="text-2xl font-bold text-[#00A651]">2</p>
                <p className="text-xs text-white/30 mt-1">Catalogues</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center">
                <p className="text-2xl font-bold text-[#00A651]">24/7</p>
                <p className="text-xs text-white/30 mt-1">En ligne</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - login form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-gray-500 hover:text-gray-700 -ml-2 mb-6"
            >
              <ArrowLeft className="mr-2 size-4" />
              Retour au site
            </Button>

            <div className="flex items-center gap-3 mb-2 lg:hidden">
              <Image
                src="/logo-main.png"
                alt="LA REDOUTE"
                width={120}
                height={40}
                className="h-10 w-auto object-contain"
              />
            </div>

            <h1 className="text-2xl font-bold text-[#1a1a1a]">Connexion</h1>
            <p className="text-gray-500 mt-1.5 text-sm">Entrez votre mot de passe pour accéder au panneau</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Entrez le mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11 border-gray-200 focus:border-[#00A651] focus:ring-[#00A651]/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-lg">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-[#00A651] hover:bg-[#008541] text-white font-medium"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                'Se connecter'
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Shield className="size-3.5" />
              <span>Accès réservé aux administrateurs autorisés</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
