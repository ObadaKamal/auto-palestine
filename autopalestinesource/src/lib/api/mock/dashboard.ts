import type {
  AdminStats,
  Lead,
  Notification,
  OwnerStats,
  SubscriptionPlan,
  User,
  VerificationRequest,
} from '@/types';

/** The business currently managed by the signed-in owner (mock session). */
export const ownerBusinessId = 'b1';

export const ownerStats: OwnerStats = {
  profileViews: 1840,
  leads: 23,
  rating: 4.8,
  reviewCount: 124,
  phoneClicks: 342,
  whatsappClicks: 128,
  directionsClicks: 89,
};

export const leads: Lead[] = [
  {
    id: 'l1',
    businessId: 'b1',
    customerName: 'سامر خليل',
    phone: '+970 59 100 2030',
    source: 'whatsapp',
    serviceInterest: { ar: 'تغيير زيت وفلتر', en: 'Oil & filter change' },
    message: 'متى أقرب موعد متاح؟',
    status: 'new',
    createdAt: '2026-06-20',
  },
  {
    id: 'l2',
    businessId: 'b1',
    customerName: 'Lara N.',
    phone: '+970 56 222 9090',
    source: 'call',
    serviceInterest: { ar: 'فحص شامل', en: 'Full inspection' },
    status: 'contacted',
    createdAt: '2026-06-18',
  },
  {
    id: 'l3',
    businessId: 'b1',
    customerName: 'محمود عيسى',
    phone: '+970 59 444 1212',
    source: 'form',
    message: 'صوت غريب من الفرامل',
    status: 'won',
    createdAt: '2026-06-12',
  },
  {
    id: 'l4',
    businessId: 'b1',
    customerName: 'Tariq M.',
    phone: '+970 59 777 8080',
    source: 'directions',
    status: 'lost',
    createdAt: '2026-06-05',
  },
];

export const notifications: Notification[] = [
  {
    id: 'n1',
    type: 'lead',
    title: { ar: 'عميل محتمل جديد', en: 'New lead' },
    body: {
      ar: 'سامر خليل مهتم بخدمة تغيير الزيت.',
      en: 'Samer Khalil is interested in an oil change.',
    },
    read: false,
    createdAt: '2026-06-20',
  },
  {
    id: 'n2',
    type: 'review',
    title: { ar: 'تقييم جديد', en: 'New review' },
    body: { ar: 'حصلت على تقييم 5 نجوم.', en: 'You received a 5-star review.' },
    read: false,
    createdAt: '2026-06-19',
  },
  {
    id: 'n3',
    type: 'verification',
    title: { ar: 'تم توثيق محلك', en: 'Your shop is verified' },
    body: {
      ar: 'تهانينا! أصبح محلك موثقًا.',
      en: 'Congratulations! Your shop is now verified.',
    },
    read: true,
    createdAt: '2026-06-10',
  },
];

export const plans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: { ar: 'مجاني', en: 'Free' },
    priceMonthly: 0,
    priceYearly: 0,
    features: [
      { ar: 'ملف تجاري أساسي', en: 'Basic business profile' },
      { ar: 'حتى 3 صور', en: 'Up to 3 photos' },
      { ar: 'استقبال التقييمات', en: 'Receive reviews' },
    ],
  },
  {
    id: 'pro',
    name: { ar: 'احترافي', en: 'Pro' },
    priceMonthly: 49,
    priceYearly: 490,
    isPopular: true,
    features: [
      { ar: 'ظهور مميز في النتائج', en: 'Featured placement' },
      { ar: 'صور غير محدودة', en: 'Unlimited photos' },
      { ar: 'إدارة العملاء المحتملين', en: 'Leads management' },
      { ar: 'شارة التوثيق', en: 'Verified badge' },
    ],
  },
  {
    id: 'business',
    name: { ar: 'أعمال', en: 'Business' },
    priceMonthly: 99,
    priceYearly: 990,
    features: [
      { ar: 'كل مزايا الاحترافي', en: 'Everything in Pro' },
      { ar: 'عدة فروع', en: 'Multiple branches' },
      { ar: 'تقارير وتحليلات', en: 'Reports & analytics' },
      { ar: 'دعم ذو أولوية', en: 'Priority support' },
    ],
  },
];

// ---- Admin ----

export const adminStats: AdminStats = {
  totalBusinesses: 1248,
  totalUsers: 45912,
  monthlyRevenue: 128000,
  pendingApprovals: 34,
  pendingVerifications: 12,
  flaggedReviews: 5,
};

export const verificationRequests: VerificationRequest[] = [
  {
    id: 'vr1',
    businessId: 'b5',
    businessName: {
      ar: 'شاين لغسيل وتلميع السيارات',
      en: 'Shine Car Wash & Detailing',
    },
    documentsCount: 3,
    status: 'pending',
    submittedAt: '2026-06-17',
  },
];

export const users: User[] = [
  {
    id: 'u1',
    name: 'Owner — Al-Quds Auto',
    email: 'owner@alquds-auto.ps',
    phone: '+970 59 123 4567',
    role: 'owner',
    createdAt: '2025-11-01',
  },
  {
    id: 'u2',
    name: 'Admin',
    email: 'admin@autopalestine.ps',
    role: 'admin',
    createdAt: '2025-10-01',
  },
  {
    id: 'u3',
    name: 'سارة م.',
    email: 'sara@example.com',
    role: 'visitor',
    createdAt: '2026-05-20',
  },
];
