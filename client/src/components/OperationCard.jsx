import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function OperationCard({
  title,
  description,
  icon: Icon,
  badge,
  onClick,
  accentColor = '#E88745',
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative text-left w-full p-5 sm:p-6 bg-white hover:bg-[#FFF8F0]/70 rounded-2xl border border-[#E8DDD2] hover:border-[#E88745]/60 shadow-soft hover:shadow-soft-lg transition-all duration-200 transform hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] overflow-hidden flex flex-col justify-between"
    >
      {/* Top Subtle Orange Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#E88745]/40 to-transparent group-hover:via-[#E88745] transition-all duration-300" />

      {/* Header with Icon and Badge */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-[#FFF8F0] group-hover:bg-[#E88745] border border-[#E8DDD2] group-hover:border-[#E88745] text-[#CF6F2E] group-hover:text-white flex items-center justify-center transition-colors duration-200 shadow-sm">
          <Icon className="w-6 h-6 transition-transform group-hover:scale-110 duration-200" />
        </div>

        {badge ? (
          <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FFF8F0] text-[#CF6F2E] border border-[#F2A066]/40 px-2 py-0.5 rounded-full">
            {badge}
          </span>
        ) : (
          <div className="w-8 h-8 rounded-full bg-[#FAF5EE] group-hover:bg-[#E88745]/15 flex items-center justify-center text-[#737373] group-hover:text-[#CF6F2E] transition-all">
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </div>
        )}
      </div>

      {/* Body: Title & Description */}
      <div>
        <h3 className="text-base sm:text-lg font-bold text-[#292929] group-hover:text-[#CF6F2E] transition-colors tracking-tight">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-[#737373] mt-1 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Bottom Action Hint */}
      <div className="mt-4 pt-3 border-t border-[#F5EEE6] flex items-center text-xs font-semibold text-[#CF6F2E] group-hover:text-[#B6591E]">
        <span>Tap to proceed</span>
        <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
      </div>
    </button>
  );
}
