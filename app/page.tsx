"use client";

import { useState, useRef } from "react";
import { Camera, Upload, Activity, Sparkles, ArrowRight, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock User Profile for the Hackathon Demo
  const mockProfile = {
    allergies: ["Peanuts", "Penicillin"],
    medications: ["Lisinopril"],
    targetLanguage: "es" // Showcasing Spanish translation via Lingo.dev!
  };

  // 1. Handle File Selection & Base64 Conversion
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selected);
    }
  };

  // 2. The Core Engine Execution
  const handleAnalyze = async () => {
    if (!preview) return alert("Please upload an image first.");
    setIsAnalyzing(true);
    setResult(null);

    try {
      // Step A: Send Image to Gemini OCR for Medical Extraction
      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: preview, userProfile: mockProfile }),
      });
      const analyzeData = await analyzeRes.json();
      
      if (!analyzeData.success) throw new Error("Analysis failed");

      // Step B: Send the English JSON to Lingo.dev for Localization
      const lingoRes = await fetch("/api/lingo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          medicalData: analyzeData.data, 
          targetLanguage: mockProfile.targetLanguage 
        }),
      });
      const lingoData = await lingoRes.json();

      if (!lingoData.success) throw new Error("Translation failed");

      // Set the final localized result!
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
      
      {/* 1. The Meta AI Background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10s] hover:scale-105"
        style={{ backgroundImage: "url('/imgs/bg.jpeg')" }}
      />
      <div className="absolute inset-0 z-0 bg-[#020205]/70 mix-blend-multiply" /> {/* Darker overlay for contrast */}

      {/* 2. Top Navigation */}
      <nav className="absolute top-0 left-0 w-full p-8 z-20 flex justify-between items-center max-w-7xl mx-auto right-0">
        <div className="text-sm font-bold tracking-[0.3em] text-white flex items-center gap-3">
          <Sparkles className="text-[var(--color-neon-magenta)] w-4 h-4" />
          LEXIMED
        </div>
        <button className="glass-pill px-5 py-2 text-xs font-medium tracking-widest uppercase text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 flex items-center gap-2">
          <Activity className="w-3 h-3 text-[var(--color-neon-cyan)]" />
          Health Vault
        </button>
      </nav>

      {/* 3. Main Interface */}
      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center mt-8">
        
        {/* Sleek Typography */}
        <h1 className="text-5xl md:text-7xl font-light text-center mb-5 tracking-tighter text-white drop-shadow-2xl">
          Decode your <span className="font-semibold text-transparent bg-clip-text bg-linear-to-br from-[var(--color-neon-cyan)] via-white to-[var(--color-neon-magenta)]">health.</span>
        </h1>
        <p className="text-white/50 text-center text-sm md:text-base font-light max-w-md mb-12 leading-relaxed">
          AI-powered medical translation. Upload a prescription or label to instantly localize warnings and cross-reference your allergies.
        </p>

        {/* Floating Glow Behind the Card to separate it from the background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-linear-to-r from-[var(--color-neon-cyan)]/10 to-[var(--color-neon-magenta)]/10 blur-[100px] -z-10 rounded-full pointer-events-none" />

        {/* 4. Dynamic Content Area (Scanner OR Results) */}
        {!result ? (
          <div className="glass-panel w-full rounded-4xl p-4 flex flex-col relative group transition-all duration-700 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.9)]">
            
            {/* Hidden File Input */}
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileSelect} />

            {/* Inner Scanner Dropzone (Deep Inset) */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className=" h-72 rounded-3xl flex flex-col items-center justify-center gap-4 relative overflow-hidden cursor-pointer bg-white/3 transition-all duration-500 hover:bg-white/5"
            >
              {/* Ambient inner scanner glow */}
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
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between p-3 px-5 mt-1">
              <div className="flex gap-2">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 text-xs font-medium tracking-wide text-white/50 hover:text-white transition-colors flex items-center gap-2 rounded-lg hover:bg-white/5"
                >
                  <Upload className="w-4 h-4" /> {preview ? "Change File" : "Browse Files"}
                </button>
                {preview && (
                  <button 
                    onClick={() => setPreview(null)}
                    className="px-4 py-2 text-xs font-medium tracking-wide text-[var(--color-neon-magenta)]/70 hover:text-[var(--color-neon-magenta)] transition-colors flex items-center gap-2 rounded-lg hover:bg-white/5"
                  >
                    Clear
                  </button>
                )}
              </div>
              
              {/* The Sleek Outlined Button */}
              <button 
                onClick={handleAnalyze} 
                disabled={isAnalyzing || !preview}
                className="group px-8 py-3 rounded-full border border-white/15 bg-white/2 backdrop-blur-md text-white font-light text-sm tracking-widest uppercase transition-all duration-500 ease-out flex items-center gap-3 hover:border-[var(--color-neon-cyan)]/50 hover:bg-[var(--color-neon-cyan)]/10 hover:text-[var(--color-neon-cyan)] hover:shadow-[0_0_40px_rgba(0,255,255,0.15)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-white/15 disabled:hover:bg-white/2 disabled:hover:text-white"
              >
                {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Analyze"}
                {!isAnalyzing && <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-500" />}
              </button>
            </div>
          </div>
        ) : (
          /* =========================================
             THE RESULTS VIEW (Dribbble Grade)
             ========================================= */
          <div className="glass-panel w-full rounded-4xl p-8 flex flex-col relative animate-in fade-in zoom-in duration-500 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.9)]">
            
            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
              <h2 className="text-2xl font-light tracking-wide">Analysis Complete</h2>
              <span className="text-[10px] font-medium tracking-widest uppercase text-white/60 border border-white/10 px-4 py-1.5 rounded-full flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-[var(--color-neon-cyan)]" /> 
                Translated to Spanish
              </span>
            </div>

            {/* Risk Indicator Panel */}
            {result.risk_level === 'danger' && (
              <div className="mb-8 p-5 rounded-2xl glass-inset border-[var(--color-neon-magenta)]/30 flex items-start gap-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[var(--color-neon-magenta)]/5" />
                <AlertTriangle className="text-[var(--color-neon-magenta)] w-6 h-6 shrink-0 mt-0.5 relative z-10" />
                <div className="relative z-10">
                  <h3 className="text-[var(--color-neon-magenta)] font-medium text-sm tracking-wide uppercase mb-2">Critical Allergy Warning</h3>
                  <p className="text-white/80 text-sm font-light leading-relaxed">{result.allergy_warnings?.join(" ")}</p>
                </div>
              </div>
            )}

            {result.risk_level === 'safe' && (
              <div className="mb-8 p-5 rounded-2xl glass-inset border-[var(--color-neon-lime)]/30 flex items-center gap-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[var(--color-neon-lime)]/5" />
                <CheckCircle2 className="text-[var(--color-neon-lime)] w-6 h-6 relative z-10" />
                <span className="text-[var(--color-neon-lime)] font-medium text-sm tracking-wide relative z-10">Medication is safe based on your profile.</span>
              </div>
            )}

            {/* Explanation Section */}
            <div className="space-y-3 mb-8">
              <h3 className="text-xs font-semibold tracking-widest text-white/30 uppercase">Simplified Breakdown</h3>
              <p className="text-lg font-light leading-relaxed text-white/90">{result.simplified_explanation}</p>
            </div>

            {/* Ingredients Section */}
            <div className="space-y-4 mb-8">
              <h3 className="text-xs font-semibold tracking-widest text-white/30 uppercase">Detected Active Ingredients</h3>
              <div className="flex flex-wrap gap-2">
                {result.ingredients?.map((ing: string, i: number) => (
                  <span key={i} className="glass-pill px-4 py-1.5 text-xs text-white/70 font-light tracking-wide">{ing}</span>
                ))}
              </div>
            </div>

            {/* Reset Button */}
            <button 
              onClick={() => {
                setResult(null);
                setPreview(null);
                setFile(null);
              }} 
              className="w-full py-4 rounded-full border border-white/10 text-white/50 hover:text-[var(--color-neon-cyan)] hover:border-[var(--color-neon-cyan)]/50 hover:bg-[var(--color-neon-cyan)]/5 transition-all duration-300 text-xs font-medium tracking-widest uppercase mt-4"
            >
              Scan Another Document
            </button>
          </div>
        )}

        {/* 5. Trust Badges */}
        <div className="mt-12 flex items-center gap-6 text-[10px] font-medium text-white/30 tracking-[0.2em] uppercase">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-neon-lime)] shadow-[0_0_8px_var(--color-neon-lime)] animate-pulse-slow"></span> 
            Encrypted
          </span>
          <span>&times;</span>
          <span>Powered by Lingo.dev Engine</span>
        </div>

      </div>
    </main>
  );
}