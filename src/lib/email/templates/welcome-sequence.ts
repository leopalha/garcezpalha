/**
 * Welcome Sequence - Novo Lead/Signup
 * 3 emails ao longo de 7 dias
 */

import type { EmailTemplate } from '../sequences/types'

export const welcomeSequenceTemplates: EmailTemplate[] = [
  // EMAIL 1: Boas-vindas Imediato (0h delay)
  {
    id: 'welcome-001',
    name: 'Boas-vindas Garcez Palha',
    subject: '👋 Bem-vindo(a) à Garcez Palha, {{firstName}}!',
    htmlContent: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #1a365d; margin-bottom: 10px;">Garcez Palha</h1>
    <p style="color: #718096; font-size: 14px;">364 anos de tradição jurídica</p>
  </div>

  <div style="background: #f7fafc; border-left: 4px solid #3182ce; padding: 20px; margin-bottom: 30px;">
    <h2 style="color: #2d3748; margin-top: 0;">Olá, {{firstName}}! 👋</h2>
    <p>É um prazer recebê-lo(a) na <strong>Garcez Palha</strong>, escritório com <strong>364 anos de tradição</strong> em advocacia e perícia.</p>
  </div>

  <div style="margin-bottom: 30px;">
    <h3 style="color: #2d3748;">O que você pode esperar de nós:</h3>
    <ul style="color: #4a5568; padding-left: 20px;">
      <li style="margin-bottom: 10px;"><strong>Atendimento humanizado:</strong> Nossa IA qualifica seu caso, mas um advogado real sempre analisa e conduz</li>
      <li style="margin-bottom: 10px;"><strong>Transparência total:</strong> Você acompanha cada etapa do processo em tempo real</li>
      <li style="margin-bottom: 10px;"><strong>Preços justos:</strong> Honorários claros desde o início, sem surpresas</li>
      <li style="margin-bottom: 10px;"><strong>Resultados comprovados:</strong> +R$ 85M recuperados para nossos clientes</li>
    </ul>
  </div>

  <div style="background: #edf2f7; border-radius: 8px; padding: 20px; margin-bottom: 30px; text-align: center;">
    <h3 style="color: #2d3748; margin-top: 0;">Próximos passos:</h3>
    <p style="color: #4a5568; margin-bottom: 20px;">Nossa equipe está analisando seu caso. Em breve, você receberá:</p>
    <ol style="color: #4a5568; text-align: left; display: inline-block; margin: 0;">
      <li>Análise inicial do seu caso (24-48h)</li>
      <li>Proposta personalizada de honorários</li>
      <li>Acesso à área do cliente</li>
    </ol>
  </div>

  <div style="text-align: center; margin-bottom: 30px;">
    <a href="https://garcezpalha.com/chat" style="display: inline-block; background: #3182ce; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600;">
      💬 Falar com Advogado Agora
    </a>
  </div>

  <div style="background: #fff5f5; border: 1px solid #fc8181; border-radius: 8px; padding: 15px; margin-bottom: 30px;">
    <p style="color: #c53030; margin: 0; font-size: 14px;">
      <strong>⏰ Atenção aos prazos:</strong> Casos jurídicos têm prazos legais. Não deixe para depois!
    </p>
  </div>

  <div style="border-top: 2px solid #e2e8f0; padding-top: 20px; margin-top: 40px; text-align: center;">
    <p style="color: #718096; font-size: 14px; margin-bottom: 10px;">
      <strong>Garcez Palha - Consultoria Jurídica & Pericial</strong><br>
      OAB/RJ 219.390 | CONPEJ/RJ | CRECI/RJ<br>
      Rua Buenos Aires, 68, sala 401 - Centro - Rio de Janeiro/RJ
    </p>
    <p style="color: #a0aec0; font-size: 12px; margin-top: 15px;">
      Você está recebendo este email porque se cadastrou em garcezpalha.com.<br>
      <a href="{{unsubscribeLink}}" style="color: #3182ce; text-decoration: underline;">Cancelar emails</a>
    </p>
  </div>

</body>
</html>
    `,
    textContent: `
Olá, {{firstName}}!

É um prazer recebê-lo(a) na Garcez Palha, escritório com 364 anos de tradição em advocacia e perícia.

O QUE VOCÊ PODE ESPERAR DE NÓS:

- Atendimento humanizado: Nossa IA qualifica seu caso, mas um advogado real sempre analisa e conduz
- Transparência total: Você acompanha cada etapa do processo em tempo real
- Preços justos: Honorários claros desde o início, sem surpresas
- Resultados comprovados: +R$ 85M recuperados para nossos clientes

PRÓXIMOS PASSOS:

Nossa equipe está analisando seu caso. Em breve, você receberá:
1. Análise inicial do seu caso (24-48h)
2. Proposta personalizada de honorários
3. Acesso à área do cliente

⏰ ATENÇÃO AOS PRAZOS: Casos jurídicos têm prazos legais. Não deixe para depois!

Falar com advogado agora: https://garcezpalha.com/chat

---
Garcez Palha - Consultoria Jurídica & Pericial
OAB/RJ 219.390 | CONPEJ/RJ | CRECI/RJ
Rua Buenos Aires, 68, sala 401 - Centro - Rio de Janeiro/RJ

Cancelar emails: {{unsubscribeLink}}
    `,
    variables: ['firstName', 'unsubscribeLink'],
    category: 'marketing',
    tags: ['welcome', 'onboarding'],
  },

  // EMAIL 2: Educação + Benefícios (48h delay)
  {
    id: 'welcome-002',
    name: 'Por que escolher Garcez Palha',
    subject: '✨ 364 anos de experiência ao seu lado, {{firstName}}',
    htmlContent: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #1a365d; margin-bottom: 10px;">Garcez Palha</h1>
  </div>

  <div>
    <h2 style="color: #2d3748;">Olá, {{firstName}},</h2>
    <p style="color: #4a5568;">Você sabe por que centenas de clientes confiam seus casos mais importantes a nós?</p>
  </div>

  <div style="margin: 30px 0;">
    <h3 style="color: #2d3748; border-bottom: 2px solid #3182ce; padding-bottom: 10px;">🏛️ Tradição que Garante Resultados</h3>
    <p style="color: #4a5568;">
      Fundado em <strong>1661</strong>, o escritório Garcez Palha carrega <strong>364 anos de história</strong>.
      Não é apenas experiência - é <strong>conhecimento acumulado</strong> em milhares de casos bem-sucedidos.
    </p>
  </div>

  <div style="margin: 30px 0;">
    <h3 style="color: #2d3748; border-bottom: 2px solid #3182ce; padding-bottom: 10px;">🤖 Tecnologia que Acelera seu Caso</h3>
    <p style="color: #4a5568;">
      Nossa IA analisa seu caso em <strong>minutos</strong>, não semanas. Mas aqui está o diferencial:
      um <strong>advogado experiente sempre valida</strong> e conduz sua estratégia jurídica.
    </p>
  </div>

  <div style="background: #f0fff4; border-left: 4px solid #38a169; padding: 20px; margin: 30px 0;">
    <h3 style="color: #22543d; margin-top: 0;">💰 Resultados Comprovados</h3>
    <ul style="color: #2f855a; margin: 0; padding-left: 20px;">
      <li><strong>R$ 85M+</strong> recuperados para clientes (2022-2024)</li>
      <li><strong>12.847 casos</strong> resolvidos com sucesso</li>
      <li><strong>4.9/5 estrelas</strong> de satisfação (NPS 89)</li>
      <li><strong>85% taxa de êxito</strong> em ações judiciais</li>
    </ul>
  </div>

  <div style="margin: 30px 0;">
    <h3 style="color: #2d3748; border-bottom: 2px solid #3182ce; padding-bottom: 10px;">📋 Áreas de Atuação</h3>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 15px;">
      <div style="background: #edf2f7; padding: 12px; border-radius: 6px;">
        <strong style="color: #2d3748;">Bancário</strong><br>
        <span style="color: #718096; font-size: 14px;">Tarifas, seguros, consignado</span>
      </div>
      <div style="background: #edf2f7; padding: 12px; border-radius: 6px;">
        <strong style="color: #2d3748;">Previdenciário</strong><br>
        <span style="color: #718096; font-size: 14px;">INSS, aposentadorias</span>
      </div>
      <div style="background: #edf2f7; padding: 12px; border-radius: 6px;">
        <strong style="color: #2d3748;">Consumidor</strong><br>
        <span style="color: #718096; font-size: 14px;">Planos, telecom, digital</span>
      </div>
      <div style="background: #edf2f7; padding: 12px; border-radius: 6px;">
        <strong style="color: #2d3748;">Perícias</strong><br>
        <span style="color: #718096; font-size: 14px;">Médica, documental, imóveis</span>
      </div>
    </div>
  </div>

  <div style="text-align: center; margin: 40px 0;">
    <p style="color: #4a5568; margin-bottom: 20px;"><strong>Pronto para iniciar seu caso?</strong></p>
    <a href="https://garcezpalha.com/dashboard" style="display: inline-block; background: #3182ce; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600;">
      📊 Acessar Meu Painel
    </a>
  </div>

  <div style="border-top: 2px solid #e2e8f0; padding-top: 20px; margin-top: 40px; text-align: center;">
    <p style="color: #718096; font-size: 14px;">
      <strong>Garcez Palha - Consultoria Jurídica & Pericial</strong><br>
      OAB/RJ 219.390 | CONPEJ/RJ | CRECI/RJ
    </p>
    <p style="color: #a0aec0; font-size: 12px; margin-top: 15px;">
      <a href="{{unsubscribeLink}}" style="color: #3182ce; text-decoration: underline;">Cancelar emails</a>
    </p>
  </div>

</body>
</html>
    `,
    textContent: `
Olá, {{firstName}},

Você sabe por que centenas de clientes confiam seus casos mais importantes a nós?

🏛️ TRADIÇÃO QUE GARANTE RESULTADOS

Fundado em 1661, o escritório Garcez Palha carrega 364 anos de história.
Não é apenas experiência - é conhecimento acumulado em milhares de casos bem-sucedidos.

🤖 TECNOLOGIA QUE ACELERA SEU CASO

Nossa IA analisa seu caso em minutos, não semanas. Mas aqui está o diferencial:
um advogado experiente sempre valida e conduz sua estratégia jurídica.

💰 RESULTADOS COMPROVADOS

- R$ 85M+ recuperados para clientes (2022-2024)
- 12.847 casos resolvidos com sucesso
- 4.9/5 estrelas de satisfação (NPS 89)
- 85% taxa de êxito em ações judiciais

📋 ÁREAS DE ATUAÇÃO

• Bancário: Tarifas, seguros, consignado
• Previdenciário: INSS, aposentadorias
• Consumidor: Planos, telecom, digital
• Perícias: Médica, documental, imóveis

Pronto para iniciar seu caso?
Acessar painel: https://garcezpalha.com/dashboard

---
Garcez Palha - Consultoria Jurídica & Pericial
OAB/RJ 219.390 | CONPEJ/RJ | CRECI/RJ

Cancelar emails: {{unsubscribeLink}}
    `,
    variables: ['firstName', 'unsubscribeLink'],
    category: 'marketing',
    tags: ['welcome', 'education'],
  },

  // EMAIL 3: Social Proof + CTA (7 dias delay)
  {
    id: 'welcome-003',
    name: 'Histórias de Sucesso',
    subject: '🏆 Veja quem já teve seu problema resolvido, {{firstName}}',
    htmlContent: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #1a365d; margin-bottom: 10px;">Garcez Palha</h1>
  </div>

  <div>
    <h2 style="color: #2d3748;">{{firstName}}, você não está sozinho(a)</h2>
    <p style="color: #4a5568;">Milhares de pessoas com problemas similares ao seu já conquistaram justiça conosco.</p>
  </div>

  <div style="margin: 30px 0;">
    <h3 style="color: #2d3748; border-bottom: 2px solid #3182ce; padding-bottom: 10px;">📣 O que nossos clientes dizem:</h3>

    <div style="background: #f7fafc; border-left: 4px solid #38a169; padding: 20px; margin: 20px 0;">
      <p style="color: #2d3748; font-style: italic; margin-bottom: 10px;">
        "Consegui cancelar o seguro prestamista que o banco me empurrou. Recebi R$ 8.400 de volta!
        Todo o processo foi transparente e rápido."
      </p>
      <p style="color: #718096; font-size: 14px; margin: 0;">
        <strong>Maria S.</strong> - Seguro Prestamista | R$ 8.400 recuperados
      </p>
    </div>

    <div style="background: #f7fafc; border-left: 4px solid #38a169; padding: 20px; margin: 20px 0;">
      <p style="color: #2d3748; font-style: italic; margin-bottom: 10px;">
        "Minha aposentadoria estava calculada errado desde 2018. Consegui aumentar R$ 1.200/mês
        + R$ 67 mil de atrasados. Mudou minha vida!"
      </p>
      <p style="color: #718096; font-size: 14px; margin: 0;">
        <strong>João P.</strong> - Revisão Aposentadoria | +R$ 1.200/mês vitalício
      </p>
    </div>

    <div style="background: #f7fafc; border-left: 4px solid #38a169; padding: 20px; margin: 20px 0;">
      <p style="color: #2d3748; font-style: italic; margin-bottom: 10px;">
        "O plano de saúde negava todos os exames do meu filho. Conseguimos liminar em 48h e
        ainda R$ 15 mil de indenização por danos morais."
      </p>
      <p style="color: #718096; font-size: 14px; margin: 0;">
        <strong>Ana C.</strong> - Plano de Saúde | Liminar 48h + R$ 15k indenização
      </p>
    </div>
  </div>

  <div style="background: #fffaf0; border: 2px solid #dd6b20; border-radius: 8px; padding: 20px; margin: 30px 0;">
    <h3 style="color: #c05621; margin-top: 0;">⚠️ Não Deixe Seus Direitos Prescreverem</h3>
    <p style="color: #744210; margin-bottom: 15px;">
      Muitos casos têm <strong>prazo de 5 anos</strong> para entrar com ação.
      Depois disso, você <strong>perde o direito</strong> de cobrar valores devidos.
    </p>
    <p style="color: #744210; margin: 0;">
      <strong>Exemplos de prazos:</strong>
    </p>
    <ul style="color: #744210; margin-top: 10px; padding-left: 20px;">
      <li>Tarifas bancárias: 5 anos desde a cobrança</li>
      <li>Plano de saúde: 1 ano desde a negativa</li>
      <li>INSS: 10 anos (mas quanto antes, melhor)</li>
    </ul>
  </div>

  <div style="text-align: center; margin: 40px 0;">
    <p style="color: #2d3748; font-size: 18px; font-weight: 600; margin-bottom: 20px;">
      Chegou a sua vez de ter seu direito reconhecido.
    </p>
    <a href="https://garcezpalha.com/chat" style="display: inline-block; background: #dd6b20; color: white; padding: 16px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
      🚀 Iniciar Meu Caso Agora
    </a>
    <p style="color: #718096; font-size: 14px; margin-top: 15px;">
      Análise inicial em 24h | Atendimento humanizado | Sem riscos
    </p>
  </div>

  <div style="background: #e6fffa; border-radius: 8px; padding: 20px; margin: 30px 0; text-align: center;">
    <p style="color: #234e52; font-size: 14px; margin: 0;">
      <strong>💡 Dica:</strong> Quanto mais cedo você agir, maior a chance de sucesso e menor o tempo de espera.
    </p>
  </div>

  <div style="border-top: 2px solid #e2e8f0; padding-top: 20px; margin-top: 40px; text-align: center;">
    <p style="color: #718096; font-size: 14px;">
      <strong>Garcez Palha - Consultoria Jurídica & Pericial</strong><br>
      OAB/RJ 219.390 | CONPEJ/RJ | CRECI/RJ<br>
      +12.847 casos resolvidos | R$ 85M+ recuperados
    </p>
    <p style="color: #a0aec0; font-size: 12px; margin-top: 15px;">
      <a href="{{unsubscribeLink}}" style="color: #3182ce; text-decoration: underline;">Cancelar emails</a>
    </p>
  </div>

</body>
</html>
    `,
    textContent: `
{{firstName}}, você não está sozinho(a)

Milhares de pessoas com problemas similares ao seu já conquistaram justiça conosco.

📣 O QUE NOSSOS CLIENTES DIZEM:

"Consegui cancelar o seguro prestamista que o banco me empurrou. Recebi R$ 8.400 de volta!
Todo o processo foi transparente e rápido."
— Maria S. | R$ 8.400 recuperados

"Minha aposentadoria estava calculada errado desde 2018. Consegui aumentar R$ 1.200/mês
+ R$ 67 mil de atrasados. Mudou minha vida!"
— João P. | +R$ 1.200/mês vitalício

"O plano de saúde negava todos os exames do meu filho. Conseguimos liminar em 48h e
ainda R$ 15 mil de indenização por danos morais."
— Ana C. | Liminar 48h + R$ 15k

⚠️ NÃO DEIXE SEUS DIREITOS PRESCREVEREM

Muitos casos têm prazo de 5 anos para entrar com ação.
Depois disso, você perde o direito de cobrar valores devidos.

Exemplos de prazos:
• Tarifas bancárias: 5 anos desde a cobrança
• Plano de saúde: 1 ano desde a negativa
• INSS: 10 anos (mas quanto antes, melhor)

---

Chegou a sua vez de ter seu direito reconhecido.

Iniciar caso agora: https://garcezpalha.com/chat
Análise inicial em 24h | Atendimento humanizado | Sem riscos

💡 Dica: Quanto mais cedo você agir, maior a chance de sucesso e menor o tempo de espera.

---
Garcez Palha - Consultoria Jurídica & Pericial
OAB/RJ 219.390 | CONPEJ/RJ | CRECI/RJ
+12.847 casos resolvidos | R$ 85M+ recuperados

Cancelar emails: {{unsubscribeLink}}
    `,
    variables: ['firstName', 'unsubscribeLink'],
    category: 'marketing',
    tags: ['welcome', 'social-proof', 'urgency'],
  },
]
