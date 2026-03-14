import { cn } from "@/lib/utils";

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "cyan" | "magenta" | "lime" | "pill";
  children: React.ReactNode;
}

export const NeonButton = ({ variant = "cyan", className, children, ...props }: NeonButtonProps) => {
  const baseStyles = "group backdrop-blur-md font-light transition-all duration-500 ease-out flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-white/15 disabled:hover:bg-white/2 disabled:hover:text-white";
  
  const variants = {
    cyan: "border border-white/15 bg-white/2 text-white hover:border-[var(--color-neon-cyan)]/50 hover:bg-[var(--color-neon-cyan)]/10 hover:text-[var(--color-neon-cyan)] hover:shadow-[0_0_40px_rgba(0,255,255,0.15)]",
    magenta: "border border-white/15 bg-white/2 text-white hover:border-[var(--color-neon-magenta)]/50 hover:bg-[var(--color-neon-magenta)]/10 hover:text-[var(--color-neon-magenta)] hover:shadow-[0_0_40px_rgba(255,0,255,0.15)]",
    lime: "border border-white/15 bg-white/2 text-white hover:border-[var(--color-neon-lime)]/50 hover:bg-[var(--color-neon-lime)]/10 hover:text-[var(--color-neon-lime)] hover:shadow-[0_0_40px_rgba(57,255,20,0.15)]",
    pill: "glass-pill text-white/80 hover:text-white hover:bg-white/10"
  };

  const sizes = variant === "pill" ? "px-5 py-2 text-xs uppercase tracking-widest" : "px-8 py-3 rounded-full text-sm tracking-widest uppercase";

  return (
    <button className={cn(baseStyles, variants[variant], sizes, className)} {...props}>
      {children}
    </button>
  );
};