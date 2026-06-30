import React from 'react';
import { Plus, Trash2, RotateCcw, AlertTriangle, BookOpen } from 'lucide-react';
import { Subject } from '../types';
import { calculateGradeAndGPA } from '../utils/gradeCalc';

interface SubjectTableProps {
  subjects: Subject[];
  setSubjects: (subjects: Subject[] | ((prev: Subject[]) => Subject[])) => void;
  onLoadSamples: () => void;
  onClearAll: () => void;
}

const COMMON_CPS = [3, 4, 6, 8, 12, 24];

export default function SubjectTable({
  subjects,
  setSubjects,
  onLoadSamples,
  onClearAll,
}: SubjectTableProps) {
  const handleAddSubject = () => {
    const newSubj: Subject = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      creditPoints: 6, // 6 CP is the default in Australian universities
      mark: '',
      grade: '-',
      gpaValue: 0,
    };
    setSubjects((prev) => [...prev, newSubj]);
  };

  const handleUpdateSubject = (id: string, updates: Partial<Subject>) => {
    setSubjects((prev) =>
      prev.map((subj) => {
        if (subj.id !== id) return subj;

        const updated = { ...subj, ...updates };

        // If mark is changed, automatically update grade and GPA value
        if ('mark' in updates) {
          const markVal = updates.mark;
          if (markVal === '') {
            updated.grade = '-';
            updated.gpaValue = 0;
          } else {
            // Keep mark within 0 - 100
            let cleanMark = Math.min(100, Math.max(0, markVal));
            updated.mark = cleanMark;
            const { grade, gpaValue } = calculateGradeAndGPA(cleanMark);
            updated.grade = grade;
            updated.gpaValue = gpaValue;
          }
        }

        return updated;
      })
    );
  };

  const handleDeleteSubject = (id: string) => {
    setSubjects((prev) => prev.filter((subj) => subj.id !== id));
  };

  const getGradeBadgeStyles = (grade: string) => {
    switch (grade) {
      case 'HD':
        return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30';
      case 'D':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
      case 'C':
        return 'bg-teal-500/15 text-teal-300 border-teal-500/30';
      case 'P':
        return 'bg-slate-800/85 text-slate-300 border-slate-700/50';
      case 'F':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
      default:
        return 'bg-slate-800/40 text-slate-400 border-slate-800';
    }
  };

  return (
    <section className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-sm flex flex-col overflow-hidden h-fit" id="subject-entry-section">
      <div className="bg-slate-950/40 border-b border-slate-800 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-extrabold text-white font-display flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            Subject History
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Australian standards. Fail grades count towards cumulative calculations.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onLoadSamples}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-300 bg-slate-800 border border-slate-700 rounded-full hover:bg-slate-700 transition"
          >
            <RotateCcw className="w-3 h-3" />
            Load Samples
          </button>
          <button
            type="button"
            onClick={onClearAll}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-400 bg-slate-800 border border-slate-700 rounded-full hover:bg-rose-500/10 transition"
          >
            <Trash2 className="w-3 h-3" />
            Clear
          </button>
          <button
            type="button"
            onClick={handleAddSubject}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-full border border-indigo-500/30 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Subject
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {subjects.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-850 rounded-xl bg-slate-950/10">
            <div className="w-12 h-12 bg-slate-950 text-slate-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6 text-slate-500" />
            </div>
            <p className="text-slate-400 font-bold text-sm">No subjects added yet.</p>
            <p className="text-slate-500 text-xs mt-1">Get started by clicking the "Add Subject" button or loading sample data.</p>
            <button
              type="button"
              onClick={handleAddSubject}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              Add Your First Subject
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Desktop Table: Hidden on small screens, shown from md and up */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                    <th className="py-3 px-4 font-semibold">Subject Name</th>
                    <th className="py-3 px-4 font-semibold w-40">Credit Pts</th>
                    <th className="py-3 px-4 font-semibold w-32">Mark</th>
                    <th className="py-3 px-4 font-semibold w-32">Grade & GPA</th>
                    <th className="py-3 px-4 font-semibold w-16 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {subjects.map((subj, index) => (
                    <tr key={subj.id} className="hover:bg-slate-950/20 transition duration-150">
                      {/* Subject Name */}
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={subj.name}
                          onChange={(e) => handleUpdateSubject(subj.id, { name: e.target.value })}
                          placeholder={`Subject ${index + 1}`}
                          className="w-full px-3 py-2 text-sm bg-transparent border border-transparent rounded-lg hover:border-slate-800 focus:bg-slate-950/60 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition font-medium text-slate-100"
                        />
                      </td>

                      {/* Credit Points */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            max="120"
                            value={subj.creditPoints || ''}
                            onChange={(e) => handleUpdateSubject(subj.id, { creditPoints: Math.max(1, parseInt(e.target.value) || 0) })}
                            className="w-12 px-2 py-1 text-sm text-center font-mono bg-slate-950/40 border border-slate-800 rounded focus:bg-slate-950 focus:ring-1 focus:ring-indigo-500 outline-none transition text-slate-100"
                          />
                          <div className="flex gap-0.5">
                            {[6, 12].map((cp) => (
                              <button
                                key={cp}
                                type="button"
                                onClick={() => handleUpdateSubject(subj.id, { creditPoints: cp })}
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition ${
                                  subj.creditPoints === cp
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                                }`}
                              >
                                {cp}
                              </button>
                            ))}
                          </div>
                        </div>
                      </td>

                      {/* Mark */}
                      <td className="py-3 px-4">
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="e.g. 78"
                            value={subj.mark}
                            onChange={(e) =>
                              handleUpdateSubject(
                                subj.id,
                                { mark: e.target.value === '' ? '' : parseInt(e.target.value) || 0 }
                              )
                            }
                            className="w-20 px-2.5 py-1 text-sm font-semibold text-slate-100 bg-slate-950/40 border border-slate-800 rounded focus:bg-slate-950 focus:ring-1 focus:ring-indigo-500 outline-none transition"
                          />
                          {subj.mark !== '' && (subj.mark < 0 || subj.mark > 100) && (
                            <span className="absolute -top-1 -right-1 text-rose-500" title="Mark must be between 0 and 100">
                              <AlertTriangle className="w-3.5 h-3.5 fill-rose-500 text-white" />
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Automatically Calculated Grade */}
                      <td className="py-3 px-4">
                        {subj.mark !== '' ? (
                          <span className={`px-2 py-1 rounded text-[10px] font-black border uppercase tracking-wider ${getGradeBadgeStyles(subj.grade)}`}>
                            {subj.grade} ({subj.gpaValue.toFixed(1)})
                          </span>
                        ) : (
                          <span className="text-xs text-slate-500 font-mono">-</span>
                        )}
                      </td>

                      {/* Delete Action */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteSubject(subj.id)}
                          className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition"
                          title="Remove subject"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards: Shown on mobile devices, hidden on md and up */}
            <div className="md:hidden space-y-3">
              {subjects.map((subj, index) => (
                <div
                  key={subj.id}
                  className="bg-slate-950/30 p-4 rounded-xl border border-slate-800 space-y-3 relative hover:border-slate-700 transition duration-150"
                >
                  <button
                    type="button"
                    onClick={() => handleDeleteSubject(subj.id)}
                    className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 p-1 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                      Subject Name {index + 1}
                    </label>
                    <input
                      type="text"
                      value={subj.name}
                      onChange={(e) => handleUpdateSubject(subj.id, { name: e.target.value })}
                      placeholder={`e.g. Introduction to Computing`}
                      className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-800 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition font-medium text-slate-100"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                        Credit Points
                      </label>
                      <div className="flex gap-1">
                        <input
                          type="number"
                          min="1"
                          max="120"
                          value={subj.creditPoints || ''}
                          onChange={(e) => handleUpdateSubject(subj.id, { creditPoints: Math.max(1, parseInt(e.target.value) || 0) })}
                          className="w-12 px-2 py-1 text-sm text-center font-mono bg-slate-900 border border-slate-800 rounded focus:ring-1 focus:ring-indigo-500 outline-none transition text-slate-100"
                        />
                        <div className="flex gap-0.5">
                          {[6, 12].map((cp) => (
                            <button
                              key={cp}
                              type="button"
                              onClick={() => handleUpdateSubject(subj.id, { creditPoints: cp })}
                              className={`text-[9px] font-bold px-1.5 py-1 rounded transition ${
                                subj.creditPoints === cp
                                  ? 'bg-indigo-600 text-white border border-indigo-500/20'
                                  : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-750'
                              }`}
                            >
                              {cp}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                        Mark (0-100)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="Mark"
                        value={subj.mark}
                        onChange={(e) =>
                          handleUpdateSubject(
                            subj.id,
                            { mark: e.target.value === '' ? '' : parseInt(e.target.value) || 0 }
                          )
                        }
                        className="w-full px-2.5 py-1 text-sm font-semibold text-slate-100 bg-slate-900 border border-slate-800 rounded focus:ring-1 focus:ring-indigo-500 outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-850">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Calculated Outcome:</span>
                    {subj.mark !== '' ? (
                      <span className={`px-2 py-1 rounded text-[10px] font-black border uppercase tracking-wider ${getGradeBadgeStyles(subj.grade)}`}>
                        {subj.grade} ({subj.gpaValue.toFixed(1)})
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500 font-mono italic">Incomplete mark</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddSubject}
              className="w-full py-3 border-2 border-dashed border-slate-800 rounded-2xl text-slate-400 hover:text-indigo-400 hover:border-indigo-500/50 hover:bg-indigo-500/10 transition duration-150 flex items-center justify-center gap-2 text-xs font-bold mt-2 uppercase tracking-widest"
            >
              <Plus className="w-4 h-4" />
              Add New Subject Row
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
