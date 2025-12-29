'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle } from 'lucide-react'

const faqs = [
  {
    question: 'Quanto custa?',
    answer: 'Nossos serviços começam em R$ 1.500 para casos simples. O preço é fixo e você sabe exatamente quanto vai pagar antes de contratar. Sem surpresas.',
  },
  {
    question: 'Como funciona o atendimento por IA?',
    answer: 'Nossa inteligência artificial faz a triagem inicial, coleta informações e prepara seu caso. Mas um advogado de verdade (OAB/RJ 219.390) revisa tudo e assina.',
  },
  {
    question: 'Vocês atendem fora do Rio de Janeiro?',
    answer: 'Sim! Atuamos em todo o Brasil para a maioria dos casos. Como somos 100% digitais, a distância não é problema.',
  },
  {
    question: 'Como funciona o atendimento inicial?',
    answer: 'Nosso objetivo é protocolar a primeira ação do seu caso em até 72 horas úteis após você enviar todos os documentos. Os prazos podem variar de acordo com a complexidade de cada situação.',
  },
  {
    question: 'Como acompanho meu caso?',
    answer: 'Você recebe atualizações automáticas pelo WhatsApp sempre que houver movimentação. Comunicação ágil sobre atualizações do processo.',
  },
  {
    question: 'Como funciona a análise inicial?',
    answer: 'Oferecemos análise preliminar sem compromisso para avaliar a viabilidade da ação. Nossa equipe está disponível para esclarecimento de dúvidas jurídicas.',
  },
]

interface FAQItemProps {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
  index: number
}

function FAQItem({ question, answer, isOpen, onToggle, index }: FAQItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="border-b border-border last:border-b-0"
    >
      <button
        onClick={onToggle}
        className="w-full py-5 flex items-center justify-between text-left hover:text-primary transition-colors"
      >
        <span className="font-medium text-lg pr-4">{question}</span>
        <ChevronDown
          className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-muted-foreground leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  // FAQ Schema for SEO
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <section className="py-20 bg-muted/30">
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <HelpCircle className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tire suas dúvidas sobre nossos serviços
          </p>
        </motion.div>

        {/* FAQ List */}
        <div className="max-w-3xl mx-auto bg-background rounded-xl p-6 shadow-sm">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => toggleFAQ(index)}
              index={index}
            />
          ))}
        </div>

        {/* OAB Compliance Disclaimer */}
        <div className="max-w-3xl mx-auto mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm text-gray-600 dark:text-gray-400">
          <p className="font-semibold mb-2">IMPORTANTE:</p>
          <p>
            Este conteúdo tem caráter meramente informativo e educacional.
            Não constitui promessa de resultado ou garantia de êxito em processos judiciais.
            Cada caso é analisado individualmente conforme suas particularidades.
            Os prazos processuais variam de acordo com a complexidade de cada situação
            e o andamento do Poder Judiciário.
          </p>
          <p className="mt-2 text-xs">OAB/RJ 219.390 | CONPEJ/RJ | CRECI/RJ</p>
        </div>
      </div>
    </section>
  )
}
