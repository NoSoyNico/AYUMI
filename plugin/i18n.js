/**
 * Internationalization (i18n) Engine for AYUMI
 * Supports 5 languages:
 * - Español (es) [Default]
 * - English (en)
 * - 中文 (zh) [MemoMind / XGIMI Native]
 * - Français (fr)
 * - Русский (ru)
 */

export const SUPPORTED_LANGUAGES = Object.freeze([
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
]);

const TRANSLATIONS = Object.freeze({
  es: {
    // Header
    'app.subtitle': 'Asistente Manos Libres · HUD 600×350',
    'status.connected': 'Conectado',
    'status.disconnected': 'Desconectado',

    // Section 1: Health
    'health.sectionTitle': '📊 PANEL DE SALUD (VISTA EN GAFAS)',
    'mode.wheelchair': '♿ Silla',
    'mode.steps': '🚶‍♂️ Prótesis',
    'health.score': 'SCORE SALUD',
    'health.optimal': 'ÓPTIMO',
    'health.good': 'BUENO',
    'health.attention': 'ATENCIÓN',
    'health.battery': 'Batería',
    'health.sleep': 'SUEÑO',
    'health.efficiency': 'Efic.',
    'health.cardio': 'CARDIO',
    'health.restingHr': 'FC REPOSO',
    'health.hrv': 'HRV (VARIABILIDAD)',
    'health.spo2': 'OXÍGENO SpO2',
    'health.stress': 'ESTRÉS',
    'health.stressLow': 'Bajo (22%)',
    'health.mobility': 'MOVILIDAD',
    'health.activity': 'ACTIVIDAD',
    'health.tagWheelchair': 'SILLA',
    'health.tagProsthesis': 'PRÓTESIS',
    'health.pushes': 'empujes',
    'health.steps': 'pasos',
    'health.wheelchairPushesTitle': 'EMPUJES DE SILLA DE RUEDAS',
    'health.prosthesisStepsTitle': 'PASOS CAMINADOS CON PRÓTESIS',
    'health.dailyGoal': 'Meta',

    // Quick pills
    'pill.health': '🏥 ¿Cómo andamos de salud?',
    'pill.sleep': '🛌 ¿Cómo dormí?',
    'pill.cardio': '❤️ Mi corazón',
    'pill.mobilityWheelchair': '♿ Movilidad en silla',
    'pill.mobilitySteps': '🚶‍♂️ Pasos y prótesis',

    // Assistant Section
    'assistant.title': '🎙️ ASISTENTE AYUMI (CONTROL Y PREGUNTAS)',
    'state.idle': 'EN ESPERA',
    'state.listening': 'GRABANDO (ESCUCHANDO)',
    'state.thinking': 'PROCESANDO (PENSANDO)',
    'state.response': 'RESPUESTA (HUD)',
    'state.idleDesc': 'Pulsa el botón de las gafas o habla aquí para consultar salud, movilidad o recordatorios.',
    'state.listeningDesc': 'Habla con naturalidad hacia el micrófono.',
    'state.thinkingTitle': 'AYUMI razonando...',
    'state.talkButton': 'MANTÉN PARA HABLAR',
    'state.releaseButton': 'SOLTAR AL TERMINAR',
    'state.newQuery': 'NUEVA CONSULTA',
    'state.placeholder': 'Escribe una pregunta sobre tu salud o el día...',
    'state.askBtn': 'Preguntar',
    'state.listeningLive': 'Escuchando:',
    'state.waitingVoice': 'Esperando voz...',

    // Settings
    'settings.title': 'Configuración de Accesibilidad & Dispositivos',
    'settings.mobilityMode': 'Modo de Movilidad Personal:',
    'settings.modeWheelchairLabel': '♿ Silla de ruedas (Empujes)',
    'settings.modeStepsLabel': '🚶‍♂️ Prótesis / Pasos normales',
    'settings.handsFree': '♿ Modo Manos Libres en HUD',
    'settings.handsFreeDesc': 'Rota automáticamente las métricas de salud en las gafas cada 8 seg.',
    'settings.healthSource': 'Fuente de Datos Biométricos:',
    'settings.smartProfile': 'Perfil Inteligente NICO (Offline / Auto)',
    'settings.ouraTokenLabel': 'Personal Access Token de Oura:',
    'settings.ouraTokenBtn': 'Sincronizar Oura Ring',
    'settings.ouraSuccess': '¡Oura Sincronizado!',
    'settings.appleImportLabel': 'Importar muestra de Salud de Apple (JSON):',
    'settings.appleImportBtn': '📂 Cargar JSON de Salud',
    'settings.aiEngine': 'Motor de Asistente IA:',
    'settings.geminiKeyLabel': 'Clave API de Gemini:',
    'settings.geminiKeyBtn': 'Guardar Clave',

    // HUD Mirror & History
    'hud.mirrorTitle': '👓 VISTA EN VIVO HUD (GAFAS 600×350)',
    'hud.cycleBtn': 'Cambiar Vista',
    'hud.syncBtn': 'Forzar Sync',
    'history.title': '📝 HISTORIAL DE CONSULTAS',
    'history.clearBtn': 'Limpiar',
    'history.empty': 'No hay consultas registradas aún.',

    // Creator & Community
    'creator.badge': 'CREADO POR',
    'creator.name': 'Nicolás Carvajal',
    'creator.tagline': 'Atleta Biónico · Tecnología de Accesibilidad & Autonomía',
    'creator.bio': 'Diseñado para personas amputadas, usuarias de silla de ruedas o prótesis, facilitando el acceso a salud y asistencia con las manos completamente libres.',
    'creator.feedback': '💡 ¿Tienes sugerencias, ideas o usas otra prótesis/sensor? ¡Escríbeme en redes para integrarlo a AYUMI!',

    // HUD Display Texts
    'hud.headerHealth': '· SALUD & RECUPERACIÓN',
    'hud.headerSleep': '· DESGLOSE DE SUEÑO',
    'hud.headerCardio': '· SIGNOS CARDÍACOS',
    'hud.headerWheelchair': '· MOVILIDAD EN SILLA',
    'hud.headerSteps': '· PASOS Y PRÓTESIS',
    'hud.headerStandby': '· EN ESPERA',
    'hud.headerListening': '· GRABANDO',
    'hud.headerThinking': '· PROCESANDO',
    'hud.headerResponse': '· RESPUESTA',
    'hud.standbyTitle': 'AYUMI · Listo en tus gafas',
    'hud.standbySub': 'Pregunta: "¿Cómo andamos de salud?" o pulsa la patilla',
    'hud.footerTip': 'Toque patilla: Siguiente métrica | Di: "¿Cómo dormí?"',
    'hud.footerTipCardio': 'Toque patilla: Siguiente métrica | Di: "¿Cuánta actividad llevo?"',
    'hud.footerTipMobility': 'Toque patilla: Siguiente métrica | Di: "¿Cómo andamos de salud?"',
    'hud.footerTipSleep': 'Toque patilla: Siguiente métrica | Di: "¿Cómo está mi corazón?"',
    'hud.deepSleep': 'Profundo',
    'hud.remSleep': 'REM',
    'hud.lightSleep': 'Ligero',
    'hud.timeInBed': 'TIEMPO TOTAL EN CAMA',
    'hud.normHr': 'Óptimo (Rango 50-65)',
    'hud.highHrv': 'Recuperación alta',
    'hud.normalSpo2': 'Oxigenación normal',
    'hud.stressCalm': 'Calma fisiológica',
    'hud.listening': 'Escuchando voz...',
    'hud.thinking': 'Analizando consulta de salud...',
  },

  en: {
    // Header
    'app.subtitle': 'Hands-Free Assistant · 600×350 HUD',
    'status.connected': 'Connected',
    'status.disconnected': 'Disconnected',

    // Section 1: Health
    'health.sectionTitle': '📊 HEALTH DASHBOARD (GLASSES VIEW)',
    'mode.wheelchair': '♿ Wheelchair',
    'mode.steps': '🚶‍♂️ Prosthesis',
    'health.score': 'HEALTH SCORE',
    'health.optimal': 'OPTIMAL',
    'health.good': 'GOOD',
    'health.attention': 'ATTENTION',
    'health.battery': 'Battery',
    'health.sleep': 'SLEEP',
    'health.efficiency': 'Eff.',
    'health.cardio': 'CARDIO',
    'health.restingHr': 'RESTING HR',
    'health.hrv': 'HRV (VARIABILITY)',
    'health.spo2': 'SPO2 OXYGEN',
    'health.stress': 'STRESS',
    'health.stressLow': 'Low (22%)',
    'health.mobility': 'MOBILITY',
    'health.activity': 'ACTIVITY',
    'health.tagWheelchair': 'CHAIR',
    'health.tagProsthesis': 'PROSTHESIS',
    'health.pushes': 'pushes',
    'health.steps': 'steps',
    'health.wheelchairPushesTitle': 'WHEELCHAIR PUSHES',
    'health.prosthesisStepsTitle': 'PROSTHESIS WALKING STEPS',
    'health.dailyGoal': 'Goal',

    // Quick pills
    'pill.health': '🏥 How is my health today?',
    'pill.sleep': '🛌 How did I sleep?',
    'pill.cardio': '❤️ My heart rate',
    'pill.mobilityWheelchair': '♿ Wheelchair mobility',
    'pill.mobilitySteps': '🚶‍♂️ Steps & prosthesis',

    // Assistant Section
    'assistant.title': '🎙️ AYUMI ASSISTANT (VOICE & COMMANDS)',
    'state.idle': 'STANDBY',
    'state.listening': 'LISTENING (RECORDING)',
    'state.thinking': 'PROCESSING (THINKING)',
    'state.response': 'RESPONSE (HUD)',
    'state.idleDesc': 'Press the glasses temple button or speak here to query health, mobility or reminders.',
    'state.listeningDesc': 'Speak naturally towards the microphone.',
    'state.thinkingTitle': 'AYUMI reasoning...',
    'state.talkButton': 'HOLD TO TALK',
    'state.releaseButton': 'RELEASE TO SEND',
    'state.newQuery': 'NEW QUERY',
    'state.placeholder': 'Ask a question about your health or day...',
    'state.askBtn': 'Ask',
    'state.listeningLive': 'Listening:',
    'state.waitingVoice': 'Waiting for speech...',

    // Settings
    'settings.title': 'Accessibility & Device Settings',
    'settings.mobilityMode': 'Personal Mobility Mode:',
    'settings.modeWheelchairLabel': '♿ Wheelchair (Pushes)',
    'settings.modeStepsLabel': '🚶‍♂️ Prosthesis / Normal steps',
    'settings.handsFree': '♿ Hands-Free HUD Mode',
    'settings.handsFreeDesc': 'Automatically cycles health metrics on glasses every 8 seconds.',
    'settings.healthSource': 'Biometric Data Source:',
    'settings.smartProfile': 'NICO Smart Profile (Offline / Auto)',
    'settings.ouraTokenLabel': 'Oura Personal Access Token:',
    'settings.ouraTokenBtn': 'Sync Oura Ring',
    'settings.ouraSuccess': 'Oura Synced!',
    'settings.appleImportLabel': 'Import Apple Health export (JSON):',
    'settings.appleImportBtn': '📂 Load Health JSON',
    'settings.aiEngine': 'AI Assistant Engine:',
    'settings.geminiKeyLabel': 'Gemini API Key:',
    'settings.geminiKeyBtn': 'Save Key',

    // HUD Mirror & History
    'hud.mirrorTitle': '👓 LIVE HUD MIRROR (600×350 GLASSES)',
    'hud.cycleBtn': 'Cycle View',
    'hud.syncBtn': 'Force Sync',
    'history.title': '📝 QUERY HISTORY',
    'history.clearBtn': 'Clear',
    'history.empty': 'No interactions recorded yet.',

    // Creator & Community
    'creator.badge': 'CREATED BY',
    'creator.name': 'Nicolás Carvajal',
    'creator.tagline': 'Bionic Athlete · Accessibility & Autonomy Technology',
    'creator.bio': 'Engineered for amputees, wheelchair users, and prosthesis wearers, providing completely hands-free health monitoring and AI assistance.',
    'creator.feedback': '💡 Got feedback, ideas or use another sensor/prosthesis? Reach out on social media to integrate it into AYUMI!',

    // HUD Display Texts
    'hud.headerHealth': '· HEALTH & RECOVERY',
    'hud.headerSleep': '· SLEEP BREAKDOWN',
    'hud.headerCardio': '· VITAL SIGNS',
    'hud.headerWheelchair': '· WHEELCHAIR MOBILITY',
    'hud.headerSteps': '· PROSTHESIS STEPS',
    'hud.headerStandby': '· STANDBY',
    'hud.headerListening': '· RECORDING',
    'hud.headerThinking': '· PROCESSING',
    'hud.headerResponse': '· RESPONSE',
    'hud.standbyTitle': 'AYUMI · Ready in your glasses',
    'hud.standbySub': 'Ask: "How is my health?" or tap temple button',
    'hud.footerTip': 'Tap temple: Next metric | Ask: "How did I sleep?"',
    'hud.footerTipCardio': 'Tap temple: Next metric | Ask: "How much activity?"',
    'hud.footerTipMobility': 'Tap temple: Next metric | Ask: "How is my health?"',
    'hud.footerTipSleep': 'Tap temple: Next metric | Ask: "How is my heart?"',
    'hud.deepSleep': 'Deep',
    'hud.remSleep': 'REM',
    'hud.lightSleep': 'Light',
    'hud.timeInBed': 'TOTAL TIME IN BED',
    'hud.normHr': 'Optimal (50-65 bpm)',
    'hud.highHrv': 'High recovery',
    'hud.normalSpo2': 'Normal oxygenation',
    'hud.stressCalm': 'Physiological calm',
    'hud.listening': 'Listening to voice...',
    'hud.thinking': 'Analyzing health telemetry...',
  },

  zh: {
    // Header
    'app.subtitle': '解放双手的智能助理 · 600×350 HUD',
    'status.connected': '已连接',
    'status.disconnected': '已断开',

    // Section 1: Health
    'health.sectionTitle': '📊 健康仪表盘（眼镜HUD视角）',
    'mode.wheelchair': '♿ 轮椅',
    'mode.steps': '🚶‍♂️ 假肢/步行',
    'health.score': '健康评分',
    'health.optimal': '极佳',
    'health.good': '良好',
    'health.attention': '注意',
    'health.battery': '体能电量',
    'health.sleep': '睡眠',
    'health.efficiency': '效率',
    'health.cardio': '心率',
    'health.restingHr': '静息心率',
    'health.hrv': '心率变异性 HRV',
    'health.spo2': '血氧饱和度 SpO2',
    'health.stress': '压力水平',
    'health.stressLow': '偏低 (22%)',
    'health.mobility': '活动量',
    'health.activity': '运动量',
    'health.tagWheelchair': '轮椅',
    'health.tagProsthesis': '假肢',
    'health.pushes': '次推行',
    'health.steps': '步',
    'health.wheelchairPushesTitle': '轮椅推行次数',
    'health.prosthesisStepsTitle': '假肢步行步数',
    'health.dailyGoal': '目标',

    // Quick pills
    'pill.health': '🏥 我今天的健康状态怎么样？',
    'pill.sleep': '🛌 昨晚我睡得好吗？',
    'pill.cardio': '❤️ 我的心率和压力',
    'pill.mobilityWheelchair': '♿ 轮椅推行数据',
    'pill.mobilitySteps': '🚶‍♂️ 假肢步行步数',

    // Assistant Section
    'assistant.title': '🎙️ AYUMI 语音助手（控制与对话）',
    'state.idle': '待机中',
    'state.listening': '正在聆听（录音中）',
    'state.thinking': '正在推理分析...',
    'state.response': '已呈现在HUD',
    'state.idleDesc': '轻按眼镜镜腿按键或在此长按说话，查询健康、行动力或日常提醒。',
    'state.listeningDesc': '请对准麦克风自然说话。',
    'state.thinkingTitle': 'AYUMI 正在思考...',
    'state.talkButton': '按住说话',
    'state.releaseButton': '松开结束',
    'state.newQuery': '新的提问',
    'state.placeholder': '输入关于健康或日常的问题...',
    'state.askBtn': '发送提问',
    'state.listeningLive': '正在收音：',
    'state.waitingVoice': '等待语音输入...',

    // Settings
    'settings.title': '无障碍辅助与设备设置',
    'settings.mobilityMode': '个人移动模式：',
    'settings.modeWheelchairLabel': '♿ 轮椅模式（推行计数）',
    'settings.modeStepsLabel': '🚶‍♂️ 假肢/正常步数模式',
    'settings.handsFree': '♿ 眼镜免手持自动轮播',
    'settings.handsFreeDesc': '待机时每 8 秒自动在眼镜屏幕上切换健康各项指标。',
    'settings.healthSource': '生物数据源：',
    'settings.smartProfile': 'NICO 智能离线配置（自动动态）',
    'settings.ouraTokenLabel': 'Oura 个人访问令牌：',
    'settings.ouraTokenBtn': '同步 Oura Ring',
    'settings.ouraSuccess': 'Oura 同步成功！',
    'settings.appleImportLabel': '导入 Apple 健康导出文件 (JSON)：',
    'settings.appleImportBtn': '📂 加载健康 JSON 文件',
    'settings.aiEngine': 'AI 助理模型：',
    'settings.geminiKeyLabel': 'Gemini API 密钥：',
    'settings.geminiKeyBtn': '保存密钥',

    // HUD Mirror & History
    'hud.mirrorTitle': '👓 眼镜 HUD 实时镜像（600×350）',
    'hud.cycleBtn': '切换页面',
    'hud.syncBtn': '强制同步',
    'history.title': '📝 提问历史记录',
    'history.clearBtn': '清空记录',
    'history.empty': '暂无历史记录。',

    // Creator & Community
    'creator.badge': '创作者与开发者',
    'creator.name': 'Nicolás Carvajal',
    'creator.tagline': '仿生运动员 · 无障碍科技与自主生活倡导者',
    'creator.bio': '专为截肢者、轮椅使用者及假肢佩戴者设计，实现完全解放双手的健康监测与 AI 智能辅具。',
    'creator.feedback': '💡 有任何建议、需求或使用其他传感器？欢迎在社交平台联系，我们将持续接入 AYUMI！',

    // HUD Display Texts
    'hud.headerHealth': '· 健康与体能恢复',
    'hud.headerSleep': '· 睡眠分析详情',
    'hud.headerCardio': '· 心率生理体征',
    'hud.headerWheelchair': '· 轮椅运动推行',
    'hud.headerSteps': '· 假肢步行活动',
    'hud.headerStandby': '· 待机中',
    'hud.headerListening': '· 录音中',
    'hud.headerThinking': '· 分析中',
    'hud.headerResponse': '· 回复',
    'hud.standbyTitle': 'AYUMI · 眼镜已就绪',
    'hud.standbySub': '提问：“我的健康状况怎么样？”或轻触按键',
    'hud.footerTip': '轻触镜腿切换 | 提问：“我昨晚睡得怎么样？”',
    'hud.footerTipCardio': '轻触镜腿切换 | 提问：“我今天活动了多少？”',
    'hud.footerTipMobility': '轻触镜腿切换 | 提问：“我的健康状态如何？”',
    'hud.footerTipSleep': '轻触镜腿切换 | 提问：“我的心率正常吗？”',
    'hud.deepSleep': '深睡',
    'hud.remSleep': '快速眼动',
    'hud.lightSleep': '浅睡',
    'hud.timeInBed': '总卧床时长',
    'hud.normHr': '正常心率 (50-65 bpm)',
    'hud.highHrv': '身心恢复极佳',
    'hud.normalSpo2': '血氧水平正常',
    'hud.stressCalm': '生理处于放松状态',
    'hud.listening': '正在聆听语音...',
    'hud.thinking': '正在分析健康数据...',
  },

  fr: {
    // Header
    'app.subtitle': 'Assistant Mains Libres · HUD 600×350',
    'status.connected': 'Connecté',
    'status.disconnected': 'Déconnecté',

    // Section 1: Health
    'health.sectionTitle': '📊 TABLEAU DE SANTÉ (VUE LUNETTES)',
    'mode.wheelchair': '♿ Fauteuil',
    'mode.steps': '🚶‍♂️ Prothèse',
    'health.score': 'SCORE SANTÉ',
    'health.optimal': 'OPTIMAL',
    'health.good': 'BON',
    'health.attention': 'ATTENTION',
    'health.battery': 'Batterie',
    'health.sleep': 'SOMMEIL',
    'health.efficiency': 'Effic.',
    'health.cardio': 'CARDIO',
    'health.restingHr': 'FC REPOS',
    'health.hrv': 'VFC (VARIABILITÉ)',
    'health.spo2': 'OXYGÈNE SpO2',
    'health.stress': 'STRESS',
    'health.stressLow': 'Bas (22%)',
    'health.mobility': 'MOBILITÉ',
    'health.activity': 'ACTIVITÉ',
    'health.tagWheelchair': 'FAUTEUIL',
    'health.tagProsthesis': 'PROTHÈSE',
    'health.pushes': 'poussées',
    'health.steps': 'pas',
    'health.wheelchairPushesTitle': 'POUSSÉES DE FAUTEUIL ROULANT',
    'health.prosthesisStepsTitle': 'PAS MARCHÉS AVEC PROTHÈSE',
    'health.dailyGoal': 'Objectif',

    // Quick pills
    'pill.health': '🏥 Quel est mon état de santé ?',
    'pill.sleep': '🛌 Comment ai-je dormi ?',
    'pill.cardio': '❤️ Mon rythme cardiaque',
    'pill.mobilityWheelchair': '♿ Activité en fauteuil',
    'pill.mobilitySteps': '🚶‍♂️ Pas et prothèse',

    // Assistant Section
    'assistant.title': '🎙️ ASSISTANT AYUMI (CONTRÔLE & VOIX)',
    'state.idle': 'EN ATTENTE',
    'state.listening': 'ÉCOUTE (ENREGISTREMENT)',
    'state.thinking': 'TRAITEMENT (RÉFLEXION)',
    'state.response': 'RÉPONSE (HUD)',
    'state.idleDesc': 'Appuyez sur le bouton des lunettes ou parlez ici pour consulter santé et rappels.',
    'state.listeningDesc': 'Parlez naturellement vers le microphone.',
    'state.thinkingTitle': 'AYUMI réfléchit...',
    'state.talkButton': 'MAINTENIR POUR PARLER',
    'state.releaseButton': 'RELÂCHER POUR ENVOYER',
    'state.newQuery': 'NOUVELLE DEMANDE',
    'state.placeholder': 'Posez une question sur votre santé ou la journée...',
    'state.askBtn': 'Demander',
    'state.listeningLive': 'Écoute en cours :',
    'state.waitingVoice': 'En attente de voix...',

    // Settings
    'settings.title': 'Accessibilité & Paramètres Appareils',
    'settings.mobilityMode': 'Mode de Mobilité Personnelle :',
    'settings.modeWheelchairLabel': '♿ Fauteuil roulant (Poussées)',
    'settings.modeStepsLabel': '🚶‍♂️ Prothèse / Pas normaux',
    'settings.handsFree': '♿ Mode Mains Libres sur HUD',
    'settings.handsFreeDesc': 'Fait défiler automatiquement les métriques de santé toutes les 8 s.',
    'settings.healthSource': 'Source de Données Biométriques :',
    'settings.smartProfile': 'Profil Intelligent NICO (Hors-ligne / Auto)',
    'settings.ouraTokenLabel': 'Token d\'accès personnel Oura :',
    'settings.ouraTokenBtn': 'Synchroniser Oura Ring',
    'settings.ouraSuccess': 'Oura synchronisé !',
    'settings.appleImportLabel': 'Importer données Apple Santé (JSON) :',
    'settings.appleImportBtn': '📂 Charger JSON Santé',
    'settings.aiEngine': 'Moteur IA Assistant :',
    'settings.geminiKeyLabel': 'Clé API Gemini :',
    'settings.geminiKeyBtn': 'Sauvegarder Clé',

    // HUD Mirror & History
    'hud.mirrorTitle': '👓 APERÇU HUD EN DIRECT (LUNETTES 600×350)',
    'hud.cycleBtn': 'Changer Vue',
    'hud.syncBtn': 'Forcer Sync',
    'history.title': '📝 HISTORIQUE DES REQUÊTES',
    'history.clearBtn': 'Effacer',
    'history.empty': 'Aucune requête enregistrée.',

    // Creator & Community
    'creator.badge': 'CRÉÉ PAR',
    'creator.name': 'Nicolás Carvajal',
    'creator.tagline': 'Athlète Bionique · Technologie d\'Accessibilité & Autonomie',
    'creator.bio': 'Conçu pour les personnes amputées, utilisatrices de fauteuil roulant ou de prothèse, offrant un suivi de santé et une assistance 100% mains libres.',
    'creator.feedback': '💡 Des suggestions ou un nouveau capteur ? Écrivez-moi sur les réseaux pour l\'intégrer à AYUMI !',

    // HUD Display Texts
    'hud.headerHealth': '· SANTÉ & RÉCUPÉRATION',
    'hud.headerSleep': '· DÉTAIL DU SOMMEIL',
    'hud.headerCardio': '· SIGNES VITAUX',
    'hud.headerWheelchair': '· MOBILITÉ FAUTEUIL',
    'hud.headerSteps': '· PAS ET PROTHÈSE',
    'hud.headerStandby': '· EN ATTENTE',
    'hud.headerListening': '· ENREGISTREMENT',
    'hud.headerThinking': '· ANALYSE',
    'hud.headerResponse': '· RÉPONSE',
    'hud.standbyTitle': 'AYUMI · Prêt dans vos lunettes',
    'hud.standbySub': 'Demandez : "Comment va ma santé ?" ou appuyez',
    'hud.footerTip': 'Appui branche : Vue suivante | Dites : "Comment ai-je dormi ?"',
    'hud.footerTipCardio': 'Appui branche : Vue suivante | Dites : "Combien d\'activité ?"',
    'hud.footerTipMobility': 'Appui branche : Vue suivante | Dites : "Comment va ma santé ?"',
    'hud.footerTipSleep': 'Appui branche : Vue suivante | Dites : "Comment va mon cœur ?"',
    'hud.deepSleep': 'Profond',
    'hud.remSleep': 'REM',
    'hud.lightSleep': 'Léger',
    'hud.timeInBed': 'TEMPS TOTAL AU LIT',
    'hud.normHr': 'Optimal (50-65 bpm)',
    'hud.highHrv': 'Haute récupération',
    'hud.normalSpo2': 'Oxygénation normale',
    'hud.stressCalm': 'Calme physiologique',
    'hud.listening': 'Écoute de la voix...',
    'hud.thinking': 'Analyse des données de santé...',
  },

  ru: {
    // Header
    'app.subtitle': 'Ассистент свободные руки · HUD 600×350',
    'status.connected': 'Подключено',
    'status.disconnected': 'Отключено',

    // Section 1: Health
    'health.sectionTitle': '📊 ПАНЕЛЬ ЗДОРОВЬЯ (ВИД В ОЧКАХ)',
    'mode.wheelchair': '♿ Коляска',
    'mode.steps': '🚶‍♂️ Протез',
    'health.score': 'БАЛЛ ЗДОРОВЬЯ',
    'health.optimal': 'ОТЛИЧНО',
    'health.good': 'ХОРОШО',
    'health.attention': 'ВНИМАНИЕ',
    'health.battery': 'Энергия',
    'health.sleep': 'СОН',
    'health.efficiency': 'Эффект.',
    'health.cardio': 'ПУЛЬС',
    'health.restingHr': 'ЧСС В ПОКОЕ',
    'health.hrv': 'ВРС (ВАРИАБЕЛЬНОСТЬ)',
    'health.spo2': 'КИСЛОРОД SpO2',
    'health.stress': 'СТРЕСС',
    'health.stressLow': 'Низкий (22%)',
    'health.mobility': 'АКТИВНОСТЬ',
    'health.activity': 'ДВИЖЕНИЕ',
    'health.tagWheelchair': 'КОЛЯСКА',
    'health.tagProsthesis': 'ПРОТЕЗ',
    'health.pushes': 'толчков',
    'health.steps': 'шагов',
    'health.wheelchairPushesTitle': 'ТОЛЧКОВ КОЛЯСКИ',
    'health.prosthesisStepsTitle': 'ШАГОВ С ПРОТЕЗОМ',
    'health.dailyGoal': 'Цель',

    // Quick pills
    'pill.health': '🏥 Как моё здоровье сегодня?',
    'pill.sleep': '🛌 Как я спал ночью?',
    'pill.cardio': '❤️ Пульс и сердце',
    'pill.mobilityWheelchair': '♿ Активность на коляске',
    'pill.mobilitySteps': '🚶‍♂️ Шаги с протезом',

    // Assistant Section
    'assistant.title': '🎙️ АССИСТЕНТ AYUMI (ГОЛОС И КОМАНДЫ)',
    'state.idle': 'ОЖИДАНИЕ',
    'state.listening': 'ЗАПИСЬ (СЛУШАЮ)',
    'state.thinking': 'ОБРАБОТКА (ДУМАЮ)',
    'state.response': 'ОТВЕТ (HUD)',
    'state.idleDesc': 'Нажмите кнопку на очках или говорите сюда, чтобы узнать о здоровье или дне.',
    'state.listeningDesc': 'Говорите спокойно в микрофон.',
    'state.thinkingTitle': 'AYUMI анализирует...',
    'state.talkButton': 'УДЕРЖИВАТЬ ДЛЯ ГОЛОСА',
    'state.releaseButton': 'ОТПУСТИТЬ ДЛЯ ОТПРАВКИ',
    'state.newQuery': 'НОВЫЙ ВОПРОС',
    'state.placeholder': 'Задайте вопрос о здоровье или дне...',
    'state.askBtn': 'Спросить',
    'state.listeningLive': 'Слушаю:',
    'state.waitingVoice': 'Ожидание голоса...',

    // Settings
    'settings.title': 'Настройки доступности и датчиков',
    'settings.mobilityMode': 'Режим мобильности:',
    'settings.modeWheelchairLabel': '♿ Коляска (Толчки)',
    'settings.modeStepsLabel': '🚶‍♂️ Протез / Обычные шаги',
    'settings.handsFree': '♿ Режим Свободные руки на HUD',
    'settings.handsFreeDesc': 'Автоматически переключает показатели здоровья на очках каждые 8 сек.',
    'settings.healthSource': 'Источник биометрии:',
    'settings.smartProfile': 'Умный профиль NICO (Офлайн / Авто)',
    'settings.ouraTokenLabel': 'Токен доступа Oura Ring:',
    'settings.ouraTokenBtn': 'Синхронизировать Oura',
    'settings.ouraSuccess': 'Oura синхронизирован!',
    'settings.appleImportLabel': 'Импорт Apple Здоровье (JSON):',
    'settings.appleImportBtn': '📂 Загрузить файл JSON',
    'settings.aiEngine': 'Модель ИИ ассистента:',
    'settings.geminiKeyLabel': 'Ключ Gemini API:',
    'settings.geminiKeyBtn': 'Сохранить ключ',

    // HUD Mirror & History
    'hud.mirrorTitle': '👓 ЭКРАН ОЧКОВ HUD В РЕАЛЬНОМ ВРЕМЕНИ (600×350)',
    'hud.cycleBtn': 'Сменить экран',
    'hud.syncBtn': 'Синхронизация',
    'history.title': '📝 ИСТОРИЯ ЗАПРОСОВ',
    'history.clearBtn': 'Очистить',
    'history.empty': 'Запросов пока нет.',

    // Creator & Community
    'creator.badge': 'АВТОР И РАЗРАБОТЧИК',
    'creator.name': 'Николас Карвахаль',
    'creator.tagline': 'Бионический атлет · Технологии доступности и автономии',
    'creator.bio': 'Создано для людей с ампутацией, на коляске или с протезами для контроля здоровья и помощи без участия рук.',
    'creator.feedback': '💡 Есть предложения или используете другой датчик/протез? Напишите мне в соцсетях для добавления в AYUMI!',

    // HUD Display Texts
    'hud.headerHealth': '· ЗДОРОВЬЕ И ВОССТАНОВЛЕНИЕ',
    'hud.headerSleep': '· ДЕТАЛИЗАЦИЯ СНА',
    'hud.headerCardio': '· ПОКАЗАТЕЛИ ПУЛЬСА',
    'hud.headerWheelchair': '· ДВИЖЕНИЕ НА КОЛЯСКЕ',
    'hud.headerSteps': '· ШАГИ С ПРОТЕЗОМ',
    'hud.headerStandby': '· ОЖИДАНИЕ',
    'hud.headerListening': '· ЗАПИСЬ',
    'hud.headerThinking': '· АНАЛИЗ',
    'hud.headerResponse': '· ОТВЕТ',
    'hud.standbyTitle': 'AYUMI · Готов в ваших очках',
    'hud.standbySub': 'Спросите: "Как моё здоровье?" или нажмите кнопку',
    'hud.footerTip': 'Кнопка: след. экран | Спросите: "Как я спал?"',
    'hud.footerTipCardio': 'Кнопка: след. экран | Спросите: "Какова активность?"',
    'hud.footerTipMobility': 'Кнопка: след. экран | Спросите: "Как моё здоровье?"',
    'hud.footerTipSleep': 'Кнопка: след. экран | Спросите: "Как моё сердце?"',
    'hud.deepSleep': 'Глубокий',
    'hud.remSleep': 'REM',
    'hud.lightSleep': 'Лёгкий',
    'hud.timeInBed': 'ВСЕГО В ПОСТЕЛИ',
    'hud.normHr': 'Оптимально (50-65 уд/мин)',
    'hud.highHrv': 'Высокое восстановление',
    'hud.normalSpo2': 'Кислород в норме',
    'hud.stressCalm': 'Физиологический покой',
    'hud.listening': 'Слушаю голос...',
    'hud.thinking': 'Анализ телеметрии здоровья...',
  },
});

export class I18nManager {
  constructor(defaultLang = 'es') {
    this.currentLang = defaultLang;
  }

  setLanguage(lang) {
    if (TRANSLATIONS[lang]) {
      this.currentLang = lang;
      return true;
    }
    return false;
  }

  getLanguage() {
    return this.currentLang;
  }

  t(key, fallback = '') {
    const dict = TRANSLATIONS[this.currentLang] || TRANSLATIONS.es;
    return dict[key] || TRANSLATIONS.es[key] || fallback || key;
  }

  getAll(lang = null) {
    return TRANSLATIONS[lang || this.currentLang] || TRANSLATIONS.es;
  }
}

export const i18n = new I18nManager('es');
