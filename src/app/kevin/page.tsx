'use client';

import { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/sidebar';
import { API_URL } from '@/lib/config';
import { DollarSign, TrendingUp, TrendingDown, CreditCard, AlertCircle, MessageCircle, Send, Bot } from 'lucide-react';

interface FinancialData {
  stripe: {
    available: number;
    pending: number;
    totalRevenue: number;
  };
  vapi: {
    totalMinutes: number;
    totalCost: number;
    callsCount: number;
  };
  clients: {
    total: number;
    active: number;
    pendingPayment: number;
  };
  profit: {
    gross: number;
    margin: string;
  };
}

interface Message {
  role: 'user' | 'kevin';
  content: string;
  timestamp: Date;
}

export default function KevinPage() {
  const [financials, setFinancials] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'kevin',
      content: "Yo Maurice. Kevin here. Treasury's open. What you need — revenue numbers, client profitability, burn rate? Ask me anything.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchFinancials();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchFinancials = async () => {
    try {
      const res = await fetch(`${API_URL}/api/kevin/financials`);
      if (res.ok) {
        const data = await res.json();
        setFinancials(data);
      }
    } catch (error) {
      console.error('Failed to fetch financials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || chatLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setChatLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/kevin/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, financials })
      });

      if (res.ok) {
        const data = await res.json();
        const kevinMessage: Message = {
          role: 'kevin',
          content: data.response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, kevinMessage]);
      } else {
        setMessages(prev => [...prev, {
          role: 'kevin',
          content: "Something went wrong on my end. Try again.",
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'kevin',
        content: "Network error. Check the connection.",
        timestamp: new Date()
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  const quickQuestions = [
    "How much we make this week?",
    "Who hasn't paid yet?",
    "What's our VAPI burn rate?",
    "Which client is most profitable?"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <span className="text-2xl">💰</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kevin's Treasury</h1>
            <p className="text-gray-500">CFO Dashboard • Financial Intelligence</p>
          </div>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="animate-pulse grid grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 h-32"></div>
            ))}
          </div>
        ) : financials && (
          <div className="grid grid-cols-4 gap-6 mb-8">
            {/* Revenue */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <DollarSign className="text-green-600" size={24} />
                </div>
                <span className="text-xs text-gray-500">This Month</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                ${financials.stripe.totalRevenue.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 mt-1">Total Revenue</div>
            </div>

            {/* VAPI Costs */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                  <TrendingDown className="text-red-600" size={24} />
                </div>
                <span className="text-xs text-gray-500">Usage</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                ${financials.vapi.totalCost.toFixed(2)}
              </div>
              <div className="text-sm text-gray-500 mt-1">VAPI Costs</div>
            </div>

            {/* Profit */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <TrendingUp className="text-blue-600" size={24} />
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${financials.profit.gross >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {financials.profit.margin}% margin
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                ${financials.profit.gross.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 mt-1">Gross Profit</div>
            </div>

            {/* Clients */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <CreditCard className="text-purple-600" size={24} />
                </div>
                {financials.clients.pendingPayment > 0 && (
                  <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {financials.clients.pendingPayment} pending
                  </span>
                )}
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {financials.clients.active}/{financials.clients.total}
              </div>
              <div className="text-sm text-gray-500 mt-1">Active Clients</div>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Chat with Kevin */}
          <div className="bg-white rounded-2xl border border-gray-100 flex flex-col h-[500px]">
            <div className="p-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <div className="font-semibold">Chat with Kevin</div>
                <div className="text-xs text-gray-500">Your CFO • Always online</div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    {msg.role === 'kevin' && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-green-600">Kevin</span>
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            <div className="px-4 py-2 border-t border-gray-100 flex gap-2 overflow-x-auto">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setInput(q)}
                  className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full whitespace-nowrap transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask Kevin anything..."
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={handleSend}
                  disabled={chatLoading}
                  className="px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Payment Alerts & Activity */}
          <div className="space-y-6">
            {/* Recent Payments */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Payments</h3>
              <div className="space-y-3">
                {financials?.stripe?.totalRevenue === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <CreditCard size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No payments yet</p>
                    <p className="text-xs text-gray-400 mt-1">Close your first client to see activity</p>
                  </div>
                )}
              </div>
            </div>

            {/* VAPI Usage */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">VAPI Usage</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Minutes</span>
                  <span className="font-semibold">{financials?.vapi?.totalMinutes || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Calls</span>
                  <span className="font-semibold">{financials?.vapi?.callsCount || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Avg Cost/Call</span>
                  <span className="font-semibold">
                    ${financials?.vapi?.callsCount 
                      ? (financials.vapi.totalCost / financials.vapi.callsCount).toFixed(2) 
                      : '0.00'}
                  </span>
                </div>
              </div>
            </div>

            {/* Profitability Tips */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white">
              <h3 className="font-bold mb-2">💰 Kevin's Tip</h3>
              <p className="text-green-100 text-sm">
                {financials?.stripe?.totalRevenue === 0 
                  ? "You're in the red right now. Time to close some deals. The tech is ready — go get that first check."
                  : "Revenue is flowing. Keep an eye on VAPI costs per client — if anyone's burning minutes without paying, that's a problem."
                }
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
