import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SummaryDashboard from './components/SummaryDashboard';
import SubjectTable from './components/SubjectTable';
import Predictor from './components/Predictor';
import { Subject } from './types';
import { calculateWAMAndGPA } from './utils/gradeCalc';
import { HelpCircle, Sparkles, Award, GraduationCap, CheckCircle } from 'lucide-react';

const SAMPLE_SUBJECTS: Subject[] = [
  {
    id: 's1',
    name: 'Introduction to Software Engineering',
    creditPoints: 6,
    mark: 86,
    grade: 'HD',
    gpaValue: 7,
  },
  {
    id: 's2',
    name: 'Data Structures and Algorithms',
    creditPoints: 6,
    mark: 77,
    grade: 'D',
    gpaValue: 6,
  },
  {
    id: 's3',
    name: 'Web Systems & Architecture',
    creditPoints: 6,
    mark: 72,
    grade: 'C',
    gpaValue: 5,
  },
  {
    id: 's4',
    name: 'Discrete Mathematics (First Attempt)',
    creditPoints: 6,
    mark: 45,
    grade: 'F',
    gpaValue: 0,
  },
  {
    id: 's5',
    name: 'Database Fundamentals',
    creditPoints: 6,
    mark: 64,
    grade: 'P',
    gpaValue: 4,
  },
];

export default function App() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [totalRequiredCP, setTotalRequiredCP] = useState<number>(144);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const savedSubjects = localStorage.getItem('au_university_calculator_subjects');
      const savedRequiredCP = localStorage.getItem('au_university_calculator_required_cp');

      if (savedSubjects) {
        setSubjects(JSON.parse(savedSubjects));
      } else {
        // Fallback to sample subjects so the app starts beautifully populated
        setSubjects(SAMPLE_SUBJECTS);
      }

      if (savedRequiredCP) {
        setTotalRequiredCP(parseInt(savedRequiredCP) || 144);
      }
    } catch (e) {
      console.error('Error loading data from local storage', e);
      setSubjects(SAMPLE_SUBJECTS);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to LocalStorage on modifications
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem('au_university_calculator_subjects', JSON.stringify(subjects));
    } catch (e) {
      console.error('Error saving subjects to local storage', e);
    }
  }, [subjects, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem('au_university_calculator_required_cp', totalRequiredCP.toString());
    } catch (e) {
      console.error('Error saving required CP to local storage', e);
    }
  }, [totalRequiredCP, isInitialized]);

  const handleLoadSamples = () => {
    setSubjects(SAMPLE_SUBJECTS);
  };

  const handleClearAll = () => {
    setSubjects([]);
  };

  // Perform overall calculations
  const calculationResult = calculateWAMAndGPA(subjects, totalRequiredCP);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 pb-16 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header Component */}
        <Header totalRequiredCP={totalRequiredCP} setTotalRequiredCP={setTotalRequiredCP} />

        <div className="space-y-8">
          {/* Real-time Summary Dashboard Section */}
          <SummaryDashboard
            totalRequiredCP={totalRequiredCP}
            result={calculationResult}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Subject Enrolments / Interactive Table Grid */}
            <SubjectTable
              subjects={subjects}
              setSubjects={setSubjects}
              onLoadSamples={handleLoadSamples}
              onClearAll={handleClearAll}
            />

            {/* Predictive Planner & Sidebar Impact Disclaimer */}
            <aside className="lg:col-span-4 flex flex-col gap-6">
              <Predictor
                currentResult={calculationResult}
                totalRequiredCP={totalRequiredCP}
              />

              {/* Sidebar warning card matching Clean Utility design */}
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-5 text-amber-200 text-xs space-y-2">
                <div className="font-extrabold flex items-center gap-1.5 uppercase tracking-widest text-amber-400">
                  ⚠️ Transcript Policy Notice
                </div>
                <p className="leading-relaxed opacity-90 font-medium">
                  At most major Australian institutions (including USYD, UNSW, UTS, Monash, Melbourne, and UQ), failed unit attempts are never removed or overwritten upon successful repeat. Both the initial fail mark and subsequent repeat marks remain on your academic transcript, and both contribute fully to your cumulative WAM and GPA averages.
                </p>
              </div>
            </aside>
          </div>

          {/* Educational Insights Accordion Section */}
          <section className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-sm" id="grading-scale-insights">
            <h3 className="text-lg font-extrabold text-slate-100 mb-4 font-display flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-400" />
              Australian University Grading Guide
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
              <div className="space-y-4">
                <h4 className="font-bold text-slate-200">Cumulative WAM Calculation</h4>
                <p className="text-slate-400 leading-relaxed text-xs font-medium">
                  The **Weighted Average Mark (WAM)** is the official performance indicator used by most Australian universities. It accounts for the varying load of different courses by weight-averaging based on credit points (CP).
                </p>
                <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800 font-mono text-[10px] text-slate-300 leading-normal">
                  WAM = Σ (Numeric Mark × Subject Credit Points) / Σ (Total Attempted Credit Points)
                </div>
                <p className="text-slate-400 leading-relaxed text-xs font-medium">
                  For example, scoring 80 in a double-weight 12 CP subject impacts your WAM twice as much as scoring 80 in a standard 6 CP subject. Standard undergraduate semester loads are 24 CP.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-200 mb-3">Academic Grading & 7.0 GPA Mapping</h4>
                <div className="overflow-hidden border border-slate-800 rounded-2xl">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-950/50 border-b border-slate-800 font-bold text-slate-400">
                        <th className="p-2.5 px-4">Mark Range</th>
                        <th className="p-2.5">Grade</th>
                        <th className="p-2.5">Description</th>
                        <th className="p-2.5 text-right px-4">GPA Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300 font-medium">
                      <tr>
                        <td className="p-2.5 px-4 font-bold text-slate-200">85 – 100</td>
                        <td className="p-2.5">
                          <span className="px-2 py-0.5 rounded text-[9px] font-black border uppercase tracking-wider bg-indigo-500/15 text-indigo-300 border-indigo-500/30">
                            HD
                          </span>
                        </td>
                        <td className="p-2.5 text-slate-400">High Distinction</td>
                        <td className="p-2.5 text-right font-mono font-bold text-indigo-400 px-4">7.00</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 px-4 font-bold text-slate-200">75 – 84</td>
                        <td className="p-2.5">
                          <span className="px-2 py-0.5 rounded text-[9px] font-black border uppercase tracking-wider bg-blue-500/15 text-blue-300 border-blue-500/30">
                            D
                          </span>
                        </td>
                        <td className="p-2.5 text-slate-400">Distinction</td>
                        <td className="p-2.5 text-right font-mono font-bold text-blue-400 px-4">6.00</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 px-4 font-bold text-slate-200">65 – 74</td>
                        <td className="p-2.5">
                          <span className="px-2 py-0.5 rounded text-[9px] font-black border uppercase tracking-wider bg-teal-500/15 text-teal-300 border-teal-500/30">
                            C
                          </span>
                        </td>
                        <td className="p-2.5 text-slate-400">Credit</td>
                        <td className="p-2.5 text-right font-mono font-bold text-teal-400 px-4">5.00</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 px-4 font-bold text-slate-200">50 – 64</td>
                        <td className="p-2.5">
                          <span className="px-2 py-0.5 rounded text-[9px] font-black border uppercase tracking-wider bg-slate-800 text-slate-300 border-slate-700/50">
                            P
                          </span>
                        </td>
                        <td className="p-2.5 text-slate-400">Pass</td>
                        <td className="p-2.5 text-right font-mono font-bold text-slate-300 px-4">4.00</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 px-4 font-bold text-rose-400">0 – 49</td>
                        <td className="p-2.5">
                          <span className="px-2 py-0.5 rounded text-[9px] font-black border uppercase tracking-wider bg-rose-500/15 text-rose-300 border-rose-500/30">
                            F
                          </span>
                        </td>
                        <td className="p-2.5 text-rose-400">Fail</td>
                        <td className="p-2.5 text-right font-mono font-bold text-rose-400 px-4">0.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
