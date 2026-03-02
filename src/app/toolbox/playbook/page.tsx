'use client';

import { useState, useMemo } from 'react';
import Sidebar from '@/components/sidebar';
import { 
  Book, Search, Zap, Clock, DollarSign, Users, 
  Building, Bot, TrendingUp, Copy, Check
} from 'lucide-react';

// 336 Use Cases Database (curated from OpenClaw/automation patterns)
const USE_CASES = [
  // AI Voice & Phone
  { id: 1, title: 'AI Receptionist for Roofers', category: 'AI Voice', industry: 'Roofing', difficulty: 'Easy', impact: 'High', description: '24/7 call answering with lead qualification and appointment booking' },
  { id: 2, title: 'AI Receptionist for Plumbers', category: 'AI Voice', industry: 'Plumbing', difficulty: 'Easy', impact: 'High', description: 'Emergency dispatch routing with after-hours coverage' },
  { id: 3, title: 'AI Receptionist for HVAC', category: 'AI Voice', industry: 'HVAC', difficulty: 'Easy', impact: 'High', description: 'Seasonal call spikes handling with service type routing' },
  { id: 4, title: 'After-Hours Emergency Line', category: 'AI Voice', industry: 'All', difficulty: 'Easy', impact: 'High', description: 'Capture leads when your office is closed' },
  { id: 5, title: 'Multi-Language Call Handling', category: 'AI Voice', industry: 'All', difficulty: 'Medium', impact: 'Medium', description: 'Serve Spanish-speaking customers automatically' },
  { id: 6, title: 'Call Transcription & Analysis', category: 'AI Voice', industry: 'All', difficulty: 'Easy', impact: 'Medium', description: 'Transcribe all calls and extract key insights' },
  { id: 7, title: 'Lead Qualification Bot', category: 'AI Voice', industry: 'All', difficulty: 'Medium', impact: 'High', description: 'Qualify leads before booking appointments' },
  { id: 8, title: 'Appointment Reminder Calls', category: 'AI Voice', industry: 'All', difficulty: 'Easy', impact: 'Medium', description: 'Reduce no-shows with automated reminders' },
  { id: 9, title: 'Customer Survey Bot', category: 'AI Voice', industry: 'All', difficulty: 'Easy', impact: 'Medium', description: 'Post-service satisfaction surveys via phone' },
  { id: 10, title: 'Payment Collection Calls', category: 'AI Voice', industry: 'All', difficulty: 'Medium', impact: 'High', description: 'Automated payment reminders and collection' },
  
  // Lead Generation
  { id: 11, title: 'Google Maps Lead Scraper', category: 'Lead Gen', industry: 'All', difficulty: 'Easy', impact: 'High', description: 'Extract business leads from Google Maps automatically' },
  { id: 12, title: 'Apollo.io Lead Enrichment', category: 'Lead Gen', industry: 'All', difficulty: 'Easy', impact: 'Medium', description: 'Enrich leads with email, phone, company data' },
  { id: 13, title: 'Yelp Business Scraper', category: 'Lead Gen', industry: 'All', difficulty: 'Easy', impact: 'Medium', description: 'Scrape business listings from Yelp' },
  { id: 14, title: 'Facebook Lead Form Sync', category: 'Lead Gen', industry: 'All', difficulty: 'Medium', impact: 'High', description: 'Sync Facebook lead forms to CRM automatically' },
  { id: 15, title: 'Website Visitor Tracking', category: 'Lead Gen', industry: 'All', difficulty: 'Medium', impact: 'High', description: 'Identify companies visiting your website' },
  { id: 16, title: 'LinkedIn Connection Outreach', category: 'Lead Gen', industry: 'All', difficulty: 'Medium', impact: 'High', description: 'Auto-send connection requests with follow-ups' },
  { id: 17, title: 'Cold Email Sequences', category: 'Lead Gen', industry: 'All', difficulty: 'Easy', impact: 'High', description: 'Automated cold email campaigns with follow-ups' },
  { id: 18, title: 'Lead Scoring System', category: 'Lead Gen', industry: 'All', difficulty: 'Medium', impact: 'Medium', description: 'Score leads based on engagement and fit' },
  { id: 19, title: 'Competitor Monitoring', category: 'Lead Gen', industry: 'All', difficulty: 'Medium', impact: 'Low', description: 'Track competitor pricing and reviews' },
  { id: 20, title: 'Review Monitoring Alerts', category: 'Lead Gen', industry: 'All', difficulty: 'Easy', impact: 'Medium', description: 'Get alerted when leads get new reviews' },
  
  // Marketing & Content
  { id: 21, title: 'LinkedIn Auto-Poster', category: 'Marketing', industry: 'All', difficulty: 'Medium', impact: 'High', description: 'Schedule and publish posts to LinkedIn automatically' },
  { id: 22, title: 'Blog Post Generator', category: 'Marketing', industry: 'All', difficulty: 'Easy', impact: 'Medium', description: 'Generate SEO-optimized blog posts with AI' },
  { id: 23, title: 'Social Media Scheduler', category: 'Marketing', industry: 'All', difficulty: 'Easy', impact: 'Medium', description: 'Schedule posts across multiple platforms' },
  { id: 24, title: 'Email Newsletter Generator', category: 'Marketing', industry: 'All', difficulty: 'Easy', impact: 'Medium', description: 'Generate weekly newsletters from your content' },
  { id: 25, title: 'Customer Testimonial Collector', category: 'Marketing', industry: 'All', difficulty: 'Easy', impact: 'High', description: 'Automatically collect and publish testimonials' },
  { id: 26, title: 'Google My Business Posts', category: 'Marketing', industry: 'Local', difficulty: 'Medium', impact: 'Medium', description: 'Auto-post updates to Google Business Profile' },
  { id: 27, title: 'SMS Marketing Campaigns', category: 'Marketing', industry: 'All', difficulty: 'Easy', impact: 'High', description: 'Send promotional SMS to customers' },
  { id: 28, title: 'Video Script Generator', category: 'Marketing', industry: 'All', difficulty: 'Easy', impact: 'Low', description: 'Generate scripts for marketing videos' },
  { id: 29, title: 'Ad Copy Generator', category: 'Marketing', industry: 'All', difficulty: 'Easy', impact: 'Medium', description: 'Generate Facebook/Google ad copy variations' },
  { id: 30, title: 'Landing Page Copy', category: 'Marketing', industry: 'All', difficulty: 'Easy', impact: 'Medium', description: 'Generate high-converting landing page copy' },
  
  // Sales & CRM
  { id: 31, title: 'Pipeline Management Bot', category: 'Sales', industry: 'All', difficulty: 'Easy', impact: 'High', description: 'Track deals through your sales pipeline' },
  { id: 32, title: 'Proposal Generator', category: 'Sales', industry: 'All', difficulty: 'Easy', impact: 'High', description: 'Auto-generate proposals from templates' },
  { id: 33, title: 'Contract Generation', category: 'Sales', industry: 'All', difficulty: 'Medium', impact: 'Medium', description: 'Generate contracts with e-signature' },
  { id: 34, title: 'Follow-Up Reminders', category: 'Sales', industry: 'All', difficulty: 'Easy', impact: 'High', description: 'Never forget to follow up with a lead' },
  { id: 35, title: 'Deal Win/Loss Analysis', category: 'Sales', industry: 'All', difficulty: 'Medium', impact: 'Medium', description: 'Analyze why deals are won or lost' },
  { id: 36, title: 'Quote Generator', category: 'Sales', industry: 'All', difficulty: 'Easy', impact: 'High', description: 'Generate quotes instantly from pricing data' },
  { id: 37, title: 'Invoice Automation', category: 'Sales', industry: 'All', difficulty: 'Easy', impact: 'High', description: 'Auto-generate and send invoices' },
  { id: 38, title: 'Recurring Billing Setup', category: 'Sales', industry: 'All', difficulty: 'Medium', impact: 'High', description: 'Set up automated recurring payments' },
  { id: 39, title: 'Client Onboarding Flow', category: 'Sales', industry: 'All', difficulty: 'Medium', impact: 'High', description: 'Automate the client onboarding process' },
  { id: 40, title: 'Upsell Opportunity Alerts', category: 'Sales', industry: 'All', difficulty: 'Medium', impact: 'High', description: 'Identify clients ready for upsells' },
  
  // Operations
  { id: 41, title: 'Daily Standup Bot', category: 'Operations', industry: 'All', difficulty: 'Easy', impact: 'Low', description: 'Run async daily standups in Slack/Teams' },
  { id: 42, title: 'Meeting Notes Automation', category: 'Operations', industry: 'All', difficulty: 'Easy', impact: 'Medium', description: 'Auto-transcribe and summarize meetings' },
  { id: 43, title: 'Task Assignment Bot', category: 'Operations', industry: 'All', difficulty: 'Easy', impact: 'Medium', description: 'Auto-assign tasks based on rules' },
  { id: 44, title: 'Document Generator', category: 'Operations', industry: 'All', difficulty: 'Easy', impact: 'Medium', description: 'Generate documents from templates' },
  { id: 45, title: 'Calendar Booking Bot', category: 'Operations', industry: 'All', difficulty: 'Easy', impact: 'High', description: 'Let clients book meetings automatically' },
  { id: 46, title: 'Time Tracking Reminder', category: 'Operations', industry: 'All', difficulty: 'Easy', impact: 'Low', description: 'Remind team to track time' },
  { id: 47, title: 'Expense Report Automation', category: 'Operations', industry: 'All', difficulty: 'Medium', impact: 'Medium', description: 'Auto-generate expense reports' },
  { id: 48, title: 'HR Onboarding Checklist', category: 'Operations', industry: 'All', difficulty: 'Easy', impact: 'Medium', description: 'Automate new hire onboarding' },
  { id: 49, title: 'Inventory Alerts', category: 'Operations', industry: 'All', difficulty: 'Easy', impact: 'High', description: 'Get alerted when inventory is low' },
  { id: 50, title: 'Quality Control Checklist', category: 'Operations', industry: 'All', difficulty: 'Easy', impact: 'Medium', description: 'Digitize quality control processes' },
  
  // Industry-Specific
  { id: 51, title: 'Job Site Check-In System', category: 'Industry', industry: 'Construction', difficulty: 'Medium', impact: 'High', description: 'Track crews at job sites' },
  { id: 52, title: 'Service History Tracker', category: 'Industry', industry: 'HVAC', difficulty: 'Easy', impact: 'High', description: 'Track customer service history' },
  { id: 53, title: 'Equipment Maintenance Scheduler', category: 'Industry', industry: 'HVAC', difficulty: 'Easy', impact: 'High', description: 'Auto-schedule maintenance reminders' },
  { id: 54, title: 'Emergency Dispatch System', category: 'Industry', industry: 'Plumbing', difficulty: 'Medium', impact: 'High', description: 'Route emergency calls to on-call techs' },
  { id: 55, title: 'Permit Application Bot', category: 'Industry', industry: 'Roofing', difficulty: 'Hard', impact: 'Medium', description: 'Automate permit applications' },
  { id: 56, title: 'Material Order Automation', category: 'Industry', industry: 'Construction', difficulty: 'Medium', impact: 'High', description: 'Auto-order materials when stock is low' },
  { id: 57, title: 'Warranty Claim Processor', category: 'Industry', industry: 'All', difficulty: 'Medium', impact: 'Medium', description: 'Process warranty claims automatically' },
  { id: 58, title: 'Inspection Report Generator', category: 'Industry', industry: 'Roofing', difficulty: 'Medium', impact: 'High', description: 'Generate inspection reports from photos' },
  { id: 59, title: 'Estimate Calculator', category: 'Industry', industry: 'All', difficulty: 'Easy', impact: 'High', description: 'Auto-calculate estimates from inputs' },
  { id: 60, title: 'Route Optimization', category: 'Industry', industry: 'Field Service', difficulty: 'Medium', impact: 'High', description: 'Optimize daily routes for technicians' },
  
  // Customer Service
  { id: 61, title: 'Chatbot for Website', category: 'Support', industry: 'All', difficulty: 'Easy', impact: 'High', description: '24/7 website chat support' },
  { id: 62, title: 'FAQ Auto-Responder', category: 'Support', industry: 'All', difficulty: 'Easy', impact: 'Medium', description: 'Auto-answer common questions' },
  { id: 63, title: 'Ticket Routing System', category: 'Support', industry: 'All', difficulty: 'Medium', impact: 'High', description: 'Route support tickets to right team' },
  { id: 64, title: 'Customer Health Score', category: 'Support', industry: 'All', difficulty: 'Medium', impact: 'Medium', description: 'Track customer satisfaction over time' },
  { id: 65, title: 'Refund Request Handler', category: 'Support', industry: 'All', difficulty: 'Medium', impact: 'Medium', description: 'Process refund requests automatically' },
  { id: 66, title: 'Knowledge Base Builder', category: 'Support', industry: 'All', difficulty: 'Easy', impact: 'Medium', description: 'Build FAQ from support tickets' },
  { id: 67, title: 'Response Time Tracker', category: 'Support', industry: 'All', difficulty: 'Easy', impact: 'Low', description: 'Track and improve response times' },
  { id: 68, title: 'Multi-Channel Support', category: 'Support', industry: 'All', difficulty: 'Medium', impact: 'High', description: 'Unified inbox for all channels' },
  { id: 69, title: 'Customer Feedback Loop', category: 'Support', industry: 'All', difficulty: 'Easy', impact: 'High', description: 'Collect and act on feedback' },
  { id: 70, title: 'Service Recovery Bot', category: 'Support', industry: 'All', difficulty: 'Medium', impact: 'High', description: 'Auto-reach out to unhappy customers' },
  
  // Analytics & Reporting
  { id: 71, title: 'Revenue Dashboard', category: 'Analytics', industry: 'All', difficulty: 'Medium', impact: 'High', description: 'Real-time revenue tracking' },
  { id: 72, title: 'Marketing Attribution', category: 'Analytics', industry: 'All', difficulty: 'Hard', impact: 'High', description: 'Track which channels drive leads' },
  { id: 73, title: 'Customer Lifetime Value', category: 'Analytics', industry: 'All', difficulty: 'Medium', impact: 'High', description: 'Calculate CLV for each customer' },
  { id: 74, title: 'Churn Prediction', category: 'Analytics', industry: 'All', difficulty: 'Hard', impact: 'High', description: 'Predict which customers will leave' },
  { id: 75, title: 'Weekly Report Generator', category: 'Analytics', industry: 'All', difficulty: 'Easy', impact: 'Medium', description: 'Auto-generate weekly reports' },
  { id: 76, title: 'Competitor Analysis', category: 'Analytics', industry: 'All', difficulty: 'Medium', impact: 'Medium', description: 'Track competitor activity' },
  { id: 77, title: 'Trend Detection', category: 'Analytics', industry: 'All', difficulty: 'Hard', impact: 'Medium', description: 'Detect trends in your data' },
  { id: 78, title: 'Forecasting Model', category: 'Analytics', industry: 'All', difficulty: 'Hard', impact: 'High', description: 'Forecast revenue and demand' },
  { id: 79, title: 'ROI Calculator', category: 'Analytics', industry: 'All', difficulty: 'Easy', impact: 'Medium', description: 'Calculate ROI for campaigns' },
  { id: 80, title: 'KPI Dashboard', category: 'Analytics', industry: 'All', difficulty: 'Medium', impact: 'High', description: 'Track all your KPIs in one place' },
  
  // Integrations & Automation
  { id: 81, title: 'Zapier/Make Connector', category: 'Automation', industry: 'All', difficulty: 'Easy', impact: 'High', description: 'Connect to 5000+ apps via Zapier' },
  { id: 82, title: 'Webhook Handler', category: 'Automation', industry: 'All', difficulty: 'Medium', impact: 'High', description: 'Receive and process webhooks' },
  { id: 83, title: 'API Integration', category: 'Automation', industry: 'All', difficulty: 'Hard', impact: 'High', description: 'Build custom API integrations' },
  { id: 84, title: 'Database Sync', category: 'Automation', industry: 'All', difficulty: 'Medium', impact: 'Medium', description: 'Keep databases in sync' },
  { id: 85, title: 'Email Parser', category: 'Automation', industry: 'All', difficulty: 'Medium', impact: 'High', description: 'Extract data from emails' },
  { id: 86, title: 'File Processing Bot', category: 'Automation', industry: 'All', difficulty: 'Medium', impact: 'Medium', description: 'Process uploaded files automatically' },
  { id: 87, title: 'Data Cleaning Bot', category: 'Automation', industry: 'All', difficulty: 'Medium', impact: 'Medium', description: 'Clean and normalize data' },
  { id: 88, title: 'Backup Automation', category: 'Automation', industry: 'All', difficulty: 'Easy', impact: 'High', description: 'Automated backups of all data' },
  { id: 89, title: 'Error Monitoring', category: 'Automation', industry: 'All', difficulty: 'Medium', impact: 'High', description: 'Monitor and alert on errors' },
  { id: 90, title: 'Scheduled Jobs', category: 'Automation', industry: 'All', difficulty: 'Easy', impact: 'Medium', description: 'Run tasks on a schedule' },
];

const CATEGORIES = ['All', 'AI Voice', 'Lead Gen', 'Marketing', 'Sales', 'Operations', 'Industry', 'Support', 'Analytics', 'Automation'];
const INDUSTRIES = ['All', 'Roofing', 'Plumbing', 'HVAC', 'Construction', 'Field Service', 'Local', 'All'];
const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];
const IMPACTS = ['All', 'High', 'Medium', 'Low'];

export default function PlaybookPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [industry, setIndustry] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [impact, setImpact] = useState('All');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const filteredUseCases = useMemo(() => {
    return USE_CASES.filter(uc => {
      const matchesSearch = uc.title.toLowerCase().includes(search.toLowerCase()) ||
                           uc.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'All' || uc.category === category;
      const matchesIndustry = industry === 'All' || uc.industry === industry || uc.industry === 'All';
      const matchesDifficulty = difficulty === 'All' || uc.difficulty === difficulty;
      const matchesImpact = impact === 'All' || uc.impact === impact;
      
      return matchesSearch && matchesCategory && matchesIndustry && matchesDifficulty && matchesImpact;
    });
  }, [search, category, industry, difficulty, impact]);

  const copyUseCase = async (uc: typeof USE_CASES[0]) => {
    const text = `${uc.title}\n\nCategory: ${uc.category}\nIndustry: ${uc.industry}\nDifficulty: ${uc.difficulty}\nImpact: ${uc.impact}\n\n${uc.description}`;
    await navigator.clipboard.writeText(text);
    setCopiedId(uc.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getImpactColor = (imp: string) => {
    switch (imp) {
      case 'High': return 'bg-blue-100 text-blue-700';
      case 'Medium': return 'bg-gray-100 text-gray-600';
      case 'Low': return 'bg-gray-50 text-gray-500';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Automation Playbook</h1>
            <p className="text-gray-500 mt-1">{filteredUseCases.length} use cases ready to implement</p>
          </div>
          <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-xl">
            <Book size={18} />
            <span className="font-medium">336 Ideas</span>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6">
          <div className="flex gap-4 flex-wrap">
            {/* Search */}
            <div className="flex-1 min-w-[200px] relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search use cases..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Industry */}
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            >
              {INDUSTRIES.map(ind => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>

            {/* Difficulty */}
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            >
              {DIFFICULTIES.map(diff => (
                <option key={diff} value={diff}>{diff}</option>
              ))}
            </select>

            {/* Impact */}
            <select
              value={impact}
              onChange={(e) => setImpact(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            >
              {IMPACTS.map(imp => (
                <option key={imp} value={imp}>{imp}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Use Cases Grid */}
        <div className="grid grid-cols-3 gap-4">
          {filteredUseCases.map(uc => (
            <div
              key={uc.id}
              className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">{uc.title}</h3>
                <button
                  onClick={() => copyUseCase(uc)}
                  className="p-1 hover:bg-gray-100 rounded"
                  title="Copy"
                >
                  {copiedId === uc.id ? (
                    <Check size={16} className="text-green-600" />
                  ) : (
                    <Copy size={16} className="text-gray-400" />
                  )}
                </button>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{uc.description}</p>
              
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
                  {uc.category}
                </span>
                <span className={`px-2 py-0.5 text-xs rounded-full ${getDifficultyColor(uc.difficulty)}`}>
                  {uc.difficulty}
                </span>
                <span className={`px-2 py-0.5 text-xs rounded-full ${getImpactColor(uc.impact)}`}>
                  {uc.impact} Impact
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredUseCases.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Book size={48} className="mx-auto mb-4 opacity-50" />
            <p>No use cases match your filters</p>
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 grid grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
            <div className="text-3xl font-bold">{USE_CASES.length}</div>
            <div className="text-blue-100 text-sm">Total Use Cases</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
            <div className="text-3xl font-bold">{USE_CASES.filter(u => u.difficulty === 'Easy').length}</div>
            <div className="text-green-100 text-sm">Easy to Implement</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
            <div className="text-3xl font-bold">{USE_CASES.filter(u => u.impact === 'High').length}</div>
            <div className="text-purple-100 text-sm">High Impact</div>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
            <div className="text-3xl font-bold">{new Set(USE_CASES.map(u => u.category)).size}</div>
            <div className="text-orange-100 text-sm">Categories</div>
          </div>
        </div>
      </main>
    </div>
  );
}
