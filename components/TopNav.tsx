import { Sparkles, Activity } from "lucide-react";
import { NeonButton } from "./ui/NeonButton";

export function TopNav() {
  return (
    <nav className="absolute top-0 left-0 w-full p-8 z-20 flex justify-between items-center max-w-7xl mx-auto right-0">
      <div className="text-sm font-bold tracking-[0.3em] text-white flex items-center gap-3">
        <Sparkles className="text-[var(--color-neon-magenta)] w-4 h-4" />
        LEXICARE
      </div>
      
      {/* We will add the Language Dropdown here in Step 2! */}
      <div className="flex items-center gap-4">
        <NeonButton variant="pill">
          <Activity className="w-3 h-3 text-[var(--color-neon-cyan)]" />
          Health Vault
        </NeonButton>
      </div>
    </nav>
  );
}