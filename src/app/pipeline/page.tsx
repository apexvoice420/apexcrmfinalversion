'use client';

import { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/sidebar';
import Link from 'next/link';
import { 
  Plus, Phone, Mail, Building, Clock, TrendingUp,
  AlertCircle, CheckCircle, XCircle, Calendar,
  GripVertical, ExternalLink, Star, MapPin,
  Filter, Search, RefreshCw, Loader2, Sparkles
} from 'lucide-react';
import { API_URL } from '@/lib/config';

const STAGES = [
  { id: 'New Lead', label: 'New Lead', color: 'blue', icon: Plus },
  { id: 'Contacted', label: 'Contacted', color: 'yellow', icon: Mail },
  { id: 'Qualified', label: 'Qualified', color: 'purple', icon: CheckCircle },
  { id: 'Demo', label: 'Demo Scheduled', color: 'indigo', icon: Calendar },
  { id: 'Won', label: 'Closed Won', color: 'green', icon: CheckCircle },
  { id: 'Lost', label: 'Lost', color: 'red', icon: XCircle },
];

const STAGE_COLORS: Record<string, { bg: string; border: string; text: string; header: string }> = {
  'New Lead': { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', header: 'bg-blue-500' },
  'Contacted': { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', header: 'bg-yellow-500' },
  'Qualified': { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', header: 'bg-purple-500' },
  'Demo': { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', header: 'bg-indigo-500' },
  'Won': { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', header: 'bg-green-500' },
  'Lost': { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', header: 'bg-red-500' },
};

interface Lead {
  id: number;
  business_name: string;
  phone: string;
  email?: string;
  city?: string;
  state?: string;
  rating?: number;
  reviews?: number;
  industry?: string;
  status: string;
  source?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
  email_sent?: boolean;
}

interface DragState {
  leadId: number | null;
  fromStage: string | null;
}

export default function PipelinePage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [dragState, setDragState] = useState<DragState>({ leadId: null, fromStage: null });
  const [updating, setUpdating] = useState(false);
  const [stats, setStats] = useState({ total: 0, conversionRate: 0, avgTimeInPipeline: 0 });

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
        calculateStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (leadsData: Lead[]) => {
    const total = leadsData.length;
    const won = leadsData.filter(l => l.status === 'Won').length;
    const qualified = leadsData.filter(l => ['Qualified', 'Demo', 'Won'].includes(l.status)).length;
    
    setStats({
      total,
      conversionRate: qualified > 0 ? Math.round((won / qualified) * 100) : 0,
      avgTimeInPipeline: 5 // placeholder
    });
  };

  const updateLeadStatus = async (leadId: number, newStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`${API_URL}/api/leads/${leadId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setLeads(prev => prev.map(l => 
          l.id === leadId ? { ...l, status: newStatus } : l
        ));
        calculateStats(leads.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
      }
    } catch (error) {
      console.error('Failed to update lead:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleDragStart = (leadId: number, stage: string) => {
    setDragState({ leadId, fromStage: stage });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStage: string) => {
    e.preventDefault();
    if (dragState.leadId && dragState.fromStage !== targetStage) {
      updateLeadStatus(dragState.leadId, targetStage);
    }
    setDragState({ leadId: null, fromStage: null });
  };

  const getLeadsByStage = (stage: string): Lead[] => {
    return leads.filter(lead => {
      const matchesSearch = 
        lead.business_name?.toLowerCase().includes(search.toLowerCase()) ||
        lead.phone?.includes(search) ||
        lead.email?.toLowerCase().includes(search.toLowerCase());
      const matchesIndustry = industryFilter === 'all' || lead.industry === industryFilter;
      return lead.status === stage && matchesSearch && matchesIndustry;
    });
  };

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const hours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const industries = [...new Set(leads.map(l => l.industry).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pipeline</h1>
            <p className="text-gray-500 mt-1">Drag leads through stages to track progress</p>
          </div>
          <button 
            onClick={fetchLeads}
            disabled={loading}
            className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Leads</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Building size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Conversion Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.conversionRate}%</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <TrendingUp size={24} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">In Pipeline</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {leads.filter(l => !['Won', 'Lost'].includes(l.status)).length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <Clock size={24} className="text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Closed Won</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {leads.filter(l => l.status === 'Won').length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <CheckCircle size={24} className="text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6 flex gap-4 items-center">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, phone, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Industries</option>
            {industries.map(ind => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
          <Link 
            href="/leads"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={18} />
            Add Leads
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={40} className="animate-spin text-blue-600" />
          </div>
        )}

        {/* Kanban Board */}
        {!loading && (
          <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: 'calc(100vh - 380px)' }}>
            {STAGES.map((stage) => {
              const stageLeads = getLeadsByStage(stage.id);
              const colors = STAGE_COLORS[stage.id];
              const Icon = stage.icon;

              return (
                <div
                  key={stage.id}
                  className="flex-shrink-0 w-80"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, stage.id)}
                >
                  {/* Stage Header */}
                  <div className={`${colors.header} text-white rounded-t-xl px-4 py-3 flex items-center justify-between`}>
                    <div className="flex items-center gap-2">
                      <Icon size={18} />
                      <span className="font-semibold">{stage.label}</span>
                    </div>
                    <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-sm font-medium">
                      {stageLeads.length}
                    </span>
                  </div>

                  {/* Stage Cards */}
                  <div className={`${colors.bg} ${colors.border} border border-t-0 rounded-b-xl p-3 min-h-[400px] space-y-3`}>
                    {stageLeads.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        <p className="text-sm">No leads</p>
                      </div>
                    ) : (
                      stageLeads.map((lead) => (
                        <div
                          key={lead.id}
                          draggable
                          onDragStart={() => handleDragStart(lead.id, lead.status)}
                          className="bg-white rounded-xl border border-gray-200 p-4 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
                        >
                          {/* Card Header */}
                          <div className="flex items-start justify-between mb-2">
                            <Link 
                              href={`/leads/${lead.id}`}
                              className="font-semibold text-gray-900 hover:text-blue-600 line-clamp-1"
                            >
                              {lead.business_name}
                            </Link>
                            <GripVertical size={16} className="text-gray-300 flex-shrink-0 ml-2" />
                          </div>

                          {/* Industry Tag */}
                          {lead.industry && (
                            <span className="inline-block text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full mb-2">
                              {lead.industry}
                            </span>
                          )}

                          {/* Contact Info */}
                          <div className="space-y-1 mb-3">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone size={14} />
                              <a href={`tel:${lead.phone}`} className="hover:text-blue-600">
                                {lead.phone}
                              </a>
                            </div>
                            {lead.email && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Mail size={14} />
                                <a href={`mailto:${lead.email}`} className="hover:text-blue-600 truncate">
                                  {lead.email}
                                </a>
                              </div>
                            )}
                            {lead.city && (
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <MapPin size={14} />
                                <span>{lead.city}{lead.state ? `, ${lead.state}` : ''}</span>
                              </div>
                            )}
                          </div>

                          {/* Rating & Time */}
                          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            {lead.rating && (
                              <span className="flex items-center gap-1 text-sm text-gray-600">
                                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                {typeof lead.rating === 'number' ? lead.rating.toFixed(1) : lead.rating}
                              </span>
                            )}
                            <span className="text-xs text-gray-400">
                              {formatTimeAgo(lead.created_at)}
                            </span>
                          </div>

                          {/* Email Sent Badge */}
                          {lead.email_sent && (
                            <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                              <Sparkles size={12} />
                              Email sent
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Quick Actions Footer */}
        <div className="mt-6 bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Quick Actions:</span>
              <Link 
                href="/agent-e" 
                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
              >
                <Sparkles size={14} />
                Send Emails (Agent E)
              </Link>
              <Link 
                href="/leads" 
                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
              >
                <MapPin size={14} />
                Scrape New Leads
              </Link>
            </div>
            <div className="text-sm text-gray-400">
              💡 Drag leads between columns to update their status
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
