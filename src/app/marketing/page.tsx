'use client';

import { useState } from 'react';
import Sidebar from '@/components/sidebar';
import { 
  Sparkles, FileText, Linkedin, Mail, Calendar,
  Copy, Check, Loader2, RefreshCw, Download,
  Edit3, Trash2, Eye, Plus, Send
} from 'lucide-react';

const CONTENT_TYPES = [
  { id: 'blog', label: 'Blog Post', icon: FileText, description: 'SEO-optimized articles' },
  { id: 'linkedin', label: 'LinkedIn Post', icon: Linkedin, description: 'Professional social content' },
  { id: 'email', label: 'Email Sequence', icon: Mail, description: 'Nurture campaigns' },
  { id: 'social', label: 'Social Media', icon: Sparkles, description: 'Twitter, FB, IG posts' },
];

const BLOG_TOPICS = [
  'Why 30% of Service Business Calls Go Unanswered',
  'How AI Receptionists Are Changing the Game for Roofers',
  'The Hidden Revenue Leak: Missed Calls After Hours',
  '5 Ways to Capture More Leads Without Hiring Staff',
  'Why Voicemail is Killing Your Business',
  'The Real Cost of Missing Emergency Calls',
  'AI vs Human Receptionist: What Actually Works',
  'How to Turn Every Call Into Revenue',
];

const LINKEDIN_HOOKS = [
  'The math that made a roofer $47k in 90 days:',
  'I called 50 roofing companies. Here\'s what I found:',
  'Unpopular opinion: Your receptionist is costing you money.',
  'The moment I realized service businesses are bleeding revenue:',
  'Quick story about a Daytona Beach roofer:',
];

const INDUSTRIES = [
  { value: 'roofing', label: 'Roofing', avg_job: 8000 },
  { value: 'plumbing', label: 'Plumbing', avg_job: 750 },
  { value: 'hvac', label: 'HVAC', avg_job: 1500 },
  { value: 'electrical', label: 'Electrical', avg_job: 500 },
  { value: 'landscaping', label: 'Landscaping', avg_job: 400 },
];

interface GeneratedContent {
  id: string;
  type: string;
  title: string;
  content: string;
  created_at: string;
}

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState('blog');
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Blog state
  const [blogTopic, setBlogTopic] = useState(BLOG_TOPICS[0]);
  const [blogIndustry, setBlogIndustry] = useState('roofing');
  
  // LinkedIn state
  const [linkedinHook, setLinkedinHook] = useState(LINKEDIN_HOOKS[0]);
  const [linkedinIndustry, setLinkedinIndustry] = useState('roofing');
  
  // Email state
  const [emailType, setEmailType] = useState('nurture');
  const [emailIndustry, setEmailIndustry] = useState('roofing');
  
  // Social state
  const [socialPlatform, setSocialPlatform] = useState('twitter');
  const [socialIndustry, setSocialIndustry] = useState('roofing');

  const generateBlog = (): GeneratedContent => {
    const industry = INDUSTRIES.find(i => i.value === blogIndustry) || INDUSTRIES[0];
    const avgJob = industry.avg_job;
    
    const blog = `# ${blogTopic}

*Posted by Apex Voice Solutions*

---

As a ${industry.label.toLowerCase()} business owner, you know that every call represents potential revenue. But here's the uncomfortable truth: **you're probably missing 30% of your incoming calls.**

## The Math That Should Scare You

Let's break it down:

- Average ${industry.label.toLowerCase()} job value: **$${avgJob.toLocaleString()}**
- Calls per week: ~15-20
- Missed calls (industry average): 30%
- That's 4-6 missed opportunities every single week

**Monthly revenue lost: $${(avgJob * 20 * 0.3).toLocaleString()}+**

## The Real Problem

It's not that you don't want to answer calls. It's that:

- You're on a job site with noisy equipment
- Your receptionist is on another line
- It's after 5pm and your office is closed
- It's the weekend and someone has an emergency
- You're driving between locations

Every one of these scenarios = money walking out the door.

## The Solution: AI That Actually Sounds Human

Modern AI receptionists aren't the robotic voice menus from 2010. They:

✅ Answer every call in under 2 seconds
✅ Sound 100% human (callers can't tell the difference)
✅ Qualify leads before booking
✅ Handle emergencies differently (instant text to you)
✅ Work 24/7/365 — no sick days, no vacations
✅ Book appointments directly into your calendar

## Real Results

One ${industry.label.toLowerCase()} client in Florida went from answering 60% of calls to 98%. The result? **$47,000 in additional revenue in 90 days** — all from after-hours calls they used to miss.

## The ROI Calculator

| Metric | Before | After |
|--------|--------|-------|
| Calls Answered | 60% | 98% |
| Weekly Booked Jobs | 8 | 14 |
| Monthly Revenue | $${(avgJob * 32).toLocaleString()} | $${(avgJob * 56).toLocaleString()} |
| Revenue Increase | — | **+$${(avgJob * 24).toLocaleString()}/mo** |

## What This Means For You

If you're a ${industry.label.toLowerCase()} business with decent reviews (4.0+ stars), you're already getting calls. The question is: **are you answering them?**

An AI receptionist costs a fraction of a human hire and never misses a call. Setup takes 3 days. ROI shows up in week 1.

## Next Steps

Ready to stop leaving money on the table?

📞 **Call us:** 386-282-5413
📧 **Email:** maurice@apexvoicesolutions.com
📅 **Book a demo:** [cal.com/apexvoicesolutions](https://cal.com/apexvoicesolutions)

---

*Apex Voice Solutions helps service businesses capture every call with AI-powered receptionists. Based in Florida, serving clients nationwide.*`;

    return {
      id: `blog-${Date.now()}`,
      type: 'blog',
      title: blogTopic,
      content: blog,
      created_at: new Date().toISOString(),
    };
  };

  const generateLinkedIn = (): GeneratedContent => {
    const industry = INDUSTRIES.find(i => i.value === linkedinIndustry) || INDUSTRIES[0];
    
    const post = `${linkedinHook}

I was analyzing call data for a local ${industry.label.toLowerCase()} company and found something that stopped me cold.

Out of 127 calls last month, 38 went to voicemail.

That's 38 homeowners with urgent problems who called someone else.

At $${industry.avg_job.toLocaleString()} average job value, that's **$${(industry.avg_job * 38).toLocaleString()} in missed revenue.**

Not because they didn't have good reviews.
Not because they weren't skilled.
Not because of competition.

Just... didn't pick up the phone.

We set them up with an AI receptionist. Month 1? They booked 11 jobs from after-hours calls alone.

No salary. No benefits. No "I'm at lunch" or "I'm on another line."

Just every call answered in 2 seconds, 24/7.

If you run a service business and you're not answering every single call — you're leaving money on the table.

The fix is simpler than you think.

#${industry.label.replace(' ', '')} #SmallBusiness #AI #CustomerService #Growth`;

    return {
      id: `linkedin-${Date.now()}`,
      type: 'linkedin',
      title: linkedinHook,
      content: post,
      created_at: new Date().toISOString(),
    };
  };

  const generateEmail = (): GeneratedContent => {
    const industry = INDUSTRIES.find(i => i.value === emailIndustry) || INDUSTRIES[0];
    
    let sequence = '';
    
    if (emailType === 'nurture') {
      sequence = `## Email 1: Welcome (Day 0)

**Subject: Welcome to Apex Voice — Here's What Happens Next**

Hey [First Name],

Thanks for booking a demo with Apex Voice Solutions!

We're excited to show you how an AI receptionist can help [Business Name] capture more calls and book more jobs.

Here's what to expect:

📅 Demo Call (15 min) — We'll show you exactly how it works
⚡ Setup (3 days) — We handle everything
📈 ROI (Week 1) — Start seeing results immediately

Your demo is scheduled for [Date/Time].

Talk soon,
Maurice
Apex Voice Solutions

---

## Email 2: Before Demo (Day -1)

**Subject: Quick prep for tomorrow's call**

Hey [First Name],

Just a quick reminder about our demo tomorrow at [Time].

Here are 3 things that'll make it super valuable:

1. Have your average job value handy ($X,XXX)
2. Think about how many calls you miss per week
3. Know your biggest pain point (after-hours? lunch breaks? overflow?)

This'll help me show you exactly what you'd gain.

See you tomorrow!
Maurice

---

## Email 3: After Demo (Day +1)

**Subject: Recap: What we discussed + next steps**

Hey [First Name],

Great talking yesterday! Here's a quick recap:

✅ AI receptionist answers every call in 2 seconds
✅ 24/7 coverage for emergencies and after-hours
✅ Direct booking into your calendar
✅ Monthly cost: $XXX (way less than a part-time hire)

Based on your call volume, you're looking at **$${(industry.avg_job * 15).toLocaleString()}+ in recovered revenue per month**.

Ready to get started? Reply "YES" and I'll send over the setup form.

Best,
Maurice

---

## Email 4: Follow-up (Day +4)

**Subject: Quick question about [Business Name]**

Hey [First Name],

Just wanted to check in — any questions about the AI receptionist setup?

Happy to hop on a quick call if you want to go over anything.

Or if you're ready to roll, just reply "GO" and I'll get the paperwork over.

Either way, I'm here.

Maurice`;
    } else {
      sequence = `## Cold Outreach Email

**Subject: [Business Name]'s missed calls**

Hey [First Name],

Quick question: how many calls did [Business Name] miss last month?

Most ${industry.label.toLowerCase()} businesses I talk to are shocked when they find out — it's usually 20-30% of all incoming calls.

At $${industry.avg_job.toLocaleString()} average job value, that's real money walking to competitors.

I set up AI receptionists that answer every call in 2 seconds, 24/7. One ${industry.label.toLowerCase()} client added $47k in 90 days from after-hours calls alone.

Worth 10 minutes to see the numbers for [Business Name]?

Maurice Pinnock
Apex Voice Solutions
386-282-5413
https://cal.com/apexvoicesolutions

P.S. I'm not selling software. I'm selling the revenue you're leaving on the table.`;
    }

    return {
      id: `email-${Date.now()}`,
      type: 'email',
      title: emailType === 'nurture' ? 'Nurture Sequence (4 emails)' : 'Cold Outreach Email',
      content: sequence,
      created_at: new Date().toISOString(),
    };
  };

  const generateSocial = (): GeneratedContent => {
    const industry = INDUSTRIES.find(i => i.value === socialIndustry) || INDUSTRIES[0];
    
    let posts = '';
    
    if (socialPlatform === 'twitter') {
      posts = `## Tweet 1 (Hook)

Your ${industry.label.toLowerCase()} business is missing 30% of calls.

That's not a phone problem. That's a money problem.

Here's the fix 🧵

---

## Tweet 2

The math is brutal:

• 20 calls/week
• 30% missed = 6 lost leads
• $${industry.avg_job.toLocaleString()}/job
• $${(industry.avg_job * 24).toLocaleString()}/month GONE

---

## Tweet 3

Why calls get missed:

• On a job site
• After 5pm  
• Weekends
• "I'll call them back" (you won't)

---

## Tweet 4

AI receptionists fix this:

✅ 2-second pickup
✅ 24/7 coverage
✅ Sounds human
✅ Books appointments
✅ $${Math.round(industry.avg_job * 3)}/mo (way less than staff)

---

## Tweet 5

One ${industry.label.toLowerCase()} client:

Before: 60% answer rate
After: 98% answer rate
Result: $47k in 90 days

---

## Tweet 6

If you're not answering every call, you're paying your competitors.

DM me "CALLS" and I'll show you the numbers for your business.`;
    } else {
      posts = `## Facebook/Instagram Post

**Caption:**

The moment you realize your phone is a money printer... that you keep leaving on pause 📵

30% of service business calls go unanswered.

That's not just "part of the job." That's revenue walking out the door.

At $${industry.avg_job.toLocaleString()} average job value, missing 5 calls/week = $${(industry.avg_job * 20).toLocaleString()}+ monthly.

We help ${industry.label.toLowerCase()} businesses answer EVERY call with AI receptionists:
✅ 24/7 coverage
✅ Books appointments automatically  
✅ Sounds 100% human
✅ Fraction of the cost of hiring

Drop a 🔧 if you want to see what you've been missing.

#${industry.label.replace(' ', '')} #SmallBusinessTips #AI #CustomerService #RevenueGrowth

---

**Story Idea:**

📊 "Your calculator says you made $X this month. Your phone logs say you left $${(industry.avg_job * 15).toLocaleString()} on the table. Here's how to fix it..."

---

**Carousel Slides:**

Slide 1: "The Math That'll Make You Sweat"
Slide 2: [Your numbers: calls/week × missed % × job value]
Slide 3: "Why It Happens" (list reasons)
Slide 4: "The Fix" (AI receptionist)
Slide 5: "Real Results" (client story)
Slide 6: "DM us 'CALLS' for your custom numbers"`;
    }

    return {
      id: `social-${Date.now()}`,
      type: 'social',
      title: `${socialPlatform === 'twitter' ? 'Twitter' : 'Facebook/Instagram'} Thread`,
      content: posts,
      created_at: new Date().toISOString(),
    };
  };

  const handleGenerate = () => {
    setGenerating(true);
    
    setTimeout(() => {
      let content: GeneratedContent;
      
      switch (activeTab) {
        case 'blog':
          content = generateBlog();
          break;
        case 'linkedin':
          content = generateLinkedIn();
          break;
        case 'email':
          content = generateEmail();
          break;
        case 'social':
          content = generateSocial();
          break;
        default:
          content = generateBlog();
      }
      
      setGeneratedContent(prev => [content, ...prev]);
      setGenerating(false);
    }, 800);
  };

  const copyToClipboard = async (content: GeneratedContent) => {
    await navigator.clipboard.writeText(content.content);
    setCopiedId(content.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const deleteContent = (id: string) => {
    setGeneratedContent(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Marketing Agent</h1>
            <p className="text-gray-500 mt-1">AI-powered content generation for Apex Voice</p>
          </div>
          <div className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl">
            <Sparkles size={18} />
            <span className="font-medium">AI Writer</span>
          </div>
        </div>

        {/* Content Type Tabs */}
        <div className="flex gap-2 mb-6">
          {CONTENT_TYPES.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setActiveTab(type.id)}
                className={`px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all ${
                  activeTab === type.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <Icon size={18} />
                {type.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Generator Panel */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Generate Content</h2>

            {/* Blog Options */}
            {activeTab === 'blog' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Blog Topic</label>
                  <select
                    value={blogTopic}
                    onChange={(e) => setBlogTopic(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {BLOG_TOPICS.map(topic => (
                      <option key={topic} value={topic}>{topic}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Industry</label>
                  <select
                    value={blogIndustry}
                    onChange={(e) => setBlogIndustry(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {INDUSTRIES.map(ind => (
                      <option key={ind.value} value={ind.value}>{ind.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* LinkedIn Options */}
            {activeTab === 'linkedin' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hook Style</label>
                  <select
                    value={linkedinHook}
                    onChange={(e) => setLinkedinHook(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {LINKEDIN_HOOKS.map(hook => (
                      <option key={hook} value={hook}>{hook.slice(0, 50)}...</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industry Focus</label>
                  <select
                    value={linkedinIndustry}
                    onChange={(e) => setLinkedinIndustry(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {INDUSTRIES.map(ind => (
                      <option key={ind.value} value={ind.value}>{ind.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Email Options */}
            {activeTab === 'email' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Type</label>
                  <select
                    value={emailType}
                    onChange={(e) => setEmailType(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="nurture">Nurture Sequence (4 emails)</option>
                    <option value="cold">Cold Outreach Email</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Industry</label>
                  <select
                    value={emailIndustry}
                    onChange={(e) => setEmailIndustry(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {INDUSTRIES.map(ind => (
                      <option key={ind.value} value={ind.value}>{ind.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Social Options */}
            {activeTab === 'social' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                  <select
                    value={socialPlatform}
                    onChange={(e) => setSocialPlatform(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="twitter">Twitter/X Thread</option>
                    <option value="facebook">Facebook/Instagram</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industry Focus</label>
                  <select
                    value={socialIndustry}
                    onChange={(e) => setSocialIndustry(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {INDUSTRIES.map(ind => (
                      <option key={ind.value} value={ind.value}>{ind.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full mt-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {generating ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Generate Content
                </>
              )}
            </button>
          </div>

          {/* Generated Content */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-900">Generated Content</h2>
              <span className="text-sm text-gray-500">{generatedContent.length} items</span>
            </div>

            {generatedContent.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Sparkles size={48} className="mx-auto mb-4 opacity-50" />
                <p>No content generated yet</p>
                <p className="text-sm mt-1">Click "Generate Content" to create marketing copy</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {generatedContent.map((content) => (
                  <div key={content.id} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="inline-block text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full mb-1">
                          {content.type}
                        </span>
                        <p className="font-medium text-gray-900">{content.title}</p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => copyToClipboard(content)}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                          title="Copy"
                        >
                          {copiedId === content.id ? (
                            <Check size={16} className="text-green-600" />
                          ) : (
                            <Copy size={16} className="text-gray-400" />
                          )}
                        </button>
                        <button
                          onClick={() => deleteContent(content.id)}
                          className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <pre className="text-xs text-gray-600 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg max-h-60 overflow-y-auto font-sans">
                      {content.content.slice(0, 500)}...
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Content Calendar Preview */}
        <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-900">Suggested Posting Schedule</h2>
            <Calendar size={20} className="text-gray-400" />
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
              <div key={day} className="text-center">
                <p className="text-xs text-gray-500 mb-2">{day}</p>
                <div className={`p-3 rounded-lg text-xs ${
                  i < 5 ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-400'
                }`}>
                  {i === 0 && '📝 Blog'}
                  {i === 1 && '💼 LinkedIn'}
                  {i === 2 && '📧 Email'}
                  {i === 3 && '🐦 Twitter'}
                  {i === 4 && '📸 Social'}
                  {i === 5 && '😴 Rest'}
                  {i === 6 && '😴 Rest'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
