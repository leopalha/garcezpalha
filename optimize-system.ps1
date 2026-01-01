#Requires -RunAsAdministrator

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Otimizacao do Sistema para Dev" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectPath = "d:\garcezpalha"
$requiresReboot = $false

# VIRTUAL MEMORY
Write-Host "[1/4] Configurando Virtual Memory..." -ForegroundColor Yellow
try {
    $cs = Get-WmiObject Win32_ComputerSystem -EnableAllPrivileges
    $cs.AutomaticManagedPagefile = $false
    $cs.Put() | Out-Null

    $pf = Get-WmiObject -Query "SELECT * FROM Win32_PageFileSetting WHERE Name='C:\\pagefile.sys'"
    if ($pf) { $pf.Delete() }

    $newPf = ([WmiClass]"Win32_PageFileSetting").CreateInstance()
    $newPf.Name = "C:\pagefile.sys"
    $newPf.InitialSize = 49152
    $newPf.MaximumSize = 65536
    $newPf.Put() | Out-Null

    Write-Host "  OK: Virtual Memory 48-64GB" -ForegroundColor Green
    $requiresReboot = $true
} catch {
    Write-Host "  ERRO: $_" -ForegroundColor Red
}

# POWER PLAN
Write-Host "`n[2/4] Configurando Power Plan..." -ForegroundColor Yellow
try {
    $up = powercfg /l | Select-String "Ultimate Performance"
    if ($up) {
        $guid = ($up -split '\s+')[3]
        powercfg /setactive $guid
        Write-Host "  OK: Ultimate Performance" -ForegroundColor Green
    } else {
        $hp = powercfg /l | Select-String "High Performance|Alto desempenho"
        if ($hp) {
            $guid = ($hp -split '\s+')[3]
            powercfg /setactive $guid
            Write-Host "  OK: High Performance" -ForegroundColor Green
        } else {
            powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61
            Write-Host "  OK: Ultimate Performance criado" -ForegroundColor Green
        }
    }
} catch {
    Write-Host "  ERRO: $_" -ForegroundColor Red
}

# WINDOWS DEFENDER
Write-Host "`n[3/4] Configurando Windows Defender..." -ForegroundColor Yellow
$paths = @(
    "$projectPath\.next",
    "$projectPath\node_modules",
    "$projectPath\.swc",
    "$projectPath\coverage",
    "$projectPath\.vercel",
    "$projectPath\.npm-cache",
    "$projectPath\.yarn-cache"
)

foreach ($p in $paths) {
    try {
        Add-MpPreference -ExclusionPath $p -ErrorAction SilentlyContinue
        Write-Host "  OK: $p" -ForegroundColor Green
    } catch {
        Write-Host "  AVISO: $p" -ForegroundColor Yellow
    }
}

# NPM CONFIG
Write-Host "`n[4/4] Configurando npm..." -ForegroundColor Yellow
try {
    $npmCache = "$projectPath\.npm-cache"
    if (-not (Test-Path $npmCache)) {
        New-Item -ItemType Directory -Path $npmCache -Force | Out-Null
    }
    npm config set cache $npmCache
    npm config set prefer-offline true
    Write-Host "  OK: npm cache configurado" -ForegroundColor Green
} catch {
    Write-Host "  ERRO: $_" -ForegroundColor Red
}

# RESUMO
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  CONCLUIDO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

if ($requiresReboot) {
    Write-Host "`nATENCAO: Reinicie para aplicar Virtual Memory!" -ForegroundColor Yellow
    $r = Read-Host "Reiniciar agora? (S/N)"
    if ($r -eq "S" -or $r -eq "s") {
        shutdown /r /t 10
    }
}

Write-Host "`nPronto!" -ForegroundColor Green
