/**
 * Simple Markdown Parser
 * Converte markdown básico em elementos React
 */

import React from 'react'

export function parseMarkdown(text: string): React.ReactNode {
  if (!text) return text

  let parts: React.ReactNode[] = [text]
  let key = 0

  // Patterns de markdown (ordem importa!)
  const patterns = [
    {
      // Bold: **text**
      regex: /\*\*(.+?)\*\*/g,
      component: (match: string) => <strong key={key++}>{match}</strong>,
    },
    {
      // Italic: *text*
      regex: /\*(.+?)\*/g,
      component: (match: string) => <em key={key++}>{match}</em>,
    },
    {
      // Code inline: `code`
      regex: /`(.+?)`/g,
      component: (match: string) => (
        <code key={key++} className="bg-gray-800 px-1 rounded text-xs">
          {match}
        </code>
      ),
    },
    {
      // Links: [text](url)
      regex: /\[(.+?)\]\((.+?)\)/g,
      component: (match: string, text: string, url: string) => (
        <a
          key={key++}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 underline"
        >
          {text}
        </a>
      ),
    },
  ]

  // Aplica cada pattern
  for (const { regex, component } of patterns) {
    const newParts: React.ReactNode[] = []

    for (const part of parts) {
      if (typeof part === 'string') {
        const splits = part.split(regex)
        let i = 0

        while (i < splits.length) {
          // Texto antes do match
          if (splits[i]) {
            newParts.push(splits[i])
          }

          // Match (grupo capturado)
          if (i + 1 < splits.length) {
            if (regex.source.includes('\\[')) {
              // Link: [text](url) - 2 grupos
              const text = splits[i + 1]
              const url = splits[i + 2]
              if (text && url) {
                newParts.push(component('', text, url))
              }
              i += 3
            } else {
              // Bold/Italic/Code - 1 grupo
              const match = splits[i + 1]
              if (match) {
                newParts.push(component(match))
              }
              i += 2
            }
          } else {
            i++
          }
        }
      } else {
        // Já é um elemento React, mantém
        newParts.push(part)
      }
    }

    parts = newParts
  }

  return <>{parts}</>
}

/**
 * Remove markdown de um texto, retornando apenas texto puro
 */
export function stripMarkdown(text: string): string {
  if (!text) return ''

  return text
    .replace(/\*\*(.+?)\*\*/g, '$1') // Bold
    .replace(/\*(.+?)\*/g, '$1') // Italic
    .replace(/`(.+?)`/g, '$1') // Code
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Links
}

/**
 * Detecta se um texto contém markdown
 */
export function hasMarkdown(text: string): boolean {
  if (!text) return false

  const markdownPatterns = [
    /\*\*(.+?)\*\*/,
    /\*(.+?)\*/,
    /`(.+?)`/,
    /\[(.+?)\]\(.+?\)/,
  ]

  return markdownPatterns.some((pattern) => pattern.test(text))
}
