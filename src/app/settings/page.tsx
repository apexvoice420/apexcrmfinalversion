'use client';

import Sidebar from '@/components/sidebar';
import { Building, Bell, CreditCard, Shield, Users, Phone } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-64 p-8">
        <div className="max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-500 mt-1">Manage your account and preferences</p>
          </div>

          {/* Settings Sections */}
          <div className="space-y-6">
            {/* Business Profile */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <Building size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Business Profile</h3>
                  <p className="text-sm text-gray-500">Your company information</p>
                </div>
              </div>
              <div className="p-6 grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                  <input
                    type="text"
                    defaultValue="Apex Voice Solutions"
                    className="w-full border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                  <select className="w-full border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Roofing</option>
                    <option>HVAC</option>
                    <option>Plumbing</option>
                    <option>Electrical</option>
                    <option>Medical</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    defaultValue="+1 (386) 319-9058"
                    className="w-full border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue="apexvoicesolutions@gmail.com"
                    className="w-full border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="p-6 bg-gray-50 flex justify-end">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Save Changes
                </button>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                  <Bell size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  <p className="text-sm text-gray-500">How you want to be notified</p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { label: 'SMS summaries after each call', checked: true },
                  { label: 'Email digest (daily)', checked: true },
                  { label: 'Emergency escalation alerts', checked: true },
                  { label: 'New lead notifications', checked: false },
                ].map((item, i) => (
                  <label key={i} className="flex items-center justify-between cursor-pointer">
                    <span className="text-gray-700">{item.label}</span>
                    <input
                      type="checkbox"
                      defaultChecked={item.checked}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* API Keys */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                  <Shield size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">API Keys</h3>
                  <p className="text-sm text-gray-500">Integrate with external services</p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">VAPI API Key</div>
                    <div className="text-sm text-gray-500">For voice AI integration</div>
                  </div>
                  <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm font-medium">
                    Connected
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">Twilio</div>
                    <div className="text-sm text-gray-500">For SMS notifications</div>
                  </div>
                  <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm font-medium">
                    Connected
                  </span>
                </div>
              </div>
            </div>

            {/* Billing */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center text-yellow-600">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Billing & Usage</h3>
                  <p className="text-sm text-gray-500">Manage your subscription</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="font-semibold text-gray-900">Current Plan: Business</div>
                    <div className="text-sm text-gray-500">$499/month • 2,500 call minutes included</div>
                  </div>
                  <button className="border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 font-medium">
                    Upgrade Plan
                  </button>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">Minutes Used This Month</span>
                    <span className="font-semibold">1,247 / 2,500</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
