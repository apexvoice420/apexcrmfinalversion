'use client';

import Sidebar from '@/components/sidebar';
import DashboardStats from '@/components/dashboard-stats';
import CallsChart from '@/components/calls-chart';
import RecentActivity from '@/components/recent-activity';

// Demo stats - no backend needed
const demoStats = {
  totalCalls: 47,
  totalLeads: 23,
  newLeads: 8,
  bookedCalls: 12,
  conversionRate: '25.5',
};

export default function Dashboard() {
  // Mock recent calls for demo
  const recentCalls = [
    { id: '1', customerName: 'John Peterson', issue: 'Roof Leak', time: '2 mins ago', urgency: 'High' as const, status: 'completed' },
    { id: '2', customerName: 'Sarah Miller', issue: 'Drain Clog', time: '1 hour ago', urgency: 'Normal' as const, status: 'completed' },
    { id: '3', customerName: 'Unknown Caller', issue: 'HVAC Inquiry', time: '3 hours ago', urgency: 'Low' as const, status: 'completed' },
    { id: '4', customerName: 'Mike Ross', issue: 'Sump Pump', time: '5 hours ago', urgency: 'High' as const, status: 'completed' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, Maurice</h1>
            <p className="text-gray-500 mt-1">Here's how Apex Voice is performing for your business.</p>
          </div>
          <select className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Month</option>
          </select>
        </div>

        {/* Stats Grid */}
        <div className="mb-8">
          <DashboardStats stats={demoStats} />
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          <CallsChart />
          <RecentActivity calls={recentCalls} />
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold">Ready to add a new client?</h3>
              <p className="text-blue-100 mt-1">Set up their AI receptionist in minutes.</p>
            </div>
            <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
              + Add Client
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
