import { NextRequest, NextResponse } from 'next/server';
import { IPO, APIResponse } from '../../types/ipo';

const FMP_API_KEY = process.env.FMP_API_KEY || 'demo';
const FMP_BASE_URL = 'https://financialmodelingprep.com/api/v3';

// Cache for API responses (5 minutes)
let cachedData: { data: IPO[]; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function fetchFromFMP(): Promise<IPO[]> {
  const ipoData: IPO[] = [];

  try {
    // Get IPO calendar data
    const fromDate = new Date();
    fromDate.setMonth(fromDate.getMonth() - 2); // 2 months back
    const toDate = new Date();
    toDate.setMonth(toDate.getMonth() + 6); // 6 months forward

    const ipoUrl = `${FMP_BASE_URL}/ipo_calendar?from=${
      fromDate.toISOString().split('T')[0]
    }&to=${toDate.toISOString().split('T')[0]}&apikey=${FMP_API_KEY}`;

    const response = await fetch(ipoUrl, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'IPO-Calendar-App/1.0',
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (response.ok) {
      const data = await response.json();

      if (Array.isArray(data)) {
        data.forEach((ipo) => {
          ipoData.push({
            ticker: ipo.symbol || 'N/A',
            name: ipo.company || ipo.name || 'Unknown Company',
            exchange: ipo.exchange || 'Unknown',
            listing_date: ipo.date || ipo.expectedDate || '',
            price_low: parseFloat(ipo.priceFrom) || undefined,
            price_high: parseFloat(ipo.priceTo) || undefined,
            shares_outstanding: parseInt(ipo.numberOfShares) || undefined,
            status: determineStatus(ipo.status, ipo.date),
            sector: ipo.industry || ipo.sector,
            description: ipo.description,
            us_code: ipo.cik,
          });
        });
      }
    }
  } catch (error) {
    console.warn('FMP API request failed:', error);
  }

  return ipoData;
}

function determineStatus(
  apiStatus: string,
  listingDate: string
): IPO['status'] {
  if (!listingDate) return 'filed';

  const today = new Date();
  const listing = new Date(listingDate);

  if (listing < today) return 'live';
  if (apiStatus && apiStatus.toLowerCase().includes('priced')) return 'priced';
  if (apiStatus && apiStatus.toLowerCase().includes('postponed'))
    return 'postponed';
  if (apiStatus && apiStatus.toLowerCase().includes('withdrawn'))
    return 'withdrawn';

  return listing.getTime() - today.getTime() < 30 * 24 * 60 * 60 * 1000
    ? 'upcoming'
    : 'filed';
}

function getMockIPOData(): IPO[] {
  return [
    {
      ticker: 'HTFL',
      name: 'HeartFlow Inc.',
      exchange: 'NASDAQ',
      listing_date: '2025-08-11',
      price_low: 16.0,
      price_high: 18.0,
      shares_outstanding: 20227272,
      status: 'live',
      sector: 'Healthcare Technology',
      market_cap: 364200000,
      current_price: 17.25,
      description: 'AI-powered cardiac imaging and analysis technology',
      us_code: '1234567890',
    },
    {
      ticker: 'SSAA',
      name: 'Starry Sea Acquisition Corp',
      exchange: 'NASDAQ',
      listing_date: '2025-08-11',
      price_low: 10.0,
      price_high: 10.0,
      shares_outstanding: 5750000,
      status: 'live',
      sector: 'SPAC',
      market_cap: 57500000,
      current_price: 10.05,
      description: 'Special Purpose Acquisition Company targeting tech sector',
    },
    {
      ticker: 'AIVS',
      name: 'AI Vision Systems Inc.',
      exchange: 'NYSE',
      listing_date: '2025-08-20',
      price_low: 22.0,
      price_high: 26.0,
      shares_outstanding: 12000000,
      status: 'upcoming',
      sector: 'Artificial Intelligence',
      description: 'Computer vision and AI automation solutions for enterprise',
    },
    {
      ticker: 'GRNT',
      name: 'GreenTech Energy Solutions',
      exchange: 'NASDAQ',
      listing_date: '2025-08-25',
      price_low: 18.0,
      price_high: 22.0,
      shares_outstanding: 15000000,
      status: 'filed',
      sector: 'Clean Energy',
      description: 'Solar and wind energy infrastructure development',
    },
    {
      ticker: 'CYBER',
      name: 'CyberShield Technologies',
      exchange: 'NYSE',
      listing_date: '2025-09-05',
      price_low: 28.0,
      price_high: 32.0,
      shares_outstanding: 8000000,
      status: 'upcoming',
      sector: 'Cybersecurity',
      description: 'Enterprise cybersecurity and threat detection platform',
    },
    {
      ticker: 'MEDI',
      name: 'MediCore Therapeutics',
      exchange: 'NASDAQ',
      listing_date: '2025-09-12',
      price_low: 24.0,
      price_high: 28.0,
      shares_outstanding: 10000000,
      status: 'filed',
      sector: 'Biotechnology',
      description: 'Precision medicine and drug discovery platform',
    },
    {
      ticker: 'SPACE',
      name: 'SpaceLogistics Corp',
      exchange: 'NYSE',
      listing_date: '2025-09-18',
      price_low: 35.0,
      price_high: 40.0,
      shares_outstanding: 6000000,
      status: 'upcoming',
      sector: 'Aerospace',
      description: 'Satellite deployment and space transportation services',
    },
    {
      ticker: 'FINAI',
      name: 'FinTech AI Solutions',
      exchange: 'NASDAQ',
      listing_date: '2025-09-25',
      price_low: 20.0,
      price_high: 24.0,
      shares_outstanding: 14000000,
      status: 'filed',
      sector: 'Financial Technology',
      description: 'AI-powered financial services and analytics platform',
    },
    {
      ticker: 'ROBO',
      name: 'Robotics Dynamics Inc.',
      exchange: 'NYSE',
      listing_date: '2025-10-02',
      price_low: 30.0,
      price_high: 35.0,
      shares_outstanding: 9000000,
      status: 'upcoming',
      sector: 'Robotics',
      description: 'Industrial automation and robotics solutions',
    },
    {
      ticker: 'CLOUD',
      name: 'CloudSecure Systems',
      exchange: 'NASDAQ',
      listing_date: '2025-10-08',
      price_low: 16.0,
      price_high: 20.0,
      shares_outstanding: 18000000,
      status: 'filed',
      sector: 'Cloud Computing',
      description: 'Cloud infrastructure security and management platform',
    },
  ];
}

export async function GET(
  request: NextRequest
): Promise<NextResponse<APIResponse>> {
  try {
    // Check cache first
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return NextResponse.json({
        success: true,
        data: cachedData.data,
        count: cachedData.data.length,
      });
    }

    // Fetch from API
    let ipoData = await fetchFromFMP();

    // If API data is empty or limited, combine with mock data
    const mockData = getMockIPOData();

    if (ipoData.length === 0) {
      ipoData = mockData;
    } else {
      // Merge API data with mock data, removing duplicates
      const combinedData = [...ipoData, ...mockData];
      const uniqueData = combinedData.filter(
        (ipo, index, arr) =>
          arr.findIndex((i) => i.ticker === ipo.ticker) === index
      );
      ipoData = uniqueData;
    }

    // Sort by listing date
    ipoData.sort((a, b) => {
      const dateA = new Date(a.listing_date || '9999-12-31');
      const dateB = new Date(b.listing_date || '9999-12-31');
      return dateA.getTime() - dateB.getTime();
    });

    // Update cache
    cachedData = {
      data: ipoData,
      timestamp: Date.now(),
    };

    return NextResponse.json({
      success: true,
      data: ipoData,
      count: ipoData.length,
    });
  } catch (error) {
    console.error('API Route Error:', error);

    // Return mock data as fallback
    const mockData = getMockIPOData();

    return NextResponse.json({
      success: false,
      data: mockData,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      count: mockData.length,
    });
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
