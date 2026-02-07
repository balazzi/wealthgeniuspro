
export type Language = 'EN' | 'ES' | 'FR' | 'ZH' | 'AR' | 'DE' | 'IT' | 'PT' | 'JA' | 'KO';

export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  aiScore: number;
  rating: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell';
}

export interface MarketIndex {
  name: string;
  value: number;
  change: number;
  percent: number;
}

export interface EducationalModule {
  id: string;
  title: string;
  category: 'Insurance' | 'Retirement' | 'Trading' | 'Wealth';
  description: string;
  duration: string;
}
