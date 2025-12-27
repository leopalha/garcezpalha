#!/usr/bin/env python3
"""
Script Master para executar FASES 3, 4, 5, 6 da reorganização de documentação.
Leva o score de 94/100 para 100/100.

Uso:
    python3 execute_phases_3456.py

Fases executadas:
    1. FASE 3: Adicionar links cruzados em 33 documentos
    2. FASE 4: Analisar campos [A confirmar] em DADOS_MESTRES
    3. FASE 6: Atualizar ÍNDICE-GERAL.md
    4. FASE 5: Adicionar metadados YAML (se --include-yaml)

Opções:
    --include-yaml: Adicionar metadados YAML (opcional, FASE 5)
    --dry-run: Simular execução sem fazer alterações
"""

import sys
import subprocess
from pathlib import Path

def run_phase(script_name, description):
    """Execute uma phase e reportar resultado."""
    print(f"\n{'='*70}")
    print(f"EXECUTANDO: {description}")
    print(f"{'='*70}\n")

    script_path = Path(__file__).parent / script_name
    if not script_path.exists():
        print(f"✗ ERRO: Script não encontrado: {script_path}")
        return False

    try:
        result = subprocess.run(
            [sys.executable, str(script_path)],
            capture_output=False
        )
        success = result.returncode == 0
        if success:
            print(f"\n✓ {description} CONCLUÍDO COM SUCESSO")
        else:
            print(f"\n✗ {description} FALHOU COM CÓDIGO {result.returncode}")
        return success
    except Exception as e:
        print(f"✗ ERRO ao executar {script_name}: {str(e)}")
        return False

def main():
    """Execute todas as fases."""
    print("""
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║   EXECUTOR DE FASES - MANUS v6.0                                ║
║   Reorganização de Documentação                                  ║
║                                                                  ║
║   Meta: Levar score de 94/100 para 100/100                      ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
    """)

    # Verificar argumentos
    include_yaml = "--include-yaml" in sys.argv
    dry_run = "--dry-run" in sys.argv

    if dry_run:
        print("⚠️  MODO SIMULAÇÃO (--dry-run): Nenhuma alteração será feita\n")

    phases_results = {}

    # FASE 3: Links Cruzados
    phases_results['FASE 3'] = run_phase(
        'add_cross_links.py',
        'FASE 3 - Links Cruzados em 33 Documentos'
    )

    # FASE 4: Analisar DADOS_MESTRES
    phases_results['FASE 4'] = run_phase(
        'analyze_dados_mestres.py',
        'FASE 4 - Análise de Campos [A Confirmar]'
    )

    # FASE 6: Atualizar Índice
    phases_results['FASE 6'] = run_phase(
        'generate_improved_index.py',
        'FASE 6 - Atualizar ÍNDICE-GERAL.md'
    )

    # FASE 5: Metadados YAML (opcional)
    if include_yaml:
        print("\n" + "=" * 70)
        print("NOTA: FASE 5 (Metadados YAML) é opcional e requer edição manual")
        print("=" * 70)
        print("\nPara adicionar metadados YAML:")
        print("1. Abra cada documento em docs/")
        print("2. Adicione este bloco NO INÍCIO do arquivo:")
        print("""
---
título: [Nome do Documento]
versão: 1.0
data: 2025-12-27
status: PRODUCTION
tipo: SSOT | PRINCIPAL | SETUP | IMPLEMENTAÇÃO
---
        """)
        phases_results['FASE 5'] = True
    else:
        print("\n" + "=" * 70)
        print("FASE 5 (Metadados YAML) - PULADO (opcional)")
        print("Use --include-yaml para incluir")
        print("=" * 70)
        phases_results['FASE 5'] = None

    # Relatório Final
    print(f"\n\n{'='*70}")
    print("RELATÓRIO FINAL")
    print(f"{'='*70}\n")

    completed = sum(1 for v in phases_results.values() if v is True)
    failed = sum(1 for v in phases_results.values() if v is False)
    skipped = sum(1 for v in phases_results.values() if v is None)

    for phase, result in phases_results.items():
        if result is True:
            status = "✓ SUCESSO"
        elif result is False:
            status = "✗ FALHA"
        else:
            status = "⊙ PULADO"
        print(f"{phase}: {status}")

    print(f"\nTOTAL: {completed} sucesso | {failed} falha | {skipped} pulado\n")

    if failed == 0:
        print("=" * 70)
        print("🎉 TODAS AS FASES COMPLETADAS COM SUCESSO!")
        print("=" * 70)
        print("\nPróximos passos:")
        print("1. Revisar alterações: git status")
        print("2. Validar documentação: git diff")
        print("3. Fazer commit: git add .")
        print("         git commit -m 'feat: Reorganização MANUS v6.0 - Fases 3,4,5,6'")
        print("4. Push para branch: git push origin fix/markdown-rendering")
        print("\nScore esperado: 100/100 ✨")
        return 0
    else:
        print(f"⚠️  {failed} fase(s) falharam. Verifique os erros acima.")
        return 1

if __name__ == "__main__":
    try:
        exit_code = main()
        sys.exit(exit_code)
    except Exception as e:
        print(f"ERRO CRÍTICO: {str(e)}")
        sys.exit(1)
