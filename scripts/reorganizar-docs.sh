#!/bin/bash

# Script para reorganizar pasta docs
cd "d:/garcezpalha/docs"

echo "🗂️  Reorganizando documentação..."

# Criar estrutura de pastas
mkdir -p 01-estrategia
mkdir -p 02-produto
mkdir -p 03-desenvolvimento
mkdir -p 04-implementacao/reports
mkdir -p 05-marketing
mkdir -p 06-operacoes
mkdir -p _arquivos-antigos

# ============================================================================
# 01-ESTRATÉGIA
# ============================================================================
echo "📁 Movendo arquivos de estratégia..."

# Posicionamento e marca
mv -f 01-POSICIONAMENTO-MARCA.md 01-estrategia/ 2>/dev/null || true
mv -f POSICIONAMENTO_MARCA.md 01-estrategia/ 2>/dev/null || true

# Design System
mv -f *DESIGN_SYSTEM*.md 01-estrategia/ 2>/dev/null || true
mv -f 02_DESIGN_SYSTEM.md 01-estrategia/ 2>/dev/null || true

# Business Model
mv -f *BUSINESS*.md 01-estrategia/ 2>/dev/null || true
mv -f 08_BUSINESS_MODEL.md 01-estrategia/ 2>/dev/null || true

# Modelo Dual e Análises
mv -f GARCEZ_PALHA_DUAL_MODEL*.md 01-estrategia/ 2>/dev/null || true
mv -f ANALISE_*.md 01-estrategia/ 2>/dev/null || true
mv -f MODELO_CORRETO*.md 01-estrategia/ 2>/dev/null || true

# ============================================================================
# 02-PRODUTO
# ============================================================================
echo "📁 Movendo arquivos de produto..."

# PRDs
mv -f *PRD*.md 02-produto/ 2>/dev/null || true
mv -f 03-PRD.md 02-produto/ 2>/dev/null || true
mv -f 03_PRD.md 02-produto/ 2>/dev/null || true

# User Flows
mv -f *USER*.md 02-produto/ 2>/dev/null || true
mv -f 04-USER-FLOWS.md 02-produto/ 2>/dev/null || true
mv -f 04_USER_FLOWS.md 02-produto/ 2>/dev/null || true

# Catálogo de Produtos
mv -f *CATALOGO*.md 02-produto/ 2>/dev/null || true
mv -f 05-CATALOGO-PRODUTOS.md 02-produto/ 2>/dev/null || true
mv -f ESTRUTURA_PRODUTOS.md 02-produto/ 2>/dev/null || true

# ============================================================================
# 03-DESENVOLVIMENTO
# ============================================================================
echo "📁 Movendo arquivos de desenvolvimento..."

# Arquitetura
mv -f *ARQUITETURA*.md 03-desenvolvimento/ 2>/dev/null || true
mv -f 02-ARQUITETURA-PLATAFORMA.md 03-desenvolvimento/ 2>/dev/null || true
mv -f *TECHNICAL*.md 03-desenvolvimento/ 2>/dev/null || true
mv -f 05_TECHNICAL_ARCHITECTURE.md 03-desenvolvimento/ 2>/dev/null || true

# Component Library
mv -f *COMPONENT*.md 03-desenvolvimento/ 2>/dev/null || true
mv -f 06_COMPONENT_LIBRARY.md 03-desenvolvimento/ 2>/dev/null || true

# Dev Brief
mv -f *DEV_BRIEF*.md 03-desenvolvimento/ 2>/dev/null || true
mv -f 07_DEV_BRIEF.md 03-desenvolvimento/ 2>/dev/null || true

# Estado Atual
mv -f ESTADO_ATUAL*.md 03-desenvolvimento/ 2>/dev/null || true

# ============================================================================
# 04-IMPLEMENTAÇÃO
# ============================================================================
echo "📁 Movendo arquivos de implementação..."

# Guias de implementação
mv -f IMPLEMENTACAO_*.md 04-implementacao/ 2>/dev/null || true

# Planos de execução
mv -f PLANO_*.md 04-implementacao/ 2>/dev/null || true

# Reports (mover de .manus/reports/)
if [ -d "../.manus/reports" ]; then
  cp -r ../.manus/reports/* 04-implementacao/reports/ 2>/dev/null || true
fi

# ============================================================================
# 05-MARKETING
# ============================================================================
echo "📁 Movendo arquivos de marketing..."

# SEO
mv -f *SEO*.md 05-marketing/ 2>/dev/null || true
mv -f 06-SEO-CONTEUDO.md 05-marketing/ 2>/dev/null || true
mv -f 08-SEO-CONTEUDO.md 05-marketing/ 2>/dev/null || true

# Google Ads
mv -f *GOOGLE*.md 05-marketing/ 2>/dev/null || true
mv -f *ADS*.md 05-marketing/ 2>/dev/null || true
mv -f 07-GOOGLE-ADS-CAMPANHAS.md 05-marketing/ 2>/dev/null || true

# Landing Pages
mv -f *LANDING*.md 05-marketing/ 2>/dev/null || true
mv -f 06-LANDING-PAGE-PRINCIPAL.md 05-marketing/ 2>/dev/null || true

# ============================================================================
# 06-OPERAÇÕES
# ============================================================================
echo "📁 Movendo arquivos de operações..."

# IA Triagem
mv -f *TRIAGEM*.md 06-operacoes/ 2>/dev/null || true
mv -f 07-IA-TRIAGEM-UNIVERSAL.md 06-operacoes/ 2>/dev/null || true
mv -f 09-IA-TRIAGEM-UNIVERSAL.md 06-operacoes/ 2>/dev/null || true

# Fluxos de Qualificação
mv -f *QUALIFICACAO*.md 06-operacoes/ 2>/dev/null || true
mv -f 08-FLUXOS-QUALIFICACAO.md 06-operacoes/ 2>/dev/null || true
mv -f 10-FLUXOS-QUALIFICACAO.md 06-operacoes/ 2>/dev/null || true

# Propostas e Contratos
mv -f *PROPOSTAS*.md 06-operacoes/ 2>/dev/null || true
mv -f *CONTRATOS*.md 06-operacoes/ 2>/dev/null || true
mv -f 10-PROPOSTAS-CONTRATOS.md 06-operacoes/ 2>/dev/null || true

# Precificação
mv -f *PRECIFICACAO*.md 06-operacoes/ 2>/dev/null || true
mv -f 09-PRECIFICACAO-DINAMICA.md 06-operacoes/ 2>/dev/null || true

# ============================================================================
# ARQUIVOS ANTIGOS (Duplicatas e Numerados)
# ============================================================================
echo "📁 Movendo arquivos antigos/duplicados..."

# Mover todos arquivos numerados restantes
mv -f [0-9][0-9]-*.md _arquivos-antigos/ 2>/dev/null || true
mv -f [0-9][0-9]_*.md _arquivos-antigos/ 2>/dev/null || true

# Mover duplicatas
mv -f *_[0-9]*.md _arquivos-antigos/ 2>/dev/null || true

# ============================================================================
# LIMPEZA
# ============================================================================
echo "🧹 Limpando duplicatas..."

# Remover duplicatas óbvias dentro de cada pasta
for dir in 01-estrategia 02-produto 03-desenvolvimento 04-implementacao 05-marketing 06-operacoes; do
  if [ -d "$dir" ]; then
    cd "$dir"
    # Manter apenas arquivos sem números ou underscores no início
    for file in [0-9]*; do
      [ -f "$file" ] && mv "$file" ../_arquivos-antigos/ 2>/dev/null || true
    done
    cd ..
  fi
done

echo "✅ Reorganização concluída!"
echo ""
echo "📊 Estrutura final:"
echo "  01-estrategia/     - Posicionamento, modelo de negócio, design"
echo "  02-produto/        - PRDs, user flows, catálogo"
echo "  03-desenvolvimento/ - Arquitetura, componentes, dev brief"
echo "  04-implementacao/  - Guias de implementação, planos, reports"
echo "  05-marketing/      - SEO, Google Ads, landing pages"
echo "  06-operacoes/      - Triagem IA, qualificação, workflows"
echo "  _arquivos-antigos/ - Backups e duplicatas"
echo ""
echo "📝 Arquivos mantidos na raiz:"
ls -1 *.md 2>/dev/null | grep -v "^_" | head -10
