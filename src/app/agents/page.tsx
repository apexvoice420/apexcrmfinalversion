'use client';

import { useState } from 'react';
import Sidebar from '@/components/sidebar';
import { Bot, Plus, Phone, Mic, Settings, Play, Pause, MoreVertical } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  phoneNumber: string;
  voice: string;
  status: 'active' | 'paused';
  callsHandled: number;
  successRate: number;
}

export default function AgentsPage() {
  const [agents] = useState<Agent[]>([
    { id: '1', name: 'Cora - Roofing Receptionist', phoneNumber: '+1 (386) 319-9058', voice: 'Rachel', status: 'active', callsHandled: 342, successRate: 94 },
    { id: '2', name: 'Max - HVAC Assistant', phoneNumber: '+1 (386) 319-9076', voice: 'James', status: 'active', callsHandled: 128, successRate: 91 },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Agents</h1>
            <p className="text-gray-500 mt-1">Configure your AI receptionists</p>
          </div>
          <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus size={18} />
            Create Agent
          </button>
        </div>

        {/* Agents Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {agents.map((agent) => (
            <div key={agent.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {/* Agent Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <Bot size={28} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{agent.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <Phone size={14} />
                        {agent.phoneNumber}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                    <span className="text-sm font-medium text-gray-500 capitalize">{agent.status}</span>
                  </div>
                </div>
              </div>

              {/* Agent Stats */}
              <div className="p-6 bg-gray-50 grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-gray-500 uppercase font-semibold">Voice</div>
                  <div className="font-semibold text-gray-900 mt-1 flex items-center gap-2">
                    <Mic size={14} />
                    {agent.voice}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase font-semibold">Calls</div>
                  <div className="font-semibold text-gray-900 mt-1">{agent.callsHandled}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase font-semibold">Success</div>
                  <div className="font-semibold text-green-600 mt-1">{agent.successRate}%</div>
                </div>
              </div>

              {/* Agent Actions */}
              <div className="p-4 flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium text-gray-700">
                  <Settings size={16} />
                  Configure
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium text-gray-700">
                  {agent.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                  {agent.status === 'active' ? 'Pause' : 'Start'}
                </button>
                <button className="px-3 py-2 hover:bg-gray-100 rounded-lg">
                  <MoreVertical size={18} className="text-gray-400" />
                </button>
              </div>
            </div>
          ))}

          {/* Add New Agent Card */}
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/50 transition-all">
            <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
              <Plus size={28} className="text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900">Create New Agent</h3>
            <p className="text-sm text-gray-500 mt-1">Set up a new AI receptionist</p>
          </div>
        </div>

        {/* Agent Configuration Preview */}
        <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-bold text-lg text-gray-900 mb-4">Quick Configuration</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Agent Greeting</label>
              <textarea
                className="w-full border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
                defaultValue="Hello! Thanks for calling. How can I help you today?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Qualification Questions</label>
              <div className="space-y-2">
                {['What service do you need?', 'What is your zip code?', 'When would you like to schedule?'].map((q, i) => (
                  <input
                    key={i}
                    type="text"
                    defaultValue={q}
                    className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
