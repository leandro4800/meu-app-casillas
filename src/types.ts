export type Screen = 
  | 'welcome'
  | 'home'
  | 'ai_agent'
  | 'machining_params'
  | 'materials'
  | 'glossary'
  | 'conversion'
  | 'weight_calc'
  | 'thread_tables'
  | 'tolerance_tables'
  | 'micrometer'
  | 'trigonometry'
  | 'gear_calc'
  | 'divider_calc'
  | 'arc_calc'
  | 'shackles'
  | 'drawing_analysis'
  | 'media_lab'
  | 'profile'
  | 'checkout'
  | 'verifier';

export interface User {
  id: string;
  email: string;
  name?: string;
  photoUrl?: string;
  expiryDate?: string;
}
