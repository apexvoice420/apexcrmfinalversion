'use client';

import { useState } from 'react';
import Sidebar from '@/components/sidebar';
import { Check, X, Star, Zap, Crown, Settings, HelpCircle, Phone, Mail, Shield, ArrowRight } from 'lucide-react';

const tiers = [
  {
    id: 'full-service',
    name: 'Full Service',
    icon: Crown,
    tagline: 'We handle everything',
    color: 'purple',
    popular: true,
    setupFee: 1500,
    monthly: 500,
    features: [
      { text: 'AI receptionist setup', included: true },
      { text: 'VAPI phone number', included: true },
      { text: 'We manage all updates', included: true },
      { text: '24/7 monitoring', included: true },
      { text: 'Priority support', included: true },
      { text: 'Monthly call reports', included: true },
      { text: 'Unlimited changes', included: true },
      { text: 'Client self-service portal', included: false },
      { text: 'Own the VAPI assistant', included: false },
    ],
    clientAccess: 'None — you manage everything',
    supportLevel: 'Priority — same day response',
    bestFor: 'Businesses that want zero technical headaches',
  },
  {
    id: 'self-service',
    name: 'Self-Service',
    icon: Settings,
    tagline: 'You manage, we host',
    color: 'blue',
    popular: false,
    setupFee: 2500,
    monthly: 150,
    features: [
      { text: 'AI receptionist setup', included: true },
      { text: 'VAPI phone number', included: true },
      { text: 'We manage all updates', included: false },
      { text: '24/7 monitoring', included: true },
      { text: 'Priority support', included: false },
      { text: 'Monthly call reports', included: true },
      { text: 'Unlimited changes', included: false },
      { text: 'Client self-service portal', included: true },
      { text: 'Own the VAPI assistant', included: false },
    ],
    clientAccess: 'Portal access — edit greeting, FAQ, hours',
    supportLevel: 'Standard — 48hr response, $75/hr after',
    bestFor: 'Businesses with someone tech-savvy on staff',
  },
  {
    id: 'white-label',
    name: 'White-Label Portal',
    icon: Star,
    tagline: 'Your brand, our tech',
    color: 'green',
    popular: false,
    setupFee: 3500,
    monthly: 250,
    features: [
      { text: 'AI receptionist setup', included: true },
      { text: 'VAPI phone number', included: true },
      { text: 'We manage all updates', included: false },
      { text: '24/7 monitoring', included: true },
      { text: 'Priority support', included: true },
      { text: 'Monthly call reports', included: true },
      { text: 'Unlimited changes', included: false },
      { text: 'Client self-service portal', included: true },
      { text: 'Your branding on portal', included: true },
    ],
    clientAccess: 'Full branded portal — looks like your app',
    supportLevel: 'Priority — same day response',
    bestFor: 'Agencies reselling AI receptionists',
  },
  {
    id: 'handoff',
    name: 'One-Time Handoff',
    icon: Zap,
    tagline: 'We build, you own it',
    color: 'orange',
    popular: false,
    setupFee: 3500,
    monthly: 0,
    features: [
      { text: 'AI receptionist setup', included: true },
      { text: 'VAPI phone number', included: true },
      { text: 'We manage all updates', included: false },
      { text: '24/7 monitoring', included: false },
      { text: 'Priority support', included: false },
      { text: 'Monthly call reports', included: false },
      { text: 'Unlimited changes', included: false },
      { text: 'Client self-service portal', included: false },
      { text: 'Own the VAPI assistant', included: true },
    ],
    clientAccess: 'Full VAPI account ownership',
    supportLevel: 'None — $150/hr support available',
    bestFor: 'Tech-savvy businesses that want full control',
  },
];

export default function PricingTiersPage() {
  const [selectedTier, setSelectedTier] = useState('full-service');

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Pricing Tiers
          </h1>
          <p className="text-gray-500 text-lg">
            Four ways to serve your clients. Choose what fits their needs.
          </p>
        </div>

        {/* Tier Cards */}
        <div className="grid grid-cols-4 gap-6 mb-10">
          {tiers.map((tier) => {
            const Icon = tier.icon;
            const isSelected = selectedTier === tier.id;
            const colors = {
              purple: 'from-purple-500 to-purple-600',
              blue: 'from-blue-500 to-blue-600',
              green: 'from-green-500 to-green-600',
              orange: 'from-orange-500 to-orange-600',
            };

            return (
              <div
                key={tier.id}
                onClick={() => setSelectedTier(tier.id)}
                className={`relative bg-white rounded-2xl border-2 cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-blue-500 shadow-lg scale-105' 
                    : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                
                <div className={`h-2 rounded-t-2xl bg-gradient-to-r ${colors[tier.color as keyof typeof colors]}`} />
                
                <div className="p-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${colors[tier.color as keyof typeof colors]} flex items-center justify-center mb-4`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{tier.name}</h3>
                  <p className="text-gray-500 text-sm mb-4">{tier.tagline}</p>
                  
                  <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-gray-900">${tier.setupFee}</span>
                      <span className="text-gray-500">setup</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-semibold text-gray-700">${tier.monthly}</span>
                      <span className="text-gray-500">/month</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {tier.features.slice(0, 5).map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        {feature.included ? (
                          <Check className="text-green-500 flex-shrink-0" size={16} />
                        ) : (
                          <X className="text-gray-300 flex-shrink-0" size={16} />
                        )}
                        <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Tier Details */}
        {(() => {
          const tier = tiers.find(t => t.id === selectedTier)!;
          const Icon = tier.icon;
          const colors = {
            purple: 'from-purple-500 to-purple-600',
            blue: 'from-blue-500 to-blue-600',
            green: 'from-green-500 to-green-600',
            orange: 'from-orange-500 to-orange-600',
          };

          return (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-10">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${colors[tier.color as keyof typeof colors]} flex items-center justify-center`}>
                  <Icon className="text-white" size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{tier.name}</h2>
                  <p className="text-gray-500">{tier.tagline}</p>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Features */}
                <div className="lg:col-span-2">
                  <h3 className="font-semibold text-gray-900 mb-4">What's Included</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {tier.features.map((feature, i) => (
                      <div key={i} className={`flex items-center gap-2 p-3 rounded-lg ${
                        feature.included ? 'bg-green-50' : 'bg-gray-50'
                      }`}>
                        {feature.included ? (
                          <Check className="text-green-500" size={18} />
                        ) : (
                          <X className="text-gray-300" size={18} />
                        )}
                        <span className={`text-sm ${feature.included ? 'text-gray-700' : 'text-gray-400'}`}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-6">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Shield size={18} />
                      <span className="font-medium">Client Access</span>
                    </div>
                    <p className="text-sm text-gray-700">{tier.clientAccess}</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <HelpCircle size={18} />
                      <span className="font-medium">Support Level</span>
                    </div>
                    <p className="text-sm text-gray-700">{tier.supportLevel}</p>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-center gap-2 text-blue-600 mb-2">
                      <Star size={18} />
                      <span className="font-medium">Best For</span>
                    </div>
                    <p className="text-sm text-blue-700">{tier.bestFor}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Comparison Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-10">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Quick Comparison</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-900">Feature</th>
                  {tiers.map(tier => (
                    <th key={tier.id} className="text-center p-4 font-semibold text-gray-900">
                      {tier.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="p-4 font-medium text-gray-900">Setup Fee</td>
                  {tiers.map(tier => (
                    <td key={tier.id} className="p-4 text-center font-bold text-gray-900">
                      ${tier.setupFee}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-medium text-gray-900">Monthly Fee</td>
                  {tiers.map(tier => (
                    <td key={tier.id} className="p-4 text-center font-bold text-gray-900">
                      {tier.monthly === 0 ? '$0' : `$${tier.monthly}`}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-medium text-gray-900">First Year Revenue</td>
                  {tiers.map(tier => (
                    <td key={tier.id} className="p-4 text-center">
                      <span className="font-bold text-green-600">
                        ${(tier.setupFee + (tier.monthly * 12)).toLocaleString()}
                      </span>
                    </td>
                  ))}
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">Client Self-Service Portal</td>
                  {tiers.map(tier => (
                    <td key={tier.id} className="p-4 text-center">
                      {tier.features.find(f => f.text === 'Client self-service portal')?.included ? (
                        <Check className="inline text-green-500" size={20} />
                      ) : (
                        <X className="inline text-gray-300" size={20} />
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-medium text-gray-900">Client Owns Assistant</td>
                  {tiers.map(tier => (
                    <td key={tier.id} className="p-4 text-center">
                      {tier.features.find(f => f.text === 'Own the VAPI assistant')?.included ? (
                        <Check className="inline text-green-500" size={20} />
                      ) : (
                        <X className="inline text-gray-300" size={20} />
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">Priority Support</td>
                  {tiers.map(tier => (
                    <td key={tier.id} className="p-4 text-center">
                      {tier.features.find(f => f.text === 'Priority support')?.included ? (
                        <Check className="inline text-green-500" size={20} />
                      ) : (
                        <X className="inline text-gray-300" size={20} />
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-medium text-gray-900">We Manage Updates</td>
                  {tiers.map(tier => (
                    <td key={tier.id} className="p-4 text-center">
                      {tier.features.find(f => f.text === 'We manage all updates')?.included ? (
                        <Check className="inline text-green-500" size={20} />
                      ) : (
                        <X className="inline text-gray-300" size={20} />
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* How to Sell */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">How to Pitch Each Tier</h2>
          <div className="grid lg:grid-cols-4 gap-6">
            <div>
              <h3 className="font-bold mb-2">Full Service</h3>
              <p className="text-blue-100 text-sm">
                "You focus on your business, we handle the AI. If anything breaks, we fix it. That's what the monthly covers."
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Self-Service</h3>
              <p className="text-blue-100 text-sm">
                "You get a portal to manage your AI receptionist. Change greetings, add FAQs, update hours — all without calling us."
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2">White-Label</h3>
              <p className="text-blue-100 text-sm">
                "Your branding, our tech. Looks like your app to your clients. Perfect for agencies reselling AI services."
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2">One-Time Handoff</h3>
              <p className="text-blue-100 text-sm">
                "We build it, you own it. No monthly fees. Full control. Support available if you need it."
              </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
