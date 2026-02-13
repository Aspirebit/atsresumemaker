import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, Settings, Menu } from 'lucide-react';
import { createPageUrl } from './utils';

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', path: createPageUrl('Dashboard'), icon: Home },
    { name: 'Saved', path: createPageUrl('Saved'), icon: FileText },
    { name: 'Marketplace', path: createPageUrl('TemplateMarketplace'), icon: FileText },
    { name: 'Settings', path: createPageUrl('Settings'), icon: Settings },
  ];

  const isActive = (pageName) => currentPageName === pageName;

  return (
    <div className="min-h-screen bg-background overscroll-none">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-card border-r border-border flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-bold text-foreground">Resume Builder</h1>
          <p className="text-sm text-muted-foreground mt-1">Create your perfect resume</p>
        </div>
        
        <nav className="flex-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.name);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors select-none touch-target ${
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground hover:bg-accent'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 bg-card border-b border-border z-10 safe-top">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-foreground">Resume Builder</h1>
          <button className="p-2 hover:bg-accent rounded-lg touch-target select-none">
            <Menu className="w-6 h-6 text-foreground" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="md:ml-64 pt-16 md:pt-0 pb-20 md:pb-0">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-10 safe-bottom">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.name);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors select-none touch-target ${
                  active ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}