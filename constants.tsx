
import { ThreadData, MaterialData, ToolInsert } from './types';

export const COLORS = {
  LEAD: '#1a1816',
  LEAD_DARK: '#0a0908',
  LEAD_SURFACE: '#1c1816',
  COPPER: '#eab308',
  COPPER_LIGHT: '#facc15',
  SILVER: '#e2e8f0',
  TEXT_MAIN: '#f3f4f6'
};

export const CASILLAS_CONSULTANT_IMAGE = "/consultor_casillas.png";

export const AVATAR_URL = CASILLAS_CONSULTANT_IMAGE;

export const MATERIALS: MaterialData[] = [
  { 
    name: 'P - Aço Carbono 1020', 
    category: 'ASTM A36 / SAE 1020', 
    hardnessHb: '120 HB', 
    hardnessValue: 120, 
    strength: '42', 
    tensileStrength: 420, 
    yieldStrength: 210, 
    carbonContent: '0.20%', 
    usinability: 90, 
    color: '#3b82f6',
    chemicalComposition: 'C: 0.18-0.23%, Mn: 0.30-0.60%, P: 0.04% max, S: 0.05% max',
    typicalApps: 'Eixos, pinos, parafusos, componentes de máquinas de baixa solicitação.',
    thermalTreatment: 'Cementação para aumento de dureza superficial.',
    weldingInfo: 'Excelente soldabilidade, não requer pré-aquecimento em espessuras finas.'
  },
  { 
    name: 'P - Aço Carbono 1045', 
    category: 'SAE 1045', 
    hardnessHb: '180 HB', 
    hardnessValue: 180, 
    strength: '60', 
    tensileStrength: 600, 
    yieldStrength: 310, 
    carbonContent: '0.45%', 
    usinability: 70, 
    color: '#3b82f6',
    chemicalComposition: 'C: 0.43-0.50%, Mn: 0.60-0.90%, P: 0.04% max, S: 0.05% max',
    typicalApps: 'Eixos de transmissão, engrenagens, virabrequins, peças temperadas por indução.',
    thermalTreatment: 'Normalização, Têmpera e Revenimento.',
    weldingInfo: 'Soldabilidade limitada, requer pré-aquecimento (200-300°C) e resfriamento controlado.'
  },
  { 
    name: 'P - Aço Liga 4140', 
    category: 'SAE 4140 (Beneficiado)', 
    hardnessHb: '280 HB', 
    hardnessValue: 280, 
    strength: '95', 
    tensileStrength: 950, 
    yieldStrength: 750, 
    carbonContent: '0.40%', 
    usinability: 55, 
    color: '#3b82f6',
    chemicalComposition: 'C: 0.38-0.43%, Cr: 0.80-1.10%, Mo: 0.15-0.25%, Mn: 0.75-1.00%',
    typicalApps: 'Eixos de alta resistência, bielas, prisioneiros, ferramentas manuais.',
    thermalTreatment: 'Têmpera em óleo e Revenimento.',
    weldingInfo: 'Requer pré-aquecimento rigoroso e tratamento pós-solda (alívio de tensões).'
  },
  { 
    name: 'M - Inox 304', 
    category: 'Austenítico / AISI 304', 
    hardnessHb: '170 HB', 
    hardnessValue: 170, 
    strength: '52', 
    tensileStrength: 520, 
    yieldStrength: 210, 
    carbonContent: '0.08%', 
    usinability: 45, 
    color: '#eab308',
    chemicalComposition: 'Cr: 18-20%, Ni: 8-10.5%, Mn: 2% max, C: 0.08% max',
    typicalApps: 'Equipamentos químicos, alimentícios, farmacêuticos, tanques e tubulações.',
    thermalTreatment: 'Solubilização (não endurecível por tratamento térmico).',
    weldingInfo: 'Excelente soldabilidade, risco de precipitação de carbonetos se não for 304L.'
  },
  { 
    name: 'M - Inox 316L', 
    category: 'Austenítico / AISI 316L', 
    hardnessHb: '160 HB', 
    hardnessValue: 160, 
    strength: '50', 
    tensileStrength: 500, 
    yieldStrength: 200, 
    carbonContent: '0.03%', 
    usinability: 40, 
    color: '#eab308',
    chemicalComposition: 'Cr: 16-18%, Ni: 10-14%, Mo: 2-3%, C: 0.03% max',
    typicalApps: 'Ambientes marinhos, offshore, indústria de papel e celulose, implantes.',
    thermalTreatment: 'Solubilização.',
    weldingInfo: 'Excelente soldabilidade, baixo carbono evita corrosão intergranular.'
  },
  { 
    name: 'M - Inox Duplex 2205', 
    category: 'Duplex / UNS S32205', 
    hardnessHb: '260 HB', 
    hardnessValue: 260, 
    strength: '80', 
    tensileStrength: 800, 
    yieldStrength: 550, 
    carbonContent: '0.03%', 
    usinability: 30, 
    color: '#eab308',
    chemicalComposition: 'Cr: 22%, Ni: 5%, Mo: 3%, N: 0.18%',
    typicalApps: 'Vasos de pressão, trocadores de calor, sistemas de dessalinização.',
    thermalTreatment: 'Solubilização controlada para manter balanço ferrita/austenita.',
    weldingInfo: 'Requer controle rigoroso do aporte térmico (heat input).'
  },
  { 
    name: 'K - Fofo Cinzento G25', 
    category: 'GG25 / DIN 1691', 
    hardnessHb: '210 HB', 
    hardnessValue: 210, 
    strength: '25', 
    tensileStrength: 250, 
    yieldStrength: 150, 
    carbonContent: '3.2%', 
    usinability: 100, 
    color: '#ef4444',
    chemicalComposition: 'C: 3.0-3.4%, Si: 1.8-2.3%, Mn: 0.6-0.9%',
    typicalApps: 'Bases de máquinas, blocos de motores, polias, carcaças de bombas.',
    thermalTreatment: 'Alívio de tensões.',
    weldingInfo: 'Soldabilidade pobre, requer eletrodos de níquel e pré-aquecimento alto.'
  },
  { 
    name: 'K - Fofo Nodular GGG40', 
    category: 'GGG40 / DIN 1693', 
    hardnessHb: '150 HB', 
    hardnessValue: 150, 
    strength: '40', 
    tensileStrength: 400, 
    yieldStrength: 250, 
    carbonContent: '3.5%', 
    usinability: 80, 
    color: '#ef4444',
    chemicalComposition: 'C: 3.4-3.8%, Si: 2.4-2.8%, Mg: 0.04-0.06%',
    typicalApps: 'Válvulas, conexões, componentes automotivos, engrenagens.',
    thermalTreatment: 'Recozimento para ferritização.',
    weldingInfo: 'Melhor que o cinzento, mas ainda requer cuidados especiais.'
  },
  { 
    name: 'N - Alumínio 6061-T6', 
    category: 'Al-Mg-Si / 6061-T6', 
    hardnessHb: '95 HB', 
    hardnessValue: 95, 
    strength: '31', 
    tensileStrength: 310, 
    yieldStrength: 270, 
    carbonContent: '0%', 
    usinability: 120, 
    color: '#10b981',
    chemicalComposition: 'Mg: 1.0%, Si: 0.6%, Cu: 0.3%, Cr: 0.2%',
    typicalApps: 'Estruturas aeronáuticas, náuticas, componentes de precisão.',
    thermalTreatment: 'Tratamento T6 (Solubilização e Envelhecimento artificial).',
    weldingInfo: 'Soldável por TIG/MIG, mas perde propriedades mecânicas na ZTA.'
  },
  { 
    name: 'S - Inconel 625', 
    category: 'Superliga de Níquel', 
    hardnessHb: '220 HB', 
    hardnessValue: 220, 
    strength: '90', 
    tensileStrength: 900, 
    yieldStrength: 450, 
    carbonContent: '0%', 
    usinability: 20, 
    color: '#f97316',
    chemicalComposition: 'Ni: 58% min, Cr: 20-23%, Mo: 8-10%, Nb+Ta: 3.15-4.15%',
    typicalApps: 'Componentes aeroespaciais, reatores químicos, revestimentos offshore.',
    thermalTreatment: 'Solubilização.',
    weldingInfo: 'Soldável, mas requer limpeza extrema e controle de contaminação.'
  },
  { 
    name: 'H - Aço Temperado 60HRC', 
    category: 'AISI D2 / VC131', 
    hardnessHb: '60 HRC', 
    hardnessValue: 650, 
    strength: '220', 
    tensileStrength: 2200, 
    yieldStrength: 1800, 
    carbonContent: '1.5%', 
    usinability: 10, 
    color: '#64748b',
    chemicalComposition: 'C: 1.5%, Cr: 12%, Mo: 1%, V: 1%',
    typicalApps: 'Matrizes de corte, punções, rolos formadores, facas industriais.',
    thermalTreatment: 'Têmpera e Duplo Revenimento.',
    weldingInfo: 'Extremamente difícil, risco altíssimo de trincas a frio.'
  }
];

export const GLOSSARY_TERMS = [
  {
    term: 'ASME VIII Div 1/2',
    def: 'Código para projeto e construção de vasos de pressão e caldeiraria pesada.',
    details: 'Define espessuras de parede, reforços de bocal e requisitos de testes hidrostáticos e radiografia (RT/UT).',
    cat: 'Normas Técnicas',
    icon: 'verified',
    color: '#eab308'
  },
  {
    term: 'Bisel (Beveling)',
    def: 'Preparação da borda de chapas ou tubos para soldagem.',
    details: 'Tipos: V, X, K, J e U. Essencial para garantir a penetração total da raiz conforme AWS D1.1.',
    cat: 'Caldeiraria',
    icon: 'format_paint',
    color: '#3b82f6'
  },
  {
    term: 'GD&T (Geometrical)',
    def: 'Dimensionamento e Tolerância Geométrica (ASME Y14.5).',
    details: 'Controla erro de forma, orientação e localização. Crucial em flanges API para garantir paralelismo em vedações metal-metal.',
    cat: 'Metrologia',
    icon: 'architecture',
    color: '#ef4444'
  },
  {
    term: 'EPS (WPS)',
    def: 'Especificação de Procedimento de Soldagem.',
    details: 'Documento que detalha os parâmetros (corrente, tensão, gás, consumível) para execução da solda qualificada.',
    cat: 'Caldeiraria',
    icon: 'history_edu',
    color: '#f97316'
  }
];

export const HAILTOOLS_CATALOG: ToolInsert[] = [
  {
    id: 'turn_offshore',
    code: 'CNMG 120408-PR - DESBASTE PESADO',
    grade: 'GC4325',
    coating: 'Inveio™ (Alumina)',
    geometry: '-PR (Estabilidade Extra)',
    geometryDesc: 'Para desbaste de flanges forjados em aço carbono ASTM A105 com alta produtividade.',
    category: 'Torneamento',
    isoCategories: ['P', 'K'],
    applicationPrimary: 'Corpo de Válvulas e Flanges API',
    parameters: { vc: 220, vcRange: [180, 280], fn: 0.45, fnRange: [0.3, 0.6], ap: 4.5, apRange: [2.0, 7.0] },
    image: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'drill_880',
    code: 'CoroDrill® 880 - BROCA DE INSERTOS',
    grade: 'GC4344',
    coating: 'Zertivo™',
    geometry: '-LM (Baixo Esforço)',
    geometryDesc: 'Broca de alto rendimento para furos em placas de trocadores de calor.',
    category: 'Furação',
    isoCategories: ['P', 'M', 'K'],
    applicationPrimary: 'Furação de Placas Espelho e Vasos',
    parameters: { vc: 180, vcRange: [140, 220], fn: 0.12, fnRange: [0.08, 0.18], ap: 0, apRange: [0, 0] },
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'fres_mf80',
    code: 'CoroMill® MF80 - FACEAMENTO 80°',
    grade: 'GC4330',
    coating: 'Inveio™',
    geometry: '-M (Média)',
    geometryDesc: 'Fresa de faceamento para grandes remoções em blocos de válvulas.',
    category: 'Fresamento',
    isoCategories: ['P', 'K'],
    applicationPrimary: 'Faceamento de Blocos e Estruturas',
    parameters: { vc: 250, vcRange: [200, 320], fn: 0.25, fnRange: [0.15, 0.4], ap: 6.0, apRange: [1.0, 8.0] },
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'cut_corocut2',
    code: 'CoroCut® 2 - CANAL E CORTE',
    grade: 'GC1125',
    coating: 'PVD TiAlN',
    geometry: '-TF (Quebra-cavaco)',
    geometryDesc: 'Sistema de alta rigidez para canais em anéis de vedação API.',
    category: 'Corte e Canal',
    isoCategories: ['P', 'M', 'S'],
    applicationPrimary: 'Canais de Vedação BX/RX',
    parameters: { vc: 140, vcRange: [100, 180], fn: 0.18, fnRange: [0.1, 0.3], ap: 3.0, apRange: [0.5, 5.0] },
    image: 'https://images.unsplash.com/photo-1565608438257-fac3c27beb36?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'thread_266',
    code: 'CoroThread® 266 - ROSCAMENTO',
    grade: 'GC1135',
    coating: 'PVD',
    geometry: '-PM (Perfil Médio)',
    geometryDesc: 'Sistema iLock™ para estabilidade extrema em roscas API e NPT.',
    category: 'Roscamento',
    isoCategories: ['P', 'M', 'S'],
    applicationPrimary: 'Roscas de Conexão Offshore',
    parameters: { vc: 120, vcRange: [80, 160], fn: 0, fnRange: [0, 0], ap: 0, apRange: [0, 0] },
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'silent_tools',
    code: 'Silent Tools™ - ADAPTADORES ANTIVIBRATÓRIOS',
    grade: 'N/A',
    coating: 'N/A',
    geometry: 'Dampened',
    geometryDesc: 'Barras de mandrilar com amortecimento interno para grandes balanços (até 14xD).',
    category: 'Adaptadores',
    isoCategories: ['P', 'M', 'K', 'N', 'S', 'H'],
    applicationPrimary: 'Usinagem Interna de Longo Alcance',
    parameters: { vc: 0, vcRange: [0, 0], fn: 0, fnRange: [0, 0], ap: 0, apRange: [0, 0] },
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'drill_860',
    code: 'CoroDrill® 860-GM - FURAÇÃO MULTI-MATERIAL',
    grade: 'X1BM',
    coating: 'PVD Multi-layer',
    geometry: '-GM',
    geometryDesc: 'Broca de metal duro integral para furação de alta velocidade em diversos materiais.',
    category: 'Furação',
    isoCategories: ['P', 'M', 'K', 'H'],
    applicationPrimary: 'Furação Geral de Alta Performance',
    parameters: { vc: 120, vcRange: [90, 150], fn: 0.2, fnRange: [0.1, 0.3], ap: 0, apRange: [0, 0] },
    image: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'mill_490',
    code: 'CoroMill® 490 - FRESAMENTO 90°',
    grade: 'GC1130',
    coating: 'Zertivo™',
    geometry: '-PM',
    geometryDesc: 'Fresa de esquadrejamento com 4 arestas reais para excelente acabamento.',
    category: 'Fresamento',
    isoCategories: ['P', 'M'],
    applicationPrimary: 'Esquadrejamento e Faceamento',
    parameters: { vc: 280, vcRange: [220, 350], fn: 0.15, fnRange: [0.1, 0.25], ap: 4.0, apRange: [0.5, 5.5] },
    image: 'https://images.unsplash.com/photo-1581092346544-2ff810428bc8?auto=format&fit=crop&q=80&w=300'
  }
];

export const DIVIDER_PLATES = [
  { id: 'plate_1', holes: [15, 16, 17, 18, 19, 20] },
  { id: 'plate_2', holes: [21, 23, 27, 29, 31, 33] },
  { id: 'plate_3', holes: [37, 39, 41, 43, 47, 49] }
];

export const SHACKLES_DATA = [
  { size: '1/2"', wll_alloy: 2.0, a: 33, b: 48 },
  { size: '5/8"', wll_alloy: 3.25, a: 43, b: 60 },
  { size: '3/4"', wll_alloy: 4.75, a: 51, b: 71 }
];

export const EYEBOLTS_DATA = [
  { size: 'M12', wll_carbon: 0.34, d1: 30, d2: 54, h: 54 },
  { size: 'M16', wll_carbon: 0.70, d1: 35, d2: 63, h: 62 }
];
