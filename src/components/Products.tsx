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
    <div className="py-6" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-10)' }} id="products-catalog-container">
      {/* Intro Header */}
      <div className="border-b border-border pb-6" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-4)' }}>
        <div className="s-eyebrow">
          <ListChecks className="h-4 w-4 mr-1" strokeWidth={1.75} />
          BỐN LỰA CHỌN SẢN PHẨM
        </div>
        <h2 className="text-fg-1" style={{ font: 'var(--type-h2)', letterSpacing: '-0.018em' }}>
          Mỗi thực tập sinh đảm nhận một sản phẩm
        </h2>
        <p className="max-w-4xl" style={{ font: 'var(--type-body-sm)', color: 'var(--fg-2)', lineHeight: '1.7' }}>
          Chương trình có bốn sản phẩm để phân công. Mỗi thực tập sinh chỉ đảm nhận một trong bốn sản phẩm trong vòng ba tháng.
          Hãy chọn từng mục để xem bài toán, kết quả cần bàn giao, tiêu chí nghiệm thu và người phê duyệt.
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
              className={`relative overflow-hidden flex flex-col items-start text-left p-5 border transition-all ${
                isSelected
                  ? 'bg-bg-warm border-brand/40 ring-1 ring-brand/20'
                  : 'bg-bg border-border text-fg-2 hover:bg-bg-muted hover:border-brand/20'
              }`}
              style={{ borderRadius: 'var(--radius)', boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-rest)', transitionDuration: 'var(--dur-slow)' }}
            >
              {/* Glow accent bar */}
              {isSelected && <div className="absolute top-0 left-0 right-0 h-[2px] bg-brand" />}

              {/* Priority Stars and Star Rating */}
              <div className="flex w-full items-center justify-between text-[10px] font-mono mb-3">
                <div className={`px-2 py-0.5 border ${getPriorityColor(product.priority)} font-bold tracking-wider`} style={{ borderRadius: 'var(--radius-xs)' }}>
                  UT: {product.priority}
                </div>
                <div className="flex space-x-0.5">
                  {drawStars(product.priorityStars)}
                </div>
              </div>

              {/* Title / Subtitle — using .roman DS class for numerals */}
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
        {/* Left Info Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="yds-card-warm p-6" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-5)' }}>
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-brand font-bold block mb-2">Mô Tả Dự Án</span>
              <h3 className="text-fg-1" style={{ font: 'var(--type-h3)' }}>{selectedProduct.title}</h3>
              <p className="font-mono text-xs text-fg-3 font-bold">{selectedProduct.subtitle}</p>
            </div>

            <p className="font-sans text-xs text-fg-2 leading-relaxed border-t border-border pt-4">
              {selectedProduct.description}
            </p>

            {/* Target Stakeholders */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-3)', paddingTop: 'var(--s-2)' }}>
              <span className="font-mono text-[10px] uppercase tracking-wider text-fg-3 font-semibold block">
                Người dùng chính
              </span>
              <div className="space-y-2">
                {selectedProduct.primaryUsers.map((user, idx) => (
                  <div key={idx} className="flex items-start text-xs text-fg-2 bg-bg-muted border border-border p-2.5 space-x-2" style={{ borderRadius: 'var(--radius-sm)' }}>
                    <User strokeWidth={1.75} className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                    <span className="leading-relaxed font-medium">{user}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategy Approach */}
            {selectedProduct.approaches && (
              <div className="border-t border-border mt-4 pt-4" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' }}>
                <span className="font-mono text-[10px] uppercase tracking-wider text-fg-3 font-semibold block">
                  Hướng tiếp cận
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
          <div className="yds-card-warm p-6" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-4)' }}>
            <div className="flex items-center space-x-2 mb-6">
              <Target strokeWidth={1.75} className="h-5 w-5 text-brand" />
              <span className="font-impact text-sm uppercase tracking-wider text-fg-1">
                KẾT QUẢ CẦN BÀN GIAO VÀ TIÊU CHÍ NGHIỆM THU
              </span>
            </div>

            {/* Desktop Table view */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border font-mono text-fg-3 uppercase text-[10px] font-bold">
                    <th className="py-3 px-4 w-1/4">Hạng mục bàn giao</th>
                    <th className="py-3 px-4 w-1/3">Kết quả cụ thể</th>
                    <th className="py-3 px-4 w-1/3">KPI / Tiêu chí nghiệm thu</th>
                    <th className="py-3 px-4 text-center">Người phê duyệt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-fg-2">
                  {selectedProduct.deliverables.map((item, idx) => (
                    <tr key={idx} className="hover:bg-bg-muted transition-colors" style={{ transitionDuration: 'var(--dur-fast)' }}>
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
                <div key={idx} className="bg-bg-muted border border-border p-4 space-y-2.5" style={{ borderRadius: 'var(--radius-sm)' }}>
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="font-impact font-bold text-fg-1 text-xs">{item.feature}</span>
                    <span className="tag tag-build">
                      {item.signOff}
                    </span>
                  </div>
                  <div className="text-[11px] space-y-1">
                    <span className="text-fg-3 block font-bold">Kết quả:</span>
                    <p className="text-fg-2 leading-snug">{item.output}</p>
                  </div>
                  <div className="text-[11px] space-y-1 bg-brand/5 p-2 border border-brand/10" style={{ borderRadius: 'var(--radius-xs)' }}>
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
