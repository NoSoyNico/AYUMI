/**
 * HUD Renderer for AYUMI
 * Renders 600x350 monochrome/grayscale visuals optimized for the MemoMind One HUD.
 * Generates GRAY_4 pixels, compresses with LZ4, and synchronizes to the glasses via display.updateImageLz4.
 * Features dedicated health, accessibility, wheelchair mobility, and prosthesis walking dashboards.
 * Fully internationalized (es, en, zh, fr, ru).
 */

import { i18n } from './i18n.js';

export const HUD_WIDTH = 560;
export const HUD_HEIGHT = 272;
export const HUD_POS_X = 20;
export const HUD_POS_Y = 39;

export class HUDRenderer {
  constructor(bridgeClient) {
    this.bridge = bridgeClient;
    this.canvas = document.createElement('canvas');
    this.canvas.width = HUD_WIDTH;
    this.canvas.height = HUD_HEIGHT;
    this.context = this.canvas.getContext('2d', { alpha: false });
    this.animationFrame = 0;
  }

  getMirrorCanvas() {
    return this.canvas;
  }

  /**
   * Renders a complete state to the canvas and syncs with the glasses.
   */
  async renderState(state, data = {}) {
    const ctx = this.context;
    if (!ctx) return;

    // Clear background (pitch black for transparent HUD effect)
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, HUD_WIDTH, HUD_HEIGHT);

    const mobilityMode = data.mobilityMode || 'wheelchair';

    switch (state) {
      case 'IDLE':
        if (data.healthData && data.healthView) {
          switch (data.healthView) {
            case 'SLEEP':
              this.drawHealthSleep(ctx, data.healthData);
              break;
            case 'CARDIO':
              this.drawHealthCardio(ctx, data.healthData);
              break;
            case 'MOBILITY':
              this.drawHealthMobility(ctx, data.healthData, mobilityMode);
              break;
            case 'OVERVIEW':
            default:
              this.drawHealthOverview(ctx, data.healthData, mobilityMode);
              break;
          }
        } else {
          this.drawIdle(ctx, data);
        }
        break;
      case 'LISTENING':
        this.drawListening(ctx, data);
        break;
      case 'THINKING':
        this.drawThinking(ctx, data);
        break;
      case 'RESPONSE':
        this.drawResponse(ctx, data);
        break;
      default:
        this.drawIdle(ctx, data);
    }

    return this.syncToGlasses();
  }

  drawHeader(ctx, title, statusBadge = '') {
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 17px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif';
    ctx.fillText('AYUMI', 24, 32);

    if (title) {
      ctx.fillStyle = '#AAAAAA';
      ctx.font = '500 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif';
      ctx.fillText(title, 98, 32);
    }

    if (statusBadge) {
      ctx.fillStyle = '#222222';
      this.roundedRect(ctx, HUD_WIDTH - 120, 16, 96, 24, 5);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '600 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(statusBadge, HUD_WIDTH - 72, 32);
      ctx.textAlign = 'left';
    }

    // Top horizontal divider
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(24, 44);
    ctx.lineTo(HUD_WIDTH - 24, 44);
    ctx.stroke();
  }

  /**
   * Health Overview Dashboard (Morning Briefing)
   */
  drawHealthOverview(ctx, health, mobilityMode = 'wheelchair') {
    const isWheelchair = mobilityMode === 'wheelchair';
    const statusText = health.readinessState || i18n.t('health.optimal');
    this.drawHeader(ctx, i18n.t('hud.headerHealth'), statusText);

    // Left Column: Readiness Score Box
    ctx.fillStyle = '#0F0F0F';
    this.roundedRect(ctx, 24, 56, 150, 152, 10);
    ctx.fill();
    ctx.strokeStyle = '#333333';
    ctx.stroke();

    ctx.fillStyle = '#888888';
    ctx.font = '600 11px sans-serif';
    ctx.fillText(i18n.t('health.score'), 38, 78);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 48px sans-serif';
    ctx.fillText(String(health.overallScore || 88), 38, 128);

    ctx.fillStyle = '#AAAAAA';
    ctx.font = '500 12px sans-serif';
    ctx.fillText(`${i18n.t('health.battery')}: ${health.bodyBattery || 85}%`, 38, 156);

    ctx.fillStyle = '#666666';
    ctx.font = '400 10px sans-serif';
    ctx.fillText(`${health.lastUpdated || 'Hoy'}`, 38, 192);

    // Right Column: 3 Metric Cards
    const cards = [
      {
        icon: '🛌',
        label: i18n.t('health.sleep'),
        val: health.sleep?.totalTime || '7h 42m',
        sub: `${i18n.t('health.efficiency')} ${health.sleep?.efficiency || 91}% (Oura)`,
      },
      {
        icon: '❤️',
        label: i18n.t('health.cardio'),
        val: `${health.cardio?.restingHr || 56} bpm`,
        sub: `HRV: ${health.cardio?.hrv || 68} ms (RingConn)`,
      },
      {
        icon: isWheelchair ? '♿' : '🚶‍♂️',
        label: isWheelchair ? i18n.t('health.mobility') : i18n.t('health.activity'),
        val: isWheelchair
          ? `${health.mobility?.pushes || 1720} ${i18n.t('health.pushes')}`
          : `${(health.mobility?.steps || 6450).toLocaleString()} ${i18n.t('health.steps')}`,
        sub: `${health.mobility?.distanceKm || 3.2} km (${isWheelchair ? i18n.t('health.tagWheelchair') : i18n.t('health.tagProsthesis')})`,
      },
    ];

    cards.forEach((card, i) => {
      const y = 56 + i * 50;
      ctx.fillStyle = '#0C0C0C';
      this.roundedRect(ctx, 186, y, HUD_WIDTH - 210, 44, 8);
      ctx.fill();
      ctx.strokeStyle = '#262626';
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '14px sans-serif';
      ctx.fillText(card.icon, 198, y + 27);

      ctx.fillStyle = '#888888';
      ctx.font = '600 10px sans-serif';
      ctx.fillText(card.label, 222, y + 19);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '700 14px sans-serif';
      ctx.fillText(card.val, 222, y + 35);

      ctx.fillStyle = '#777777';
      ctx.font = '400 11px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(card.sub, HUD_WIDTH - 36, y + 27);
      ctx.textAlign = 'left';
    });

    // Footer tip for hands-free operation
    ctx.fillStyle = '#666666';
    ctx.font = '400 11px sans-serif';
    ctx.fillText(i18n.t('hud.footerTip'), 24, 230);
  }

  /**
   * Sleep Breakdown View
   */
  drawHealthSleep(ctx, health) {
    this.drawHeader(ctx, i18n.t('hud.headerSleep'), `${health.sleep?.score || 86} PTS`);

    ctx.fillStyle = '#0E0E0E';
    this.roundedRect(ctx, 24, 56, HUD_WIDTH - 48, 154, 10);
    ctx.fill();
    ctx.strokeStyle = '#333333';
    ctx.stroke();

    // Total Time
    ctx.fillStyle = '#888888';
    ctx.font = '600 12px sans-serif';
    ctx.fillText(i18n.t('hud.timeInBed'), 40, 80);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 32px sans-serif';
    ctx.fillText(health.sleep?.totalTime || '7h 42m', 40, 116);

    ctx.fillStyle = '#AAAAAA';
    ctx.font = '500 13px sans-serif';
    ctx.fillText(`${i18n.t('health.efficiency')}: ${health.sleep?.efficiency || 91}% · ${health.sleep?.source || 'Oura'}`, 210, 114);

    // Sleep stages bar
    const barX = 40;
    const barY = 132;
    const barW = HUD_WIDTH - 128;
    const barH = 18;

    // Deep: 24%, REM: 25%, Light: 51%
    const deepW = barW * 0.24;
    const remW = barW * 0.25;
    const lightW = barW - deepW - remW;

    ctx.fillStyle = '#FFFFFF'; // Deep
    this.roundedRect(ctx, barX, barY, deepW, barH, 4);
    ctx.fill();

    ctx.fillStyle = '#AAAAAA'; // REM
    this.roundedRect(ctx, barX + deepW + 2, barY, remW, barH, 4);
    ctx.fill();

    ctx.fillStyle = '#444444'; // Light
    this.roundedRect(ctx, barX + deepW + remW + 4, barY, lightW - 4, barH, 4);
    ctx.fill();

    // Stage labels
    ctx.font = '500 11px sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(`${i18n.t('hud.deepSleep')}: ${health.sleep?.deepTime || '1h 48m'}`, 40, 172);

    ctx.fillStyle = '#AAAAAA';
    ctx.fillText(`${i18n.t('hud.remSleep')}: ${health.sleep?.remTime || '1h 55m'}`, 200, 172);

    ctx.fillStyle = '#888888';
    ctx.fillText(`${i18n.t('hud.lightSleep')}: 3h 59m`, 350, 172);

    ctx.fillStyle = '#666666';
    ctx.font = '400 11px sans-serif';
    ctx.fillText(i18n.t('hud.footerTipSleep'), 24, 230);
  }

  /**
   * Cardio & Vital Signs View
   */
  drawHealthCardio(ctx, health) {
    this.drawHeader(ctx, i18n.t('hud.headerCardio'), i18n.t('health.optimal'));

    // 4 Vitals Grid
    const vitals = [
      { label: i18n.t('health.restingHr'), val: `${health.cardio?.restingHr || 56} bpm`, note: i18n.t('hud.normHr') },
      { label: i18n.t('health.hrv'), val: `${health.cardio?.hrv || 68} ms`, note: i18n.t('hud.highHrv') },
      { label: i18n.t('health.spo2'), val: `${health.cardio?.spo2 || 98}%`, note: i18n.t('hud.normalSpo2') },
      { label: i18n.t('health.stress'), val: i18n.t('health.stressLow'), note: i18n.t('hud.stressCalm') },
    ];

    vitals.forEach((item, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = 24 + col * (HUD_WIDTH / 2 - 20);
      const y = 56 + row * 74;
      const w = HUD_WIDTH / 2 - 30;
      const h = 66;

      ctx.fillStyle = '#0F0F0F';
      this.roundedRect(ctx, x, y, w, h, 8);
      ctx.fill();
      ctx.strokeStyle = '#2B2B2B';
      ctx.stroke();

      ctx.fillStyle = '#888888';
      ctx.font = '600 10px sans-serif';
      ctx.fillText(item.label, x + 14, y + 18);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '700 20px sans-serif';
      ctx.fillText(item.val, x + 14, y + 42);

      ctx.fillStyle = '#666666';
      ctx.font = '400 10px sans-serif';
      ctx.fillText(item.note, x + 14, y + 58);
    });

    ctx.fillStyle = '#666666';
    ctx.font = '400 11px sans-serif';
    ctx.fillText(i18n.t('hud.footerTipCardio'), 24, 230);
  }

  /**
   * Mobility View (Wheelchair pushes OR Walking steps with prosthesis)
   */
  drawHealthMobility(ctx, health, mobilityMode = 'wheelchair') {
    const isWheelchair = mobilityMode === 'wheelchair';
    this.drawHeader(ctx, isWheelchair ? i18n.t('hud.headerWheelchair') : i18n.t('hud.headerSteps'), 'ACTIVO');

    ctx.fillStyle = '#0E0E0E';
    this.roundedRect(ctx, 24, 56, HUD_WIDTH - 48, 154, 10);
    ctx.fill();
    ctx.strokeStyle = '#333333';
    ctx.stroke();

    ctx.fillStyle = '#888888';
    ctx.font = '600 11px sans-serif';
    ctx.fillText(
      isWheelchair ? i18n.t('health.wheelchairPushesTitle') : i18n.t('health.prosthesisStepsTitle'),
      40,
      78
    );

    const val = isWheelchair ? (health.mobility?.pushes || 1720) : (health.mobility?.steps || 6450);
    const goal = isWheelchair ? 2000 : 8000;
    const unit = isWheelchair ? i18n.t('health.pushes') : i18n.t('health.steps');
    const percent = Math.min(100, Math.round((val / goal) * 100));

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 34px sans-serif';
    ctx.fillText(val.toLocaleString(), 40, 116);

    ctx.fillStyle = '#AAAAAA';
    ctx.font = '600 13px sans-serif';
    ctx.fillText(`${i18n.t('health.dailyGoal')}: ${goal.toLocaleString()} ${unit} (${percent}%)`, 200, 114);

    // Progress Bar
    const barX = 40;
    const barY = 130;
    const barW = HUD_WIDTH - 128;
    const barH = 14;
    const progress = Math.min(1.0, val / goal);

    ctx.fillStyle = '#222222';
    this.roundedRect(ctx, barX, barY, barW, barH, 4);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    this.roundedRect(ctx, barX, barY, barW * progress, barH, 4);
    ctx.fill();

    // Stats row
    ctx.fillStyle = '#CCCCCC';
    ctx.font = '500 12px sans-serif';
    ctx.fillText(`Dist.: ${health.mobility?.distanceKm || 3.2} km`, 40, 172);
    ctx.fillText(`Cal.: ${health.mobility?.activeCalories || 410} kcal`, 200, 172);
    ctx.fillText(`Min.: ${health.mobility?.activeMinutes || 45} min`, 340, 172);

    ctx.fillStyle = '#666666';
    ctx.font = '400 11px sans-serif';
    ctx.fillText(i18n.t('hud.footerTipMobility'), 24, 230);
  }

  drawIdle(ctx, data) {
    this.drawHeader(ctx, i18n.t('hud.headerStandby'), 'IDLE');

    ctx.fillStyle = '#0A0A0A';
    this.roundedRect(ctx, 24, 60, HUD_WIDTH - 48, 148, 12);
    ctx.fill();
    ctx.strokeStyle = '#222222';
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '28px sans-serif';
    ctx.fillText('歩', 46, 120);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 20px sans-serif';
    ctx.fillText(i18n.t('hud.standbyTitle'), 84, 108);

    ctx.fillStyle = '#888888';
    ctx.font = '400 14px sans-serif';
    ctx.fillText(i18n.t('hud.standbySub'), 84, 134);

    ctx.fillStyle = '#555555';
    ctx.font = '400 12px sans-serif';
    ctx.fillText('MemoMind One HUD · AYUMI Multi-language (es/en/zh/fr/ru)', 24, 236);
  }

  drawListening(ctx, data) {
    this.drawHeader(ctx, i18n.t('hud.headerListening'), 'MIC');

    ctx.fillStyle = '#0F0F0F';
    this.roundedRect(ctx, 24, 56, HUD_WIDTH - 48, 154, 12);
    ctx.fill();
    ctx.strokeStyle = '#444444';
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(56, 104, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = '700 20px sans-serif';
    ctx.fillText(i18n.t('hud.listening'), 80, 110);

    // Audio equalizer waveform simulation
    const bars = 16;
    const barWidth = 12;
    const gap = 14;
    const startX = 80;
    const baseY = 175;

    for (let i = 0; i < bars; i++) {
      const height = Math.max(4, 12 + Math.sin((i + this.animationFrame) * 0.8) * 16 + Math.random() * 8);
      ctx.fillStyle = i % 2 === 0 ? '#FFFFFF' : '#AAAAAA';
      this.roundedRect(ctx, startX + i * (barWidth + gap), baseY - height, barWidth, height, 3);
      ctx.fill();
    }
    this.animationFrame++;

    ctx.fillStyle = '#888888';
    ctx.font = '400 12px sans-serif';
    ctx.fillText(i18n.t('state.releaseButton'), 24, 234);
  }

  drawThinking(ctx, data) {
    this.drawHeader(ctx, i18n.t('hud.headerThinking'), 'AI');

    ctx.fillStyle = '#0C0C0C';
    this.roundedRect(ctx, 24, 56, HUD_WIDTH - 48, 154, 12);
    ctx.fill();
    ctx.strokeStyle = '#333333';
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 20px sans-serif';
    ctx.fillText(i18n.t('hud.thinking'), 50, 106);

    if (data.query) {
      ctx.fillStyle = '#AAAAAA';
      ctx.font = '400 15px sans-serif';
      const q = data.query.length > 50 ? data.query.slice(0, 47) + '...' : data.query;
      ctx.fillText(`"${q}"`, 50, 140);
    }

    ctx.fillStyle = '#666666';
    ctx.font = '400 12px sans-serif';
    ctx.fillText('AYUMI Telemetry & Reasoning Engine', 24, 234);
  }

  drawResponse(ctx, data) {
    this.drawHeader(ctx, i18n.t('hud.headerResponse'), 'AYUMI');

    if (data.query) {
      ctx.fillStyle = '#222222';
      this.roundedRect(ctx, 24, 54, HUD_WIDTH - 48, 28, 6);
      ctx.fill();

      ctx.fillStyle = '#BBBBBB';
      ctx.font = '500 13px sans-serif';
      const q = data.query.length > 60 ? data.query.slice(0, 57) + '...' : data.query;
      ctx.fillText(`P: ${q}`, 34, 72);
    }

    ctx.fillStyle = '#0E0E0E';
    this.roundedRect(ctx, 24, 88, HUD_WIDTH - 48, 138, 10);
    ctx.fill();
    ctx.strokeStyle = '#333333';
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '600 17px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", sans-serif';
    const text = data.response || '...';
    this.wrapText(ctx, text, 40, 118, HUD_WIDTH - 80, 25, 4);

    ctx.fillStyle = '#666666';
    ctx.font = '400 11px sans-serif';
    ctx.fillText(i18n.t('hud.footerTip'), 24, 250);
  }

  wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 4) {
    const paragraphs = text.split('\n');
    let currentY = y;
    let linesDrawn = 0;

    for (const paragraph of paragraphs) {
      if (linesDrawn >= maxLines) break;
      const words = paragraph.split(' ');
      let currentLine = '';

      for (let i = 0; i < words.length; i++) {
        const testLine = currentLine + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && i > 0) {
          ctx.fillText(currentLine.trim(), x, currentY);
          currentLine = words[i] + ' ';
          currentY += lineHeight;
          linesDrawn++;
          if (linesDrawn >= maxLines) break;
        } else {
          currentLine = testLine;
        }
      }

      if (linesDrawn < maxLines && currentLine.trim()) {
        ctx.fillText(currentLine.trim(), x, currentY);
        currentY += lineHeight;
        linesDrawn++;
      }
    }
  }

  roundedRect(ctx, x, y, width, height, radius) {
    if (width <= 0 || height <= 0) return;
    const r = Math.max(0, Math.min(radius, width / 2, height / 2));
    if (typeof ctx.roundRect === 'function') {
      ctx.beginPath();
      ctx.roundRect(x, y, width, height, r);
      return;
    }
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  }

  getGray4Pixels() {
    const image = this.context.getImageData(0, 0, HUD_WIDTH, HUD_HEIGHT).data;
    const stride = HUD_WIDTH / 2;
    const pixels = new Uint8Array(stride * HUD_HEIGHT);

    for (let i = 0; i < image.length; i += 8) {
      const first = this.grayscaleNibble(image, i);
      const second = this.grayscaleNibble(image, i + 4);
      pixels[i / 8] = (first << 4) | second;
    }
    return { width: HUD_WIDTH, height: HUD_HEIGHT, stride, pixels };
  }

  grayscaleNibble(image, offset) {
    const luminance = image[offset] * 0.299 + image[offset + 1] * 0.587 + image[offset + 2] * 0.114;
    return Math.max(0, Math.min(15, Math.round(luminance / 17)));
  }

  compressLz4(input) {
    const output = [];
    const dictionary = new Int32Array(65536);
    dictionary.fill(-1);
    let anchor = 0;
    let position = 0;

    const hash = (offset) => {
      const value =
        (input[offset] | (input[offset + 1] << 8) | (input[offset + 2] << 16) | (input[offset + 3] << 24)) >>> 0;
      return (Math.imul(value, 2654435761) >>> 16) & 65535;
    };

    const writeLength = (length) => {
      while (length >= 255) {
        output.push(255);
        length -= 255;
      }
      output.push(length);
    };

    while (position + 12 <= input.length) {
      const slot = hash(position);
      const match = dictionary[slot];
      dictionary[slot] = position;

      if (
        match < 0 ||
        position - match > 65535 ||
        input[match] !== input[position] ||
        input[match + 1] !== input[position + 1] ||
        input[match + 2] !== input[position + 2] ||
        input[match + 3] !== input[position + 3]
      ) {
        position += 1;
        continue;
      }

      let matchLength = 4;
      while (position + matchLength < input.length - 5 && input[match + matchLength] === input[position + matchLength]) {
        matchLength += 1;
      }

      const literalLength = position - anchor;
      const encodedMatchLength = matchLength - 4;
      output.push((Math.min(literalLength, 15) << 4) | Math.min(encodedMatchLength, 15));

      if (literalLength >= 15) writeLength(literalLength - 15);
      output.push(...input.subarray(anchor, position));
      const distance = position - match;
      output.push(distance & 255, distance >>> 8);
      if (encodedMatchLength >= 15) writeLength(encodedMatchLength - 15);

      position += matchLength;
      anchor = position;
    }

    const remaining = input.length - anchor;
    output.push(Math.min(remaining, 15) << 4);
    if (remaining >= 15) writeLength(remaining - 15);
    output.push(...input.subarray(anchor));
    return Uint8Array.from(output);
  }

  toBase64(bytes) {
    let binary = '';
    for (let offset = 0; offset < bytes.length; offset += 16384) {
      binary += String.fromCharCode(...bytes.subarray(offset, offset + 16384));
    }
    return btoa(binary);
  }

  async syncToGlasses() {
    if (!this.bridge) return;
    try {
      const frame = this.getGray4Pixels();
      const compressed = this.compressLz4(frame.pixels);
      const geometry = {
        x: HUD_POS_X,
        y: HUD_POS_Y,
        width: frame.width,
        height: frame.height,
        stride: frame.stride,
      };

      if (this.bridge.display?.updateImageLz4) {
        await this.bridge.display.updateImageLz4({
          ...geometry,
          decodedSize: frame.pixels.length,
          dataBase64: this.toBase64(compressed),
        });
      } else if (this.bridge.call) {
        await this.bridge.call('display.updateImageLz4', {
          ...geometry,
          decodedSize: frame.pixels.length,
          dataBase64: this.toBase64(compressed),
        });
      }
    } catch (error) {
      console.warn('[AYUMI HUD] Sincronización con gafas:', error?.message || error);
    }
  }
}
