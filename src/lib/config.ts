// API Configuration for Apex Voice CRM
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-production-74dd.up.railway.app';

// VAPI Configuration
export const VAPI_CONFIG = {
  agentId: process.env.NEXT_PUBLIC_VAPI_AGENT_ID || '4deec673-b116-45dd-9ceb-54057a18ebb2',
  phoneNumber: process.env.NEXT_PUBLIC_VAPI_PHONE || '+1 (386) 559-5733',
};
