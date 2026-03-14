import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, FileText, Settings, PlusCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: ClipboardList, label: 'Serviços', path: '/services' },
    { icon: FileText, label: 'Relatórios', path: '/reports' },
    { icon: Settings, label: 'Configurações', path: '/settings' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-ivory">
      {/* Sidebar / Mobile Nav */}
      <aside className="w-full md:w-64 bg-brown-primary text-white flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-ivory">ServiceLog</h1>
          <p className="text-xs text-ivory/60 mt-1">Diário de Serviços</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                location.pathname === item.path 
                  ? "bg-green-action text-white" 
                  : "hover:bg-white/10 text-ivory/80"
              )}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Floating Action Button */}
      <Link
        to="/services/new"
        className="fixed bottom-6 right-6 md:hidden bg-green-action text-white p-4 rounded-full shadow-lg hover:bg-green-hover transition-transform active:scale-95"
      >
        <PlusCircle size={24} />
      </Link>
    </div>
  );
}

