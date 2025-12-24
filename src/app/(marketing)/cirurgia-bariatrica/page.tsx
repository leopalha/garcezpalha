'use client'

import { useRouter } from 'next/navigation'
import ProductVSLPage from '../[product]/page'

// Página usa o template dinâmico
// Copy específico vem do banco de dados
export default function CirurgiaBariatricaPage() {
  return <ProductVSLPage />
}
