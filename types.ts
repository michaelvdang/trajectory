export interface UserData {
  languages: string[];
  skills: string[];
  experience: string[];
  education: string[];
  activities: string[];
  projects: string[];
  certifications: string[];
}

export interface MatchData {
  id: string;
  title: string;
  skills: string[];
  score: number;
}
