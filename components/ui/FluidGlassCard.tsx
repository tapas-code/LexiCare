import { cn } from "@/lib/utils";

interface FluidGlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const FluidGlassCard = ({ children, className, ...props }: FluidGlassCardProps) => {
  return (
    <div
      className={cn(
        "fluid-glass rounded-2xl p-6 transition-all duration-500 ease-out",
        "hover:-translate-y-2 hover:shadow-[0_8px_32px_rgba(0,255,255,0.15)] hover:border-[rgba(0,255,255,0.3)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};