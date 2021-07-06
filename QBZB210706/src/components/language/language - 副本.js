export const language = {
  RadioType_zh: "射频类型",
  RadioType_en: "RF type",
  RadioType_fr: "Type de rf",

  //射频类型
  RadiofrequencyType: [
    { value: "00", name_zh: "未知", name_fr: "Inconnu", name_en: "Unkown" },
    { value: "01", name_zh: "固定", name_fr: "Fixe", name_en: "Fixed" },
    { value: "02", name_zh: "复杂", name_fr: "Compliqué", name_en: "Complex" },
    { value: "16", name_zh: "捷变", name_fr: "Agile", name_en: "Agile" },
    {
      value: "17",
      name_zh: "脉间捷变",
      name_fr: "Agilité d'inter-impulsion",
      name_en: "Inter pulse agile"
    },
    {
      value: "18",
      name_zh: "脉组捷变",
      name_fr: "Agilité de groupe d'impulsions",
      name_en: "Pulse agile"
    },
    { value: "19", name_zh: "切换", name_fr: "Commutation", name_en: "Switch" },
    { value: "20", name_zh: "跳变", name_fr: "Sauter", name_en: "Jump" },
    { value: "21", name_zh: "步进", name_fr: "Stepping", name_en: "Step" },
    { value: "48", name_zh: "扫描", name_fr: "Numériser", name_en: "Sweep" },
    {
      value: "49",
      name_zh: "正弦扫描",
      name_fr: "Balayage sinus",
      name_en: "Sine sweep"
    },
    {
      value: "50",
      name_zh: "三角波扫描",
      name_fr: "Balayage d'onde triangulaire",
      name_en: "Triangular voltage sweep"
    },
    {
      value: "51",
      name_zh: "锯齿波扫描",
      name_fr: "Numérisation en dents de scie",
      name_en: "Sawtooth wave scanning"
    },
    {
      value: "64",
      name_zh: "频率分集",
      name_fr: "Diversité de fréquence",
      name_en: "Frequency diversity"
    },
    {
      value: "65",
      name_zh: "分时分集",
      name_fr: "Diversité du temps",
      name_en: "Time diversity"
    },
    {
      value: "66",
      name_zh: "同时分集",
      name_fr: "Diversité simultanée",
      name_en: "Simultaneous diversity"
    },
    {
      value: "80",
      name_zh: "频率编码",
      name_fr: "Codage de fréquence",
      name_en: "Frequency coding"
    }
  ],


  UpperOperatingFrequency_zh: "工作频率上限",
  UpperOperatingFrequency_en: "Fmax",
  UpperOperatingFrequency_fr: "Fmax",

  LowerOperatingFrequency_zh: "工作频率下限",
  LowerOperatingFrequency_en: "Fmin",
  LowerOperatingFrequency_fr: "Fmin",

  PulseWidthType_zh: "脉宽类型",
  PulseWidthType_en: "PW type",
  PulseWidthType_fr: "Type de durée d'impulsion",

  //脉宽类型
  PulseWidthType: [
    { value: "00", name_zh: "未知", name_fr: "Inconnu", name_en: "Unkown" },
    { value: "01", name_zh: "固定", name_fr: "Fixe", name_en: "Fixed" },
    { value: "02", name_zh: "复杂", name_fr: "Compliqué", name_en: "Complex" },
    { value: "16", name_zh: "捷变", name_fr: "Agile", name_en: "Agile" },
    { value: "32", name_zh: "编码", name_fr: "Encodage", name_en: "Code" }
  ],


  UpperPulseWidthLimit_zh: "脉宽上限",
  UpperPulseWidthLimit_en: "PW max",
  UpperPulseWidthLimit_fr: "Durée d'impulsion maximale",

  LowerPulseWidthLimit_zh: "脉宽下限",
  LowerPulseWidthLimit_en: "PW min",
  LowerPulseWidthLimit_fr: "Durée d'impulsion minimale",

  RepetitionIntervalType_zh: "重复间隔类型",
  RepetitionIntervalType_en: "Recurrence interval type",
  RepetitionIntervalType_fr: "Type d'intervalle de récurrence",

  //重复间隔类型
  RepetitiveIntervalType: [
    { value: "00", name_zh: "未知", name_fr: "Inconnu", name_en: "Unkown" },
    { value: "01", name_zh: "固定", name_fr: "Fixe", name_en: "Fixed" },
    { value: "02", name_zh: "复杂", name_fr: "Compliqué", name_en: "Complex" },
    { value: "03", name_zh: "抖动", name_fr: "Jitter", name_en: "Jitter" },
    { value: "04", name_zh: "滑变", name_fr: "Slip", name_en: "Slide" },
    {
      value: "16",
      name_zh: "参差",
      name_fr: "Bouleversant",
      name_en: "Stagger"
    },
    {
      value: "17",
      name_zh: "脉间参差",
      name_fr: "Bouleversant inter-impulsion",
      name_en: "Interpulse stagger"
    },
    { value: "18", name_zh: "切换", name_fr: "Commutateur", name_en: "Switch" },
    { value: "32", name_zh: "连续波", name_fr: "Onde continue", name_en: "CW" },
    {
      value: "33",
      name_zh: "调频连续波",
      name_fr: "Onde continue de modulation de fréquence",
      name_en: "FMCW"
    },
    {
      value: "34",
      name_zh: "调相连续波",
      name_fr: "Onde continue de modulation de phase",
      name_en: "PMCW"
    }
  ],

  UpperLimitInterval_zh: "重复间隔上限",
  UpperLimitInterval_en: "Recurrence interval maximum",
  UpperLimitInterval_fr: "Limite supérieure de l'intervalle répétée",

  LowerLimitInterval_zh: "重复间隔下限",
  LowerLimitInterval_en: "Recurrence interval minimum",
  LowerLimitInterval_fr: "Limite inférieure de l'intervalle répétée",

  technicalSystem_zh: "技术体制",
  technicalSystem_en: "Technical system",
  technicalSystem_fr: "Système technique",

  //技术体制
  technologyName: [
    { value: "00", name_zh: "不明", name_fr: "inconnu", name_en: "Unknown" },
    {
      value: "01",
      name_zh: "简单脉冲体制",
      name_fr: "Système d'impulsions simple",
      name_en: "Simple Pulse System"
    },
    {
      value: "02",
      name_zh: "动目标显示",
      name_fr: "Affichage de la cible mobile",
      name_en: "MTI"
    },
    {
      value: "03",
      name_zh: "脉冲多普勒",
      name_fr: "Impulsion Doppler",
      name_en: "Pulse Doppler"
    },
    {
      value: "04",
      name_zh: "脉冲压缩",
      name_fr: "Compression d'impulsion",
      name_en: "Pulse compression"
    },
    {
      value: "05",
      name_zh: "频率捷变",
      name_fr: "Agilité de fréquence",
      name_en: "Frequency agility"
    },
    {
      value: "06",
      name_zh: "频率分集",
      name_fr: "Diversité de fréquence",
      name_en: "Frequency diversity"
    },
    {
      value: "07",
      name_zh: "多波束",
      name_fr: "Multifaisceau",
      name_en: "Multibeam"
    },
    {
      value: "08",
      name_zh: "频扫",
      name_fr: "Balayage de fréquence",
      name_en: "Frequency scanning"
    },
    {
      value: "09",
      name_zh: "相扫",
      name_fr: "Balayage de phase",
      name_en: "Phase scanning"
    },
    {
      value: "10",
      name_zh: "频相扫",
      name_fr: "Balayage de fréquence et de phase",
      name_en: "Frequency-phase scanning"
    },
    {
      value: "11",
      name_zh: "圆锥扫描",
      name_fr: "Balayage conique",
      name_en: "Conical scanning"
    },
    {
      value: "12",
      name_zh: "单脉冲",
      name_fr: "Impulsion unique",
      name_en: "Monopulse"
    },
    {
      value: "13",
      name_zh: "相控阵",
      name_fr: "Réseau phasé",
      name_en: "Phased array"
    },
    {
      value: "14",
      name_zh: "二次雷达",
      name_fr: "Radar secondaire",
      name_en: "Secondary radar"
    },
    { value: "15", name_zh: "连续波", name_fr: "Onde continue", name_en: "CW" },
    {
      value: "16",
      name_zh: "多基地雷达",
      name_fr: "Radar multi-base",
      name_en: "Multistatic radar"
    },
    {
      value: "17",
      name_zh: "超视距雷达",
      name_fr: "Radar trans-horizon",
      name_en: "Over-the-horizon radar"
    },
    {
      value: "18",
      name_zh: "合成孔径雷达",
      name_fr: "Radar à ouverture synthétique",
      name_en: "Synthetic aperture radar"
    },
    { value: "19", name_zh: "噪声", name_fr: "Bruit", name_en: "Noise" },
    {
      value: "20",
      name_zh: "复合体制雷达",
      name_fr: "Radar de système composé",
      name_en: "Composite radar"
    }
  ],


  AntiInterferenceMode_zh: "抗干扰方式",
  AntiInterferenceMode_en: "Anti-jamming mode",
  AntiInterferenceMode_fr: "Mode anti-brouillage",

  //抗干扰方式
  AntiInterferenceMode: [
    { value: "00", name_zh: "未知", name_fr: "inconnu", name_en: "Unknown" },
    {
      value: "01",
      name_zh: "旁瓣对消",
      name_fr: "Annulation du lobe latéral",
      name_en: "Sidelobe cancellation"
    },
    {
      value: "02",
      name_zh: "旁瓣消隐",
      name_fr: "Obturation du lobe latéral",
      name_en: "Sidelobe blanking"
    },
    {
      value: "03",
      name_zh: "恒虚警处理",
      name_fr: "Traitement constant des fausses alarmes",
      name_en: "Constant False Alarm Processing"
    },
    {
      value: "04",
      name_zh: "雷达组网",
      name_fr: "Mise en réseau des radars",
      name_en: "Radar netting"
    },
    {
      value: "05",
      name_zh: "抗干扰电路",
      name_fr: "Circuit anti-brouillage",
      name_en: "Anti-interference circuit"
    },
    {
      value: "06",
      name_zh: "波形选择",
      name_fr: "Sélection de forme d'onde",
      name_en: "Waveform selection"
    },
    {
      value: "07",
      name_zh: "自适应波束形成",
      name_fr: "Formation de faisceau adaptative",
      name_en: "Adaptive beamforming"
    },
    {
      value: "08",
      name_zh: "瞬态干扰抑制",
      name_fr: "Suppression des brouillages transitoires",
      name_en: "Transient interference suppression"
    },
    {
      value: "09",
      name_zh: "距离选通",
      name_fr: "Portail de distance",
      name_en: "Range gating"
    }
  ],


  MSTXPWR_zh: "最大发射功率",
  MSTXPWR_en: "Maximum transmitting power",
  MSTXPWR_fr: "Puissance d'émission maximale",

  MaximumAntennaGain_zh: "最大天线增益",
  MaximumAntennaGain_en: "Maximum antenna gain",
  MaximumAntennaGain_fr: "Gain d'antenne maximal",

  MaximumOperatingDistance_zh: "最大作用距离",
  MaximumOperatingDistance_en: "Maximum operation range",
  MaximumOperatingDistance_fr: "Plage de fonctionnement maximale",

  ReceiverBandwidth_zh: "接收机带宽",
  ReceiverBandwidth_en: "Receiver bandwidth",
  ReceiverBandwidth_fr: "Bande passante du récepteur",

  CompressionCoefficient_zh: "压制系数",
  CompressionCoefficient_en: "suppress coefficient",
  CompressionCoefficient_fr: "Coefficient de suppression",

  systemLoss_zh: "系统损耗",
  systemLoss_en: "System loss",
  systemLoss_fr: "Perte de système",

  noiseFactor_zh: "噪声系数",
  noiseFactor_en: "noise figure",
  noiseFactor_fr: "Coefficient de bruit",

  sensitivity_zh: "灵敏度",
  sensitivity_en: "Sensitivity",
  sensitivity_fr: "Sensibilité",

  remark_zh: "备注",
  remark_en: "Note",
  remark_fr: "Remarque",

  PlaneLength_zh: "机长",
  PlaneLength_en: "Captain",
  PlaneLength_fr: "Capitaine",

  Wingspan_zh: "翼展",
  Wingspan_en: "Wingspan",
  Wingspan_fr: "Envergure",

  PlaneHeight_zh: "机高",
  PlaneHeight_en: "Aircraft height",
  PlaneHeight_fr: "Hauteur de l'avion",

  MaximumSpeed_zh: "最大时速",
  MaximumSpeed_en: "Maximum speed per hour",
  MaximumSpeed_fr: "Vitesse maximale par heure",

  CruisingSpeed_zh: "巡航时速",
  CruisingSpeed_en: "Cruising speed",
  CruisingSpeed_fr: "Vitesse de croisière",

  maximumCeiling_zh: "最大升限",
  maximumCeiling_en: "Maximum ceiling",
  maximumCeiling_fr: "Plafond maximum",

  serviceCeiling_zh: "实用升限",
  serviceCeiling_en: "Service ceiling",
  serviceCeiling_fr: "Plafond de service",

  maximumRange_zh: "最大航程",
  maximumRange_en: "Maximum voyage",
  maximumRange_fr: "Voyage maximum",

  actionRadius_zh: "活动半径",
  actionRadius_en: "Activity radius",
  actionRadius_fr: "Rayon d'activité",

  XuHangTime_zh: "续航时间",
  XuHangTime_en: "Time of endurance",
  XuHangTime_fr: "Temps d'endurance",

  AverageRCS_zh: "平均RCS",
  AverageRCS_en: "Average RCS",
  AverageRCS_fr: "RCS moyen",






};
export default language;