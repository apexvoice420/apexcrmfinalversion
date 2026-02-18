'use client';

import { useState } from 'react';
import Sidebar from '@/components/sidebar';
import { MessageSquare, Send, Phone, Search } from 'lucide-react';

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>('1');

  const conversations = [
    { id: '1', name: 'John Peterson', phone: '+1 555-0101', lastMessage: 'Thanks for the quick response!', time: '2m ago', unread: true },
    { id: '2', name: 'Sarah Miller', phone: '+1 555-0102', lastMessage: 'Confirmed for tomorrow at 2pm', time: '1h ago', unread: false },
    { id: '3', name: 'Mike Ross', phone: '+1 555-0103', lastMessage: 'Can you send me a quote?', time: '3h ago', unread: false },
  ];

  const messages = [
    { id: '1', from: 'ai', text: 'Hi John! This is a follow-up from your call. Your roof inspection is scheduled for tomorrow at 9 AM.', time: '10:30 AM' },
    { id: '2', from: 'customer', text: 'Perfect, thanks for confirming!', time: '10:32 AM' },
    { id: '3', from: 'ai', text: 'You\'re welcome! Is there anything else you need help with?', time: '10:33 AM' },
    { id: '4', from: 'customer', text: 'Thanks for the quick response!', time: '10:35 AM' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-64 flex h-screen">
        {/* Conversations List */}
        <div className="w-80 border-r border-gray-200 bg-white">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="overflow-y-auto">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedChat(conv.id)}
                className={`p-4 cursor-pointer transition-colors ${
                  selectedChat === conv.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-600">
                    {conv.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">{conv.name}</span>
                      <span className="text-xs text-gray-400">{conv.time}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 truncate">{conv.lastMessage}</span>
                      {conv.unread && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-600">
                    J
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">John Peterson</div>
                    <div className="text-sm text-gray-500">+1 555-0101</div>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg text-blue-600">
                  <Phone size={20} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.from === 'ai' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-md px-4 py-3 rounded-2xl ${
                        msg.from === 'ai'
                          ? 'bg-gray-100 text-gray-900'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <div className={`text-xs mt-1 ${msg.from === 'ai' ? 'text-gray-400' : 'text-blue-200'}`}>
                        {msg.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
                <p>Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
