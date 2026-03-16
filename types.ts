
export type Screen = 
  | 'welcome' | 'login' | 'home' | 'machining_params' 
  | 'consultant' | 'trigonometry' | 'profile' | 'ai_agent' 
  | 'checkout' | 'table_threads' | 'table_tolerances' | 'materials'
  | 'tool_library' | 'calc_weight' | 'calc_gears' | 'calc_divider' | 'verifier' | 'micrometer' | 'table_conversion'
  | 'glossary' | 'material_comparison' | 'table_shackles' | 'table_arc'
  | 'ai_suite' | 'voice_consultant' | 'media_lab' | 'drawing_analysis' | 'hailtools_voice' | 'machining_optimizer';

export type Language = 'pt_BR' | 'en_US' | 'fr_QC' | 'pt_PT';

export interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  plan: 'free' | 'monthly' | 'annual';
  subscriptionDate?: string;
  expiryDate?: string;
  isDev: boolean;
  biometricEnabled?: boolean;
  company?: string;
  role?: string;
  sector?: string;
  phone?: string;
  sessionId?: string;
  language?: Language;
}

export interface ThreadData {
  nominal: string;
  pitch: string;
  drill: string;
  type: string;
  extDia?: string;
  tpi?: string;
}

export interface MaterialData {
  name: string;
  category: string;
  hardnessHb: string;
  hardnessValue: number;
  strength: string;
  tensileStrength: number;
  yieldStrength: number;
  carbonContent: string;
  usinability: number;
  color: string;
  chemicalComposition?: string;
  typicalApps?: string;
  thermalTreatment?: string;
  weldingInfo?: string;
}

export interface ToolInsert {
  id: string;
  code: string;
  grade: string;
  coating: string;
  geometry: string;
  geometryDesc: string;
  category: 'Torneamento' | 'Fresamento' | 'Furação' | 'Cortes/Roscas' | 'Corte e Canal' | 'Rosqueamento' | 'Roscamento' | 'Adaptadores' | 'Mandrilamento';
  isoCategories: string[];
  applicationPrimary: string;
  applicationSecondary?: string;
  parameters: {
    vc: number;
    vcRange: [number, number];
    fn: number;
    fnRange: [number, number];
    ap: number;
    apRange: [number, number];
  };
  image: string;
}
