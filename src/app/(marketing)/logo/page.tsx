'use client'

import { themes, type ThemeName } from '@/lib/theme/themes'
import { useTheme } from '@/lib/theme/theme-provider'
import { Check, Download, Shield, Waves, Castle, User, Crown, Award } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'

interface LogoVariation {
  themeName: ThemeName
  label: string
  rectangleColor: string
  gpColor: string
  nameColor: string
  taglineColor: string
}

const logoVariations: LogoVariation[] = Object.values(themes).map((theme) => ({
  themeName: theme.name,
  label: theme.label,
  rectangleColor: theme.colors.primary,
  gpColor: theme.colors.primaryForeground,
  nameColor: theme.colors.primary,
  taglineColor: theme.colors.secondary,
}))

function Logo({ variation }: { variation: LogoVariation }) {
  return (
    <div className="flex flex-col items-center" style={{ fontFamily: "'Allrounder Monument', sans-serif" }}>
      {/* Retângulo com GP */}
      <div
        className="w-[220px] h-[270px] flex items-center justify-center mb-1 relative"
        style={{ backgroundColor: variation.rectangleColor }}
      >
        <span
          className="text-[160px] font-normal tracking-[-5px] absolute -top-[10px]"
          style={{ color: variation.gpColor }}
        >
          GP
        </span>
      </div>

      {/* GARCEZ PALHA */}
      <h2
        className="text-[74px] font-normal tracking-[6px] mb-2 whitespace-nowrap"
        style={{ color: variation.nameColor }}
      >
        GARCEZ PALHA
      </h2>

      {/* INTELIGÊNCIA JURÍDICA */}
      <p
        className="text-[41px] font-normal tracking-[7.5px] whitespace-nowrap"
        style={{ color: variation.taglineColor }}
      >
        INTELIGÊNCIA JURÍDICA
      </p>
    </div>
  )
}

export default function LogoPage() {
  const { theme: currentTheme, setTheme } = useTheme()
  const [showCoatOfArms, setShowCoatOfArms] = useState(true)

  const downloadImage = () => {
    const link = document.createElement('a')
    link.href = '/brasao-garcez-palha.png'
    link.download = 'brasao-garcez-palha.png'
    link.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-16 px-4">
      <div className="max-w-[1800px] mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            <Shield className="inline-block w-12 h-12 mr-3 mb-2" />
            Brasão Heráldico & Identidade Visual
          </h1>
          <p className="text-xl text-slate-600 mb-2">
            Família Garcez Palha - Linhagem nobre luso-brasileira documentada desde 1661
          </p>
          <p className="text-sm text-slate-500">
            Escolha a variação de logo que melhor representa a marca
          </p>
        </div>

        {/* Brasão Heráldico Section */}
        {showCoatOfArms && (
          <div className="mb-20 bg-white rounded-2xl shadow-2xl p-12">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-slate-900 mb-4 flex items-center justify-center gap-3">
                <Shield className="w-10 h-10 text-red-700" />
                Brasão Heráldico da Família Garcez Palha
              </h2>
              <p className="text-lg text-slate-600 max-w-4xl mx-auto mb-6">
                Brasão da nobre família luso-brasileira, com governadores coloniais em Goa, Damão e Macau.
                Títulos incluem Visconde de Bucelas, Barão de Combarjúa, Conde de Ribandar.
                Fidalgos Cavaleiros da Casa Real, Comendadores da Ordem de Cristo.
              </p>

            </div>

            {/* Coat of Arms Display */}
            <div className="flex flex-col lg:flex-row gap-12 items-start">
              {/* Brasão Imagem */}
              <div className="flex-1 flex justify-center">
                <div className="bg-white p-8 rounded-xl shadow-inner">
                  <Image
                    src="/brasao-garcez-palha.png"
                    alt="Brasão Heráldico da Família Garcez Palha"
                    width={500}
                    height={500}
                    className="w-full h-auto max-w-[500px]"
                    priority
                  />
                </div>
              </div>

              {/* Descrição Heráldica */}
              <div className="flex-1 space-y-6">
                <div className="bg-slate-50 p-6 rounded-xl">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Elementos Heráldicos</h3>
                  <ul className="space-y-3 text-slate-700">
                    <li className="flex items-start gap-3">
                      <Shield className="w-6 h-6 text-red-700 flex-shrink-0 mt-1" />
                      <div>
                        <strong className="text-red-700">Escudo Português</strong>
                        <p className="text-sm">Vermelho carmesim (gules) representando coragem e nobreza militar</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Waves className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <strong className="text-blue-600">Rio de Prata</strong>
                        <p className="text-sm">Ondas de prata com aguado azul-turquesa (Lisboa-Goa-Macau-Brasil)</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Castle className="w-6 h-6 text-slate-600 flex-shrink-0 mt-1" />
                      <div>
                        <strong className="text-slate-600">Torre Medieval</strong>
                        <p className="text-sm">De prata, simbolizando fortalezas coloniais e governo</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <User className="w-6 h-6 text-slate-900 flex-shrink-0 mt-1" />
                      <div>
                        <strong className="text-slate-900">Cabeça de Mouro</strong>
                        <p className="text-sm">Conquistas no Oriente (Goa, Damão, Macau)</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Award className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                      <div>
                        <strong className="text-yellow-600">Leão Rampante</strong>
                        <p className="text-sm">Dourado com coroa real - nobreza e realeza</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Crown className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                      <div>
                        <strong className="text-yellow-600">Coroa de Visconde</strong>
                        <p className="text-sm">Visconde de Bucelas (título histórico da família)</p>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Download Button */}
                <button
                  onClick={downloadImage}
                  className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
                >
                  <Download className="w-5 h-5" />
                  Baixar Brasão (PNG)
                </button>

                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                  <p className="text-sm text-amber-900">
                    <strong>Nota Histórica:</strong> 5 séculos de serviço à Coroa Portuguesa.
                    Governadores coloniais, fidalgos cavaleiros, comendadores da Ordem de Cristo,
                    engenheiros militares e defensores culturais.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Variações de Logo Moderna</h2>
          <p className="text-slate-600">Identidade visual contemporânea para advocacia de elite</p>
        </div>

        {/* Logo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {logoVariations.map((variation) => {
            const isActive = currentTheme === variation.themeName

            return (
              <button
                key={variation.themeName}
                onClick={() => setTheme(variation.themeName)}
                className={`bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border-2 text-left relative aspect-square flex flex-col ${
                  isActive ? 'border-primary ring-4 ring-primary/20' : 'border-slate-200'
                }`}
              >
                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground rounded-full p-2">
                    <Check className="w-5 h-5" />
                  </div>
                )}

                {/* Theme Label */}
                <div className="text-center mb-2">
                  <h3 className="text-xl font-semibold text-slate-800">
                    {variation.label}
                  </h3>
                  {isActive && (
                    <span className="inline-block mt-1 text-xs font-medium text-primary">
                      Tema Ativo
                    </span>
                  )}
                </div>

                {/* Logo */}
                <div className="flex justify-center items-center flex-1 overflow-hidden">
                  <div className="scale-[0.28]">
                    <Logo variation={variation} />
                  </div>
                </div>

                {/* Color Info */}
                <div className="border-t border-slate-200 pt-3 mt-auto">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-slate-500 mb-1">Retângulo</p>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded border border-slate-300"
                          style={{ backgroundColor: variation.rectangleColor }}
                        />
                        <span className="text-slate-600 font-mono">{variation.rectangleColor}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1">Tagline</p>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded border border-slate-300"
                          style={{ backgroundColor: variation.taglineColor }}
                        />
                        <span className="text-slate-600 font-mono">{variation.taglineColor}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-16 text-center">
          <p className="text-slate-500 text-sm">
            Todas as variações utilizam a fonte Allrounder Monument Book e mantêm as proporções exatas do design original
          </p>
          <p className="text-slate-400 text-xs mt-2">
            O tema selecionado será aplicado em todo o site, incluindo a logo no header
          </p>
        </div>

      </div>
    </div>
  )
}
