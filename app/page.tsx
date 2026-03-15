"use client";

import { useState, useRef } from "react";
import { Camera, Upload, ArrowRight, Loader2, AlertTriangle, CheckCircle2, Sparkles } from "lucide-react";
import { TopNav } from "@/components/TopNav";
import { FluidGlassCard } from "@/components/ui/FluidGlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { ResultsBentoGrid } from "@/components/ResultsBentoGrid";
import { HealthVaultModal } from "@/components/HealthVaultModal";

export default function Home() {
  const [targetLanguage, setTargetLanguage] = useState("en");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({
    allergies: ["Peanuts"], 
    medications: ["Lisinopril"],
  });

  const mockProfile = {
    allergies: ["Peanuts", "Penicillin"],
    medications: ["Lisinopril"],
    targetLanguage: targetLanguage
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selected);
    }
  };

  const handleAnalyze = async () => {
    if (!preview) return alert("Please upload an image first.");
    setIsAnalyzing(true);
    setResult(null);

    try {
      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: preview, userProfile: userProfile }),
      });
      const analyzeData = await analyzeRes.json();
      if (!analyzeData.success) throw new Error("Analysis failed");

      const lingoRes = await fetch("/api/lingo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ medicalData: analyzeData.data, targetLanguage }),
      });
      const lingoData = await lingoRes.json();
      if (!lingoData.success) throw new Error("Translation failed");

      setResult(lingoData.translatedData);
    } catch (error) {
      console.error(error);
      alert("Something went wrong during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-6 selection:bg-[var(--color-neon-cyan)] selection:text-black">
      <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10s] hover:scale-105" style={{ backgroundImage: "url('/imgs/bg.jpeg')" }} />
      <div className="absolute inset-0 z-0 bg-[#020205]/70 mix-blend-multiply" /> 

      <TopNav 
        targetLanguage={targetLanguage} 
        setTargetLanguage={setTargetLanguage} 
        onOpenVault={() => setIsVaultOpen(true)} 
      />

      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center mt-8">
        <h1 className="text-5xl md:text-7xl font-light text-center mb-5  text-white drop-shadow-2xl">
          Decode your <span className="font-semibold text-transparent bg-clip-text bg-linear-to-br from-[var(--color-neon-cyan)] via-white to-[var(--color-neon-magenta)]">health.</span>
        </h1>
        <p className="text-white/50 text-center text-sm md:text-base font-light max-w-md mb-12 leading-relaxed">
          AI-powered medical translation. Upload a prescription or label to instantly localize warnings and cross-reference your allergies.
        </p>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-linear-to-r from-[var(--color-neon-cyan)]/10 to-[var(--color-neon-magenta)]/10 blur-[100px] -z-10 rounded-full pointer-events-none" />

        {!result ? (
          <FluidGlassCard className="w-full p-4 flex flex-col group">
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileSelect} />

            <FluidGlassCard 
              variant="inset" 
              className="h-72 flex flex-col items-center justify-center gap-4 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-[var(--color-neon-cyan)]/10 blur-[50px] rounded-full pointer-events-none transition-opacity opacity-50 group-hover:opacity-100" />
              {preview ? (
                <img src={preview} alt="Scan preview" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen transition-opacity duration-300" />
              ) : (
                <>
                  <div className="bg-white/5 p-4 rounded-full border border-white/5 shadow-inner mb-2 group-hover:scale-110 transition-transform duration-500 relative z-10">
                    <Camera className="w-8 h-8 text-[var(--color-neon-cyan)]/80" />
                  </div>
                  <div className="flex flex-col items-center relative z-10">
                    <span className="text-white font-medium text-sm tracking-wide">Drop your scan here</span>
                    <span className="text-white/40 font-light text-xs mt-1">Supports PDF, JPG, PNG</span>
                  </div>
                </>
              )}
            </FluidGlassCard>

            <div className="flex items-center justify-between p-3 px-5 mt-1">
              <div className="flex gap-2">
                <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 text-xs font-medium tracking-wide text-white/50 hover:text-white transition-colors flex items-center gap-2 rounded-lg hover:bg-white/5">
                  <Upload className="w-4 h-4" /> {preview ? "Change File" : "Browse Files"}
                </button>
                {preview && (
                  <button onClick={() => setPreview(null)} className="px-4 py-2 text-xs font-medium tracking-wide text-[var(--color-neon-magenta)]/70 hover:text-[var(--color-neon-magenta)] transition-colors flex items-center gap-2 rounded-lg hover:bg-white/5">
                    Clear
                  </button>
                )}
              </div>
              
              <NeonButton variant="cyan" onClick={handleAnalyze} disabled={isAnalyzing || !preview}>
                {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Analyze"}
                {!isAnalyzing && <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-500" />}
              </NeonButton>
            </div>
          </FluidGlassCard>
        ) : (
          <ResultsBentoGrid 
            result={result} 
            onReset={() => { setResult(null); setPreview(null); setFile(null); }} 
            targetLanguage={targetLanguage}
            userProfile={userProfile}
            onAddMed={(med) => setUserProfile(prev => ({ 
              ...prev, 
              medications: [...new Set([...prev.medications, med])] // new Set prevents duplicates!
            }))}
          />
        )}
      </div>

      <HealthVaultModal 
        isOpen={isVaultOpen} 
        onClose={() => setIsVaultOpen(false)}
        profile={userProfile}
        setProfile={setUserProfile}
      />
    </main>
  );
}