import React, { useState, useEffect } from 'react';
import { JOURNAL_TEMPLATES } from '../data';
import { FileEdit, Sparkles, Copy, Download, Trash2, CheckCircle2, RefreshCw, FileText, AlertCircle } from 'lucide-react';

export default function WorkingJournal() {
  const [activeTemplateId, setActiveTemplateId] = useState<string>('brief');

  // Load from local storage or empty strings
  const [formData, setFormData] = useState<Record<string, Record<string, string>>>(() => {
    try {
      const saved = localStorage.getItem('yody_intern_journal_data');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    
    // Fallback initial structures
    const initial: Record<string, Record<string, string>> = {};
    JOURNAL_TEMPLATES.forEach((t) => {
      initial[t.id] = {};
      t.fields.forEach((f) => {
        initial[t.id][f.key] = '';
      });
    });
    return initial;
  });

  const [aiLoadingField, setAiLoadingField] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Auto save to localStorage
  useEffect(() => {
    localStorage.setItem('yody_intern_journal_data', JSON.stringify(formData));
  }, [formData]);

  const activeTemplate = JOURNAL_TEMPLATES.find((t) => t.id === activeTemplateId) || JOURNAL_TEMPLATES[0];

  const handleFieldChange = (fieldKey: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [activeTemplateId]: {
        ...prev[activeTemplateId],
        [fieldKey]: value,
      },
    }));
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Preset sample builder data to easily showcase high-quality fulfill examples
  const handleLoadSample = () => {
    if (activeTemplateId === 'brief') {
      const sampleBrief: Record<string, string> = {
        productName: 'Hệ thống tuyển dụng ATS - YODY Recruiter v1.0',
        problem: 'Quy trình tuyển dụng thủ công hiện tại tốn 5 giờ mỗi ngày để HR tải, lưu trữ, lọc CV từ email. Dữ liệu ứng viên bị phân mảnh trên nhiều file Excel và lỏng lẻo trong việc liên lạc, dẫn tới tỷ lệ bỏ dở phỏng vấn cao (18%).',
        targetUsers: 'Chị Lan - HR Recruiter cần rà soát 80 CV/ngày để lọc ứng viên tiềm năng; Anh Hoàng - Hiring Manager cần phê duyệt hồ sơ và cho điểm phỏng vấn theo phòng ban trực tuyến nhanh nhất.',
        whyNow: 'YODY đang tăng trưởng quy mô tổ chức 15% mỗi quý. Việc tuyển dụng chậm trễ hoặc thất thoát nhân tài do quy trình thủ công kéo dài trực tiếp kìm hãm tốc độ mở rộng hệ thống bán lẻ.',
        solutionOverview: 'Thiết kế hệ thống tuyển dụng trực tuyến AI-First phối hợp. Cho phép HR tải lên CV, Agent AI tự động bóc tách kỹ năng, lọc từ khóa, phân loại vào pipeline (Applied, Interview, Offer, Reject) và gửi tin báo động Slack.',
        scopeIn: 'Đăng nhập tài khoản HR; Quản lý hồ sơ ứng viên; Tải lên CV trực tiếp (PDF, docx); Bộ lọc tìm kiếm nhanh; Gửi email tự động cập nhật trạng thái ứng viên; Dashboard chỉ số cơ bản.',
        scopeOut: 'Hệ thống đặt lịch phỏng vấn tự động đồng bộ Google Calendar; Trực tiếp thực hiện phỏng vấn ghi âm giọng nói (xử lý ở v2.0).',
        successMetrics: 'Cắt giảm thời gian lọc CV từ 5 giờ xuống còn 30 phút mỗi ngày. Tỷ lệ bỏ dở phỏng vấn của ứng viên giảm xuống dưới 8%. Điểm hài lòng của HR Lead đạt trên 4.7/5 sao.',
        techStack: 'Frontend React + Tailwind CSS bám sát phong cách Yody ITDX; Backend Express kết nối Gemini-3.5-flash để bóc tách thông tin CV và prompt; Local Storage để giữ dữ liệu tạm thời.'
      };
      setFormData((prev) => ({ ...prev, brief: sampleBrief }));
      showNotification('Đã nạp mẫu dữ liệu Product Brief chuẩn mẫu!', 'success');
    } else if (activeTemplateId === 'retro') {
      const sampleRetro: Record<string, string> = {
        sprintNumber: 'Sprint #02 - Phân hệ bóc tách CV tự động',
        shipped: 'Hoàn thiện giao diện pipeline kéo thả kéo ứng viên mượt mà; Tự động kết nối thành công API Gemini để bóc tách thông tin ứng viên từ CV tải lên.',
        unshipped: 'Tính năng gửi email thông báo hàng loạt bị chậm do bên thứ 3 chặn cổng SMTP, tạm thời chuyển sang in báo cáo log.',
        blockers: 'API bóc tách ngôn ngữ tự nhiên ban đầu định dạng lộn xộn, đã giải quyết bằng cách áp dụng cấu trúc Prompt Response JSON Schema của Gemini SDK.',
        aiRatio: '80% tính năng xây dựng sử dụng Cursor và AI gõ code hướng dẫn cấu trúc.',
        learnings: 'Học được cách thiết kế Prompt bọc chặt kiểu dữ liệu trả về để chống hiện tượng hallucinations của AI; Hiểu sâu quy trình nghiệp vụ phỏng vấn thực của HR.',
        improvements: 'Phải trao đổi sớm với Network Lead về các giới hạn firewall SMTP để tránh tắc nghẽn ở tuần sau.'
      };
      setFormData((prev) => ({ ...prev, retro: sampleRetro }));
      showNotification('Đã nạp mẫu dữ liệu Sprint Retrospective!', 'success');
    } else {
      showNotification('Vui lòng nhập trực tiếp hoặc nhấp AI hỗ trợ viết mẫu cho các biểu mẫu này.', 'info');
    }
  };

  const clearForm = () => {
    if (window.confirm('Bạn có thực sự muốn xóa toàn bộ nội dung trong biểu mẫu hiện tại không?')) {
      const cleared: Record<string, string> = {};
      activeTemplate.fields.forEach((f) => {
        cleared[f.key] = '';
      });
      setFormData((prev) => ({
        ...prev,
        [activeTemplateId]: cleared,
      }));
      showNotification('Đã dọn sạch biểu mẫu hiện tại.', 'info');
    }
  };

  // Execute Gemini AI writer assistant on backend
  const handleAiAssist = async (fieldKey: string, fieldLabel: string) => {
    const roughNotes = formData[activeTemplateId][fieldKey] || '';
    if (!roughNotes.trim()) {
      showNotification('Vui lòng điền vài ý tưởng nháp hoặc từ khóa thô vào vùng soạn thảo trước khi bấm AI hỗ trợ.', 'error');
      return;
    }

    setAiLoadingField(fieldKey);
    try {
      const response = await fetch('/api/gemini/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: activeTemplateId,
          fieldKey,
          fieldLabel,
          roughNotes,
          contextData: formData[activeTemplateId],
        }),
      });

      const data = await response.json();
      if (response.ok && data.result) {
        handleFieldChange(fieldKey, data.result);
        showNotification('Đã nâng cấp văn bản thành công bằng AI!', 'success');
      } else {
        throw new Error(data.error || 'Lỗi không xác định từ máy chủ hỗ trợ.');
      }
    } catch (err: any) {
      console.error(err);
      showNotification(`Lỗi AI: ${err?.message || err}`, 'error');
    } finally {
      setAiLoadingField(null);
    }
  };

  // Export to Markdown String
  const generateMarkdownString = () => {
    let md = `# ${activeTemplate.title}\n`;
    md += `*Tài liệu thực hiện chép của Intern Product Builder tại YODY*\n`;
    md += `*Thời gian chép: ${new Date().toLocaleDateString('vi-VN')}*\n\n`;
    md += `---\n\n`;

    activeTemplate.fields.forEach((f) => {
      const val = formData[activeTemplateId][f.key] || '*(Trống, chưa điền)*';
      md += `### ${f.label}\n`;
      md += `${val}\n\n`;
    });

    return md;
  };

  // Copy to clipboard
  const handleCopyToClipboard = () => {
    const textStr = generateMarkdownString();
    navigator.clipboard.writeText(textStr);
    showNotification('Đã sao chép tài liệu dưới dạng Markdown vào khay nhớ tạm!', 'success');
  };

  // Export file download link
  const handleDownloadMarkdown = () => {
    const mdContent = generateMarkdownString();
    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `YODY_Journal_${activeTemplateId}_${new Date().toISOString().split('T')[0]}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Đã tải xuống tệp Markdown thành công!', 'success');
  };

  return (
    <div className="space-y-10 py-6 font-sans text-fg-2" id="working-journal-layout">
      {/* Page Header */}
      <div className="space-y-4 border-b border-border pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="s-eyebrow">
            <FileEdit className="h-4 w-4 mr-1" strokeWidth={1.75} />
            INTERN WORKING JOURNAL
          </div>
          <h2 className="text-2xl sm:text-4xl font-impact font-extrabold text-fg-1 tracking-tight">
            Sổ Tay Thực Tập — Journal Tự Học
          </h2>
          <p className="text-sm text-fg-2 max-w-2xl leading-relaxed">
            Mỗi Intern là chủ thể tự quản lý và ghi chép hành trình thực chiến. 
            Điền hoàn chỉnh các biểu mẫu quy trình là điều kiện tiên quyết để tham gia bảo vệ cuối kỳ. 
            Bạn có thể phối hợp gõ ý tưởng thô và dùng gõ phím AI đồng hành để chuẩn hóa.
          </p>
        </div>

        {/* Global Action controls */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
          <button
            onClick={handleLoadSample}
            className="flex items-center space-x-1.5 rounded-lg border border-border bg-bg-muted px-3 py-1.5 text-xs font-medium text-fg-2 transition-colors hover:bg-border hover:border-border-hover cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5 text-brand" strokeWidth={1.75} />
            <span>Nạp Mẫu</span>
          </button>
          <button
            onClick={clearForm}
            className="flex items-center space-x-1.5 rounded-lg border border-gap/20 bg-gap/10 px-3 py-1.5 text-xs font-medium text-gap transition-colors hover:bg-gap/20 hover:border-gap/30 cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
            <span>Xóa Biểu Mẫu</span>
          </button>
          <button
            onClick={handleCopyToClipboard}
            className="flex items-center space-x-1.5 rounded-lg border border-border bg-bg-muted px-3 py-1.5 text-xs font-medium text-fg-2 transition-colors hover:bg-border hover:border-border-hover cursor-pointer"
          >
            <Copy className="h-3.5 w-3.5" strokeWidth={1.75} />
            <span>Sao Chép</span>
          </button>
          <button
            onClick={handleDownloadMarkdown}
            className="flex items-center space-x-1.5 rounded-lg bg-brand px-3 py-1.5 text-xs font-bold text-white transition-colors hover:opacity-90 cursor-pointer shadow-sm"
          >
            <Download className="h-3.5 w-3.5" strokeWidth={2} />
            <span>Tải Xuống .MD</span>
          </button>
        </div>
      </div>

      {/* Temp Notification Toast */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-50 rounded-xl border p-4 shadow-md flex items-center space-x-3 text-xs max-w-sm transition-all duration-300 animate-slide-in ${
          notification.type === 'success'
            ? 'bg-mint/10 text-mint-deep border-mint/30'
            : notification.type === 'error'
            ? 'bg-gap/10 text-gap border-gap/30'
            : 'bg-bg-muted text-fg-1 border-border'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 text-mint shrink-0" strokeWidth={1.75} />
          ) : (
            <AlertCircle className="h-5 w-5 text-gap shrink-0" strokeWidth={1.75} />
          )}
          <span className="leading-relaxed font-sans font-medium">{notification.message}</span>
        </div>
      )}

      {/* Grid: Left selector, Right editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Aspect: Selector card list */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-xl border border-border bg-bg-warm p-5 space-y-4 shadow-sm">
            <span className="font-mono text-xs uppercase text-fg-3 tracking-wider block font-semibold border-b border-border pb-2">
              DANH MỤC 5 BIỂU MẪU ĐẦU RA
            </span>
            <div className="flex flex-col space-y-2">
              {JOURNAL_TEMPLATES.map((t) => {
                const isSelected = t.id === activeTemplateId;
                return (
                  <button
                    key={t.id}
                    id={`journal-tab-trigger-${t.id}`}
                    onClick={() => setActiveTemplateId(t.id)}
                    className={`flex items-start text-left rounded-lg p-3 transition-all duration-200 border cursor-pointer ${
                      isSelected
                        ? 'bg-brand/5 border-brand/30 text-fg-1 shadow-sm'
                        : 'border-transparent text-fg-3 hover:bg-bg-muted hover:text-fg-2'
                    }`}
                  >
                    <FileText strokeWidth={1.75} className={`h-4.5 w-4.5 mr-3 mt-0.5 shrink-0 ${isSelected ? 'text-brand' : 'text-fg-3'}`} />
                    <div>
                      <div className="font-sans text-xs font-bold tracking-wide">{t.title}</div>
                      <p className="font-sans text-[10px] text-fg-3 line-clamp-2 mt-1 leading-snug">
                        {t.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Helper banner */}
          <div className="insight mt-0! shadow-sm!">
            <div className="insight-label text-[10px]! mb-2! flex items-center space-x-2">
              <Sparkles className="h-3.5 w-3.5 text-brand" strokeWidth={1.75} />
              <span>HỖ TRỢ VIẾT BẰNG AI</span>
            </div>
            <p className="insight-body font-sans text-xs! text-fg-2! leading-relaxed">
              Hãy viết vài dòng ý kiến thô, gạch đầu dòng ngắn hoặc từ khóa chính vào ô bên phải, sau đó bấm nút **"Gấp đôi năng lực viết bằng AI"** ở góc trên mỗi ô. 
              Mô hình **Gemini-3.5-flash** được huấn luyện theo chuẩn Product Builder YODY sẽ mở rộng, soạn thảo cấu trúc mượt mà cho bạn!
            </p>
          </div>
        </div>

        {/* Right Aspect: Interactive Form Editor */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-xl border border-border bg-bg-warm p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="border-b border-border pb-4 space-y-2">
              <h3 className="font-impact text-lg font-bold text-fg-1 tracking-tight">{activeTemplate.title}</h3>
              <p className="font-sans text-xs text-fg-3 leading-relaxed font-medium">
                {activeTemplate.description}
              </p>
            </div>

            {/* Render Form Inputs */}
            <div className="space-y-6">
              {activeTemplate.fields.map((f) => {
                const currentVal = formData[activeTemplateId]?.[f.key] || '';
                const isLoading = aiLoadingField === f.key;

                return (
                  <div key={f.key} className="space-y-2" id={`form-field-wrapper-${f.key}`}>
                    <div className="flex items-center justify-between text-xs gap-4">
                      <label className="font-sans font-bold text-fg-1" htmlFor={`input-${activeTemplateId}-${f.key}`}>
                        {f.label}
                      </label>
                      {f.type === 'textarea' && (
                        <button
                          onClick={() => handleAiAssist(f.key, f.label)}
                          disabled={isLoading || !currentVal.trim()}
                          className={`flex items-center space-x-1.5 rounded-md px-2.5 py-1 text-[10px] font-mono font-bold border transition-all ${
                            currentVal.trim()
                              ? 'bg-brand/10 text-brand border-brand/20 hover:bg-brand/20 cursor-pointer'
                              : 'bg-bg-muted text-fg-3 border-border cursor-not-allowed'
                          }`}
                          title="Gõ từ khóa/ý tưởng nháp trước rồi bấm nút này để AI viết hộ bài bản nhất"
                        >
                          {isLoading ? (
                            <RefreshCw className="h-3 w-3 animate-spin text-brand" strokeWidth={2} />
                          ) : (
                            <Sparkles className="h-3 w-3 text-brand" strokeWidth={2} />
                          )}
                          <span>AI Hỗ Trợ Viết</span>
                        </button>
                      )}
                    </div>

                    {/* Simple text input vs textarea */}
                    {f.type === 'text' ? (
                      <input
                        id={`input-${activeTemplateId}-${f.key}`}
                        type="text"
                        value={currentVal}
                        onChange={(e) => handleFieldChange(f.key, e.target.value)}
                        placeholder={f.placeholder}
                        className="w-full bg-bg border border-border rounded-lg px-3.5 py-2.5 text-xs text-fg-1 placeholder:text-fg-3 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/20 transition-all font-sans font-medium"
                      />
                    ) : (
                      <textarea
                        id={`input-${activeTemplateId}-${f.key}`}
                        value={currentVal}
                        onChange={(e) => handleFieldChange(f.key, e.target.value)}
                        placeholder={f.placeholder}
                        rows={5}
                        className={`w-full bg-bg border rounded-lg px-3.5 py-2.5 text-xs text-fg-1 placeholder:text-fg-3 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/20 transition-all font-sans leading-relaxed font-medium ${
                          isLoading ? 'border-brand/40 opacity-70 animate-pulse' : 'border-border'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
