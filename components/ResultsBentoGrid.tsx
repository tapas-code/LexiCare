import { Sparkles, AlertTriangle, CheckCircle2, Pill, Activity, ShieldAlert } from "lucide-react";
import { FluidGlassCard } from "./ui/FluidGlassCard";

interface ResultsProps {
  result: any;
  onReset: () => void;
  targetLanguage: string;
}

export function ResultsBentoGrid({ result, onReset, targetLanguage }: ResultsProps) {
  const isDanger = result.risk_level === "danger" || result.risk_level === "warning";

  return (
    <FluidGlassCard className="w-full p-6 md:p-8 flex flex-col animate-in fade-in zoom-in duration-500 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.9)]">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
        <h2 className="text-2xl font-light tracking-wide">Analysis Complete</h2>
        <span className="text-[10px] font-medium tracking-widest uppercase text-white/60 border border-white/10 px-4 py-1.5 rounded-full flex items-center gap-2">
          <Sparkles className="w-3 h-3 text-[var(--color-neon-cyan)]" /> 
          Translated to {targetLanguage.toUpperCase()}
        </span>
      </div>

      {/* The Bento Grid */}
      <div className="grid grid-cols-1  gap-4 mb-6">
        
        {/* Box 1: Overall Summary (Spans full width) */}
        <div className=" glass-inset p-5 rounded-3xl border border-white/5 hover:bg-white/5 transition-colors">
          <h3 className="text-xs font-semibold tracking-widest text-white/40 uppercase mb-2 flex items-center gap-2">
            <Activity className="w-4 h-4 text-[var(--color-neon-cyan)]" /> Overview
          </h3>
          <p className="text-lg font-light leading-relaxed text-white/90">{result.overall_summary}</p>
        </div>

        {/* Box 2: Symptoms & Meds (Safe Tags) */}
        <div className="glass-inset p-5 rounded-3xl border border-white/5 flex flex-col gap-6">
          <div>
            <h3 className="text-xs font-semibold tracking-widest text-white/40 uppercase mb-3 flex items-center gap-2">
              <Pill className="w-4 h-4 text-[var(--color-neon-lime)]" /> Detected Meds
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.medications?.map((med: string, i: number) => (
                <span key={i} className="px-3 py-1 text-xs font-medium tracking-wide rounded-full border border-[var(--color-neon-lime)]/50 text-[var(--color-neon-lime)] bg-[var(--color-neon-lime)]/5">
                  {med}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-widest text-white/40 uppercase mb-3">Treats Symptoms</h3>
            <div className="flex flex-wrap gap-2">
              {result.symptoms_treated?.map((sym: string, i: number) => (
                <span key={i} className="px-3 py-1 text-xs font-medium tracking-wide rounded-full border border-white/20 text-white/70 bg-white/5">
                  {sym}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Box 3: Risk Assessment (Danger/Safe Box) */}
        <div className={`glass-inset p-5 rounded-3xl border relative overflow-hidden flex flex-col justify-center ${
          isDanger ? "border-[var(--color-neon-magenta)]/30" : "border-[var(--color-neon-lime)]/30"
        }`}>
          <div className={`absolute inset-0 opacity-5 ${isDanger ? "bg-[var(--color-neon-magenta)]" : "bg-[var(--color-neon-lime)]"}`} />
          
          <div className="relative z-10 flex items-start gap-4 mb-4">
            {isDanger ? (
              <AlertTriangle className="text-[var(--color-neon-magenta)] w-8 h-8 shrink-0" />
            ) : (
              <CheckCircle2 className="text-[var(--color-neon-lime)] w-8 h-8 shrink-0" />
            )}
            <div>
              <h3 className={`font-medium text-sm tracking-wide uppercase mb-1 ${isDanger ? "text-[var(--color-neon-magenta)]" : "text-[var(--color-neon-lime)]"}`}>
                {isDanger ? "Interaction Warning" : "Safe to Consume"}
              </h3>
              <p className="text-white/80 text-sm font-light leading-relaxed">{result.risk_explanation}</p>
            </div>
          </div>

          {/* Red Allergen Tags */}
          {result.detected_allergens?.length > 0 && (
            <div className="relative z-10 mt-auto pt-4 border-t border-white/10">
              <h3 className="text-[10px] font-semibold tracking-widest text-white/40 uppercase mb-2 flex items-center gap-2">
                <ShieldAlert className="w-3 h-3 text-[var(--color-neon-magenta)]" /> Trigger Warnings
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.detected_allergens.map((allergen: string, i: number) => (
                  <span key={i} className="px-3 py-1 text-xs font-medium tracking-wide rounded-full border border-[var(--color-neon-magenta)]/50 text-[var(--color-neon-magenta)] bg-[var(--color-neon-magenta)]/5">
                    {allergen}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      <button 
        onClick={onReset} 
        className="w-full py-4 rounded-full border border-white/10 text-white/50 hover:text-[var(--color-neon-cyan)] hover:border-[var(--color-neon-cyan)]/50 hover:bg-[var(--color-neon-cyan)]/5 transition-all duration-300 text-xs font-medium tracking-widest uppercase"
      >
        Scan Another Document
      </button>
    </FluidGlassCard>
  );
}