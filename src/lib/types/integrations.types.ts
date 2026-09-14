/**
 * Strict TypeScript types for the Integrations Hub and external service feeds.
 */

export interface IntegrationFeedLink {
  id: string;
  title: string;
  description: string;
  format: 'XML' | 'JSON' | 'XLSX';
  path: string; // relative path e.g. "/api/feed/monomarket"
  recommendedFrequency?: string;
  docsUrl?: string;
}

export interface IntegrationCardConfig {
  id: string;
  name: string;
  badge?: string;
  badgeVariant?: 'default' | 'success' | 'warning' | 'info';
  description: string;
  iconName: 'monomarket' | 'prom' | 'google' | 'rozetka' | 'custom';
  status: 'active' | 'configured' | 'action_required';
  feeds?: IntegrationFeedLink[];
  notes?: string[];
  whitelistIps?: string[];
}

export interface MonomarketPriceItem {
  code: string;
  price: number;
  old_price: number | null;
  availability: boolean;
  stock: number;
  warehouses?: Array<{ id: string; stock: number }> | null;
  warranty_type: 'manufacturer' | 'merchant' | 'no';
  warranty_period: number;
  max_pay_in_parts: number;
  days_to_dispatch: number;
}

export interface MonomarketPriceFeedResponse {
  updatedAt: string;
  total: number;
  data: MonomarketPriceItem[];
}

export interface MonomarketBackendStatus {
  totalInStock: number;
  eligibleWithBarcode: number;
  excludedMissingBarcode: number;
  excludedMissingStock: number;
  lastGeneratedAt: string | null;
}
