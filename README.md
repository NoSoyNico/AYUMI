# AYUMI · Asistente de Salud & Movilidad Manos Libres

> **Creado por Nicolás Carvajal**  
> 🦾 Atleta Biónico · Proyecto de Accesibilidad y Autonomía Personal  
> 📸 Instagram / Facebook: **@El.Bioniico** · 🎵 TikTok: **@nosoynico**

**AYUMI** (del japonés *歩み*: caminar, avanzar paso a paso, progreso) es un asistente visual y de telemetría de salud diseñado para las gafas inteligentes **MemoMind One**, pensado especialmente para personas amputadas, usuarias de silla de ruedas o prótesis que necesitan consultar su salud y comunicarse con las manos completamente libres.

---

## 🌟 Características Principales

* **♿ Selector de Modo de Movilidad:**
  * **Modo Silla de Ruedas:** Monitoreo en vivo de empujes de silla (wheelchair pushes), meta diaria, distancia (km) y calorías activas.
  * **Modo Prótesis / Pasos Normales:** Monitoreo de pasos caminados con prótesis, cadencia y gasto calórico.
* **📊 Agregación de Salud Multidispositivo:**
  * **Oura Ring:** Sueño profundo, REM, eficiencia y puntuación de preparación (Readiness).
  * **RingConn:** Frecuencia cardíaca en reposo, HRV (variabilidad cardíaca) y SpO2 (oxígeno).
  * **Salud de Apple (HealthKit):** Importación directa de telemetría de movilidad y descanso.
  * **Perfil Inteligente Offline:** Funciona inmediatamente sin necesidad de APIs ni conexión obligatoria.
* **👓 HUD Monocromático de Alta Legibilidad (600×350):**
  * 4 pantallas visuales de alto contraste optimizadas para el prisma óptico de las MemoMind One:
    1. *Resumen General (Morning Briefing & Score de Salud)*
    2. *Desglose de Fases de Sueño*
    3. *Signos Cardíacos & HRV*
    4. *Movilidad en Silla de Ruedas o Prótesis*
* **🔄 Modo Manos Libres (Auto-Cycle):**
  * Rota suavemente entre las pantallas de salud cada 8 segundos sin tocar las gafas ni el celular.
  * Control con un solo toque rápido en la patilla para cambiar de vista.
* **🌐 Soporte Multilingüe (5 Idiomas):**
  * 🇪🇸 Español (`es`)
  * 🇺🇸 English (`en`)
  * 🇨🇳 中文 (`zh`) *(idioma nativo de MemoMind / XGIMI)*
  * 🇫🇷 Français (`fr`)
  * 🇷🇺 Русский (`ru`)

---

## 🏗️ Arquitectura Técnica

```text
┌─────────────────────────────────────────────────────────────────┐
│                    GAFAS (MemoMind One)                         │
│                                                                 │
│  [Botón patilla]            [Micrófonos Frontales]      [HUD]   │
└────────┬─────────────────────────────┬────────────────────▲─────┘
         │ Evento Botón (0x0100)       │ Audio Opus 16kHz   │ LZ4 GRAY_4
         ▼                             ▼                    │ (560x272)
┌───────────────────────────────────────────────────────────┴─────┐
│                    TELÉFONO (AYUMI Core)                        │
│                                                                 │
│  1. Event Dispatcher & State Machine (plugin.js)                │
│     [IDLE / SALUD] ➔ [LISTENING] ➔ [THINKING] ➔ [RESPONSE]      │
│                                                                 │
│  2. Health & Mobility Service (health-service.js)               │
│     - Oura Ring Cloud API / Apple Health / Smart Profile        │
│     - Silla de ruedas (Empujes) vs. Prótesis (Pasos)            │
│                                                                 │
│  3. HUD Rendering Engine (hud-renderer.js)                      │
│     - Canvas 2D ➔ 4-bit Grayscale (GRAY_4) ➔ Compresión LZ4     │
│     - display.updateImageLz4 (Vía GM Web Bridge)                │
│                                                                 │
│  4. Internationalization Engine (i18n.js)                       │
│     - Diccionarios nativos para es, en, zh, fr, ru              │
│                                                                 │
│  5. AI & NLP Provider Layer (ai-provider.js)                    │
│     - AYUMI Local NLP (Consultas semánticas sin nube)           │
│     - Google Gemini 2.0 Flash Multimodal (WAV / Audio directo)  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Estructura de Archivos

```text
AYUMI/
├── .gitignore                      # Reglas de exclusión de Git (sin credenciales)
├── README.md                       # Documentación del proyecto
├── build.js                        # Empaquetador oficial .mmpkg
├── dist/
│   └── com.ayumi.app-1.0.0.mmpkg   # Paquete distribuible para Plugin Studio
└── plugin/
    ├── manifest.json               # Permisos Bridge 2.0 y dependencias
    ├── index.html                  # Interfaz companion móvil con créditos
    ├── style.css                   # Diseño dark-mode y accesibilidad
    ├── plugin.js                   # Orquestador principal y eventos
    ├── i18n.js                     # Motor de traducción (es, en, zh, fr, ru)
    ├── health-service.js           # Agregador de biometría y movilidad
    ├── hud-renderer.js             # Motor de renderizado HUD 600x350 monocromo
    ├── ai-provider.js              # Proveedores de IA y reconocedor de voz
    ├── memory-service.js           # Persistencia de configuración
    ├── recording-lifecycle.js      # Control de captura de audio sin condiciones de carrera
    └── vendor/                     # SDK oficial Web Bridge 2.0 y decodificador Opus
```

---

## 🔒 Privacidad y Claves de API

* **Cero claves en el código:** Este repositorio no almacena claves API, tokens de Oura ni credenciales privadas.
* Las claves de Gemini y tokens de Oura se configuran **exclusivamente en tiempo de ejecución** desde el menú de ajustes de la aplicación del usuario y se almacenan de manera local y privada (`gm.storage` / `localStorage`).

---

## 📦 Compilación

Para generar el archivo `.mmpkg`:

```bash
node build.js
```

El paquete generado se ubicará en `dist/com.ayumi.app-1.0.0.mmpkg`.

---

## 🤝 Comunidad y Sugerencias

Si eres una persona amputada, usuaria de silla de ruedas o prótesis, o tienes ideas para integrar nuevos sensores o métricas a AYUMI:

* 📸 Instagram: [@El.Bioniico](https://instagram.com/El.Bioniico)
* 📘 Facebook: [@El.Bioniico](https://facebook.com/El.Bioniico)
* 🎵 TikTok: [@nosoynico](https://tiktok.com/@nosoynico)
