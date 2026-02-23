'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/sidebar';
import { Calendar, Clock, ChevronLeft, ChevronRight, X, Phone, MapPin, User, Briefcase, Edit2, Trash2, Loader2, ExternalLink } from 'lucide-react';
import { API_URL } from '@/lib/config';

interface Appointment {
  id: string;
  time: string;
  endTime?: string;
  name: string;
  service: string;
  phone?: string;
  email?: string;
  notes?: string;
  status: string;
  date: string;
}

export default function CalendarPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchBookings();
  }, [currentDate]);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`${API_URL}/api/calendar/bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      
      if (res.ok) {
        setAppointments(data.bookings || []);
      } else {
        setError('Failed to load calendar');
        // Fall back to sample data
        setAppointments(getSampleAppointments());
      }
    } catch (err) {
      console.error('Calendar fetch error:', err);
      setError('Using demo data');
      setAppointments(getSampleAppointments());
    } finally {
      setLoading(false);
    }
  };

  const getSampleAppointments = (): Appointment[] => [
    { 
      id: '1', 
      time: '9:00 AM',
      endTime: '9:30 AM', 
      name: 'John Peterson', 
      service: 'Roof Inspection', 
      phone: '+1 555-0101',
      email: 'john@email.com',
      notes: 'Customer mentioned possible leak in attic',
      status: 'confirmed',
      date: new Date().toISOString().split('T')[0]
    },
    { 
      id: '2', 
      time: '10:30 AM',
      endTime: '11:00 AM', 
      name: 'Sarah Miller', 
      service: 'Consultation', 
      phone: '+1 555-0102',
      email: 'sarah@email.com',
      notes: 'Interested in AI receptionist service',
      status: 'confirmed',
      date: new Date().toISOString().split('T')[0]
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
      case 'ACCEPTED':
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'PENDING':
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'CANCELLED':
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'completed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  const getFilteredAppointments = () => {
    const todayStr = currentDate.toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === todayStr || !apt.date);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
            <p className="text-gray-500 mt-1">Appointments from Cal.com</p>
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
            <a 
              href="https://cal.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 flex items-center gap-2"
            >
              <ExternalLink size={16} />
              Open Cal.com
            </a>
          </div>
        </div>

        {/* Date Display */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
          <h2 className="font-semibold text-gray-900">{formatDate()}</h2>
          {error && <p className="text-xs text-yellow-600 mt-1">{error}</p>}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={32} className="animate-spin text-blue-600" />
          </div>
        )}

        {/* Appointments List */}
        {!loading && (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {getFilteredAppointments().length === 0 ? (
              <div className="text-center py-12">
                <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="font-semibold text-gray-900">No appointments today</h3>
                <p className="text-sm text-gray-500 mt-1">Bookings from Cal.com will appear here</p>
                <a 
                  href="https://cal.com"
                  target="_blank"
                  className="inline-block mt-4 text-blue-600 hover:underline"
                >
                  View in Cal.com →
                </a>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {getFilteredAppointments().map((apt) => (
                  <div 
                    key={apt.id} 
                    className="p-6 flex items-center gap-6 hover:bg-gray-50 transition-colors"
                  >
                    {/* Time */}
                    <div className="w-24 text-center flex-shrink-0">
                      <div className="font-bold text-lg text-gray-900">{apt.time}</div>
                      {apt.endTime && (
                        <div className="text-xs text-gray-400">- {apt.endTime}</div>
                      )}
                    </div>

                    {/* Status Indicator */}
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                      apt.status === 'confirmed' || apt.status === 'ACCEPTED' ? 'bg-green-500' :
                      apt.status === 'pending' || apt.status === 'PENDING' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`} />

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900">{apt.name}</div>
                      <div className="text-sm text-gray-500">{apt.service}</div>
                    </div>

                    {/* Phone */}
                    {apt.phone && (
                      <a 
                        href={`tel:${apt.phone}`}
                        className="text-sm text-blue-600 hover:underline hidden md:block"
                      >
                        {apt.phone}
                      </a>
                    )}

                    {/* Status Badge */}
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${getStatusColor(apt.status)}`}>
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
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="text-2xl font-bold text-gray-900">{appointments.length}</div>
            <div className="text-sm text-gray-500">This Week</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="text-2xl font-bold text-green-600">
              {appointments.filter(a => a.status === 'confirmed' || a.status === 'ACCEPTED').length}
            </div>
            <div className="text-sm text-gray-500">Confirmed</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {appointments.filter(a => a.status === 'pending' || a.status === 'PENDING').length}
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
                <p className="text-sm text-gray-500">{selectedAppointment.time} • {selectedAppointment.date || formatDate()}</p>
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
                  <div className="text-sm text-gray-500">Service</div>
                </div>
              </div>

              {/* Phone */}
              {selectedAppointment.phone && (
                <div className="flex items-start gap-3">
                  <Phone size={20} className="text-gray-400 mt-0.5" />
                  <div>
                    <a href={`tel:${selectedAppointment.phone}`} className="font-semibold text-blue-600 hover:underline">
                      {selectedAppointment.phone}
                    </a>
                    <div className="text-sm text-gray-500">Phone</div>
                  </div>
                </div>
              )}

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
              <button 
                onClick={() => setSelectedAppointment(null)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              {selectedAppointment.phone && (
                <a 
                  href={`tel:${selectedAppointment.phone}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
                >
                  <Phone size={18} />
                  Call
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
