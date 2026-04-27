export type Status = 'todo' | 'sent' | 'relance' | 'interview' | 'offer' | 'rejected';

export interface Contact {
  name: string;
  role: string;
  email: string;
  phone: string;
}

export interface Application {
  id: string;
  company: string;
  logo: string;
  logoColor: string;
  role: string;
  location: string;
  remote: string;
  salary: string;
  rhythm: string;
  source: string;
  sourceUrl: string;
  contact: Contact;
  status: Status;
  stepIndex: number;
  interest: number;
  favorite: boolean;
  urgent: boolean;
  sentAt: string | null;
  lastActionAt: string | null;
  interviewAt: string | null;
  nextAction: string;
  nextActionDue: string | null;
  notes: string;
  cv: string;
  letter: string;
  tags: string[];
}

export interface StatusConfig {
  id: Status;
  label: string;
  short: string;
  icon: string;
  gradient: string;
  solid: string;
  text: string;
}

export interface Tweaks {
  accent: 'sunset' | 'forest' | 'berry' | 'mono';
  density: 'compact' | 'cozy' | 'airy';
  showStats: boolean;
  cardSize: 'normal' | 'large';
  colorMode: 'light' | 'dark';
}

export interface AccentPalette {
  a: string;
  b: string;
  c: string;
  name: string;
}

export interface Freshness {
  level: 'hot' | 'warm' | 'cool' | 'cold';
  label: string;
}

export interface ConfettiPiece {
  id: number;
  left: number;
  delay: number;
  tx: number;
  color: string;
}
