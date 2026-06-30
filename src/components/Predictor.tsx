import React, { useEffect, useState } from 'react';
import { TargetType, CalculationResult } from '../types';
import { calculateRequiredFutureScore } from '../utils/gradeCalc';
import { Target, HelpCircle, ArrowRight, TrendingUp, AlertCircle, CheckCircle2, Award } from 'lucide-react';

interface PredictorProps {
  currentResult: CalculationResult;
  totalRequiredCP: number;
}

export default function Predictor({ currentResult, totalRequiredCP }: PredictorProps) {
  const [targetType, setTargetType] = useState<TargetType>('WAM');
  const [targetValue, setTargetValue] = useState<number>(75); // default target WAM is 75 (Distinction)
  const [remainingCP, setRemainingCP] = useState<number>(72); // default remaining credit points e.g. 72

  // Whenever targetType changes, update the default value to something reasonable
  useEffect(() => {
    if (targetType === 'WAM') {
      setTargetValue(75);
    } else {
      setTargetValue(6.0);
    }
  }, [targetType]);

  // Set default remaining CP based on current progress
  const autoRemainingCP = Math.max(0, totalRequiredCP - currentResult.totalAttemptedCP);
  
  const handleApplyAutoRemaining = () => {
    setRemainingCP(autoRemainingCP);
  };

  const prediction = calculateRequiredFutureScore(
    currentResult,
    targetType,
    targetValue,
    remainingCP
  );

  const getFeasibilityStyles = (feasibility: string) => {
    switch (feasibility) {
      case 'already_achieved':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/20',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          text: 'text-emerald-300',
          progressColor: 'bg-emerald-500',
          title: 'Already Achieved',
          icon: <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />,
        };
      case 'easy':
        return {
          bg: 'bg-green-500/10 border-green-500/20',
          badge: 'bg-green-500/20 text-green-300 border-green-500/30',
          text: 'text-green-300',
          progressColor: 'bg-green-500',
          title: 'Comfortably Achievable',
          icon: <TrendingUp className="w-8 h-8 text-green-400 shrink-0" />,
        };
      case 'moderate':
        return {
          bg: 'bg-amber-500/10 border-amber-500/20',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          text: 'text-amber-300',
          progressColor: 'bg-amber-500',
          title: 'Moderate Difficulty',
          icon: <TrendingUp className="w-8 h-8 text-amber-400 shrink-0" />,
        };
      case 'challenging':
        return {
          bg: 'bg-orange-500/10 border-orange-500/20',
          badge: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
          text: 'text-orange-300',
          progressColor: 'bg-orange-500',
          title: 'Challenging',
          icon: <TrendingUp className="w-8 h-8 text-orange-400 shrink-0" />,
        };
      case 'extreme':
        return {
          bg: 'bg-purple-500/10 border-purple-500/20',
          badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
          text: 'text-purple-300',
          progressColor: 'bg-purple-500',
          title: 'Extreme Effort',
          icon: <Award className="w-8 h-8 text-purple-400 shrink-0" />,
        };
      case 'unattainable':
      default:
        return {
          bg: 'bg-rose-500/10 border-rose-500/20',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
          text: 'text-rose-300',
          progressColor: 'bg-rose-500',
          title: 'Unattainable Target',
          icon: <AlertCircle className="w-8 h-8 text-rose-400 shrink-0" />,
        };
    }
  };

  const styles = getFeasibilityStyles(prediction.feasibility);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-sm p-6 flex flex-col gap-5" id="future-planning-predictor">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-slate-950/40 rounded-xl">
          <Target className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h3 className="font-extrabold text-white font-display">Target Planner</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Predict the grades you need to graduate with your dream WAM or GPA.</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Target Type Segment Selector */}
        <div>
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
            Planning Metric
          </span>
          <div className="grid grid-cols-2 p-1 bg-slate-950/60 border border-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => setTargetType('WAM')}
              className={`py-1.5 text-xs font-bold rounded-lg transition duration-150 ${
                targetType === 'WAM'
                  ? 'bg-slate-800 text-indigo-400 shadow-sm border border-slate-750'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Target WAM
            </button>
            <button
              type="button"
              onClick={() => setTargetType('GPA')}
              className={`py-1.5 text-xs font-bold rounded-lg transition duration-150 ${
                targetType === 'GPA'
                  ? 'bg-slate-800 text-indigo-400 shadow-sm border border-slate-750'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Target GPA
            </button>
          </div>
        </div>

        {/* Target Value Slider & Input */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="target-input-box" className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Desired {targetType} Target
            </label>
            <div className="relative">
              <input
                id="target-input-box"
                type="number"
                step={targetType === 'WAM' ? '0.5' : '0.05'}
                min="0"
                max={targetType === 'WAM' ? '100' : '7.00'}
                value={targetValue}
                onChange={(e) => {
                  let val = parseFloat(e.target.value) || 0;
                  if (targetType === 'WAM') {
                    val = Math.min(100, Math.max(0, val));
                  } else {
                    val = Math.min(7.0, Math.max(0, val));
                  }
                  setTargetValue(val);
                }}
                className="w-16 px-1 py-0.5 text-xs font-bold text-slate-100 text-center bg-slate-950/40 border border-slate-800 rounded focus:bg-slate-950 focus:ring-1 focus:ring-indigo-500 outline-none transition"
              />
              <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-500 pointer-events-none">
                {targetType === 'WAM' ? '%' : ''}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 py-1">
            <input
              type="range"
              min="0"
              max={targetType === 'WAM' ? '100' : '7'}
              step={targetType === 'WAM' ? '1' : '0.1'}
              value={targetValue}
              onChange={(e) => setTargetValue(parseFloat(e.target.value))}
              className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none"
            />
          </div>
          <div className="flex justify-between text-[9px] text-slate-400 font-bold font-mono">
            <span>Min: 0</span>
            <span>Max: {targetType === 'WAM' ? '100' : '7.0'}</span>
          </div>
        </div>

        {/* Remaining Credit Points input */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="remaining-cp-input" className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Remaining Credits (CP)
            </label>
            
            {autoRemainingCP > 0 && remainingCP !== autoRemainingCP && (
              <button
                type="button"
                onClick={handleApplyAutoRemaining}
                className="text-[9px] font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-1.5 py-0.5 rounded transition uppercase tracking-wider"
                title="Auto-calculate based on degree total minus completed"
              >
                Use Auto: {autoRemainingCP} CP
              </button>
            )}
          </div>

          <div className="relative">
            <input
              id="remaining-cp-input"
              type="number"
              min="0"
              max="1000"
              value={remainingCP || ''}
              onChange={(e) => setRemainingCP(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full px-3 py-2 text-xs bg-slate-950/40 border border-slate-800 rounded-xl focus:bg-slate-950 focus:ring-1 focus:ring-indigo-500 outline-none transition font-semibold text-slate-100"
              placeholder="e.g. 72"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-500 pointer-events-none uppercase">
              CP Remaining
            </span>
          </div>
        </div>
      </div>

      {/* Results Display */}
      <div className={`p-4 rounded-2xl border transition duration-200 ${styles.bg}`}>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded border tracking-widest uppercase ${styles.badge}`}>
              {styles.title}
            </span>
          </div>

          {prediction.feasibility !== 'unattainable' && prediction.feasibility !== 'already_achieved' ? (
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Required Average:
              </div>
              <div className="text-2xl font-extrabold text-white tracking-tight font-mono mt-0.5 flex items-baseline gap-1">
                {targetType === 'WAM' ? `${prediction.requiredScore}%` : prediction.requiredScore.toFixed(2)}
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-sans">
                  grade average
                </span>
              </div>

              {/* Visual gauge bar */}
              <div className="mt-2.5 space-y-1">
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`${styles.progressColor} h-full rounded-full transition-all duration-500 ease-out`}
                    style={{
                      width: `${
                        targetType === 'WAM'
                          ? prediction.requiredScore
                          : (prediction.requiredScore / 7) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ) : null}

          <p className={`text-xs leading-relaxed ${styles.text}`}>
            {prediction.statusMessage}
          </p>
        </div>
      </div>
    </div>
  );
}
