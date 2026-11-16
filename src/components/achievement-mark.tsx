import { Award } from "lucide-react";
import { cn } from "@/lib/cn";

export function AchievementMark({
  iconUrl,
  earned = true,
  className,
}: {
  iconUrl?: string;
  earned?: boolean;
  className?: string;
}) {
  if (iconUrl) {
    return <img src={iconUrl} alt="" className={cn("size-8 rounded-lg object-cover", !earned && "opacity-40", className)} />;
  }
  return <Award className={cn("size-6", earned ? "text-brand" : "text-brand-soft", className)} />;
}
