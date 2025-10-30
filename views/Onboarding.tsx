
import React, { useState } from 'react';
import type { UserProfile, LearningPace } from '../types';
import { PACE_OPTIONS } from '../constants';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import SparklesIcon from '../components/icons/SparklesIcon';

interface OnboardingProps {
  onStartCourse: (profile: UserProfile) => void;
  isLoading: boolean;
  error: string | null;
}

const Onboarding: React.FC<OnboardingProps> = ({ onStartCourse, isLoading, error }) => {
  const [interests, setInterests] = useState('');
  const [pace, setPace] = useState<LearningPace>('moderate');
  const [goals, setGoals] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (interests && pace && goals) {
      onStartCourse({ interests, pace, goals });
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-4">
          Create Your Personalized Course
        </h1>
        <p className="text-lg text-slate-400">
          Tell us what you want to learn, and our AI will craft a unique learning path just for you.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="interests" className="block text-sm font-medium text-slate-300 mb-2">
              What do you want to learn?
            </label>
            <input
              id="interests"
              type="text"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="e.g., React, Python for Data Science, Creative Writing"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              What's your learning pace?
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PACE_OPTIONS.map((option) => (
                <div key={option.value}>
                  <input
                    type="radio"
                    id={option.value}
                    name="pace"
                    value={option.value}
                    checked={pace === option.value}
                    onChange={() => setPace(option.value)}
                    className="sr-only"
                  />
                  <label
                    htmlFor={option.value}
                    className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      pace === option.value
                        ? 'bg-purple-600 border-purple-500 text-white'
                        : 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    <span className="font-semibold">{option.label}</span>
                    <span className="text-sm opacity-80">{option.description}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <label htmlFor="goals" className="block text-sm font-medium text-slate-300 mb-2">
              What are your goals?
            </label>
            <textarea
              id="goals"
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              placeholder="e.g., Build a portfolio project, switch careers, learn a new hobby"
              rows={3}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              required
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <div className="pt-4">
            <Button type="submit" fullWidth disabled={isLoading}>
              {isLoading ? (
                <>
                  <LoadingSpinner />
                  Generating Your Course...
                </>
              ) : (
                <>
                  <SparklesIcon className="w-5 h-5 mr-2" />
                  Generate My Course
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Onboarding;
