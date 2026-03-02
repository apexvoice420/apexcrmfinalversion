'use client';

import { useState } from 'react';
import Sidebar from '@/components/sidebar';
import { 
  Sparkles, Copy, Check, Download, RefreshCw, 
  ChevronDown, FileText, Zap, MessageSquare
} from 'lucide-react';

// Master prompt templates
const PROMPT_TEMPLATES = {
  'vapi-agent': {
    name: 'VAPI Agent Configuration',
    category: 'AI Voice',
    variables: ['clientName', 'industry', 'services', 'greeting', 'emergencyHandling', 'businessHours'],
    template: `You are {clientName}'s AI receptionist, a professional {industry} company in {serviceArea}.

## IDENTITY
- Name: {assistantName}
- Tone: {tone}
- Style: {voiceStyle}

## KNOWLEDGE
Services offered:
{services}

Business hours: {businessHours}

## CALL FLOW
1. Greet caller warmly: "{greeting}"
2. Ask how you can help
3. Qualify the lead (name, phone, service needed, urgency)
4. Book appointment or take message
5. Confirm details before ending call

## EMERGENCY HANDLING
{emergencyHandling}

## FAQ
{faq}

## RULES
- Never say you are an AI or robot
- Always be helpful and professional
- If unsure, offer to connect to a human
- Confirm all details before ending call
- Keep responses concise and natural`
  },
  'cold-email': {
    name: 'Cold Outreach Email',
    category: 'Sales',
    variables: ['prospectName', 'companyName', 'industry', 'painPoint', 'solution', 'cta'],
    template: `Subject: {companyName}'s missed calls

Hey {prospectName},

Quick question: how many calls did {companyName} miss last month?

Most {industry} businesses I talk to are shocked when they find out — it's usually 20-30% of all incoming calls.

At ${avgJobValue} average job value, that's real money walking to competitors.

{painPoint}

{solution}

Worth 10 minutes to see the numbers for {companyName}?

{cta}

P.S. I'm not selling software. I'm selling the revenue you're leaving on the table.`
  },
  'linkedin-post': {
    name: 'LinkedIn Post',
    category: 'Marketing',
    variables: ['hook', 'industry', 'stat', 'story', 'cta'],
    template: `{hook}

I was analyzing call data for a local {industry} company and found something that stopped me cold.

{stat}

That's {impact}.

{story}

The fix is simpler than you think.

{cta}

#{industry} #SmallBusiness #AI #CustomerService #Growth`
  },
  'client-onboarding': {
    name: 'Client Onboarding Email',
    category: 'Operations',
    variables: ['clientName', 'businessName', 'industry', 'setupDate', 'contactPhone'],
    template: `Welcome to Apex Voice Solutions, {clientName}!

We're excited to set up your AI receptionist for {businessName}.

## What Happens Next

1. **Setup Call** ({setupDate})
   - We'll configure your AI agent
   - Set up your greeting and call flow
   - Test the system together

2. **Phone Number Assignment**
   - You'll get a dedicated number: {assignedNumber}
   - Forward your existing line or use this as your main line

3. **Go Live**
   - We handle everything
   - You start capturing every call

## What We Need From You

- List of services you offer
- FAQ answers for common questions
- Emergency contact number: {contactPhone}
- Any special instructions for call handling

## Your Investment

- Setup: ${setupFee}
- Monthly: ${monthlyFee}/mo
- Usage: Pay-as-you-go

Questions? Reply to this email or call us at 386-282-5413.

Let's make sure you never miss another call.

Maurice Pinnock
Apex Voice Solutions`
  },
  'proposal': {
    name: 'Client Proposal',
    category: 'Sales',
    variables: ['clientName', 'businessName', 'industry', 'currentSituation', 'solution', 'pricing'],
    template: `# Proposal for {businessName}

**Prepared by:** Apex Voice Solutions
**Date:** {date}
**Valid until:** {expiryDate}

---

## Executive Summary

{businessName} is a {industry} company that could benefit from 24/7 call handling to capture more leads and improve customer service.

## Current Situation

{currentSituation}

## Proposed Solution

{solution}

## Investment

| Item | Cost |
|------|------|
| Setup Fee | ${setupFee} |
| Monthly Retainer | ${monthlyFee}/mo |
| Usage (estimated) | ${usageEst}/mo |

**Total First Month:** ${totalFirstMonth}
**Ongoing Monthly:** ${ongoingMonthly}

## ROI Projection

Based on your average job value of ${avgJobValue}:

- Current missed calls: {missedCallsPerWeek}/week
- Recovered revenue potential: ${recoveredRevenue}/month
- **Payback period: {paybackPeriod}**

## Timeline

- Day 1-2: System configuration
- Day 3: Testing and training
- Day 4+: Live and capturing calls

## Next Steps

1. Sign the attached agreement
2. Complete the onboarding form
3. Schedule your setup call

We're excited to partner with {businessName}.

**Maurice Pinnock**
Founder, Apex Voice Solutions
386-282-5413`
  }
};

const INDUSTRIES = ['Roofing', 'Plumbing', 'HVAC', 'Electrical', 'Landscaping', 'Painting', 'General Contractor', 'Pest Control', 'Cleaning', 'Other'];

export default function PromptGeneratorPage() {
  const [selectedTemplate, setSelectedTemplate] = useState('vapi-agent');
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copied, setCopied] = useState(false);

  const template = PROMPT_TEMPLATES[selectedTemplate as keyof typeof PROMPT_TEMPLATES];

  const handleVariableChange = (key: string, value: string) => {
    setVariables(prev => ({ ...prev, [key]: value }));
  };

  const generatePrompt = () => {
    let prompt = template.template;
    
    // Replace variables
    Object.entries(variables).forEach(([key, value]) => {
      prompt = prompt.replace(new RegExp(`{${key}}`, 'g'), value || `[${key}]`);
    });
    
    // Replace any remaining placeholders with defaults
    prompt = prompt.replace(/{\w+}/g, (match) => {
      const key = match.slice(1, -1);
      return `[${key}]`;
    });
    
    setGeneratedPrompt(prompt);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatVariableName = (name: string) => {
    return name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Prompt Generator</h1>
            <p className="text-gray-500 mt-1">Generate ready-to-use prompts with your variables</p>
          </div>
          <div className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl">
            <Zap size={18} />
            <span className="font-medium">Spellbook</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Template Selection & Variables */}
          <div className="space-y-6">
            {/* Template Selector */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText size={20} className="text-blue-600" />
                Select Template
              </h2>
              
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(PROMPT_TEMPLATES).map(([key, tmpl]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedTemplate(key);
                      setVariables({});
                      setGeneratedPrompt('');
                    }}
                    className={`p-3 rounded-xl text-left transition-all ${
                      selectedTemplate === key
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-medium text-sm">{tmpl.name}</div>
                    <div className={`text-xs mt-0.5 ${selectedTemplate === key ? 'text-blue-100' : 'text-gray-400'}`}>
                      {tmpl.category}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Variables Input */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare size={20} className="text-green-600" />
                Variables
              </h2>
              
              <div className="space-y-4">
                {template?.variables.map((varName) => (
                  <div key={varName}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {formatVariableName(varName)}
                    </label>
                    {varName.toLowerCase().includes('services') || varName.toLowerCase().includes('faq') ? (
                      <textarea
                        value={variables[varName] || ''}
                        onChange={(e) => handleVariableChange(varName, e.target.value)}
                        placeholder={`Enter ${formatVariableName(varName).toLowerCase()}...`}
                        rows={4}
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                    ) : varName.toLowerCase().includes('industry') ? (
                      <select
                        value={variables[varName] || ''}
                        onChange={(e) => handleVariableChange(varName, e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select industry...</option>
                        {INDUSTRIES.map(ind => (
                          <option key={ind} value={ind}>{ind}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={variables[varName] || ''}
                        onChange={(e) => handleVariableChange(varName, e.target.value)}
                        placeholder={`Enter ${formatVariableName(varName).toLowerCase()}...`}
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={generatePrompt}
                className="w-full mt-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 flex items-center justify-center gap-2"
              >
                <Sparkles size={18} />
                Generate Prompt
              </button>
            </div>
          </div>

          {/* Generated Output */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-900">Generated Prompt</h2>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  disabled={!generatedPrompt}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium flex items-center gap-1 disabled:opacity-50"
                >
                  {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {!generatedPrompt ? (
              <div className="text-center py-16 text-gray-400">
                <FileText size={48} className="mx-auto mb-4 opacity-50" />
                <p>Fill in the variables and click "Generate Prompt"</p>
              </div>
            ) : (
              <pre className="bg-gray-50 p-4 rounded-xl text-sm text-gray-700 whitespace-pre-wrap font-mono max-h-[600px] overflow-y-auto">
                {generatedPrompt}
              </pre>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
          <h3 className="font-semibold text-gray-900 mb-3">Quick Tips</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <Zap size={16} className="text-purple-600 mt-0.5" />
              <span>Use the generated prompt directly in VAPI, ChatGPT, or Claude</span>
            </div>
            <div className="flex items-start gap-2">
              <RefreshCw size={16} className="text-purple-600 mt-0.5" />
              <span>Regenerate with different variables for A/B testing</span>
            </div>
            <div className="flex items-start gap-2">
              <Copy size={16} className="text-purple-600 mt-0.5" />
              <span>Save prompts to your client's profile for reuse</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

