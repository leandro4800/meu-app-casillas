
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
  { name: 'P - Aços Carbono', category: 'A516 Gr 70 / ASTM A36', hardnessHb: '160 HB', hardnessValue: 160, strength: '50', tensileStrength: 515, yieldStrength: 260, carbonContent: '0.25%', usinability: 85, color: '#3b82f6' },
  { name: 'M - Inox/Duplex', category: 'Super Duplex F55', hardnessHb: '250 HB', hardnessValue: 250, strength: '85', tensileStrength: 850, yieldStrength: 550, carbonContent: '0.03%', usinability: 35, color: '#eab308' },
  { name: 'S - Super Ligas', category: 'Inconel 625 (Overlay)', hardnessHb: '320 HB', hardnessValue: 320, strength: '100', tensileStrength: 950, yieldStrength: 450, carbonContent: '0%', usinability: 18, color: '#f97316' },
  { name: 'H - Temperados', category: 'AISI 4140 (Q&T)', hardnessHb: '35 HRC', hardnessValue: 330, strength: '110', tensileStrength: 1050, yieldStrength: 900, carbonContent: '0.40%', usinability: 25, color: '#64748b' }
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
