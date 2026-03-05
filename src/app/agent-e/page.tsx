'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/sidebar';
import { 
  Mail, Send, Sparkles, Copy, Check, Loader2, RefreshCw,
  Users, Target, Clock, TrendingUp, AlertCircle, ChevronRight,
  Edit3, Trash2, Eye, Inbox, MessageSquare, Reply
} from 'lucide-react';
import { API_URL } from '@/lib/config';

const EMAIL_TEMPLATES = [
  {
    id: 'missed_calls',
    name: 'Missed Calls Angle',
    description: 'Best performer - focuses on revenue lost to unanswered calls',
    subject_template: "You're losing $X/month to missed calls",
  },
  {
    id: 'google_maps',
    name: 'Google Maps Angle',
    description: 'Leverage their Google presence and reviews',
    subject_template: "Found you on Google Maps",
  },
  {
    id: 'after_hours',
    name: 'After Hours Angle',
    description: 'Focus on missed emergency calls after 5pm',
    subject_template: "Who answers your phone at 7pm?",
  },
  {
    id: 'short_direct',
    name: 'Short & Direct',
    description: 'For mobile readers - under 100 words',
    subject_template: "Question about {business_name}",
  },
];

const INDUSTRY_DATA: Record<string, { avg_job: number; pain_point: string }> = {
  roofing: { avg_job: 8000, pain_point: 'emergency roof leaks' },
  plumbing: { avg_job: 750, pain_point: 'burst pipes and clogs' },
  hvac: { avg_job: 1500, pain_point: 'AC failures in summer' },
  electrical: { avg_job: 500, pain_point: 'power outages and safety issues' },
  landscaping: { avg_job: 400, pain_point: 'seasonal maintenance gaps' },
  medical: { avg_job: 350, pain_point: 'missed new patient calls' },
};

interface Lead {
  id: number;
  business_name: string;
  phone: string;
  email?: string;
  city?: string;
  state?: string;
  rating?: number;
  reviews?: number;
  industry?: string;
  status: string;
}

interface GeneratedEmail {
  subject: string;
  body: string;
  template: string;
  lead_id: number;
}

interface Campaign {
  id: string;
  name: string;
  leads_count: number;
  status: 'draft' | 'sending' | 'completed';
  created_at: string;
}

interface EmailThread {
  id: number;
  lead_id: number | null;
  thread_id: string;
  message_id: string;
  direction: 'inbound' | 'outbound';
  subject: string;
  preview: string;
  from_email: string;
  to_email: string;
  created_at: string;
}

export default function AgentEPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);
  const [activeTab, setActiveTab] = useState<'generate' | 'campaigns' | 'sent' | 'replies'>('generate');
  
  // Email generation state
  const [selectedTemplate, setSelectedTemplate] = useState('missed_calls');
  const [generatedEmails, setGeneratedEmails] = useState<GeneratedEmail[]>([]);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  
  // Campaign state
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [campaignName, setCampaignName] = useState('');
  
  // Email threads state
  const [emailThreads, setEmailThreads] = useState<EmailThread[]>([]);
  const [threadsLoading, setThreadsLoading] = useState(false);

  useEffect(() => {
    fetchLeads();
    fetchEmailThreads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/leads`);
      if (res.ok) {
        const data = await res.json();
        setLeads(data.filter((l: Lead) => l.email)); // Only leads with emails
      }
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmailThreads = async () => {
    setThreadsLoading(true);
    try {
      const res = await fetch(`${API_URL}/webhooks/agentmail/threads`);
      if (res.ok) {
        const data = await res.json();
        setEmailThreads(data.threads || []);
      }
    } catch (error) {
      console.error('Failed to fetch email threads:', error);
    } finally {
      setThreadsLoading(false);
    }
  };

  const toggleLead = (id: number) => {
    setSelectedLeads(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedLeads.length === leads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(leads.map(l => l.id));
    }
  };

  const generateEmailForLead = (lead: Lead, template: string): GeneratedEmail => {
    const industry = lead.industry || 'roofing';
    const industryData = INDUSTRY_DATA[industry] || INDUSTRY_DATA.roofing;
    const avgJob = industryData.avg_job;
    const missedCallsPerMonth = 20;
    const monthlyLoss = Math.round(avgJob * missedCallsPerMonth * 0.3);
    
    const firstName = lead.business_name.split(' ')[0];
    const city = lead.city || 'your area';
    const rating = lead.rating || 4.5;
    const reviews = lead.reviews || 50;

    let subject = '';
    let body = '';

    switch (template) {
      case 'missed_calls':
        subject = `${lead.business_name}'s missed calls`;
        body = `Hey ${firstName},

${reviews} reviews at ${rating} stars — you're running one of the best operations in ${city}.

But here's what the reviews don't show: the calls you DON'T answer.

Most ${industry} businesses miss 30% of incoming calls. That's probably 20+ leads a month walking to competitors. At $${avgJob.toLocaleString()} per job, that's $${monthlyLoss.toLocaleString()}+ monthly revenue lost.

I set up AI receptionists that answer every call in 2 seconds, 24/7. One ${city} business added $47k in 90 days from after-hours calls alone.

Worth 10 minutes to see the numbers for ${lead.business_name}?

Maurice
Apex Voice Solutions
386-282-5413
https://cal.com/apexvoicesolutions

P.S. I'm not selling software. I'm selling the 30% of revenue you're leaving on the table.`;
        break;

      case 'google_maps':
        subject = `Found ${lead.business_name} on Google Maps`;
        body = `Hey ${firstName},

Found ${lead.business_name} on Google Maps while researching top ${industry} businesses in ${city}. Your ${rating}-star rating with ${reviews} reviews is solid — that's top-tier territory.

Here's the problem with being that visible: you get MORE calls. And if you can't answer them? They call the next guy on the list.

I've helped similar businesses in ${city} go from answering 60% of calls to 98%. Their AI receptionist:
- Answers instantly (no hold time)
- Qualifies the lead
- Books appointments directly
- Works 24/7 (even at 2am)

Setup takes 3 days. ROI shows up in week 1.

Open to seeing how it would work for ${lead.business_name}?

Maurice
Apex Voice Solutions`;
        break;

      case 'after_hours':
        subject = `Who answers ${lead.business_name}'s phone at 7pm?`;
        body = `Hey ${firstName},

Quick scenario: It's 7pm. A homeowner in ${city} has ${industryData.pain_point}. They Google "${industry} ${city}", find your number, and call.

Nobody answers.

They call the next listing. That guy gets the job.

This happens 15-20 times a month for most ${industry} businesses. That's $${monthlyLoss.toLocaleString()}+ walking out the door.

Apex Voice Solutions gives you an AI receptionist that:
- Answers EVERY call, day or night
- Handles emergencies differently (can text you immediately)
- Books non-urgent calls for next day
- Sounds 100% human

No salaries. No overtime. No sick days. Just every call answered.

Want to see what you've been missing?

Maurice
Apex Voice Solutions`;
        break;

      case 'short_direct':
        subject = `Question about ${lead.business_name}`;
        body = `Hey ${firstName},

Do you know how many calls ${lead.business_name} missed last month?

Most service businesses I talk to are shocked when they find out.

I set up AI phone systems that answer every call, qualify leads, and book jobs. One client added $47k in 3 months.

Worth a quick chat?

Maurice
386-282-5413
https://cal.com/apexvoicesolutions`;
        break;

      default:
        subject = `Quick question about ${lead.business_name}`;
        body = `Hey ${firstName},\n\nI noticed ${lead.business_name} has great reviews. Quick question - who answers your calls when you're on a job?\n\nMaurice`;
    }

    return {
      subject,
      body,
      template,
      lead_id: lead.id,
    };
  };

  const generateEmails = () => {
    setGenerating(true);
    
    // Simulate AI generation delay
    setTimeout(() => {
      const selected = leads.filter(l => selectedLeads.includes(l.id));
      const emails = selected.map(lead => generateEmailForLead(lead, selectedTemplate));
      setGeneratedEmails(emails);
      setGenerating(false);
    }, 500);
  };

  const copyToClipboard = async (email: GeneratedEmail) => {
    const text = `Subject: ${email.subject}\n\n${email.body}`;
    await navigator.clipboard.writeText(text);
    setCopiedId(email.lead_id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const sendEmails = async () => {
    setSending(true);
    try {
      const token = localStorage.getItem('auth_token');
      
      for (const email of generatedEmails) {
        const lead = leads.find(l => l.id === email.lead_id);
        if (!lead?.email) continue;

        await fetch(`${API_URL}/api/emails/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            to: lead.email,
            subject: email.subject,
            body: email.body,
            lead_id: lead.id,
          }),
        });
      }

      alert(`Sent ${generatedEmails.length} emails!`);
      setGeneratedEmails([]);
      setSelectedLeads([]);
    } catch (error) {
      console.error('Failed to send emails:', error);
      alert('Failed to send emails. Check console for details.');
    } finally {
      setSending(false);
    }
  };

  const stats = {
    totalLeads: leads.length,
   WithEmail: leads.filter(l => l.email).length,
    selected: selectedLeads.length,
    generated: generatedEmails.length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Agent E</h1>
            <p className="text-gray-500 mt-1">AI-powered cold email outreach</p>
          </div>
          <div className="flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-xl">
            <Sparkles size={18} />
            <span className="font-medium">Sarah</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalLeads}</p>
                <p className="text-xs text-gray-500">Total Leads</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Mail size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.WithEmail}</p>
                <p className="text-xs text-gray-500">With Email</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Target size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.selected}</p>
                <p className="text-xs text-gray-500">Selected</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <Edit3 size={20} className="text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.generated}</p>
                <p className="text-xs text-gray-500">Generated</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'generate', label: 'Generate Emails', icon: Sparkles },
            { id: 'campaigns', label: 'Campaigns', icon: Target },
            { id: 'sent', label: 'Sent History', icon: Clock },
            { id: 'replies', label: 'Replies', icon: Reply, badge: emailThreads.filter(t => t.direction === 'inbound').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
              {tab.badge && tab.badge > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Generate Tab */}
        {activeTab === 'generate' && (
          <div className="grid grid-cols-2 gap-6">
            {/* Lead Selection */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-gray-900">Select Leads</h2>
                <button
                  onClick={selectAll}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {selectedLeads.length === leads.length ? 'Deselect all' : 'Select all'}
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 size={24} className="animate-spin text-blue-600" />
                </div>
              ) : (
                <div className="max-h-[500px] overflow-y-auto space-y-2">
                  {leads.map((lead) => (
                    <label
                      key={lead.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedLeads.includes(lead.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedLeads.includes(lead.id)}
                        onChange={() => toggleLead(lead.id)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{lead.business_name}</p>
                        <p className="text-xs text-gray-500">{lead.email}</p>
                      </div>
                      {lead.rating && (
                        <span className="text-xs text-gray-400">
                          ⭐ {lead.rating}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Email Generation */}
            <div className="space-y-6">
              {/* Template Selection */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-semibold text-gray-900 mb-4">Email Template</h2>
                <div className="grid grid-cols-2 gap-3">
                  {EMAIL_TEMPLATES.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selectedTemplate === template.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-medium text-gray-900">{template.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{template.description}</p>
                    </button>
                  ))}
                </div>

                <button
                  onClick={generateEmails}
                  disabled={generating || selectedLeads.length === 0}
                  className="w-full mt-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {generating ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      Generate {selectedLeads.length} Emails
                    </>
                  )}
                </button>
              </div>

              {/* Generated Emails */}
              {generatedEmails.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-semibold text-gray-900">Generated Emails</h2>
                    <button
                      onClick={sendEmails}
                      disabled={sending}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                    >
                      {sending ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          Send All
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-4 max-h-[400px] overflow-y-auto">
                    {generatedEmails.map((email) => {
                      const lead = leads.find(l => l.id === email.lead_id);
                      return (
                        <div key={email.lead_id} className="border border-gray-200 rounded-xl p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium text-gray-900">{lead?.business_name}</p>
                              <p className="text-xs text-gray-500">{lead?.email}</p>
                            </div>
                            <button
                              onClick={() => copyToClipboard(email)}
                              className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                              {copiedId === email.lead_id ? (
                                <Check size={16} className="text-green-600" />
                              ) : (
                                <Copy size={16} className="text-gray-400" />
                              )}
                            </button>
                          </div>
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            Subject: {email.subject}
                          </p>
                          <pre className="text-xs text-gray-600 whitespace-pre-wrap font-sans bg-gray-50 p-3 rounded-lg">
                            {email.body}
                          </pre>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Campaigns Tab */}
        {activeTab === 'campaigns' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-semibold text-gray-900">Active Campaigns</h2>
              <button
                onClick={() => setShowCampaignModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
              >
                <Target size={18} />
                New Campaign
              </button>
            </div>

            {campaigns.length === 0 ? (
              <div className="text-center py-12">
                <Target size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="font-semibold text-gray-900">No campaigns yet</h3>
                <p className="text-sm text-gray-500 mt-1">Create a campaign to send automated email sequences</p>
              </div>
            ) : (
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{campaign.name}</p>
                      <p className="text-sm text-gray-500">{campaign.leads_count} leads</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      campaign.status === 'completed' ? 'bg-green-100 text-green-700' :
                      campaign.status === 'sending' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {campaign.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Sent History Tab */}
        {activeTab === 'sent' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-8">
            <div className="text-center py-12">
              <Clock size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="font-semibold text-gray-900">Sent History</h3>
              <p className="text-sm text-gray-500 mt-1">View all emails sent through Agent E</p>
              <p className="text-xs text-gray-400 mt-4">No emails sent yet. Generate and send some emails above!</p>
            </div>
          </div>
        )}

        {/* Replies Tab */}
        {activeTab === 'replies' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="font-semibold text-gray-900">Email Replies</h2>
                <p className="text-sm text-gray-500">Replies from your cold outreach campaigns</p>
              </div>
              <button
                onClick={fetchEmailThreads}
                disabled={threadsLoading}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 flex items-center gap-2"
              >
                <RefreshCw size={16} className={threadsLoading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>

            {threadsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 size={24} className="animate-spin text-blue-600" />
              </div>
            ) : emailThreads.length === 0 ? (
              <div className="text-center py-12">
                <Inbox size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="font-semibold text-gray-900">No replies yet</h3>
                <p className="text-sm text-gray-500 mt-1">When leads reply to your emails, they'll show up here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {emailThreads.map((thread) => (
                  <div 
                    key={thread.id} 
                    className={`border rounded-xl p-4 ${
                      thread.direction === 'inbound' 
                        ? 'border-blue-200 bg-blue-50' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          thread.direction === 'inbound' 
                            ? 'bg-blue-100 text-blue-600' 
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {thread.direction === 'inbound' ? <Reply size={18} /> : <Send size={18} />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900">
                              {thread.direction === 'inbound' ? thread.from_email : thread.to_email}
                            </p>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              thread.direction === 'inbound' 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'bg-gray-200 text-gray-600'
                            }`}>
                              {thread.direction === 'inbound' ? 'Received' : 'Sent'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{thread.subject}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400">
                        {new Date(thread.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    {thread.preview && (
                      <p className="text-sm text-gray-600 mt-3 pl-13 line-clamp-2">
                        {thread.preview}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
