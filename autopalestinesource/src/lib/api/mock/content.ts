import type { BlogPost, Faq } from '@/types';

export const blogPosts: BlogPost[] = [
  {
    id: 'p1',
    slug: 'winter-car-maintenance',
    title: {
      ar: 'دليلك لصيانة السيارة في الشتاء',
      en: 'Your guide to winter car maintenance',
    },
    excerpt: {
      ar: 'نصائح أساسية لتجهيز سيارتك لموسم الأمطار والبرد.',
      en: 'Essential tips to prepare your car for the rainy, cold season.',
    },
    body: {
      ar: 'افحص الإطارات والفرامل، وتأكد من مساحات الزجاج وسائل التبريد. الصيانة الوقائية توفّر عليك أعطالًا مكلفة في الطريق.',
      en: 'Check tires and brakes, and make sure wipers and coolant are in good shape. Preventive maintenance saves you from costly breakdowns on the road.',
    },
    coverSeed: 14,
    author: 'فريق أوتو فلسطين',
    publishedAt: '2026-05-30',
    tag: { ar: 'نصائح صيانة', en: 'Maintenance tips' },
    readMinutes: 8,
  },
  {
    id: 'p2',
    slug: 'choosing-trusted-workshop',
    title: {
      ar: 'كيف تختار ورشة موثوقة',
      en: 'How to choose a trusted workshop',
    },
    excerpt: {
      ar: 'معايير تساعدك على اختيار أفضل ورشة لسيارتك.',
      en: 'Criteria that help you pick the best workshop for your car.',
    },
    body: {
      ar: 'ابحث عن التقييمات، وتأكد من شفافية الأسعار، وفضّل المحلات الموثّقة على المنصة لضمان جودة الخدمة.',
      en: 'Look for reviews, confirm transparent pricing, and prefer verified shops on the platform to ensure service quality.',
    },
    coverSeed: 28,
    author: 'فريق أوتو فلسطين',
    publishedAt: '2026-05-12',
    tag: { ar: 'أدلة الشراء', en: 'Buying guides' },
    readMinutes: 5,
  },
  {
    id: 'p3',
    slug: 'electric-cars-palestine',
    title: {
      ar: 'السيارات الكهربائية في فلسطين',
      en: 'Electric cars in Palestine',
    },
    excerpt: {
      ar: 'نظرة على واقع الصيانة والبنية التحتية للشحن.',
      en: 'A look at maintenance and charging infrastructure realities.',
    },
    body: {
      ar: 'تزداد السيارات الكهربائية انتشارًا، ومعها الحاجة لمختصين في صيانة البطاريات وأنظمة الشحن.',
      en: 'Electric cars are growing in popularity, and with them the need for specialists in battery and charging-system maintenance.',
    },
    coverSeed: 36,
    author: 'فريق أوتو فلسطين',
    publishedAt: '2026-04-22',
    tag: { ar: 'تكنولوجيا', en: 'Technology' },
    readMinutes: 6,
  },
];

export const faqs: Faq[] = [
  {
    id: 'f1',
    question: {
      ar: 'كيف أضيف محلي إلى المنصة؟',
      en: 'How do I list my shop on the platform?',
    },
    answer: {
      ar: 'أنشئ حسابًا ثم اتبع معالج «أضف محلك» المكوّن من أربع خطوات.',
      en: 'Create an account, then follow the four-step “List your shop” wizard.',
    },
  },
  {
    id: 'f2',
    question: {
      ar: 'هل استخدام المنصة مجاني؟',
      en: 'Is the platform free to use?',
    },
    answer: {
      ar: 'التصفح مجاني للعملاء، وتتوفر باقة مجانية لأصحاب المحلات مع باقات مدفوعة لمزايا إضافية.',
      en: 'Browsing is free for customers, and shop owners get a free plan with paid tiers for extra features.',
    },
  },
  {
    id: 'f3',
    question: {
      ar: 'ماذا تعني شارة التوثيق؟',
      en: 'What does the verified badge mean?',
    },
    answer: {
      ar: 'تعني أن فريقنا راجع وثائق المحل وتحقق من صحتها لزيادة ثقة العملاء.',
      en: 'It means our team reviewed and validated the shop’s documents to boost customer trust.',
    },
  },
  {
    id: 'f4',
    question: { ar: 'كيف أتواصل مع محل؟', en: 'How do I contact a shop?' },
    answer: {
      ar: 'من صفحة المحل يمكنك الاتصال أو المراسلة عبر واتساب أو الحصول على الاتجاهات.',
      en: 'From the shop page you can call, message on WhatsApp, or get directions.',
    },
  },
  {
    id: 'f5',
    question: { ar: 'هل يمكنني كتابة تقييم؟', en: 'Can I leave a review?' },
    answer: {
      ar: 'نعم، يمكن للعملاء تقييم المحلات لمساعدة الآخرين على اتخاذ قرار أفضل.',
      en: 'Yes, customers can rate shops to help others make a better decision.',
    },
  },
];
