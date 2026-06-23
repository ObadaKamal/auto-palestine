import { CalendarDays, Clock, Mail, Search } from 'lucide-react';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { BlogCard } from '@/components/content/blog-card';
import { CoverPlaceholder } from '@/components/common/cover-placeholder';
import { PageContainer } from '@/components/layout/page-container';
import { StateView } from '@/components/ui/state-view';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { listBlogPosts, listCategories } from '@/lib/api';
import { formatCount, getLocalized } from '@/lib/format';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  return { title: t('title') };
}

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale } = await params;
  const { q } = await searchParams;
  setRequestLocale(locale);
  const activeLocale = locale as Locale;
  const t = await getTranslations('blog');

  const [allPosts, categories] = await Promise.all([
    listBlogPosts(),
    listCategories(),
  ]);

  const term = q?.trim().toLowerCase();
  const posts = term
    ? allPosts.filter((p) =>
        `${getLocalized(p.title, activeLocale)} ${getLocalized(p.excerpt, activeLocale)}`
          .toLowerCase()
          .includes(term),
      )
    : allPosts;

  const featured = posts[0];
  const rest = posts.slice(1);

  const sidebarCard = 'rounded-lg border border-border bg-card p-6 shadow-card';

  return (
    <PageContainer className="grid grid-cols-1 gap-8 py-12 md:grid-cols-12">
      {/* Posts column */}
      <div className="flex flex-col gap-10 md:col-span-8">
        {posts.length === 0 ? (
          <StateView icon={<Search />} title={t('empty')} />
        ) : (
          <>
            {featured ? (
              <Link
                href={`/blog/${featured.slug}`}
                className="group overflow-hidden rounded-lg border border-border bg-card shadow-card transition-shadow hover:shadow-modal"
              >
                <div className="relative h-72">
                  <CoverPlaceholder
                    seed={featured.coverSeed}
                    className="h-full w-full"
                  />
                  <span className="absolute end-4 top-4 rounded bg-secondary px-3 py-1 text-label-md text-white">
                    {getLocalized(featured.tag, activeLocale)}
                  </span>
                </div>
                <div className="p-8">
                  <h2 className="mb-4 text-headline-md text-foreground group-hover:text-primary">
                    {getLocalized(featured.title, activeLocale)}
                  </h2>
                  <p className="mb-6 line-clamp-2 text-body-md text-muted-foreground">
                    {getLocalized(featured.excerpt, activeLocale)}
                  </p>
                  <div className="flex items-center gap-4 text-label-md text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="size-4" />
                      {t('minutesRead', { count: featured.readMinutes })}
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarDays className="size-4" />
                      {featured.publishedAt}
                    </span>
                  </div>
                </div>
              </Link>
            ) : null}

            {rest.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {rest.map((post) => (
                  <BlogCard key={post.id} post={post} locale={activeLocale} />
                ))}
              </div>
            ) : null}
          </>
        )}
      </div>

      {/* Sidebar */}
      <aside className="flex flex-col gap-8 md:col-span-4">
        <form method="get" className={sidebarCard}>
          <h3 className="mb-4 text-headline-md text-foreground">
            {t('searchTitle')}
          </h3>
          <div className="relative">
            <Search className="pointer-events-none absolute end-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <input
              name="q"
              defaultValue={q ?? ''}
              placeholder={t('searchPlaceholder')}
              className="w-full rounded-[var(--radius)] border border-input bg-muted py-3 ps-4 pe-10 text-body-md text-foreground focus-visible:border-ring focus-visible:bg-card focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none"
            />
          </div>
        </form>

        <div className={sidebarCard}>
          <h3 className="mb-4 border-b border-border pb-2 text-headline-md text-foreground">
            {t('categoriesTitle')}
          </h3>
          <ul className="flex flex-col gap-1">
            {categories.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/categories/${c.slug}`}
                  className="group flex items-center justify-between py-2 text-body-md text-muted-foreground transition-colors hover:text-primary"
                >
                  <span>{getLocalized(c.name, activeLocale)}</span>
                  <span className="rounded bg-muted px-2 py-0.5 text-label-md group-hover:bg-primary/10 group-hover:text-primary">
                    {formatCount(c.businessCount, activeLocale)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className={sidebarCard}>
          <h3 className="mb-4 border-b border-border pb-2 text-headline-md text-foreground">
            {t('popularTitle')}
          </h3>
          <div className="flex flex-col gap-4">
            {allPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex items-center gap-4"
              >
                <CoverPlaceholder
                  seed={post.coverSeed}
                  className="size-20 shrink-0 rounded-md"
                />
                <div>
                  <h4 className="line-clamp-2 text-body-md font-semibold text-foreground group-hover:text-primary">
                    {getLocalized(post.title, activeLocale)}
                  </h4>
                  <span className="mt-1 flex items-center gap-1 text-label-md text-muted-foreground">
                    <Clock className="size-3.5" />
                    {t('minutesRead', { count: post.readMinutes })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-lg bg-secondary p-6 text-white">
          <Mail className="absolute -end-6 -top-6 size-32 opacity-10" />
          <h3 className="relative mb-2 text-headline-md">
            {t('newsletterTitle')}
          </h3>
          <p className="relative mb-4 text-body-md text-white/80">
            {t('newsletterDesc')}
          </p>
          <form className="relative flex flex-col gap-3">
            <input
              type="email"
              placeholder={t('emailPlaceholder')}
              className="w-full rounded-[var(--radius)] border border-white/20 bg-white/10 px-4 py-2 text-white placeholder:text-white/60 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            />
            <button
              type="button"
              className="w-full rounded-[var(--radius)] bg-primary py-2 font-bold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {t('subscribe')}
            </button>
          </form>
        </div>
      </aside>
    </PageContainer>
  );
}
