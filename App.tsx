
import React, { useState, useCallback } from 'react';
import Onboarding from './views/Onboarding';
import Dashboard from './views/Dashboard';
import Certificate from './components/Certificate';
import Header from './components/Header';
import { AppView, CoursePlan, UserProfile } from './types';
import { generateCoursePlan } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('ONBOARDING');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [coursePlan, setCoursePlan] = useState<CoursePlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartCourse = useCallback(async (profile: UserProfile) => {
    setIsLoading(true);
    setError(null);
    setUserProfile(profile);
    try {
      const plan = await generateCoursePlan(profile);
      // Initialize completion status
      const planWithStatus = {
        ...plan,
        modules: plan.modules.map(module => ({
          ...module,
          topics: module.topics.map(topic => ({ ...topic, completed: false }))
        }))
      };
      setCoursePlan(planWithStatus);
      setView('DASHBOARD');
    } catch (err) {
      setError('Failed to generate course plan. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCompleteCourse = useCallback(() => {
    setView('CERTIFICATE');
  }, []);

  const handleStartNewCourse = useCallback(() => {
    setUserProfile(null);
    setCoursePlan(null);
    setView('ONBOARDING');
  }, []);

  const renderContent = () => {
    switch (view) {
      case 'ONBOARDING':
        return <Onboarding onStartCourse={handleStartCourse} isLoading={isLoading} error={error} />;
      case 'DASHBOARD':
        return coursePlan && <Dashboard coursePlan={coursePlan} onCompleteCourse={handleCompleteCourse} />;
      case 'CERTIFICATE':
        return coursePlan && <Certificate courseTitle={coursePlan.title} onStartNew={handleStartNewCourse} />;
      default:
        return <Onboarding onStartCourse={handleStartCourse} isLoading={isLoading} error={error} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
