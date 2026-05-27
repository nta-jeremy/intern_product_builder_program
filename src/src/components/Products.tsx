import React, { useState } from 'react';
import { PRODUCTS_DATA } from '../data';
import { Star, ChevronDown, ChevronRight, User, Settings, ShieldCheck, Mail, Target, Award, ListChecks, CheckSquare } from 'lucide-react';

export default function Products() {
  const [activeProductId, setActiveProductId] = useState<string>(PRODUCTS_DATA[0].id);

  const selectedProduct = PRODUCTS_DATA.find((p) => p.id === activeProductId) || PRODUCTS_DATA[0];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CAO':
        return 'text-gap border-gap/20 bg-gap/10';
      case 'TRUNG BÌNH':
        return 'text-plan border-plan/20 bg-plan/10';
      default:
        return 'text-fg-3 border-border bg-bg-muted';
    }
  };

  const drawStars = (count: number) => {
    return Array.from({ length: 3 }).map((_, idx) => (
      <Star
        key={idx}
        strokeWidth={1.75}
        className={`h-3 w-3 ${idx < count ? 'fill-gold text-gold' : 'text-fg-3'}`}
      />
    ));
  };

  const romanNumerals = ['I', 'II', 'III', 'IV'];

  return (
    <div className="space-y-10 py-6" id="products-catalog-container">
      {/* Intro Header */}
      <div className="space-y-4 border-b border-border pb-6">
        <div className="s-eyebrow">
          <ListChecks className="h-4 w-4 mr-1" strokeWidth={1.75} />
          DANH MỤC 4 SẢN PHẨM PHÁT TRIỂN
        </div>
        <h2 className="font-impact text-2xl sm:text-4xl font-extrabold tracking-tight text-fg-1">
          Thực Chiến 4 Sản Phẩm • Trải Nghiệm AI-First
        </h2>
        <p className="font-sans text-sm text-fg-2 max-w-4xl leading-relaxed">
          Trong vòng 3 tháng, Intern Product Builder cần phối hợp linh hoạt cùng AI để nghiên cứu, thiết kế, phát triển và go-live 
          thành công 4 sản phẩm giải quyết bài toán cốt lõi dưới đây của YODY. 
          Các dự án được xếp hạng ưu tiên rõ nét để bạn phân bổ nguồn lực.
        </p>
      </div>

      {/* Grid Menu Selectors - 4 Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="products-selector-grid">
        {PRODUCTS_DATA.map((product, idx) => {
          const isSelected = product.id === activeProductId;
          return (
            <button
              key={product.id}
              onClick={() => setActiveProductId(product.id)}
              className={`relative overflow-hidden flex flex-col items-start text-left rounded-xl p-5 border transition-all duration-300 ${
                isSelected
                  ? 'bg-bg-warm border-brand/40 shadow-md ring-1 ring-brand/20'
                  : 'bg-bg border-border text-fg-2 hover:bg-bg-muted hover:border-brand/20'
              }`}
            >
              {/* Glow accent bar */}
              {isSelected && <div className="absolute top-0 left-0 right-0 h-[2px] bg-brand" />}

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
              <div className="flex items-baseline space-x-2">
                <span className={`font-impact italic font-extrabold text-lg ${isSelected ? 'text-brand' : 'text-fg-3'}`}>
                  {romanNumerals[idx]}.
                </span>
                <span className={`font-impact text-base font-bold transition-colors ${isSelected ? 'text-fg-1' : 'text-fg-2 group-hover:text-fg-1'}`}>
                  {product.title}
                </span>
              </div>
              <span className="font-mono text-[10px] text-fg-3 mt-1 line-clamp-1 font-bold">
                {product.subtitle}
              </span>

              {/* Description preview */}
              <p className="font-sans text-xs text-fg-3 line-clamp-2 mt-3 leading-relaxed">
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
          <div className="rounded-xl border border-border bg-bg-warm p-6 space-y-5 shadow-sm">
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-brand font-bold block mb-2">Mô Tả Dự Án</span>
              <h3 className="font-impact text-xl font-bold text-fg-1">{selectedProduct.title}</h3>
              <p className="font-mono text-xs text-fg-3 font-bold">{selectedProduct.subtitle}</p>
            </div>

            <p className="font-sans text-xs text-fg-2 leading-relaxed border-t border-border pt-4">
              {selectedProduct.description}
            </p>

            {/* Target Stakeholders */}
            <div className="space-y-3 pt-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-fg-3 font-semibold block">
                Người Dùng Chính (Target Stakeholders)
              </span>
              <div className="space-y-2">
                {selectedProduct.primaryUsers.map((user, idx) => (
                  <div key={idx} className="flex items-start text-xs text-fg-2 bg-bg-muted border border-border p-2.5 rounded-lg space-x-2">
                    <User strokeWidth={1.75} className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                    <span className="leading-relaxed font-medium">{user}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategy Approach (For compliance verification or specific ones) */}
            {selectedProduct.approaches && (
              <div className="space-y-3 pt-2 border-t border-border mt-4 pt-4">
                <span className="font-mono text-[10px] uppercase tracking-wider text-fg-3 font-semibold block">
                  Phác Thảo Hướng Tiếp Cận (Strategy Approach)
                </span>
                <div className="space-y-2">
                  {selectedProduct.approaches.map((strategy, idx) => (
                    <div key={idx} className="flex items-start text-xs text-fg-2 space-x-2">
                      <span className="font-mono font-bold text-brand mr-2 mt-0.5">0{idx + 1}.</span>
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
          <div className="rounded-xl border border-border bg-bg-warm p-6 space-y-4 shadow-sm">
            <div className="flex items-center space-x-2 mb-6">
              <Target strokeWidth={1.75} className="h-5 w-5 text-brand" />
              <span className="font-impact text-sm uppercase tracking-wider text-fg-1">
                CÁC TÍNH NĂNG MVP CẦN DELIVER & TIÊU CHÍ NGHIỆM THU
              </span>
            </div>

            {/* Desktop Table view */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border font-mono text-fg-3 uppercase text-[10px] font-bold">
                    <th className="py-3 px-4 w-1/4">Feature / Deliverable</th>
                    <th className="py-3 px-4 w-1/3">Output cụ thể</th>
                    <th className="py-3 px-4 w-1/3">KPI / Acceptance Criteria</th>
                    <th className="py-3 px-4 text-center">Sign-off</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-fg-2">
                  {selectedProduct.deliverables.map((item, idx) => (
                    <tr key={idx} className="hover:bg-bg-muted transition-colors">
                      <td className="py-3.5 px-4 font-sans font-bold text-fg-1 leading-normal">
                        {item.feature}
                      </td>
                      <td className="py-3.5 px-4 font-sans text-fg-2 leading-relaxed">
                        {item.output}
                      </td>
                      <td className="py-3.5 px-4 font-sans text-fg-2 leading-relaxed">
                        <span className="text-brand font-medium">★ KPI: </span>
                        {item.kpi}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-center">
                        <span className="tag tag-build">
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
                <div key={idx} className="rounded-lg bg-bg-muted border border-border p-4 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="font-impact font-bold text-fg-1 text-xs">{item.feature}</span>
                    <span className="tag tag-build">
                      {item.signOff}
                    </span>
                  </div>
                  <div className="text-[11px] space-y-1">
                    <span className="text-fg-3 block font-bold">Output:</span>
                    <p className="text-fg-2 leading-snug">{item.output}</p>
                  </div>
                  <div className="text-[11px] space-y-1 bg-brand/5 p-2 rounded border border-brand/10">
                    <span className="text-brand block font-semibold">KPI:</span>
                    <p className="text-fg-2 leading-snug">{item.kpi}</p>
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
