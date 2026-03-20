export type Screen = 
  | 'welcome' 
  | 'home' 
  | 'ai_agent' 
  | 'machining_params' 
  | 'tolerance_tables' 
  | 'verifier'
  | 'checkout' 
  | 'profile'
  | 'materials'
  | 'thread_tables'
  | 'glossary'
  | 'conversion'
  | 'weight_calc'
  | 'micrometer'
  | 'trigonometry'
  | 'gear_calc'
  | 'divider_calc'
  | 'arc_calc'
  | 'shackles'
  | 'drawing_analysis'
  | 'media_lab';

export interface User {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
  photoUrl?: string;
}

export interface ToleranceValue {
  upper: number;
  lower: number;
}

export interface ToleranceRange {
  min: number;
  max: number;
  values: Record<string, ToleranceValue>;
}
