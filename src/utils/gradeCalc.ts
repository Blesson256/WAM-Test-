import { Subject, CalculationResult } from '../types';

export function calculateGradeAndGPA(mark: number): { grade: string; gpaValue: number } {
  if (mark >= 85) {
    return { grade: 'HD', gpaValue: 7 };
  } else if (mark >= 75) {
    return { grade: 'D', gpaValue: 6 };
  } else if (mark >= 65) {
    return { grade: 'C', gpaValue: 5 };
  } else if (mark >= 50) {
    return { grade: 'P', gpaValue: 4 };
  } else {
    return { grade: 'F', gpaValue: 0 };
  }
}

export function calculateWAMAndGPA(
  subjects: Subject[],
  totalRequiredCP: number
): CalculationResult {
  let totalAttemptedCP = 0;
  let totalPassedCP = 0;
  let sumWeightedMarks = 0;
  let sumWeightedGPA = 0;

  subjects.forEach((subj) => {
    // If a subject has no mark or cp, skip from WAM/GPA calculation (it is incomplete)
    if (subj.mark === '' || isNaN(subj.mark) || isNaN(subj.creditPoints) || subj.creditPoints <= 0) {
      return;
    }

    const cp = subj.creditPoints;
    const mark = subj.mark;
    const { gpaValue } = calculateGradeAndGPA(mark);

    totalAttemptedCP += cp;
    if (mark >= 50) {
      totalPassedCP += cp;
    }

    sumWeightedMarks += mark * cp;
    sumWeightedGPA += gpaValue * cp;
  });

  const cumulativeWAM = totalAttemptedCP > 0 ? sumWeightedMarks / totalAttemptedCP : 0;
  const cumulativeGPA = totalAttemptedCP > 0 ? sumWeightedGPA / totalAttemptedCP : 0;
  const degreeProgressPercentage = totalRequiredCP > 0 ? (totalPassedCP / totalRequiredCP) * 100 : 0;

  return {
    totalAttemptedCP,
    totalPassedCP,
    cumulativeWAM: parseFloat(cumulativeWAM.toFixed(2)),
    cumulativeGPA: parseFloat(cumulativeGPA.toFixed(2)),
    degreeProgressPercentage: parseFloat(Math.min(100, degreeProgressPercentage).toFixed(1)),
  };
}

export function calculateRequiredFutureScore(
  currentResult: CalculationResult,
  targetType: 'WAM' | 'GPA',
  targetValue: number,
  remainingCP: number
): {
  requiredScore: number;
  feasibility: 'easy' | 'moderate' | 'challenging' | 'extreme' | 'unattainable' | 'already_achieved';
  statusMessage: string;
} {
  if (remainingCP <= 0) {
    return {
      requiredScore: 0,
      feasibility: 'unattainable',
      statusMessage: 'Please enter a valid positive number for Remaining Credit Points.',
    };
  }

  const cpCurrent = currentResult.totalAttemptedCP;
  const target = targetValue;

  if (targetType === 'WAM') {
    const currentWAM = currentResult.cumulativeWAM;
    // WAM_target = (currentWAM * cpCurrent + reqMark * cpRemaining) / (cpCurrent + cpRemaining)
    // reqMark = (target * (cpCurrent + cpRemaining) - currentWAM * cpCurrent) / cpRemaining
    const reqMark = (target * (cpCurrent + remainingCP) - currentWAM * cpCurrent) / remainingCP;

    if (reqMark > 100) {
      return {
        requiredScore: parseFloat(reqMark.toFixed(1)),
        feasibility: 'unattainable',
        statusMessage: `Unattainable. You would need an average mark of ${reqMark.toFixed(1)}% in your remaining subjects, which exceeds 100%. Try reducing your target or extending your degree.`,
      };
    } else if (reqMark <= 0) {
      return {
        requiredScore: parseFloat(reqMark.toFixed(1)),
        feasibility: 'already_achieved',
        statusMessage: `Already achieved! Even if you score 0% on your remaining subjects, you will maintain a WAM of at least ${targetValue}.`,
      };
    } else {
      let feasibility: 'easy' | 'moderate' | 'challenging' | 'extreme' = 'easy';
      let msg = '';
      if (reqMark >= 85) {
        feasibility = 'extreme';
        msg = `Extreme effort needed. You need a High Distinction (HD) average of ${reqMark.toFixed(1)}% in all remaining subjects.`;
      } else if (reqMark >= 75) {
        feasibility = 'challenging';
        msg = `Challenging. You need a Distinction (D) average of ${reqMark.toFixed(1)}% in all remaining subjects.`;
      } else if (reqMark >= 65) {
        feasibility = 'moderate';
        msg = `Moderate difficulty. You need a Credit (C) average of ${reqMark.toFixed(1)}% in your remaining subjects.`;
      } else {
        feasibility = 'easy';
        msg = `Comfortably achievable! You need a Pass (P) average of ${reqMark.toFixed(1)}% in your remaining subjects.`;
      }

      return {
        requiredScore: parseFloat(reqMark.toFixed(1)),
        feasibility,
        statusMessage: msg,
      };
    }
  } else {
    // Target GPA
    const currentGPA = currentResult.cumulativeGPA;
    const reqGPA = (target * (cpCurrent + remainingCP) - currentGPA * cpCurrent) / remainingCP;

    if (reqGPA > 7) {
      return {
        requiredScore: parseFloat(reqGPA.toFixed(2)),
        feasibility: 'unattainable',
        statusMessage: `Unattainable. You would need an average GPA of ${reqGPA.toFixed(2)} in your remaining subjects, which exceeds the maximum GPA of 7.0.`,
      };
    } else if (reqGPA <= 0) {
      return {
        requiredScore: parseFloat(reqGPA.toFixed(2)),
        feasibility: 'already_achieved',
        statusMessage: `Already achieved! Even with a GPA of 0.0 on your remaining subjects, you will maintain a cumulative GPA of at least ${targetValue}.`,
      };
    } else {
      let feasibility: 'easy' | 'moderate' | 'challenging' | 'extreme' = 'easy';
      let msg = '';

      if (reqGPA >= 6.5) {
        feasibility = 'extreme';
        msg = `Extreme effort needed. You need a solid HD-level average GPA of ${reqGPA.toFixed(2)} in all remaining subjects.`;
      } else if (reqGPA >= 5.5) {
        feasibility = 'challenging';
        msg = `Challenging. You need a Distinction-level average GPA of ${reqGPA.toFixed(2)} in all remaining subjects.`;
      } else if (reqGPA >= 4.5) {
        feasibility = 'moderate';
        msg = `Moderate difficulty. You need a Credit-level average GPA of ${reqGPA.toFixed(2)} in your remaining subjects.`;
      } else {
        feasibility = 'easy';
        msg = `Comfortably achievable. You need a Pass-level average GPA of ${reqGPA.toFixed(2)} in your remaining subjects.`;
      }

      return {
        requiredScore: parseFloat(reqGPA.toFixed(2)),
        feasibility,
        statusMessage: msg,
      };
    }
  }
}
