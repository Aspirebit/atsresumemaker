import React, { useRef, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, Settings, Menu, Sparkles, Store } from 'lucide-react';
import { createPageUrl } from './utils';
import { motion, AnimatePresence } from 'framer-motion';

// Store scroll positions and state for each tab
const tabState = {};

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const contentRef = useRef(null);
  const [restoringScroll, setRestoringScroll] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navItems = [
    { name: 'Dashboard', path: createPageUrl('Dashboard'), icon: Home },
    { name: 'Saved', path: createPageUrl('Saved'), icon: FileText },
    { name: 'Marketplace', path: createPageUrl('TemplateMarketplace'), icon: Store },
    { name: 'Settings', path: createPageUrl('Settings'), icon: Settings },
  ];

  const topMenuItems = [
    { name: 'Resources', path: createPageUrl('Resources') }
  ];

  const isActive = (pageName) => currentPageName === pageName;

  // Save scroll position when navigating away
  useEffect(() => {
    const saveScrollPosition = () => {
      if (contentRef.current) {
        tabState[currentPageName] = {
          scrollY: contentRef.current.scrollTop,
          timestamp: Date.now()
        };
      }
    };

    // Save on scroll as well for real-time updates
    const handleScroll = () => {
      if (contentRef.current && !restoringScroll) {
        tabState[currentPageName] = {
          scrollY: contentRef.current.scrollTop,
          timestamp: Date.now()
        };
      }
    };

    const element = contentRef.current;
    if (element) {
      element.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      saveScrollPosition();
      if (element) {
        element.removeEventListener('scroll', handleScroll);
      }
    };
  }, [currentPageName, restoringScroll]);

  // Restore scroll position when navigating back
  useEffect(() => {
    if (tabState[currentPageName] && contentRef.current) {
      setRestoringScroll(true);
      
      // Try immediate restoration
      contentRef.current.scrollTop = tabState[currentPageName].scrollY;
      
      // Also try after a short delay for content that loads asynchronously
      const timeouts = [10, 50, 100, 200].map(delay =>
        setTimeout(() => {
          if (contentRef.current) {
            contentRef.current.scrollTop = tabState[currentPageName].scrollY;
          }
        }, delay)
      );

      // Allow scrolling after 300ms
      const restoreTimeout = setTimeout(() => {
        setRestoringScroll(false);
      }, 300);

      return () => {
        timeouts.forEach(clearTimeout);
        clearTimeout(restoreTimeout);
      };
    } else {
      // Reset to top if no saved state
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
      setRestoringScroll(false);
    }
  }, [currentPageName]);

  return (
    <div className="min-h-screen bg-background overscroll-none">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700 flex-col">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">ATS Resume Builder</h1>
              <p className="text-xs text-slate-400">AI-Powered Career Tools</p>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            {topMenuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors border border-blue-500/30"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
        
        <nav className="flex-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.name);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all select-none touch-target ${
                  active
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
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
      <header className="md:hidden fixed top-0 left-0 right-0 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 z-10 safe-top">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-lg font-bold text-white">ATS Resume Builder</h1>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-slate-700 rounded-lg touch-target select-none"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden fixed top-14 left-0 right-0 bg-slate-900 border-b border-slate-700 z-20 safe-top shadow-xl"
          >
            <nav className="p-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.name);
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all ${
                      active
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main ref={contentRef} className="md:ml-64 pt-16 md:pt-0 pb-20 md:pb-0 h-screen overflow-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 z-10 safe-bottom shadow-lg">
        <div className="grid grid-cols-4 gap-1 px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.name);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-all select-none ${
                  active ? 'text-white bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg' : 'text-slate-400'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium truncate w-full text-center">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}