import { APIResponse } from '../types/ipo';

export async function fetchIPOData(): Promise<APIResponse> {
  try {
    const response = await fetch('/api/ipos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Disable cache for development, enable for production
      cache:
        process.env.NODE_ENV === 'development' ? 'no-store' : 'force-cache',
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: APIResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch IPO data:', error);
    throw error;
  }
}

export function formatDate(dateString: string): string {
  if (!dateString) return 'TBD';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'Invalid Date';
  }
}

export function formatPrice(price: number): string {
  if (!price || isNaN(price)) return 'TBD';
  return `$${price.toFixed(2)}`;
}

export function formatMarketCap(cap: number): string {
  if (!cap) return 'TBD';
  if (cap >= 1000000000) return `$${(cap / 1000000000).toFixed(1)}B`;
  return `$${(cap / 1000000).toFixed(0)}M`;
}

export function formatShares(shares: number): string {
  if (!shares || isNaN(shares)) return 'TBD';
  if (shares >= 1000000) return `${(shares / 1000000).toFixed(1)}M`;
  return shares.toLocaleString();
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'upcoming':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'filed':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'live':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'priced':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'postponed':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'withdrawn':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}
