'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/sidebar';
import { Bot, Plus, Mic, Settings, RefreshCw, Loader2, Cpu, MessageSquare } from 'lucide-react';
import { API_URL } from '@/lib/config';

interface VAPIAgent {
  id: string;
  name: string;
  voice: string;
  voiceProvider: string;
  model: string;
  firstMessage: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<VAPIAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`${API_URL}/api/vapi/assistants`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error('Failed to fetch agents');
      
      const data = await res.json();
      setAgents(data.assistants || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const syncAgents = async () => {
    setSyncing(true);
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`${API_URL}/api/agents/sync-vapi`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error('Sync failed');
      
      await fetchAgents();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSyncing(false);
    }
  };

  const formatDate = (dateStr: string) => {
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
            <h1 className="text-3xl font-bold text-gray-900">AI Agents</h1>
            <p className="text-gray-500 mt-1">Manage your VAPI assistants</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={syncAgents}
              disabled={syncing}
              className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {syncing ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
              Sync from VAPI
            </button>
            <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Plus size={18} />
              Create Agent
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={32} className="animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Loading agents...</span>
          </div>
        )}

        {/* Agents Grid */}
        {!loading && (
          <div className="grid lg:grid-cols-2 gap-6">
            {agents.map((agent) => (
              <div key={agent.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                {/* Agent Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                        <Bot size={28} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{agent.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            Active
                          </span>
                          <span className="text-xs text-gray-400">
                            ID: {agent.id.slice(0, 8)}...
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      <span className="text-sm font-medium text-gray-500 capitalize">{agent.status}</span>
                    </div>
                  </div>
                </div>

                {/* Agent Details */}
                <div className="p-6 bg-gray-50 grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 uppercase font-semibold">Voice</div>
                    <div className="font-semibold text-gray-900 mt-1 flex items-center gap-2">
                      <Mic size={14} />
                      {agent.voice}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">{agent.voiceProvider}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase font-semibold">Model</div>
                    <div className="font-semibold text-gray-900 mt-1 flex items-center gap-2">
                      <Cpu size={14} />
                      {agent.model}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-xs text-gray-500 uppercase font-semibold">First Message</div>
                    <div className="text-sm text-gray-700 mt-1 flex items-start gap-2">
                      <MessageSquare size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{agent.firstMessage || 'No greeting set'}</span>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-xs text-gray-400">
                      Updated: {formatDate(agent.updatedAt)}
                    </div>
                  </div>
                </div>

                {/* Agent Actions */}
                <div className="p-4 flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    <Settings size={16} />
                    Configure in VAPI
                  </button>
                </div>
              </div>
            ))}

            {agents.length === 0 && !loading && (
              <div className="col-span-2 bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <Bot size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="font-semibold text-gray-900">No agents found</h3>
                <p className="text-sm text-gray-500 mt-1 mb-4">Make sure VAPI_API_KEY is configured in Railway</p>
                <button 
                  onClick={syncAgents}
                  className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  Sync from VAPI
                </button>
              </div>
            )}

            {/* Add New Agent Card */}
            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/50 transition-all">
              <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
                <Plus size={28} className="text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-900">Create New Agent</h3>
              <p className="text-sm text-gray-500 mt-1">Set up a new AI receptionist in VAPI</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
