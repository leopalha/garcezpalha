/**
 * Leads Filters Component
 * Filter and search leads
 */

'use client'

import { useState } from 'react'
import { Search, Filter, X } from 'lucide-react'

export function LeadsFilters() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('all')
  const [status, setStatus] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)

  function handleApplyFilters() {
    // Dispatch custom event with filter parameters
    const filterEvent = new CustomEvent('leads-filter-change', {
      detail: {
        search: search.trim(),
        category: category !== 'all' ? category : undefined,
        status: status !== 'all' ? status : undefined,
      },
    })
    window.dispatchEvent(filterEvent)

    // Update URL params for bookmarkability
    const params = new URLSearchParams()
    if (search.trim()) params.set('search', search.trim())
    if (category !== 'all') params.set('category', category)
    if (status !== 'all') params.set('status', status)

    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname
    window.history.pushState({}, '', newUrl)
  }

  function handleClearFilters() {
    setSearch('')
    setCategory('all')
    setStatus('all')
  }

  return (
    <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, email ou telefone..."
            className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          />
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <Filter className="h-4 w-4" />
          Filtros
          {(category !== 'all' || status !== 'all') && (
            <span className="rounded-full bg-blue-500 px-2 py-0.5 text-xs text-white">
              {[category !== 'all' ? 1 : 0, status !== 'all' ? 1 : 0].reduce((a, b) => a + b, 0)}
            </span>
          )}
        </button>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="mt-4 grid grid-cols-1 gap-4 border-t border-gray-200 pt-4 sm:grid-cols-3 dark:border-gray-700">
          {/* Category Filter */}
          <div>
            <label
              htmlFor="category-filter"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Categoria
            </label>
            <select
              id="category-filter"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Todas</option>
              <option value="hot">Hot</option>
              <option value="warm">Warm</option>
              <option value="cold">Cold</option>
              <option value="unqualified">Unqualified</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label
              htmlFor="status-filter"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Status
            </label>
            <select
              id="status-filter"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Todos</option>
              <option value="active">Ativo</option>
              <option value="converted">Convertido</option>
              <option value="lost">Perdido</option>
              <option value="nurturing">Nutrindo</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-end gap-2">
            <button
              onClick={handleApplyFilters}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Aplicar
            </button>
            <button
              onClick={handleClearFilters}
              className="rounded-lg border border-gray-300 p-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              title="Limpar filtros"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
