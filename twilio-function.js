/**
 * Twilio Function - WhatsApp Bot Handler
 *
 * Deploy this function to Twilio Functions:
 * https://console.twilio.com/us1/develop/functions/services
 *
 * Environment Variables needed in Twilio:
 * - GARCEZPALHA_API_URL = https://garcezpalha.com
 */

exports.handler = async function(context, event, callback) {
  const twiml = new Twilio.twiml.MessagingResponse();

  try {
    const from = event.From || '';
    const body = event.Body || '';

    console.log('[Twilio Function] Mensagem recebida de:', from);
    console.log('[Twilio Function] Conteúdo:', body);

    if (!from || !body) {
      return callback(null, twiml);
    }

    // Extrair número do formato "whatsapp:+5521999999999"
    const phoneNumber = from.replace('whatsapp:', '').replace('+', '');

    // Chamar API de qualificação do Garcez Palha
    const apiUrl = context.GARCEZPALHA_API_URL || 'https://garcezpalha.com';
    const qualifyUrl = `${apiUrl}/api/chat/qualify`;

    const payload = {
      sessionId: phoneNumber,
      message: body,
      source: 'whatsapp',
      clientInfo: {
        phone: phoneNumber
      }
    };

    console.log('[Twilio Function] Chamando API:', qualifyUrl);

    const response = await fetch(qualifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const data = await response.json();
      const reply = data.response || data.message || 'Olá! Como posso ajudar você hoje?';

      console.log('[Twilio Function] Resposta gerada:', reply);
      twiml.message(reply);
    } else {
      console.error('[Twilio Function] Erro na API:', response.status);
      twiml.message('Desculpe, estou com dificuldades técnicas no momento. Por favor, tente novamente em instantes.');
    }

  } catch (error) {
    console.error('[Twilio Function] Erro:', error);
    twiml.message('Desculpe, ocorreu um erro. Nossa equipe foi notificada e entraremos em contato em breve.');
  }

  return callback(null, twiml);
};
