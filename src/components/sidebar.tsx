'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Phone, 
  Settings, 
  Bot, 
  Calendar,
  BarChart3,
  LogOut,
  MessageSquare,
  Building,
  Upload,
  TrendingUp,
  Mail,
  Sparkles,
  DollarSign,
  Linkedin
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Pipeline', href: '/pipeline', icon: TrendingUp },
  { name: 'Clients', href: '/clients', icon: Building },
  { name: 'Leads', href: '/leads', icon: Users },
  { name: 'Upload', href: '/upload', icon: Upload },
  { name: 'Calls', href: '/calls', icon: Phone },
  { name: 'Agents', href: '/agents', icon: Bot },
  { name: 'Kevin (CFO)', href: '/kevin', icon: DollarSign },
  { name: 'Agent E', href: '/agent-e', icon: Mail },
  { name: 'Marketing', href: '/marketing', icon: Sparkles },
  { name: 'LinkedIn', href: '/linkedin', icon: Linkedin },
  { name: 'Workflows', href: '/workflows', icon: BarChart3 },
  { name: 'Campaigns', href: '/campaigns', icon: MessageSquare },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Analytics', href: '/analytics', icon: TrendingUp },
  { name: 'GHL Compare', href: '/compare', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/login');
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0f172a] text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center font-bold text-lg">
            A
          </div>
          <div>
            <div className="font-bold text-lg">Apex Voice</div>
            <div className="text-xs text-gray-400">CRM Dashboard</div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold">
            M
          </div>
          <div className="flex-1">
            <div className="font-medium text-sm">Maurice</div>
            <div className="text-xs text-gray-400">Admin</div>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}
