
import React from 'react';
import AcademicCapIcon from './icons/AcademicCapIcon';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center">
          <AcademicCapIcon className="w-8 h-8 text-purple-400" />
          <span className="ml-3 text-xl font-bold text-slate-100">
            AI Course Generator
          </span>
        </div>
      </div>
       <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
    </header>
  );
};

export default Header;
