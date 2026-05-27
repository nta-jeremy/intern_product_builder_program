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
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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

  // Nhóm menu cho Interactive Hub (v2)
  const groupedMenus = [
    {
      id: 'personal',
      title: 'Định hướng & Sổ tay',
      items: [
        { path: '/profile', label: 'Tiêu chí cá nhân', desc: 'Định nghĩa chân dung, khung năng lực và mục tiêu.', icon: Award, color: 'text-amber-500 bg-amber-500/10' },
        { path: '/journal', label: 'Sổ tay thực tập', desc: 'Nhật ký công việc, học tập và ghi nhận hàng ngày.', icon: FileEdit, color: 'text-blue-500 bg-blue-500/10' },
      ]
    },
    {
      id: 'product-coaching',
      title: 'Sản phẩm & Đánh giá',
      items: [
        { path: '/products', label: 'Chân dung 4 sản phẩm', desc: 'Chi tiết về 4 dòng sản phẩm cốt lõi đang xây dựng.', icon: Boxes, color: 'text-emerald-500 bg-emerald-500/10' },
        { path: '/lifecycle', label: 'Coaching Lifecycle', desc: 'Lộ trình huấn luyện và đào tạo đồng hành phát triển.', icon: Milestone, color: 'text-purple-500 bg-purple-500/10' },
        { path: '/scorecard', label: 'Scorecard đánh giá', desc: 'Bảng điểm hiệu suất và ghi nhận năng lực định kỳ.', icon: CheckSquare, color: 'text-rose-500 bg-rose-500/10' },
      ]
    }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.05] bg-neutral-950/80 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo Section */}
        <NavLink to="/" className="flex items-center space-x-3 group">
          <img src="/yody-logo.webp" alt="YODY" className="h-8 w-auto rounded-md transition-transform duration-300 group-hover:scale-105" />
          <div className="flex flex-col">
            <span className="font-sans text-sm font-extrabold tracking-wider text-white">YODY ITDX</span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-yellow-500">Hub Control</span>
          </div>
        </NavLink>

        {/* Desktop Smart Grouped Navigation */}
        <nav className="hidden lg:flex items-center space-x-2">
          {/* Trang chủ: Tổng quan */}
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center space-x-2 rounded-xl px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-200 border ${
                isActive
                  ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                  : 'text-neutral-400 hover:bg-white/[0.02] hover:text-white border-transparent'
              }`
            }
          >
            <LayoutDashboard className="h-4 w-4" />
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
                  className={`flex items-center space-x-1.5 rounded-xl px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-200 border ${
                    isGroupActive
                      ? 'bg-white/[0.04] text-white border-white/10'
                      : 'text-neutral-400 hover:bg-white/[0.02] hover:text-white border-transparent'
                  } ${isOpen ? 'bg-white/[0.02]' : ''}`}
                >
                  <span>{group.title}</span>
                  <ChevronDown className={`h-3 w-3 text-neutral-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-white' : ''}`} />
                </button>

                {/* Mega Dropdown Menu */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute left-0 mt-2.5 w-80 rounded-2xl border border-white/[0.08] bg-neutral-950/95 p-3.5 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl"
                    >
                      <div className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
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
                              className={`flex items-start space-x-3 rounded-xl p-2.5 transition-all duration-200 border ${
                                isSubActive
                                  ? 'bg-yellow-500/10 border-yellow-500/20'
                                  : 'border-transparent hover:bg-white/[0.03]'
                              }`}
                            >
                              <div className={`rounded-lg p-2 transition-transform duration-300 ${subItem.color} ${isSubActive ? 'scale-105' : ''}`}>
                                <SubIcon className="h-4 w-4" />
                              </div>
                              <div className="flex flex-col">
                                <span className={`text-xs font-semibold ${isSubActive ? 'text-yellow-500' : 'text-neutral-200'}`}>
                                  {subItem.label}
                                </span>
                                <span className="mt-0.5 text-[10px] leading-relaxed text-neutral-400">
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
          <a
            href="/intro/"
            className="group flex items-center space-x-1.5 rounded-xl border border-white/5 bg-neutral-900/40 px-3.5 py-2 text-xs font-medium text-neutral-400 transition-all hover:bg-neutral-900 hover:text-white"
          >
            <BookOpen className="h-3.5 w-3.5 transition-transform group-hover:rotate-6" />
            <span>Giới thiệu</span>
          </a>
          <a
            href="https://yody-itdx-ea.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center space-x-1.5 rounded-xl bg-neutral-900 border border-white/10 px-4 py-2 text-xs font-semibold text-white transition-all hover:border-white/20 hover:bg-neutral-800"
          >
            <span className="text-yellow-500 font-bold">Portal</span>
            <ArrowUpRight className="h-3 w-3 text-neutral-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-xl p-2 text-neutral-400 hover:bg-neutral-900 hover:text-white focus:outline-none"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu (Dành cho màn hình nhỏ) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 z-50 border-b border-white/[0.08] bg-neutral-950 px-4 py-4 space-y-1.5 shadow-[0_15px_30px_rgba(0,0,0,0.8)] max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-yellow-500/80">
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
                  `flex w-full items-center space-x-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-yellow-500/15 text-yellow-500 border border-yellow-500/10'
                      : 'text-neutral-400 hover:bg-white/[0.02] hover:text-white border border-transparent'
                  }`
                }
              >
                <Icon className="h-4.5 w-4.5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
          
          <div className="border-t border-white/[0.08] pt-3.5 mt-3.5 space-y-2">
            <a
              href="/intro/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex w-full items-center space-x-3 rounded-xl bg-neutral-900/60 px-3.5 py-2.5 text-sm font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white"
            >
              <BookOpen className="h-4 w-4 text-neutral-400" />
              <span>Giới thiệu chương trình</span>
            </a>
            <a
              href="https://yody-itdx-ea.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-between rounded-xl bg-neutral-900/60 px-3.5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
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