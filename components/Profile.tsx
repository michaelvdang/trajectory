import React from 'react';

interface ProfileProps {
  languages: string[];
  skills: string[];
  experience: string[];
  education: string[];
  activities: string[];
  projects: string[];
  certifications: string[];
}

const Profile: React.FC<ProfileProps> = ({
  languages = [],
  skills = [],
  experience = [],
  education = [],
  activities = [],
  projects = [],
  certifications = []
}) => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">User Profile</h1>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Languages</h2>
        <ul className="list-disc list-inside">
          {languages.map((language, index) => (
            <li key={index} className="text-lg">{language}</li>
          ))}
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Skills</h2>
        <ul className="list-disc list-inside">
          {skills.map((skill, index) => (
            <li key={index} className="text-lg">{skill}</li>
          ))}
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Experience</h2>
        <ul className="list-disc list-inside">
          {experience.map((exp, index) => (
            <li key={index} className="text-lg">{exp}</li>
          ))}
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Education</h2>
        <ul className="list-disc list-inside">
          {education.map((edu, index) => (
            <li key={index} className="text-lg">{edu}</li>
          ))}
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Activities</h2>
        <ul className="list-disc list-inside">
          {activities.map((activity, index) => (
            <li key={index} className="text-lg">{activity}</li>
          ))}
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Projects</h2>
        <ul className="list-disc list-inside">
          {projects.map((project, index) => (
            <li key={index} className="text-lg">{project}</li>
          ))}
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Certifications</h2>
        <ul className="list-disc list-inside">
          {certifications.map((certification, index) => (
            <li key={index} className="text-lg">{certification}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Profile;