
import type { LearningPace } from './types';

export const PACE_OPTIONS: { value: LearningPace; label: string; description: string }[] = [
  { value: 'casual', label: 'Casual', description: '2-3 hours / week' },
  { value: 'moderate', label: 'Moderate', description: '5-7 hours / week' },
  { value: 'intensive', label: 'Intensive', description: '10+ hours / week' },
];

export const MOTIVATIONAL_QUOTES: string[] = [
    "The secret of getting ahead is getting started.",
    "The expert in anything was once a beginner.",
    "Believe you can and you're halfway there.",
    "It does not matter how slowly you go as long as you do not stop.",
    "Success is the sum of small efforts, repeated day in and day out."
];
