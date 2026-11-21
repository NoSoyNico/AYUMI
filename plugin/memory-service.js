/**
 * Memory & Persistence Service for NICO AI
 * Completely independent of the AI provider.
 * Uses `gm.storage` on MemoMind runtime and falls back to `localStorage` in browser/studio.
 */

const STORAGE_KEYS = Object.freeze({
  HISTORY: 'nico_ai_history',
  SETTINGS: 'nico_ai_settings',
});

const DEFAULT_SETTINGS = Object.freeze({
  activeProviderId: 'mock',
  userName: 'Nico',
  hudTimeoutSeconds: 12,
  autoListenOnButton: true,
  geminiApiKey: '',
});

export class MemoryService {
  constructor(gmClient) {
    this.gm = gmClient;
    this.history = [];
    this.settings = { ...DEFAULT_SETTINGS };
    this.maxHistoryItems = 30;
  }

  async init() {
    await this.loadSettings();
    await this.loadHistory();
  }

  async loadSettings() {
    try {
      let stored = null;
      if (this.gm?.storage?.get) {
        stored = await this.gm.storage.get(STORAGE_KEYS.SETTINGS);
      } else if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        if (raw) stored = JSON.parse(raw);
      }
      if (stored && typeof stored === 'object') {
        this.settings = { ...DEFAULT_SETTINGS, ...stored };
      }
    } catch (e) {
      console.warn('[NICO AI Memory] Failed to load settings:', e);
      this.settings = { ...DEFAULT_SETTINGS };
    }
    return this.settings;
  }

  async saveSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    try {
      if (this.gm?.storage?.set) {
        await this.gm.storage.set(STORAGE_KEYS.SETTINGS, this.settings);
      } else if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
      }
    } catch (e) {
      console.warn('[NICO AI Memory] Failed to persist settings:', e);
    }
    return this.settings;
  }

  async loadHistory() {
    try {
      let stored = null;
      if (this.gm?.storage?.get) {
        stored = await this.gm.storage.get(STORAGE_KEYS.HISTORY);
      } else if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
        if (raw) stored = JSON.parse(raw);
      }
      if (Array.isArray(stored)) {
        this.history = stored;
      }
    } catch (e) {
      console.warn('[NICO AI Memory] Failed to load history:', e);
      this.history = [];
    }
    return this.history;
  }

  async recordInteraction(interaction) {
    const item = {
      id: `int_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
      query: interaction.query || '',
      response: interaction.response || '',
      provider: interaction.provider || 'mock',
      durationMs: interaction.durationMs || 0,
    };

    this.history.unshift(item);
    if (this.history.length > this.maxHistoryItems) {
      this.history = this.history.slice(0, this.maxHistoryItems);
    }

    try {
      if (this.gm?.storage?.set) {
        await this.gm.storage.set(STORAGE_KEYS.HISTORY, this.history);
      } else if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(this.history));
      }
    } catch (e) {
      console.warn('[NICO AI Memory] Failed to persist history:', e);
    }
    return item;
  }

  async clearHistory() {
    this.history = [];
    try {
      if (this.gm?.storage?.remove) {
        await this.gm.storage.remove(STORAGE_KEYS.HISTORY);
      } else if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(STORAGE_KEYS.HISTORY);
      }
    } catch (e) {
      console.warn('[NICO AI Memory] Failed to clear history:', e);
    }
  }

  getRecentContext(count = 3) {
    return this.history.slice(0, count).map((item) => ({
      query: item.query,
      response: item.response,
    }));
  }
}
