'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DollarSign, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { API_URL } from '@/lib/config';

interface Financials {
  stripe: {
    totalRevenue: number;
  };
  vapi: {
    totalCost: number;
  };
  profit: {
    gross: number;
    margin: string;
  };
}

export default function KevinWidget() {
  const router = useRouter();
  const [financials, setFinancials] = useState<Financials | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinancials();
    // Refresh every 5 minutes
    const interval = setInterval(fetchFinancials, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchFinancials = async () => {
    try {
      const res = await fetch(`${API_URL}/api/kevin/financials`);
      if (res.ok) {
        const data = await res.json();
        setFinancials(data);
      }
    } catch (error) {
      console.error('Failed to fetch Kevin data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 animate-pulse">
        <div className="h-6 bg-white/20 rounded w-32 mb-4"></div>
        <div className="h-8 bg-white/20 rounded w-24"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">💰</span>
          <h3 className="font-bold">Kevin's Treasury</h3>
        </div>
        <button 
          onClick={() => router.push('/kevin')}
          className="text-sm text-green-100 hover:text-white flex items-center gap-1 transition-colors"
        >
          View Details <ArrowRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <div className="text-green-100 text-xs mb-1">Revenue</div>
          <div className="text-2xl font-bold">
            ${financials?.stripe?.totalRevenue?.toLocaleString() || 0}
          </div>
        </div>
        <div>
          <div className="text-green-100 text-xs mb-1">VAPI Costs</div>
          <div className="text-2xl font-bold">
            ${financials?.vapi?.totalCost?.toFixed(2) || '0.00'}
          </div>
        </div>
        <div>
          <div className="text-green-100 text-xs mb-1">Profit</div>
          <div className={`text-2xl font-bold flex items-center gap-1 ${
            (financials?.profit?.gross || 0) >= 0 ? 'text-white' : 'text-red-200'
          }`}>
            {(financials?.profit?.gross || 0) >= 0 ? (
              <TrendingUp size={18} />
            ) : (
              <TrendingDown size={18} />
            )}
            ${Math.abs(financials?.profit?.gross || 0).toLocaleString()}
          </div>
        </div>
      </div>

      {financials?.stripe?.totalRevenue === 0 && (
        <div className="mt-4 pt-4 border-t border-white/20 text-sm text-green-100">
          💡 No revenue yet. Close your first client to start tracking.
        </div>
      )}
    </div>
  );
}
