import { Camera, Upload, Activity, Sparkles, ArrowRight } from "lucide-react";

export default function Home() {
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

        {/* 4. The Premium Floating Modal */}
        <div className="glass-panel w-full rounded-4xl p-4 flex flex-col relative group transition-all duration-700 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.9)]">
          
          {/* Inner Scanner Dropzone (Deep Inset) */}
          <div className="glass-inset h-72 rounded-3xl flex flex-col items-center justify-center gap-4 relative overflow-hidden cursor-pointer bg-white/3 transition-all duration-500">
            
            {/* Ambient inner scanner glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-[var(--color-neon-cyan)]/10 blur-[50px] rounded-full pointer-events-none transition-opacity opacity-50 group-hover:opacity-100" />
            
            <div className="bg-white/5 p-4 rounded-full border border-white/5 shadow-inner mb-2 group-hover:scale-110 transition-transform duration-500 relative z-10">
              <Camera className="w-8 h-8 text-[var(--color-neon-cyan)]/80" />
            </div>
            
            <div className="flex flex-col items-center relative z-10">
              <span className="text-white font-medium text-sm tracking-wide">Drop your scan here</span>
              <span className="text-white/40 font-light text-xs mt-1">Supports PDF, JPG, PNG</span>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between p-3 px-5 mt-1">
            <button className="px-4 py-2 text-xs font-medium tracking-wide text-white/50 hover:text-white transition-colors flex items-center gap-2 rounded-lg hover:bg-white/5">
              <Upload className="w-4 h-4" /> Browse Files
            </button>
            
            {/* Premium Button */}
          {/* The New Sleek Outlined Button */}
          <button className="group px-8 py-3 rounded-full border border-white/15 bg-white/2 backdrop-blur-md text-white font-light text-sm tracking-widest uppercase transition-all duration-500 ease-out flex items-center gap-3 hover:border-[var(--color-neon-cyan)]/50 hover:bg-[var(--color-neon-cyan)]/10 hover:text-[var(--color-neon-cyan)] hover:shadow-[0_0_40px_rgba(0,255,255,0.15)]">
              Analyze
              <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-500" />
            </button>
          </div>
        </div>

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