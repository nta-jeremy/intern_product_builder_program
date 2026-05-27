import React from 'react';
import { LayoutDashboard, Award, Boxes, Milestone, CheckSquare, FileEdit, Menu, X, ArrowUpRight } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'overview', label: 'TỔNG QUAN', icon: LayoutDashboard },
    { id: 'profile', label: 'TIÊU CHÍ CÁ NHÂN', icon: Award },
    { id: 'products', label: 'CHÂN DUNG 4 SẢN PHẨM', icon: Boxes },
    { id: 'lifecycle', label: 'COACHING LIFECYCLE', icon: Milestone },
    { id: 'scorecard', label: 'SCORECARD ĐÁNH GIÁ', icon: CheckSquare },
    { id: 'journal', label: 'SỔ TAY THỰC TẬP (JOURNAL)', icon: FileEdit },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-neutral-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo/Brand Section */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-500 font-mono text-sm font-bold text-neutral-950 shadow-lg shadow-yellow-500/20">
            YD
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-sm font-bold tracking-wider text-white">YODY ITDX</span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-yellow-500">Product Builder</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1" id="desktop-nav-menu">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`tab-trigger-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 rounded-md px-3 py-2 text-xs font-medium tracking-wide transition-all duration-200 ${
                  isActive
                    ? 'bg-white/[0.04] text-yellow-500 border border-yellow-500/30 font-semibold'
                    : 'text-neutral-400 hover:bg-white/[0.02] hover:text-white border border-transparent'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Button - Portal Link */}
        <div className="hidden lg:flex items-center">
          <a
            href="https://yody-itdx-ea.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center space-x-1 rounded-full border border-white/20 bg-neutral-900 px-3.5 py-1.5 text-xs font-medium text-white transition-all hover:bg-neutral-800 hover:border-white/40"
          >
            <span className="text-yellow-500 group-hover:text-yellow-400">Yody ITDX</span>
            <span className="text-neutral-400 font-normal">Portal</span>
            <ArrowUpRight className="h-3 w-3 text-neutral-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-md p-2 text-neutral-400 hover:bg-neutral-900 hover:text-white focus:outline-none"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-white/[0.08] bg-neutral-950 px-4 py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-tab-trigger-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex w-full items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-yellow-500/10 text-yellow-500 font-semibold'
                    : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="border-t border-white/[0.08] pt-3 mt-2">
            <a
              href="https://yody-itdx-ea.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-between rounded-lg bg-neutral-900 px-3 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
            >
              <span className="text-yellow-500">Yody ITDX EA Portal</span>
              <ArrowUpRight className="h-4 w-4 text-neutral-400" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
