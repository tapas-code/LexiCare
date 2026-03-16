import { useState } from "react";
import { Sparkles, Activity, Globe, ChevronDown } from "lucide-react";
import { NeonButton } from "./ui/NeonButton";

// Supported languages for the hackathon demo
const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "hi", name: "हिन्दी" },
  { code: "ar", name: "العربية" },
  { code: "zh", name: "中文" },
];

interface TopNavProps {
  targetLanguage: string;
  setTargetLanguage: (lang: string) => void;
  onOpenVault: () => void;
}

export function TopNav({ targetLanguage, setTargetLanguage, onOpenVault }: TopNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const activeLang = LANGUAGES.find((l) => l.code === targetLanguage)?.name || "Language";

  return (
    <nav className="absolute top-0 left-0 w-full p-8 z-50 flex justify-between items-center max-w-7xl mx-auto right-0">
      {/* Brand Logo */}
      <div className="text-sm font-bold tracking-[0.3em] text-white flex items-center gap-3">
        <Sparkles className="text-[var(--color-neon-magenta)] w-4 h-4" />
        LEXICARE
      </div>
      
      {/* Right Actions */}
      <div className="flex items-center gap-4">

         {/* Health Vault */}
         <NeonButton variant="pill" onClick={onOpenVault}>
          <Activity className="w-3 h-3 text-[var(--color-neon-cyan)]" />
          Health Vault
        </NeonButton>
        
        {/* Dynamic Language Selector */}
        <div className="relative">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="glass-pill px-4 py-2 text-xs font-medium tracking-widest uppercase text-white/80 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <Globe className="w-3 h-3 text-[var(--color-neon-magenta)]" />
            {activeLang}
            <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute top-full right-0 mt-3 w-40 glass-panel rounded-2xl overflow-hidden flex flex-col shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setTargetLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`px-4 py-3 text-xs tracking-wider uppercase text-left transition-colors hover:bg-white/10 ${
                    targetLanguage === lang.code 
                      ? "text-[var(--color-neon-cyan)] bg-white/5 font-semibold" 
                      : "text-white/60 font-light"
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          )}
        </div>

       
      </div>
    </nav>
  );
}