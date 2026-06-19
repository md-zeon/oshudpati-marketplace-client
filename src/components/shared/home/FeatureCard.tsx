import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  bg: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  color,
  bg,
}: FeatureCardProps) {
  return (
    <div className="group flex flex-col items-start transition-all duration-200">
      {/* Icon Area: Uses the dynamic background cleanly without an overarching card shell */}
      <div
        className={`w-12 h-12 rounded-xl ${bg} ${color} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-105`}
      >
        <Icon className="w-5 h-5 stroke-[2.25]" />
      </div>

      {/* Typography Layout: Left-aligned and spacious */}
      <div className="space-y-1">
        <h3 className="font-bold text-gray-900 text-base group-hover:text-emerald-700 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed font-medium">
          {description}
        </p>
      </div>
    </div>
  );
}
