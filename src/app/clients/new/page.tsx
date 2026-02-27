'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/sidebar';
import { 
  Building, User, Phone, Mail, MapPin, Briefcase, 
  Calendar, MessageSquare, Mic, Loader2, ArrowLeft,
  CheckCircle, AlertCircle, FileText, Upload, X
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
  { id: 4, title: 'Documents', description: 'Upload business files' },
  { id: 5, title: 'Review', description: 'Confirm and create' },
];

export default function NewClientPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  
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
  
  // Documents state
  const [documents, setDocuments] = useState<{
    servicesPdf: File | null;
    pricingSheet: File | null;
    faqDoc: File | null;
    customScript: File | null;
  }>({
    servicesPdf: null,
    pricingSheet: null,
    faqDoc: null,
    customScript: null,
  });

  const updateForm = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (step < 5) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('auth_token');
      
      // Create client
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

      const { client } = await res.json();
      
      // Upload documents if any
      const docsToUpload = Object.entries(documents).filter(([_, file]) => file !== null);
      
      if (docsToUpload.length > 0 && client?.id) {
        const docTypeMap: Record<string, string> = {
          servicesPdf: 'services_pdf',
          pricingSheet: 'pricing_sheet',
          faqDoc: 'faq_document',
          customScript: 'custom_script',
        };
        
        for (const [key, file] of docsToUpload) {
          const docFormData = new FormData();
          docFormData.append('document', file as File);
          docFormData.append('documentType', docTypeMap[key]);
          
          try {
            await fetch(`${API_URL}/api/clients/${client.id}/documents`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`
              },
              body: docFormData
            });
          } catch (uploadErr) {
            console.error('Document upload failed:', uploadErr);
            // Continue even if upload fails
          }
        }
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
                Briefcase *
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
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <FileText size={20} className="text-purple-500" />
                Upload Documents (Optional)
              </h3>
              <p className="text-sm text-gray-600 mt-1">Upload business documents to help train the AI receptionist</p>
            </div>

            {/* Services PDF */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">Services PDF</h4>
                  <p className="text-xs text-gray-500">List of services your business offers</p>
                </div>
                {documents.servicesPdf && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle size={12} />
                    Attached
                  </span>
                )}
              </div>
              <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl p-4 cursor-pointer hover:border-purple-300 hover:bg-purple-50 transition-colors">
                <Upload size={20} className="text-gray-400" />
                <span className="text-sm text-gray-600">
                  {documents.servicesPdf ? documents.servicesPdf.name : 'Click to upload PDF'}
                </span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setDocuments(prev => ({ ...prev, servicesPdf: file }));
                  }}
                />
              </label>
              {documents.servicesPdf && (
                <button
                  onClick={() => setDocuments(prev => ({ ...prev, servicesPdf: null }))}
                  className="mt-2 text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                >
                  <X size={12} /> Remove
                </button>
              )}
            </div>

            {/* Pricing Sheet */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">Pricing Sheet</h4>
                  <p className="text-xs text-gray-500">Your service pricing information</p>
                </div>
                {documents.pricingSheet && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle size={12} />
                    Attached
                  </span>
                )}
              </div>
              <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl p-4 cursor-pointer hover:border-purple-300 hover:bg-purple-50 transition-colors">
                <Upload size={20} className="text-gray-400" />
                <span className="text-sm text-gray-600">
                  {documents.pricingSheet ? documents.pricingSheet.name : 'Click to upload'}
                </span>
                <input
                  type="file"
                  accept=".pdf,.csv,.xlsx,.xls,.doc,.docx,.txt"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setDocuments(prev => ({ ...prev, pricingSheet: file }));
                  }}
                />
              </label>
              {documents.pricingSheet && (
                <button
                  onClick={() => setDocuments(prev => ({ ...prev, pricingSheet: null }))}
                  className="mt-2 text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                >
                  <X size={12} /> Remove
                </button>
              )}
            </div>

            {/* FAQ Document */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">FAQ Document</h4>
                  <p className="text-xs text-gray-500">Common questions and answers for the AI</p>
                </div>
                {documents.faqDoc && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle size={12} />
                    Attached
                  </span>
                )}
              </div>
              <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl p-4 cursor-pointer hover:border-purple-300 hover:bg-purple-50 transition-colors">
                <Upload size={20} className="text-gray-400" />
                <span className="text-sm text-gray-600">
                  {documents.faqDoc ? documents.faqDoc.name : 'Click to upload'}
                </span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setDocuments(prev => ({ ...prev, faqDoc: file }));
                  }}
                />
              </label>
              {documents.faqDoc && (
                <button
                  onClick={() => setDocuments(prev => ({ ...prev, faqDoc: null }))}
                  className="mt-2 text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                >
                  <X size={12} /> Remove
                </button>
              )}
            </div>

            {/* Custom Script */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">Custom Scripts</h4>
                  <p className="text-xs text-gray-500">Special call handling instructions or scripts</p>
                </div>
                {documents.customScript && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle size={12} />
                    Attached
                  </span>
                )}
              </div>
              <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl p-4 cursor-pointer hover:border-purple-300 hover:bg-purple-50 transition-colors">
                <Upload size={20} className="text-gray-400" />
                <span className="text-sm text-gray-600">
                  {documents.customScript ? documents.customScript.name : 'Click to upload'}
                </span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setDocuments(prev => ({ ...prev, customScript: file }));
                  }}
                />
              </label>
              {documents.customScript && (
                <button
                  onClick={() => setDocuments(prev => ({ ...prev, customScript: null }))}
                  className="mt-2 text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                >
                  <X size={12} /> Remove
                </button>
              )}
            </div>

            <p className="text-xs text-gray-400 text-center">
              Supported formats: PDF, DOC, DOCX, TXT, CSV, XLS (max 10MB each)
            </p>
          </div>
        );

      case 5:
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
                  <p><span className="text-gray-500">Briefcase:</span> <span className="font-medium capitalize">{formData.industry}</span></p>
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

            {/* Documents Summary */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileText size={16} />
                Documents
              </h4>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-500">Services PDF:</span> <span className="font-medium">{documents.servicesPdf ? documents.servicesPdf.name : 'Not uploaded'}</span></p>
                <p><span className="text-gray-500">Pricing Sheet:</span> <span className="font-medium">{documents.pricingSheet ? documents.pricingSheet.name : 'Not uploaded'}</span></p>
                <p><span className="text-gray-500">FAQ Document:</span> <span className="font-medium">{documents.faqDoc ? documents.faqDoc.name : 'Not uploaded'}</span></p>
                <p><span className="text-gray-500">Custom Script:</span> <span className="font-medium">{documents.customScript ? documents.customScript.name : 'Not uploaded'}</span></p>
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

            {step < 5 ? (
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
