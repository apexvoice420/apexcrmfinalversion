'use client';

import Sidebar from '@/components/sidebar';
import { 
  Check, X, TrendingUp, DollarSign, Zap, Shield, Bot, 
  Phone, Mail, Calendar, BarChart3, Users, Settings,
  ArrowUpRight, Star
} from 'lucide-react';

export default function ComparePage() {
  const features = [
    { 
      feature: 'AI Voice Receptionist', 
      ghl: false, 
      apex: true, 
      note: 'GHL needs 3rd party integrations' 
    },
    { 
      feature: 'VAPI Native Integration', 
      ghl: false, 
      apex: true, 
      note: 'Built-in from day one' 
    },
    { 
      feature: 'Monthly Cost', 
      ghl: '$97-497/mo', 
      apex: '$0', 
      note: 'You own the stack',
      isPrice: true
    },
    { 
      feature: 'Setup Fee Potential', 
      ghl: '$0 (you lose it)', 
      apex: '$500-3,500/client', 
      note: 'Revenue stays with you',
      isPrice: true
    },
    { 
      feature: 'White Label', 
      ghl: '$297+/mo', 
      apex: 'Always included', 
      note: 'Your branding, always' 
    },
    { 
      feature: 'Lead Scraper', 
      ghl: false, 
      apex: true, 
      note: 'Google Maps scraping built-in' 
    },
    { 
      feature: 'Email Outreach (Agent E)', 
      ghl: 'Extra cost', 
      apex: true, 
      note: 'Resend integrated' 
    },
    { 
      feature: 'SMS Notifications', 
      ghl: true, 
      apex: true, 
      note: 'Both have it' 
    },
    { 
      feature: 'Calendar Booking', 
      ghl: true, 
      apex: true, 
      note: 'Cal.com integrated' 
    },
    { 
      feature: 'Custom AI Agents', 
      ghl: 'Limited', 
      apex: true, 
      note: 'Full VAPI control' 
    },
    { 
      feature: 'Stripe Integration', 
      ghl: true, 
      apex: true, 
      note: 'Both have it' 
    },
    { 
      feature: 'Kevin CFO Dashboard', 
      ghl: false, 
      apex: true, 
      note: 'AI financial advisor' 
    },
    { 
      feature: 'Source Code Ownership', 
      ghl: false, 
      apex: true, 
      note: 'You own everything' 
    },
    { 
      feature: 'API Access', 
      ghl: 'Limited', 
      apex: 'Full', 
      note: 'Complete control' 
    },
    { 
      feature: 'Data Portability', 
      ghl: 'Locked', 
      apex: 'Yours', 
      note: 'Your data, your rules' 
    },
  ];

  const costComparison = [
    { year: 'Year 1', ghl: 3564, apex: 0 },
    { year: 'Year 2', ghl: 7128, apex: 0 },
    { year: 'Year 3', ghl: 10692, apex: 0 },
  ];

  const revenuePotential = [
    { clients: '5 clients', setup: 2500, monthly: 1250, annual: 17500 },
    { clients: '10 clients', setup: 5000, monthly: 2500, annual: 35000 },
    { clients: '20 clients', setup: 10000, monthly: 5000, annual: 70000 },
    { clients: '50 clients', setup: 25000, monthly: 12500, annual: 175000 },
  ];

  const totalFeatures = features.length;
  const apexOnly = features.filter(f => f.apex && !f.ghl).length;
  const ghlOnly = features.filter(f => f.ghl && !f.apex).length;
  const both = features.filter(f => f.apex && f.ghl).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Apex Voice vs GoHighLevel
          </h1>
          <p className="text-gray-500 text-lg">
            Built for AI Voice Agencies. No subscription. No limits.
          </p>
        </div>

        {/* Hero Stats */}
        <div className="grid grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="text-3xl font-bold text-green-600">{apexOnly}</div>
            <div className="text-gray-500 text-sm">Exclusive Features</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="text-3xl font-bold text-blue-600">{both}</div>
            <div className="text-gray-500 text-sm">Shared Features</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="text-3xl font-bold text-emerald-600">$0</div>
            <div className="text-gray-500 text-sm">Monthly Cost</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="text-3xl font-bold text-purple-600">100%</div>
            <div className="text-gray-500 text-sm">Code Ownership</div>
          </div>
        </div>

        {/* Cost Comparison Chart */}
        <div className="grid lg:grid-cols-2 gap-8 mb-10">
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <DollarSign className="text-green-600" />
              3-Year Cost Comparison
            </h2>
            <div className="space-y-4">
              {costComparison.map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">{item.year}</span>
                    <div className="flex gap-8">
                      <span className="text-red-500 font-medium">GHL: ${item.ghl.toLocaleString()}</span>
                      <span className="text-green-600 font-bold">Apex: ${item.apex}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div 
                      className="h-8 bg-red-100 rounded-lg flex items-center justify-end pr-3 text-xs font-bold text-red-600"
                      style={{ width: '100%' }}
                    >
                      ${item.ghl.toLocaleString()}
                    </div>
                    <div 
                      className="h-8 bg-green-100 rounded-lg flex items-center pl-3 text-xs font-bold text-green-600"
                      style={{ width: '10%' }}
                    >
                      $0
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-green-50 rounded-xl">
              <div className="flex items-center gap-2 text-green-700 font-bold">
                <ArrowUpRight size={20} />
                You save $10,692 over 3 years
              </div>
            </div>
          </div>

          {/* Revenue Potential */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp className="text-blue-600" />
              Revenue Potential (Apex Only)
            </h2>
            <div className="space-y-3">
              {revenuePotential.map((item, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-900">{item.clients}</span>
                    <span className="text-2xl font-bold text-green-600">
                      ${item.annual.toLocaleString()}/yr
                    </span>
                  </div>
                  <div className="flex gap-4 text-xs text-gray-500">
                    <span>Setup: ${item.setup.toLocaleString()}</span>
                    <span>Monthly: ${item.monthly.toLocaleString()}</span>
                  </div>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                      style={{ width: `${(i + 1) * 25}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature Matrix */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-10">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Feature Comparison</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-900">Feature</th>
                  <th className="text-center p-4 font-semibold text-gray-900">
                    <div className="flex items-center justify-center gap-2">
                      GoHighLevel
                    </div>
                  </th>
                  <th className="text-center p-4 font-semibold text-gray-900">
                    <div className="flex items-center justify-center gap-2">
                      <Star className="text-yellow-500" size={16} />
                      Apex Voice
                    </div>
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-900">Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {features.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900">{item.feature}</td>
                    <td className="p-4 text-center">
                      {item.isPrice ? (
                        <span className="text-red-500 font-medium">{item.ghl}</span>
                      ) : item.ghl === true ? (
                        <Check className="inline text-green-500" size={24} />
                      ) : item.ghl === false ? (
                        <X className="inline text-red-400" size={24} />
                      ) : (
                        <span className="text-gray-500">{item.ghl}</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {item.isPrice ? (
                        <span className="text-green-600 font-bold">{item.apex}</span>
                      ) : item.apex === true ? (
                        <Check className="inline text-green-500" size={24} />
                      ) : item.apex === false ? (
                        <X className="inline text-red-400" size={24} />
                      ) : (
                        <span className="text-green-600 font-medium">{item.apex}</span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-gray-500">{item.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="grid lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
            <Bot className="mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2">Built for AI Voice</h3>
            <p className="text-blue-100">
              VAPI native. AI receptionists out of the box. No duct-taping 3rd party tools.
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-6 text-white">
            <DollarSign className="mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2">Keep Your Revenue</h3>
            <p className="text-green-100">
              No monthly fees eating your margins. $500-3,500 setup fees go straight to you.
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-6 text-white">
            <Shield className="mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2">You Own It</h3>
            <p className="text-purple-100">
              Full source code. Your servers. Your data. No vendor lock-in. No surprises.
            </p>
          </div>
        </div>

        {/* Feature Breakdown Pie Chart */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Feature Distribution</h2>
          <div className="flex items-center justify-center gap-12">
            {/* Simple visual pie representation */}
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 36 36" className="w-full h-full">
                {/* Apex Only - Green */}
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="4"
                  strokeDasharray={`${(apexOnly / totalFeatures) * 100}, 100`}
                />
                {/* Both - Blue */}
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="4"
                  strokeDasharray={`${(both / totalFeatures) * 100}, 100`}
                  strokeDashoffset={`-${(apexOnly / totalFeatures) * 100}`}
                />
                {/* GHL Only - Red */}
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="4"
                  strokeDasharray={`${(ghlOnly / totalFeatures) * 100}, 100`}
                  strokeDashoffset={`-${((apexOnly + both) / totalFeatures) * 100}`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{totalFeatures}</div>
                  <div className="text-xs text-gray-500">Features</div>
                </div>
              </div>
            </div>
            
            {/* Legend */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded bg-green-500"></div>
                <span className="text-gray-700"><strong>{apexOnly}</strong> Apex Only</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded bg-blue-500"></div>
                <span className="text-gray-700"><strong>{both}</strong> Both Have</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded bg-red-500"></div>
                <span className="text-gray-700"><strong>{ghlOnly}</strong> GHL Only</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center text-gray-500 text-sm">
          Built with 💎 by Apex Voice Solutions • {new Date().getFullYear()}
        </div>
      </main>
    </div>
  );
}
