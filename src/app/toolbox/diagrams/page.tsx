'use client';

import { useState } from 'react';
import Sidebar from '@/components/sidebar';
import { 
  PenTool, Copy, Check, Download, ExternalLink,
  GitBranch, ArrowRight, Circle, Square, Diamond
} from 'lucide-react';

// Diagram templates
const DIAGRAM_TEMPLATES = {
  'call-flow': {
    name: 'Call Flow Diagram',
    description: 'Show how calls route through your AI system',
    icon: GitBranch,
    nodes: [
      { id: 'incoming', type: 'circle', label: 'Incoming Call', x: 400, y: 50 },
      { id: 'ai-greet', type: 'rectangle', label: 'AI Greets Caller', x: 400, y: 150 },
      { id: 'decision', type: 'diamond', label: 'Emergency?', x: 400, y: 270 },
      { id: 'book-apt', type: 'rectangle', label: 'Book Appointment', x: 200, y: 400 },
      { id: 'escalate', type: 'rectangle', label: 'Escalate to Human', x: 600, y: 400 },
      { id: 'confirm', type: 'rectangle', label: 'Confirm & End', x: 400, y: 520 },
    ],
    edges: [
      { from: 'incoming', to: 'ai-greet' },
      { from: 'ai-greet', to: 'decision' },
      { from: 'decision', to: 'book-apt', label: 'No' },
      { from: 'decision', to: 'escalate', label: 'Yes' },
      { from: 'book-apt', to: 'confirm' },
      { from: 'escalate', to: 'confirm' },
    ]
  },
  'lead-pipeline': {
    name: 'Lead Pipeline',
    description: 'Visualize your lead flow from prospect to client',
    icon: ArrowRight,
    nodes: [
      { id: 'new', type: 'circle', label: 'New Lead', x: 100, y: 200 },
      { id: 'contacted', type: 'rectangle', label: 'Contacted', x: 250, y: 200 },
      { id: 'demo', type: 'rectangle', label: 'Demo Scheduled', x: 400, y: 200 },
      { id: 'proposal', type: 'rectangle', label: 'Proposal Sent', x: 550, y: 200 },
      { id: 'closed', type: 'rectangle', label: 'Closed Won', x: 700, y: 200 },
      { id: 'lost', type: 'square', label: 'Lost', x: 550, y: 350 },
    ],
    edges: [
      { from: 'new', to: 'contacted' },
      { from: 'contacted', to: 'demo' },
      { from: 'demo', to: 'proposal' },
      { from: 'proposal', to: 'closed' },
      { from: 'proposal', to: 'lost' },
    ]
  },
  'system-architecture': {
    name: 'System Architecture',
    description: 'Show how all your tools connect',
    icon: Square,
    nodes: [
      { id: 'website', type: 'rectangle', label: 'Landing Page', x: 200, y: 100 },
      { id: 'crm', type: 'rectangle', label: 'CRM Dashboard', x: 400, y: 100 },
      { id: 'backend', type: 'rectangle', label: 'API Server', x: 600, y: 100 },
      { id: 'vapi', type: 'circle', label: 'VAPI', x: 300, y: 250 },
      { id: 'twilio', type: 'circle', label: 'Twilio SMS', x: 500, y: 250 },
      { id: 'db', type: 'diamond', label: 'PostgreSQL', x: 700, y: 250 },
    ],
    edges: [
      { from: 'website', to: 'backend' },
      { from: 'crm', to: 'backend' },
      { from: 'backend', to: 'vapi' },
      { from: 'backend', to: 'twilio' },
      { from: 'backend', to: 'db' },
    ]
  },
  'onboarding': {
    name: 'Client Onboarding',
    description: 'Steps to onboard a new client',
    icon: Circle,
    nodes: [
      { id: 'start', type: 'circle', label: 'Sign Up', x: 100, y: 200 },
      { id: 'collect', type: 'rectangle', label: 'Collect Info', x: 250, y: 200 },
      { id: 'configure', type: 'rectangle', label: 'Configure AI', x: 400, y: 200 },
      { id: 'test', type: 'rectangle', label: 'Test Calls', x: 550, y: 200 },
      { id: 'go-live', type: 'circle', label: 'Go Live', x: 700, y: 200 },
    ],
    edges: [
      { from: 'start', to: 'collect' },
      { from: 'collect', to: 'configure' },
      { from: 'configure', to: 'test' },
      { from: 'test', to: 'go-live' },
    ]
  }
};

// Generate Excalidraw JSON
function generateExcalidrawJSON(template: typeof DIAGRAM_TEMPLATES['call-flow']) {
  const elements: any[] = [];
  let elementId = 1;

  // Add nodes
  template.nodes.forEach(node => {
    const baseElement = {
      id: `node-${elementId++}`,
      x: node.x,
      y: node.y,
      strokeColor: '#1e293b',
      backgroundColor: node.type === 'diamond' ? '#fef3c7' : '#eff6ff',
      fillStyle: 'solid',
      strokeWidth: 2,
      strokeStyle: 'solid',
      roughness: 0,
      opacity: 100,
      roundness: node.type === 'rectangle' ? { type: 3 } : null,
    };

    if (node.type === 'circle') {
      elements.push({
        ...baseElement,
        type: 'ellipse',
        width: 120,
        height: 60,
      });
    } else if (node.type === 'diamond') {
      elements.push({
        ...baseElement,
        type: 'diamond',
        width: 120,
        height: 80,
      });
    } else {
      elements.push({
        ...baseElement,
        type: 'rectangle',
        width: 140,
        height: 60,
      });
    }

    // Add label
    elements.push({
      id: `label-${elementId++}`,
      type: 'text',
      x: node.x + (node.type === 'diamond' ? 60 : (node.type === 'circle' ? 60 : 70)),
      y: node.y + (node.type === 'diamond' ? 40 : 30),
      text: node.label,
      fontSize: 14,
      fontFamily: 1,
      textAlign: 'center',
      verticalAlign: 'middle',
      strokeColor: '#1e293b',
    });
  });

  // Add edges (arrows)
  template.edges.forEach(edge => {
    const fromNode = template.nodes.find(n => n.id === edge.from);
    const toNode = template.nodes.find(n => n.id === edge.to);
    
    if (fromNode && toNode) {
      elements.push({
        id: `arrow-${elementId++}`,
        type: 'arrow',
        x: fromNode.x + 70,
        y: fromNode.y + 60,
        width: toNode.x - fromNode.x,
        height: toNode.y - fromNode.y - 60,
        strokeColor: '#64748b',
        strokeWidth: 2,
        strokeStyle: 'solid',
        startArrowhead: null,
        endArrowhead: 'arrow',
      });

      // Add edge label if exists
      if (edge.label) {
        elements.push({
          id: `edge-label-${elementId++}`,
          type: 'text',
          x: (fromNode.x + toNode.x) / 2 + 80,
          y: (fromNode.y + toNode.y) / 2 + 20,
          text: edge.label,
          fontSize: 12,
          fontFamily: 1,
          textAlign: 'center',
          strokeColor: '#64748b',
        });
      }
    }
  });

  return {
    type: 'excalidraw',
    version: 2,
    source: 'https://excalidraw.com',
    elements,
    appState: {
      viewBackgroundColor: '#ffffff',
      gridSize: null,
    },
    files: {},
  };
}

export default function DiagramBuilderPage() {
  const [selectedTemplate, setSelectedTemplate] = useState('call-flow');
  const [clientName, setClientName] = useState('');
  const [excalidrawUrl, setExcalidrawUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const template = DIAGRAM_TEMPLATES[selectedTemplate as keyof typeof DIAGRAM_TEMPLATES];

  const generateDiagram = () => {
    const json = generateExcalidrawJSON(template);
    
    // Encode to base64
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(json))));
    
    // Create Excalidraw URL
    const url = `https://excalidraw.com/#json=${encoded},${Date.now()}`;
    setExcalidrawUrl(url);
  };

  const copyUrl = async () => {
    await navigator.clipboard.writeText(excalidrawUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadJson = () => {
    const json = generateExcalidrawJSON(template);
    const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${clientName || 'diagram'}-${selectedTemplate}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Diagram Builder</h1>
            <p className="text-gray-500 mt-1">Generate Excalidraw diagrams for client pitches</p>
          </div>
          <div className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-xl">
            <PenTool size={18} />
            <span className="font-medium">Visualizer</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Template Selection */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Select Diagram Type</h2>
              
              <div className="space-y-2">
                {Object.entries(DIAGRAM_TEMPLATES).map(([key, tmpl]) => {
                  const Icon = tmpl.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setSelectedTemplate(key);
                        setExcalidrawUrl('');
                      }}
                      className={`w-full p-4 rounded-xl text-left transition-all flex items-center gap-4 ${
                        selectedTemplate === key
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${selectedTemplate === key ? 'bg-blue-500' : 'bg-white'}`}>
                        <Icon size={24} />
                      </div>
                      <div>
                        <div className="font-medium">{tmpl.name}</div>
                        <div className={`text-sm ${selectedTemplate === key ? 'text-blue-100' : 'text-gray-500'}`}>
                          {tmpl.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Client Name */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Customize</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client Name (optional)
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Sleepy's Roofing"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                onClick={generateDiagram}
                className="w-full mt-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 flex items-center justify-center gap-2"
              >
                <PenTool size={18} />
                Generate Diagram
              </button>
            </div>
          </div>

          {/* Preview & Actions */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Your Diagram</h2>

            {!excalidrawUrl ? (
              <div className="text-center py-16 text-gray-400">
                <PenTool size={48} className="mx-auto mb-4 opacity-50" />
                <p>Select a template and click "Generate Diagram"</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Preview placeholder */}
                <div className="bg-gray-50 rounded-xl p-8 text-center">
                  <div className="text-gray-500 mb-4">Diagram ready!</div>
                  
                  {/* Mini preview of nodes */}
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {template.nodes.map(node => (
                      <div
                        key={node.id}
                        className={`px-3 py-1.5 text-xs rounded ${
                          node.type === 'circle' ? 'rounded-full bg-blue-100' :
                          node.type === 'diamond' ? 'bg-yellow-100' :
                          'bg-gray-100'
                        }`}
                      >
                        {node.label}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={excalidrawUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    <ExternalLink size={18} />
                    Open in Excalidraw
                  </a>
                  <button
                    onClick={downloadJson}
                    className="py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 flex items-center justify-center gap-2"
                  >
                    <Download size={18} />
                    Download JSON
                  </button>
                </div>

                {/* Copy URL */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={excalidrawUrl}
                    readOnly
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 truncate"
                  />
                  <button
                    onClick={copyUrl}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                  >
                    {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                  </button>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  Edit the diagram in Excalidraw, then share or export as PNG/SVG
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Use Cases */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
          <h3 className="font-semibold text-gray-900 mb-3">When to Use This</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <GitBranch size={16} className="text-green-600 mt-0.5" />
              <span>Show clients how their AI handles calls step-by-step</span>
            </div>
            <div className="flex items-start gap-2">
              <ArrowRight size={16} className="text-green-600 mt-0.5" />
              <span>Visualize your lead pipeline in proposals</span>
            </div>
            <div className="flex items-start gap-2">
              <Square size={16} className="text-green-600 mt-0.5" />
              <span>Map out system architecture for technical clients</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
