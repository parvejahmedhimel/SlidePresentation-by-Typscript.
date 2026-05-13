/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { InlineMath, BlockMath } from 'react-katex';
import { 
  Flame, 
  Droplets, 
  Wind, 
  History, 
  BookOpen, 
  BrainCircuit, 
  Maximize2, 
  Minimize2, 
  ChevronRight, 
  ChevronDown, 
  Info,
  Clock,
  Zap,
  Factory,
  Car,
  Plane,
  Truck,
  CookingPot,
  Lightbulb,
  MapPin,
  FileUp,
  Settings,
  X,
  ClipboardCheck,
  Clipboard,
  Palette,
  Type
} from "lucide-react";

// --- THEMES ---
const THEMES = [
  { id: 'industrial', name: 'Industrial Amber', primary: '#ff8c00', secondary: '#c05c00', bgDark: '#1a0a00', accent: '#ffb347', glass: 'rgba(0,0,0,0.2)' },
  { id: 'midnight', name: 'Midnight Ocean', primary: '#0ea5e9', secondary: '#0369a1', bgDark: '#020617', accent: '#7dd3fc', glass: 'rgba(255,255,255,0.05)' },
  { id: 'forest', name: 'Emerald Forest', primary: '#10b981', secondary: '#047857', bgDark: '#064e3b', accent: '#6ee7b7', glass: 'rgba(0,0,0,0.3)' },
  { id: 'cyber', name: 'Cyberpunk Neon', primary: '#f472b6', secondary: '#db2777', bgDark: '#111827', accent: '#22d3ee', glass: 'rgba(17,24,39,0.8)' },
  { id: 'vintage', name: 'Sepia History', primary: '#b45309', secondary: '#92400e', bgDark: '#2d241e', accent: '#fcd34d', glass: 'rgba(45,36,30,0.5)' },
  { id: 'crimson', name: 'Crimson Lab', primary: '#ef4444', secondary: '#b91c1c', bgDark: '#1a1110', accent: '#fca5a5', glass: 'rgba(0,0,0,0.4)' },
  { id: 'royal', name: 'Royal Gold', primary: '#fbbf24', secondary: '#d97706', bgDark: '#1e1b1e', accent: '#fef3c7', glass: 'rgba(0,0,0,0.3)' },
  { id: 'amethyst', name: 'Deep Amethyst', primary: '#a855f7', secondary: '#7e22ce', bgDark: '#1e1a2d', accent: '#d8b4fe', glass: 'rgba(0,0,0,0.2)' },
  { id: 'slate', name: 'Modern Slate', primary: '#64748b', secondary: '#475569', bgDark: '#0f172a', accent: '#cbd5e1', glass: 'rgba(255,255,255,0.03)' },
  { id: 'lava', name: 'Volcanic Lava', primary: '#f97316', secondary: '#c2410c', bgDark: '#0c0a09', accent: '#fdba74', glass: 'rgba(0,0,0,0.5)' },
  { id: 'arctic', name: 'Arctic Frost', primary: '#38bdf8', secondary: '#0284c7', bgDark: '#0f172a', accent: '#e0f2fe', glass: 'rgba(15,23,42,0.6)' },
  { id: 'dark-matter', name: 'Dark Matter', primary: '#ffffff', secondary: '#94a3b8', bgDark: '#000000', accent: '#334155', glass: 'rgba(255,255,255,0.05)' },
  { id: 'solar', name: 'Solar Energy', primary: '#facc15', secondary: '#ca8a04', bgDark: '#422006', accent: '#fef08a', glass: 'rgba(66,32,6,0.6)' },
  { id: 'neon-city', name: 'Neon City', primary: '#22d3ee', secondary: '#0891b2', bgDark: '#020617', accent: '#818cf8', glass: 'rgba(30,41,59,0.7)' },
  { id: 'rose', name: 'Rose Garden', primary: '#fb7185', secondary: '#e11d48', bgDark: '#4c0519', accent: '#fecdd3', glass: 'rgba(76,5,25,0.5)' },
];

const FONTS = [
  { id: 'sans', name: 'Hind Siliguri (Sans)', family: 'var(--font-sans)' },
  { id: 'serif', name: 'Tiro Bangla (Serif)', family: 'var(--font-serif)' },
  { id: 'galada', name: 'Galada (Stylized)', family: 'var(--font-galada)' },
  { id: 'mina', name: 'Mina (Modern)', family: 'var(--font-mina)' },
];

// --- DATA ---
interface FormationStep {
  icon: string;
  text: string;
}

interface FormationResult {
  name: string;
  type: string;
  source: string;
  color: string;
}

interface NaturalGasItem {
  name: string;
  pct: string;
  color: string;
  formula: string;
}

interface Fraction {
  id: string;
  name: string;
  range: string;
  carbon: string;
  pct: string;
  use: string;
  color: string;
  storyKey: string;
  iconType?: string; // To help map icons in imported data
}

interface StoryItem {
  time: string;
  scene: string;
  fuel: string;
  detail: string;
  key: string;
  iconType?: string;
}

interface AppData {
  formation: {
    steps: FormationStep[];
    result: FormationResult[];
  };
  naturalGas: NaturalGasItem[];
  fractions: Fraction[];
  fullStory: StoryItem[];
}

// --- CONSTANTS & HELPERS ---
const iconMap: Record<string, React.ReactNode> = {
  CookingPot: <CookingPot />,
  Car: <Car />,
  Factory: <Factory />,
  Plane: <Plane />,
  Truck: <Truck />,
  Lightbulb: <Lightbulb />,
  MapPin: <MapPin />,
};

const DEFAULT_DATA: AppData = {
  formation: {
    steps: [
      { icon: "🌿", text: "কোটি বছর আগে — গাছ, শৈবাল, ছোট প্রাণী মারা যায়" },
      { icon: "🪨", text: "মাটিচাপা পড়ে, আরও মাটি জমে" },
      { icon: "🔥", text: "তাপ + চাপ + বায়ুহীনতা → রাসায়নিক পরিবর্তন" },
      { icon: "⛽", text: "শত শত মিলিয়ন বছর পরে → জীবাম্ম জ্বালানি তৈরি" },
    ],
    result: [
      { name: "কয়লা", type: "🪨", source: "বড় গাছ", color: "bg-gray-800" },
      { name: "পেট্রোলিয়াম", type: "🛢️", source: "ছোট প্রাণী", color: "bg-amber-900" },
      { name: "প্রাকৃতিক গ্যাস", type: "💨", source: "পেট্রোলিয়াম", color: "bg-blue-900" },
    ],
  },
  naturalGas: [
    { name: "মিথেন", pct: "93–98%", color: "#4ade80", formula: "CH_4" },
    { name: "ইথেন", pct: "0.2–3.9%", color: "#60a5fa", formula: "C_2H_6" },
    { name: "প্রোপেন", pct: "0.05–1.2%", color: "#f472b6", formula: "C_3H_8" },
    { name: "বিউটেন", pct: "0.1–0.72%", color: "#fb923c", formula: "C_4H_{10}" },
    { name: "পেন্টেন", pct: "1.2%", color: "#a78bfa", formula: "C_5H_{12}" },
  ],
  fractions: [
    { id: "gas", name: "পেট্রোলিয়াম গ্যাস", range: "0–20°C", carbon: "C_1–C_4", pct: "2%", use: "LPG — রান্না", color: "#86efac", storyKey: "gas", iconType: "CookingPot" },
    { id: "petrol", name: "পেট্রোল (গ্যাসোলিন)", range: "21–70°C", carbon: "C_5–C_{10}", pct: "5%", use: "গাড়ির ইঞ্জিন", color: "#fde68a", storyKey: "petrol", iconType: "Car" },
    { id: "naphtha", name: "ন্যাপথা", range: "71–120°C", carbon: "C_7–C_{14}", pct: "10%", use: "রাসায়নিক শিল্প", color: "#fed7aa", storyKey: "naphtha", iconType: "Factory" },
    { id: "kerosene", name: "কেরোসিন", range: "121–170°C", carbon: "C_{11}–C_{16}", pct: "13%", use: "জেট ইঞ্জিন / হারিকেন", color: "#fca5a5", storyKey: "kerosene", iconType: "Plane" },
    { id: "diesel", name: "ডিজেল", range: "171–270°C", carbon: "C_{17}–C_{20}", pct: "—", use: "ট্রাক / বাস", color: "#c4b5fd", storyKey: "diesel", iconType: "Truck" },
    { id: "paraffin", name: "প্যারাফিন মোম", range: "271–340°C", carbon: "C_{20}–C_{30}", pct: "—", use: "মোমবাতি / ভ্যাসলিন", color: "#a5f3fc", storyKey: "paraffin", iconType: "Lightbulb" },
    { id: "pitch", name: "পিচ (বিটুমিন)", range: "340°C+", carbon: "C_{30+}", pct: "—", use: "রাস্তা তৈরি", color: "#94a3b8", storyKey: "pitch", iconType: "MapPin" },
  ],
  fullStory: [
    { time: "ভোর ৬:০০", scene: "মা রান্না করছেন", fuel: "LPG গ্যাস", detail: "চুলায় নীল আগুন জ্বলে — এটা পেট্রোলিয়াম গ্যাস (0–20°C, C₁–C₄)", key: "gas", iconType: "CookingPot" },
    { time: "সকাল ৭:৩০", scene: "বাবার গাড়ি", fuel: "পেট্রোল", detail: "ইঞ্জিন গুনগুন করে — পেট্রোল (21–70°C, C₅–C₁০) পুড়ে শক্তি দেয়", key: "petrol", iconType: "Car" },
    { time: "সকাল ৮:১৫", scene: "স্কুলবাস", fuel: "ডিজেল", detail: "ধোঁয়া উড়িয়ে বাস আসে — ডিজেল (171–270°C, C₁₇–C₂০)", key: "diesel", iconType: "Truck" },
    { time: "সকাল ৯:০০", scene: "আকাশে বিমান", fuel: "কেরোসিন", detail: "মেঘ ছিঁড়ে বিমান উড়ে — কেরোসিন (121–170°C, C₁১–C₁৬)", key: "kerosene", iconType: "Plane" },
    { time: "দুপুর ১:৩০", scene: "কারখানা দেখা", fuel: "ন্যাপথা", detail: "প্লাস্টিক-রং বানায় — ন্যাপথা (71–120°C, C₇–C₁৪)", key: "naphtha", iconType: "Factory" },
    { time: "সন্ধ্যা ৬:৩০", scene: "লোডশেডিং", fuel: "মোমবাতি", detail: "মোম গলে আলো দেয় — প্যারাফিন (271–340°C, C₂০–C₃০)", key: "paraffin", iconType: "Lightbulb" },
    { time: "রাত ৮:০০", scene: "রাস্তা দেখলো", fuel: "পিচ (বিটুমিন)", detail: "কালো মসৃণ রাস্তা — পিচ (340°C+, C₃০+)", key: "pitch", iconType: "MapPin" },
  ],
};

const getIcon = (type?: string) => iconMap[type || ""] || <Zap />;

// --- COMPONENTS ---

export default function App() {
  const [data, setData] = useState<AppData>(DEFAULT_DATA);
  const [activeTab, setActiveTab] = useState("flowchart");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [selectedFraction, setSelectedFraction] = useState<string | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(THEMES[0]);
  const [currentFont, setCurrentFont] = useState(FONTS[0]);

  // Advanced Design States
  const [customPrimary, setCustomPrimary] = useState(THEMES[0].primary);
  const [glassStrength, setGlassStrength] = useState(0.2);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const [jsonInput, setJsonInput] = useState("");
  const [importStatus, setImportStatus] = useState<{ type: 'error' | 'success', message: string } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const primary = customPrimary || currentTheme.primary;
    root.style.setProperty('--primary', primary);
    root.style.setProperty('--secondary', currentTheme.secondary);
    root.style.setProperty('--bg-dark', isDarkMode ? currentTheme.bgDark : '#f8fafc');
    root.style.setProperty('--accent', currentTheme.accent);
    root.style.setProperty('--glass-bg', `rgba(${isDarkMode ? '0,0,0' : '255,255,255'}, ${glassStrength})`);
    root.style.setProperty('--font-active', currentFont.family);
    root.style.setProperty('--text-base', isDarkMode ? '#ffffff' : '#0f172a');
  }, [currentTheme, currentFont, customPrimary, glassStrength, isDarkMode]);

  // Update custom primary when theme changes
  const selectTheme = (theme: typeof THEMES[0]) => {
    setCurrentTheme(theme);
    setCustomPrimary(theme.primary);
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {
        setIsFullScreen(!isFullScreen);
      });
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const handleImport = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      // Basic validation
      if (!parsed.formation || !parsed.fractions || !parsed.fullStory) {
        throw new Error("Invalid format. Root fields missing.");
      }
      setData(parsed);
      setImportStatus({ type: 'success', message: 'Data imported successfully!' });
      setTimeout(() => {
        setShowImportModal(false);
        setImportStatus(null);
        setJsonInput("");
      }, 1500);
    } catch (err) {
      setImportStatus({ type: 'error', message: err instanceof Error ? err.message : 'Invalid JSON' });
    }
  };

  const copyTemplate = () => {
    navigator.clipboard.writeText(JSON.stringify(DEFAULT_DATA, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonInput(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className={`min-h-screen transition-all duration-500 industrial-grid ${isFullScreen ? 'p-0' : 'p-2 md:p-6'}`}>
      
      {/* Import Modal */}
      <AnimatePresence>
        {showImportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowImportModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-panel w-full max-w-2xl p-6 relative z-10 border-fuel-primary/50 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <FileUp className="text-fuel-primary" />
                  IMPORT DATA SYSTEM
                </h2>
                <button onClick={() => setShowImportModal(false)} className="text-white/40 hover:text-white">
                  <X />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <button 
                    onClick={copyTemplate}
                    className="flex-1 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-sm font-bold"
                  >
                    {copied ? <ClipboardCheck className="text-emerald-400" /> : <Clipboard className="text-fuel-accent" />}
                    {copied ? 'COPIED!' : 'COPY TEMPLATE JSON'}
                  </button>
                  <label className="flex-1 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-sm font-bold cursor-pointer">
                    <FileUp className="text-fuel-accent" />
                    UPLOAD FILE
                    <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>

                <div className="relative">
                  <textarea
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    placeholder="Paste JSON data here..."
                    className="w-full h-64 bg-black/50 border border-white/10 rounded-xl p-4 font-mono text-sm text-[#f5e6d0] focus:border-fuel-primary outline-none no-scrollbar"
                  />
                  {importStatus && (
                    <div className={`mt-2 p-3 rounded-lg text-sm font-bold ${importStatus.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      {importStatus.message}
                    </div>
                  )}
                </div>

                <button 
                  onClick={handleImport}
                  className="w-full p-4 bg-fuel-primary hover:bg-fuel-secondary text-white font-black rounded-xl transition-all shadow-[0_0_20px_rgba(255,140,0,0.3)]"
                >
                  PROCESS & APPLY DATA
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Theme Modal */}
      <AnimatePresence>
        {showThemeModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowThemeModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-panel w-full max-w-3xl p-6 relative z-10 border-fuel-primary/50 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <Palette className="text-fuel-primary" />
                  DESIGN CENTER
                </h2>
                <button onClick={() => setShowThemeModal(false)} className="text-white/40 hover:text-white">
                  <X />
                </button>
              </div>

              <div className="space-y-8">
                {/* Font Selection */}
                <div>
                  <h3 className="text-xs uppercase tracking-[0.2em] font-black text-fuel-accent mb-4 flex items-center gap-2">
                    <Type className="w-4 h-4" /> Selected Font Family
                  </h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {FONTS.map(font => (
                      <button
                        key={font.id}
                        onClick={() => setCurrentFont(font)}
                        style={{ fontFamily: font.family }}
                        className={`p-4 rounded-xl border-2 transition-all text-sm ${currentFont.id === font.id ? 'border-fuel-primary bg-fuel-primary/20 text-white' : 'border-white/10 bg-white/5 text-white/60 hover:border-white/30'}`}
                      >
                        {font.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Theme Selection */}
                <div>
                  <h3 className="text-xs uppercase tracking-[0.2em] font-black text-fuel-accent mb-4">Color Palettes (Templates)</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {THEMES.map(theme => (
                      <button
                        key={theme.id}
                        onClick={() => selectTheme(theme)}
                        className={`group relative p-2 rounded-2xl border-2 transition-all ${currentTheme.id === theme.id ? 'border-fuel-primary scale-105' : 'border-white/10 grayscale hover:grayscale-0'}`}
                      >
                        <div 
                          className="theme-preview-box overflow-hidden relative" 
                          style={{ backgroundColor: theme.bgDark }}
                        >
                          <div className="absolute inset-x-0 top-0 h-1/4" style={{ backgroundColor: theme.primary }} />
                          <div className="absolute left-0 top-1/4 w-1/3 h-1/2" style={{ backgroundColor: theme.secondary }} />
                          <div className="absolute right-2 bottom-2 w-4 h-4 rounded-full" style={{ backgroundColor: theme.accent }} />
                        </div>
                        <p className={`mt-2 text-[10px] font-black uppercase text-center ${currentTheme.id === theme.id ? 'text-fuel-primary' : 'text-white/40'}`}>
                          {theme.name}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Advanced Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 border-t border-white/5">
                  <div>
                    <h3 className="text-xs uppercase tracking-[0.2em] font-black text-fuel-accent mb-4">Custom Primary Color</h3>
                    <div className="flex items-center gap-4">
                      <input 
                        type="color" 
                        value={customPrimary}
                        onChange={(e) => setCustomPrimary(e.target.value)}
                        className="w-12 h-12 rounded-lg bg-transparent cursor-pointer border-none"
                      />
                      <span className="font-mono text-sm uppercase opacity-60">{customPrimary}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xs uppercase tracking-[0.2em] font-black text-fuel-accent mb-4">Glass Panel Transparency</h3>
                    <div className="px-2">
                       <input 
                         type="range" min="0" max="0.8" step="0.05"
                         value={glassStrength}
                         onChange={(e) => setGlassStrength(parseFloat(e.target.value))}
                         className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-fuel-primary"
                       />
                       <div className="flex justify-between mt-2 font-mono text-[10px] opacity-40">
                         <span>CLEAR</span>
                         <span>Opaque ({Math.round(glassStrength * 100)}%)</span>
                       </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs uppercase tracking-[0.2em] font-black text-fuel-accent mb-4">Visual Mode</h3>
                    <button 
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      className="w-full p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-3 text-sm font-bold"
                    >
                      {isDarkMode ? '🌙 DARK MODE' : '☀️ LIGHT MODE'}
                    </button>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowThemeModal(false)}
                className="w-full mt-8 p-4 bg-fuel-primary text-white font-black rounded-xl"
              >
                SAVE CUSTOMIZATION
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className={`max-w-7xl mx-auto flex flex-col gap-6 ${isFullScreen ? 'h-screen' : ''}`} style={{ fontFamily: currentFont.family }}>
        
        {/* Top Header */}
        <header className="glass-panel p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 border-b-2 border-fuel-primary/30">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-fuel-primary/20 rounded-xl border border-fuel-primary/50">
              <Flame className="text-fuel-primary w-8 h-8 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                FUEL <span className="text-fuel-primary italic">EXPLORER</span>
              </h1>
              <p className="text-xs uppercase tracking-widest text-fuel-accent font-mono opacity-80">Chemistry Series • Chapter 11.1</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowThemeModal(true)}
              className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10 flex items-center gap-2 text-sm font-medium"
              title="Design Center"
            >
              <Palette className="w-4 h-4 text-fuel-accent" />
            </button>
            <button 
              onClick={() => setShowImportModal(true)}
              className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10 flex items-center gap-2 text-sm font-medium"
            >
              <FileUp className="w-4 h-4 text-fuel-accent" />
              <span className="hidden sm:inline">Import</span>
            </button>
            <div className="w-[1px] h-8 bg-white/10 mx-2 hidden sm:block"></div>
            <nav className="flex bg-black/40 rounded-lg p-1 border border-white/5">
              {[
                { id: "flowchart", icon: <Factory className="w-4 h-4" /> },
                { id: "story", icon: <BookOpen className="w-4 h-4" /> },
                { id: "quiz", icon: <BrainCircuit className="w-4 h-4" /> }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`p-2 px-4 rounded-md transition-all flex items-center gap-2 text-sm font-bold ${
                    activeTab === tab.id 
                    ? 'bg-fuel-primary text-white shadow-lg' 
                    : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                  }`}
                >
                  {tab.icon}
                  <span className="capitalize hidden lg:inline">{tab.id === 'flowchart' ? '📊 পর্যবেক্ষণ' : tab.id === 'story' ? '📖 জীবনগাথা' : '🧠 কুইজ জোন'}</span>
                </button>
              ))}
            </nav>
            <button 
              onClick={toggleFullScreen}
              className="ml-2 p-2.5 rounded-lg bg-fuel-primary/10 hover:bg-fuel-primary/20 transition-all border border-fuel-primary/30 text-fuel-primary shadow-[0_0_15px_rgba(255,140,0,0.1)]"
            >
              {isFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
          
          <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === "flowchart" && (
                  <div className="flex flex-col gap-6">
                    {/* Formation Section */}
                    <section className="glass-panel p-6 overflow-hidden relative">
                      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <History className="w-32 h-32" />
                      </div>
                      <h2 className="text-xl font-bold mb-6 text-fuel-accent flex items-center gap-2 border-b border-white/10 pb-4">
                        <History className="w-5 h-5" />
                        উৎপত্তি ও বিবর্তন
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {data.formation.steps.map((step, i) => (
                          <div key={i} className="relative">
                            <motion.div 
                              whileHover={{ y: -5 }}
                              className="group bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col items-center text-center gap-3 relative z-10 hover:border-fuel-primary/50 transition-all"
                            >
                              <span className="text-4xl filter drop-shadow-md group-hover:scale-110 transition-transform">{step.icon}</span>
                              <p className="text-sm font-medium leading-relaxed">{step.text}</p>
                            </motion.div>
                            {i < data.formation.steps.length - 1 && (
                              <div className="hidden md:flex absolute top-1/2 -right-4 -translate-y-1/2 z-0">
                                <ChevronRight className="text-fuel-primary/30 w-8 h-8" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="mt-8 flex flex-wrap justify-center gap-3">
                         {data.formation.result.map((res, i) => (
                           <div key={i} className={`flex items-center gap-3 px-6 py-3 rounded-2xl border border-white/10 ${res.color} bg-opacity-30 backdrop-blur-sm group hover:scale-105 transition-all cursor-default`}>
                             <span className="text-2xl group-hover:rotate-12 transition-transform">{res.type}</span>
                             <div className="text-left leading-none">
                               <p className="font-black text-white">{res.name}</p>
                               <p className="text-[10px] uppercase tracking-tighter opacity-70">Source: {res.source}</p>
                             </div>
                           </div>
                         ))}
                      </div>
                    </section>

                    {/* Natural Gas Stats */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="glass-panel p-6 border-l-4 border-emerald-500">
                        <h2 className="text-xl font-bold mb-6 text-emerald-400 flex items-center gap-2">
                          <Wind className="w-5 h-5" />
                          প্রাকৃতিক গ্যাস (বাংলাদেশ)
                        </h2>
                        <div className="space-y-4">
                          {data.naturalGas.map((item, i) => (
                            <div key={i} className="group">
                              <div className="flex justify-between items-end mb-1 px-1">
                                <span className="font-mono text-xs font-bold text-emerald-300/70"><InlineMath math={item.formula}/></span>
                                <span className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{item.name}</span>
                                <span className="text-xs font-black text-emerald-400">{item.pct}</span>
                              </div>
                              <div className="h-2.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: parseInt(item.pct.replace('%', '')) + '%' }}
                                  transition={{ duration: 1, delay: i * 0.1 }}
                                  className="h-full rounded-full shadow-[0_0_10px_rgba(74,222,128,0.3)]"
                                  style={{ backgroundColor: item.color }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-100 leading-relaxed italic">
                          <Info className="w-4 h-4 mb-2 opacity-50" />
                          বাংলাদেশে পাওয়া প্রাকৃতিক গ্যাসে মিথেনের আধিক্য (৯৩-৯৮%) একে অন্যতম পরিবেশবান্ধব জ্বালানি হিসেবে স্বীকৃতি দিয়েছে।
                        </div>
                      </div>

                      <div className="glass-panel p-6 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-fuel-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <h2 className="text-xl font-bold mb-4 text-fuel-accent flex items-center gap-2">
                          <Droplets className="w-5 h-5" />
                          বিশেষ তথ্যকণিকা
                        </h2>
                        <div className="space-y-4 relative z-10">
                          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-fuel-primary/30 transition-all">
                            <h3 className="font-black text-fuel-primary mb-1 text-sm uppercase italic">হরিপুর গ্যাসক্ষেত্র</h3>
                            <p className="text-sm leading-relaxed opacity-80">বাংলাদেশের একমাত্র ক্ষেত্র যেখানে একই সাথে প্রাকৃতিক গ্যাস ও পেট্রোলিয়াম পাওয়া গেছে।</p>
                          </div>
                          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-fuel-primary/30 transition-all">
                            <h3 className="font-black text-fuel-primary mb-1 text-sm uppercase italic">উপাদানের হার</h3>
                            <p className="text-sm leading-relaxed opacity-80">পেট্রোলিয়াম কুপ থেকে যে প্রোপেন ও বিউটেন পাওয়া যায়, তা তরল করে সিলিন্ডারে ভরে LPG হিসেবে বিক্রি হয়।</p>
                          </div>
                          <div className="flex justify-center pt-4">
                             <div className="animate-bounce">
                               <ChevronDown className="text-fuel-primary w-6 h-6" />
                             </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                )}

                {activeTab === "story" && (
                  <div className="flex flex-col gap-6">
                    <section className="glass-panel p-8 text-center bg-gradient-to-br from-fuel-secondary/20 to-transparent">
                      <div className="w-20 h-20 bg-fuel-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-fuel-primary/50 shadow-inner">
                        <BookOpen className="text-fuel-primary w-10 h-10" />
                      </div>
                      <h2 className="text-3xl font-black text-white mb-2 tracking-tighter">রাজুর এক দিন</h2>
                      <p className="text-fuel-accent/70 max-w-lg mx-auto leading-relaxed">
                        রাজুর সাধারণ পদক্ষেপে কীভাবে মিশে আছে আমাদের ভূগর্ভস্থ সম্পদের বিচিত্র ব্যবহার? চলুন দেখে আসি এক বিস্ময়কর সফর।
                      </p>
                    </section>

                    <div className="space-y-6 relative ml-4 md:ml-0">
                      <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-fuel-primary via-fuel-secondary to-transparent opacity-20" />
                      
                      {data.fullStory.map((item, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          className={`flex flex-col md:flex-row items-center gap-8 ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
                        >
                          <div className={`flex-1 text-right w-full ${i % 2 !== 0 ? 'md:text-left' : 'md:text-right'}`}>
                             <div className="glass-panel p-6 hover:border-fuel-primary/50 transition-all cursor-default group">
                               <div className="flex items-center gap-3 mb-2 justify-end group-even:justify-start">
                                 <span className="text-xs font-mono text-fuel-accent bg-fuel-primary/10 px-2 py-1 rounded ring-1 ring-fuel-primary/30">{item.time}</span>
                                 <h3 className="font-black text-lg text-white">{item.scene}</h3>
                               </div>
                               <p className="text-sm text-white/70 leading-relaxed">{item.detail}</p>
                               <div className="mt-4 flex flex-wrap gap-2 justify-end group-even:justify-start">
                                  <span className="text-[10px] uppercase font-black bg-white/5 px-2 py-1 rounded-md text-fuel-primary border border-white/5">{item.fuel}</span>
                               </div>
                             </div>
                          </div>
                          
                          <div className="relative z-10">
                            <div className="w-12 h-12 rounded-full bg-fuel-dark border-4 border-fuel-primary flex items-center justify-center text-fuel-primary shadow-[0_0_20px_rgba(255,140,0,0.4)]">
                              {getIcon(item.iconType)}
                            </div>
                          </div>

                          <div className="flex-1 hidden md:block" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "quiz" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { 
                        title: "কার্বন সংখ্যা মনে রাখার মন্ত্র", 
                        icon: <BrainCircuit className="text-blue-400" />,
                        mantra: "গেস পেন কেডিপ্যারা", 
                        details: "গ্যাস (C1-4) > পেট্রোল (C5-10) > ন্যাপথা (C7-14) > কেরোসিন (C11-16) > ডিজেল (C17-20) > প্যারাফিন (C20-30) > পিচ (C30+)",
                        color: "border-blue-500/50"
                      },
                      { 
                        title: "তাপমাত্রা গ্রাফ", 
                        icon: <Clock className="text-orange-400" />,
                        mantra: "শীতল থেকে উষ্ণ", 
                        details: "০ > ২০ > ৭০ > ১২০ > ১৭০ > ২৭০ > ৩৪০°C। যত নিচে যাবে তাপ ও কার্বন দুটিই বাড়বে।",
                        color: "border-orange-500/50"
                      },
                      { 
                        title: "LPG এর রহস্য", 
                        icon: <CookingPot className="text-emerald-400" />,
                        mantra: "চাপ = তরল", 
                        details: "পেট্রোলিয়াম গ্যাসকে (C1-C4) উচ্চ চাপে তরল করার ফলেই তা রান্নার কাজে ব্যবহারের উপযোগী হয়।",
                        color: "border-emerald-500/50"
                      },
                      { 
                        title: "বিটুমিন/পিচ", 
                        icon: <MapPin className="text-slate-400" />,
                        mantra: "শেষ অবশেষ", 
                        details: "সব উপাদান কুপি থেকে বের হয়ে যাওয়ার পর যা থাকে তা হলো কালো বিটুমিন, কার্বন এখানে সবচাইতে বেশি।",
                        color: "border-slate-500/50"
                      }
                    ].map((card, i) => (
                      <motion.div 
                        key={i}
                        whileHover={{ scale: 1.02 }}
                        className={`glass-panel p-6 border-b-4 ${card.color} flex gap-5`}
                      >
                        <div className="p-4 bg-white/5 rounded-2xl h-fit">
                          {card.icon}
                        </div>
                        <div>
                          <h3 className="font-black text-white text-lg mb-1">{card.title}</h3>
                          <p className="text-sm font-bold text-fuel-accent mb-3 italic">🎯 {card.mantra}</p>
                          <p className="text-xs leading-relaxed text-white/60 font-mono tracking-tight">{card.details}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Action/Distillation Column - Only visible on desktop/large screens or as modal/drawer on mobile */}
          <aside className="w-full lg:w-96 flex flex-col gap-6">
            <div className="glass-panel p-6 flex-1 flex flex-col min-h-[500px]">
              <h2 className="text-xl font-bold mb-6 text-fuel-accent flex items-center gap-2 border-b border-white/10 pb-4">
                <Factory className="w-5 h-5" />
                আংশিক পাতন চুল্লি
              </h2>
              
              <div className="flex-1 relative flex gap-6">
                {/* Temp Arrow */}
                <div className="flex flex-col items-center py-4 w-6">
                  <div className="text-[10px] font-black text-blue-400 uppercase tracking-tighter mb-2">Cool</div>
                  <div className="flex-1 w-1 bg-gradient-to-b from-blue-400 via-orange-400 to-red-600 rounded-full" />
                  <div className="text-[10px] font-black text-red-600 uppercase tracking-tighter mt-2">Hot</div>
                </div>

                {/* Vertical Tower List */}
                <div className="flex-1 flex flex-col gap-1.5 py-1">
                  {data.fractions.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setSelectedFraction(selectedFraction === f.id ? null : f.id)}
                      className={`group relative text-left p-3 rounded-lg border-2 transition-all overflow-hidden ${
                        selectedFraction === f.id 
                        ? 'border-fuel-primary bg-fuel-primary/10 scale-[1.03] z-10' 
                        : 'border-white/5 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex justify-between items-center relative z-10">
                        <div className="flex items-center gap-3">
                          <span className={`p-2 rounded-md ${selectedFraction === f.id ? 'bg-fuel-primary text-white' : 'bg-white/5 text-white/50'}`}>
                            {getIcon(f.iconType)}
                          </span>
                          <div>
                            <p className="text-xs font-black text-white leading-none mb-1 group-hover:text-fuel-accent transition-colors">{f.name}</p>
                            <p className="text-[10px] font-mono opacity-50">{f.range} • <InlineMath math={f.carbon}/></p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Interaction Detail Overlay */}
                      <AnimatePresence>
                        {selectedFraction === f.id && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="relative z-10 mt-3 pt-3 border-top border-white/10"
                          >
                             <div className="p-3 bg-black/40 rounded-lg border border-white/5 text-[11px] leading-relaxed">
                                <span className="font-black text-fuel-primary block mb-1">ব্যবহার:</span>
                                {f.use}
                             </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div 
                        className="absolute bottom-0 left-0 h-1 transition-all duration-500 opacity-50" 
                        style={{ width: f.pct === '—' ? '0%' : f.pct, backgroundColor: f.color }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 p-4 bg-orange-600/10 border border-orange-600/30 rounded-xl">
                 <div className="flex items-center gap-2 mb-2">
                   <Info className="w-4 h-4 text-fuel-accent" />
                   <p className="text-xs font-black text-fuel-accent uppercase italic">পাতন নীতি</p>
                 </div>
                 <p className="text-[11px] leading-relaxed opacity-70">
                   চুল্লিতে তাপ দেওয়ার ফলে যার স্ফুটনাঙ্ক কম (যেমন গ্যাস), সে সবার আগে এবং উপরের দিক দিয়ে বের হয়ে আসে। আর যার স্ফুটনাঙ্ক সবচাইতে বেশি (যেমন পিচ), সে সবচাইতে নিচে জমা থাকে।
                 </p>
              </div>
            </div>
          </aside>
        </main>

        {/* Footer Bar */}
        <footer className="glass-panel p-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono opacity-60">
          <div className="flex items-center gap-4">
            <p>© 2026 FUEL EXPLORER PROJECT</p>
            <div className="w-[1px] h-3 bg-white/20"></div>
            <p>BUILD V1.0.4</p>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => setShowImportModal(true)} className="hover:text-fuel-accent transition-colors flex items-center gap-1">
              <Settings className="w-3 h-3" />
              ADVANCED CONFIG
            </button>
            <button onClick={() => setActiveTab('story')} className="hover:text-fuel-accent transition-colors flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              STORY MODE
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
