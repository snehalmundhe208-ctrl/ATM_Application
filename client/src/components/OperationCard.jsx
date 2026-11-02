import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function OperationCard({
  title,
  description,
  icon: Icon,
  badge,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative text-left w-full p-6 bg-white hover:bg-[#FFF8F0]/75 rounded-[24px] border border-black/[0.06] hover:border-[#E88745]/70 shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:shadow-soft-lg transition-all duration-200 transform hover:-translate-y-1.5 active:translate-y-0 active:scale-[0.98] overflow-hidden flex flex-col justify-between"
    >
      {/* Top Burnt Orange Gradient Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#E88745]/40 to-transparent group-hover:via-[#E88745] transition-all duration-300" />

      {/* Header with Icon and Badge */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-13 h-13 w-12 h-12 rounded-2xl bg-[#FFF8F0] group-hover:bg-[#E88745] border border-[#E8DDD2] group-hover:border-[#E88745] text-[#CF6F2E] group-hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm">
          <Icon className="w-6 h-6 transition-transform group-hover:scale-110 duration-200" />
        </div>

        {badge ? (
          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#FFF8F0] text-[#CF6F2E] border border-[#F2A066]/50 px-2.5 py-1 rounded-full shadow-xs">
            {badge}
          </span>
        ) : (
          <div className="w-8 h-8 rounded-full bg-[#FAF5EE] group-hover:bg-[#E88745]/15 flex items-center justify-center text-[#737373] group-hover:text-[#CF6F2E] transition-all">
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        )}
      </div>

      {/* Body: Title & Description */}
      <div className="space-y-1.5">
        <h3 className="text-lg font-extrabold text-[#292929] group-hover:text-[#CF6F2E] transition-colors tracking-tight">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-[#737373] leading-relaxed">
          {description}
        </p>
      </div>

      {/* Bottom Action Prompt */}
      <div className="mt-5 pt-3 border-t border-[#F5EEE6] flex items-center justify-between text-xs font-bold text-[#CF6F2E] group-hover:text-[#B6591E]">
        <span>Tap to proceed</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </div>
    </button>
  );
}
