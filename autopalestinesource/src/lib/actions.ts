'use server';

import { revalidatePath } from 'next/cache';

import type { Locale } from '@/i18n/routing';
import type { BusinessStatus, LeadStatus, PriceType } from '@/types';

import { businesses } from './api/mock/data';
import {
  leads,
  notifications,
  ownerBusinessId,
  verificationRequests,
} from './api/mock/dashboard';

function refresh() {
  revalidatePath('/', 'layout');
}

function ownerBusiness() {
  return businesses.find((b) => b.id === ownerBusinessId);
}

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^\w؀-ۿ]+/g, '-')
      .replace(/^-+|-+$/g, '') || `shop-${Date.now()}`
  );
}

// ---------------------------------------------------------------------------
// Owner
// ---------------------------------------------------------------------------

export async function updateOwnerProfile(formData: FormData) {
  const business = ownerBusiness();
  if (!business) return;
  const locale = (String(formData.get('locale')) as Locale) || 'ar';
  const name = String(formData.get('name') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const address = String(formData.get('address') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();
  const whatsapp = String(formData.get('whatsapp') ?? '').trim();
  const cityId = String(formData.get('city') ?? '').trim();

  if (name) business.name[locale] = name;
  if (description) business.description[locale] = description;
  if (address) business.location.addressText[locale] = address;
  if (phone) business.contact.phones[0] = phone;
  if (whatsapp) business.contact.whatsapp = whatsapp;
  if (cityId) business.location.cityId = cityId;
  refresh();
}

export async function addOwnerService(formData: FormData) {
  const business = ownerBusiness();
  if (!business) return;
  const name = String(formData.get('serviceName') ?? '').trim();
  if (!name) return;
  const priceRaw = String(formData.get('price') ?? '').trim();
  const price = priceRaw ? Number(priceRaw) : undefined;
  const priceType: PriceType = price ? 'fixed' : 'quote';
  business.services.push({
    id: `s-${Date.now()}`,
    name: { ar: name, en: name },
    priceType,
    ...(price ? { price } : {}),
  });
  refresh();
}

export async function deleteOwnerService(serviceId: string) {
  const business = ownerBusiness();
  if (!business) return;
  const index = business.services.findIndex((s) => s.id === serviceId);
  if (index >= 0) business.services.splice(index, 1);
  refresh();
}

export async function replyToReview(reviewId: string, formData: FormData) {
  const business = ownerBusiness();
  if (!business) return;
  const reply = String(formData.get('reply') ?? '').trim();
  const review = business.reviews.find((r) => r.id === reviewId);
  if (review && reply) review.ownerReply = { ar: reply, en: reply };
  refresh();
}

export async function requestVerification() {
  const business = ownerBusiness();
  if (!business) return;
  business.verificationStatus = 'pending';
  if (!verificationRequests.some((v) => v.businessId === business.id)) {
    verificationRequests.push({
      id: `vr-${Date.now()}`,
      businessId: business.id,
      businessName: business.name,
      documentsCount: 2,
      status: 'pending',
      submittedAt: new Date().toISOString().slice(0, 10),
    });
  }
  refresh();
}

export async function markNotificationsRead() {
  notifications.forEach((n) => {
    n.read = true;
  });
  refresh();
}

export async function setLeadStatus(leadId: string, status: LeadStatus) {
  const lead = leads.find((l) => l.id === leadId);
  if (lead) lead.status = status;
  refresh();
}

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------

export async function decideVerification(
  requestId: string,
  decision: 'approve' | 'reject',
) {
  const request = verificationRequests.find((v) => v.id === requestId);
  if (!request) return;
  request.status = decision === 'approve' ? 'approved' : 'rejected';
  const business = businesses.find((b) => b.id === request.businessId);
  if (business) {
    business.verificationStatus =
      decision === 'approve' ? 'verified' : 'rejected';
  }
  const index = verificationRequests.findIndex((v) => v.id === requestId);
  if (index >= 0) verificationRequests.splice(index, 1);
  refresh();
}

export async function setBusinessStatus(
  businessId: string,
  status: BusinessStatus,
) {
  const business = businesses.find((b) => b.id === businessId);
  if (business) business.status = status;
  refresh();
}

// ---------------------------------------------------------------------------
// Public + onboarding
// ---------------------------------------------------------------------------

export async function submitReview(businessSlug: string, formData: FormData) {
  const business = businesses.find((b) => b.slug === businessSlug);
  if (!business) return;
  const author = String(formData.get('author') ?? '').trim();
  const comment = String(formData.get('comment') ?? '').trim();
  const rating = Math.min(5, Math.max(1, Number(formData.get('rating') ?? 5)));
  if (!author || !comment) return;
  business.reviews.unshift({
    id: `r-${Date.now()}`,
    authorName: author,
    rating,
    comment: { ar: comment, en: comment },
    status: 'published',
    createdAt: new Date().toISOString().slice(0, 10),
  });
  business.reviewCount += 1;
  refresh();
}

export async function publishBusiness(input: {
  name: string;
  categoryId: string;
  description: string;
  cityId: string;
  address: string;
  phone: string;
}) {
  const id = `b-${Date.now()}`;
  businesses.push({
    id,
    slug: slugify(input.name),
    name: { ar: input.name, en: input.name },
    description: { ar: input.description, en: input.description },
    categoryIds: [input.categoryId],
    status: 'pending',
    verificationStatus: 'unverified',
    coverSeed: Math.floor(Math.random() * 60),
    galleryCount: 0,
    rating: 0,
    reviewCount: 0,
    location: {
      cityId: input.cityId,
      city: { ar: '', en: '' },
      addressText: { ar: input.address, en: input.address },
      lat: 31.9,
      lng: 35.2,
    },
    contact: { phones: [input.phone] },
    services: [],
    reviews: [],
    workingHours: [],
    createdAt: new Date().toISOString().slice(0, 10),
  });
  refresh();
}
