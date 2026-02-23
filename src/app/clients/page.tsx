'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/sidebar';
import { Plus, Building, Phone, Mail, Calendar, MoreVertical, Search, Filter, Loader2 } from 'lucide-react';
import { API_URL } from '@/lib/config';
import { useRouter } from 'next/navigation';

interface Client {
  id: string;
  name?: string;
  business_name: string;
  industry: string;
  contact_phone?: string;
  contact_email?: string;
  business_phone?: string;
  vapi_phone?: string;
  vapi_agent_id?: string;
  status: 'active' | 'pending' | 'inactive';
  created_at: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`${API_URL}/api/clients`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setClients(data.clients || []);
      }
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(c => 
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.business_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.contact_email?.toLowerCase().includes(search.toLowerCase())
  );

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
            <p className="text-gray-500 mt-1">Manage your AI receptionist clients</p>
          </div>
          <button 
            onClick={() => router.push('/clients/new')}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            Add Client
          </button>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6 flex gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="border border-gray-200 px-4 py-2.5 rounded-lg flex items-center gap-2 text-gray-600 hover:bg-gray-50">
            <Filter size={18} />
            Filter
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={32} className="animate-spin text-blue-600" />
          </div>
        )}

        {/* Clients Grid */}
        {!loading && (
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <div key={client.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-2xl">
                        {getIndustryIcon(client.industry)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{client.business_name || client.name}</h3>
                        <p className="text-sm text-gray-500">{client.industry || 'Service Business'}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(client.status)}`}>
                      {client.status}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone size={14} className="text-gray-400" />
                      {client.contact_phone || client.business_phone || 'No phone'}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail size={14} className="text-gray-400" />
                      {client.contact_email || 'No email'}
                    </div>
                    {client.vapi_phone && (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <Phone size={14} />
                        AI Line: {client.vapi_phone}
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-2">
                  <button 
                    onClick={() => router.push(`/clients/${client.id}`)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                  >
                    Manage
                  </button>
                  <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-white transition-colors text-gray-600">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
            ))}

            {filteredClients.length === 0 && (
              <div className="col-span-full bg-white rounded-xl border border-gray-100 p-12 text-center">
                <Building size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="font-semibold text-gray-900">No clients yet</h3>
                <p className="text-sm text-gray-500 mt-1 mb-4">Add your first client to get started</p>
                <button 
                  onClick={() => router.push('/clients/new')}
                  className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  Add Your First Client
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
