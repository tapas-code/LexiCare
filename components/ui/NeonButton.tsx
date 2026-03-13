import { cn } from "@/lib/utils";

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "cyan" | "magenta" | "lime";
  children: React.ReactNode;
}

export const NeonButton = ({ variant = "cyan", className, children, ...props }: NeonButtonProps) => {
  const variants = {
    cyan: "border-[var(--color-neon-cyan)] text-[var(--color-neon-cyan)] hover:bg-[var(--color-neon-cyan)] hover:text-[var(--color-abyss)] hover:shadow-[0_0_20px_var(--color-neon-cyan)]",
    magenta: "border-[var(--color-neon-magenta)] text-[var(--color-neon-magenta)] hover:bg-[var(--color-neon-magenta)] hover:text-[var(--color-abyss)] hover:shadow-[0_0_20px_var(--color-neon-magenta)]",
    lime: "border-[var(--color-neon-lime)] text-[var(--color-neon-lime)] hover:bg-[var(--color-neon-lime)] hover:text-[var(--color-abyss)] hover:shadow-[0_0_20px_var(--color-neon-lime)]",
  };

  return (
    <button
      className={cn(
        "relative px-8 py-3 font-bold rounded-xl border-2 transition-all duration-300 ease-in-out uppercase tracking-widest text-sm backdrop-blur-sm",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};