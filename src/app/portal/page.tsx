'use client';

import { useState, useEffect } from 'react';
import { 
  Phone, Mail, Clock, MessageSquare, Save, 
  Check, AlertCircle, Bot, BarChart3, Calendar,
  Volume2, FileText, Settings
} from 'lucide-react';
import { API_URL } from '@/lib/config';

interface Client {
  id: number;
  business_name: string;
  vapi_phone: string;
  vapi_agent_id: string;
  greeting: string;
  voice_style: string;
  services: string;
  faq: string;
  business_hours: string;
  contact_phone: string;
  contact_email: string;
}

interface CallStats {
  totalCalls: number;
  avgDuration: string;
  missedCalls: number;
  bookingsCreated: number;
}

export default function ClientPortal() {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('settings');
  const [callStats, setCallStats] = useState<CallStats>({
    totalCalls: 0,
    avgDuration: '0:00',
    missedCalls: 0,
    bookingsCreated: 0
  });

  const [formData, setFormData] = useState({
    greeting: '',
    voiceStyle: 'professional',
    services: '',
    faq: '',
    businessHours: '24/7',
    escalationPhone: '',
  });

  useEffect(() => {
    // In production, get client ID from URL token or session
    // For demo, we'll fetch the first client
    fetchClient();
  }, []);

  const fetchClient = async () => {
    try {
      // Get token from URL params
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token') || localStorage.getItem('portal_token');
      
      if (!token) {
        setError('No access token. Please use the link provided to you.');
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/api/portal/client?token=${token}`);
      
      if (res.ok) {
        const data = await res.json();
        setClient(data.client);
        setCallStats(data.stats || callStats);
        setFormData({
          greeting: data.client.greeting || '',
          voiceStyle: data.client.voice_style || 'professional',
          services: data.client.services || '',
          faq: data.client.faq || '',
          businessHours: data.client.business_hours || '24/7',
          escalationPhone: data.client.escalation_phone || '',
        });
      } else {
        setError('Invalid or expired access token.');
      }
    } catch (err) {
      setError('Failed to load client data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!client) return;
    
    setSaving(true);
    setSaved(false);

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token') || localStorage.getItem('portal_token');

      const res = await fetch(`${API_URL}/api/portal/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          ...formData
        })
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError('Failed to save changes.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your portal...</p>
        </div>
      </div>
    );
  }

  if (error && !client) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm border max-w-md">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">{error}</p>
          <p className="text-sm text-gray-400 mt-4">
            Contact your service provider for a new access link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center font-bold text-white">
                {client?.business_name?.charAt(0) || 'A'}
              </div>
              <div>
                <h1 className="font-bold text-gray-900">{client?.business_name}</h1>
                <p className="text-xs text-gray-500">AI Receptionist Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {saved && (
                <span className="flex items-center gap-1 text-green-600 text-sm">
                  <Check size={16} /> Saved
                </span>
              )}
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Save size={18} />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <Phone size={16} />
              Total Calls
            </div>
            <div className="text-2xl font-bold text-gray-900">{callStats.totalCalls}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <Clock size={16} />
              Avg Duration
            </div>
            <div className="text-2xl font-bold text-gray-900">{callStats.avgDuration}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <AlertCircle size={16} />
              Missed Calls
            </div>
            <div className="text-2xl font-bold text-gray-900">{callStats.missedCalls}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <Calendar size={16} />
              Bookings
            </div>
            <div className="text-2xl font-bold text-gray-900">{callStats.bookingsCreated}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'settings', label: 'AI Settings', icon: Settings },
            { id: 'services', label: 'Services', icon: FileText },
            { id: 'faq', label: 'FAQ', icon: MessageSquare },
            { id: 'hours', label: 'Business Hours', icon: Clock },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          {/* AI Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AI Phone Number
                </label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Phone size={18} className="text-gray-400" />
                  <span className="font-mono text-gray-900">
                    {client?.vapi_phone || 'Not yet assigned'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Greeting Message
                </label>
                <textarea
                  value={formData.greeting}
                  onChange={(e) => setFormData({ ...formData, greeting: e.target.value })}
                  rows={3}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Hello! Thanks for calling..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  This is what callers hear when they first connect.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Voice Style
                </label>
                <select
                  value={formData.voiceStyle}
                  onChange={(e) => setFormData({ ...formData, voiceStyle: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="professional">Professional</option>
                  <option value="friendly">Friendly</option>
                  <option value="casual">Casual</option>
                  <option value="formal">Formal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Escalation Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.escalationPhone}
                  onChange={(e) => setFormData({ ...formData, escalationPhone: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="(555) 123-4567"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Urgent calls will be forwarded to this number.
                </p>
              </div>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Services You Offer
                </label>
                <textarea
                  value={formData.services}
                  onChange={(e) => setFormData({ ...formData, services: e.target.value })}
                  rows={8}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  placeholder={`Example:
- Roof Repair
- Roof Replacement
- Gutter Installation
- Emergency Tarping
- Free Estimates`}
                />
                <p className="text-xs text-gray-500 mt-1">
                  List each service on a new line. The AI will use this to answer questions.
                </p>
              </div>
            </div>
          )}

          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequently Asked Questions
                </label>
                <textarea
                  value={formData.faq}
                  onChange={(e) => setFormData({ ...formData, faq: e.target.value })}
                  rows={12}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  placeholder={`Q: What are your hours?
A: We're available 24/7 for emergencies.

Q: Do you offer free estimates?
A: Yes, we provide free estimates for all new customers.

Q: What areas do you serve?
A: We serve the greater Orlando area including...`}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Add Q&A pairs to help the AI answer common questions accurately.
                </p>
              </div>
            </div>
          )}

          {/* Business Hours Tab */}
          {activeTab === 'hours' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Operating Hours
                </label>
                <select
                  value={formData.businessHours}
                  onChange={(e) => setFormData({ ...formData, businessHours: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="24/7">24/7 - Always Available</option>
                  <option value="business">Business Hours (Mon-Fri 9am-5pm)</option>
                  <option value="extended">Extended Hours (Mon-Sat 8am-6pm)</option>
                  <option value="emergency">Emergency Only - Forward All Calls</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  The AI will handle calls differently based on your hours.
                </p>
              </div>

              <div className="p-4 bg-blue-50 rounded-xl">
                <div className="flex items-start gap-3">
                  <Volume2 className="text-blue-600 mt-0.5" size={20} />
                  <div>
                    <h4 className="font-medium text-blue-900">After Hours Behavior</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      When your business is closed, the AI will:
                    </p>
                    <ul className="text-sm text-blue-700 mt-2 space-y-1">
                      <li>• Take messages for callback</li>
                      <li>• Offer to schedule an appointment</li>
                      <li>• Forward emergencies to your escalation number</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Help Footer */}
        <div className="mt-8 p-4 bg-gray-100 rounded-xl text-center text-sm text-gray-600">
          Need help? Contact support at{' '}
          <a href="mailto:support@apexvoicesolutions.com" className="text-blue-600 hover:underline">
            support@apexvoicesolutions.com
          </a>
        </div>
      </main>
    </div>
  );
}
