/**
 * Leads List Component
 * Displays paginated list of all leads with actions
 */

'use client'

import { useEffect, useState } from 'react'
import { Eye, Mail, Phone, Download, MoreVertical } from 'lucide-react'
import type { LeadCategory } from '@/lib/ai/qualification'

interface Lead {
  id: string
  clientName: string
  email?: string
  phone?: string
  productId: string
  productName: string
  category: LeadCategory
  score: number
  status: 'active' | 'converted' | 'lost' | 'nurturing'
  estimatedValue: number
  createdAt: string
  lastContactAt?: string
}

export function LeadsList() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchLeads()
  }, [page])

  async function fetchLeads() {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/leads?page=${page}&limit=10`)
      if (response.ok) {
        const data = await response.json()
        setLeads(data.leads)
        setTotalPages(data.totalPages)
      }
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LeadsListSkeleton />
  }

  if (leads.length === 0) {
    return (
      <div className="rounded-lg bg-white shadow dark:bg-gray-800">
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Todos os Leads
          </h3>
        </div>
        <div className="flex flex-col items-center justify-center py-12 px-6">
          <Mail className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Nenhum lead encontrado
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Os leads capturados aparecerão aqui quando os visitantes preencherem seus formulários.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg bg-white shadow dark:bg-gray-800">
      <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Todos os Leads
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Produto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Categoria
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Valor Est.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {leads.map((lead) => (
              <LeadRow key={lead.id} lead={lead} onUpdate={fetchLeads} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4 dark:border-gray-700">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Anterior
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Página {page} de {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  )
}

function LeadRow({ lead, onUpdate }: { lead: Lead; onUpdate: () => void }) {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
      <td className="whitespace-nowrap px-6 py-4">
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{lead.clientName}</div>
          <div className="flex gap-2 text-xs text-gray-500 dark:text-gray-400">
            {lead.email && (
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {lead.email}
              </span>
            )}
            {lead.phone && (
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {lead.phone}
              </span>
            )}
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
        {lead.productName}
      </td>
      <td className="whitespace-nowrap px-6 py-4">
        <CategoryBadge category={lead.category} />
      </td>
      <td className="whitespace-nowrap px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900 dark:text-white">{lead.score}</span>
          <div className="h-2 w-16 rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className={`h-2 rounded-full ${getScoreColor(lead.score)}`}
              style={{ width: `${lead.score}%` }}
            />
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
        R$ {(lead.estimatedValue / 100).toLocaleString('pt-BR')}
      </td>
      <td className="whitespace-nowrap px-6 py-4">
        <StatusBadge status={lead.status} />
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-right">
        <LeadActions lead={lead} onUpdate={onUpdate} />
      </td>
    </tr>
  )
}

function CategoryBadge({ category }: { category: LeadCategory }) {
  const styles = {
    hot: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    warm: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    cold: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    unqualified: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
  }

  return (
    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${styles[category]}`}>
      {category.toUpperCase()}
    </span>
  )
}

function StatusBadge({ status }: { status: Lead['status'] }) {
  const styles = {
    active: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    converted: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    lost: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    nurturing: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
  }

  const labels = {
    active: 'Ativo',
    converted: 'Convertido',
    lost: 'Perdido',
    nurturing: 'Nutrindo',
  }

  return (
    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}

function LeadActions({ lead, onUpdate }: { lead: Lead; onUpdate: () => void }) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <MoreVertical className="h-5 w-5 text-gray-500" />
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 z-20 mt-2 w-48 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800">
            <div className="py-1">
              <button
                onClick={() => {
                  window.location.href = `/admin/leads/${lead.id}`
                  setShowMenu(false)
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Eye className="h-4 w-4" />
                Ver Detalhes
              </button>
              <button
                onClick={async () => {
                  try {
                    const response = await fetch(`/api/proposals/${lead.id}/download`)
                    if (response.ok) {
                      const blob = await response.blob()
                      const url = window.URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = `proposta-${lead.clientName?.replace(/\s+/g, '-').toLowerCase()}-${lead.id.slice(0, 8)}.pdf`
                      document.body.appendChild(a)
                      a.click()
                      window.URL.revokeObjectURL(url)
                      document.body.removeChild(a)
                    } else {
                      alert('Erro ao baixar proposta. Tente novamente.')
                    }
                  } catch (error) {
                    console.error('Error downloading proposal:', error)
                    alert('Erro ao baixar proposta. Tente novamente.')
                  }
                  setShowMenu(false)
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Download className="h-4 w-4" />
                Baixar Proposta
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'bg-red-500'
  if (score >= 60) return 'bg-yellow-500'
  if (score >= 40) return 'bg-blue-500'
  return 'bg-gray-400'
}

function LeadsListSkeleton() {
  return (
    <div className="animate-pulse rounded-lg bg-white shadow dark:bg-gray-800">
      <div className="p-6">
        <div className="h-6 w-32 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="mt-4 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 rounded bg-gray-200 dark:bg-gray-700" />
          ))}
        </div>
      </div>
    </div>
  )
}
