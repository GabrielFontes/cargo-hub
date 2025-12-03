import { cn } from "@/lib/utils";

interface AvatarStackProps {
  count: number;
  max?: number;
}

const avatarColors = [
  "bg-amber-200",
  "bg-purple-200", 
  "bg-blue-200",
  "bg-green-200",
  "bg-pink-200",
];

export function AvatarStack({ count, max = 3 }: AvatarStackProps) {
  const visibleCount = Math.min(count, max);
  const remaining = count - max;

  return (
    <div className="flex items-center -space-x-2">
      {Array.from({ length: visibleCount }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "w-8 h-8 rounded-full border-2 border-card flex items-center justify-center text-xs font-medium",
            avatarColors[i % avatarColors.length]
          )}
          style={{ zIndex: visibleCount - i }}
        >
          <span className="text-foreground/70">👤</span>
        </div>
      ))}
      {remaining > 0 && (
        <div 
          className="w-8 h-8 rounded-full border-2 border-card bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground"
          style={{ zIndex: 0 }}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
