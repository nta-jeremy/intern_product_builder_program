import React, { useState, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Award, 
  Boxes, 
  Milestone, 
  CheckSquare, 
  FileEdit, 
  Menu, 
  X, 
  ArrowUpRight, 
  BookOpen, 
  ChevronDown,
  Moon,
  Sun
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from './ThemeProvider';

const navItems = [
  { path: '/', label: 'Tổng quan', icon: LayoutDashboard, end: true },
  { path: '/profile', label: 'Tiêu chí cá nhân', icon: Award },
  { path: '/products', label: 'Chân dung 4 sản phẩm', icon: Boxes },
  { path: '/lifecycle', label: 'Coaching Lifecycle', icon: Milestone },
  { path: '/scorecard', label: 'Scorecard đánh giá', icon: CheckSquare },
  { path: '/journal', label: 'Sổ tay thực tập', icon: FileEdit },
];

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  // Hover Dropdown
  const handleMouseEnter = (menuId: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(menuId);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const groupedMenus = [
    {
      id: 'personal',
      title: 'Định hướng & Sổ tay',
      items: [
        { path: '/profile', label: 'Tiêu chí cá nhân', desc: 'Định nghĩa chân dung, khung năng lực và mục tiêu.', icon: Award, color: 'text-gold bg-gold/10' },
        { path: '/journal', label: 'Sổ tay thực tập', desc: 'Nhật ký công việc, học tập và ghi nhận hàng ngày.', icon: FileEdit, color: 'text-brand-light bg-brand/10' },
      ]
    },
    {
      id: 'product-coaching',
      title: 'Sản phẩm & Đánh giá',
      items: [
        { path: '/products', label: 'Chân dung 4 sản phẩm', desc: 'Chi tiết về 4 dòng sản phẩm cốt lõi đang xây dựng.', icon: Boxes, color: 'text-mint bg-mint/10' },
        { path: '/lifecycle', label: 'Coaching Lifecycle', desc: 'Lộ trình huấn luyện và đào tạo đồng hành phát triển.', icon: Milestone, color: 'text-iris bg-iris/10' },
        { path: '/scorecard', label: 'Scorecard đánh giá', desc: 'Bảng điểm hiệu suất và ghi nhận năng lực định kỳ.', icon: CheckSquare, color: 'text-rose bg-rose/10' },
      ]
    }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border backdrop-blur-md transition-all" style={{ backgroundColor: 'color-mix(in srgb, var(--bg) 80%, transparent)', transitionDuration: 'var(--dur-slow)' }}>
      <div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--container-max)' }}>
        
        {/* Logo Section */}
        <NavLink to="/" className="flex items-center space-x-3 group">
          <img src="/yody-logo.webp" alt="YODY" className="h-8 w-auto transition-transform group-hover:scale-105" style={{ borderRadius: 'var(--radius-sm)', transitionDuration: 'var(--dur-slow)' }} />
          <div className="flex flex-col">
            <span className="font-sans text-sm font-extrabold tracking-wider text-fg-1">YODY ITDX</span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-brand">Intern Product Builder</span>
          </div>
        </NavLink>

        {/* Desktop Smart Grouped Navigation */}
        <nav className="hidden lg:flex items-center space-x-2">
          {/* Trang chủ: Tổng quan */}
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 text-xs font-semibold tracking-wide transition-all border ${
                isActive
                  ? 'bg-brand/10 text-brand border-brand/20'
                  : 'text-fg-3 hover:bg-bg-muted hover:text-fg-1 border-transparent'
              }`
            }
            style={{ borderRadius: 'var(--radius)' }}
          >
            <LayoutDashboard className="h-4 w-4" strokeWidth={1.75} />
            <span>Tổng quan</span>
          </NavLink>

          {/* Grouped Menus with Dropdowns */}
          {groupedMenus.map((group) => {
            const isGroupActive = group.items.some(item => location.pathname.startsWith(item.path));
            const isOpen = activeDropdown === group.id;

            return (
              <div
                key={group.id}
                className="relative"
                onMouseEnter={() => handleMouseEnter(group.id)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className={`flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold tracking-wide transition-all border ${
                    isGroupActive
                      ? 'bg-bg-muted text-fg-1 border-border'
                      : 'text-fg-3 hover:bg-bg-muted hover:text-fg-1 border-transparent'
                  } ${isOpen ? 'bg-bg-muted' : ''}`}
                  style={{ borderRadius: 'var(--radius)', transitionDuration: 'var(--dur)' }}
                >
                  <span>{group.title}</span>
                  <ChevronDown strokeWidth={1.75} className={`h-3 w-3 text-fg-3 transition-transform ${isOpen ? 'rotate-180 text-fg-1' : ''}`} style={{ transitionDuration: 'var(--dur-slow)' }} />
                </button>

                {/* Mega Dropdown Menu */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute left-0 mt-2.5 w-80 border border-border bg-bg p-3.5 backdrop-blur-xl"
                      style={{ borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}
                    >
                      <div className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-brand">
                        {group.title}
                      </div>
                      <div className="space-y-1">
                        {group.items.map((subItem) => {
                          const SubIcon = subItem.icon;
                          const isSubActive = location.pathname === subItem.path;

                          return (
                            <NavLink
                              key={subItem.path}
                              to={subItem.path}
                              onClick={() => setActiveDropdown(null)}
                              className={`flex items-start space-x-3 p-2.5 transition-all border ${
                                isSubActive
                                  ? 'bg-brand/5 border-brand/20'
                                  : 'border-transparent hover:bg-bg-muted'
                              }`}
                              style={{ borderRadius: 'var(--radius)', transitionDuration: 'var(--dur)' }}
                            >
                              <div className={`p-2 transition-transform ${subItem.color} ${isSubActive ? 'scale-105' : ''}`} style={{ borderRadius: 'var(--radius-sm)', transitionDuration: 'var(--dur-slow)' }}>
                                <SubIcon strokeWidth={1.75} className="h-4 w-4" />
                              </div>
                              <div className="flex flex-col">
                                <span className={`text-xs font-semibold ${isSubActive ? 'text-brand' : 'text-fg-1'}`}>
                                  {subItem.label}
                                </span>
                                <span className="mt-0.5 text-[10px] leading-relaxed text-fg-3">
                                  {subItem.desc}
                                </span>
                              </div>
                            </NavLink>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* Quick Actions */}
        <div className="hidden lg:flex items-center space-x-3">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex items-center justify-center border border-border bg-bg-muted px-3.5 py-2 text-fg-3 transition-all hover:bg-border-hover hover:text-fg-1"
            style={{ borderRadius: 'var(--radius)', transitionDuration: 'var(--dur)' }}
            title="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-3.5 w-3.5" strokeWidth={1.75} />
            ) : (
              <Moon className="h-3.5 w-3.5" strokeWidth={1.75} />
            )}
          </button>

          <a
            href="/intro"
            className="cta cta-secondary cta-sm group"
            style={{ height: '36px', padding: '0 14px', fontSize: '12px', borderRadius: 'var(--radius)' }}
          >
            <BookOpen className="h-3.5 w-3.5 transition-transform group-hover:rotate-6" strokeWidth={1.75} style={{ transitionDuration: 'var(--dur-slow)' }} />
            <span>Giới thiệu</span>
          </a>
          <a
            href="https://yody-itdx-ea.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="cta cta-primary cta-sm group"
            style={{ height: '36px', padding: '0 16px', fontSize: '12px', borderRadius: 'var(--radius)' }}
          >
            <span className="font-bold">Portal</span>
            <ArrowUpRight strokeWidth={1.75} className="h-3 w-3 text-white/80 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden items-center space-x-2">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="inline-flex items-center justify-center p-2 text-fg-3 hover:bg-bg-muted hover:text-fg-1 focus:outline-none"
            style={{ borderRadius: 'var(--radius)' }}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" strokeWidth={1.75} /> : <Moon className="h-5 w-5" strokeWidth={1.75} />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center p-2 text-fg-3 hover:bg-bg-muted hover:text-fg-1 focus:outline-none"
            style={{ borderRadius: 'var(--radius)' }}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" strokeWidth={1.75} /> : <Menu className="h-5 w-5" strokeWidth={1.75} />}
          </button>
        </div>

      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 z-50 border-b border-border bg-bg px-4 py-4 space-y-1.5 max-h-[calc(100vh-4rem)] overflow-y-auto" style={{ boxShadow: 'var(--shadow-md)' }}>
          <div className="px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-brand">
            Điều hướng chương trình
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex w-full items-center space-x-3 px-3.5 py-2.5 text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-brand/10 text-brand border border-brand/20'
                      : 'text-fg-2 hover:bg-bg-muted hover:text-fg-1 border border-transparent'
                  }`
                }
                style={{ borderRadius: 'var(--radius)' }}
              >
                <Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
          
          <div className="border-t border-border pt-3.5 mt-3.5 space-y-2">
            <a
              href="/intro"
              onClick={() => setMobileMenuOpen(false)}
              className="flex w-full items-center space-x-3 bg-bg-muted px-3.5 py-2.5 text-sm font-medium text-fg-2 hover:bg-border-hover hover:text-fg-1"
              style={{ borderRadius: 'var(--radius)' }}
            >
              <BookOpen className="h-4 w-4 text-fg-3" strokeWidth={1.75} />
              <span>Giới thiệu chương trình</span>
            </a>
            <a
              href="https://yody-itdx-ea.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-between bg-brand px-3.5 py-2.5 text-sm font-medium text-white hover:bg-brand-deep"
              style={{ borderRadius: 'var(--radius)' }}
            >
              <span className="font-bold">Yody ITDX EA Portal</span>
              <ArrowUpRight className="h-4 w-4 text-white/80" strokeWidth={1.75} />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
