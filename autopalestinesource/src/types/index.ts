export type LocalizedText = { ar: string; en: string };

export type BusinessStatus = 'draft' | 'pending' | 'active' | 'suspended';
export type VerificationStatus =
  | 'unverified'
  | 'pending'
  | 'verified'
  | 'rejected';
export type PriceType = 'fixed' | 'from' | 'quote';
export type ReviewStatus = 'pending' | 'published' | 'hidden';
export type LeadSource = 'call' | 'whatsapp' | 'form' | 'directions';
export type LeadStatus = 'new' | 'contacted' | 'won' | 'lost';

export type SortOption = 'relevance' | 'rating' | 'reviews' | 'newest';

export type City = {
  id: string;
  name: LocalizedText;
  businessCount: number;
};

export type Category = {
  id: string;
  slug: string;
  name: LocalizedText;
  /** lucide icon name */
  icon: string;
  businessCount: number;
};

export type WorkingHours = {
  /** 0 = Sunday ... 6 = Saturday */
  day: number;
  open: string;
  close: string;
  closed?: boolean;
};

export type BusinessContact = {
  phones: string[];
  whatsapp?: string;
  email?: string;
  website?: string;
};

export type BusinessLocation = {
  cityId: string;
  city: LocalizedText;
  area?: LocalizedText;
  addressText: LocalizedText;
  lat: number;
  lng: number;
};

export type Service = {
  id: string;
  name: LocalizedText;
  description?: LocalizedText;
  price?: number;
  priceType: PriceType;
  durationMins?: number;
};

export type Review = {
  id: string;
  authorName: string;
  rating: number;
  comment: LocalizedText;
  status: ReviewStatus;
  ownerReply?: LocalizedText;
  createdAt: string;
};

export type Business = {
  id: string;
  slug: string;
  name: LocalizedText;
  tagline?: LocalizedText;
  description: LocalizedText;
  categoryIds: string[];
  status: BusinessStatus;
  verificationStatus: VerificationStatus;
  /** Decorative seed used to render a deterministic placeholder cover. */
  coverSeed: number;
  galleryCount: number;
  rating: number;
  reviewCount: number;
  location: BusinessLocation;
  contact: BusinessContact;
  services: Service[];
  reviews: Review[];
  workingHours: WorkingHours[];
  featured?: boolean;
  createdAt: string;
};

export type SearchQuery = {
  q?: string;
  city?: string;
  category?: string;
  verified?: boolean;
  rating?: number;
  sort?: SortOption;
};

export type SearchResult = {
  items: Business[];
  total: number;
};

// ---------------------------------------------------------------------------
// Accounts, dashboard & admin domain (Phases 3–5)
// ---------------------------------------------------------------------------

export type UserRole = 'visitor' | 'owner' | 'admin';

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
};

export type Lead = {
  id: string;
  businessId: string;
  customerName: string;
  phone: string;
  source: LeadSource;
  serviceInterest?: LocalizedText;
  message?: string;
  status: LeadStatus;
  createdAt: string;
};

export type NotificationType = 'lead' | 'review' | 'verification' | 'system';

export type Notification = {
  id: string;
  type: NotificationType;
  title: LocalizedText;
  body: LocalizedText;
  read: boolean;
  createdAt: string;
};

export type VerificationRequest = {
  id: string;
  businessId: string;
  businessName: LocalizedText;
  documentsCount: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
};

export type SubscriptionPlan = {
  id: string;
  name: LocalizedText;
  priceMonthly: number;
  priceYearly: number;
  features: LocalizedText[];
  isPopular?: boolean;
};

export type OwnerStats = {
  profileViews: number;
  leads: number;
  rating: number;
  reviewCount: number;
  phoneClicks: number;
  whatsappClicks: number;
  directionsClicks: number;
};

export type AdminStats = {
  totalBusinesses: number;
  totalUsers: number;
  monthlyRevenue: number;
  pendingApprovals: number;
  pendingVerifications: number;
  flaggedReviews: number;
};

// ---------------------------------------------------------------------------
// Content (blog, FAQ)
// ---------------------------------------------------------------------------

export type BlogPost = {
  id: string;
  slug: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  body: LocalizedText;
  coverSeed: number;
  author: string;
  publishedAt: string;
  tag: LocalizedText;
  readMinutes: number;
};

export type Faq = {
  id: string;
  question: LocalizedText;
  answer: LocalizedText;
};
