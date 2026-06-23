import { CoverPlaceholder } from '@/components/common/cover-placeholder';

function BusinessGallery({ count, seed }: { count: number; seed: number }) {
  const tiles = Array.from({ length: Math.min(count, 6) });
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {tiles.map((_, index) => (
        <CoverPlaceholder
          key={index}
          seed={seed + index * 7}
          className="aspect-[4/3] w-full rounded-lg"
        />
      ))}
    </div>
  );
}

export { BusinessGallery };
