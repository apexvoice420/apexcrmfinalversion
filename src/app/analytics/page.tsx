'use client';

import Sidebar from '@/components/sidebar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const callVolumeData = [
  { name: 'Week 1', calls: 120, booked: 42 },
  { name: 'Week 2', calls: 145, booked: 58 },
  { name: 'Week 3', calls: 132, booked: 51 },
  { name: 'Week 4', calls: 168, booked: 67 },
];

const callSourceData = [
  { name: 'Google Ads', value: 35 },
  { name: 'Website', value: 25 },
  { name: 'Referral', value: 20 },
  { name: 'Direct', value: 20 },
];

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 mt-1">Insights from your AI receptionist</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Call Volume Trend */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-lg text-gray-900 mb-6">Weekly Call Volume</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={callVolumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                  <Line type="monotone" dataKey="calls" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4 }} />
                  <Line type="monotone" dataKey="booked" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Call Sources */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-lg text-gray-900 mb-6">Call Sources</h3>
            <div className="h-72 flex items-center">
              <ResponsiveContainer width="50%" height="100%">
                <PieChart>
                  <Pie
                    data={callSourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {callSourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-3">
                {callSourceData.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                    <span className="text-gray-700">{item.name}</span>
                    <span className="font-semibold text-gray-900 ml-auto">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-lg text-gray-900 mb-6">Agent Performance</h3>
            <div className="space-y-4">
              {[
                { name: 'Cora - Roofing', calls: 342, rate: 94 },
                { name: 'Max - HVAC', calls: 128, rate: 91 },
              ].map((agent, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{agent.name}</div>
                    <div className="text-sm text-gray-500">{agent.calls} calls this month</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{agent.rate}%</div>
                    <div className="text-xs text-gray-500">success rate</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Peak Hours */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-lg text-gray-900 mb-6">Peak Call Hours</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { hour: '8AM', calls: 12 },
                  { hour: '10AM', calls: 28 },
                  { hour: '12PM', calls: 35 },
                  { hour: '2PM', calls: 42 },
                  { hour: '4PM', calls: 38 },
                  { hour: '6PM', calls: 22 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="calls" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
