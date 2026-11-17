import React, { useRef, useState } from 'react';
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  Edit3,
  Trash2,
  Upload,
  User,
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';

interface EditFormValues {
  firstName: string;
  firstNameAr: string;
  lastName: string;
  lastNameAr: string;
  gender: 'Male' | 'Female';
  personalEmail: string;
  email: string;
  phoneNumber: string;
  nationality: string;
  profilePhotoUrl: string | null;
  profilePhotoName: string;
}

interface EditFormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  personalEmail?: string;
  phoneNumber?: string;
  nationality?: string;
  profilePhoto?: string;
}

const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

export const ProfileSettingsPage: React.FC = () => {
  const { selectedCompany, userProfile, updateUserProfile, t } = usePortal();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [saveSuccessBanner, setSaveSuccessBanner] = useState<boolean>(false);
  const [isDraggingPhoto, setIsDraggingPhoto] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formValues, setFormValues] = useState<EditFormValues>(() => ({
    firstName: userProfile.firstName,
    firstNameAr: userProfile.firstNameAr,
    lastName: userProfile.lastName,
    lastNameAr: userProfile.lastNameAr,
    gender: userProfile.gender,
    personalEmail: userProfile.personalEmail,
    email: userProfile.email,
    phoneNumber: userProfile.phoneNumber,
    nationality: userProfile.nationality,
    profilePhotoUrl: userProfile.profilePhotoUrl,
    profilePhotoName: userProfile.profilePhotoName || '',
  }));

  const [errors, setErrors] = useState<EditFormErrors>({});

  const handleOpenEdit = () => {
    setFormValues({
      firstName: userProfile.firstName,
      firstNameAr: userProfile.firstNameAr,
      lastName: userProfile.lastName,
      lastNameAr: userProfile.lastNameAr,
      gender: userProfile.gender,
      personalEmail: userProfile.personalEmail,
      email: userProfile.email,
      phoneNumber: userProfile.phoneNumber,
      nationality: userProfile.nationality,
      profilePhotoUrl: userProfile.profilePhotoUrl,
      profilePhotoName: userProfile.profilePhotoName || '',
    });
    setErrors({});
    setSaveSuccessBanner(false);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setErrors({});
    setIsEditing(false);
  };

  const validateAndProcessPhoto = (file: File) => {
    const lowerName = file.name.toLowerCase();
    const hasAllowedExt = ALLOWED_EXTENSIONS.some((ext) =>
      lowerName.endsWith(ext)
    );
    const hasAllowedMime = ALLOWED_MIME_TYPES.includes(file.type.toLowerCase());

    if (!hasAllowedExt && !hasAllowedMime) {
      setErrors((prev) => ({
        ...prev,
        profilePhoto: t(
          'Unsupported file format. Please upload a JPG, JPEG, or PNG image.',
          'صيغة الملف غير مدعومة. يرجى رفع صورة بصيغة JPG أو JPEG أو PNG.'
        ),
      }));
      return;
    }

    if (file.size > MAX_PHOTO_SIZE_BYTES) {
      setErrors((prev) => ({
        ...prev,
        profilePhoto: t(
          'Image exceeds the 5MB maximum file size. Please choose a smaller JPG, JPEG, or PNG file.',
          'يتجاوز حجم الصورة الحد الأقصى المسموح به (5 ميجابايت). يرجى اختيار ملف أصغر.'
        ),
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormValues((prev) => ({
          ...prev,
          profilePhotoUrl: reader.result as string,
          profilePhotoName: file.name,
        }));
        setErrors((prev) => ({ ...prev, profilePhoto: undefined }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndProcessPhoto(file);
    }
    e.target.value = '';
  };

  const handleDropPhoto = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingPhoto(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndProcessPhoto(file);
    }
  };

  const handleRemovePhoto = () => {
    setFormValues((prev) => ({
      ...prev,
      profilePhotoUrl: null,
      profilePhotoName: '',
    }));
    setErrors((prev) => ({ ...prev, profilePhoto: undefined }));
  };

  const validateForm = (): boolean => {
    const nextErrors: EditFormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formValues.firstName.trim()) {
      nextErrors.firstName = t('First Name is required.', 'الاسم الأول مطلوب.');
    }
    if (!formValues.lastName.trim()) {
      nextErrors.lastName = t(
        'Last Name is required.',
        'الاسم الأخير مطلوب.'
      );
    }
    if (!formValues.email.trim()) {
      nextErrors.email = t('Email is required.', 'البريد الإلكتروني مطلوب.');
    } else if (!emailRegex.test(formValues.email.trim())) {
      nextErrors.email = t(
        'Please enter a valid email address.',
        'يرجى إدخال عنوان بريد إلكتروني صحيح.'
      );
    }
    if (
      formValues.personalEmail.trim() &&
      !emailRegex.test(formValues.personalEmail.trim())
    ) {
      nextErrors.personalEmail = t(
        'Please enter a valid personal email address.',
        'يرجى إدخال بريد إلكتروني شخصي صحيح.'
      );
    }
    if (!formValues.phoneNumber.trim()) {
      nextErrors.phoneNumber = t(
        'Phone Number is required.',
        'رقم الهاتف مطلوب.'
      );
    }
    if (!formValues.nationality.trim()) {
      nextErrors.nationality = t(
        'Nationality is required.',
        'الجنسية مطلوبة.'
      );
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const cleanFirstName = formValues.firstName.trim();
    const cleanLastName = formValues.lastName.trim();

    updateUserProfile({
      firstName: cleanFirstName,
      firstNameAr: formValues.firstNameAr.trim(),
      lastName: cleanLastName,
      lastNameAr: formValues.lastNameAr.trim(),
      fullName: `${cleanFirstName} ${cleanLastName}`.trim(),
      gender: formValues.gender,
      personalEmail: formValues.personalEmail.trim(),
      email: formValues.email.trim(),
      phoneNumber: formValues.phoneNumber.trim(),
      nationality: formValues.nationality.trim(),
      profilePhotoUrl: formValues.profilePhotoUrl,
      profilePhotoName: formValues.profilePhotoName || undefined,
    });

    setIsEditing(false);
    setSaveSuccessBanner(true);
  };

  const notProvidedLabel = t('Not provided', 'غير متوفر');

  const readOnlyRows: Array<{
    id: string;
    label: string;
    value: string;
    isMissing?: boolean;
    dir?: 'ltr' | 'auto';
  }> = [
    {
      id: 'full-name',
      label: t('Full Name', 'الاسم الكامل'),
      value: userProfile.fullName,
    },
    {
      id: 'first-name',
      label: t('First Name', 'الاسم الأول'),
      value: userProfile.firstName,
    },
    {
      id: 'first-name-ar',
      label: t('First Name (Arabic)', 'الاسم الأول (بالعربية)'),
      value: userProfile.firstNameAr.trim() || notProvidedLabel,
      isMissing: !userProfile.firstNameAr.trim(),
    },
    {
      id: 'last-name',
      label: t('Last Name', 'الاسم الأخير'),
      value: userProfile.lastName,
    },
    {
      id: 'last-name-ar',
      label: t('Last Name (Arabic)', 'الاسم الأخير (بالعربية)'),
      value: userProfile.lastNameAr.trim() || notProvidedLabel,
      isMissing: !userProfile.lastNameAr.trim(),
    },
    {
      id: 'gender',
      label: t('Gender', 'الجنس'),
      value:
        userProfile.gender === 'Male'
          ? t('Male', 'ذكر')
          : t('Female', 'أنثى'),
    },
    {
      id: 'personal-email',
      label: t('Personal Email', 'البريد الإلكتروني الشخصي'),
      value: userProfile.personalEmail.trim() || notProvidedLabel,
      isMissing: !userProfile.personalEmail.trim(),
      dir: 'ltr',
    },
    {
      id: 'email',
      label: t('Email', 'البريد الإلكتروني'),
      value: userProfile.email,
      dir: 'ltr',
    },
    {
      id: 'phone-number',
      label: t('Phone Number', 'رقم الهاتف'),
      value: userProfile.phoneNumber,
      dir: 'ltr',
    },
    {
      id: 'nationality',
      label: t('Nationality', 'الجنسية'),
      value: userProfile.nationality,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <section
        aria-labelledby="profile-settings-heading"
        className="rounded-lg border border-[#E5E7EB] bg-white px-5 py-5 sm:px-6 shadow-2xs"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-[#64748B]">
              <span className="font-semibold text-[#1A7373]">
                {selectedCompany.name}
              </span>
              <span aria-hidden="true">·</span>
              <span>{t('Account Profile', 'إعدادات الملف الشخصي')}</span>
            </div>

            <h1
              id="profile-settings-heading"
              className="text-xl sm:text-2xl font-bold tracking-tight text-[#1F2937]"
            >
              {t('Profile Information', 'معلومات الملف الشخصي')}
            </h1>

            <p className="text-xs sm:text-sm text-[#64748B] max-w-3xl leading-relaxed">
              {t(
                'View and manage your personal and contact information for your AWN Client Portal profile.',
                'عرض وتحديث بيانات الملف الشخصي ومعلومات التواصل الخاصة بحسابك في بوابة عون.'
              )}
            </p>
          </div>

          {!isEditing && (
            <button
              type="button"
              onClick={handleOpenEdit}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-[#37848C] hover:bg-[#1A7373] text-white text-xs sm:text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C] shrink-0"
            >
              <Edit3 className="w-4 h-4" />
              <span>{t('Edit', 'تعديل')}</span>
            </button>
          )}
        </div>
      </section>

      {/* Local Demo Save Confirmation Banner */}
      {saveSuccessBanner && !isEditing && (
        <div
          role="status"
          className="rounded-lg border border-[#37848C]/40 bg-[#37848C]/10 px-4 py-3 flex items-center justify-between gap-3 text-xs sm:text-sm text-[#1F2937]"
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#1A7373] shrink-0" />
            <span>
              {t(
                'Profile information updated in the current demo session (local frontend state only).',
                'تم تحديث معلومات الملف الشخصي في الجلسة التجريبية الحالية (حالة محلية فقط).'
              )}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSaveSuccessBanner(false)}
            className="text-xs font-semibold text-[#1A7373] hover:underline shrink-0"
          >
            {t('Dismiss', 'إغلاق')}
          </button>
        </div>
      )}

      {/* Main Content: Read-Only Profile Information OR Edit Profile Form */}
      {!isEditing ? (
        <section
          aria-label={t(
            'Profile Information Details',
            'تفاصيل معلومات الملف الشخصي'
          )}
          className="rounded-lg border border-[#E5E7EB] bg-white overflow-hidden shadow-2xs"
        >
          {/* Profile Photo Section */}
          <div className="p-5 sm:p-6 border-b border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {userProfile.profilePhotoUrl ? (
                <img
                  src={userProfile.profilePhotoUrl}
                  alt={userProfile.fullName}
                  className="w-16 h-16 rounded-full object-cover border border-[#E5E7EB] shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-[#37848C]/10 border border-[#37848C]/25 flex items-center justify-center text-[#1A7373] shrink-0">
                  <User className="w-7 h-7" />
                </div>
              )}
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  {t('Profile Photo', 'الصورة الشخصية')}
                </p>
                <p className="text-sm font-medium text-[#1F2937]">
                  {userProfile.profilePhotoUrl
                    ? userProfile.profilePhotoName ||
                      t('Profile photo uploaded', 'تم رفع الصورة الشخصية')
                    : t(
                        'No profile photo uploaded',
                        'لم يتم رفع صورة شخصية'
                      )}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpenEdit}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-md border border-[#E5E7EB] text-xs font-semibold text-[#1F2937] hover:bg-[#F1F5F9] transition-colors self-start sm:self-auto"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#37848C]" />
              <span>{t('Edit', 'تعديل')}</span>
            </button>
          </div>

          {/* Read-Only Profile Fields Table */}
          <div className="divide-y divide-[#E5E7EB]">
            {readOnlyRows.map((row) => (
              <div
                key={row.id}
                className="px-5 py-4 sm:px-6 grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4 items-center"
              >
                <div className="sm:col-span-4 text-xs sm:text-sm font-medium text-[#64748B]">
                  {row.label}
                </div>
                <div
                  dir={row.dir || 'auto'}
                  className={`sm:col-span-8 text-sm font-medium text-start ${
                    row.isMissing ? 'text-[#64748B] italic' : 'text-[#1F2937]'
                  }`}
                >
                  {row.value}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section
          aria-label={t(
            'Edit Profile Information',
            'تعديل معلومات الملف الشخصي'
          )}
          className="rounded-lg border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-2xs"
        >
          <form onSubmit={handleSave} noValidate className="space-y-6">
            <div className="pb-4 border-b border-[#E5E7EB]">
              <h2 className="text-base sm:text-lg font-bold text-[#1F2937]">
                {t('Edit Profile Information', 'تعديل معلومات الملف الشخصي')}
              </h2>
              <p className="text-xs text-[#64748B] mt-1">
                {t(
                  'Update your profile details below. Changes are stored in the current demo session.',
                  'قم بتحديث بيانات ملفك الشخصي أدناه. يتم حفظ التغييرات في الجلسة التجريبية الحالية.'
                )}
              </p>
            </div>

            {/* Profile Photo Upload Area */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#1F2937]">
                {t('Profile Photo', 'الصورة الشخصية')}
              </label>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Current / Preview Thumbnail */}
                <div className="shrink-0">
                  {formValues.profilePhotoUrl ? (
                    <img
                      src={formValues.profilePhotoUrl}
                      alt={t('Selected profile preview', 'معاينة الصورة الشخصية')}
                      className="w-20 h-20 rounded-full object-cover border border-[#37848C]"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-[#F8FAFC] border border-[#E5E7EB] flex flex-col items-center justify-center text-[#64748B]">
                      <Camera className="w-6 h-6" />
                    </div>
                  )}
                </div>

                {/* Drag-and-Drop / Click Upload Box */}
                <div className="flex-1 space-y-2">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        fileInputRef.current?.click();
                      }
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingPhoto(true);
                    }}
                    onDragLeave={() => setIsDraggingPhoto(false)}
                    onDrop={handleDropPhoto}
                    className={`rounded-lg border-2 border-dashed p-4 text-center cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37848C] ${
                      isDraggingPhoto
                        ? 'border-[#37848C] bg-[#37848C]/10'
                        : 'border-[#E5E7EB] hover:border-[#37848C]/60 bg-[#F8FAFC]'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <Upload className="w-5 h-5 text-[#37848C]" />
                      <p className="text-xs sm:text-sm font-semibold text-[#1F2937]">
                        {t(
                          'Click to upload or drag and drop',
                          'انقر للرفع أو اسحب وأفلت الملف هنا'
                        )}
                      </p>
                      <p className="text-xs text-[#64748B]">
                        {t(
                          'JPG, JPEG, PNG up to 5MB',
                          'JPG أو JPEG أو PNG بحد أقصى 5 ميجابايت'
                        )}
                      </p>
                    </div>
                  </div>

                  {formValues.profilePhotoUrl && (
                    <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-md bg-[#F8FAFC] border border-[#E5E7EB]">
                      <span className="text-xs text-[#1F2937] truncate">
                        {formValues.profilePhotoName ||
                          t('Selected photo', 'الصورة المحددة')}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-xs font-semibold text-[#1A7373] hover:underline"
                        >
                          {t('Replace', 'استبدال')}
                        </button>
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#DC2626] hover:underline"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{t('Remove', 'حذف')}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {errors.profilePhoto && (
                    <div
                      role="alert"
                      className="flex items-center gap-1.5 text-xs text-[#DC2626]"
                    >
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.profilePhoto}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {/* First Name */}
              <div className="space-y-1.5">
                <label
                  htmlFor="profile-first-name"
                  className="block text-xs font-semibold text-[#1F2937]"
                >
                  {t('First Name', 'الاسم الأول')}{' '}
                  <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  id="profile-first-name"
                  type="text"
                  value={formValues.firstName}
                  onChange={(e) =>
                    setFormValues((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                  placeholder={t('Enter First Name', 'أدخل الاسم الأول')}
                  className="w-full h-10 px-3 rounded-md border border-[#E5E7EB] bg-white text-sm text-[#1F2937] focus:outline-none focus:border-[#37848C]"
                />
                {errors.firstName && (
                  <p role="alert" className="text-xs text-[#DC2626]">
                    {errors.firstName}
                  </p>
                )}
              </div>

              {/* First Name (Arabic) */}
              <div className="space-y-1.5">
                <label
                  htmlFor="profile-first-name-ar"
                  className="block text-xs font-semibold text-[#1F2937]"
                >
                  {t('First Name (Arabic)', 'الاسم الأول (بالعربية)')}
                </label>
                <input
                  id="profile-first-name-ar"
                  type="text"
                  value={formValues.firstNameAr}
                  onChange={(e) =>
                    setFormValues((prev) => ({
                      ...prev,
                      firstNameAr: e.target.value,
                    }))
                  }
                  placeholder={t(
                    'Enter First Name in Arabic (Not provided)',
                    'أدخل الاسم الأول بالعربية (غير متوفر)'
                  )}
                  className="w-full h-10 px-3 rounded-md border border-[#E5E7EB] bg-white text-sm text-[#1F2937] focus:outline-none focus:border-[#37848C]"
                />
              </div>

              {/* Last Name */}
              <div className="space-y-1.5">
                <label
                  htmlFor="profile-last-name"
                  className="block text-xs font-semibold text-[#1F2937]"
                >
                  {t('Last Name', 'الاسم الأخير')}{' '}
                  <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  id="profile-last-name"
                  type="text"
                  value={formValues.lastName}
                  onChange={(e) =>
                    setFormValues((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                  placeholder={t('Enter Last Name', 'أدخل الاسم الأخير')}
                  className="w-full h-10 px-3 rounded-md border border-[#E5E7EB] bg-white text-sm text-[#1F2937] focus:outline-none focus:border-[#37848C]"
                />
                {errors.lastName && (
                  <p role="alert" className="text-xs text-[#DC2626]">
                    {errors.lastName}
                  </p>
                )}
              </div>

              {/* Last Name (Arabic) */}
              <div className="space-y-1.5">
                <label
                  htmlFor="profile-last-name-ar"
                  className="block text-xs font-semibold text-[#1F2937]"
                >
                  {t('Last Name (Arabic)', 'الاسم الأخير (بالعربية)')}
                </label>
                <input
                  id="profile-last-name-ar"
                  type="text"
                  value={formValues.lastNameAr}
                  onChange={(e) =>
                    setFormValues((prev) => ({
                      ...prev,
                      lastNameAr: e.target.value,
                    }))
                  }
                  placeholder={t(
                    'Enter Last Name in Arabic (Not provided)',
                    'أدخل الاسم الأخير بالعربية (غير متوفر)'
                  )}
                  className="w-full h-10 px-3 rounded-md border border-[#E5E7EB] bg-white text-sm text-[#1F2937] focus:outline-none focus:border-[#37848C]"
                />
              </div>

              {/* Gender */}
              <div className="space-y-1.5">
                <label
                  htmlFor="profile-gender"
                  className="block text-xs font-semibold text-[#1F2937]"
                >
                  {t('Gender', 'الجنس')}
                </label>
                <select
                  id="profile-gender"
                  value={formValues.gender}
                  onChange={(e) =>
                    setFormValues((prev) => ({
                      ...prev,
                      gender: e.target.value as 'Male' | 'Female',
                    }))
                  }
                  className="w-full h-10 px-3 rounded-md border border-[#E5E7EB] bg-white text-sm text-[#1F2937] focus:outline-none focus:border-[#37848C]"
                >
                  <option value="Male">{t('Male', 'ذكر')}</option>
                  <option value="Female">{t('Female', 'أنثى')}</option>
                </select>
              </div>

              {/* Personal Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="profile-personal-email"
                  className="block text-xs font-semibold text-[#1F2937]"
                >
                  {t('Personal Email', 'البريد الإلكتروني الشخصي')}
                </label>
                <input
                  id="profile-personal-email"
                  type="email"
                  dir="ltr"
                  value={formValues.personalEmail}
                  onChange={(e) =>
                    setFormValues((prev) => ({
                      ...prev,
                      personalEmail: e.target.value,
                    }))
                  }
                  placeholder={notProvidedLabel}
                  className="w-full h-10 px-3 rounded-md border border-[#E5E7EB] bg-white text-sm text-[#1F2937] focus:outline-none focus:border-[#37848C]"
                />
                {errors.personalEmail && (
                  <p role="alert" className="text-xs text-[#DC2626]">
                    {errors.personalEmail}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="profile-email"
                  className="block text-xs font-semibold text-[#1F2937]"
                >
                  {t('Email', 'البريد الإلكتروني')}{' '}
                  <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  id="profile-email"
                  type="email"
                  dir="ltr"
                  value={formValues.email}
                  onChange={(e) =>
                    setFormValues((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  placeholder={t('Enter Email', 'أدخل البريد الإلكتروني')}
                  className="w-full h-10 px-3 rounded-md border border-[#E5E7EB] bg-white text-sm text-[#1F2937] focus:outline-none focus:border-[#37848C]"
                />
                {errors.email && (
                  <p role="alert" className="text-xs text-[#DC2626]">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label
                  htmlFor="profile-phone-number"
                  className="block text-xs font-semibold text-[#1F2937]"
                >
                  {t('Phone Number', 'رقم الهاتف')}{' '}
                  <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  id="profile-phone-number"
                  type="tel"
                  dir="ltr"
                  value={formValues.phoneNumber}
                  onChange={(e) =>
                    setFormValues((prev) => ({
                      ...prev,
                      phoneNumber: e.target.value,
                    }))
                  }
                  placeholder={t('Enter Phone Number', 'أدخل رقم الهاتف')}
                  className="w-full h-10 px-3 rounded-md border border-[#E5E7EB] bg-white text-sm text-[#1F2937] focus:outline-none focus:border-[#37848C]"
                />
                {errors.phoneNumber && (
                  <p role="alert" className="text-xs text-[#DC2626]">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

              {/* Nationality */}
              <div className="space-y-1.5 sm:col-span-2">
                <label
                  htmlFor="profile-nationality"
                  className="block text-xs font-semibold text-[#1F2937]"
                >
                  {t('Nationality', 'الجنسية')}{' '}
                  <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  id="profile-nationality"
                  type="text"
                  value={formValues.nationality}
                  onChange={(e) =>
                    setFormValues((prev) => ({
                      ...prev,
                      nationality: e.target.value,
                    }))
                  }
                  placeholder={t('Enter Nationality', 'أدخل الجنسية')}
                  className="w-full h-10 px-3 rounded-md border border-[#E5E7EB] bg-white text-sm text-[#1F2937] focus:outline-none focus:border-[#37848C]"
                />
                {errors.nationality && (
                  <p role="alert" className="text-xs text-[#DC2626]">
                    {errors.nationality}
                  </p>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 rounded-md border border-[#E5E7EB] text-xs sm:text-sm font-semibold text-[#1F2937] hover:bg-[#F1F5F9] transition-colors"
              >
                {t('Cancel', 'إلغاء')}
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-md bg-[#37848C] hover:bg-[#1A7373] text-white text-xs sm:text-sm font-semibold transition-colors"
              >
                {t('Save', 'حفظ')}
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
};
