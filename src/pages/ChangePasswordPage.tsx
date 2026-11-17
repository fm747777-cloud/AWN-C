import React, { useState } from 'react';
import { CheckCircle2, Eye, EyeOff, KeyRound } from 'lucide-react';
import { usePortal } from '../context/PortalContext';

interface PasswordFormErrors {
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export const ChangePasswordPage: React.FC = () => {
  const { selectedCompany, t } = usePortal();

  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const [errors, setErrors] = useState<PasswordFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [demoOutcomeMessage, setDemoOutcomeMessage] = useState<string | null>(
    null
  );

  const validate = (): boolean => {
    const nextErrors: PasswordFormErrors = {};

    if (!oldPassword.trim()) {
      nextErrors.oldPassword = t(
        'Old password is required',
        'كلمة المرور القديمة مطلوبة'
      );
    }
    if (!newPassword.trim()) {
      nextErrors.newPassword = t(
        'New password is required',
        'كلمة المرور الجديدة مطلوبة'
      );
    }
    if (!confirmPassword.trim()) {
      nextErrors.confirmPassword = t(
        'Confirm password is required',
        'تأكيد كلمة المرور مطلوب'
      );
    } else if (newPassword && confirmPassword !== newPassword) {
      nextErrors.confirmPassword = t(
        'New password and confirm password do not match',
        'كلمة المرور الجديدة وتأكيد كلمة المرور غير متطابقين'
      );
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setDemoOutcomeMessage(null);
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    // Clear sensitive inputs immediately without storing or logging passwords
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrors({});
    setDemoOutcomeMessage(
      t(
        'Demo Mode: Password validation succeeded. Because no live authentication backend is connected in this demo environment, account credentials were not persisted.',
        'الوضع التجريبي: تم التحقق من صحة كلمة المرور بنجاح. نظراً لعدم وجود خادم مصادقة فعلي في هذه البيئة التجريبية، لم يتم حفظ تغييرات بيانات الاعتماد.'
      )
    );
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Page Header */}
      <section
        aria-labelledby="change-password-heading"
        className="rounded-lg border border-[#E5E7EB] bg-white px-5 py-5 sm:px-6 shadow-2xs"
      >
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <span className="font-semibold text-[#1A7373]">
              {selectedCompany.name}
            </span>
            <span aria-hidden="true">·</span>
            <span>{t('Account Security', 'أمان الحساب')}</span>
          </div>

          <h1
            id="change-password-heading"
            className="text-xl sm:text-2xl font-bold tracking-tight text-[#1F2937]"
          >
            {t('Change Password', 'تغيير كلمة المرور')}
          </h1>

          <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
            {t(
              'Update your account password to maintain security. Regular password changes help protect sensitive information and prevent unauthorized access.',
              'قم بتحديث كلمة مرور حسابك للحفاظ على الأمان. يساعد التغيير الدوري لكلمة المرور على حماية المعلومات الحساسة ومنع الوصول غير المصرح به.'
            )}
          </p>
        </div>
      </section>

      {/* Demo-Only Outcome Notice */}
      {demoOutcomeMessage && (
        <div
          role="status"
          className="rounded-lg border border-[#37848C]/40 bg-[#37848C]/10 px-4 py-3 flex items-start gap-2.5 text-xs sm:text-sm text-[#1F2937]"
        >
          <CheckCircle2 className="w-4 h-4 text-[#1A7373] shrink-0 mt-0.5" />
          <span>{demoOutcomeMessage}</span>
        </div>
      )}

      {/* Change Password Form */}
      <section
        aria-label={t('Change Password Form', 'نموذج تغيير كلمة المرور')}
        className="rounded-lg border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-2xs"
      >
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Old Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="change-pwd-old"
              className="block text-xs font-semibold text-[#1F2937]"
            >
              {t('Old Password', 'كلمة المرور القديمة')}{' '}
              <span className="text-[#DC2626]">*</span>
            </label>
            <div className="relative">
              <input
                id="change-pwd-old"
                type={showOldPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={oldPassword}
                onChange={(e) => {
                  setOldPassword(e.target.value);
                  if (errors.oldPassword) {
                    setErrors((prev) => ({ ...prev, oldPassword: undefined }));
                  }
                }}
                placeholder={t(
                  'Enter Old Password',
                  'أدخل كلمة المرور القديمة'
                )}
                className="w-full h-10 ps-3 pe-10 rounded-md border border-[#E5E7EB] bg-white text-sm text-[#1F2937] focus:outline-none focus:border-[#37848C]"
              />
              <button
                type="button"
                onClick={() => setShowOldPassword((prev) => !prev)}
                aria-label={
                  showOldPassword
                    ? t('Hide Old Password', 'إخفاء كلمة المرور القديمة')
                    : t('Show Old Password', 'إظهار كلمة المرور القديمة')
                }
                className="absolute inset-y-0 end-0 px-3 inline-flex items-center justify-center text-[#64748B] hover:text-[#1F2937]"
              >
                {showOldPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.oldPassword && (
              <p role="alert" className="text-xs text-[#DC2626]">
                {errors.oldPassword}
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="change-pwd-new"
              className="block text-xs font-semibold text-[#1F2937]"
            >
              {t('New Password', 'كلمة المرور الجديدة')}{' '}
              <span className="text-[#DC2626]">*</span>
            </label>
            <div className="relative">
              <input
                id="change-pwd-new"
                type={showNewPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (errors.newPassword) {
                    setErrors((prev) => ({ ...prev, newPassword: undefined }));
                  }
                }}
                placeholder={t(
                  'Enter New Password',
                  'أدخل كلمة المرور الجديدة'
                )}
                className="w-full h-10 ps-3 pe-10 rounded-md border border-[#E5E7EB] bg-white text-sm text-[#1F2937] focus:outline-none focus:border-[#37848C]"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                aria-label={
                  showNewPassword
                    ? t('Hide New Password', 'إخفاء كلمة المرور الجديدة')
                    : t('Show New Password', 'إظهار كلمة المرور الجديدة')
                }
                className="absolute inset-y-0 end-0 px-3 inline-flex items-center justify-center text-[#64748B] hover:text-[#1F2937]"
              >
                {showNewPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p role="alert" className="text-xs text-[#DC2626]">
                {errors.newPassword}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="change-pwd-confirm"
              className="block text-xs font-semibold text-[#1F2937]"
            >
              {t('Confirm Password', 'تأكيد كلمة المرور')}{' '}
              <span className="text-[#DC2626]">*</span>
            </label>
            <div className="relative">
              <input
                id="change-pwd-confirm"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) {
                    setErrors((prev) => ({
                      ...prev,
                      confirmPassword: undefined,
                    }));
                  }
                }}
                placeholder={t(
                  'Confirm Your Password',
                  'أكد كلمة المرور الجديدة'
                )}
                className="w-full h-10 ps-3 pe-10 rounded-md border border-[#E5E7EB] bg-white text-sm text-[#1F2937] focus:outline-none focus:border-[#37848C]"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={
                  showConfirmPassword
                    ? t('Hide Confirm Password', 'إخفاء تأكيد كلمة المرور')
                    : t('Show Confirm Password', 'إظهار تأكيد كلمة المرور')
                }
                className="absolute inset-y-0 end-0 px-3 inline-flex items-center justify-center text-[#64748B] hover:text-[#1F2937]"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p role="alert" className="text-xs text-[#DC2626]">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 h-10 rounded-md bg-[#37848C] hover:bg-[#1A7373] disabled:opacity-60 text-white text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C]"
            >
              <KeyRound className="w-4 h-4 shrink-0" />
              <span>{t('Change & Login', 'تغيير وتسجيل الدخول')}</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
