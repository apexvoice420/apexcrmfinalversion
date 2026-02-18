'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', calls: 24, booked: 8 },
  { name: 'Tue', calls: 18, booked: 5 },
  { name: 'Wed', calls: 35, booked: 12 },
  { name: 'Thu', calls: 27, booked: 9 },
  { name: 'Fri', calls: 42, booked: 15 },
  { name: 'Sat', calls: 15, booked: 4 },
  { name: 'Sun', calls: 10, booked: 3 },
];

export default function CallsChart() {
  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-bold text-lg text-gray-900">Call Volume & Conversions</h3>
        <div className="flex gap-4 text-xs font-semibold uppercase">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-gray-500">Calls</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <span className="text-gray-500">Booked</span>
          </div>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#64748b' }} 
              dy={10} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#64748b' }} 
            />
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' 
              }} 
            />
            <Bar dataKey="calls" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="booked" fill="#4ade80" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
