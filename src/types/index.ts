export interface ChallengePlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  accountSize: number;
  maxDrawdown: number;
  dailyDrawdown: number;
  profitTarget: number;
  duration: number;
  features: string[];
  popular?: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface RiskRule {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface StatItem {
  label: string;
  value: string;
  suffix?: string;
}
