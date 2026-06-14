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
    <div className="text-center group">
      <div
        className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mx-auto mb-3 transition-transform duration-300 group-hover:scale-110`}
      >
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <h3 className="font-bold text-slate-900 text-sm">{title}</h3>
      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
