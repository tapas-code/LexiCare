import { cn } from "@/lib/utils";

interface FluidGlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "panel" | "inset";
  children: React.ReactNode;
}

export const FluidGlassCard = ({ variant = "panel", children, className, ...props }: FluidGlassCardProps) => {
  return (
    <div
      className={cn(
        "transition-all duration-700 relative overflow-hidden",
        variant === "panel" 
          ? "glass-panel rounded-4xl shadow-[0_40px_80px_-15px_rgba(0,0,0,0.9)]" 
          : "glass-inset rounded-3xl bg-white/3 hover:bg-white/5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};