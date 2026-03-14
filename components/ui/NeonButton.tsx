import { cn } from "@/lib/utils";

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "cyan" | "magenta" | "lime";
  children: React.ReactNode;
}

export const NeonButton = ({ variant = "cyan", className, children, ...props }: NeonButtonProps) => {
  const variants = {
    cyan: "border-[var(--color-neon-cyan)]/30 hover:border-[var(--color-neon-cyan)] hover:bg-[var(--color-neon-cyan)]/5 hover:text-[var(--color-neon-cyan)] hover:shadow-[0_0_20px_rgba(0,255,255,0.15)]",
    magenta: "border-[var(--color-neon-magenta)]/30 hover:border-[var(--color-neon-magenta)] hover:bg-[var(--color-neon-magenta)]/5 hover:text-[var(--color-neon-magenta)] hover:shadow-[0_0_20px_rgba(255,0,255,0.15)]",
    lime: "border-[var(--color-neon-lime)]/30 hover:border-[var(--color-neon-lime)] hover:bg-[var(--color-neon-lime)]/5 hover:text-[var(--color-neon-lime)] hover:shadow-[0_0_20px_rgba(57,255,20,0.15)]",
  };

  return (
    <button
      className={cn(
        "relative px-6 py-2.5 rounded-full text-white/80 font-light text-sm tracking-wide border transition-all duration-500 ease-out backdrop-blur-md flex items-center justify-center gap-2",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};