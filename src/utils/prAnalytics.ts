import { PRsizeChange, PRMetrics } from '../types/types';

export const calculatePRMetrics = (additions: number, deletions: number): PRMetrics => {
  const totalChanges = additions + deletions;

  const getSize = (changes: number): PRsizeChange => {
    if (changes <= 200) return PRsizeChange.SMALL;
    if (changes <= 500) return PRsizeChange.MEDIUM;
    if (changes <= 1000) return PRsizeChange.LARGE;
    return PRsizeChange.XLARGE;
  };

  return {
    size: getSize(totalChanges),
    additions,
    deletions,
    totalChanges
  };
};

export const getPRSizeLabel = (size: PRsizeChange): string => {
  const labels = {
    [PRsizeChange.SMALL]: '≤ 200 rows',
    [PRsizeChange.MEDIUM]: '201-500 rows',
    [PRsizeChange.LARGE]: '501-1000 rows',
    [PRsizeChange.XLARGE]: '1000+ rows'
  };
  return labels[size];
}; 