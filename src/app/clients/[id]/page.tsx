'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/sidebar';
import { 
  Building, Phone, Mail, MapPin, Bot, Calendar, MessageSquare,
  ArrowLeft, Loader2, Settings, PhoneCall, Edit2, Trash2
} from 'lucide-react';
import { API_URL } from '@/lib/config';

interface Client {
  id: number;
  business_name: string;
  industry: string;
  city: string;
  state: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  business_phone: string;
  escalation_phone: string;
  greeting: string;
  voice_style: string;
  services: string;
  faq: string;
  vapi_phone: string;
  vapi_agent_id: string;
  status: string;
  created_at: string;
}

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClient();
  }, [params.id]);

  const fetchClient = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`${API_URL}/api/clients/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setClient(data.client);
      }
    } catch (error) {
      console.error('Failed to fetch client:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'inactive': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getIndustryIcon = (industry: string) => {
    switch (industry?.toLowerCase()) {
      case 'roofing': return '🏠';
      case 'plumbing': return '🔧';
      case 'hvac': return '❄️';
      case 'electrical': return '⚡';
      case 'medical': return '🏥';
      default: return '🏗️';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-blue-600" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <main className="ml-64 p-8">
          <button onClick={() => router.push('/clients')} className="flex items-center gap-2 text-gray-600 mb-6">
            <ArrowLeft size={18} /> Back to Clients
          </button>
          <div className="text-center py-12">
            <p className="text-gray-500">Client not found</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-64 p-8">
        {/* Back Button */}
        <button onClick={() => router.push('/clients')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft size={18} />
          Back to Clients
        </button>

        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-3xl">
                {getIndustryIcon(client.industry)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{client.business_name}</h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-gray-500 capitalize">{client.industry}</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(client.status)}`}>
                    {client.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                <Edit2 size={18} className="text-gray-600" />
              </button>
              <button className="p-2 border border-gray-200 rounded-lg hover:bg-red-50">
                <Trash2 size={18} className="text-red-600" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Contact Info */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Building size={18} />
              Business Info
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <MapPin size={16} className="text-gray-400" />
                <span className="text-gray-600">{client.city}, {client.state}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone size={16} className="text-gray-400" />
                <span className="text-gray-600">{client.business_phone || 'No phone'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail size={16} className="text-gray-400" />
                <span className="text-gray-600">{client.contact_email}</span>
              </div>
            </div>
          </div>

          {/* Contact Person */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <PhoneCall size={18} />
              Primary Contact
            </h3>
            <div className="space-y-3">
              <p className="font-medium text-gray-900">{client.contact_name || 'Not set'}</p>
              <div className="flex items-center gap-3 text-sm">
                <Phone size={16} className="text-gray-400" />
                <span className="text-gray-600">{client.contact_phone || 'No phone'}</span>
              </div>
              {client.escalation_phone && (
                <div className="mt-4 p-3 bg-red-50 rounded-lg">
                  <p className="text-xs text-red-600 font-semibold mb-1">Emergency Escalation</p>
                  <p className="text-sm text-red-700">{client.escalation_phone}</p>
                </div>
              )}
            </div>
          </div>

          {/* VAPI Integration */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Bot size={18} />
              AI Receptionist
            </h3>
            {client.vapi_agent_id ? (
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-xs text-green-600 font-semibold mb-1">AI Line Active</p>
                  <p className="text-lg font-bold text-green-700">{client.vapi_phone || 'Provisioning...'}</p>
                </div>
                <p className="text-xs text-gray-400">Agent: {client.vapi_agent_id.slice(0, 12)}...</p>
              </div>
            ) : (
              <div className="text-center py-4">
                <Bot size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">AI not yet provisioned</p>
                <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold">
                  Provision AI
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Services & FAQ */}
        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          {/* Services */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Settings size={18} />
              Services Offered
            </h3>
            <p className="text-gray-600 text-sm whitespace-pre-wrap">
              {client.services || 'No services configured'}
            </p>
          </div>

          {/* Greeting */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare size={18} />
              AI Greeting
            </h3>
            <p className="text-gray-600 text-sm italic">
              "{client.greeting || `Thank you for calling ${client.business_name}. This is your AI assistant. How can I help you today?`}"
            </p>
            <p className="mt-3 text-xs text-gray-400">
              Voice Style: <span className="font-semibold capitalize">{client.voice_style || 'professional'}</span>
            </p>
          </div>
        </div>

        {/* FAQ */}
        {client.faq && (
          <div className="bg-white rounded-xl border border-gray-100 p-6 mt-6">
            <h3 className="font-semibold text-gray-900 mb-4">FAQ Knowledge Base</h3>
            <p className="text-gray-600 text-sm whitespace-pre-wrap">{client.faq}</p>
          </div>
        )}
      </main>
    </div>
  );
}
