
export interface UserProfile {
  interests: string;
  pace: LearningPace;
  goals: string;
}

export type LearningPace = 'casual' | 'moderate' | 'intensive';

export interface Resource {
  type: 'video' | 'article' | 'project' | 'book';
  title: string;
  description: string;
}

export interface Topic {
  title: string;
  description: string;
  completed: boolean;
  resources: Resource[];
}

export interface Module {
  title: string;
  week: number;
  summary: string;
  topics: Topic[];
}

export interface CoursePlan {
  title: string;
  description: string;
  duration: string;
  modules: Module[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export type AppView = 'ONBOARDING' | 'DASHBOARD' | 'CERTIFICATE';
