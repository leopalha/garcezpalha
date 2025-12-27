#!/usr/bin/env python3
"""
Script para analisar campos [A confirmar] em DADOS_MESTRES.md
FASE 4: Completar DADOS_MESTRES com campos confirmados

Uso:
    python3 analyze_dados_mestres.py

Resultado:
    - Relatório de campos [A confirmar] pendentes
    - Sugestões de onde procurar valores
    - Instruções para preenchimento manual
"""

import re
from pathlib import Path

def analyze_dados_mestres():
    """Analyze DADOS_MESTRES.md for [A confirmar] fields."""

    DADOS_MESTRES = Path(__file__).parent.parent.parent / "business" / "DADOS_MESTRES.md"

    print("=" * 70)
    print("ANÁLISE - CAMPOS [A CONFIRMAR] EM DADOS_MESTRES.md")
    print("=" * 70)
    print()

    if not DADOS_MESTRES.exists():
        print(f"✗ ERRO: Arquivo não encontrado: {DADOS_MESTRES}")
        return False

    with open(DADOS_MESTRES, 'r', encoding='utf-8') as f:
        content = f.read()

    # Encontrar todos os campos com [A confirmar]
    pattern = r'\|\s*\[A confirmar[^\]]*\]\s*\|'
    matches = re.finditer(pattern, content)

    pendentes = []
    for match in matches:
        # Encontrar a linha completa
        start = content.rfind('\n', 0, match.start()) + 1
        end = content.find('\n', match.end())
        if end == -1:
            end = len(content)

        linha = content[start:end]
        pendentes.append(linha)

    # Também procurar por [A confirmar] sem padrão específico
    all_matches = re.finditer(r'\[A confirmar[^\]]*\]', content)
    for match in all_matches:
        # Encontrar a linha
        start = content.rfind('\n', 0, match.start()) + 1
        end = content.find('\n', match.end())
        if end == -1:
            end = len(content)

        linha = content[start:end]
        if linha not in pendentes:
            pendentes.append(linha)

    print(f"Total de campos [A confirmar]: {len(pendentes)}\n")

    if len(pendentes) == 0:
        print("✓ Nenhum campo pendente encontrado!")
        return True

    for i, item in enumerate(pendentes, 1):
        print(f"{i}. {item.strip()}")

    print()
    print("=" * 70)
    print("INSTRUÇÕES PARA COMPLETAR:")
    print("=" * 70)
    print()
    print("1. CNPJ: Verificar documento de constituição ou site da empresa")
    print("2. OAB (Sociedade): Consultar registro na OAB-RJ")
    print("3. OAB (Indivíduos): Consultar carteira OAB de cada profissional")
    print("4. CONPEJ: Verificar registro em Conselho de Peritos Judiciais")
    print("5. CRECI: Verificar registro em Conselho Regional de Corretores")
    print()
    print("Para editar: Abra DADOS_MESTRES.md e substitua [A confirmar] pelo valor real")
    print()

    return len(pendentes) > 0

if __name__ == "__main__":
    try:
        analyze_dados_mestres()
    except Exception as e:
        print(f"ERRO: {str(e)}")
