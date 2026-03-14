import { X, Plus, Activity, ShieldAlert, Pill } from "lucide-react";
import { useState } from "react";
import { FluidGlassCard } from "./ui/FluidGlassCard";

interface Profile {
  allergies: string[];
  medications: string[];
}

interface VaultProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile;
  setProfile: (profile: Profile) => void;
}

export function HealthVaultModal({ isOpen, onClose, profile, setProfile }: VaultProps) {
  const [newAllergy, setNewAllergy] = useState("");
  const [newMed, setNewMed] = useState("");

  if (!isOpen) return null;

  const handleAddAllergy = () => {
    if (!newAllergy.trim()) return;
    setProfile({ ...profile, allergies: [...profile.allergies, newAllergy.trim()] });
    setNewAllergy("");
  };

  const handleAddMed = () => {
    if (!newMed.trim()) return;
    setProfile({ ...profile, medications: [...profile.medications, newMed.trim()] });
    setNewMed("");
  };

  const removeAllergy = (target: string) => {
    setProfile({ ...profile, allergies: profile.allergies.filter(a => a !== target) });
  };

  const removeMed = (target: string) => {
    setProfile({ ...profile, medications: profile.medications.filter(m => m !== target) });
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Blurred Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-in Panel */}
      <FluidGlassCard className="w-full max-w-md h-full rounded-none border-r-0 border-y-0 relative z-10 flex flex-col animate-in slide-in-from-right duration-500 shadow-[-20px_0_50px_rgba(0,0,0,0.5)]">
        
        <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
          <h2 className="text-2xl font-light tracking-wide flex items-center gap-3">
            <Activity className="w-6 h-6 text-[var(--color-neon-cyan)]" /> 
            Health Vault
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/50 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
          
          {/* Allergies Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold tracking-widest text-white/40 uppercase flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[var(--color-neon-magenta)]" /> Known Allergies
            </h3>
            
            <div className="flex flex-wrap gap-2">
              {profile.allergies.map((allergy, i) => (
                <span key={i} onClick={() => removeAllergy(allergy)} className="px-3 py-1.5 text-xs font-medium tracking-wide rounded-full border border-[var(--color-neon-magenta)]/50 text-[var(--color-neon-magenta)] bg-[var(--color-neon-magenta)]/5 cursor-pointer hover:bg-[var(--color-neon-magenta)] hover:text-white transition-colors flex items-center gap-2 group">
                  {allergy} <X className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input 
                type="text" 
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddAllergy()}
                placeholder="Add allergy..." 
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--color-neon-magenta)]/50 transition-colors"
              />
              <button onClick={handleAddAllergy} className="p-2 rounded-xl bg-[var(--color-neon-magenta)]/10 text-[var(--color-neon-magenta)] border border-[var(--color-neon-magenta)]/30 hover:bg-[var(--color-neon-magenta)] hover:text-white transition-colors">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Medications Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold tracking-widest text-white/40 uppercase flex items-center gap-2">
              <Pill className="w-4 h-4 text-[var(--color-neon-lime)]" /> Active Medications
            </h3>
            
            <div className="flex flex-wrap gap-2">
              {profile.medications.map((med, i) => (
                <span key={i} onClick={() => removeMed(med)} className="px-3 py-1.5 text-xs font-medium tracking-wide rounded-full border border-[var(--color-neon-lime)]/50 text-[var(--color-neon-lime)] bg-[var(--color-neon-lime)]/5 cursor-pointer hover:bg-[var(--color-neon-lime)] hover:text-white transition-colors flex items-center gap-2 group">
                  {med} <X className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input 
                type="text" 
                value={newMed}
                onChange={(e) => setNewMed(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddMed()}
                placeholder="Add medication..." 
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--color-neon-lime)]/50 transition-colors"
              />
              <button onClick={handleAddMed} className="p-2 rounded-xl bg-[var(--color-neon-lime)]/10 text-[var(--color-neon-lime)] border border-[var(--color-neon-lime)]/30 hover:bg-[var(--color-neon-lime)] hover:text-white transition-colors">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>
      </FluidGlassCard>
    </div>
  );
}