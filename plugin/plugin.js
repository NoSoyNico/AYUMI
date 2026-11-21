/**
 * AYUMI 1.0 - Main Plugin Entry Point (Health, Accessibility & Voice)
 * Connects real Spanish voice recognition, physical glasses buttons,
 * dynamic Spanish/Multi-language NLP / Gemini API, Health aggregation, and HUD rendering.
 * Supports: Español (es), English (en), 中文 (zh), Français (fr), Русский (ru).
 * Creado por Nicolás Carvajal (@El.Bioniico / @nosoynico).
 */

import { createGMPlugin } from './vendor/gm-plugin-web-sdk.esm.js';
import { opusRecordingToWav } from './vendor/recording-playback.js';
import {
  createOpeningCaptureTerminalTracker,
  openedCaptureDisposition,
} from './recording-lifecycle.js';
import { HUDRenderer } from './hud-renderer.js';
import { AIProviderManager } from './ai-provider.js';
import { MemoryService } from './memory-service.js';
import { HealthService } from './health-service.js';
import { i18n } from './i18n.js';

// Initialize Client and Core Services
const gm = createGMPlugin();
const hudRenderer = new HUDRenderer(gm);
const memoryService = new MemoryService(gm);
const healthService = new HealthService(memoryService);
const aiManager = new AIProviderManager(healthService);

// State Variables
let currentState = 'IDLE'; // 'IDLE' | 'LISTENING' | 'THINKING' | 'RESPONSE'
let isButtonInputActive = false;
let currentRecordingCapture = null;
let recordingStopPromise = null;
let recordingStartInFlight = false;
let recordingAudioState = 'idle';
let pressGeneration = 0;
let lastInteraction = null;
let responseDismissTimer = null;
let autoCycleTimer = null;
let detectedSpanishTranscript = '';
const openingCaptureTerminals = createOpeningCaptureTerminalTracker();

// DOM Elements
const elements = {
  langSelect: document.getElementById('lang-select'),
  connectionBadge: document.getElementById('connection-badge'),
  connectionLabel: document.getElementById('connection-label'),
  stateBadge: document.getElementById('state-badge'),
  stateTitle: document.getElementById('state-title'),
  stateDesc: document.getElementById('state-desc'),
  talkBtn: document.getElementById('talk-btn'),
  talkIcon: document.getElementById('talk-icon'),
  talkLabel: document.getElementById('talk-label'),
  hudContainer: document.getElementById('hud-container'),
  syncHudBtn: document.getElementById('sync-hud-btn'),
  btnCycleHud: document.getElementById('btn-cycle-hud'),
  historyList: document.getElementById('history-list'),
  clearHistoryBtn: document.getElementById('clear-history-btn'),
  providerSelect: document.getElementById('provider-select'),
  audioPlayback: document.getElementById('audio-playback'),
  btnToggleSettings: document.getElementById('btn-toggle-settings'),
  settingsCard: document.getElementById('settings-card'),
  btnCloseSettings: document.getElementById('btn-close-settings'),
  geminiKeyGroup: document.getElementById('gemini-key-group'),
  geminiKeyInput: document.getElementById('gemini-key-input'),
  btnSaveKey: document.getElementById('btn-save-key'),
  liveTranscriptBox: document.getElementById('live-transcript-box'),
  liveTranscriptText: document.getElementById('live-transcript-text'),
  manualQueryInput: document.getElementById('manual-query-input'),
  btnSendManual: document.getElementById('btn-send-manual'),
  toggleAutoCycle: document.getElementById('toggle-auto-cycle'),
  healthSourceSelect: document.getElementById('health-source-select'),
  ouraTokenGroup: document.getElementById('oura-token-group'),
  ouraTokenInput: document.getElementById('oura-token-input'),
  btnSyncOura: document.getElementById('btn-sync-oura'),
  appleHealthGroup: document.getElementById('apple-health-group'),
  btnImportHealth: document.getElementById('btn-import-health'),
  healthFileInput: document.getElementById('health-file-input'),
  // Mobility Mode Switcher Elements
  btnModeWheelchair: document.getElementById('btn-mode-wheelchair'),
  btnModeSteps: document.getElementById('btn-mode-steps'),
  radioWheelchair: document.getElementById('radio-wheelchair'),
  radioSteps: document.getElementById('radio-steps'),
  mobilityIcon: document.getElementById('mobility-icon'),
  mobilityTag: document.getElementById('mobility-tag'),
  metricMobilityVal: document.getElementById('metric-mobility-val'),
  metricMobilitySub: document.getElementById('metric-mobility-sub'),
  pillMobility: document.getElementById('pill-mobility'),
  pillHealth: document.getElementById('pill-health'),
  pillSleep: document.getElementById('pill-sleep'),
  pillCardio: document.getElementById('pill-cardio'),
  // Health Metric Badges on UI
  metricScore: document.getElementById('metric-score'),
  metricReadinessTag: document.getElementById('metric-readiness-tag'),
  metricBattery: document.getElementById('metric-battery'),
  lblBattery: document.getElementById('lbl-battery'),
  metricSleep: document.getElementById('metric-sleep'),
  metricSleepEff: document.getElementById('metric-sleep-eff'),
  lblEfficiency: document.getElementById('lbl-efficiency'),
  metricHr: document.getElementById('metric-hr'),
  metricHrv: document.getElementById('metric-hrv'),
};

/**
 * State Transition Handler
 */
async function transitionTo(newState, data = {}) {
  currentState = newState;
  console.log(`[AYUMI] Estado -> ${newState}`, data);

  if (responseDismissTimer) {
    clearTimeout(responseDismissTimer);
    responseDismissTimer = null;
  }

  updatePhoneUI(newState, data);

  // Render on HUD with health data context & mobility mode
  try {
    await hudRenderer.renderState(newState, {
      ...data,
      healthData: healthService.data,
      healthView: healthService.currentHudView,
      mobilityMode: healthService.mobilityMode,
      lastQuery: lastInteraction?.query || '',
    });
  } catch (hudErr) {
    console.error('[AYUMI HUD Render Error]', hudErr);
  }

  if (newState === 'RESPONSE') {
    responseDismissTimer = setTimeout(() => {
      transitionTo('IDLE');
    }, 12000);
  }
}

/**
 * Apply Language Change (es, en, zh, fr, ru)
 */
function applyLanguage(lang) {
  i18n.setLanguage(lang);
  document.documentElement.lang = lang;
  if (elements.langSelect) elements.langSelect.value = lang;

  // Update all data-i18n elements in DOM
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (key) {
      el.textContent = i18n.t(key);
    }
  });

  if (elements.manualQueryInput) {
    elements.manualQueryInput.placeholder = i18n.t('state.placeholder');
  }

  updateHealthDOM();
  updatePhoneUI(currentState);
  memoryService.saveSettings({ language: lang });

  if (currentState === 'IDLE') {
    hudRenderer.renderState('IDLE', {
      healthData: healthService.data,
      healthView: healthService.currentHudView,
      mobilityMode: healthService.mobilityMode,
    });
  }
}

/**
 * Update Companion Mobile Screen UI
 */
function updatePhoneUI(state, data = {}) {
  elements.talkBtn.className = 'talk-button';

  switch (state) {
    case 'IDLE':
      elements.stateBadge.textContent = i18n.t('state.idle');
      elements.stateBadge.style.color = 'var(--accent-cyan)';
      elements.stateBadge.style.background = 'rgba(0, 229, 255, 0.1)';
      elements.stateTitle.textContent = i18n.t('hud.standbyTitle');
      elements.stateDesc.textContent = i18n.t('state.idleDesc');
      elements.talkIcon.textContent = '🎙️';
      elements.talkLabel.textContent = i18n.t('state.talkButton');
      elements.liveTranscriptBox.style.display = 'none';
      break;

    case 'LISTENING':
      elements.talkBtn.classList.add('recording');
      elements.stateBadge.textContent = i18n.t('state.listening');
      elements.stateBadge.style.color = 'var(--accent-red)';
      elements.stateBadge.style.background = 'rgba(255, 61, 0, 0.1)';
      elements.stateTitle.textContent = i18n.t('hud.listening');
      elements.stateDesc.textContent = i18n.t('state.listeningDesc');
      elements.talkIcon.textContent = '🔴';
      elements.talkLabel.textContent = i18n.t('state.releaseButton');
      elements.liveTranscriptBox.style.display = 'block';
      elements.liveTranscriptText.textContent = detectedSpanishTranscript || i18n.t('state.waitingVoice');
      break;

    case 'THINKING':
      elements.talkBtn.classList.add('thinking');
      elements.stateBadge.textContent = i18n.t('state.thinking');
      elements.stateBadge.style.color = 'var(--accent-amber)';
      elements.stateBadge.style.background = 'rgba(255, 179, 0, 0.1)';
      elements.stateTitle.textContent = i18n.t('state.thinkingTitle');
      elements.stateDesc.textContent = data.query ? `"${data.query}"` : i18n.t('hud.thinking');
      elements.talkIcon.textContent = '⚡';
      elements.talkLabel.textContent = i18n.t('state.thinking');
      elements.liveTranscriptBox.style.display = 'none';
      break;

    case 'RESPONSE':
      elements.stateBadge.textContent = i18n.t('state.response');
      elements.stateBadge.style.color = 'var(--accent-green)';
      elements.stateBadge.style.background = 'rgba(0, 230, 118, 0.1)';
      elements.stateTitle.textContent = data.query ? `P: ${data.query}` : i18n.t('hud.headerResponse');
      elements.stateDesc.textContent = data.response || '...';
      elements.talkIcon.textContent = '💬';
      elements.talkLabel.textContent = i18n.t('state.newQuery');
      elements.liveTranscriptBox.style.display = 'none';
      break;
  }

  // Update active health card highlight
  document.querySelectorAll('.health-card').forEach((card) => {
    const view = card.dataset.view;
    if (view === healthService.currentHudView) {
      card.classList.add('active');
    } else {
      card.classList.remove('active');
    }
  });
}

/**
 * Set Mobility Mode (Wheelchair vs Walking Steps / Prosthesis)
 */
async function setMobilityMode(mode) {
  healthService.setMobilityMode(mode);
  const isWheelchair = mode === 'wheelchair';

  if (elements.btnModeWheelchair && elements.btnModeSteps) {
    elements.btnModeWheelchair.classList.toggle('active', isWheelchair);
    elements.btnModeSteps.classList.toggle('active', !isWheelchair);
  }

  if (elements.radioWheelchair) elements.radioWheelchair.checked = isWheelchair;
  if (elements.radioSteps) elements.radioSteps.checked = !isWheelchair;

  updateHealthDOM();

  if (currentState === 'IDLE') {
    await hudRenderer.renderState('IDLE', {
      healthData: healthService.data,
      healthView: healthService.currentHudView,
      mobilityMode: mode,
    });
  }
}

/**
 * Update Health Dashboard Numbers in DOM
 */
function updateHealthDOM() {
  const d = healthService.data;
  if (!d) return;

  const isWheelchair = healthService.mobilityMode === 'wheelchair';

  if (elements.metricScore) elements.metricScore.innerHTML = `${d.overallScore}<span class="health-card-unit">/100</span>`;
  if (elements.metricReadinessTag) elements.metricReadinessTag.textContent = d.readinessState || i18n.t('health.optimal');
  if (elements.metricBattery) elements.metricBattery.textContent = `${d.bodyBattery}%`;
  if (elements.metricSleep) elements.metricSleep.textContent = d.sleep?.totalTime || '7h 42m';
  if (elements.metricSleepEff) elements.metricSleepEff.textContent = `${d.sleep?.efficiency || 91}%`;
  if (elements.metricHr) elements.metricHr.innerHTML = `${d.cardio?.restingHr || 56} <span class="health-card-unit">bpm</span>`;
  if (elements.metricHrv) elements.metricHrv.textContent = `${d.cardio?.hrv || 68} ms`;

  // Mobility card dynamic values
  if (elements.mobilityIcon) elements.mobilityIcon.textContent = isWheelchair ? '♿' : '🚶‍♂️';
  if (elements.mobilityTag) elements.mobilityTag.textContent = isWheelchair ? i18n.t('health.tagWheelchair') : i18n.t('health.tagProsthesis');
  if (elements.btnModeWheelchair) elements.btnModeWheelchair.textContent = i18n.t('mode.wheelchair');
  if (elements.btnModeSteps) elements.btnModeSteps.textContent = i18n.t('mode.steps');

  if (elements.metricMobilityVal) {
    elements.metricMobilityVal.textContent = isWheelchair
      ? String(d.mobility?.pushes || 1720)
      : (d.mobility?.steps || 6450).toLocaleString();
  }
  if (elements.metricMobilitySub) {
    elements.metricMobilitySub.textContent = isWheelchair
      ? `${d.mobility?.distanceKm || 3.2} km · ${d.mobility?.activeCalories || 410} kcal`
      : `${d.mobility?.distanceKm || 3.2} km · ${d.mobility?.activeCalories || 410} kcal`;
  }

  // Quick pills text
  if (elements.pillMobility) {
    elements.pillMobility.textContent = isWheelchair ? i18n.t('pill.mobilityWheelchair') : i18n.t('pill.mobilitySteps');
    elements.pillMobility.dataset.query = isWheelchair ? i18n.t('pill.mobilityWheelchair') : i18n.t('pill.mobilitySteps');
  }
  if (elements.pillHealth) {
    elements.pillHealth.textContent = i18n.t('pill.health');
    elements.pillHealth.dataset.query = i18n.t('pill.health');
  }
  if (elements.pillSleep) {
    elements.pillSleep.textContent = i18n.t('pill.sleep');
    elements.pillSleep.dataset.query = i18n.t('pill.sleep');
  }
  if (elements.pillCardio) {
    elements.pillCardio.textContent = i18n.t('pill.cardio');
    elements.pillCardio.dataset.query = i18n.t('pill.cardio');
  }
}

/**
 * Start Voice Recording and Recognition
 */
async function startVoiceCapture() {
  if (currentState === 'LISTENING' || currentState === 'THINKING') return;

  isButtonInputActive = true;
  detectedSpanishTranscript = '';
  const currentGen = ++pressGeneration;
  await transitionTo('LISTENING');

  // Start real-time speech recognizer
  aiManager.nativeSTT.start((text) => {
    detectedSpanishTranscript = text;
    if (elements.liveTranscriptText) {
      elements.liveTranscriptText.textContent = text;
    }
  });

  try {
    recordingAudioState = 'starting';
    recordingStartInFlight = true;

    // Use glasses microphone via Host Web SDK
    const capture = await gm.audio.openRecording({
      pickupMode: 'frontFocus',
      noiseReduction: true,
      maxDurationMs: 8000,
    });
    recordingStartInFlight = false;

    const terminal = openingCaptureTerminals.take(capture.sessionId);
    const disposition = openedCaptureDisposition({
      terminal,
      inputActive: isButtonInputActive,
      generationMatches: currentGen === pressGeneration,
    });

    if (disposition === 'discard') {
      recordingAudioState = 'error';
      discardCapture(capture);
      await transitionTo('IDLE');
      return;
    }

    currentRecordingCapture = capture;
    if (disposition === 'stop') {
      stopVoiceCapture();
    }
  } catch (error) {
    recordingStartInFlight = false;
    recordingAudioState = 'error';
    console.warn('[AYUMI Audio] Dispositivo sin hardware de audio nativo:', error?.message || error);
  }
}

/**
 * Stop Voice Recording and Process
 */
async function stopVoiceCapture() {
  if (!isButtonInputActive && currentState !== 'LISTENING') return;
  isButtonInputActive = false;
  pressGeneration++;

  // Stop recognizer and collect transcript
  try {
    const recognizedText = await aiManager.nativeSTT.stop();
    if (recognizedText && recognizedText.trim()) {
      detectedSpanishTranscript = recognizedText.trim();
    }
  } catch (e) {
    console.warn('[AYUMI STT] Error stopping STT:', e);
  }

  const capture = currentRecordingCapture;
  if (!capture) {
    if (currentState === 'LISTENING') {
      await finishProcessing(null, detectedSpanishTranscript);
    }
    return;
  }

  if (recordingStopPromise) return;

  await transitionTo('THINKING');
  recordingAudioState = 'stopping';

  recordingStopPromise = capture
    .stop()
    .then(async (recording) => {
      currentRecordingCapture = null;
      recordingAudioState = 'stopped';
      await finishProcessing(recording, detectedSpanishTranscript);
    })
    .catch(async (error) => {
      recordingAudioState = 'error';
      currentRecordingCapture = null;
      console.warn('[AYUMI Audio] Error al detener captura:', error);
      await finishProcessing(null, detectedSpanishTranscript);
    })
    .finally(() => {
      recordingStopPromise = null;
    });
}

function discardCapture(capture) {
  if (currentRecordingCapture === capture) currentRecordingCapture = null;
  if (capture?.stop) capture.stop().catch(() => {});
}

/**
 * Process Audio / Query and Deliver Response to HUD
 */
async function finishProcessing(recording, detectedText = '') {
  let wavBlob = null;
  if (recording) {
    try {
      wavBlob = await opusRecordingToWav(recording);
    } catch (e) {
      console.warn('[AYUMI] Fallback en decodificación WAV:', e);
    }
  }

  const provider = aiManager.getActiveProvider();
  let queryText = detectedText;

  if (!queryText || !queryText.trim()) {
    try {
      queryText = await provider.transcribe(wavBlob, { detectedText });
    } catch (e) {
      queryText = i18n.t('pill.health');
    }
  }

  await transitionTo('THINKING', { query: queryText });

  // Generate AI answer
  let responseText = '';
  try {
    responseText = await provider.generateResponse(
      queryText,
      memoryService.getRecentContext()
    );
  } catch (err) {
    responseText = `Error: ${err?.message || 'Connection error'}`;
  }

  // Save to persistent memory
  const interaction = await memoryService.recordInteraction({
    query: queryText,
    response: responseText,
    provider: provider.id,
    durationMs: recording?.durationMs || 2000,
  });
  lastInteraction = interaction;

  // Refresh Health DOM if updated
  updateHealthDOM();
  renderHistoryUI();

  // Deliver response to HUD
  await transitionTo('RESPONSE', {
    query: queryText,
    response: responseText,
  });
}

/**
 * Quick manual query (typed or clicked via pill)
 */
async function handleManualQuery(query) {
  const q = (query || '').trim();
  if (!q) return;

  if (elements.manualQueryInput) elements.manualQueryInput.value = '';
  await transitionTo('THINKING', { query: q });

  const provider = aiManager.getActiveProvider();
  let responseText = '';
  try {
    responseText = await provider.generateResponse(q, memoryService.getRecentContext());
  } catch (err) {
    responseText = `Error: ${err?.message || 'Processing error'}`;
  }

  const interaction = await memoryService.recordInteraction({
    query: q,
    response: responseText,
    provider: provider.id,
    durationMs: 0,
  });
  lastInteraction = interaction;

  updateHealthDOM();
  renderHistoryUI();
  await transitionTo('RESPONSE', { query: q, response: responseText });
}

/**
 * Cycle HUD to next Health View and sync
 */
async function cycleHudView() {
  const nextView = healthService.cycleNextView();
  console.log('[AYUMI HUD] Siguiente vista:', nextView);
  updatePhoneUI(currentState);
  if (currentState === 'IDLE') {
    await hudRenderer.renderState('IDLE', {
      healthData: healthService.data,
      healthView: nextView,
      mobilityMode: healthService.mobilityMode,
    });
  }
}

/**
 * Setup Automatic Hands-Free Cycle for Wheelchair / Walking
 */
function setupAutoCycleTimer() {
  if (autoCycleTimer) {
    clearInterval(autoCycleTimer);
    autoCycleTimer = null;
  }

  if (healthService.autoCycleHud) {
    autoCycleTimer = setInterval(() => {
      if (currentState === 'IDLE') {
        cycleHudView();
      }
    }, healthService.cycleIntervalSeconds * 1000);
  }
}

/**
 * Render Interaction History in DOM
 */
function renderHistoryUI() {
  const history = memoryService.history;
  if (!history || history.length === 0) {
    elements.historyList.innerHTML = `<div class="empty-history">${escapeHtml(i18n.t('history.empty'))}</div>`;
    return;
  }

  elements.historyList.innerHTML = history
    .map(
      (item) => `
    <div class="history-item">
      <div class="history-query">Q: ${escapeHtml(item.query)}</div>
      <div class="history-response">${escapeHtml(item.response)}</div>
      <div class="history-meta">
        <span>${new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        <span>${escapeHtml(item.provider)}</span>
      </div>
    </div>`
    )
    .join('');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Setup Event Listeners
 */
function setupEventListeners() {
  // Language selector
  if (elements.langSelect) {
    elements.langSelect.addEventListener('change', (e) => {
      applyLanguage(e.target.value);
    });
  }

  // Push-to-Talk button events
  elements.talkBtn.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'touch') startVoiceCapture();
  });
  elements.talkBtn.addEventListener('pointerup', (e) => {
    if (e.pointerType !== 'touch') stopVoiceCapture();
  });
  elements.talkBtn.addEventListener('pointerleave', (e) => {
    if (e.pointerType !== 'touch' && isButtonInputActive) stopVoiceCapture();
  });

  elements.talkBtn.addEventListener(
    'touchstart',
    (e) => {
      if (e.touches.length === 1) startVoiceCapture();
    },
    { passive: true }
  );
  elements.talkBtn.addEventListener('touchend', stopVoiceCapture, { passive: true });
  elements.talkBtn.addEventListener('touchcancel', stopVoiceCapture, { passive: true });

  // Spacebar hotkey
  window.addEventListener('keydown', (e) => {
    if (
      e.code === 'Space' &&
      !e.repeat &&
      currentState === 'IDLE' &&
      document.activeElement !== elements.manualQueryInput &&
      document.activeElement !== elements.geminiKeyInput &&
      document.activeElement !== elements.ouraTokenInput
    ) {
      startVoiceCapture();
    }
  });
  window.addEventListener('keyup', (e) => {
    if (e.code === 'Space' && currentState === 'LISTENING') {
      stopVoiceCapture();
    }
  });

  // Manual query submission
  elements.btnSendManual.addEventListener('click', () => {
    handleManualQuery(elements.manualQueryInput.value);
  });
  elements.manualQueryInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleManualQuery(elements.manualQueryInput.value);
  });

  // Quick Question Pills
  document.querySelectorAll('.pill-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const q = btn.dataset.query;
      handleManualQuery(q);
    });
  });

  // Mobility mode selector pill buttons
  if (elements.btnModeWheelchair && elements.btnModeSteps) {
    elements.btnModeWheelchair.addEventListener('click', () => {
      setMobilityMode('wheelchair');
    });
    elements.btnModeSteps.addEventListener('click', () => {
      setMobilityMode('steps');
    });
  }

  // Radio buttons in settings
  if (elements.radioWheelchair && elements.radioSteps) {
    elements.radioWheelchair.addEventListener('change', () => {
      if (elements.radioWheelchair.checked) setMobilityMode('wheelchair');
    });
    elements.radioSteps.addEventListener('change', () => {
      if (elements.radioSteps.checked) setMobilityMode('steps');
    });
  }

  // Health Cards Click (Switch HUD View)
  document.querySelectorAll('.health-card').forEach((card) => {
    card.addEventListener('click', () => {
      const view = card.dataset.view;
      healthService.currentHudView = view;
      updatePhoneUI(currentState);
      if (currentState === 'IDLE') {
        hudRenderer.renderState('IDLE', {
          healthData: healthService.data,
          healthView: view,
          mobilityMode: healthService.mobilityMode,
        });
      }
    });
  });

  // Cycle HUD View Button
  if (elements.btnCycleHud) {
    elements.btnCycleHud.addEventListener('click', () => {
      cycleHudView();
    });
  }

  // Toggle Hands-Free Auto-Cycle
  if (elements.toggleAutoCycle) {
    elements.toggleAutoCycle.addEventListener('change', (e) => {
      healthService.autoCycleHud = e.target.checked;
      healthService.saveSettings();
      setupAutoCycleTimer();
    });
  }

  // Settings drawer
  elements.btnToggleSettings.addEventListener('click', () => {
    const isHidden = elements.settingsCard.style.display === 'none';
    elements.settingsCard.style.display = isHidden ? 'block' : 'none';
  });
  elements.btnCloseSettings.addEventListener('click', () => {
    elements.settingsCard.style.display = 'none';
  });

  // Health Source Selector
  if (elements.healthSourceSelect) {
    elements.healthSourceSelect.addEventListener('change', (e) => {
      const src = e.target.value;
      healthService.source = src;
      elements.ouraTokenGroup.style.display = src === 'oura' ? 'block' : 'none';
      elements.appleHealthGroup.style.display = src === 'apple_health' ? 'block' : 'none';
      healthService.saveSettings();
    });
  }

  // Oura Sync Button
  if (elements.btnSyncOura) {
    elements.btnSyncOura.addEventListener('click', async () => {
      const token = elements.ouraTokenInput.value.trim();
      try {
        elements.btnSyncOura.textContent = '...';
        await healthService.syncOuraRing(token);
        updateHealthDOM();
        elements.btnSyncOura.textContent = i18n.t('settings.ouraSuccess');
        if (currentState === 'IDLE') {
          hudRenderer.renderState('IDLE', {
            healthData: healthService.data,
            healthView: healthService.currentHudView,
            mobilityMode: healthService.mobilityMode,
          });
        }
      } catch (err) {
        alert(`Error: ${err.message}`);
        elements.btnSyncOura.textContent = i18n.t('settings.ouraTokenBtn');
      }
    });
  }

  // Apple Health JSON Import
  if (elements.btnImportHealth) {
    elements.btnImportHealth.addEventListener('click', () => {
      elements.healthFileInput.click();
    });
  }

  if (elements.healthFileInput) {
    elements.healthFileInput.addEventListener('change', async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const json = JSON.parse(text);
        await healthService.importAppleHealthData(json);
        setMobilityMode(healthService.mobilityMode);
        updateHealthDOM();
        alert('Data imported successfully!');
        if (currentState === 'IDLE') {
          hudRenderer.renderState('IDLE', {
            healthData: healthService.data,
            healthView: healthService.currentHudView,
            mobilityMode: healthService.mobilityMode,
          });
        }
      } catch (err) {
        alert('Invalid JSON file.');
      }
    });
  }

  // Provider selector
  elements.providerSelect.addEventListener('change', (e) => {
    const providerId = e.target.value;
    aiManager.setActiveProvider(providerId);
    elements.geminiKeyGroup.style.display = providerId === 'gemini' ? 'block' : 'none';
    memoryService.saveSettings({ activeProviderId: providerId });
  });

  // Save Gemini API Key
  elements.btnSaveKey.addEventListener('click', async () => {
    const key = elements.geminiKeyInput.value.trim();
    const gemini = aiManager.getProvider('gemini');
    if (gemini?.setApiKey) gemini.setApiKey(key);
    await memoryService.saveSettings({ geminiApiKey: key });
    elements.btnSaveKey.textContent = 'OK!';
    setTimeout(() => {
      elements.btnSaveKey.textContent = i18n.t('settings.geminiKeyBtn');
    }, 1500);
  });

  // Sync HUD
  elements.syncHudBtn.addEventListener('click', () => {
    hudRenderer.syncToGlasses();
  });

  // Clear memory
  elements.clearHistoryBtn.addEventListener('click', async () => {
    await memoryService.clearHistory();
    renderHistoryUI();
  });
}

/**
 * Bootstrap Plugin
 */
async function initializePlugin() {
  elements.hudContainer.appendChild(hudRenderer.getMirrorCanvas());
  setupEventListeners();

  try {
    await gm.ready();
    console.log('[AYUMI] gm.ready() completado');

    const settings = (await memoryService.init()) || memoryService.settings || {};
    await healthService.init();

    // Set saved language
    const lang = settings.language || 'es';
    applyLanguage(lang);

    setMobilityMode(healthService.mobilityMode || 'wheelchair');
    updateHealthDOM();
    renderHistoryUI();
    setupAutoCycleTimer();

    // Restore saved settings
    if (settings.activeProviderId) {
      elements.providerSelect.value = settings.activeProviderId;
      aiManager.setActiveProvider(settings.activeProviderId);
      elements.geminiKeyGroup.style.display = settings.activeProviderId === 'gemini' ? 'block' : 'none';
    }
    if (settings.geminiApiKey) {
      elements.geminiKeyInput.value = settings.geminiApiKey;
      const gemini = aiManager.getProvider('gemini');
      if (gemini?.setApiKey) gemini.setApiKey(settings.geminiApiKey);
    }
    if (settings.ouraToken && elements.ouraTokenInput) {
      elements.ouraTokenInput.value = settings.ouraToken;
    }

    // Audio capture listener
    gm.audio.onCaptureState((audioState) => {
      if (
        recordingStartInFlight &&
        !currentRecordingCapture &&
        openingCaptureTerminals.remember(audioState)
      ) {
        return;
      }
      recordingAudioState = audioState.state;
      if (audioState.state === 'stopped') {
        if (currentRecordingCapture && !recordingStopPromise) {
          stopVoiceCapture();
        }
      }
    });

    // Physical button on glasses
    gm.device.onButton((event) => {
      console.log('[AYUMI Glass Button]', event);
      if (event.action === 1) { // SINGLE CLICK: Cycle Health view or wake
        if (currentState === 'IDLE' || currentState === 'RESPONSE') {
          cycleHudView();
        }
      } else if (event.action === 3) { // LONG PRESS (Hold to talk)
        startVoiceCapture();
      } else if (event.action === 5) { // RELEASE (Finish talk)
        stopVoiceCapture();
      }
    });

    // Connection state
    gm.device.onConnection((event) => {
      const connected = Boolean(event.connected);
      elements.connectionBadge.className = `connection-badge ${connected ? '' : 'disconnected'}`;
      elements.connectionLabel.textContent = connected ? i18n.t('status.connected') : i18n.t('status.disconnected');
    });

    await gm.device.subscribeEvents(['button', 'connection']);
    await transitionTo('IDLE');
  } catch (error) {
    console.warn('[AYUMI] Bootstrap error (modo navegador/simulador):', error);
    await memoryService.init();
    await healthService.init();
    applyLanguage('es');
    setMobilityMode(healthService.mobilityMode || 'wheelchair');
    updateHealthDOM();
    renderHistoryUI();
    setupAutoCycleTimer();
    await transitionTo('IDLE');
  }
}

initializePlugin();
