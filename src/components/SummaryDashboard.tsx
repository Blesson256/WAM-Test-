import React from 'react';
import { CalculationResult } from '../types';

interface SummaryDashboardProps {
  totalRequiredCP: number;
  result: CalculationResult;
}

export default function SummaryDashboard({
  totalRequiredCP,
  result,
}: SummaryDashboardProps) {
  const { totalAttemptedCP, totalPassedCP, cumulativeWAM, cumulativeGPA, degreeProgressPercentage } = result;

  // Find WAM grade equivalence
  let wamGrade = 'FAIL (F)';
  if (cumulativeWAM >= 85) {
    wamGrade = 'HIGH DISTINCTION (HD)';
  } else if (cumulativeWAM >= 75) {
    wamGrade = 'DISTINCTION (D)';
  } else if (cumulativeWAM >= 65) {
    wamGrade = 'CREDIT AVERAGE (C)';
  } else if (cumulativeWAM >= 50) {
    wamGrade = 'PASS AVERAGE (P)';
  }

  // Calculate bars for mini progress bar chart
  // We have 4 bars.
  const barsCount = 4;
  const activeBars = Math.min(barsCount, Math.ceil((degreeProgressPercentage / 100) * barsCount));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" id="summary-dashboard">
      {/* WAM Card - Indigo Highlight */}
      <div className="bg-indigo-600 rounded-2xl p-5 shadow-lg shadow-indigo-950/20 text-white flex flex-col justify-between min-h-[140px] transition hover:-translate-y-0.5 duration-200">
        <div>
          <p className="text-xs font-bold uppercase opacity-80 tracking-widest mb-1">Current WAM</p>
          <p className="text-4xl font-light font-mono tracking-tight">
            {totalAttemptedCP > 0 ? cumulativeWAM.toFixed(2) : '0.00'}
          </p>
        </div>
        <div>
          <div className="mt-4 h-1 w-full bg-indigo-400/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${Math.min(100, cumulativeWAM)}%` }}
            ></div>
          </div>
          <p className="text-[10px] font-bold opacity-90 tracking-wide mt-2">
            {totalAttemptedCP > 0 ? `↑ ${wamGrade}` : 'AWAITING GRADES'}
          </p>
        </div>
      </div>

      {/* GPA Card */}
      <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-sm flex flex-col justify-between min-h-[140px] transition hover:-translate-y-0.5 duration-200">
        <div>
          <p className="text-xs font-bold uppercase text-slate-400 tracking-widest mb-1">Current GPA</p>
          <p className="text-4xl font-light font-mono text-white tracking-tight">
            {totalAttemptedCP > 0 ? cumulativeGPA.toFixed(2) : '0.00'}
          </p>
        </div>
        <p className="text-[10px] text-indigo-400 font-bold tracking-wide mt-4">
          {totalAttemptedCP > 0 ? `↑ ${wamGrade}` : 'GPA 7.00 MAX SCALE'}
        </p>
      </div>

      {/* Accumulated CP Card */}
      <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-sm flex flex-col justify-between min-h-[140px] transition hover:-translate-y-0.5 duration-200">
        <div>
          <p className="text-xs font-bold uppercase text-slate-400 tracking-widest mb-1">Accumulated CP</p>
          <p className="text-4xl font-light font-mono text-white tracking-tight">
            {totalPassedCP}
          </p>
        </div>
        <p className="text-[10px] text-slate-400 font-bold mt-4 uppercase tracking-wider">
          OF {totalRequiredCP} REQUIRED ({totalAttemptedCP - totalPassedCP > 0 ? `${totalAttemptedCP - totalPassedCP} CP FAIL REPEATS REQUIRED` : '0 FAILS'})
        </p>
      </div>

      {/* Degree Progress Card */}
      <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-sm flex flex-col justify-between min-h-[140px] transition hover:-translate-y-0.5 duration-200">
        <p className="text-xs font-bold uppercase text-slate-400 tracking-widest mb-1">Degree Progress</p>
        <div className="flex items-end justify-between">
          <p className="text-4xl font-light font-mono text-white tracking-tight">
            {degreeProgressPercentage.toFixed(0)}%
          </p>
          <div className="flex gap-1 h-8 items-end pb-1" title={`${degreeProgressPercentage}% Complete`}>
            {[2, 4, 6, 8].map((height, idx) => {
              const isFilled = idx < activeBars;
              return (
                <div
                  key={idx}
                  className={`w-2 rounded-sm transition duration-300 ${
                    isFilled ? 'bg-indigo-500' : 'bg-slate-800'
                  }`}
                  style={{ height: `${height * 4}px` }}
                ></div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
