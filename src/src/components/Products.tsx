import React, { useState } from 'react';
import { PRODUCTS_DATA } from '../data';
import { Star, ChevronDown, ChevronRight, User, Settings, ShieldCheck, Mail, Target, Award, ListChecks, CheckSquare } from 'lucide-react';

export default function Products() {
  const [activeProductId, setActiveProductId] = useState<string>(PRODUCTS_DATA[0].id);

  const selectedProduct = PRODUCTS_DATA.find((p) => p.id === activeProductId) || PRODUCTS_DATA[0];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CAO':
        return 'text-red-400 border-red-500/20 bg-red-950/30';
      case 'TRUNG BÌNH':
        return 'text-yellow-500 border-yellow-500/20 bg-yellow-950/30';
      default:
        return 'text-neutral-400 border-neutral-700 bg-neutral-900';
    }
  };

  const drawStars = (count: number) => {
    return Array.from({ length: 3 }).map((_, idx) => (
      <Star
        key={idx}
        className={`h-3 w-3 ${idx < count ? 'fill-yellow-500 text-yellow-500' : 'text-neutral-700'}`}
      />
    ));
  };

  return (
    <div className="space-y-10 py-6" id="products-catalog-container">
      {/* Intro Header */}
      <div className="space-y-2 border-b border-white/[0.08] pb-6">
        <div className="inline-flex items-center space-x-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3.5 py-1 text-xs font-medium text-yellow-500 tracking-wider font-mono">
          <ListChecks className="h-3 w-3" />
          <span>DANH MỤC 4 SẢN PHẨM PHÁT TRIỂN</span>
        </div>
        <h2 className="font-sans text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
          Thực Chiến 4 Sản Phẩm • Trải Nghiệm AI-First
        </h2>
        <p className="font-sans text-sm text-neutral-400 max-w-4xl leading-relaxed">
          Trong vòng 3 tháng, Intern Product Builder cần phối hợp linh hoạt cùng AI để nghiên cứu, thiết kế, phát triển và go-live 
          thành công 4 sản phẩm giải quyết bài toán cốt lõi dưới đây của YODY. 
          Các dự án được xếp hạng ưu tiên rõ nét để bạn phân bổ nguồn lực.
        </p>
      </div>

      {/* Grid Menu Selectors - 4 Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="products-selector-grid">
        {PRODUCTS_DATA.map((product) => {
          const isSelected = product.id === activeProductId;
          return (
            <button
              key={product.id}
              onClick={() => setActiveProductId(product.id)}
              className={`relative overflow-hidden flex flex-col items-start text-left rounded-xl p-5 border transition-all duration-300 ${
                isSelected
                  ? 'bg-neutral-900 border-yellow-500/40 shadow-xl shadow-yellow-500/[0.02] ring-1 ring-yellow-500/20'
                  : 'bg-neutral-950 border-white/[0.08] text-neutral-400 hover:bg-neutral-900 hover:border-white/25'
              }`}
            >
              {/* Glow accent bar */}
              {isSelected && <div className="absolute top-0 left-0 right-0 h-[2px] bg-yellow-500" />}

              {/* Priority Stars and Star Rating */}
              <div className="flex w-full items-center justify-between text-[10px] font-mono mb-3">
                <div className={`px-2 py-0.5 rounded border ${getPriorityColor(product.priority)} font-bold tracking-wider`}>
                  UT: {product.priority}
                </div>
                <div className="flex space-x-0.5">
                  {drawStars(product.priorityStars)}
                </div>
              </div>

              {/* Title / Subtitle */}
              <span className={`font-sans text-base font-bold transition-colors ${isSelected ? 'text-white' : 'text-neutral-300 group-hover:text-white'}`}>
                {product.title}
              </span>
              <span className="font-mono text-[10px] text-neutral-500 mt-1 line-clamp-1">
                {product.subtitle}
              </span>

              {/* Description preview */}
              <p className="font-sans text-xs text-neutral-500 line-clamp-2 mt-3 leading-relaxed">
                {product.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Showcase Detail Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
        {/* Left Info Panel (Product overview, main users, approach) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-xl border border-white/[0.08] bg-neutral-950 p-6 space-y-5">
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-yellow-500">Mô Tả Dự Án</span>
              <h3 className="font-sans text-xl font-bold text-white">{selectedProduct.title}</h3>
              <p className="font-mono text-xs text-neutral-500">{selectedProduct.subtitle}</p>
            </div>

            <p className="font-sans text-xs text-neutral-300 leading-relaxed border-t border-white/[0.06] pt-4">
              {selectedProduct.description}
            </p>

            {/* Target Stakeholders */}
            <div className="space-y-3 pt-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 font-semibold block">
                Người Dùng Chính (Target Stakeholders)
              </span>
              <div className="space-y-2">
                {selectedProduct.primaryUsers.map((user, idx) => (
                  <div key={idx} className="flex items-start text-xs text-neutral-400 bg-neutral-900 border border-white/[0.04] p-2.5 rounded-lg space-x-2">
                    <User className="h-4.5 w-4.5 text-yellow-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{user}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategy Approach (For compliance verification or specific ones) */}
            {selectedProduct.approaches && (
              <div className="space-y-3 pt-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 font-semibold block">
                  Phác Thảo Hướng Tiếp Cận (Strategy Approach)
                </span>
                <div className="space-y-2">
                  {selectedProduct.approaches.map((strategy, idx) => (
                    <div key={idx} className="flex items-start text-xs text-neutral-400 space-x-2">
                      <span className="font-mono font-bold text-yellow-500 mr-2 mt-0.5">0{idx + 1}.</span>
                      <span className="leading-relaxed">{strategy}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Info Panel: Large Table of Deliverables */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-xl border border-white/[0.08] bg-neutral-950 p-6 space-y-4">
            <div className="flex items-center space-x-2">
              <Target className="h-4.5 w-4.5 text-yellow-500" />
              <span className="font-mono text-xs uppercase tracking-wider text-neutral-200 font-bold">
                CÁC TÍNH NĂNG MVP CẦN DELIVER & TIÊU CHÍ NGHIỆM THU
              </span>
            </div>

            {/* Desktop Table view */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.08] font-mono text-neutral-400 uppercase text-[10px]">
                    <th className="py-3 px-4 w-1/4">Feature / Deliverable</th>
                    <th className="py-3 px-4 w-1/3">Output cụ thể</th>
                    <th className="py-3 px-4 w-1/3">KPI / Acceptance Criteria</th>
                    <th className="py-3 px-4 text-center">Sign-off</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] text-neutral-300">
                  {selectedProduct.deliverables.map((item, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-3.5 px-4 font-sans font-bold text-white leading-normal">
                        {item.feature}
                      </td>
                      <td className="py-3.5 px-4 font-sans text-neutral-400 leading-relaxed">
                        {item.output}
                      </td>
                      <td className="py-3.5 px-4 font-sans text-neutral-400 leading-relaxed">
                        <span className="text-yellow-500/90 font-medium">★ KPI: </span>
                        {item.kpi}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center rounded-md bg-neutral-900 px-2 py-1 text-[10px] font-mono font-semibold text-yellow-500 border border-yellow-500/20">
                          {item.signOff}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards (Fallback for responsive view) */}
            <div className="block sm:hidden space-y-4 mt-2">
              {selectedProduct.deliverables.map((item, idx) => (
                <div key={idx} className="rounded-lg bg-neutral-900 border border-white/[0.04] p-4 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-white/[0.04] pb-2">
                    <span className="font-sans font-bold text-white text-xs">{item.feature}</span>
                    <span className="rounded bg-neutral-950 border border-yellow-500/20 text-yellow-500 px-1.5 py-0.5 text-[9px] font-mono">
                      {item.signOff}
                    </span>
                  </div>
                  <div className="text-[11px] space-y-1">
                    <span className="text-neutral-500 block">Output:</span>
                    <p className="text-neutral-300 leading-snug">{item.output}</p>
                  </div>
                  <div className="text-[11px] space-y-1 bg-yellow-500/5 p-2 rounded border border-yellow-500/10">
                    <span className="text-yellow-500 block font-semibold">KPI:</span>
                    <p className="text-neutral-300 leading-snug">{item.kpi}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
