import { CategoryIcon } from '@/components/common/category-icon';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { getLocalized } from '@/lib/format';
import type { Category } from '@/types';

function CategoryCard({
  category,
  locale,
}: {
  category: Category;
  locale: Locale;
}) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group flex flex-col items-center gap-4 rounded-lg bg-card p-6 text-center shadow-card transition-all hover:-translate-y-1 hover:shadow-modal focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <span className="flex size-16 items-center justify-center rounded-full bg-muted text-secondary transition-colors group-hover:bg-primary/10 group-hover:text-primary [&_svg]:size-7">
        <CategoryIcon name={category.icon} />
      </span>
      <span className="text-body-md font-medium text-foreground">
        {getLocalized(category.name, locale)}
      </span>
    </Link>
  );
}

export { CategoryCard };
