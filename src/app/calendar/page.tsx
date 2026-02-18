'use client';

import Sidebar from '@/components/sidebar';
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CalendarPage() {
  const appointments = [
    { id: '1', time: '9:00 AM', name: 'John Peterson', service: 'Roof Inspection', phone: '+1 555-0101' },
    { id: '2', time: '10:30 AM', name: 'Sarah Miller', service: 'Drain Cleaning', phone: '+1 555-0102' },
    { id: '3', time: '2:00 PM', name: 'Mike Ross', service: 'HVAC Tune-up', phone: '+1 555-0103' },
    { id: '4', time: '4:30 PM', name: 'Emma Wilson', service: 'Plumbing Repair', phone: '+1 555-0105' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
            <p className="text-gray-500 mt-1">Appointments booked by your AI agents</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronLeft size={20} />
            </button>
            <span className="font-semibold px-4">Today</span>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {appointments.map((apt) => (
              <div key={apt.id} className="p-6 flex items-center gap-6 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="w-24 text-center">
                  <div className="font-bold text-lg text-gray-900">{apt.time}</div>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{apt.name}</div>
                  <div className="text-sm text-gray-500">{apt.service}</div>
                </div>
                <div className="text-sm text-gray-500">{apt.phone}</div>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">View Details</button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
