'use client';

import { useState } from 'react';
import Sidebar from '@/components/sidebar';
import { Phone, PhoneIncoming, PhoneOutgoing, Clock, Play, ChevronDown } from 'lucide-react';

interface Call {
  id: string;
  direction: 'INBOUND' | 'OUTBOUND';
  customerName: string;
  customerPhone: string;
  duration: number;
  status: string;
  outcome?: string;
  transcript?: string;
  createdAt: string;
}

export default function CallsPage() {
  const [filter, setFilter] = useState('all');

  // Mock calls data
  const calls: Call[] = [
    { id: '1', direction: 'INBOUND', customerName: 'John Peterson', customerPhone: '+1 555-0101', duration: 245, status: 'COMPLETED', outcome: 'booked', createdAt: new Date(Date.now() - 120000).toISOString() },
    { id: '2', direction: 'INBOUND', customerName: 'Sarah Miller', customerPhone: '+1 555-0102', duration: 180, status: 'COMPLETED', outcome: 'follow_up', createdAt: new Date(Date.now() - 3600000).toISOString() },
    { id: '3', direction: 'OUTBOUND', customerName: 'Mike Ross', customerPhone: '+1 555-0103', duration: 320, status: 'COMPLETED', outcome: 'booked', createdAt: new Date(Date.now() - 7200000).toISOString() },
    { id: '4', direction: 'INBOUND', customerName: 'Unknown', customerPhone: '+1 555-0104', duration: 60, status: 'MISSED', createdAt: new Date(Date.now() - 10800000).toISOString() },
    { id: '5', direction: 'INBOUND', customerName: 'Emma Wilson', customerPhone: '+1 555-0105', duration: 290, status: 'COMPLETED', outcome: 'qualified', createdAt: new Date(Date.now() - 14400000).toISOString() },
  ];

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTime = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 60) return `${mins} mins ago`;
    if (hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
  };

  const outcomeColors: Record<string, string> = {
    booked: 'bg-green-50 text-green-600 border-green-100',
    follow_up: 'bg-yellow-50 text-yellow-600 border-yellow-100',
    qualified: 'bg-purple-50 text-purple-600 border-purple-100',
    missed: 'bg-red-50 text-red-600 border-red-100',
  };

  const filteredCalls = filter === 'all' ? calls : calls.filter((c) => c.direction === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Call Logs</h1>
            <p className="text-gray-500 mt-1">All AI-handled calls in one place</p>
          </div>
          <div className="flex gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Calls</option>
              <option value="INBOUND">Inbound</option>
              <option value="OUTBOUND">Outbound</option>
            </select>
          </div>
        </div>

        {/* Calls List */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {filteredCalls.map((call) => (
              <div key={call.id} className="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      call.direction === 'INBOUND' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                    }`}>
                      {call.direction === 'INBOUND' ? <PhoneIncoming size={20} /> : <PhoneOutgoing size={20} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{call.customerName}</span>
                        {call.outcome && (
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                            outcomeColors[call.outcome] || ''
                          }`}>
                            {call.outcome.replace('_', ' ')}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                        <span>{call.customerPhone}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {formatDuration(call.duration)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400">{formatTime(call.createdAt)}</span>
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-blue-600">
                      <Play size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
