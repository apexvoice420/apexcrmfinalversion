'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/sidebar';
import { Search, Plus, Phone, Mail, MoreVertical, Download, Loader2, MapPin, Wrench, Star, ExternalLink } from 'lucide-react';
import { API_URL } from '@/lib/config';
import Link from 'next/link';

interface Lead {
  id: number;
  business_name: string;
  phone: string;
  email?: string;
  city?: string;
  state?: string;
  rating?: number;
  reviews?: number;
  website?: string;
  status: string;
  source?: string;
  created_at: string;
}

const BUSINESS_TYPES = [
  { value: 'roofing', label: 'Roofing', icon: '🏠' },
  { value: 'plumber', label: 'Plumber', icon: '🔧' },
  { value: 'hvac contractor', label: 'HVAC', icon: '❄️' },
  { value: 'electrician', label: 'Electrician', icon: '⚡' },
  { value: 'landscaping', label: 'Landscaping', icon: '🌳' },
];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Scrape modal state
  const [showScraper, setShowScraper] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [scrapeResult, setScrapeResult] = useState<{found: number, saved: number} | null>(null);
  const [scrapeForm, setScrapeForm] = useState({
    city: '',
    state: 'FL',
    type: 'roofing',
    maxResults: 20
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/leads`);
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScrape = async () => {
    setScraping(true);
    setScrapeResult(null);
    
    try {
      const res = await fetch(`${API_URL}/scrape`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scrapeForm)
      });

      const data = await res.json();
      
      if (data.success) {
        setScrapeResult({ found: data.found, saved: data.saved });
        fetchLeads(); // Refresh leads
      } else {
        alert('Scraping failed: ' + (data.error || 'Unknown error'));
      }
    } catch (error: any) {
      alert('Scraping failed: ' + error.message);
    } finally {
      setScraping(false);
    }
  };

  const statusColors: Record<string, string> = {
    'New Lead': 'bg-blue-50 text-blue-600 border-blue-100',
    'Contacted': 'bg-yellow-50 text-yellow-600 border-yellow-100',
    'Qualified': 'bg-purple-50 text-purple-600 border-purple-100',
    'Booked': 'bg-green-50 text-green-600 border-green-100',
    'Lost': 'bg-red-50 text-red-600 border-red-100',
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = 
      lead.business_name?.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone?.includes(search) ||
      lead.city?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
            <p className="text-gray-500 mt-1">{leads.length} leads in your pipeline</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowScraper(true)}
              className="border border-blue-600 text-blue-600 px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2"
            >
              <MapPin size={18} />
              Scrape Leads
            </button>
            <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Plus size={18} />
              Add Lead
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6 flex gap-4 items-center">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, phone, or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="New Lead">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Booked">Booked</option>
            <option value="Lost">Lost</option>
          </select>
          <button className="border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 flex items-center gap-2">
            <Download size={18} />
            Export
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={32} className="animate-spin text-blue-600" />
          </div>
        )}

        {/* Leads Table */}
        {!loading && (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {filteredLeads.length === 0 ? (
              <div className="text-center py-12">
                <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="font-semibold text-gray-900">No leads yet</h3>
                <p className="text-sm text-gray-500 mt-1 mb-4">Scrape Google Maps to find local businesses</p>
                <button 
                  onClick={() => setShowScraper(true)}
                  className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  Start Scraping
                </button>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Business</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Phone</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Email</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Location</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Rating</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                      <td className="px-6 py-4">
                        <Link href={`/leads/${lead.id}`} className="block">
                          <div className="font-medium text-gray-900 hover:text-blue-600">{lead.business_name}</div>
                          {lead.website && (
                            <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                              <ExternalLink size={10} />
                              {new URL(lead.website).hostname}
                            </div>
                          )}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <a href={`tel:${lead.phone}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600">
                          <Phone size={14} />
                          {lead.phone}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        {lead.email ? (
                          <a href={`mailto:${lead.email}`} className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                            <Mail size={14} />
                            <span className="truncate max-w-[150px]">{lead.email}</span>
                          </a>
                        ) : (
                          <span className="text-sm text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {lead.city}{lead.state ? `, ${lead.state}` : ''}
                      </td>
                      <td className="px-6 py-4">
                        {lead.rating ? (
                          <span className="flex items-center gap-1 text-sm">
                            <Star size={14} className="fill-yellow-400 text-yellow-400" />
                            {typeof lead.rating === 'string' ? parseFloat(lead.rating).toFixed(1) : lead.rating.toFixed(1)}
                            {lead.reviews && (
                              <span className="text-xs text-gray-400">({lead.reviews})</span>
                            )}
                          </span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                          statusColors[lead.status] || 'bg-gray-50 text-gray-600 border-gray-100'
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/leads/${lead.id}`} className="p-2 hover:bg-gray-100 rounded-lg inline-block text-sm text-blue-600">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>

      {/* Scraper Modal */}
      {showScraper && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Wrench size={24} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Scrape Google Maps</h2>
                <p className="text-sm text-gray-500">Find local businesses in your area</p>
              </div>
            </div>

            {scrapeResult ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                <p className="text-green-700 font-medium">
                  ✅ Found {scrapeResult.found} leads, saved {scrapeResult.saved} new ones
                </p>
              </div>
            ) : null}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  value={scrapeForm.city}
                  onChange={(e) => setScrapeForm({...scrapeForm, city: e.target.value})}
                  placeholder="Daytona Beach"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  value={scrapeForm.state}
                  onChange={(e) => setScrapeForm({...scrapeForm, state: e.target.value.toUpperCase()})}
                  placeholder="FL"
                  maxLength={2}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {BUSINESS_TYPES.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setScrapeForm({...scrapeForm, type: type.value})}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        scrapeForm.type === type.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="mr-2">{type.icon}</span>
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Results</label>
                <select
                  value={scrapeForm.maxResults}
                  onChange={(e) => setScrapeForm({...scrapeForm, maxResults: parseInt(e.target.value)})}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={10}>10 leads</option>
                  <option value={20}>20 leads</option>
                  <option value={50}>50 leads</option>
                  <option value={100}>100 leads</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowScraper(false);
                  setScrapeResult(null);
                }}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleScrape}
                disabled={scraping || !scrapeForm.city}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {scraping ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Scraping...
                  </>
                ) : (
                  'Start Scraping'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
