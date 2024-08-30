import React from 'react';

interface MatchProps {
  title: string;
  skills: string[];
  score: number;
}

const Match: React.FC<MatchProps> = ({ title, skills, score }) => {
  return (
    <div className="p-4 mb-4 bg-gray-100 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-2">Skills: {skills.join(', ')}</p>
      <p className="text-sm text-gray-600">Similarity Score: {score}</p>
    </div>
  );
};

export default Match;