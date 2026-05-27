export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  category: string;
  creditSelected: number;
  termSelected: number;
  estimatedInstallmentFull: number;
  estimatedInstallmentReduced: number;
  useEmbeddedBid: boolean;
  date: string;
  timestamp?: number;
}

export interface Gestor {
  name: string;
  phone: string;
  whatsappUrl: string;
  email: string;
  role: string;
  experience: string;
  description: string;
  specialty: string[];
  avatarUrl: string;
  id: string;
}

export interface Article {
  id: string;
  title: string;
  category: string;
  readTime: string;
  summary: string;
  content: string[];
  iconName: 'TrendingUp' | 'Home' | 'Car' | 'Award';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
}

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  time: string;
  isNew: boolean;
  category: 'opportunity' | 'news' | 'alert';
}

export interface SimConfig {
  minCredit: number;
  maxCredit: number;
  stepCredit: number;
  defaultCredit: number;
  terms: number[];
  defaultTerm: number;
  adminTax: number; // e.g. 0.15 representing 15%
  reserveTax: number; // e.g. 0.01 representing 1%
}
