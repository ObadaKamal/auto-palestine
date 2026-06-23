import 'server-only';

import type {
  Business,
  Category,
  City,
  SearchQuery,
  SearchResult,
} from '@/types';

import { businesses, categories, cities } from './mock/data';

/**
 * Phase 2 mock adapter. Functions are async to mirror the real API
 * contract so call sites do not change when the backend lands.
 */

function publicBusinesses(): Business[] {
  return businesses.filter((b) => b.status === 'active');
}

export async function listCategories(): Promise<Category[]> {
  return categories;
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  return categories.find((c) => c.slug === slug) ?? null;
}

export async function listCities(): Promise<City[]> {
  return cities;
}

export async function getFeaturedBusinesses(limit = 4): Promise<Business[]> {
  return publicBusinesses()
    .filter((b) => b.featured)
    .slice(0, limit);
}

export async function getBusinessBySlug(
  slug: string,
): Promise<Business | null> {
  return publicBusinesses().find((b) => b.slug === slug) ?? null;
}

export async function getBusinessBySlugOrId(
  idOrSlug: string,
): Promise<Business | null> {
  return (
    publicBusinesses().find((b) => b.slug === idOrSlug || b.id === idOrSlug) ??
    null
  );
}

export async function listBusinessSlugs(): Promise<string[]> {
  return publicBusinesses().map((b) => b.slug);
}

export async function searchBusinesses(
  query: SearchQuery,
): Promise<SearchResult> {
  const term = query.q?.trim().toLowerCase();
  let items = publicBusinesses();

  if (term) {
    items = items.filter((b) =>
      [b.name.ar, b.name.en, b.description.ar, b.description.en]
        .join(' ')
        .toLowerCase()
        .includes(term),
    );
  }
  if (query.city) {
    items = items.filter((b) => b.location.cityId === query.city);
  }
  if (query.category) {
    items = items.filter((b) => b.categoryIds.includes(query.category!));
  }
  if (query.verified) {
    items = items.filter((b) => b.verificationStatus === 'verified');
  }
  if (query.rating) {
    items = items.filter((b) => b.rating >= query.rating!);
  }

  switch (query.sort) {
    case 'rating':
      items = [...items].sort((a, b) => b.rating - a.rating);
      break;
    case 'reviews':
      items = [...items].sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    case 'newest':
      items = [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      break;
    default:
      break;
  }

  return { items, total: items.length };
}

// ---------------------------------------------------------------------------
// Owner dashboard & admin (mock)
// ---------------------------------------------------------------------------

import type {
  AdminStats,
  Lead,
  Notification,
  OwnerStats,
  SubscriptionPlan,
  User,
  VerificationRequest,
} from '@/types';
import {
  adminStats,
  leads,
  notifications,
  ownerBusinessId,
  ownerStats,
  plans,
  users,
  verificationRequests,
} from './mock/dashboard';

export async function getOwnerBusiness(): Promise<Business> {
  const business = businesses.find((b) => b.id === ownerBusinessId);
  if (!business) throw new Error('Owner business not found');
  return business;
}

export async function getOwnerStats(): Promise<OwnerStats> {
  return ownerStats;
}

export async function listLeads(): Promise<Lead[]> {
  return leads;
}

export async function listNotifications(): Promise<Notification[]> {
  return notifications;
}

export async function getUnreadNotificationCount(): Promise<number> {
  return notifications.filter((n) => !n.read).length;
}

export async function listPlans(): Promise<SubscriptionPlan[]> {
  return plans;
}

export async function getAdminStats(): Promise<AdminStats> {
  return adminStats;
}

export async function listAllBusinesses(): Promise<Business[]> {
  return businesses;
}

export async function listVerificationRequests(): Promise<
  VerificationRequest[]
> {
  return verificationRequests;
}

export async function listUsers(): Promise<User[]> {
  return users;
}

// ---------------------------------------------------------------------------
// Content (blog, FAQ)
// ---------------------------------------------------------------------------

import type { BlogPost, Faq } from '@/types';
import { blogPosts, faqs } from './mock/content';

export async function listBlogPosts(): Promise<BlogPost[]> {
  return blogPosts;
}

export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogPost | null> {
  return blogPosts.find((post) => post.slug === slug) ?? null;
}

export async function listBlogSlugs(): Promise<string[]> {
  return blogPosts.map((post) => post.slug);
}

export async function listFaqs(): Promise<Faq[]> {
  return faqs;
}
