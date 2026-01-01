# Script de Configuração do Ambiente de Desenvolvimento (Sem Admin)
# Configurações que podem ser feitas sem privilégios de administrador

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Configuração do Ambiente de Dev" -ForegroundColor Cyan
Write-Host "  (Modo Usuário)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectPath = "d:\garcezpalha"

# ============================================
# 1. CONFIGURAR NPM/YARN CACHE
# ============================================
Write-Host "[1/2] Configurando npm e yarn cache..." -ForegroundColor Yellow

try {
    # Configurar npm
    $npmCachePath = "$projectPath\.npm-cache"

    if (-not (Test-Path $npmCachePath)) {
        New-Item -ItemType Directory -Path $npmCachePath -Force | Out-Null
    }

    npm config set cache $npmCachePath
    npm config set cache-max 1000000
    npm config set prefer-offline true
    npm config set progress false

    Write-Host "  ✓ npm cache configurado: $npmCachePath" -ForegroundColor Green
    Write-Host "  ✓ cache-max: 1000000" -ForegroundColor Green
    Write-Host "  ✓ prefer-offline: true" -ForegroundColor Green

    # Configurar yarn se estiver instalado
    $yarnInstalled = Get-Command yarn -ErrorAction SilentlyContinue

    if ($yarnInstalled) {
        $yarnCachePath = "$projectPath\.yarn-cache"

        if (-not (Test-Path $yarnCachePath)) {
            New-Item -ItemType Directory -Path $yarnCachePath -Force | Out-Null
        }

        yarn config set cache-folder $yarnCachePath
        Write-Host "  ✓ yarn cache configurado: $yarnCachePath" -ForegroundColor Green
    } else {
        Write-Host "  ! yarn não instalado, pulando configuração" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  ✗ Erro ao configurar cache: $($_.Exception.Message)" -ForegroundColor Red
}

# ============================================
# 2. GERAR CONFIGURAÇÕES DO VS CODE
# ============================================
Write-Host "`n[2/2] Gerando configurações do VS Code..." -ForegroundColor Yellow

$vscodeSettings = @"
{
  "files.watcherExclude": {
    "**/.git/objects/**": true,
    "**/.git/subtree-cache/**": true,
    "**/node_modules/**": true,
    "**/.next/**": true,
    "**/.swc/**": true,
    "**/coverage/**": true,
    "**/.vercel/**": true,
    "**/.npm-cache/**": true,
    "**/.yarn-cache/**": true
  },
  "typescript.preferences.includePackageJsonAutoImports": "auto",
  "typescript.tsserver.maxTsServerMemory": 8192,
  "editor.bracketPairColorization.enabled": false,
  "editor.guides.bracketPairs": false,
  "editor.inlayHints.enabled": "off",
  "explorer.compactFolders": false,
  "search.useIgnoreFiles": true,
  "search.exclude": {
    "**/node_modules": true,
    "**/.next": true,
    "**/.swc": true,
    "**/coverage": true,
    "**/.vercel": true,
    "**/.npm-cache": true,
    "**/.yarn-cache": true
  },
  "files.exclude": {
    "**/.git": true,
    "**/.svn": true,
    "**/.hg": true,
    "**/CVS": true,
    "**/.DS_Store": true
  }
}
"@

$vscodeSettingsPath = "$projectPath\.vscode\settings.json"
$vscodeDir = "$projectPath\.vscode"

try {
    if (-not (Test-Path $vscodeDir)) {
        New-Item -ItemType Directory -Path $vscodeDir -Force | Out-Null
    }

    # Fazer backup se já existir
    if (Test-Path $vscodeSettingsPath) {
        $backupPath = "$vscodeSettingsPath.backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
        Copy-Item $vscodeSettingsPath $backupPath
        Write-Host "  ✓ Backup criado: $backupPath" -ForegroundColor Green
    }

    $vscodeSettings | Out-File -FilePath $vscodeSettingsPath -Encoding UTF8
    Write-Host "  ✓ Configurações do VS Code salvas em: $vscodeSettingsPath" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Erro ao gerar configurações do VS Code: $($_.Exception.Message)" -ForegroundColor Red
}

# ============================================
# RESUMO E PRÓXIMOS PASSOS
# ============================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  CONFIGURAÇÕES APLICADAS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`nConfigurações concluídas:" -ForegroundColor White
Write-Host "  ✓ npm/yarn: Cache otimizado" -ForegroundColor Green
Write-Host "  ✓ VS Code: Configurações salvas" -ForegroundColor Green

Write-Host "`n⚠️  CONFIGURAÇÕES QUE REQUEREM ADMINISTRADOR:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Execute o PowerShell como Administrador e rode:" -ForegroundColor White
Write-Host "  cd d:\garcezpalha" -ForegroundColor Cyan
Write-Host "  .\setup-dev-environment.ps1" -ForegroundColor Cyan
Write-Host ""
Write-Host "Isso irá configurar:" -ForegroundColor White
Write-Host "  • Virtual Memory (48-64GB)" -ForegroundColor Gray
Write-Host "  • Power Plan (High/Ultimate Performance)" -ForegroundColor Gray
Write-Host "  • Windows Defender (Exclusões)" -ForegroundColor Gray

Write-Host "`n✓ Processo concluído!" -ForegroundColor Green
Write-Host ""
