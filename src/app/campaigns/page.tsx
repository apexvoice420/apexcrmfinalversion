'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/sidebar';
import { 
  Megaphone, Plus, Loader2, Mail, Users, TrendingUp,
  Play, Pause, Edit, Trash2, AlertCircle, CheckCircle,
  Calendar, Target, BarChart3
} from 'lucide-react';
import { API_URL } from '@/lib/config';

interface Campaign {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  leads_count?: number;
  emails_sent?: number;
  open_rate?: number;
  reply_rate?: number;
  created_at: string;
  started_at?: string;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`${API_URL}/api/campaigns`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error('Failed to fetch campaigns');
      
      const data = await res.json();
      setCampaigns(data.campaigns || data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createCampaign = async () => {
    if (!newCampaignName.trim()) return;
    
    setCreating(true);
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`${API_URL}/api/campaigns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newCampaignName })
      });
      
      if (!res.ok) throw new Error('Failed to create campaign');
      
      const newCampaign = await res.json();
      setCampaigns(prev => [newCampaign, ...prev]);
      setShowCreate(false);
      setNewCampaignName('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play size={16} className="text-green-500" />;
      case 'paused': return <Pause size={16} className="text-yellow-500" />;
      case 'completed': return <CheckCircle size={16} className="text-blue-500" />;
      default: return <Edit size={16} className="text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'paused': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
            <p className="text-gray-500 mt-1">Email outreach campaigns powered by Agent E</p>
          </div>
          <button 
            onClick={() => setShowCreate(true)}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            New Campaign
          </button>
        </div>

        {/* Create Campaign Modal */}
        {showCreate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Campaign</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Campaign Name
                </label>
                <input
                  type="text"
                  value={newCampaignName}
                  onChange={(e) => setNewCampaignName(e.target.value)}
                  placeholder="e.g., Florida Roofers Q1 2026"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCreate(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={createCampaign}
                  disabled={creating || !newCampaignName.trim()}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {creating && <Loader2 size={18} className="animate-spin" />}
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={32} className="animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Loading campaigns...</span>
          </div>
        )}

        {/* Campaigns Grid */}
        {!loading && (
          <div className="grid lg:grid-cols-2 gap-6">
            {campaigns.map((campaign) => (
              <div 
                key={campaign.id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Campaign Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <Megaphone size={24} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{campaign.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <Calendar size={14} />
                          <span>Created {formatDate(campaign.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                      {getStatusIcon(campaign.status)}
                      {campaign.status}
                    </span>
                  </div>
                </div>

                {/* Campaign Stats */}
                <div className="p-6 bg-gray-50 grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 uppercase font-semibold">Leads</div>
                    <div className="font-bold text-xl text-gray-900 mt-1">{campaign.leads_count || 0}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase font-semibold">Sent</div>
                    <div className="font-bold text-xl text-gray-900 mt-1">{campaign.emails_sent || 0}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase font-semibold">Open Rate</div>
                    <div className="font-bold text-xl text-gray-900 mt-1">
                      {campaign.open_rate ? `${(campaign.open_rate * 100).toFixed(1)}%` : '-'}
                    </div>
                  </div>
                </div>

                {/* Campaign Actions */}
                <div className="p-4 flex gap-2">
                  {campaign.status === 'draft' && (
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                      <Play size={16} />
                      Launch
                    </button>
                  )}
                  {campaign.status === 'active' && (
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium">
                      <Pause size={16} />
                      Pause
                    </button>
                  )}
                  <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                    <BarChart3 size={16} />
                  </button>
                  <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                    <Edit size={16} />
                  </button>
                </div>
              </div>
            ))}

            {/* Create New Campaign Card */}
            <div 
              onClick={() => setShowCreate(true)}
              className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/50 transition-all min-h-[280px]"
            >
              <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
                <Plus size={28} className="text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-900">Create New Campaign</h3>
              <p className="text-sm text-gray-500 mt-1">Start a new email outreach sequence</p>
            </div>

            {campaigns.length === 0 && (
              <div className="hidden" /> // Placeholder for grid layout
            )}
          </div>
        )}

        {/* Getting Started Guide */}
        {!loading && campaigns.length === 0 && (
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Target size={24} className="text-blue-600" />
              Getting Started with Campaigns
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Create a Campaign</h3>
                  <p className="text-sm text-gray-600 mt-1">Name your campaign (e.g., "Florida Roofers Q1 2026")</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Add Leads</h3>
                  <p className="text-sm text-gray-600 mt-1">Import leads from your lead list or upload a CSV</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">3</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Launch</h3>
                  <p className="text-sm text-gray-600 mt-1">Agent E will send personalized emails automatically</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
