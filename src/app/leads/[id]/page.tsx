'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/sidebar';
import { ArrowLeft, Phone, Mail, Globe, MapPin, Star, Calendar, ExternalLink, Loader2 } from 'lucide-react';
import { API_URL } from '@/lib/config';
import Link from 'next/link';

interface Lead {
  id: number;
  business_name: string;
  phone: string;
  email?: string;
  city?: string;
  state?: string;
  rating?: number | string;
  reviews?: number;
  website?: string;
  address?: string;
  industry?: string;
  status: string;
  source?: string;
  notes?: string;
  created_at: string;
}

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchLead(params.id as string);
    }
  }, [params.id]);

  const fetchLead = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/leads/${id}`);
      if (res.ok) {
        const data = await res.json();
        setLead(data);
      } else {
        router.push('/leads');
      }
    } catch (error) {
      console.error('Failed to fetch lead:', error);
      router.push('/leads');
    } finally {
      setLoading(false);
    }
  };

  const statusColors: Record<string, string> = {
    'New Lead': 'bg-blue-50 text-blue-600 border-blue-100',
    'Contacted': 'bg-yellow-50 text-yellow-600 border-yellow-100',
    'Qualified': 'bg-purple-50 text-purple-600 border-purple-100',
    'Booked': 'bg-green-50 text-green-600 border-green-100',
    'Lost': 'bg-red-50 text-red-600 border-red-100',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-blue-600" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Lead not found</p>
      </div>
    );
  }

  const ratingNum = typeof lead.rating === 'string' ? parseFloat(lead.rating) : lead.rating;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-64 p-8">
        {/* Back button */}
        <Link href="/leads" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft size={16} />
          Back to Leads
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{lead.business_name}</h1>
            <div className="flex items-center gap-3 mt-2 text-gray-500">
              {lead.industry && (
                <span className="text-sm bg-gray-100 px-2 py-1 rounded capitalize">{lead.industry}</span>
              )}
              <span className="text-sm">{lead.city}{lead.state ? `, ${lead.state}` : ''}</span>
            </div>
          </div>
          <span className={`text-sm font-semibold px-4 py-2 rounded-full border ${
            statusColors[lead.status] || 'bg-gray-50 text-gray-600 border-gray-100'
          }`}>
            {lead.status}
          </span>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {ratingNum && (
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                Rating
              </div>
              <div className="text-2xl font-bold text-gray-900">{ratingNum.toFixed(1)}</div>
              {lead.reviews && (
                <div className="text-xs text-gray-400">{lead.reviews} reviews</div>
              )}
            </div>
          )}
          
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Calendar size={14} />
              Added
            </div>
            <div className="text-lg font-medium text-gray-900">
              {new Date(lead.created_at).toLocaleDateString()}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              Source
            </div>
            <div className="text-lg font-medium text-gray-900">{lead.source || 'Google Maps'}</div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <MapPin size={14} />
              Address
            </div>
            <div className="text-sm font-medium text-gray-900 truncate">{lead.address || 'Not available'}</div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
          <div className="grid grid-cols-3 gap-6">
            {/* Phone */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Phone size={18} className="text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Phone</div>
                {lead.phone ? (
                  <a href={`tel:${lead.phone}`} className="font-medium text-gray-900 hover:text-blue-600">
                    {lead.phone}
                  </a>
                ) : (
                  <span className="text-gray-400">Not available</span>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Mail size={18} className="text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Email</div>
                {lead.email ? (
                  <a href={`mailto:${lead.email}`} className="font-medium text-green-600 hover:underline">
                    {lead.email}
                  </a>
                ) : (
                  <span className="text-gray-400">Not available</span>
                )}
              </div>
            </div>

            {/* Website */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Globe size={18} className="text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Website</div>
                {lead.website ? (
                  <a href={lead.website} target="_blank" rel="noopener noreferrer" className="font-medium text-purple-600 hover:underline flex items-center gap-1">
                    Visit Site
                    <ExternalLink size={12} />
                  </a>
                ) : (
                  <span className="text-gray-400">Not available</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes</h2>
          <p className="text-gray-500">
            {lead.notes || 'No notes yet. Click to add notes.'}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          {lead.phone && (
            <a href={`tel:${lead.phone}`} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Phone size={18} />
              Call Lead
            </a>
          )}
          {lead.email && (
            <a href={`mailto:${lead.email}`} className="border border-gray-200 bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Mail size={18} />
              Send Email
            </a>
          )}
          {lead.website && (
            <a href={lead.website} target="_blank" rel="noopener noreferrer" className="border border-gray-200 bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Globe size={18} />
              View Website
            </a>
          )}
        </div>
      </main>
    </div>
  );
}
