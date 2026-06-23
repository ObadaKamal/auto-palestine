import {
  Car,
  CircleDot,
  Cog,
  Droplets,
  SprayCan,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Wrench,
  Cog,
  Zap,
  SprayCan,
  CircleDot,
  Droplets,
  Car,
};

function CategoryIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = iconMap[name] ?? Car;
  return <Icon className={className} aria-hidden />;
}

export { CategoryIcon };
