/**
 * AI Provider Architecture for AYUMI
 * Supports multi-language Speech-to-Text (STT), Health Biometrics queries, and LLM inference.
 * Languages supported: Español (es), English (en), 中文 (zh), Français (fr), Русский (ru).
 */

import { i18n } from './i18n.js';

export class NativeSpanishSTT {
  constructor(lang = 'es-MX') {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.isSupported = Boolean(SpeechRecognition);
    this.lang = lang;
    this.recognition = null;
    this.transcript = '';
    this.isListening = false;

    if (this.isSupported) {
      try {
        this.recognition = new SpeechRecognition();
        this.recognition.lang = lang;
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;
      } catch (e) {
        this.isSupported = false;
      }
    }
  }

  start(onInterim = null) {
    if (!this.isSupported) return;
    this.transcript = '';
    this.isListening = true;

    // Use current i18n language for recognition
    const l = i18n.getLanguage();
    const langMap = {
      es: 'es-MX',
      en: 'en-US',
      zh: 'zh-CN',
      fr: 'fr-FR',
      ru: 'ru-RU',
    };
    if (this.recognition) {
      this.recognition.lang = langMap[l] || 'es-MX';
    }

    this.recognition.onresult = (event) => {
      let current = '';
      for (let i = 0; i < event.results.length; i++) {
        current += event.results[i][0].transcript;
      }
      this.transcript = current;
      if (onInterim && typeof onInterim === 'function') {
        onInterim(current);
      }
    };

    this.recognition.onerror = (e) => {
      console.warn('[Native STT] Error:', e.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };

    try {
      this.recognition.start();
    } catch (e) {
      console.warn('[Native STT] No se pudo iniciar:', e);
    }
  }

  stop() {
    if (!this.isSupported || !this.isListening) return Promise.resolve(this.transcript);
    return new Promise((resolve) => {
      const finish = () => {
        this.isListening = false;
        resolve(this.transcript.trim());
      };
      this.recognition.onend = finish;
      try {
        this.recognition.stop();
      } catch (e) {
        finish();
      }
      setTimeout(finish, 1200);
    });
  }
}

export class BaseAIProvider {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }

  async transcribe(audioBlob, options = {}) {
    throw new Error('transcribe() not implemented');
  }

  async generateResponse(prompt, history = [], options = {}) {
    throw new Error('generateResponse() not implemented');
  }
}

/**
 * Intelligent Multi-language Offline Assistant (es, en, zh, fr, ru)
 */
export class SmartSpanishAssistant extends BaseAIProvider {
  constructor(healthService = null) {
    super('mock', 'AYUMI Local (Salud & Accesibilidad)');
    this.stt = new NativeSpanishSTT('es-MX');
    this.healthService = healthService;
  }

  setHealthService(service) {
    this.healthService = service;
  }

  async transcribe(audioBlob, options = {}) {
    if (options.detectedText && options.detectedText.trim()) {
      return options.detectedText.trim();
    }
    if (options.manualQuery && options.manualQuery.trim()) {
      return options.manualQuery.trim();
    }
    const fromStt = await this.stt.stop();
    if (fromStt && fromStt.trim()) {
      return fromStt.trim();
    }

    return i18n.t('pill.health');
  }

  async generateResponse(prompt, history = [], options = {}) {
    await new Promise((resolve) => setTimeout(resolve, 350));
    const p = (prompt || '').toLowerCase().trim();
    const lang = i18n.getLanguage();

    // 1. Health & Biometrics Queries
    if (this.healthService) {
      const healthResult = this.healthService.processHealthQuery(p);
      if (healthResult) {
        return healthResult.answerText;
      }
    }

    // 2. Identity / Who are you
    if (
      p.includes('quién eres') || p.includes('tu nombre') || p.includes('que eres') ||
      p.includes('who are you') || p.includes('your name') ||
      p.includes('你是谁') || p.includes('你的名字') ||
      p.includes('qui es-tu') || p.includes('ton nom') ||
      p.includes('кто ты') || p.includes('твоё имя')
    ) {
      if (lang === 'zh') return '我是 AYUMI，专为 Nicolás Carvajal (@El.Bioniico) 打造的 MemoMind 智能眼镜语音健康助理。';
      if (lang === 'en') return 'I am AYUMI, your hands-free visual assistant on MemoMind smart glasses created for Nicolás Carvajal.';
      if (lang === 'fr') return 'Je suis AYUMI, votre assistante mains libres sur lunettes MemoMind créée pour Nicolás Carvajal.';
      if (lang === 'ru') return 'Я AYUMI, ваш ассистент свободных рук на очках MemoMind, созданный для Николаса Карвахаля.';
      return 'Soy AYUMI, tu asistente visual en tus gafas MemoMind creada para Nicolás Carvajal (@El.Bioniico).';
    }

    // 3. Time / Hour
    if (p.includes('hora') || p.includes('time') || p.includes('几点') || p.includes('heure') || p.includes('время')) {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      if (lang === 'zh') return `现在是 ${now}。\n今天一切顺利，Nico。`;
      if (lang === 'en') return `It is ${now}.\nEverything on track for your day, Nico.`;
      if (lang === 'fr') return `Il est ${now}.\nTout est en ordre pour votre journée, Nico.`;
      if (lang === 'ru') return `Сейчас ${now}.\nВсё под контролем, Нико.`;
      return `Son las ${now}.\nTodo en orden para tu día, Nico.`;
    }

    // 4. Greetings
    if (
      p.includes('hola') || p.includes('buenos días') ||
      p.includes('hello') || p.includes('hi') || p.includes('good morning') ||
      p.includes('你好') || p.includes('早上好') ||
      p.includes('bonjour') || p.includes('salut') ||
      p.includes('привет') || p.includes('здравствуй') || p.includes('доброе утро')
    ) {
      if (lang === 'zh') return '你好 Nico！健康评分 88 分。\nAYUMI 已在眼镜中就绪，随时为你服务。';
      if (lang === 'en') return 'Good day, Nico! Health score at 88.\nAYUMI is ready on your glasses whenever you need.';
      if (lang === 'fr') return 'Bonjour Nico ! Score de santé à 88.\nAYUMI est prêt sur vos lunettes à tout moment.';
      if (lang === 'ru') return 'Привет, Нико! Балл здоровья 88.\nAYUMI готов в твоих очках к работе.';
      return '¡Hola Nico! Salud en 88 pts.\nAYUMI lista en tus gafas cuando me ocupes.';
    }

    // 5. Thanks
    if (p.includes('gracias') || p.includes('thank') || p.includes('谢谢') || p.includes('merci') || p.includes('спасибо')) {
      if (lang === 'zh') return '不客气，Nico！\n随时为你提供免手持辅助支持。';
      if (lang === 'en') return 'You are very welcome, Nico!\nAlways here on your glasses to assist hands-free.';
      if (lang === 'fr') return 'Avec grand plaisir, Nico !\nToujours là sur vos lunettes pour vous aider.';
      if (lang === 'ru') return 'Пожалуйста, Нико!\nВсегда в твоих очках для помощи без рук.';
      return '¡Con gusto, Nico!\nAquí sigo en tus gafas para facilitarte la vida.';
    }

    // Default response
    if (lang === 'zh') return `已理解：“${prompt.slice(0, 30)}”\n在 MemoMind HUD 成功处理。`;
    if (lang === 'en') return `Understood: "${prompt.slice(0, 30)}"\nProcessed successfully on MemoMind HUD.`;
    if (lang === 'fr') return `Compris : "${prompt.slice(0, 30)}"\nTraité avec succès sur MemoMind HUD.`;
    if (lang === 'ru') return `Принято: "${prompt.slice(0, 30)}"\nУспешно обработано на MemoMind HUD.`;
    return `Entendido: "${prompt.slice(0, 35)}"\nProcesado con éxito en MemoMind HUD.`;
  }
}

/**
 * Real Google Gemini AI Provider (Multi-language)
 */
export class GeminiAIProvider extends BaseAIProvider {
  constructor(apiKey = '', model = 'gemini-2.0-flash') {
    super('gemini', 'Google Gemini 2.0 (Nube)');
    this.apiKey = apiKey;
    this.model = model;
  }

  setApiKey(key) {
    this.apiKey = (key || '').trim();
  }

  async transcribe(audioBlob, options = {}) {
    if (options.detectedText && options.detectedText.trim()) {
      return options.detectedText.trim();
    }
    if (options.manualQuery && options.manualQuery.trim()) {
      return options.manualQuery.trim();
    }
    if (!this.apiKey) {
      throw new Error('Gemini API Key required');
    }

    const base64Audio = await this.blobToBase64(audioBlob);
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
    const payload = {
      contents: [
        {
          parts: [
            { text: `Transcribe the speech in this audio exactly in the language spoken (${i18n.getLanguage()}). Output only the transcribed text without quotes:` },
            {
              inlineData: {
                mimeType: 'audio/wav',
                data: base64Audio,
              },
            },
          ],
        },
      ],
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Gemini STT (${response.status}): ${err.slice(0, 80)}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || i18n.t('pill.health');
  }

  async generateResponse(prompt, history = [], options = {}) {
    if (!this.apiKey) {
      throw new Error('Configura tu clave de Gemini en los ajustes');
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
    const currentLang = i18n.getLanguage();

    const systemPrompt =
      `You are AYUMI, an intelligent hands-free assistant projected on MemoMind smart glasses for Nicolás Carvajal (@El.Bioniico). ` +
      `Nico is an amputee who uses a wheelchair or prosthesis/crutches and needs ultra-efficient, hands-free telemetry and answers. ` +
      `Your display is a 600x350 monochrome HUD. ` +
      `CRITICAL RULES: ` +
      `1. ALWAYS RESPOND IN THE USER'S CHOSEN LANGUAGE: ${currentLang.toUpperCase()} (es = Spanish, en = English, zh = Chinese, fr = French, ru = Russian). ` +
      `2. Be extremely concise: maximum 2 short lines (less than 80 characters total). ` +
      `3. No markdown bold/italics, no asterisks. Use simple bullet points (•) if listing. ` +
      `4. Tone: empowering, clear, highly accessible.`;

    const contents = [
      {
        role: 'user',
        parts: [{ text: `${systemPrompt}\n\nUser inquiry: ${prompt}` }],
      },
    ];

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Gemini Error (${response.status}): ${err.slice(0, 80)}`);
    }

    const data = await response.json();
    const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return candidate.trim() || 'No response.';
  }

  blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}

export class AIProviderManager {
  constructor(healthService = null) {
    this.providers = new Map();
    this.activeProviderId = 'mock';
    this.nativeSTT = new NativeSpanishSTT('es-MX');

    const offlineAssistant = new SmartSpanishAssistant(healthService);
    this.registerProvider(offlineAssistant);
    this.registerProvider(new GeminiAIProvider());
  }

  registerProvider(provider) {
    this.providers.set(provider.id, provider);
  }

  getProvider(id) {
    return this.providers.get(id);
  }

  getActiveProvider() {
    return this.providers.get(this.activeProviderId) || this.providers.get('mock');
  }

  setActiveProvider(id) {
    if (this.providers.has(id)) {
      this.activeProviderId = id;
      return true;
    }
    return false;
  }
}
