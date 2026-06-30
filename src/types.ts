export interface Subject {
  id: string;
  name: string;
  creditPoints: number;
  mark: number | ''; // can be blank during typing
  grade: string;     // calculated (HD, D, C, P, F)
  gpaValue: number;  // calculated (7, 6, 5, 4, 0)
}

export type TargetType = 'WAM' | 'GPA';

export interface CalculationResult {
  totalAttemptedCP: number;
  totalPassedCP: number;
  cumulativeWAM: number;
  cumulativeGPA: number;
  degreeProgressPercentage: number;
}
