export interface IPO {
  ticker: string;
  name: string;
  exchange: string;
  listing_date: string;
  price_low?: number;
  price_high?: number;
  shares_outstanding?: number;
  status: 'upcoming' | 'filed' | 'live' | 'postponed' | 'withdrawn' | 'priced';
  us_code?: string;
  sector?: string;
  market_cap?: number;
  current_price?: number;
  description?: string;
}

export interface APIResponse {
  success: boolean;
  data: IPO[];
  error?: string;
  count: number;
}

export interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  ipos: IPO[];
}

export interface TabConfig {
  id: string;
  label: string;
  icon: React.ReactNode;
  count: number;
}
