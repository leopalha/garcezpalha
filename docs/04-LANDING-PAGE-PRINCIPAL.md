# 04 - LANDING PAGE PRINCIPAL
## Garcez Palha - Inteligência Jurídica

---

## 1. ESTRUTURA GERAL DO SITE

### 1.1 Arquitetura de Páginas

```
garcezpalha.com/
│
├── / (Homepage - Entrada Principal)
│
├── /financeiro/
│   ├── /desbloqueio-conta
│   ├── /golpe-pix
│   ├── /negativacao-indevida
│   └── /defesa-execucao
│
├── /patrimonial/
│   ├── /usucapiao
│   ├── /holding-familiar
│   ├── /inventario
│   └── /regularizacao-imovel
│
├── /saude/
│   ├── /plano-saude
│   ├── /cirurgia-bariatrica
│   └── /tratamento-tea
│
├── /previdenciario/
│   ├── /bpc-loas
│   └── /aposentadoria
│
├── /especializado/
│   ├── /direito-aeronautico
│   └── /pericias
│
├── /sobre/ (Quem Somos + História)
├── /blog/ (SEO)
└── /contato/
```

---

## 2. HOMEPAGE - WIREFRAME COMPLETO

### 2.1 Estrutura da Homepage

```
┌─────────────────────────────────────────────────────────────────────┐
│                           HEADER                                     │
├─────────────────────────────────────────────────────────────────────┤
│  [Logo]              [Áreas] [Sobre] [Blog]        [WhatsApp CTA]   │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                            HERO                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│     "Resolvemos seu problema jurídico em 72h."                      │
│                                                                      │
│     Tecnologia de ponta + 364 anos de tradição                      │
│                                                                      │
│     [RESOLVER MEU PROBLEMA AGORA]                                   │
│                                                                      │
│     ✓ Resposta em minutos  ✓ Preço fixo  ✓ Resultado garantido     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      QUAL SEU PROBLEMA?                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐               │
│   │ 💰      │  │ 🏠      │  │ ❤️      │  │ ⚖️      │               │
│   │Financeiro│  │Patrimônio│  │ Saúde   │  │Especial │               │
│   │         │  │         │  │         │  │         │               │
│   │ Conta   │  │Usucapião│  │ Plano   │  │Aviação  │               │
│   │bloqueada│  │ Holding │  │ Saúde   │  │Perícias │               │
│   │Golpe PIX│  │Inventário│  │ INSS   │  │         │               │
│   └─────────┘  └─────────┘  └─────────┘  └─────────┘               │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                       COMO FUNCIONA                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   1️⃣ CONTA             2️⃣ ANALISA           3️⃣ RESOLVE            │
│   Você conta seu       Nossa IA analisa      Protocolamos e         │
│   problema no          e monta a             você acompanha         │
│   WhatsApp             estratégia            em tempo real          │
│                                                                      │
│                   [COMEÇAR AGORA]                                   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                       POR QUE NÓS?                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                │
│   │ 🤖         │  │ 📜         │  │ ✅         │                │
│   │ TECNOLOGIA │  │ TRADIÇÃO   │  │ RESULTADO  │                │
│   │            │  │            │  │            │                │
│   │ IA que     │  │ 364 anos   │  │ 72h para   │                │
│   │ trabalha   │  │ de família │  │ primeira   │                │
│   │ 24/7       │  │ jurídica   │  │ ação       │                │
│   └─────────────┘  └─────────────┘  └─────────────┘                │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      CREDENCIAIS                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   [Brasão]                                                          │
│                                                                      │
│   Leonardo Garcez Palha                                             │
│   OAB/RJ 219.390 | CONPEJ/RJ | CRECI/RJ                            │
│                                                                      │
│   "Família Garcez Palha: de governadores coloniais                  │
│    a advogados do futuro. 364 anos de serviço."                     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      DEPOIMENTOS                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   "Minha conta foi desbloqueada    "Recuperei R$ 15 mil do         │
│    em 2 dias. Incrível!"            golpe do PIX. Obrigado!"        │
│    — Maria S., RJ                   — João P., SP                   │
│                                                                      │
│   "Regularizei meu imóvel de       "Liminar do plano em 48h.       │
│    20 anos. Recomendo!"             Salvaram minha cirurgia."       │
│    — Carlos M., RJ                  — Ana L., RJ                    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         FAQ                                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   ▸ Quanto custa?                                                   │
│   ▸ Como funciona o atendimento por IA?                             │
│   ▸ Vocês atendem fora do Rio?                                      │
│   ▸ O que é a garantia de 72h?                                      │
│   ▸ Como faço para acompanhar meu caso?                             │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                       CTA FINAL                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│         Seu problema jurídico não pode esperar.                     │
│                                                                      │
│              [FALAR COM ESPECIALISTA AGORA]                         │
│                                                                      │
│         Resposta em minutos. Solução em dias.                       │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                          FOOTER                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   Garcez Palha Advogados                                            │
│   OAB/RJ 219.390                                                    │
│                                                                      │
│   [Áreas]  [Sobre]  [Blog]  [Contato]  [Política de Privacidade]   │
│                                                                      │
│   © 2024 Garcez Palha Inteligência Jurídica                        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────┐
│ 💬 WhatsApp     │  ← BOTÃO FLUTUANTE (sempre visível)
│ Fale Conosco    │
└─────────────────┘
```

---

## 3. COPY DA HOMEPAGE

### 3.1 Hero Section

```html
<section id="hero">
  <h1>Resolvemos seu problema jurídico em 72h.</h1>
  <p class="subtitle">
    A primeira plataforma de inteligência jurídica do Brasil.
    Tecnologia de ponta + 364 anos de tradição.
  </p>
  
  <button class="cta-primary">RESOLVER MEU PROBLEMA AGORA</button>
  
  <div class="trust-badges">
    <span>✓ Resposta em minutos</span>
    <span>✓ Preço fixo e transparente</span>
    <span>✓ Acompanhamento em tempo real</span>
  </div>
</section>
```

### 3.2 Categorias de Problemas

```html
<section id="problemas">
  <h2>Qual é o seu problema?</h2>
  <p>Clique na área mais próxima da sua situação</p>
  
  <div class="cards">
    <div class="card" onclick="goTo('/financeiro')">
      <span class="emoji">💰</span>
      <h3>Proteção Financeira</h3>
      <ul>
        <li>Conta bloqueada</li>
        <li>Golpe do PIX</li>
        <li>Nome negativado</li>
        <li>Cobrança indevida</li>
      </ul>
      <span class="price">a partir de R$ 1.500</span>
    </div>
    
    <div class="card" onclick="goTo('/patrimonial')">
      <span class="emoji">🏠</span>
      <h3>Proteção Patrimonial</h3>
      <ul>
        <li>Usucapião</li>
        <li>Holding Familiar</li>
        <li>Inventário</li>
        <li>Regularização</li>
      </ul>
      <span class="price">a partir de R$ 3.000</span>
    </div>
    
    <div class="card" onclick="goTo('/saude')">
      <span class="emoji">❤️</span>
      <h3>Proteção de Saúde</h3>
      <ul>
        <li>Plano de saúde negou</li>
        <li>Cirurgia bariátrica</li>
        <li>Tratamento TEA</li>
        <li>BPC / INSS</li>
      </ul>
      <span class="price">a partir de R$ 2.000</span>
    </div>
    
    <div class="card" onclick="goTo('/especializado')">
      <span class="emoji">⚖️</span>
      <h3>Especializado</h3>
      <ul>
        <li>Direito Aeronáutico</li>
        <li>Perícias Judiciais</li>
        <li>Consultoria Empresarial</li>
      </ul>
      <span class="price">consultar</span>
    </div>
  </div>
</section>
```

### 3.3 Como Funciona

```html
<section id="como-funciona">
  <h2>Simples assim</h2>
  
  <div class="steps">
    <div class="step">
      <div class="number">1</div>
      <h3>Conta</h3>
      <p>Você nos conta seu problema pelo WhatsApp. 
         Nossa IA entende e faz as perguntas certas.</p>
    </div>
    
    <div class="step">
      <div class="number">2</div>
      <h3>Analisa</h3>
      <p>Em minutos, analisamos seu caso e montamos 
         a estratégia. Você recebe uma proposta clara.</p>
    </div>
    
    <div class="step">
      <div class="number">3</div>
      <h3>Resolve</h3>
      <p>Protocolamos em até 72h. Você acompanha 
         cada passo em tempo real pelo celular.</p>
    </div>
  </div>
  
  <button class="cta-secondary">COMEÇAR AGORA</button>
</section>
```

### 3.4 Diferenciais

```html
<section id="diferenciais">
  <h2>Por que a Garcez Palha?</h2>
  
  <div class="features">
    <div class="feature">
      <span class="icon">🤖</span>
      <h3>Tecnologia</h3>
      <p>Inteligência artificial que trabalha 24 horas por dia. 
         Respostas em minutos, não em dias.</p>
    </div>
    
    <div class="feature">
      <span class="icon">📜</span>
      <h3>Tradição</h3>
      <p>364 anos de história jurídica. De governadores 
         coloniais a advogados do futuro.</p>
    </div>
    
    <div class="feature">
      <span class="icon">✅</span>
      <h3>Resultado</h3>
      <p>Primeira ação em 72 horas. Transparência total. 
         Você acompanha cada movimento.</p>
    </div>
  </div>
</section>
```

### 3.5 Credenciais

```html
<section id="credenciais">
  <div class="brasao">
    <img src="/brasao-garcez-palha.svg" alt="Brasão Garcez Palha">
  </div>
  
  <div class="info">
    <h2>Leonardo Garcez Palha</h2>
    <p class="registros">
      OAB/RJ 219.390 | CONPEJ/RJ | CRECI/RJ
    </p>
    <p class="bio">
      Advogado, Perito Judicial e Corretor de Imóveis.
      Três credenciais para resolver seu problema de forma completa.
    </p>
    <p class="historia">
      A família Garcez Palha serve o Brasil desde 1661.
      Governadores de Goa e Macau. Viscondes e Barões do Império.
      364 anos depois, continuamos servindo — agora, a você.
    </p>
  </div>
</section>
```

### 3.6 Depoimentos

```html
<section id="depoimentos">
  <h2>O que nossos clientes dizem</h2>
  
  <div class="testimonials">
    <div class="testimonial">
      <p class="quote">
        "Acordei com minha conta bloqueada e não sabia o que fazer. 
        Em 48 horas, meu salário estava liberado. 
        Atendimento incrível, tudo pelo WhatsApp."
      </p>
      <p class="author">— Maria S., Rio de Janeiro</p>
      <p class="case">Desbloqueio de Conta</p>
    </div>
    
    <div class="testimonial">
      <p class="quote">
        "Caí num golpe do PIX e achei que tinha perdido tudo. 
        A Garcez Palha conseguiu recuperar R$ 15 mil. 
        Profissionais de verdade."
      </p>
      <p class="author">— João P., São Paulo</p>
      <p class="case">Golpe do PIX</p>
    </div>
    
    <div class="testimonial">
      <p class="quote">
        "Meu imóvel estava irregular há 20 anos. 
        Conseguiram a usucapião em 4 meses. 
        Finalmente tenho a escritura!"
      </p>
      <p class="author">— Carlos M., Rio de Janeiro</p>
      <p class="case">Usucapião</p>
    </div>
    
    <div class="testimonial">
      <p class="quote">
        "O plano negou minha cirurgia. 
        Em 48 horas conseguiram a liminar. 
        Salvaram minha vida, literalmente."
      </p>
      <p class="author">— Ana L., Rio de Janeiro</p>
      <p class="case">Plano de Saúde</p>
    </div>
  </div>
</section>
```

### 3.7 FAQ

```html
<section id="faq">
  <h2>Perguntas Frequentes</h2>
  
  <div class="accordion">
    <div class="faq-item">
      <h3>Quanto custa?</h3>
      <p>Nossos serviços começam em R$ 1.500 para casos simples. 
         O preço é fixo e você sabe exatamente quanto vai pagar 
         antes de contratar. Sem surpresas.</p>
    </div>
    
    <div class="faq-item">
      <h3>Como funciona o atendimento por IA?</h3>
      <p>Nossa inteligência artificial faz a triagem inicial, 
         coleta informações e prepara seu caso. Mas um advogado 
         de verdade (OAB/RJ 219.390) revisa tudo e assina.</p>
    </div>
    
    <div class="faq-item">
      <h3>Vocês atendem fora do Rio de Janeiro?</h3>
      <p>Sim! Atuamos em todo o Brasil para a maioria dos casos. 
         Como somos 100% digitais, a distância não é problema.</p>
    </div>
    
    <div class="faq-item">
      <h3>O que é a garantia de 72h?</h3>
      <p>Garantimos que a primeira ação do seu caso será 
         protocolada em até 72 horas após você enviar todos 
         os documentos. Se não cumprirmos, devolvemos seu dinheiro.</p>
    </div>
    
    <div class="faq-item">
      <h3>Como acompanho meu caso?</h3>
      <p>Você recebe atualizações automáticas pelo WhatsApp 
         sempre que houver movimentação. Transparência total.</p>
    </div>
    
    <div class="faq-item">
      <h3>E se eu não ficar satisfeito?</h3>
      <p>Temos garantia de satisfação de 72h. Se não estiver 
         satisfeito com nosso atendimento antes do protocolo, 
         devolvemos 100% do valor pago.</p>
    </div>
  </div>
</section>
```

### 3.8 CTA Final

```html
<section id="cta-final">
  <h2>Seu problema jurídico não pode esperar.</h2>
  <p>Enquanto você pensa, sua conta continua bloqueada, 
     seu imóvel irregular, sua saúde em risco.</p>
  
  <button class="cta-primary">FALAR COM ESPECIALISTA AGORA</button>
  
  <p class="urgencia">
    Resposta em minutos. Solução em dias.
  </p>
</section>
```

---

## 4. LANDING PAGES POR PRODUTO

### 4.1 Template Base (Produto Específico)

```
┌─────────────────────────────────────────────────────────────────────┐
│                           HEADER                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      HERO ESPECÍFICO                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│     [HEADLINE DO PROBLEMA]                                          │
│     Ex: "Sua conta foi bloqueada?"                                  │
│                                                                      │
│     [PROMESSA DE SOLUÇÃO]                                           │
│     Ex: "Desbloqueamos em até 72 horas."                            │
│                                                                      │
│     [CTA PRINCIPAL]                                                 │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      VOCÊ ESTÁ ASSIM?                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   Lista de dores específicas do problema                            │
│   Ex: ✗ Salário preso  ✗ Contas atrasando  ✗ Sem saber o que fazer │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      A SOLUÇÃO                                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   Explicação da base legal                                          │
│   Ex: Art. 833 do CPC protege salários e aposentadorias             │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      PACOTES E PREÇOS                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   ┌──────────┐   ┌──────────┐   ┌──────────┐                       │
│   │ ESSENCIAL│   │ COMPLETO │   │ PREMIUM  │                       │
│   │ R$ X.XXX │   │ R$ X.XXX │   │ R$ X.XXX │                       │
│   │  ✓ ...   │   │  ✓ ...   │   │  ✓ ...   │                       │
│   │  ✓ ...   │   │  ✓ ...   │   │  ✓ ...   │                       │
│   │[CONTRATAR]│   │[CONTRATAR]│   │[CONTRATAR]│                       │
│   └──────────┘   └──────────┘   └──────────┘                       │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    DOCUMENTOS NECESSÁRIOS                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   Lista de documentos que o cliente precisa ter                     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      CASOS DE SUCESSO                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   Depoimentos específicos deste tipo de caso                        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      FAQ ESPECÍFICO                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   Perguntas frequentes sobre este tipo de caso                      │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                       CTA FINAL                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.2 Landing Page: Desbloqueio de Conta

```
URL: garcezpalha.com/desbloqueio-conta

HERO:
"Sua conta foi bloqueada?"
"Desbloqueamos seu salário em até 72 horas."
[DESBLOQUEAR MINHA CONTA]

DORES:
✗ Acordou com a conta zerada
✗ Salário ou aposentadoria bloqueados
✗ Contas atrasando e nome sujando
✗ Sem dinheiro para necessidades básicas
✗ Não sabe o que fazer ou a quem recorrer

SOLUÇÃO:
"A lei protege seu salário."
Art. 833 do CPC: Salários, aposentadorias e poupança até 40 SM 
são IMPENHORÁVEIS. Não podem ser bloqueados.

Nós entramos com pedido de urgência e o juiz libera em 24-72h.

PACOTES:
┌────────────────────────────────────────────────────────────┐
│ ESSENCIAL        │ COMPLETO ⭐      │ PREMIUM              │
│ R$ 1.500         │ R$ 2.500         │ R$ 3.500             │
│                  │                  │                      │
│ ✓ Desbloqueio    │ ✓ Desbloqueio    │ ✓ Tudo do Completo   │
│ ✓ Urgência 72h   │ ✓ Urgência 72h   │ ✓ Negociação dívida  │
│                  │ ✓ Defesa completa│ ✓ Acompanhamento 90d │
│                  │ ✓ Acompanhamento │ ✓ Suporte prioritário│
│                  │                  │                      │
│ [CONTRATAR]      │ [MAIS ESCOLHIDO] │ [CONTRATAR]          │
└────────────────────────────────────────────────────────────┘

DOCUMENTOS:
• RG e CPF
• Comprovante de residência
• Extrato mostrando o bloqueio
• Contracheque ou extrato INSS
• Número do processo (se souber)

FAQ:
▸ Funciona para qualquer tipo de dívida?
▸ E se o valor bloqueado for maior que meu salário?
▸ Quanto tempo demora para cair na conta?
▸ Vocês atendem fora do Rio?
```

---

## 5. ELEMENTOS DE CONVERSÃO

### 5.1 Botão WhatsApp Flutuante

```html
<div class="whatsapp-float">
  <a href="https://wa.me/5521XXXXXXXXX?text=Olá! Preciso de ajuda jurídica."
     target="_blank">
    <img src="/whatsapp-icon.svg" alt="WhatsApp">
    <span>Fale Conosco</span>
  </a>
</div>

<style>
.whatsapp-float {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  background: #25D366;
  border-radius: 50px;
  padding: 15px 25px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  animation: pulse 2s infinite;
}
</style>
```

### 5.2 Exit Intent Popup

```html
<div class="exit-popup" id="exitPopup">
  <div class="popup-content">
    <h3>Espera! Não vá embora sem resolver seu problema.</h3>
    <p>Fale agora com nossa IA e descubra em 2 minutos 
       se podemos ajudar você.</p>
    <button onclick="openWhatsApp()">QUERO RESOLVER AGORA</button>
    <a href="#" onclick="closePopup()">Não, obrigado</a>
  </div>
</div>
```

### 5.3 Barra de Urgência (Topo)

```html
<div class="urgency-bar">
  <p>⚡ <strong>Atendimento imediato:</strong> 
     Nossa IA responde em menos de 1 minuto</p>
</div>
```

### 5.4 Timer de Escassez (Opcional)

```html
<div class="scarcity">
  <p>🔥 <strong>3 vagas</strong> para atendimento prioritário hoje</p>
</div>
```

---

## 6. SEO ON-PAGE

### 6.1 Meta Tags (Homepage)

```html
<head>
  <title>Garcez Palha | Advogado Online - Resolva em 72h</title>
  <meta name="description" content="Plataforma jurídica com IA. 
    Desbloqueio de conta, golpe do PIX, usucapião, plano de saúde. 
    Resolução em 72h. OAB/RJ 219.390.">
  <meta name="keywords" content="advogado online, conta bloqueada, 
    golpe pix, usucapião, plano saúde negou">
  
  <!-- Open Graph -->
  <meta property="og:title" content="Garcez Palha | Inteligência Jurídica">
  <meta property="og:description" content="Resolvemos seu problema 
    jurídico em 72h. Tecnologia + 364 anos de tradição.">
  <meta property="og:image" content="/og-image.jpg">
  
  <!-- Schema.org -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "name": "Garcez Palha Advogados",
    "description": "Plataforma de inteligência jurídica",
    "url": "https://garcezpalha.com",
    "telephone": "+5521XXXXXXXXX",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Rio de Janeiro",
      "addressRegion": "RJ",
      "addressCountry": "BR"
    },
    "priceRange": "$$"
  }
  </script>
</head>
```

### 6.2 Meta Tags (Produto Específico)

```html
<!-- Página: /desbloqueio-conta -->
<head>
  <title>Conta Bloqueada? Desbloqueamos em 72h | Garcez Palha</title>
  <meta name="description" content="Teve salário ou aposentadoria 
    bloqueados? Desbloqueamos judicialmente em até 72h. 
    Art. 833 CPC. A partir de R$ 1.500. OAB/RJ 219.390.">
</head>
```

---

## 7. ANALYTICS E TRACKING

### 7.1 Eventos para Rastrear

```javascript
// Google Analytics 4 Events

// Clique no CTA principal
gtag('event', 'cta_click', {
  'event_category': 'engagement',
  'event_label': 'hero_cta'
});

// Clique no WhatsApp
gtag('event', 'whatsapp_click', {
  'event_category': 'conversion',
  'event_label': 'floating_button'
});

// Scroll até FAQ
gtag('event', 'scroll_faq', {
  'event_category': 'engagement',
  'event_label': 'faq_section'
});

// Seleção de categoria
gtag('event', 'category_select', {
  'event_category': 'navigation',
  'event_label': 'financeiro' // ou patrimonial, saude, etc
});

// Exit intent popup
gtag('event', 'exit_intent', {
  'event_category': 'engagement',
  'event_label': 'popup_shown'
});
```

### 7.2 Conversões

```javascript
// Conversão principal: Clique WhatsApp
gtag('event', 'conversion', {
  'send_to': 'AW-XXXXXXXXXX/XXXXXXXXXX'
});

// Conversão secundária: Formulário enviado
gtag('event', 'generate_lead', {
  'event_category': 'conversion',
  'value': 50.00,
  'currency': 'BRL'
});
```

---

## 8. PERFORMANCE

### 8.1 Metas de Velocidade

| Métrica | Meta | Importância |
|---------|------|-------------|
| LCP | < 2.5s | Core Web Vital |
| FID | < 100ms | Core Web Vital |
| CLS | < 0.1 | Core Web Vital |
| Time to Interactive | < 3s | UX |
| First Contentful Paint | < 1.5s | Percepção |

### 8.2 Otimizações

```
IMAGENS
├── Formato: WebP com fallback JPG
├── Lazy loading para below the fold
├── Tamanhos responsivos (srcset)
└── Compressão: 80% qualidade

CÓDIGO
├── CSS: Inline crítico, defer resto
├── JS: Defer/async, code splitting
├── Fonts: Preload, font-display: swap
└── Minificação de tudo

SERVIDOR
├── CDN: Vercel Edge
├── Cache: Assets estáticos 1 ano
├── Compressão: Brotli/Gzip
└── HTTP/2
```

---

## 9. CHECKLIST DE LANÇAMENTO

### 9.1 Antes de Publicar

- [ ] Todas as páginas carregam corretamente
- [ ] Links do WhatsApp funcionando
- [ ] Formulários enviando para lugar certo
- [ ] Meta tags em todas as páginas
- [ ] Schema.org implementado
- [ ] Analytics configurado
- [ ] Conversões do Google Ads configuradas
- [ ] Pixel do Facebook (se usar)
- [ ] SSL ativo (HTTPS)
- [ ] Responsivo em mobile
- [ ] Velocidade ok (PageSpeed > 90)
- [ ] Textos revisados (sem erro)
- [ ] Imagens otimizadas
- [ ] Favicon e og:image
- [ ] 404 personalizado
- [ ] Política de privacidade
- [ ] Termos de uso

### 9.2 Após Publicar

- [ ] Testar fluxo completo (visitante → WhatsApp)
- [ ] Verificar Google Search Console
- [ ] Monitorar erros no Sentry
- [ ] Acompanhar métricas diariamente (1ª semana)
- [ ] Ajustar copy conforme feedback

---

*Documento: 04-LANDING-PAGE-PRINCIPAL.md*
*Versão: 1.0*
*Última atualização: Dezembro/2024*
