# ⚡ QUICK START - Garcez Palha Platform

**Última atualização:** 31/12/2024
**Status:** ✅ 100% otimizado

---

## 🚀 DESENVOLVIMENTO

### Iniciar Dev Server (32GB RAM)
```bash
npm run dev:fast
```

**Performance:**
- Build: ~3s
- HMR: ~200ms
- RAM: ~1GB

### Alternativas
```bash
npm run dev        # Padrão (6s build)
npm run dev:ultra  # Máximo (2s build, 16GB heap)
npm run dev:clean  # Limpa cache + inicia
```

---

## 🔧 COMANDOS ÚTEIS

### Build & Deploy
```bash
npm run build      # Build produção
npm run start      # Start produção local
npm typecheck      # Verificar tipos
```

### Database (Supabase)
```bash
npm run db:push    # Push migrations
npm run db:pull    # Pull schema
npm run db:types   # Gerar tipos TS
```

### Testes
```bash
npm test           # Run tests
npm run test:p2    # Testes P2 features
```

### Scripts Úteis
```bash
npx tsx scripts/test-ab-testing.ts      # Teste A/B Testing
npx tsx scripts/test-segmentation.ts    # Teste Segmentação
npx tsx scripts/test-ml-send-time.ts    # Teste ML Optimizer
```

---

## 📁 ESTRUTURA IMPORTANTE

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API Routes
│   └── (routes)/       # Páginas
├── components/         # React Components
│   ├── ui/            # shadcn/ui
│   └── chat/          # Chat components
├── lib/               # Bibliotecas
│   ├── ai/           # AI/ML features
│   ├── email/        # Email automation
│   └── supabase/     # DB client
└── styles/           # Estilos globais

docs/                 # 📚 Documentação completa
supabase/migrations/  # Database migrations
scripts/             # Scripts utilitários
```

---

## 🔗 LINKS RÁPIDOS

### Dashboards
- **Supabase:** https://supabase.com/dashboard/project/cpcnzkttcwodvfqyhkou
- **Local:** http://localhost:3000

### Documentação Principal
- [00-PRD.md](docs/00-PRD.md) - Product Requirements
- [01-USER-FLOWS.md](docs/01-USER-FLOWS.md) - User Flows
- [EXECUTAR_MIGRATIONS.md](EXECUTAR_MIGRATIONS.md) - Database setup

### Performance
- [OTIMIZACOES_FINAIS.md](OTIMIZACOES_FINAIS.md) - Todas otimizações
- [PERFORMANCE_32GB_OPTIMIZATIONS.md](PERFORMANCE_32GB_OPTIMIZATIONS.md) - 32GB config

---

## ⚠️ TROUBLESHOOTING RÁPIDO

### Dev server lento?
```bash
npm run dev:clean
```

### Erro de porta em uso?
```bash
taskkill //F //IM node.exe
npm run dev:fast
```

### Erro "heap out of memory"?
```bash
npm run dev:ultra
```

### Cache corrompido?
```bash
rm -rf .next node_modules/.cache
npm run dev:fast
```

---

## ✅ CHECKLIST DIÁRIO

- [ ] `npm run dev:fast` para iniciar
- [ ] Verificar http://localhost:3000
- [ ] Testar features antes de commit
- [ ] `npm run build` antes de PR
- [ ] Push para `production` branch

---

**Boa sorte! 🚀**

Para documentação completa, veja [docs/](docs/) e [OTIMIZACOES_FINAIS.md](OTIMIZACOES_FINAIS.md)
