#!/usr/bin/env python3
"""
Script para adicionar links cruzados em todos os 33 documentos principais.
FASE 3: Links Cruzados da reorganização de documentação MANUS v6.0

Uso:
    python3 add_cross_links.py

Resultado:
    - 33 documentos atualizados com seção "DOCUMENTOS RELACIONADOS"
    - Links cruzados para SSOT e navegação
    - Preservação de metadados finais originais
"""

import os
import sys
from pathlib import Path

def add_cross_links():
    """Add cross-links to all numbered documents."""

    DOCS_DIR = Path(__file__).parent.parent.parent / "docs"

    CROSS_LINKS = """---

## 📚 DOCUMENTOS RELACIONADOS

### Fontes Únicas (SSOT)
- [DADOS_MESTRES.md](../business/DADOS_MESTRES.md) - Informações da empresa, produtos, preços, métricas
- [OAB_COMPLIANCE_GUIDE.md](../business/OAB_COMPLIANCE_GUIDE.md) - Regras de compliance jurídico
- [PRD.md](03_PRD.md) - Product Requirements Document
- [STACK_TECNOLOGICA.md](17-STACK-TECNOLOGICA.md) - Arquitetura técnica completa

### Navegação
- [← Índice Geral](00-INDICE-GERAL.md)
- [← Activation Prompt](00_ACTIVATION_PROMPT.md)
- [→ README Principal](../README.md)

---"""

    # Lista de documentos a atualizar
    docs_to_update = [
        "00_ACTIVATION_PROMPT.md",
        "00-INDICE-GERAL.md",
        "01-POSICIONAMENTO-MARCA.md",
        "02_DESIGN_SYSTEM.md",
        "02-ARQUITETURA-PLATAFORMA.md",
        "03_PRD.md",
        "03-CATALOGO-PRODUTOS.md",
        "04_USER_FLOWS.md",
        "04-LANDING-PAGE-PRINCIPAL.md",
        "05_TECHNICAL_ARCHITECTURE.md",
        "05-GOOGLE-ADS-CAMPANHAS.md",
        "06_COMPONENT_LIBRARY.md",
        "06-SEO-CONTEUDO.md",
        "07_DEV_BRIEF.md",
        "07-IA-TRIAGEM-UNIVERSAL.md",
        "08_BUSINESS_MODEL.md",
        "08-FLUXOS-QUALIFICACAO.md",
        "09-PRECIFICACAO-DINAMICA.md",
        "10-PROPOSTAS-CONTRATOS.md",
        "11-PAGAMENTOS-AUTOMACAO.md",
        "12-ONBOARDING-CLIENTE.md",
        "13-TEMPLATES-PETICOES.md",
        "14-IA-PRODUCAO-JURIDICA.md",
        "15_CATALOGO_SERVICOS.md",
        "15-PROTOCOLOS-ACOMPANHAMENTO.md",
        "16_ARQUITETURA_AGENTES_IA.md",
        "16-METRICAS-KPIS.md",
        "17_INTEGRACOES.md",
        "17-STACK-TECNOLOGICA.md",
        "18_DEPLOY_GUIDE.md",
        "18-ROADMAP-IMPLEMENTACAO.md",
        "19-IA-VERTICAL-AUTONOMA.md",
        "20_TESTES.md",
    ]

    updated_count = 0
    skipped_count = 0
    failed_count = 0

    print("=" * 70)
    print("ADICIONANDO LINKS CRUZADOS - FASE 3")
    print("=" * 70)
    print()

    for filename in docs_to_update:
        filepath = DOCS_DIR / filename

        if not filepath.exists():
            print(f"✗ NÃO EXISTE: {filename}")
            failed_count += 1
            continue

        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            # Verificar se já tem a seção
            if "DOCUMENTOS RELACIONADOS" in content:
                print(f"✗ JÁ CONTÉM: {filename}")
                skipped_count += 1
                continue

            # Remover linhas de metadados finais
            lines = content.split('\n')
            last_real_line = len(lines) - 1

            while last_real_line >= 0 and (
                not lines[last_real_line].strip() or
                lines[last_real_line].startswith('*Documento:') or
                lines[last_real_line].startswith('*Versão:') or
                lines[last_real_line].startswith('*Última atualização:')
            ):
                last_real_line -= 1

            # Construir novo conteúdo
            new_content = '\n'.join(lines[:last_real_line + 1]) + '\n\n' + CROSS_LINKS + '\n\n'

            # Adicionar metadados de volta
            for line in lines[last_real_line + 1:]:
                if line.strip():
                    new_content += line + '\n'

            # Escrever arquivo
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)

            print(f"✓ ATUALIZADO: {filename}")
            updated_count += 1

        except Exception as e:
            print(f"✗ ERRO: {filename} - {str(e)}")
            failed_count += 1

    print()
    print("=" * 70)
    print(f"RESUMO: {updated_count} atualizados | {skipped_count} pulados | {failed_count} erros")
    print("=" * 70)

    return updated_count > 0

if __name__ == "__main__":
    try:
        success = add_cross_links()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"ERRO CRÍTICO: {str(e)}")
        sys.exit(1)
