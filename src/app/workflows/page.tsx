'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/sidebar';
import { 
  GitBranch, Play, Pause, Mail, MessageSquare, Clock, 
  Loader2, RefreshCw, ChevronRight, AlertCircle, CheckCircle,
  XCircle, Zap, Users
} from 'lucide-react';
import { API_URL } from '@/lib/config';

const WORKFLOW_TYPES = [
  { 
    type: 'NEW_LEAD', 
    name: 'New Lead Sequence', 
    description: 'Cold intro → 3 day follow-up → 7 day re-engagement',
    steps: 4,
    icon: '🆕',
    color: 'blue'
  },
  { 
    type: 'DEMO_REQUESTED', 
    name: 'Demo Confirmation', 
    description: 'Confirmation → 1 day reminder → 1 hour before',
    steps: 4,
    icon: '📅',
    color: 'green'
  },
  { 
    type: 'NO_ANSWER', 
    name: 'No Answer Follow-up', 
    description: 'SMS + Email follow-up for missed calls',
    steps: 2,
    icon: '📞',
    color: 'orange'
  },
  { 
    type: 'COLD_LEAD', 
    name: 'Reactivation Sequence', 
    description: 'Re-engage leads with no recent activity',
    steps: 2,
    icon: '❄️',
    color: 'purple'
  }
];

interface ActiveWorkflow {
  id: string;
  lead_id: string;
  workflow_type: string;
  workflow_name: string;
  status: string;
  current_step: number;
  total_steps: number;
  started_at: string;
  last_executed_at: string;
  completed_at: string;
  lead_name?: string;
  lead_email?: string;
}

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<ActiveWorkflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`${API_URL}/api/workflows/active`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error('Failed to fetch workflows');
      
      const data = await res.json();
      setWorkflows(data.workflows || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play size={16} className="text-green-500" />;
      case 'completed': return <CheckCircle size={16} className="text-blue-500" />;
      case 'cancelled': return <XCircle size={16} className="text-red-500" />;
      default: return <Clock size={16} className="text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Workflows</h1>
            <p className="text-gray-500 mt-1">Agent E automated sequences</p>
          </div>
          <button 
            onClick={fetchWorkflows}
            disabled={loading}
            className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Workflow Types */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Sequences</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {WORKFLOW_TYPES.map((wf) => (
              <div 
                key={wf.type}
                className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{wf.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{wf.name}</h3>
                    <p className="text-xs text-gray-500">{wf.steps} steps</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{wf.description}</p>
              </div>
            ))}
          </div>
        </div>

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
            <span className="ml-3 text-gray-600">Loading workflows...</span>
          </div>
        )}

        {/* Active Workflows */}
        {!loading && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Sequences</h2>
            
            {workflows.length > 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Lead</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Workflow</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Progress</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Started</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Last Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {workflows.map((wf) => (
                      <tr key={wf.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{wf.lead_name || 'Unknown'}</p>
                            <p className="text-xs text-gray-500">{wf.lead_email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <GitBranch size={16} className="text-gray-400" />
                            <span className="font-medium text-gray-700">{wf.workflow_name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: `${(wf.current_step / wf.total_steps) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600">{wf.current_step}/{wf.total_steps}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(wf.status)}`}>
                            {getStatusIcon(wf.status)}
                            {wf.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDate(wf.started_at)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDate(wf.last_executed_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <Zap size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="font-semibold text-gray-900">No active workflows</h3>
                <p className="text-sm text-gray-500 mt-1 mb-4">Workflows start automatically when leads are created or take specific actions</p>
              </div>
            )}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Workflows</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {workflows.filter(w => w.status === 'active').length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <Play size={24} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed Today</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {workflows.filter(w => w.status === 'completed').length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <CheckCircle size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Leads in Sequences</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {new Set(workflows.map(w => w.lead_id)).size}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <Users size={24} className="text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
