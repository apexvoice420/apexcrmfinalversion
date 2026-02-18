'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/sidebar';
import { Search, Plus, Phone, Mail, MoreVertical, Filter, Download } from 'lucide-react';
import { API_URL } from '@/lib/config';

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  status: string;
  source?: string;
  notes?: string;
  createdAt: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        // Demo mode with mock data
        setLeads([
          { id: '1', firstName: 'John', lastName: 'Peterson', phone: '+1 555-0101', email: 'john@email.com', status: 'NEW', source: 'Call', createdAt: new Date().toISOString() },
          { id: '2', firstName: 'Sarah', lastName: 'Miller', phone: '+1 555-0102', email: 'sarah@email.com', status: 'CONTACTED', source: 'Call', createdAt: new Date().toISOString() },
          { id: '3', firstName: 'Mike', lastName: 'Ross', phone: '+1 555-0103', email: 'mike@email.com', status: 'QUALIFIED', source: 'Call', createdAt: new Date().toISOString() },
          { id: '4', firstName: 'Emma', lastName: 'Wilson', phone: '+1 555-0104', email: 'emma@email.com', status: 'BOOKED', source: 'Call', createdAt: new Date().toISOString() },
          { id: '5', firstName: 'David', lastName: 'Brown', phone: '+1 555-0105', email: 'david@email.com', status: 'NEW', source: 'Web', createdAt: new Date().toISOString() },
        ]);
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/api/leads`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads);
      }
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors: Record<string, string> = {
    NEW: 'bg-blue-50 text-blue-600 border-blue-100',
    CONTACTED: 'bg-yellow-50 text-yellow-600 border-yellow-100',
    QUALIFIED: 'bg-purple-50 text-purple-600 border-purple-100',
    BOOKED: 'bg-green-50 text-green-600 border-green-100',
    LOST: 'bg-red-50 text-red-600 border-red-100',
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = 
      lead.firstName.toLowerCase().includes(search.toLowerCase()) ||
      lead.lastName.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone?.includes(search);
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
            <p className="text-gray-500 mt-1">{leads.length} total leads in your pipeline</p>
          </div>
          <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus size={18} />
            Add Lead
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6 flex gap-4 items-center">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads..."
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
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="QUALIFIED">Qualified</option>
            <option value="BOOKED">Booked</option>
            <option value="LOST">Lost</option>
          </select>
          <button className="border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 flex items-center gap-2">
            <Download size={18} />
            Export
          </button>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Name</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Contact</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Source</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Created</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    No leads found
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-600">
                          {lead.firstName.charAt(0)}{lead.lastName.charAt(0)}
                        </div>
                        <div className="font-medium text-gray-900">
                          {lead.firstName} {lead.lastName}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {lead.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone size={14} />
                            {lead.phone}
                          </div>
                        )}
                        {lead.email && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail size={14} />
                            {lead.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                        statusColors[lead.status] || 'bg-gray-50 text-gray-600 border-gray-100'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {lead.source || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <MoreVertical size={18} className="text-gray-400" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
