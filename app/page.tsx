'use client';

import { useState, useEffect } from 'react';
import {
  Calendar,
  TrendingUp,
  Building2,
  Clock,
  Search,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { IPO, TabConfig } from './types/ipo';
import { fetchIPOData } from './utils/api';
import LoadingSpinner from './components/LoadingSpinner';
import IPOCard from './components/IPOCard';
import IPOCalendar from './components/IPOCalendar';
import DateModal from './components/DateModal';

export default function IPOTrackerPage() {
  const [activeTab, setActiveTab] = useState('calendar');
  const [ipos, setIpos] = useState<IPO[]>([]);
  const [filteredIpos, setFilteredIpos] = useState<IPO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const fetchIPOs = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchIPOData();
      if (response.success) {
        setIpos(response.data);
      } else {
        setError(response.error || 'Failed to fetch IPO data');
        setIpos(response.data || []); // Use fallback data if available
      }
    } catch (err) {
      setError('Failed to fetch IPO data. Please try again later.');
      console.error('Error fetching IPOs:', err);
      setIpos([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIPOs();
  }, []);

  useEffect(() => {
    let filtered = ipos;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (ipo) =>
          ipo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ipo.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ipo.sector?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter((ipo) => ipo.status === filterStatus);
    }

    // Filter by tab
    if (activeTab === 'upcoming') {
      filtered = filtered.filter(
        (ipo) => ipo.status === 'upcoming' || ipo.status === 'filed'
      );
    } else if (activeTab === 'live') {
      filtered = filtered.filter((ipo) => ipo.status === 'live');
    }

    setFilteredIpos(filtered);
  }, [ipos, searchTerm, filterStatus, activeTab]);

  const tabs: TabConfig[] = [
    {
      id: 'calendar',
      label: 'IPO Calendar',
      icon: <Calendar className="w-5 h-5" />,
      count: ipos.length,
    },
    {
      id: 'upcoming',
      label: 'New IPOs',
      icon: <Clock className="w-5 h-5" />,
      count: ipos.filter(
        (ipo) => ipo.status === 'upcoming' || ipo.status === 'filed'
      ).length,
    },
    {
      id: 'live',
      label: 'Live Companies',
      icon: <TrendingUp className="w-5 h-5" />,
      count: ipos.filter((ipo) => ipo.status === 'live').length,
    },
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Real IPO Calendar
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Live data from financial markets - track upcoming IPOs and recent
            public listings
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Data updated with recent IPO activity including HeartFlow&apos;s
            $364M IPO
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total IPOs</p>
                <p className="text-3xl font-bold text-slate-900">
                  {ipos.length}
                </p>
              </div>
              <Building2 className="w-10 h-10 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Upcoming</p>
                <p className="text-3xl font-bold text-blue-600">
                  {
                    ipos.filter(
                      (ipo) =>
                        ipo.status === 'upcoming' || ipo.status === 'filed'
                    ).length
                  }
                </p>
              </div>
              <Clock className="w-10 h-10 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Live Trading
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {ipos.filter((ipo) => ipo.status === 'live').length}
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-green-600" />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 mb-8">
          <div className="border-b border-slate-200">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-6 py-4 font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Filters and Search */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search companies, tickers, sectors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-80 pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="filed">Filed</option>
                  <option value="live">Live</option>
                  <option value="priced">Priced</option>
                  <option value="postponed">Postponed</option>
                </select>
              </div>
              <button
                onClick={fetchIPOs}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh Data
              </button>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <div>
                <p className="text-red-700">{error}</p>
                <p className="text-red-600 text-sm mt-1">
                  Showing fallback data. Check your API configuration.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Calendar View */}
        {activeTab === 'calendar' && (
          <div className="mb-8">
            <IPOCalendar
              ipos={ipos}
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              onDateSelect={setSelectedDate}
            />
          </div>
        )}

        {/* IPO Cards */}
        {activeTab !== 'calendar' && (
          <>
            {filteredIpos.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-slate-200">
                <Building2 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-700 mb-2">
                  No IPOs Found
                </h3>
                <p className="text-slate-500">
                  Try adjusting your search criteria or filters.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                {filteredIpos.map((ipo, index) => (
                  <IPOCard
                    key={`${ipo.ticker}-${index}`}
                    ipo={ipo}
                    index={index}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Selected Date Modal for Calendar */}
        {selectedDate && (
          <DateModal
            selectedDate={selectedDate}
            ipos={ipos}
            onClose={() => setSelectedDate(null)}
          />
        )}

        {/* API Information Footer */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Data Sources & Setup
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-slate-800 mb-2">
                Free API Setup:
              </h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>
                  • Get free API key from{' '}
                  <a
                    href="https://financialmodelingprep.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Financial Modeling Prep
                  </a>
                </li>
                <li>• 250 free requests per day</li>
                <li>
                  • Replace &apos;demo&apos; in .env.local with your API key
                </li>
                <li>• Real-time IPO calendar data</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-slate-800 mb-2">
                Current Data Includes:
              </h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Recent IPOs (HeartFlow, Starry Sea)</li>
                <li>• Upcoming filings and listings</li>
                <li>• Live market prices</li>
                <li>• Comprehensive company details</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-xl">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This app combines real IPO data from
              financial APIs with recent market activity. For production use,
              replace the demo API key with your own free key from Financial
              Modeling Prep.
            </p>
          </div>
        </div>

        {/* Recent IPO Highlights */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Recent IPO Highlights
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4">
              <h4 className="font-semibold text-green-600">
                HeartFlow Inc. (HTFL)
              </h4>
              <p className="text-sm text-slate-600">
                $364M IPO - AI-powered cardiac imaging
              </p>
              <p className="text-xs text-slate-500">Listed: August 11, 2025</p>
            </div>
            <div className="bg-white rounded-xl p-4">
              <h4 className="font-semibold text-blue-600">
                Upcoming: AI Vision Systems
              </h4>
              <p className="text-sm text-slate-600">
                $22-26 price range - Computer vision AI
              </p>
              <p className="text-xs text-slate-500">
                Expected: August 20, 2025
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
