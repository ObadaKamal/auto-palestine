# auto-palestine
Auto Palestine is a smart automotive platform connecting car owners with trusted automotive businesses, making it easier to discover, compare, and access car services across Palestine.



نظرة عامة
منصّة/دليل رقمي ثنائي اللغة (عربي أولًا RTL + إنجليزي) يربط أصحاب السيارات بأعمال السيارات الموثوقة في فلسطين (ورش، قطع غيار، كهرباء، سمكرة، إطارات، غسيل). ثلاثة أدوار: زائر/عميل، تاجر (صاحب محل)، مسؤول (Admin). مبني بالكامل وفق تصميم Stitch «Horizon Auto».

التقنيات
المجال	الأداة
الإطار	Next.js 15 (App Router) + React 19 + TypeScript (strict)
التنسيق	Tailwind CSS v4 (نظام توكنات CSS) + shadcn/ui
اللغات/RTL	next-intl (مسارات /ar افتراضي RTL و/en)
المظهر	next-themes (فاتح/داكن) + خط IBM Plex Sans Arabic
النماذج/التحقق	React Hook Form + Zod
المصادقة	جلسة عبر كوكي + حماية أدوار في الـ layouts
البيانات	طبقة API بعقد ثابت + مخزن تجريبي (in-memory) قابل للاستبدال بقاعدة بيانات
الجودة	ESLint 9 · Prettier · Husky · Commitlint · Vitest · GitHub Actions CI
ما الذي أُنجز (٧ مراحل / commits)
الأساس — إعداد المشروع، التوكنات، i18n، الوضع الفاتح/الداكن، أدوات الجودة.
نظام التصميم — ١٨ مكوّن أساسي (Button, Input, Card, Badge, Dialog, Tabs, Accordion, Stepper, StateView…) متكيّفة مع RTL.
الواجهة العامة — الرئيسية، البحث + الفلاتر، التصنيفات، صفحة المحل الكاملة (خدمات/معرض/تقييمات/تواصل/خريطة)، SEO + JSON-LD.
المصادقة والأدوار — دخول/تسجيل (RHF+Zod)، حماية /dashboard و/admin و/onboarding.
لوحات التاجر والمسؤول — كل الصفحات.
المحتوى + التلميع — الأسعار/المدونة/عن المنصة/تواصل/الأسئلة، قائمة موبايل، SEO، اللوغو، تباين الألوان.
التشغيل الفعلي + الاختبارات — Server Actions تعمل فعليًا + Vitest + CI.
الميزات حسب الدور
الزائر: تصفّح وبحث وفلترة، صفحة محل، إضافة تقييم، تواصل (اتصال/واتساب/اتجاهات)، صفحات محتوى.
التاجر: نظرة عامة، العملاء المحتملون (تغيير الحالة)، حفظ الملف، إضافة/حذف خدمات، الرد على التقييمات، طلب التوثيق، الاشتراك، الإشعارات، ومعالج «أضف محلك» (٤ خطوات → ينشئ محلًا قيد الانتظار).
المسؤول: نظرة عامة، إدارة المحلات (إيقاف/تفعيل)، طابور التوثيق (موافقة/رفض)، إدارة التقييمات، المستخدمون، الباقات.
البنية
src/
├─ app/[locale]/  (public)/ · (auth)/ · onboarding/ · dashboard/ · admin/
├─ components/  ui · layout · business · search · dashboard · content · common
├─ lib/  api (+mock) · actions.ts · auth · format · status
├─ schemas/  (Zod) · i18n/ (ar+en) · types/
└─ app/  sitemap.ts · robots.ts · manifest.ts · icon.svg
public/  logo.svg · logo-light.svg   ← استبدلها بلوغوك الأصلي

