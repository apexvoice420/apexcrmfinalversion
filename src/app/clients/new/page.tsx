'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/sidebar';
import { 
  Building, User, Phone, Mail, MapPin, Industry, 
  Calendar, MessageSquare, Mic, Loader2, ArrowLeft,
  CheckCircle, AlertCircle
} from 'lucide-react';
import { API_URL } from '@/lib/config';

const INDUSTRIES = [
  { value: 'roofing', label: 'Roofing', icon: '🏠' },
  { value: 'plumbing', label: 'Plumbing', icon: '🔧' },
  { value: 'hvac', label: 'HVAC', icon: '❄️' },
  { value: 'electrical', label: 'Electrical', icon: '⚡' },
  { value: 'medical', label: 'Medical/Dental', icon: '🏥' },
  { value: 'landscaping', label: 'Landscaping', icon: '🌳' },
  { value: 'other', label: 'Other', icon: '🏗️' },
];

const STEPS = [
  { id: 1, title: 'Business Info', description: 'Basic company details' },
  { id: 2, title: 'Contact Info', description: 'Phone and email' },
  { id: 3, title: 'AI Setup', description: 'Configure the receptionist' },
  { id: 4, title: 'Review', description: 'Confirm and create' },
];

export default function NewClientPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    // Business Info
    businessName: '',
    industry: 'roofing',
    address: '',
    city: '',
    state: '',
    zip: '',
    // Contact Info
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    businessPhone: '',
    // AI Setup
    greeting: '',
    voiceStyle: 'professional',
    escalationPhone: '',
    businessHours: '24/7',
    services: '',
    faq: '',
  });

  const updateForm = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`${API_URL}/api/clients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create client');
      }

      router.push('/clients');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Business Name *
              </label>
              <div className="relative">
                <Building size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => updateForm('businessName', e.target.value)}
                  placeholder="ABC Roofing Company"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Industry *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {INDUSTRIES.map((ind) => (
                  <button
                    key={ind.value}
                    type="button"
                    onClick={() => updateForm('industry', ind.value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      formData.industry === ind.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl">{ind.icon}</span>
                    <p className="font-medium text-gray-900 mt-2">{ind.label}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => updateForm('city', e.target.value)}
                  placeholder="Daytona Beach"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => updateForm('state', e.target.value)}
                  placeholder="FL"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Primary Contact Name *
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={formData.contactName}
                  onChange={(e) => updateForm('contactName', e.target.value)}
                  placeholder="John Smith"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Business Phone (the line we'll forward to) *
              </label>
              <div className="relative">
                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  value={formData.businessPhone}
                  onChange={(e) => updateForm('businessPhone', e.target.value)}
                  placeholder="+1 (386) 555-1234"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">This is where calls get transferred for emergencies</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contact Email *
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => updateForm('contactEmail', e.target.value)}
                  placeholder="john@abcroofing.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mobile Phone (for urgent alerts)
              </label>
              <div className="relative">
                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  value={formData.escalationPhone}
                  onChange={(e) => updateForm('escalationPhone', e.target.value)}
                  placeholder="+1 (386) 555-5678"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Emergency calls will be texted to this number</p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                AI Greeting Message
              </label>
              <div className="relative">
                <MessageSquare size={18} className="absolute left-3 top-3 text-gray-400" />
                <textarea
                  value={formData.greeting}
                  onChange={(e) => updateForm('greeting', e.target.value)}
                  placeholder="Thank you for calling {business_name}. This is your AI assistant. How can I help you today?"
                  rows={3}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Use {'{business_name}'} to auto-insert the company name</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Voice Style
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'professional', label: 'Professional', desc: 'Polished & corporate' },
                  { value: 'friendly', label: 'Friendly', desc: 'Warm & conversational' },
                  { value: 'casual', label: 'Casual', desc: 'Relaxed & approachable' },
                ].map((style) => (
                  <button
                    key={style.value}
                    type="button"
                    onClick={() => updateForm('voiceStyle', style.value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      formData.voiceStyle === style.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Mic size={20} className="text-gray-600" />
                    <p className="font-medium text-gray-900 mt-2">{style.label}</p>
                    <p className="text-xs text-gray-500">{style.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Services Offered
              </label>
              <textarea
                value={formData.services}
                onChange={(e) => updateForm('services', e.target.value)}
                placeholder="Roof repair, roof replacement, gutter installation, emergency tarping..."
                rows={2}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">List the services the AI should know about</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Common FAQs (optional)
              </label>
              <textarea
                value={formData.faq}
                onChange={(e) => updateForm('faq', e.target.value)}
                placeholder="Q: What are your hours? A: We're available 24/7 for emergencies...&#10;Q: Do you offer free estimates? A: Yes, we provide free estimates for all jobs..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <CheckCircle size={20} className="text-green-500" />
                Review Client Setup
              </h3>
              <p className="text-sm text-gray-600 mt-1">Confirm the details below to create the client account</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Building size={16} />
                  Business Info
                </h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500">Name:</span> <span className="font-medium">{formData.businessName || 'Not set'}</span></p>
                  <p><span className="text-gray-500">Industry:</span> <span className="font-medium capitalize">{formData.industry}</span></p>
                  <p><span className="text-gray-500">Location:</span> <span className="font-medium">{formData.city}, {formData.state}</span></p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Phone size={16} />
                  Contact Info
                </h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500">Contact:</span> <span className="font-medium">{formData.contactName || 'Not set'}</span></p>
                  <p><span className="text-gray-500">Business Phone:</span> <span className="font-medium">{formData.businessPhone || 'Not set'}</span></p>
                  <p><span className="text-gray-500">Email:</span> <span className="font-medium">{formData.contactEmail || 'Not set'}</span></p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Mic size={16} />
                AI Configuration
              </h4>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-500">Voice Style:</span> <span className="font-medium capitalize">{formData.voiceStyle}</span></p>
                <p><span className="text-gray-500">Greeting:</span> <span className="font-medium">{formData.greeting?.slice(0, 60)}{formData.greeting?.length > 60 ? '...' : ''}</span></p>
                <p><span className="text-gray-500">Services:</span> <span className="font-medium">{formData.services?.slice(0, 60)}{formData.services?.length > 60 ? '...' : ''}</span></p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700">
                <AlertCircle size={20} />
                {error}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-64 p-8">
        {/* Back Button */}
        <button 
          onClick={() => router.push('/clients')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={18} />
          Back to Clients
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Client</h1>
          <p className="text-gray-500 mt-1">Set up their AI receptionist in a few steps</p>
        </div>

        {/* Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                  step >= s.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > s.id ? <CheckCircle size={20} /> : s.id}
                </div>
                <div className="ml-3 hidden md:block">
                  <p className={`font-medium ${step >= s.id ? 'text-gray-900' : 'text-gray-400'}`}>{s.title}</p>
                  <p className="text-xs text-gray-400">{s.description}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`h-1 w-16 mx-4 rounded ${step > s.id ? 'bg-blue-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          {renderStep()}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className="px-6 py-2.5 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {step < 4 ? (
              <button
                onClick={nextStep}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                {loading && <Loader2 size={18} className="animate-spin" />}
                Create Client
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
