'use client';

import { PhoneIncoming, Users, CalendarCheck, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatsData {
  totalCalls: number;
  totalLeads: number;
  newLeads: number;
  bookedCalls: number;
  conversionRate: string;
}

interface DashboardStatsProps {
  stats: StatsData;
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const metrics = [
    { 
      label: 'Total Calls', 
      value: stats.totalCalls, 
      icon: PhoneIncoming, 
      change: '+12%', 
      color: 'blue',
      trend: 'up'
    },
    { 
      label: 'Jobs Booked', 
      value: stats.bookedCalls, 
      icon: CalendarCheck, 
      change: '+8%', 
      color: 'green',
      trend: 'up'
    },
    { 
      label: 'New Leads', 
      value: stats.newLeads, 
      icon: Users, 
      change: '+18%', 
      color: 'purple',
      trend: 'up'
    },
    { 
      label: 'Conversion Rate', 
      value: `${stats.conversionRate}%`, 
      icon: TrendingUp, 
      change: 'Stable', 
      color: 'orange',
      trend: 'stable'
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, i) => {
        const Icon = metric.icon;
        return (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${colorClasses[metric.color as keyof typeof colorClasses]}`}>
                <Icon size={20} />
              </div>
              <div className={`flex items-center text-xs font-bold ${
                metric.trend === 'up' ? 'text-green-500' : 'text-gray-400'
              }`}>
                {metric.change}
                {metric.trend === 'up' && <ArrowUpRight size={14} className="ml-1" />}
              </div>
            </div>
            <div className="text-sm font-medium text-gray-500">{metric.label}</div>
            <div className="text-3xl font-bold text-gray-900 mt-1">{metric.value}</div>
          </div>
        );
      })}
    </div>
  );
}
