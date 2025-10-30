
import React, { useState, useMemo, useEffect } from 'react';
import type { CoursePlan, Topic } from '../types';
import Card from '../components/Card';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import Chatbot from '../components/Chatbot';
import { getAIAdvice } from '../services/geminiService';
import BookOpenIcon from '../components/icons/BookOpenIcon';
import ChevronDownIcon from '../components/icons/ChevronDownIcon';
import CheckCircleIcon from '../components/icons/CheckCircleIcon';
import LightBulbIcon from '../components/icons/LightBulbIcon';
import LoadingSpinner from '../components/LoadingSpinner';
import { MOTIVATIONAL_QUOTES } from '../constants';

interface DashboardProps {
  coursePlan: CoursePlan;
  onCompleteCourse: () => void;
}

const ResourceIcon: React.FC<{ type: string }> = ({ type }) => {
    const baseClasses = "w-5 h-5 mr-3 text-slate-400";
    switch (type) {
        case 'video': return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={baseClasses}><path d="M3.5 2.5a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1v-13a1 1 0 0 0-1-1h-13ZM5 6.25a.75.75 0 0 1 .75-.75h8.5a.75.75 0 0 1 0 1.5h-8.5A.75.75 0 0 1 5 6.25Zm0 3.5a.75.75 0 0 1 .75-.75h8.5a.75.75 0 0 1 0 1.5h-8.5A.75.75 0 0 1 5 9.75Zm.75 2.75a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-4.5Z" /></svg>;
        case 'article': return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={baseClasses}><path fillRule="evenodd" d="M4.25 5.5a.75.75 0 0 0 0 1.5h11.5a.75.75 0 0 0 0-1.5H4.25Zm0 4a.75.75 0 0 0 0 1.5h11.5a.75.75 0 0 0 0-1.5H4.25Zm0 4a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5h-7.5Z" clipRule="evenodd" /></svg>;
        case 'project': return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={baseClasses}><path fillRule="evenodd" d="M12.52 2.232a.75.75 0 0 1 .932.41l.298.893a.75.75 0 0 0 1.402-.468l-.298-.893a2.25 2.25 0 0 0-2.795-1.23L11.5 1.25a.75.75 0 0 0 .5 1.414l.559-.186c.22-.074.453.06.56.254ZM8.5 1.25a.75.75 0 0 0-1.414.5l.186.559a.75.75 0 0 0 .254.56l.893.298a.75.75 0 0 1-.468 1.402l-.893-.298a2.25 2.25 0 0 0-1.23-2.795L5.09 1.586a.75.75 0 0 0-.41-.932A2.25 2.25 0 0 0 3.447.887L2.553.589a.75.75 0 0 0-.468 1.402l.894.298a.75.75 0 0 0 .467.467l.298.894a.75.75 0 0 0 1.402-.468l-.298-.894a2.25 2.25 0 0 0-2.795-1.23L1.25 2.5a.75.75 0 0 0-.5 1.414l.559.186a.75.75 0 0 0 .56.254l.893.298a.75.75 0 0 1-.468 1.402l-.893-.298A2.25 2.25 0 0 0 .887 6.553l-.298.894a.75.75 0 0 0 1.402.468l.298-.894a.75.75 0 0 0 .467-.467l.298-.893a.75.75 0 0 0 1.402-.468L3.25 6.5a2.25 2.25 0 0 0-1.23-2.795l-.836-.279a.75.75 0 0 0-.932.41A2.25 2.25 0 0 0 .887 5.053l.298.894a.75.75 0 0 0 1.402.468l-.298-.894a.75.75 0 0 0-.467-.467L1.586 5.09a2.25 2.25 0 0 0-.41.932 2.25 2.25 0 0 0 1.23 2.795l.836.279a.75.75 0 0 0 .932-.41l.298-.893A.75.75 0 0 0 4.909 7.586a2.25 2.25 0 0 0 2.795 1.23l.836-.279a.75.75 0 0 0 .41-.932L8.653 6.71a.75.75 0 0 0-1.402.468l.298.894a.75.75 0 0 0 .467.467l.298.893a.75.75 0 0 0 1.402-.468l-.298-.894a2.25 2.25 0 0 0-2.795-1.23L6.28 6.586a.75.75 0 0 0-.932.41 2.25 2.25 0 0 0 .887 3.447l.894.298a.75.75 0 0 0 .468-.467l.298-.894a.75.75 0 0 0-.468-1.402l-.298.894a2.25 2.25 0 0 0 1.23 2.795l.836.279a.75.75 0 0 0 .932-.41l.298-.893a.75.75 0 0 0-.467-.467l-1.03-..343a.75.75 0 0 0-.932.41 2.25 2.25 0 0 0 .887 3.447l.894.298a.75.75 0 0 0 .468-.467l.298-.894a.75.75 0 0 0-.468-1.402l-.298.894a2.25 2.25 0 0 0 1.23 2.795l.836.279a.75.75 0 0 0 .932-.41L12 11.5a.75.75 0 0 0-1.414-.5l-.186-.559a.75.75 0 0 0-.254-.56l-.893-.298a.75.75 0 0 1 .468-1.402l.893.298a2.25 2.25 0 0 0 1.23-2.795l.279-.836a.75.75 0 0 0-.41-.932 2.25 2.25 0 0 0-3.447-.887l-.298.894a.75.75 0 0 0 .468 1.402l.298-.894a.75.75 0 0 0 .467.467l.894.298a.75.75 0 0 0 .468-.467l.298-.893a.75.75 0 0 0-1.402.468l-.298.893a2.25 2.25 0 0 0 2.795 1.23l.836.279a.75.75 0 0 0 .932-.41A2.25 2.25 0 0 0 15 13.5a2.25 2.25 0 0 0-2.25-2.25H9.75A2.25 2.25 0 0 0 7.5 13.5v3.75A2.25 2.25 0 0 0 9.75 19.5h2.5a.75.75 0 0 1 0 1.5h-2.5A3.75 3.75 0 0 1 6 17.25v-3.75A3.75 3.75 0 0 1 9.75 9.75h2.75A3.75 3.75 0 0 1 16.25 13.5a3.75 3.75 0 0 1-3.75 3.75h-2.5a.75.75 0 0 0 0 1.5h2.5a5.25 5.25 0 0 0 5.25-5.25 5.25 5.25 0 0 0-5.25-5.25H9.75A5.25 5.25 0 0 0 4.5 13.5v3.75A5.25 5.25 0 0 0 9.75 22.5h2.5a.75.75 0 0 0 0-1.5h-2.5A3.75 3.75 0 0 1 8.5 17.25V13.5A3.75 3.75 0 0 1 12.25 9.75h.25a.75.75 0 0 0 .75-.75V8.5a.75.75 0 0 0-.254-.56L12.103 7.047a.75.75 0 0 0-.467-.467l-.894-.298a.75.75 0 0 0-.468.467l-.298.893a.75.75 0 0 0-1.402.468l.298-.893a2.25 2.25 0 0 0-1.23-2.795L7.586 4.91a.75.75 0 0 0-.41.932l.298.893a.75.75 0 0 0 .467.467l1.03.344a.75.75 0 0 0 .41-.932L9.29 5.72a2.25 2.25 0 0 0-3.447-.887l-.894.298a.75.75 0 0 0-.468-.467L4.205 4.37a.75.75 0 0 0-.468 1.402l.298.894a.75.75 0 0 0 .467.467l.893.298a.75.75 0 0 0 .468-.467l.298-.894a2.25 2.25 0 0 0-1.23-2.795L4.586 3.09a.75.75 0 0 0-.932.41 2.25 2.25 0 0 0 .887 3.447l.894.298a.75.75 0 0 0 .468-.467l.298-.894a.75.75 0 0 0-.468-1.402l-.298.894a2.25 2.25 0 0 0 1.23 2.795l.836.279a.75.75 0 0 0 .932-.41L8.5 6.5a.75.75 0 0 0-.5-1.414l-.559.186a.75.75 0 0 0-.56-.254L6.086 4.91a2.25 2.25 0 0 0-2.795 1.23L2.947 6.553a.75.75 0 0 1-1.402-.468l.298-.894a2.25 2.25 0 0 0-1.23-2.795L.279 2.117a.75.75 0 0 1 .41-.932A2.25 2.25 0 0 1 2.553.887l.894.298a.75.75 0 0 0 .468-.467l.298-.894A.75.75 0 0 1 5.615.292a2.25 2.25 0 0 1 2.795 1.23l.298.893a.75.75 0 0 0 .468.467l.893.298a.75.75 0 0 0 .468-.467L11.5 1.75a.75.75 0 0 0-.914-.534Z" clipRule="evenodd" /></svg>;
        default: return <BookOpenIcon className={baseClasses} />;
    }
}

const AdviceModal: React.FC<{ topic: Topic, courseTitle: string, onClose: () => void }> = ({ topic, courseTitle, onClose }) => {
    const [advice, setAdvice] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAdvice = async () => {
            setIsLoading(true);
            try {
                const result = await getAIAdvice(topic.title, courseTitle);
                setAdvice(result);
            } catch (error) {
                setAdvice('Sorry, I couldn\'t fetch advice right now. Please try again later.');
                console.error(error);
            }
            setIsLoading(false);
        };
        fetchAdvice();
    }, [topic, courseTitle]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
            <div className="bg-slate-800 rounded-xl p-6 max-w-lg w-full mx-4 animate-slide-in-up" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold text-purple-400 mb-2 flex items-center">
                    <LightBulbIcon className="w-6 h-6 mr-2" /> AI Advice for: {topic.title}
                </h3>
                <div className="mt-4 min-h-[80px]">
                    {isLoading ? (
                        <div className="flex items-center justify-center text-slate-400">
                            <LoadingSpinner />
                            Getting advice...
                        </div>
                    ) : (
                        <p className="text-slate-300">{advice}</p>
                    )}
                </div>
                <div className="mt-6 text-right">
                    <Button onClick={onClose}>Close</Button>
                </div>
            </div>
        </div>
    );
};


const Dashboard: React.FC<DashboardProps> = ({ coursePlan, onCompleteCourse }) => {
    const [localCourse, setLocalCourse] = useState<CoursePlan>(coursePlan);
    const [openModule, setOpenModule] = useState<number | null>(0);
    const [adviceTopic, setAdviceTopic] = useState<Topic | null>(null);
    const [quote, setQuote] = useState('');

    useEffect(() => {
        setQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
    }, []);

    const { completedTopics, totalTopics, progress } = useMemo(() => {
        let completed = 0;
        let total = 0;
        localCourse.modules.forEach(module => {
            module.topics.forEach(topic => {
                total++;
                if (topic.completed) {
                    completed++;
                }
            });
        });
        const progress = total > 0 ? (completed / total) * 100 : 0;
        return { completedTopics: completed, totalTopics: total, progress };
    }, [localCourse]);

    const handleToggleTopic = (moduleIndex: number, topicIndex: number) => {
        const newCourse = JSON.parse(JSON.stringify(localCourse));
        newCourse.modules[moduleIndex].topics[topicIndex].completed = !newCourse.modules[moduleIndex].topics[topicIndex].completed;
        setLocalCourse(newCourse);
    };

    const handleToggleModule = (index: number) => {
        setOpenModule(openModule === index ? null : index);
    };

    return (
        <div className="animate-fade-in">
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">{localCourse.title}</h1>
                <p className="text-slate-400 mt-2">{localCourse.description}</p>
            </header>

            <Card className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Your Progress</h2>
                        <p className="text-slate-400">{completedTopics} / {totalTopics} topics completed</p>
                    </div>
                    <div className="w-full md:w-1/2 mt-4 md:mt-0">
                        <ProgressBar percentage={progress} />
                    </div>
                </div>
                {progress === 100 && (
                     <div className="mt-6 text-center">
                        <p className="text-lg text-green-400 mb-4">🎉 Congratulations! You've completed the course! 🎉</p>
                        <Button onClick={onCompleteCourse} variant="secondary">
                           Claim Your Certificate
                        </Button>
                    </div>
                )}
            </Card>

            <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                <div className="lg:col-span-2">
                    <h2 className="text-3xl font-bold mb-4">Course Modules</h2>
                    <div className="space-y-4">
                        {localCourse.modules.map((module, moduleIndex) => (
                            <Card key={moduleIndex} padding="none">
                                <button
                                    className="w-full p-4 text-left flex justify-between items-center"
                                    onClick={() => handleToggleModule(moduleIndex)}
                                >
                                    <div>
                                        <p className="text-purple-400 font-semibold">Week {module.week}</p>
                                        <h3 className="text-xl font-bold">{module.title}</h3>
                                        <p className="text-sm text-slate-400 mt-1">{module.summary}</p>
                                    </div>
                                    <ChevronDownIcon className={`w-6 h-6 transition-transform ${openModule === moduleIndex ? 'rotate-180' : ''}`} />
                                </button>
                                {openModule === moduleIndex && (
                                    <div className="p-4 border-t border-slate-700">
                                        {module.topics.map((topic, topicIndex) => (
                                            <div key={topicIndex} className="py-4 border-b border-slate-800 last:border-b-0">
                                                <div className="flex items-start">
                                                    <input
                                                        type="checkbox"
                                                        id={`topic-${moduleIndex}-${topicIndex}`}
                                                        checked={topic.completed}
                                                        onChange={() => handleToggleTopic(moduleIndex, topicIndex)}
                                                        className="mt-1 h-5 w-5 rounded-full border-gray-600 bg-slate-700 text-purple-600 focus:ring-purple-500 cursor-pointer"
                                                    />
                                                    <div className="ml-4 flex-1">
                                                        <label htmlFor={`topic-${moduleIndex}-${topicIndex}`} className={`font-bold text-lg cursor-pointer ${topic.completed ? 'line-through text-slate-500' : ''}`}>
                                                            {topic.title}
                                                        </label>
                                                        <p className="text-slate-400 text-sm">{topic.description}</p>
                                                        
                                                        <div className="mt-4 space-y-3">
                                                            {topic.resources.map((resource, resIndex) => (
                                                                <div key={resIndex} className="flex items-center text-sm p-3 bg-slate-800/50 rounded-lg">
                                                                    <ResourceIcon type={resource.type} />
                                                                    <div>
                                                                        <p className="font-semibold text-slate-200">{resource.title}</p>
                                                                        <p className="text-slate-400">{resource.description}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        {!topic.completed && (
                                                             <Button size="sm" variant="ghost" className="mt-4" onClick={() => setAdviceTopic(topic)}>
                                                                <LightBulbIcon className="w-4 h-4 mr-2"/>
                                                                Get AI Advice
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                </div>
                <aside className="mt-8 lg:mt-0">
                    <Card>
                        <h3 className="text-xl font-bold mb-4">Motivational Tip</h3>
                        <p className="text-slate-300 italic">"{quote}"</p>
                    </Card>
                </aside>
            </div>
            <Chatbot />
            {adviceTopic && <AdviceModal topic={adviceTopic} courseTitle={localCourse.title} onClose={() => setAdviceTopic(null)} />}
        </div>
    );
};

export default Dashboard;
