import React from 'react';
import { GraduationCap, Settings } from 'lucide-react';

interface HeaderProps {
  totalRequiredCP: number;
  setTotalRequiredCP: (cp: number) => void;
}

export default function Header({ totalRequiredCP, setTotalRequiredCP }: HeaderProps) {
  return (
    <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-display">
          Academic Performance Portal
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm font-semibold uppercase tracking-widest flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>Australian University Standard • WAM & GPA Calculator</span>
        </p>
      </div>

      <div className="flex items-center gap-4 bg-slate-900 p-3 rounded-xl shadow-sm border border-slate-800 self-start md:self-auto">
        <div className="text-right">
          <label htmlFor="header-cp-input" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Degree Credit Points
          </label>
          <div className="flex items-center gap-1">
            <input
              id="header-cp-input"
              type="number"
              min="1"
              max="1000"
              value={totalRequiredCP || ''}
              onChange={(e) => setTotalRequiredCP(Math.max(1, parseInt(e.target.value) || 0))}
              className="w-16 text-right font-mono text-lg font-bold outline-none bg-transparent text-indigo-400 focus:ring-1 focus:ring-indigo-500 rounded px-1"
            />
            <span className="text-xs font-bold text-slate-400">CP</span>
          </div>
        </div>
        
        <div className="h-10 w-px bg-slate-800 mx-1"></div>
        
        <div className="flex gap-1">
          {[144, 288].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setTotalRequiredCP(preset)}
              className={`text-[10px] font-bold px-2.5 py-1 rounded transition border ${
                totalRequiredCP === preset
                  ? 'bg-slate-800 text-white border-slate-700'
                  : 'bg-slate-950/40 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-transparent'
              }`}
              title={`Set to ${preset} CP preset`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

