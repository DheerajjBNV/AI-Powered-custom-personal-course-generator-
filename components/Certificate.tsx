
import React from 'react';
import Button from './Button';
import AcademicCapIcon from './icons/AcademicCapIcon';

interface CertificateProps {
  courseTitle: string;
  onStartNew: () => void;
}

const Certificate: React.FC<CertificateProps> = ({ courseTitle, onStartNew }) => {
  const completionDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="max-w-3xl mx-auto text-center animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400 mb-4">
            Congratulations!
        </h1>
        <p className="text-lg text-slate-400 mb-8">
            You have successfully completed your personalized learning journey.
        </p>

        <div className="bg-slate-800 border-2 border-yellow-400 rounded-lg p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 opacity-50"></div>
            <div className="relative z-10">
                <div className="flex justify-center mb-6">
                    <AcademicCapIcon className="w-16 h-16 text-yellow-400"/>
                </div>
                <p className="text-2xl font-semibold text-slate-300 mb-2">
                    Certificate of Completion
                </p>
                <p className="text-lg text-slate-400 mb-6">This certifies that</p>
                <p className="text-4xl font-bold text-white mb-6">
                    A Valued Learner
                </p>
                <p className="text-lg text-slate-400 mb-4">
                    has successfully completed the course
                </p>
                <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-8">
                    {courseTitle}
                </p>
                <div className="flex justify-center items-center text-slate-400">
                    <div className="text-center">
                        <p className="font-bold border-t border-slate-600 pt-2">{completionDate}</p>
                        <p className="text-sm">Date of Completion</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div className="mt-10">
            <Button onClick={onStartNew} size="lg" variant="secondary">
                Start a New Course
            </Button>
        </div>
    </div>
  );
};

export default Certificate;
