'use client';

import { Phone, Mail, Clock, AlertCircle } from 'lucide-react';

interface Call {
  id: string;
  customerName?: string;
  customerPhone?: string;
  issue?: string;
  time: string;
  urgency: 'High' | 'Normal' | 'Low';
  status: string;
}

interface RecentActivityProps {
  calls: Call[];
}

export default function RecentActivity({ calls }: RecentActivityProps) {
  const urgencyColors = {
    High: 'bg-red-50 text-red-600 border-red-100',
    Normal: 'bg-blue-50 text-blue-600 border-blue-100',
    Low: 'bg-gray-50 text-gray-600 border-gray-100',
  };

  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg text-gray-900">Recent Call Activity</h3>
        <a href="/calls" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
          View All
        </a>
      </div>
      <div className="space-y-3">
        {calls.map((call, idx) => (
          <div 
            key={call.id || idx}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-full border border-gray-200 flex items-center justify-center font-bold text-sm text-gray-600">
                {call.customerName?.charAt(0) || <Phone size={16} />}
              </div>
              <div>
                <div className="font-semibold text-sm text-gray-900">
                  {call.customerName || 'Unknown Caller'}
                </div>
                <div className="text-xs text-gray-400 font-medium">
                  {call.issue || 'General Inquiry'} • {call.time}
                </div>
              </div>
            </div>
            <span className={`text-xs font-semibold uppercase px-3 py-1 rounded-full border ${
              urgencyColors[call.urgency]
            }`}>
              {call.urgency}
            </span>
          </div>
        ))}
        {calls.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <Phone size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No recent calls</p>
          </div>
        )}
      </div>
    </div>
  );
}
