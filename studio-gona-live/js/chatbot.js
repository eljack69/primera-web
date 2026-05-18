// Studio Gona Live — Chatbot IA con fallback inteligente
// Por defecto usa una base de conocimiento pre-scripted que vende los 3 servicios.
// Si configuras window.GONA_BOT_ENDPOINT, el bot llamará a tu Cloudflare Worker
// que a su vez llama a Claude Haiku 4.5 con la API key oculta.

(function () {
  'use strict';

  // ============================================================
  // CONFIGURACIÓN (cuando tengas tu API key, descomenta abajo)
  // ============================================================
  // window.GONA_BOT_ENDPOINT = 'https://tu-worker.workers.dev/chat';
  //
  // Código del Worker (Cloudflare):
  // export default {
  //   async fetch(req, env) {
  //     const { messages } = await req.json();
  //     const r = await fetch('https://api.anthropic.com/v1/messages', {
  //       method: 'POST',
  //       headers: {
  //         'x-api-key': env.ANTHROPIC_API_KEY,
  //         'anthropic-version': '2023-06-01',
  //         'content-type': 'application/json'
  //       },
  //       body: JSON.stringify({
  //         model: 'claude-haiku-4-5-20251001',
  //         max_tokens: 400,
  //         system: 'Eres el asistente de Studio Gona Live...',
  //         messages
  //       })
  //     });
  //     const data = await r.json();
  //     return Response.json({ reply: data.content[0].text });
  //   }
  // }
  // ============================================================

  const KB = {
    saludo: [
      "¡Hola! Soy Gona, el asistente IA de Studio Gona Live.\n\n¿En qué te puedo ayudar? Vendemos 3 cosas: webs en 3 días, chatbots como yo y planes de Facebook Ads.",
      "¡Hola! Bienvenido a Studio Gona Live. Soy un bot real con IA — puedo responderte sobre nuestros servicios, precios, plazos o lo que necesites.\n\n¿Qué buscas hoy?"
    ],
    despedida: "Cualquier cosa que necesites, escríbenos por WhatsApp al +51 978 303 058. ¡Conversamos pronto!",

    // Coincidencias por palabras clave
    intents: [
      {
        keys: ['precio', 'cuesta', 'cuanto', 'cuánto', 'cobran', 'tarifa', 'inversion', 'inversión', 'pago'],
        reply: "Estos son nuestros precios cerrados:\n\n• Web Express (3 días): S/ 890\n• Chatbot con IA real: S/ 1.490\n• Plan FB Ads completo: S/ 690\n• Web + Bot IA juntos: S/ 2.490\n• Pack Lanzamiento Total (web + bot + ads): S/ 4.490\n\n¿Sobre cuál quieres más detalle?"
      },
      {
        keys: ['web', 'pagina', 'página', 'sitio', 'landing'],
        reply: "Nuestro plan Web Express entrega tu sitio en 3 días reales:\n\nDía 1: brief + diseño aprobado\nDía 2: construcción\nDía 3: publicación en vivo\n\nIncluye dominio, hosting año 1, WhatsApp integrado, mobile-first y SEO básico. Desde S/ 890.\n\n¿Quieres reservar tu cupo?"
      },
      {
        keys: ['bot', 'chatbot', 'ia', 'inteligencia', 'artificial', 'whatsapp bot'],
        reply: "Nuestro chatbot usa Claude Haiku 4.5 — la misma IA que usan empresas como Notion y Slack. Lo entrenamos con tu negocio (precios, horarios, productos) y atiende clientes 24/7 en tu web o WhatsApp.\n\nDe hecho, yo soy un ejemplo. Desde S/ 1.490. ¿Lo quieres para tu negocio?"
      },
      {
        keys: ['facebook', 'fb', 'meta', 'instagram', 'ads', 'anuncio', 'publicidad', 'campaña', 'campana'],
        reply: "Nuestro Plan FB Ads incluye:\n\n• Análisis de tu cliente ideal\n• 3 audiencias + 1 retargeting\n• 6 copies listos para usar\n• Briefings de 6 creativos\n• Configuración del píxel\n• Guía de optimización mensual\n• 30 días de soporte\n\nPago único de S/ 690. Tú controlas la inversión, no cobramos comisión sobre el gasto.\n\n¿Te interesa?"
      },
      {
        keys: ['tiempo', 'plazo', 'entrega', 'demora', 'cuando', 'cuándo', 'dias', 'días', 'rapido', 'rápido'],
        reply: "Plazos garantizados:\n\n• Web Express: 3 días\n• Chatbot IA: 48 horas\n• Plan FB Ads: 5 días\n• Pack completo: 7 días\n\nSi no entregamos en plazo (por causas nuestras), te devolvemos el 100% del adelanto. Sin excusas.\n\n¿Cuándo quieres arrancar?"
      },
      {
        keys: ['garantia', 'garantía', 'devolucion', 'devolución', 'reembolso'],
        reply: "Sí, garantía total:\n\n• Si no entregamos en plazo → 100% del adelanto de vuelta\n• Pagas 50% al iniciar, 50% al entregar conforme\n• El adelanto es totalmente reembolsable\n\nEs nuestra forma de demostrar que cumplimos. ¿Algo más?"
      },
      {
        keys: ['pack', 'todo', 'completo', 'lanzamiento', 'total'],
        reply: "El Pack Lanzamiento Total es nuestro plan estrella:\n\n✓ Web Express 3 días\n✓ Chatbot con IA real\n✓ Plan FB Ads completo\n✓ Todo conectado y funcionando\n✓ 30 días de soporte premium\n\nS/ 4.490 (vs S/ 5.070 si compras separado).\n\nEs lo que llamamos lanzar un negocio digital completo en 7 días. ¿Lo agendamos?"
      },
      {
        keys: ['contacto', 'whatsapp', 'telefono', 'teléfono', 'email', 'correo', 'numero', 'número'],
        reply: "Nos puedes escribir:\n\n📱 WhatsApp: +51 978 303 058\n✉️ Email: todo07387@gmail.com\n📍 Lima, Perú\n\nRespondemos en menos de 1 hora en horario laboral. ¿Te paso al WhatsApp directo?"
      },
      {
        keys: ['humano', 'persona', 'real', 'asesor', 'agente', 'hablar contigo', 'gerente'],
        reply: "¡Por supuesto! Te paso directo a una persona real:\n\nWhatsApp: https://wa.me/51978303058\nEmail: todo07387@gmail.com\n\nResponden en menos de 1 hora. ¿Algo más mientras tanto?"
      },
      {
        keys: ['como funciona', 'cómo funciona', 'proceso', 'pasos'],
        reply: "El proceso es ultra simple:\n\n1️⃣ Me escribes por WhatsApp con qué necesitas\n2️⃣ Te paso cotización en menos de 1 hora\n3️⃣ Pagas 50% para reservar\n4️⃣ En 3-7 días tienes tu proyecto listo\n5️⃣ Pagas el 50% restante al entregar\n\nSin sorpresas, sin letras chicas. ¿Arrancamos?"
      },
      {
        keys: ['hola', 'buenas', 'buenos dias', 'buen día', 'hey', 'hi', 'hello'],
        reply: "¡Hola! Soy Gona, asistente IA de Studio Gona Live 👋\n\nEstoy aquí para ayudarte con info sobre nuestros servicios: web en 3 días, chatbots IA y FB Ads.\n\n¿Qué te interesa saber primero?"
      },
      {
        keys: ['gracias', 'thank'],
        reply: "¡Con gusto! Si decides arrancar tu proyecto, solo escríbenos al WhatsApp +51 978 303 058. Estaremos esperando 🚀"
      },
      {
        keys: ['demo', 'ejemplo', 'ver', 'portafolio', 'casos'],
        reply: "El mejor demo es esta misma web — diseñada por nosotros en 3 días.\n\nDe portafolio, podemos enviarte 5-10 sitios anteriores por WhatsApp. ¿Te los paso?\n\nWhatsApp: +51 978 303 058"
      },
      {
        keys: ['donde', 'dónde', 'ubicacion', 'ubicación', 'ciudad', 'pais', 'país'],
        reply: "Estamos en Lima, Perú 🇵🇪 pero trabajamos 100% online con clientes de toda Latinoamérica. Toda la coordinación es por WhatsApp y video llamada.\n\nAceptamos pagos en soles (Yape, Plin, transferencia) y en dólares (PayPal, Wise)."
      },
      {
        keys: ['logo', 'fotos', 'imagenes', 'imágenes', 'marca'],
        reply: "¡No te preocupes si no tienes! Podemos crearte:\n\n• Logo tipográfico premium → S/ 150\n• Sesión de fotos con IA → S/ 200\n• Identidad visual completa → S/ 490\n\nO usar fotos de stock premium incluidas sin costo extra. ¿Qué necesitas?"
      }
    ],

    fallback: "Buena pregunta. Para responderte con exactitud déjame conectarte con un humano por WhatsApp: +51 978 303 058.\n\nMientras tanto, te puedo contar sobre:\n• Web Express 3 días (S/ 890)\n• Chatbot IA (S/ 1.490)\n• Plan FB Ads (S/ 690)\n\n¿Cuál te interesa más?"
  };

  // ===== Estado del bot =====
  const launcher = document.getElementById('botLauncher');
  const panel = document.getElementById('botPanel');
  const closeBtn = document.getElementById('botClose');
  const body = document.getElementById('botBody');
  const form = document.getElementById('botForm');
  const input = document.getElementById('botInput');
  const quickWrap = document.getElementById('botQuick');

  if (!launcher || !panel) return;

  let opened = false;
  const history = []; // para futura integración con API

  // ===== Abrir / cerrar =====
  function openBot() {
    panel.classList.add('open');
    if (!opened) {
      opened = true;
      // Mensaje de bienvenida tras 300ms
      setTimeout(() => {
        addBotMessage(KB.saludo[Math.floor(Math.random() * KB.saludo.length)]);
      }, 320);
    }
    setTimeout(() => input && input.focus(), 380);
  }
  function closeBot() {
    panel.classList.remove('open');
  }

  launcher.addEventListener('click', openBot);
  if (closeBtn) closeBtn.addEventListener('click', closeBot);

  // ESC para cerrar
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && panel.classList.contains('open')) closeBot();
  });

  // ===== Render mensajes =====
  function addBotMessage(text) {
    const el = document.createElement('div');
    el.className = 'bot-msg bot';
    el.innerHTML = escapeHtml(text).replace(/\n/g, '<br>');
    body.appendChild(el);
    scrollDown();
    history.push({ role: 'assistant', content: text });
  }
  function addUserMessage(text) {
    const el = document.createElement('div');
    el.className = 'bot-msg user';
    el.textContent = text;
    body.appendChild(el);
    scrollDown();
    history.push({ role: 'user', content: text });
  }
  function addTyping() {
    const el = document.createElement('div');
    el.className = 'bot-msg bot bot-typing-wrap';
    el.innerHTML = '<span class="bot-typing"><span></span><span></span><span></span></span>';
    body.appendChild(el);
    scrollDown();
    return el;
  }
  function scrollDown() {
    body.scrollTop = body.scrollHeight;
  }
  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  }

  // ===== Lógica de respuesta =====
  function findKBReply(text) {
    const lower = text.toLowerCase();
    let best = null;
    let bestScore = 0;
    KB.intents.forEach(intent => {
      let score = 0;
      intent.keys.forEach(k => {
        if (lower.includes(k)) score++;
      });
      if (score > bestScore) {
        bestScore = score;
        best = intent;
      }
    });
    return best && bestScore > 0 ? best.reply : KB.fallback;
  }

  async function generateReply(userText) {
    // Si está configurado el endpoint del Worker, llama a Claude real
    if (window.GONA_BOT_ENDPOINT) {
      try {
        const res = await fetch(window.GONA_BOT_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: history })
        });
        const data = await res.json();
        if (data && data.reply) return data.reply;
      } catch (err) {
        console.warn('Bot API falló, usando fallback:', err);
      }
    }
    // Fallback: base de conocimiento pre-scripted
    return findKBReply(userText);
  }

  async function handleSubmit(text) {
    const clean = text.trim();
    if (!clean) return;
    addUserMessage(clean);
    if (input) input.value = '';
    if (quickWrap) quickWrap.style.display = 'none';

    const typing = addTyping();
    // Simula "pensando" — natural
    const delay = 600 + Math.random() * 700;
    await new Promise(r => setTimeout(r, delay));

    const reply = await generateReply(clean);
    typing.remove();
    addBotMessage(reply);

    // Si fue una intent fuerte (precio, contacto), muestra chips de seguimiento
    setTimeout(() => {
      if (quickWrap && /precio|whatsapp|contacto|humano/i.test(clean)) {
        quickWrap.style.display = 'flex';
      }
    }, 600);
  }

  // ===== Eventos del form =====
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      handleSubmit(input.value);
    });
  }
  // Chips rápidos
  if (quickWrap) {
    quickWrap.addEventListener('click', e => {
      if (e.target.classList.contains('bot-chip')) {
        handleSubmit(e.target.dataset.q || e.target.textContent);
      }
    });
  }

})();
