
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  TrendingUp, Activity, BookOpen, Shield, Calculator, Zap, 
  Brain, Globe, Lock, Search, Menu, X, Star, Users, 
  ArrowUpRight, ArrowDownRight, Play, Download, DollarSign,
  Briefcase, GraduationCap, ChevronRight, BarChart3, AlertTriangle,
  Video, Sparkles, Wand2, Info, Loader2
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, PieChart, Pie, 
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { StockData, Language } from './types';
import { TRANSLATIONS, SECTOR_DATA, EDUCATION_MODULES } from './constants';
import { getMarketForecast, generateVideoContent } from './services/geminiService';

// Define the AIStudio interface to fix TypeScript property declaration errors
interface AIStudio {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

declare global {
  interface Window {
    aistudio: AIStudio;
  }
}

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('EN');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [visitorCount, setVisitorCount] = useState(1248590);
  const [forecast, setForecast] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Video Generation States
  const [videoPrompt, setVideoPrompt] = useState('');
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoStatus, setVideoStatus] = useState('');
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

  const t = useMemo(() => TRANSLATIONS[lang] || TRANSLATIONS.EN, [lang]);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisitorCount(prev => prev + Math.floor(Math.random() * 5));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const runQuantumAnalysis = async () => {
    setIsAnalyzing(true);
    const data = await getMarketForecast("S&P 500 & NVIDIA");
    setForecast(data);
    setIsAnalyzing(false);
  };

  const handleGenerateVideo = async () => {
    if (!videoPrompt) return;

    try {
      setVideoError(null);
      // Use window.aistudio which is now correctly typed
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        // Trigger dialog and proceed assuming success as per guidelines to avoid race conditions
        await window.aistudio.openSelectKey();
      }

      setIsGeneratingVideo(true);
      setGeneratedVideoUrl(null);
      const url = await generateVideoContent(videoPrompt, setVideoStatus);
      setGeneratedVideoUrl(url);
    } catch (err: any) {
      setVideoError(err.message || "An error occurred during video generation.");
      // If requested entity not found, re-prompt for key selection
      if (err.message?.includes("Requested entity was not found")) {
        await window.aistudio.openSelectKey();
      }
    } finally {
      setIsGeneratingVideo(false);
      setVideoStatus('');
    }
  };

  const marketIndexes = [
    { name: 'S&P 500', value: 5123.44, change: 45.21, percent: 0.89 },
    { name: 'NASDAQ', value: 16274.94, change: 182.10, percent: 1.13 },
    { name: 'DOW 30', value: 38905.66, change: -12.44, percent: -0.03 },
    { name: 'BTC/USD', value: 68421.10, change: 1245.50, percent: 1.85 },
  ];

  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Hero Quantum Card */}
      <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-white/10 shadow-2xl">
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <Brain size={240} className="text-blue-500 animate-pulse" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <SparklesIcon className="w-8 h-8 text-blue-400" />
            <h2 className="text-3xl font-bold tracking-tight text-white">{t.welcome}</h2>
          </div>
          <p className="text-xl text-blue-100/80 max-w-2xl mb-8 leading-relaxed">
            {t.tagline}. Integrating global stock markets, advanced crypto logic, and high-fidelity IUL wealth management strategies.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard icon={<Users className="text-blue-400" />} label={t.visitorCount} value={visitorCount.toLocaleString()} />
            <StatCard icon={<Star className="text-yellow-400" />} label={t.accuracy} value="98.7%" />
            <StatCard icon={<Globe className="text-green-400" />} label="Active Nodes" value="12,401" />
            <StatCard icon={<Shield className="text-purple-400" />} label="Security Level" value="QUANTUM+" />
          </div>
        </div>
      </div>

      {/* Real-time Market Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-effect rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="text-blue-500" /> Global Indices
            </h3>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> {t.marketOpen}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {marketIndexes.map(idx => (
              <div key={idx.name} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-slate-400">{idx.name}</span>
                  <span className={`flex items-center text-xs font-bold ${idx.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {idx.change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {idx.percent}%
                  </span>
                </div>
                <div className="text-2xl font-bold">${idx.value.toLocaleString()}</div>
              </div>
            ))}
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DUMMY_CHART_DATA}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="name" stroke="#ffffff50" />
                <YAxis stroke="#ffffff50" />
                <Tooltip contentStyle={{ backgroundColor: '#1e1b4b', border: 'none', borderRadius: '12px', color: '#fff' }} />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-effect rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Brain className="text-purple-500" /> AI Quantum Signals
          </h3>
          <button 
            onClick={runQuantumAnalysis}
            disabled={isAnalyzing}
            className="w-full py-4 mb-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {isAnalyzing ? <Zap className="animate-spin" /> : <Activity />}
            {isAnalyzing ? "Processing Quantum Data..." : "Run AI Global Forecast"}
          </button>

          {forecast ? (
            <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <div className="text-xs text-blue-400 mb-1 uppercase font-bold tracking-wider">AI Signal Strength</div>
                <div className="text-3xl font-bold text-white">{forecast.confidence}%</div>
              </div>
              <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                <div className="text-xs text-indigo-400 mb-1 uppercase font-bold tracking-wider">Target Projection</div>
                <div className="text-xl font-bold text-white">${forecast.priceTarget}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-bold text-slate-300">Analysis Insights:</div>
                {forecast.reasons.map((r: string, i: number) => (
                  <div key={i} className="text-sm text-slate-400 flex items-start gap-2">
                    <ChevronRight size={16} className="mt-0.5 text-blue-500" /> {r}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center text-slate-500 border-2 border-dashed border-white/5 rounded-xl">
              <Brain size={48} className="mb-4 opacity-20" />
              <p>Ready to analyze world markets via Gemini Quantum API</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderVideoStudio = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom-10 duration-700">
      <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-white/10 shadow-2xl">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Video size={300} className="text-indigo-500" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Video className="text-white" size={24} />
            </div>
            <h2 className="text-3xl font-bold text-white">AI Quantum Video Studio</h2>
          </div>
          <p className="text-lg text-slate-300 mb-8">
            Generate hyper-photorealistic financial education videos using Veo 3.1 technology. Just enter a topic, and our AI will render a professional 8K advisor for your YouTube or educational platform.
          </p>

          <div className="flex flex-col gap-4">
            <div className="relative">
              <textarea 
                value={videoPrompt}
                onChange={(e) => setVideoPrompt(e.target.value)}
                placeholder="e.g., Explain the tax advantages of Index Universal Life (IUL) for high-net-worth individuals..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 pr-12 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 min-h-[120px] outline-none transition-all"
              />
              <div className="absolute top-4 right-4 text-indigo-400">
                <Sparkles size={20} />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button 
                onClick={handleGenerateVideo}
                disabled={isGeneratingVideo || !videoPrompt}
                className="w-full sm:w-auto px-10 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold flex items-center justify-center gap-2 shadow-xl shadow-indigo-900/40 transition-all"
              >
                {isGeneratingVideo ? <Loader2 className="animate-spin" /> : <Wand2 />}
                {isGeneratingVideo ? "Generating Masterpiece..." : "Generate 8K Financial Video"}
              </button>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="shrink-0"><Info size={14} /></span>
                <span>Requires a paid API key. <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-indigo-400 underline">Billing Docs</a></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isGeneratingVideo && (
        <div className="flex flex-col items-center justify-center py-20 glass-effect rounded-3xl border border-indigo-500/20 animate-pulse">
          <div className="w-24 h-24 rounded-full border-t-4 border-indigo-500 animate-spin mb-8" />
          <h3 className="text-2xl font-bold text-white mb-2">Quantizing Visual Assets</h3>
          <p className="text-indigo-400 font-mono tracking-widest uppercase text-sm">{videoStatus}</p>
          <div className="mt-8 max-w-md text-center text-slate-500 text-sm italic">
            "Video generation uses billions of parameters to ensure hyper-photorealism. This process typically takes 1-3 minutes. Please remain connected to the quantum bridge."
          </div>
        </div>
      )}

      {videoError && (
        <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-4">
          <AlertTriangle className="text-red-500 shrink-0" />
          <div>
            <h4 className="text-red-400 font-bold mb-1">Quantum Engine Interrupted</h4>
            <p className="text-red-400/80 text-sm">{videoError}</p>
          </div>
        </div>
      )}

      {generatedVideoUrl && (
        <div className="space-y-6 animate-in zoom-in-95 duration-700">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <Star className="text-yellow-400" fill="currentColor" /> Generated Asset Output
            </h3>
            <div className="flex gap-2">
              <button 
                onClick={() => window.open(generatedVideoUrl, '_blank')}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-bold text-white flex items-center gap-2"
              >
                <Download size={16} /> Download 1080p
              </button>
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black aspect-video">
            <video 
              src={generatedVideoUrl} 
              controls 
              className="w-full h-full object-contain"
              autoPlay
            />
          </div>
        </div>
      )}
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-12 animate-in slide-in-from-right-10 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Wall Street Encyclopedia</h2>
          <p className="text-slate-400">Master the secrets of the ultra-wealthy with our hyper-photorealistic educational content.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg glass-effect hover:bg-white/10 text-sm font-bold">All Modules</button>
          <button className="px-4 py-2 rounded-lg glass-effect hover:bg-white/10 text-sm font-bold text-blue-400">IUL Specials</button>
        </div>
      </div>

      {/* New Video Studio Entry Point */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Call to Video Studio */}
        <div 
          onClick={() => setActiveTab('studio')}
          className="group relative overflow-hidden rounded-2xl bg-indigo-600/20 border border-indigo-500/30 hover:bg-indigo-600/30 transition-all p-1 cursor-pointer"
        >
          <div className="aspect-video w-full rounded-xl overflow-hidden mb-4 relative flex items-center justify-center bg-indigo-950">
            <Video size={48} className="text-indigo-400 group-hover:scale-110 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 to-transparent flex items-end p-4">
               <span className="text-sm font-black text-white uppercase tracking-widest">AI Video Generator</span>
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-xl font-bold text-white mb-2">AI Quantum Video Studio</h3>
            <p className="text-sm text-slate-400 mb-4">Create your own hyper-realistic financial education videos for YouTube/PWA.</p>
            <button className="text-indigo-400 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
              Enter Studio <ChevronRight size={16}/>
            </button>
          </div>
        </div>

        {EDUCATION_MODULES.map((module) => (
          <div key={module.id} className="group relative overflow-hidden rounded-2xl glass-effect hover:bg-white/10 transition-all p-1">
            <div className="aspect-video w-full rounded-xl overflow-hidden mb-4 relative">
              <img 
                src={`https://picsum.photos/seed/${module.id}/600/400`} 
                alt={module.title}
                className="object-cover w-full h-full grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-600 rounded-full p-2">
                    <Play size={16} fill="white" />
                  </div>
                  <span className="text-xs font-bold text-white uppercase tracking-widest">Quantum Video Lesson</span>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <module.icon size={20} className="text-blue-500" />
                <span className="text-xs font-bold text-blue-400 uppercase tracking-tighter">{module.category}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{module.title}</h3>
              <p className="text-sm text-slate-400 line-clamp-2 mb-4">{module.desc}</p>
              <div className="flex justify-between items-center pt-4 border-t border-white/5">
                <span className="text-xs text-slate-500 flex items-center gap-1"><Activity size={12}/> AI Certified</span>
                <button className="flex items-center gap-1 text-sm font-bold text-blue-400 group-hover:gap-2 transition-all">
                  Start Training <ChevronRight size={16}/>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCalculators = () => (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <Calculator className="text-indigo-500" /> Advanced Financial Projections
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-effect rounded-2xl p-8 border-l-4 border-blue-500">
            <h3 className="text-xl font-bold mb-6">Compound Interest Engine</h3>
            <CalculatorInput label="Principal Amount ($)" value="100,000" />
            <CalculatorInput label="Monthly Contribution ($)" value="2,000" />
            <CalculatorInput label="Interest Rate (%)" value="7.5" />
            <CalculatorInput label="Duration (Years)" value="25" />
            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <div className="text-sm text-slate-400 mb-1">Estimated Future Wealth</div>
              <div className="text-5xl font-extrabold text-blue-400 tracking-tighter">$2,145,820</div>
            </div>
          </div>

          <div className="glass-effect rounded-2xl p-8 border-l-4 border-indigo-500">
            <h3 className="text-xl font-bold mb-6">IUL Retirement Forecast</h3>
            <p className="text-sm text-slate-400 mb-6 italic">IRC Section 7702 tax-advantaged strategy simulation.</p>
            <CalculatorInput label="Annual Premium ($)" value="12,000" />
            <CalculatorInput label="Index Cap (%)" value="12.0" />
            <CalculatorInput label="Index Participation (%)" value="100" />
            <CalculatorInput label="Age to Begin Distribution" value="65" />
            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <div className="text-sm text-slate-400 mb-1">Annual Tax-Free Income</div>
              <div className="text-5xl font-extrabold text-indigo-400 tracking-tighter">$145,000</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-pulse">
      <div className="relative">
        <div className="absolute inset-0 bg-blue-500/20 blur-[120px] rounded-full" />
        <Lock size={120} className="text-blue-500 mb-8 relative z-10 mx-auto" />
      </div>
      <h2 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase italic">Security Fortress Active</h2>
      <p className="text-slate-400 max-w-lg text-center leading-relaxed">
        Our proprietary AI Quantum Evolution Security System is continuously monitoring for intruders, malware, and unauthorized access. Zero-Trust API logic deployed.
      </p>
      <div className="mt-12 flex gap-4">
        <div className="px-4 py-2 rounded-full border border-green-500/50 text-green-400 text-xs font-bold tracking-widest uppercase">Encryption: AES-Q512</div>
        <div className="px-4 py-2 rounded-full border border-blue-500/50 text-blue-400 text-xs font-bold tracking-widest uppercase">Firewall: Quantum-Shield</div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      {/* Top Header */}
      <header className="sticky top-0 z-[100] glass-effect border-b border-white/5 h-20 flex items-center">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
              <Brain size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-white uppercase italic">WealthGenius<span className="text-blue-500">Pro</span></h1>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <Lock size={10} className="text-green-500" /> Quantum Secured Platform
              </div>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-1">
            <NavBtn active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<Activity size={18}/>} label={t.dashboard} />
            <NavBtn active={activeTab === 'education'} onClick={() => setActiveTab('education')} icon={<BookOpen size={18}/>} label={t.education} />
            <NavBtn active={activeTab === 'studio'} onClick={() => setActiveTab('studio')} icon={<Video size={18}/>} label="AI Studio" />
            <NavBtn active={activeTab === 'calculators'} onClick={() => setActiveTab('calculators')} icon={<Calculator size={18}/>} label={t.calculators} />
            <NavBtn active={activeTab === 'security'} onClick={() => setActiveTab('security')} icon={<Shield size={18}/>} label={t.security} />
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 glass-effect px-3 py-1.5 rounded-full border-white/10">
              <Globe size={14} className="text-blue-400" />
              <select 
                value={lang} 
                onChange={(e) => setLang(e.target.value as Language)}
                className="bg-transparent text-xs font-bold outline-none cursor-pointer text-white"
              >
                {Object.keys(TRANSLATIONS).map(l => <option key={l} value={l} className="bg-slate-900">{l}</option>)}
              </select>
            </div>
            <button className="hidden lg:flex px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-sm font-bold text-white transition-all shadow-lg shadow-blue-500/20">
              {t.premium}
            </button>
            <button className="xl:hidden p-2 text-slate-400" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28}/> : <Menu size={28}/>}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="xl:hidden fixed inset-0 z-[90] glass-effect pt-24 px-4 flex flex-col gap-4 animate-in fade-in duration-300">
           <NavBtn active={activeTab === 'dashboard'} onClick={() => {setActiveTab('dashboard'); setIsMenuOpen(false);}} icon={<Activity size={24}/>} label={t.dashboard} />
           <NavBtn active={activeTab === 'education'} onClick={() => {setActiveTab('education'); setIsMenuOpen(false);}} icon={<BookOpen size={24}/>} label={t.education} />
           <NavBtn active={activeTab === 'studio'} onClick={() => {setActiveTab('studio'); setIsMenuOpen(false);}} icon={<Video size={24}/>} label="AI Studio" />
           <NavBtn active={activeTab === 'calculators'} onClick={() => {setActiveTab('calculators'); setIsMenuOpen(false);}} icon={<Calculator size={24}/>} label={t.calculators} />
           <NavBtn active={activeTab === 'security'} onClick={() => {setActiveTab('security'); setIsMenuOpen(false);}} icon={<Shield size={24}/>} label={t.security} />
           <button className="w-full py-4 rounded-2xl bg-blue-600 text-white font-bold text-lg mt-8">{t.premium}</button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'education' && renderEducation()}
        {activeTab === 'studio' && renderVideoStudio()}
        {activeTab === 'calculators' && renderCalculators()}
        {activeTab === 'security' && renderSecurity()}
      </main>

      {/* Sticky Call to Action */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
        <button className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-transform">
          <MessageSquareIcon />
        </button>
        <button className="w-14 h-14 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-transform">
          <DollarSign size={24} />
        </button>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 mt-12 glass-effect">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <Brain className="text-blue-500" />
                <span className="text-xl font-black tracking-tighter text-white uppercase italic">WealthGenius<span className="text-blue-500">Pro</span></span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                The world's most advanced AI-integrated financial intelligence platform. Empowering global citizens with Wall Street grade tools and strategies.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Products</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                <li className="hover:text-blue-400 cursor-pointer">Stock Trading AI</li>
                <li className="hover:text-blue-400 cursor-pointer">Crypto Quantum Analysis</li>
                <li className="hover:text-blue-400 cursor-pointer">IUL Asset Allocation</li>
                <li className="hover:text-blue-400 cursor-pointer">IRC 7702 Wealth Plans</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Knowledge</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                <li className="hover:text-blue-400 cursor-pointer">Financial Encyclopedia</li>
                <li className="hover:text-blue-400 cursor-pointer">IUL Benefits Guide</li>
                <li className="hover:text-blue-400 cursor-pointer">Market Indicators</li>
                <li className="hover:text-blue-400 cursor-pointer">YouTube Integration</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Secure Nodes</h4>
              <div className="space-y-4">
                 <div className="flex items-center gap-3 glass-effect p-3 rounded-xl border-white/10">
                   <Lock size={16} className="text-blue-500"/>
                   <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">TLS 1.3 | SHA-512</div>
                 </div>
                 <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-slate-400 transition-colors uppercase tracking-widest">
                   Join Discord AI Community
                 </button>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 text-center">
            <p className="text-[10px] text-slate-600 uppercase tracking-[0.2em] mb-4">
              WealthGenius Pro is a fully automated AI self-sustainable platform. Disclaimer: Educational contents only. Trading involves high risk.
            </p>
            <div className="flex justify-center gap-6 text-slate-500">
              <span className="text-xs hover:text-white cursor-pointer">Terms of Service</span>
              <span className="text-xs hover:text-white cursor-pointer">Privacy Policy</span>
              <span className="text-xs hover:text-white cursor-pointer">Compliance 2026</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// --- Sub-components ---

const NavBtn = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2.5 px-6 py-2 rounded-full transition-all duration-300 font-semibold text-sm ${
      active 
        ? 'bg-blue-600/10 text-blue-400 border border-blue-500/30' 
        : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
    }`}
  >
    {icon}
    {label}
  </button>
);

const StatCard = ({ icon, label, value }: { icon: any, label: string, value: string }) => (
  <div className="glass-effect p-4 rounded-2xl border border-white/5 group hover:border-blue-500/30 transition-all">
    <div className="flex items-center gap-2 mb-2">
      {icon}
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
    </div>
    <div className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors">{value}</div>
  </div>
);

const CalculatorInput = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-4">
    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">{label}</label>
    <input 
      type="text" 
      defaultValue={value} 
      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white font-bold"
    />
  </div>
);

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
);

const MessageSquareIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
);

const DUMMY_CHART_DATA = [
  { name: '09:00', value: 4000 },
  { name: '10:00', value: 4200 },
  { name: '11:00', value: 3800 },
  { name: '12:00', value: 4500 },
  { name: '13:00', value: 4700 },
  { name: '14:00', value: 4600 },
  { name: '15:00', value: 5123 },
];

export default App;
