'use client';

import { useState } from 'react';
import Sidebar from '@/components/sidebar';
import { Calendar, Clock, ChevronLeft, ChevronRight, X, Phone, MapPin, User, Briefcase, Edit2, Trash2 } from 'lucide-react';

interface Appointment {
  id: string;
  time: string;
  name: string;
  service: string;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
  clientName?: string;
  status: 'confirmed' | 'pending' | 'completed';
}

export default function CalendarPage() {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const appointments: Appointment[] = [
    { 
      id: '1', 
      time: '9:00 AM', 
      name: 'John Peterson', 
      service: 'Roof Inspection', 
      phone: '+1 555-0101',
      email: 'john@email.com',
      address: '123 Oak Street, Daytona Beach, FL',
      notes: 'Customer mentioned possible leak in attic',
      clientName: 'ABC Roofing Co',
      status: 'confirmed'
    },
    { 
      id: '2', 
      time: '10:30 AM', 
      name: 'Sarah Miller', 
      service: 'Drain Cleaning', 
      phone: '+1 555-0102',
      email: 'sarah@email.com',
      address: '456 Pine Ave, Orlando, FL',
      notes: 'Recurring customer, prefers morning appointments',
      clientName: 'Quick Plumber LLC',
      status: 'confirmed'
    },
    { 
      id: '3', 
      time: '2:00 PM', 
      name: 'Mike Ross', 
      service: 'HVAC Tune-up', 
      phone: '+1 555-0103',
      email: 'mike@email.com',
      address: '789 Elm Blvd, Miami, FL',
      clientName: 'Elite HVAC Pros',
      status: 'pending'
    },
    { 
      id: '4', 
      time: '4:30 PM', 
      name: 'Emma Wilson', 
      service: 'Plumbing Repair', 
      phone: '+1 555-0105',
      email: 'emma@email.com',
      address: '321 Maple Dr, Jacksonville, FL',
      notes: 'Emergency call - water heater leak',
      clientName: 'Pro Plumber Experts',
      status: 'confirmed'
    },
  ];

  const formatDate = () => {
    return currentDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
            <p className="text-gray-500 mt-1">Appointments booked by your AI agents</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1">
              <button 
                onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 1)))}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="font-semibold px-4 min-w-[100px] text-center">
                {currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
              <button 
                onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 1)))}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            <button 
              onClick={() => setCurrentDate(new Date())}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Today
            </button>
          </div>
        </div>

        {/* Date Display */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
          <h2 className="font-semibold text-gray-900">{formatDate()}</h2>
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {appointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="font-semibold text-gray-900">No appointments today</h3>
              <p className="text-sm text-gray-500 mt-1">Appointments booked by your AI will appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {appointments.map((apt) => (
                <div 
                  key={apt.id} 
                  className="p-6 flex items-center gap-6 hover:bg-gray-50 transition-colors"
                >
                  {/* Time */}
                  <div className="w-24 text-center flex-shrink-0">
                    <div className="font-bold text-lg text-gray-900">{apt.time}</div>
                  </div>

                  {/* Status Indicator */}
                  <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0" />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900">{apt.name}</div>
                    <div className="text-sm text-gray-500">{apt.service}</div>
                    {apt.clientName && (
                      <div className="text-xs text-blue-600 mt-1">{apt.clientName}</div>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="text-sm text-gray-500 hidden md:block">
                    {apt.phone}
                  </div>

                  {/* Status Badge */}
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(apt.status)}`}>
                    {apt.status}
                  </span>

                  {/* View Details Button */}
                  <button 
                    onClick={() => setSelectedAppointment(apt)}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="text-2xl font-bold text-gray-900">{appointments.length}</div>
            <div className="text-sm text-gray-500">Total Appointments</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="text-2xl font-bold text-green-600">
              {appointments.filter(a => a.status === 'confirmed').length}
            </div>
            <div className="text-sm text-gray-500">Confirmed</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {appointments.filter(a => a.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-500">Pending</div>
          </div>
        </div>
      </main>

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full mx-4 overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Appointment Details</h2>
                <p className="text-sm text-gray-500">{selectedAppointment.time} • {formatDate()}</p>
              </div>
              <button 
                onClick={() => setSelectedAppointment(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {/* Customer Info */}
              <div className="flex items-start gap-3">
                <User size={20} className="text-gray-400 mt-0.5" />
                <div>
                  <div className="font-semibold text-gray-900">{selectedAppointment.name}</div>
                  <div className="text-sm text-gray-500">Customer</div>
                </div>
              </div>

              {/* Service */}
              <div className="flex items-start gap-3">
                <Briefcase size={20} className="text-gray-400 mt-0.5" />
                <div>
                  <div className="font-semibold text-gray-900">{selectedAppointment.service}</div>
                  <div className="text-sm text-gray-500">Service Requested</div>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <Phone size={20} className="text-gray-400 mt-0.5" />
                <div>
                  <a href={`tel:${selectedAppointment.phone}`} className="font-semibold text-blue-600 hover:underline">
                    {selectedAppointment.phone}
                  </a>
                  <div className="text-sm text-gray-500">Phone</div>
                </div>
              </div>

              {/* Email */}
              {selectedAppointment.email && (
                <div className="flex items-start gap-3">
                  <div className="w-5 text-center text-gray-400">@</div>
                  <div>
                    <a href={`mailto:${selectedAppointment.email}`} className="font-semibold text-blue-600 hover:underline">
                      {selectedAppointment.email}
                    </a>
                    <div className="text-sm text-gray-500">Email</div>
                  </div>
                </div>
              )}

              {/* Address */}
              {selectedAppointment.address && (
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-gray-400 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-900">{selectedAppointment.address}</div>
                    <div className="text-sm text-gray-500">Service Address</div>
                  </div>
                </div>
              )}

              {/* Client */}
              {selectedAppointment.clientName && (
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-blue-100 flex items-center justify-center text-xs text-blue-600 font-bold">C</div>
                  <div>
                    <div className="font-semibold text-gray-900">{selectedAppointment.clientName}</div>
                    <div className="text-sm text-gray-500">Business Client</div>
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedAppointment.notes && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="text-sm font-semibold text-yellow-800 mb-1">Notes</div>
                  <div className="text-sm text-yellow-700">{selectedAppointment.notes}</div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50">
                <Edit2 size={18} />
                Edit
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-red-200 text-red-600 rounded-xl font-semibold hover:bg-red-50">
                <Trash2 size={18} />
                Cancel
              </button>
              <a 
                href={`tel:${selectedAppointment.phone}`}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
              >
                <Phone size={18} />
                Call
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
