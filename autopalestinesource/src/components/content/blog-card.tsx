import { Clock } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { CoverPlaceholder } from '@/components/common/cover-placeholder';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { getLocalized } from '@/lib/format';
import type { BlogPost } from '@/types';

async function BlogCard({ post, locale }: { post: BlogPost; locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'blog' });
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-card transition-shadow hover:shadow-modal focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <div className="relative h-48 overflow-hidden">
        <CoverPlaceholder
          seed={post.coverSeed}
          className="h-full w-full transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute end-3 top-3 rounded bg-card px-2 py-1 text-label-md text-secondary shadow-sm">
          {getLocalized(post.tag, locale)}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-3 text-body-lg font-semibold text-foreground group-hover:text-primary">
          {getLocalized(post.title, locale)}
        </h3>
        <p className="mb-4 line-clamp-2 flex-1 text-body-md text-muted-foreground">
          {getLocalized(post.excerpt, locale)}
        </p>
        <span className="flex items-center gap-1 border-t border-border pt-4 text-label-md text-muted-foreground">
          <Clock className="size-4" />
          {t('minutesRead', { count: post.readMinutes })}
        </span>
      </div>
    </Link>
  );
}

export { BlogCard };
