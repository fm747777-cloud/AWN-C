import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  Check,
  ChevronDown,
  FileText,
  Trash2,
  UploadCloud,
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import {
  TicketPriorityOption,
  TicketTypeOption,
} from '../../types/portal';
import { useModalFocusTrap } from '../../hooks/useModalFocusTrap';

export interface CreateTicketFormPayload {
  ticketType: TicketTypeOption;
  priority: TicketPriorityOption;
  subject: string;
  message: string;
  attachmentName?: string;
}

interface CreateTicketModalProps {
  isOpen: boolean;
  ticketTypeOptions: TicketTypeOption[];
  priorityOptions: TicketPriorityOption[];
  onClose: () => void;
  onCreateTicket: (payload: CreateTicketFormPayload) => void;
}

interface ValidationErrors {
  ticketType?: string;
  priority?: string;
  subject?: string;
  message?: string;
}

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

const ALLOWED_EXTENSIONS: readonly string[] = [
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.svg',
  '.bmp',
  '.pdf',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
  '.csv',
  '.txt',
];

const ALLOWED_MIME_PREFIXES: readonly string[] = [
  'image/',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'text/csv',
];

export const CreateTicketModal: React.FC<CreateTicketModalProps> = ({
  isOpen,
  ticketTypeOptions,
  priorityOptions,
  onClose,
  onCreateTicket,
}) => {
  const { t } = usePortal();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const [ticketType, setTicketType] = useState<TicketTypeOption | ''>('');
  const [priority, setPriority] = useState<TicketPriorityOption | ''>('');
  const [subject, setSubject] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const [openDropdown, setOpenDropdown] = useState<
    null | 'ticketType' | 'priority'
  >(null);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const ticketTypeDropdownRef = useRef<HTMLDivElement>(null);
  const priorityDropdownRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const getTicketTypeLabel = (option: TicketTypeOption): string => {
    switch (option) {
      case 'Testing':
        return t('Testing', 'اختبار');
      case 'Technical Support':
        return t('Technical Support', 'دعم فني');
      default:
        return option;
    }
  };

  const getPriorityLabel = (option: TicketPriorityOption): string => {
    switch (option) {
      case 'Low':
        return t('Low', 'منخفضة');
      case 'Medium':
        return t('Medium', 'متوسطة');
      case 'High':
        return t('High', 'عالية');
      default:
        return option;
    }
  };

  // Reset form state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedFile(null);
      setFileError(null);
      setIsDragging(false);
      setTicketType('');
      setPriority('');
      setSubject('');
      setMessage('');
      setOpenDropdown(null);
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const modalContainerRef = useModalFocusTrap<HTMLDivElement>({
    isOpen,
    onClose: () => {
      if (!isSubmitting) {
        onClose();
      }
    },
    initialFocusRef: closeButtonRef,
    onEscapeKeyDown: (event) => {
      if (openDropdown) {
        event.stopPropagation();
        setOpenDropdown(null);
        return true;
      }
      return isSubmitting;
    },
  });

  // Close open dropdown on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideDropdownClick = (event: MouseEvent): void => {
      const target = event.target as Node;
      if (
        openDropdown === 'ticketType' &&
        ticketTypeDropdownRef.current &&
        !ticketTypeDropdownRef.current.contains(target)
      ) {
        setOpenDropdown(null);
      }
      if (
        openDropdown === 'priority' &&
        priorityDropdownRef.current &&
        !priorityDropdownRef.current.contains(target)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleOutsideDropdownClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideDropdownClick);
    };
  }, [isOpen, openDropdown]);

  if (!isOpen) {
    return null;
  }

  const validateAndAcceptFile = (file: File): void => {
    setFileError(null);

    const lowerName = file.name.toLowerCase();
    const hasValidExtension = ALLOWED_EXTENSIONS.some((ext) =>
      lowerName.endsWith(ext)
    );
    const hasValidMime = ALLOWED_MIME_PREFIXES.some((prefix) =>
      file.type.toLowerCase().startsWith(prefix)
    );

    if (!hasValidExtension && !hasValidMime) {
      setSelectedFile(null);
      setFileError(
        t(
          'Unsupported file type. Supported formats: Images, PDFs, Word, Excel, and Text files.',
          'نوع الملف غير مدعوم. الصيغ المدعومة: الصور، PDF، Word، Excel، والملفات النصية.'
        )
      );
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setSelectedFile(null);
      setFileError(
        t(
          'File exceeds the maximum allowed size of 10MB. Please choose a smaller file.',
          'حجم الملف يتجاوز الحد الأقصى المسموح به (10 ميجابايت). يرجى اختيار ملف أصغر.'
        )
      );
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setSelectedFile(file);
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const file = event.target.files?.[0];
    if (file) {
      validateAndAcceptFile(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (file) {
      validateAndAcceptFile(file);
    }
  };

  const handleRemoveFile = (): void => {
    setSelectedFile(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (isSubmitting) return;

    const nextErrors: ValidationErrors = {};

    if (!ticketType) {
      nextErrors.ticketType = t(
        'Please select a Ticket Type.',
        'يرجى اختيار نوع التذكرة.'
      );
    }
    if (!priority) {
      nextErrors.priority = t(
        'Please select a Priority.',
        'يرجى اختيار الأولوية.'
      );
    }
    if (!subject.trim()) {
      nextErrors.subject = t('Please enter a Subject.', 'يرجى إدخال الموضوع.');
    }
    if (!message.trim()) {
      nextErrors.message = t('Please enter a Message.', 'يرجى إدخال الرسالة.');
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0 || !ticketType || !priority) {
      return;
    }

    setIsSubmitting(true);

    onCreateTicket({
      ticketType,
      priority,
      subject: subject.trim(),
      message: message.trim(),
      attachmentName: selectedFile?.name,
    });

    setIsSubmitting(false);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-new-ticket-modal-title"
      onClick={() => {
        if (!isSubmitting) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 overflow-y-auto"
    >
      <div
        ref={modalContainerRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl max-h-[90vh] rounded-lg border border-[#E5E7EB] bg-white shadow-2xl flex flex-col overflow-hidden my-auto"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6 border-b border-[#E5E7EB] bg-[#F8FAFC] shrink-0">
          <h2
            id="create-new-ticket-modal-title"
            className="text-base sm:text-lg font-bold tracking-tight text-[#1F2937]"
          >
            {t('Create New Ticket', 'إنشاء تذكرة جديدة')}
          </h2>

          <button
            ref={closeButtonRef}
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            aria-label={t('Close Create New Ticket', 'إغلاق نموذج التذكرة')}
            className="w-8 h-8 inline-flex items-center justify-center rounded-md text-lg font-semibold leading-none text-[#64748B] hover:text-[#1F2937] hover:bg-[#F1F5F9] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C]"
          >
            ×
          </button>
        </div>

        {/* Scrollable Form Body + Sticky Footer */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col flex-1 min-h-0"
        >
          <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
            {/* A. File Upload */}
            <div className="space-y-2">
              <input
                ref={fileInputRef}
                id="ticket-file-upload-input"
                type="file"
                accept=".png,.jpg,.jpeg,.gif,.webp,.svg,.bmp,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain,text/csv"
                onChange={handleFileInputChange}
                className="sr-only"
              />

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDragging(false);
                }}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                aria-label={t(
                  'Drag and drop or Choose File to Upload',
                  'اسحب وأفلت أو اختر ملفاً للرفع'
                )}
                className={`rounded-lg border-2 border-dashed p-5 text-center transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C] ${
                  isDragging
                    ? 'border-[#37848C] bg-[#37848C]/10'
                    : fileError
                    ? 'border-[#DC2626] bg-[#DC2626]/5'
                    : 'border-[#E5E7EB] bg-[#F8FAFC] hover:border-[#37848C]'
                }`}
              >
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-[#37848C]/10 text-[#1A7373] flex items-center justify-center">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-[#1F2937]">
                    {t('Drag and drop or ', 'اسحب وأفلت أو ')}
                    <span className="text-[#1A7373] underline">
                      {t('Choose File to Upload', 'اختر ملفاً للرفع')}
                    </span>
                  </p>
                  <p className="text-[11px] sm:text-xs text-[#64748B]">
                    {t(
                      'Max size: 10MB. Supported: Images, PDFs, Word, Excel, Text files',
                      'الحد الأقصى: 10 ميجابايت. الصيغ المدعومة: الصور، PDF، Word، Excel، الملفات النصية'
                    )}
                  </p>
                </div>
              </div>

              {/* Selected File Pill */}
              {selectedFile && (
                <div className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-md border border-[#E5E7EB] bg-[#F8FAFC]">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="w-4 h-4 text-[#37848C] shrink-0" />
                    <div className="min-w-0">
                      <p
                        dir="auto"
                        className="text-xs font-semibold text-[#1F2937] truncate"
                      >
                        {selectedFile.name}
                      </p>
                      <p
                        dir="ltr"
                        className="text-[11px] font-mono text-[#64748B] tabular-nums"
                      >
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    aria-label={`${t('Remove', 'إزالة')} ${selectedFile.name}`}
                    className="p-1.5 rounded-md text-[#64748B] hover:text-[#DC2626] hover:bg-[#F1F5F9] transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* File Validation Error */}
              {fileError && (
                <div
                  role="alert"
                  className="flex items-start gap-2 text-xs text-[#DC2626]"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{fileError}</span>
                </div>
              )}
            </div>

            {/* B. Ticket Type (Accessible Custom Select Dropdown) */}
            <div className="space-y-1.5" ref={ticketTypeDropdownRef}>
              <label
                id="ticket-type-label"
                className="block text-xs sm:text-sm font-semibold text-[#1F2937]"
              >
                {t('Ticket Type', 'نوع التذكرة')}{' '}
                <span className="text-[#DC2626]">*</span>
              </label>

              <div className="relative">
                <button
                  type="button"
                  aria-haspopup="listbox"
                  aria-expanded={openDropdown === 'ticketType'}
                  aria-labelledby="ticket-type-label"
                  onClick={() =>
                    setOpenDropdown((prev) =>
                      prev === 'ticketType' ? null : 'ticketType'
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                      e.preventDefault();
                      setOpenDropdown('ticketType');
                    }
                  }}
                  className={`w-full h-10 px-3.5 rounded-md border text-xs sm:text-sm flex items-center justify-between gap-2 bg-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C] ${
                    errors.ticketType
                      ? 'border-[#DC2626]'
                      : openDropdown === 'ticketType'
                      ? 'border-[#37848C]'
                      : 'border-[#E5E7EB] hover:border-gray-300'
                  }`}
                >
                  <span
                    className={
                      ticketType
                        ? 'text-[#1F2937] font-medium'
                        : 'text-[#64748B]/75'
                    }
                  >
                    {ticketType
                      ? getTicketTypeLabel(ticketType)
                      : t('Select Ticket Type', 'اختر نوع التذكرة')}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#64748B] shrink-0 transition-transform duration-150 ${
                      openDropdown === 'ticketType' ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {openDropdown === 'ticketType' && (
                  <ul
                    role="listbox"
                    aria-labelledby="ticket-type-label"
                    className="absolute start-0 end-0 mt-1 rounded-md border border-[#E5E7EB] bg-white shadow-xl py-1 z-50"
                  >
                    {ticketTypeOptions.map((option) => {
                      const isSelected = ticketType === option;
                      return (
                        <li
                          key={option}
                          role="option"
                          aria-selected={isSelected}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setTicketType(option);
                              setErrors((prev) => ({
                                ...prev,
                                ticketType: undefined,
                              }));
                              setOpenDropdown(null);
                            }}
                            className={`w-full px-3.5 py-2 text-xs sm:text-sm flex items-center justify-between gap-2 text-start transition-colors ${
                              isSelected
                                ? 'bg-[#37848C]/10 text-[#1A7373] font-semibold'
                                : 'text-[#1F2937] hover:bg-[#F1F5F9]'
                            }`}
                          >
                            <span>{getTicketTypeLabel(option)}</span>
                            {isSelected && (
                              <Check className="w-4 h-4 text-[#37848C] shrink-0" />
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {errors.ticketType && (
                <p role="alert" className="text-xs text-[#DC2626]">
                  {errors.ticketType}
                </p>
              )}
            </div>

            {/* C. Priority * (Accessible Custom Select Dropdown) */}
            <div className="space-y-1.5" ref={priorityDropdownRef}>
              <label
                id="ticket-priority-label"
                className="block text-xs sm:text-sm font-semibold text-[#1F2937]"
              >
                {t('Priority *', 'الأولوية *')}
              </label>

              <div className="relative">
                <button
                  type="button"
                  aria-haspopup="listbox"
                  aria-expanded={openDropdown === 'priority'}
                  aria-labelledby="ticket-priority-label"
                  onClick={() =>
                    setOpenDropdown((prev) =>
                      prev === 'priority' ? null : 'priority'
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                      e.preventDefault();
                      setOpenDropdown('priority');
                    }
                  }}
                  className={`w-full h-10 px-3.5 rounded-md border text-xs sm:text-sm flex items-center justify-between gap-2 bg-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C] ${
                    errors.priority
                      ? 'border-[#DC2626]'
                      : openDropdown === 'priority'
                      ? 'border-[#37848C]'
                      : 'border-[#E5E7EB] hover:border-gray-300'
                  }`}
                >
                  <span
                    className={
                      priority
                        ? 'text-[#1F2937] font-medium'
                        : 'text-[#64748B]/75'
                    }
                  >
                    {priority
                      ? getPriorityLabel(priority)
                      : t('Select Priority', 'اختر الأولوية')}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#64748B] shrink-0 transition-transform duration-150 ${
                      openDropdown === 'priority' ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {openDropdown === 'priority' && (
                  <ul
                    role="listbox"
                    aria-labelledby="ticket-priority-label"
                    className="absolute start-0 end-0 mt-1 rounded-md border border-[#E5E7EB] bg-white shadow-xl py-1 z-50"
                  >
                    {priorityOptions.map((option) => {
                      const isSelected = priority === option;
                      return (
                        <li
                          key={option}
                          role="option"
                          aria-selected={isSelected}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setPriority(option);
                              setErrors((prev) => ({
                                ...prev,
                                priority: undefined,
                              }));
                              setOpenDropdown(null);
                            }}
                            className={`w-full px-3.5 py-2 text-xs sm:text-sm flex items-center justify-between gap-2 text-start transition-colors ${
                              isSelected
                                ? 'bg-[#37848C]/10 text-[#1A7373] font-semibold'
                                : 'text-[#1F2937] hover:bg-[#F1F5F9]'
                            }`}
                          >
                            <span>{getPriorityLabel(option)}</span>
                            {isSelected && (
                              <Check className="w-4 h-4 text-[#37848C] shrink-0" />
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {errors.priority && (
                <p role="alert" className="text-xs text-[#DC2626]">
                  {errors.priority}
                </p>
              )}
            </div>

            {/* D. Subject * */}
            <div className="space-y-1.5">
              <label
                htmlFor="ticket-subject-input"
                className="block text-xs sm:text-sm font-semibold text-[#1F2937]"
              >
                {t('Subject *', 'الموضوع *')}
              </label>
              <input
                id="ticket-subject-input"
                type="text"
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value);
                  if (e.target.value.trim()) {
                    setErrors((prev) => ({ ...prev, subject: undefined }));
                  }
                }}
                placeholder={t('Enter Subject', 'أدخل الموضوع')}
                aria-invalid={Boolean(errors.subject)}
                className={`w-full h-10 px-3.5 rounded-md border bg-white text-xs sm:text-sm text-[#1F2937] placeholder:text-[#64748B]/75 focus:outline-none transition-colors ${
                  errors.subject
                    ? 'border-[#DC2626]'
                    : 'border-[#E5E7EB] focus:border-[#37848C]'
                }`}
              />
              {errors.subject && (
                <p role="alert" className="text-xs text-[#DC2626]">
                  {errors.subject}
                </p>
              )}
            </div>

            {/* E. Message * */}
            <div className="space-y-1.5">
              <label
                htmlFor="ticket-message-textarea"
                className="block text-xs sm:text-sm font-semibold text-[#1F2937]"
              >
                {t('Message *', 'الرسالة *')}
              </label>
              <textarea
                id="ticket-message-textarea"
                rows={4}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (e.target.value.trim()) {
                    setErrors((prev) => ({ ...prev, message: undefined }));
                  }
                }}
                placeholder={t('Type Here ...', 'اكتب رسالتك هنا ...')}
                aria-invalid={Boolean(errors.message)}
                className={`w-full p-3.5 rounded-md border bg-white text-xs sm:text-sm text-[#1F2937] placeholder:text-[#64748B]/75 focus:outline-none transition-colors resize-y ${
                  errors.message
                    ? 'border-[#DC2626]'
                    : 'border-[#E5E7EB] focus:border-[#37848C]'
                }`}
              />
              {errors.message && (
                <p role="alert" className="text-xs text-[#DC2626]">
                  {errors.message}
                </p>
              )}
            </div>
          </div>

          {/* F. Form Actions Footer */}
          <div className="px-5 py-3.5 sm:px-6 sm:py-4 border-t border-[#E5E7EB] bg-[#F8FAFC] flex items-center justify-end gap-2.5 shrink-0">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="h-9 px-4 rounded-md border border-[#E5E7EB] bg-white hover:bg-[#F1F5F9] text-xs sm:text-sm font-semibold text-[#1F2937] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C]"
            >
              {t('Cancel', 'إلغاء')}
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-9 px-5 rounded-md bg-[#37848C] hover:bg-[#1A7373] disabled:opacity-50 text-white text-xs sm:text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C]"
            >
              {t('Submit', 'إرسال')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
