import { useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Copy,
  Download,
  FileEdit,
  FileText,
  RefreshCw,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { JOURNAL_TEMPLATES, SUCCESS_PROFILE_DATA } from '../data';
import type { JournalTemplate } from '../types';

type JournalData = Record<string, Record<string, string>>;

const STORAGE_KEY = 'yody_intern_journal_data';

const LEGACY_FIELD_MAPPINGS: Record<string, { targetTemplate: string; fields: Record<string, string> }> = {
  brief: {
    targetTemplate: 'problem-brief',
    fields: {
      productName: 'productName',
      problem: 'problem',
      targetUsers: 'problem',
      whyNow: 'evidence',
      successMetrics: 'outcome',
      scopeIn: 'scope',
      scopeOut: 'scope',
    },
  },
  retro: {
    targetTemplate: 'weekly-checkin',
    fields: {
      sprintNumber: 'period',
      shipped: 'progress',
      unshipped: 'progress',
      blockers: 'blockers',
      learnings: 'aiUsage',
      improvements: 'nextStep',
    },
  },
  interview: {
    targetTemplate: 'user-feedback',
    fields: {
      interviewerDate: 'session',
      stakeholderInfo: 'session',
      currentProcess: 'context',
      painPoints: 'feedback',
      expectations: 'feedback',
      constraints: 'insight',
      insights: 'insight',
    },
  },
  uat: {
    targetTemplate: 'experiment-log',
    fields: {
      productPhase: 'experiment',
      uatDateParticipants: 'method',
      testScenarios: 'method',
      bugList: 'result',
      fixedBugs: 'decision',
      knownIssues: 'learning',
    },
  },
  handover: {
    targetTemplate: 'final-handover',
    fields: {
      prodUrl: 'prototypeLink',
      architecture: 'setup',
      maintenance: 'setup',
      knownErrors: 'limitations',
      techDebt: 'limitations',
      contacts: 'setup',
    },
  },
};

function createEmptyJournalData(templates: JournalTemplate[] = JOURNAL_TEMPLATES): JournalData {
  return Object.fromEntries(
    templates.map((template) => [
      template.id,
      Object.fromEntries(template.fields.map((field) => [field.key, ''])),
    ]),
  );
}

function appendMigratedValue(target: Record<string, string>, key: string, value: string) {
  const trimmed = value.trim();
  if (!trimmed) return;
  target[key] = target[key] ? `${target[key]}\n\n${trimmed}` : trimmed;
}

export function normalizeJournalData(saved: unknown, templates: JournalTemplate[] = JOURNAL_TEMPLATES): JournalData {
  const normalized = createEmptyJournalData(templates);
  if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return normalized;

  const source = saved as Record<string, unknown>;

  templates.forEach((template) => {
    const templateData = source[template.id];
    if (!templateData || typeof templateData !== 'object' || Array.isArray(templateData)) return;

    template.fields.forEach((field) => {
      const value = (templateData as Record<string, unknown>)[field.key];
      if (typeof value === 'string') normalized[template.id][field.key] = value;
    });
  });

  Object.entries(LEGACY_FIELD_MAPPINGS).forEach(([legacyTemplateId, mapping]) => {
    const legacyData = source[legacyTemplateId];
    if (!legacyData || typeof legacyData !== 'object' || Array.isArray(legacyData)) return;

    Object.entries(mapping.fields).forEach(([legacyField, targetField]) => {
      const value = (legacyData as Record<string, unknown>)[legacyField];
      if (typeof value === 'string') {
        appendMigratedValue(normalized[mapping.targetTemplate], targetField, value);
      }
    });
  });

  return normalized;
}

const SAMPLE_DATA: JournalData = {
  'problem-brief': {
    productName: 'Prototype tổng hợp phản hồi cửa hàng',
    problem: 'Quản lý vùng mất nhiều thời gian gom phản hồi từ nhiều nhóm chat nên khó nhận ra vấn đề lặp lại.',
    evidence: 'Ba cuộc trao đổi ẩn danh với quản lý cửa hàng cho thấy việc tổng hợp thủ công mất khoảng hai giờ mỗi tuần.',
    outcome: 'Người dùng xem được các chủ đề phản hồi chính trong một màn hình và truy cập lại nguồn ghi chú.',
    acceptanceCriteria: '1. Nhập được tệp phản hồi mẫu. 2. Nhóm được ít nhất ba chủ đề. 3. Người dùng mở được nguồn của từng kết quả.',
    scope: 'Làm luồng nhập tệp và xem kết quả. Chưa làm tích hợp dữ liệu thật hoặc tự động gửi báo cáo.',
  },
  'weekly-checkin': {
    period: 'Tuần 3, 15/06-19/06',
    commitments: 'Hoàn thiện luồng nhập tệp mẫu, demo với mentor và ghi nhận ít nhất ba phản hồi.',
    progress: 'Luồng nhập tệp đã chạy với hai bộ dữ liệu giả. Link demo: https://example.test/demo',
    blockers: 'Định dạng tệp chưa thống nhất. Đã thử hai parser và cần mentor xác nhận định dạng ưu tiên.',
    aiUsage: 'AI gợi ý parser và test case. Tôi đọc lại code, chạy test với tệp rỗng, sai cột và dữ liệu trùng.',
    nextStep: 'Chốt định dạng vào thứ Ba, sửa parser và demo lại vào thứ Năm.',
  },
  'user-feedback': {
    session: 'Demo 18/06 với một đại diện vận hành, thông tin đã được ẩn danh.',
    context: 'Kiểm tra người dùng có hiểu ba nhóm phản hồi và tìm lại được nguồn hay không.',
    feedback: 'Người dùng hiểu tên nhóm nhưng muốn xem số lượng phản hồi và lọc theo tuần.',
    insight: 'Số lượng và thời gian quan trọng hơn phần mô tả dài của từng nhóm.',
    decision: 'Thêm số lượng, bộ lọc tuần; chưa thêm biểu đồ vì chưa cần cho vòng thử này.',
    evidenceLink: 'https://example.test/feedback-notes',
  },
  'experiment-log': {
    experiment: 'Người dùng có thể tìm chủ đề cần xử lý trong dưới ba phút.',
    method: 'Cho hai người dùng thử với dữ liệu giả; đạt khi cả hai tìm đúng chủ đề và nguồn trong ba phút.',
    result: 'Hai người hoàn thành trong 2 phút 10 giây và 2 phút 45 giây. Một người nhầm bộ lọc tuần.',
    learning: 'Luồng chính đạt nhưng nhãn bộ lọc chưa đủ rõ.',
    decision: 'Đổi nhãn bộ lọc, thêm trạng thái đang áp dụng và thử lại.',
    aiCheck: 'AI đề xuất nội dung nhãn. Tôi kiểm tra bằng demo và giữ phương án người dùng hiểu nhanh hơn.',
  },
  'final-handover': {
    prototypeLink: 'https://example.test/prototype',
    outcomes: 'Ba acceptance criteria đã đạt trong buổi demo ngày 28/08; link kết quả: https://example.test/results',
    feedbackSummary: 'Hai vòng feedback dẫn tới việc thêm số lượng chủ đề, bộ lọc tuần và đổi nhãn bộ lọc.',
    setup: 'Mở link prototype, chọn bộ dữ liệu mẫu và bấm Phân tích. Không cần tài khoản hoặc credential.',
    limitations: 'Chỉ dùng dữ liệu giả; chưa hỗ trợ tệp trên 5 MB; kết quả AI cần người dùng kiểm tra lại.',
    reflection: 'Tôi học được cách thu hẹp phạm vi và dùng phản hồi để ưu tiên thay vì thêm tính năng theo phỏng đoán.',
  },
};

export default function WorkingJournal() {
  const [activeTemplateId, setActiveTemplateId] = useState(JOURNAL_TEMPLATES[0].id);
  const [formData, setFormData] = useState<JournalData>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return normalizeJournalData(raw ? JSON.parse(raw) : undefined);
    } catch {
      return createEmptyJournalData();
    }
  });
  const [aiLoadingField, setAiLoadingField] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const activeTemplate = JOURNAL_TEMPLATES.find((template) => template.id === activeTemplateId) ?? JOURNAL_TEMPLATES[0];
  const competencyNames = new Map(SUCCESS_PROFILE_DATA.map((item) => [item.key, item.dimension]));

  const isTemplateComplete = (template: JournalTemplate) =>
    template.fields
      .filter((field) => field.required !== false)
      .every((field) => Boolean(formData[template.id]?.[field.key]?.trim()));

  const completedCount = JOURNAL_TEMPLATES.filter(isTemplateComplete).length;

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message, type });
    window.setTimeout(() => setNotification(null), 3500);
  };

  const handleFieldChange = (fieldKey: string, value: string) => {
    setFormData((previous) => ({
      ...previous,
      [activeTemplateId]: {
        ...previous[activeTemplateId],
        [fieldKey]: value,
      },
    }));
  };

  const handleLoadSample = () => {
    setFormData((previous) => ({ ...previous, [activeTemplateId]: { ...SAMPLE_DATA[activeTemplateId] } }));
    showNotification('Đã nạp dữ liệu giả để minh họa. Hãy thay bằng bằng chứng thực tế của bạn.');
  };

  const clearForm = () => {
    if (!window.confirm('Xóa toàn bộ nội dung trong biểu mẫu hiện tại?')) return;
    setFormData((previous) => ({
      ...previous,
      [activeTemplateId]: Object.fromEntries(activeTemplate.fields.map((field) => [field.key, ''])),
    }));
    showNotification('Đã xóa nội dung biểu mẫu hiện tại.', 'info');
  };

  const handleAiAssist = async (fieldKey: string, fieldLabel: string) => {
    const roughNotes = formData[activeTemplateId]?.[fieldKey] ?? '';
    if (!roughNotes.trim()) {
      showNotification('Hãy nhập vài ý thô trước khi dùng AI hỗ trợ.', 'error');
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
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.result) throw new Error(data.error || 'Không nhận được nội dung từ AI.');
      handleFieldChange(fieldKey, data.result);
      showNotification('AI đã hỗ trợ cấu trúc lại nội dung. Bạn cần kiểm chứng trước khi dùng làm bằng chứng.');
    } catch (error) {
      showNotification(`Lỗi AI: ${error instanceof Error ? error.message : String(error)}`, 'error');
    } finally {
      setAiLoadingField(null);
    }
  };

  const generateMarkdownString = () => {
    const status = isTemplateComplete(activeTemplate) ? 'Hoàn thành' : 'Đang bổ sung';
    const competencies = activeTemplate.competencyIds.map((id) => competencyNames.get(id)).join(', ');
    const sections = activeTemplate.fields.map((field) => {
      const value = formData[activeTemplateId]?.[field.key]?.trim() || '*(Trống, chưa điền)*';
      return `### ${field.label}\n${value}`;
    });

    return [
      `# ${activeTemplate.title}`,
      `*Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}*`,
      `*Trạng thái: ${status}*`,
      `*Năng lực liên quan: ${competencies}*`,
      '',
      `> Khi dùng: ${activeTemplate.whenToUse}`,
      '',
      '## Bằng chứng tối thiểu',
      ...activeTemplate.minimumEvidence.map((item) => `- ${item}`),
      '',
      ...sections.flatMap((section) => [section, '']),
    ].join('\n');
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateMarkdownString());
      showNotification('Đã sao chép biểu mẫu dưới dạng Markdown.');
    } catch {
      showNotification('Trình duyệt không cho phép sao chép tự động.', 'error');
    }
  };

  const handleDownloadMarkdown = () => {
    const url = URL.createObjectURL(new Blob([generateMarkdownString()], { type: 'text/markdown;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `YODY_Journal_${activeTemplateId}_${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showNotification('Đã tải biểu mẫu Markdown.');
  };

  return (
    <div className="py-6 font-sans text-fg-2 space-y-10" id="working-journal-layout">
      <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="s-eyebrow">
            <FileEdit className="mr-1 h-4 w-4" strokeWidth={1.75} />
            INTERN WORKING JOURNAL
          </div>
          <h2 className="text-fg-1" style={{ font: 'var(--type-h2)', letterSpacing: '-0.018em' }}>Journal bằng chứng</h2>
          <p className="max-w-2xl text-sm leading-relaxed text-fg-2">
            Ghi lại dữ kiện, phản hồi và kết quả thật để mentor coaching và Hội đồng đối chiếu.
            Nội dung AI tạo chỉ hỗ trợ diễn đạt, không thay thế link, kết quả kiểm tra hoặc xác nhận thực tế.
          </p>
          <div className="flex items-center gap-3 text-xs">
            <span className="font-semibold text-fg-1">Hoàn thành {completedCount}/{JOURNAL_TEMPLATES.length} template</span>
            <span className="h-1.5 flex-1 max-w-48 overflow-hidden rounded-full bg-border">
              <span className="block h-full bg-brand transition-all" style={{ width: `${(completedCount / JOURNAL_TEMPLATES.length) * 100}%` }} />
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start">
          <button type="button" onClick={handleLoadSample} className="cta cta-secondary cta-sm">
            <RefreshCw className="h-3.5 w-3.5" /><span>Nạp mẫu</span>
          </button>
          <button type="button" onClick={clearForm} className="flex h-8 items-center gap-1.5 border border-gap/20 bg-gap/10 px-3 text-xs font-medium text-gap hover:bg-gap/20" style={{ borderRadius: 'var(--radius-sm)' }}>
            <Trash2 className="h-3.5 w-3.5" /><span>Xóa</span>
          </button>
          <button type="button" onClick={handleCopyToClipboard} className="cta cta-secondary cta-sm">
            <Copy className="h-3.5 w-3.5" /><span>Sao chép</span>
          </button>
          <button type="button" onClick={handleDownloadMarkdown} className="cta cta-primary cta-sm">
            <Download className="h-3.5 w-3.5" /><span>Tải .MD</span>
          </button>
        </div>
      </header>

      {notification && (
        <div
          role={notification.type === 'error' ? 'alert' : 'status'}
          aria-live={notification.type === 'error' ? 'assertive' : 'polite'}
          className={`fixed bottom-6 right-6 z-50 flex max-w-sm items-center gap-3 border p-4 text-xs animate-slide-in ${
          notification.type === 'success'
            ? 'border-mint/30 bg-bg-warm text-mint-deep'
            : notification.type === 'error'
              ? 'border-gap/30 bg-bg-warm text-gap'
              : 'border-border bg-bg-warm text-fg-1'
          }`}
          style={{ borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-md)' }}
        >
          {notification.type === 'success'
            ? <CheckCircle2 className="h-5 w-5 shrink-0" />
            : <AlertCircle className="h-5 w-5 shrink-0" />}
          <span className="leading-relaxed">{notification.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        <aside className="space-y-4 lg:col-span-4">
          <div className="yds-card-warm p-5 space-y-4">
            <span className="block border-b border-border pb-2 font-mono text-xs font-semibold uppercase tracking-wider text-fg-3">
              Năm biểu mẫu bằng chứng
            </span>
            <div className="space-y-2">
              {JOURNAL_TEMPLATES.map((template) => {
                const selected = template.id === activeTemplateId;
                const complete = isTemplateComplete(template);
                return (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => setActiveTemplateId(template.id)}
                    aria-pressed={selected}
                    className={`flex w-full items-start border p-3 text-left transition-all ${
                      selected ? 'border-brand/30 bg-brand/5' : 'border-transparent hover:bg-bg-muted'
                    }`}
                    style={{ borderRadius: 'var(--radius-sm)' }}
                  >
                    {complete
                      ? <CheckCircle2 className="mr-3 mt-0.5 h-4 w-4 shrink-0 text-mint" />
                      : <FileText className={`mr-3 mt-0.5 h-4 w-4 shrink-0 ${selected ? 'text-brand' : 'text-fg-3'}`} />}
                    <span className="min-w-0">
                      <span className="block text-xs font-bold text-fg-1">{template.title}</span>
                      <span className="mt-1 block text-[10px] leading-snug text-fg-3">{template.whenToUse}</span>
                      <span className="mt-2 flex flex-wrap gap-1">
                        {template.competencyIds.map((id) => (
                          <span key={id} className="border border-border px-1.5 py-0.5 text-[9px] text-fg-3" style={{ borderRadius: 'var(--radius-pill)' }}>
                            {competencyNames.get(id)}
                          </span>
                        ))}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="insight mt-0!">
            <div className="insight-label mb-2! flex items-center gap-2 text-[10px]!">
              <Sparkles className="h-3.5 w-3.5 text-brand" />
              AI hỗ trợ diễn đạt
            </div>
            <p className="insight-body text-xs! leading-relaxed!">
              Chỉ gửi nội dung đã ẩn danh. Không đưa mật khẩu, API key hoặc dữ liệu cá nhân nhạy cảm vào prompt.
              Bạn phải đọc lại, kiểm chứng và chịu trách nhiệm về nội dung cuối cùng.
            </p>
          </div>
        </aside>

        <main className="lg:col-span-8">
          <div className="yds-card-warm p-6 sm:p-8 space-y-6">
            <header className="border-b border-border pb-4 space-y-2">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-fg-1 tracking-tight" style={{ font: 'var(--type-h3)' }}>{activeTemplate.title}</h3>
                <span className={`self-start border px-2.5 py-1 text-[10px] font-bold ${
                  isTemplateComplete(activeTemplate)
                    ? 'border-mint/30 bg-mint/10 text-mint-deep'
                    : 'border-border bg-bg-muted text-fg-3'
                }`} style={{ borderRadius: 'var(--radius-pill)' }}>
                  {isTemplateComplete(activeTemplate) ? 'Đã đủ trường bắt buộc' : 'Đang bổ sung'}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-fg-3">{activeTemplate.description}</p>
            </header>

            <section className="grid gap-4 border border-brand/15 bg-brand/5 p-4 text-xs md:grid-cols-2" style={{ borderRadius: 'var(--radius)' }}>
              <div>
                <p className="mb-1 font-bold text-fg-1">Khi nào dùng</p>
                <p className="leading-relaxed text-fg-2">{activeTemplate.whenToUse}</p>
              </div>
              <div>
                <p className="mb-1 font-bold text-fg-1">Bằng chứng tối thiểu</p>
                <ul className="space-y-1 text-fg-2">
                  {activeTemplate.minimumEvidence.map((item) => <li key={item}>• {item}</li>)}
                </ul>
              </div>
            </section>

            <div className="space-y-6">
              {activeTemplate.fields.map((field) => {
                const currentValue = formData[activeTemplateId]?.[field.key] ?? '';
                const loading = aiLoadingField === field.key;
                return (
                  <div key={field.key} className="space-y-2">
                    <div className="flex items-center justify-between gap-4">
                      <label className="text-xs font-bold text-fg-1" htmlFor={`input-${activeTemplateId}-${field.key}`}>
                        {field.label}{field.required !== false && <span className="ml-1 text-gap">*</span>}
                      </label>
                      {field.type === 'textarea' && (
                        <button
                          type="button"
                          onClick={() => handleAiAssist(field.key, field.label)}
                          disabled={loading || !currentValue.trim()}
                          className={`flex items-center gap-1.5 border px-2.5 py-1 font-mono text-[10px] font-bold ${
                            currentValue.trim()
                              ? 'border-brand/20 bg-brand/10 text-brand hover:bg-brand/20'
                              : 'cursor-not-allowed border-border bg-bg-muted text-fg-3'
                          }`}
                          style={{ borderRadius: 'var(--radius-xs)' }}
                        >
                          {loading ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                          AI hỗ trợ viết
                        </button>
                      )}
                    </div>
                    {field.type === 'textarea' ? (
                      <textarea
                        id={`input-${activeTemplateId}-${field.key}`}
                        value={currentValue}
                        onChange={(event) => handleFieldChange(field.key, event.target.value)}
                        placeholder={field.placeholder}
                        rows={5}
                        className={`yds-textarea ${loading ? 'animate-pulse opacity-70' : ''}`}
                      />
                    ) : (
                      <input
                        id={`input-${activeTemplateId}-${field.key}`}
                        type="text"
                        value={currentValue}
                        onChange={(event) => handleFieldChange(field.key, event.target.value)}
                        placeholder={field.placeholder}
                        className="yds-input"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
