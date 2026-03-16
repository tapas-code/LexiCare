"use client";

import { useState, useRef, useEffect } from "react";
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
  const [isTranslating, setIsTranslating] = useState(false); 
  const [baseMedicalData, setBaseMedicalData] = useState<any>(null);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({
    allergies: ["Caffeine"], 
    medications: ["Lisinopril"],
  });

  const translateResults = async (dataToTranslate: any, lang: string) => {
    setIsTranslating(true);
    try {
      const lingoRes = await fetch("/api/lingo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ medicalData: dataToTranslate, targetLanguage: lang }),
      });
      const lingoData = await lingoRes.json();
      if (!lingoData.success) throw new Error("Translation failed");
      
      setResult(lingoData.translatedData);
    } catch (error) {
      console.error("Translation Error:", error);
    } finally {
      setIsTranslating(false);
    }
  };

  // NEW: Watch for language changes and re-translate instantly
  useEffect(() => {
    if (baseMedicalData) {
      translateResults(baseMedicalData, targetLanguage);
    }
  }, [targetLanguage]);

  const mockProfile = {
    allergies: ["Caffeine", "Penicillin"],
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
      // Step A: OCR and Medical Extraction (Gemini)
      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: preview, userProfile: userProfile }), 
      });
      const analyzeData = await analyzeRes.json();
      if (!analyzeData.success) throw new Error("Analysis failed");

      // Step B: Cache the English base data
      setBaseMedicalData(analyzeData.data);

      // Step C: Trigger translation
      await translateResults(analyzeData.data, targetLanguage);
      
    } catch (error) {
      console.error(error);
      alert("Something went wrong during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col items-center justify-start p-6 pt-20 selection:bg-[var(--color-neon-cyan)] selection:text-black">
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

                <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 text-xs font-medium tracking-wide text-white/50 hover:text-white transition-colors flex items-center gap-2 rounded-lg hover:bg-white/5">
                  <Camera className="w-4 h-4" /> Camera
                </button>
              </div>
              
              <NeonButton variant="cyan" onClick={handleAnalyze} disabled={isAnalyzing || !preview}>
                {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Analyze"}
                {!isAnalyzing && <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-500" />}
              </NeonButton>
            </div>
          </FluidGlassCard>
        ) : (
          <div className={`w-full transition-opacity duration-300 ${isTranslating ? "opacity-40" : "opacity-100"}`}>
            {isTranslating && <div className='text-center animate-pulse'>Translating...</div>}
            <ResultsBentoGrid 
              result={result} 
              onReset={() => { 
                setResult(null); 
                setBaseMedicalData(null); 
                setPreview(null); 
                setFile(null); 
              }} 
              targetLanguage={targetLanguage}
              userProfile={userProfile}
              onAddMed={(med) => setUserProfile(prev => ({ 
                ...prev, 
                medications: [...new Set([...prev.medications, med])] 
              }))}
            />
          </div>
        )}
      </div>

      <div className="relative z-10 mt-auto py-10 flex items-center gap-6 ...">
        <div className="mt-10 flex items-center gap-6 text-[10px] font-semibold text-white/40 tracking-wider uppercase">
          <span className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-neon-lime)] animate-pulse-slow"></div> 
            End-to-End Encrypted
          </span>
          <span>|</span>
          <span>Powered by <span className='text-white ms-0.5'>Lingo.dev</span></span>
        </div>
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