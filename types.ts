
export interface Contact {
  number: string;
  name?: string;
  status: 'pending' | 'sending' | 'sent' | 'failed';
  error?: string;
}

export interface CampaignStats {
  total: number;
  sent: number;
  failed: number;
  pending: number;
}

export enum AppView {
  DASHBOARD = 'dashboard',
  CAMPAIGNS = 'campaigns',
  CONTACTS = 'contacts',
  SETTINGS = 'settings'
}

export interface MessageConfig {
  text: string;
  aiEnhanced: boolean;
}
