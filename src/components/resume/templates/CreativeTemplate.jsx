import React from 'react';

export default function CreativeTemplate({ data }) {
  const { contact, summary, experience, education, skills, projects, awards } = data;

  return (
    <div className="bg-white" style={{ minHeight: '11in' }}>
      <div className="flex">
        {/* Sidebar */}
        <div className="w-1/3 bg-gradient-to-b from-pink-500 to-orange-500 text-white p-6">
          <div className="mb-8">
            <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-4xl text-pink-500 font-bold">
                {contact?.fullName?.charAt(0) || 'Y'}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-center">{contact?.fullName || 'Your Name'}</h1>
          </div>

          {/* Contact */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3 border-b border-white/30 pb-2">Contact</h2>
            <div className="space-y-2 text-sm">
              {contact?.email && <p className="break-words">{contact.email}</p>}
              {contact?.phone && <p>{contact.phone}</p>}
              {contact?.location && <p>{contact.location}</p>}
              {contact?.linkedin && <p className="break-words">{contact.linkedin}</p>}
              {contact?.website && <p className="break-words">{contact.website}</p>}
            </div>
          </div>

          {/* Skills */}
          {skills?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-3 border-b border-white/30 pb-2">Skills</h2>
              <div className="space-y-1">
                {skills.map((skill, index) => (
                  <div key={index} className="text-sm">• {skill}</div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education?.length > 0 && (
            <div>
              <h2 className="text-lg font-bold mb-3 border-b border-white/30 pb-2">Education</h2>
              {education.map((edu, index) => (
                <div key={index} className="mb-3 text-sm">
                  <div className="font-bold">{edu.degree}</div>
                  <div>{edu.school}</div>
                  {edu.field && <div className="text-xs opacity-90">{edu.field}</div>}
                  <div className="text-xs opacity-90">{edu.endDate}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="w-2/3 p-6">
          {/* Summary */}
          {summary && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-pink-600 mb-3">About Me</h2>
              <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
            </div>
          )}

          {/* Experience */}
          {experience?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-pink-600 mb-4">Experience</h2>
              {experience.map((exp, index) => (
                <div key={index} className="mb-4 relative pl-6 border-l-2 border-pink-300">
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-pink-500 rounded-full"></div>
                  <h3 className="font-bold text-gray-900">{exp.position}</h3>
                  <div className="text-sm text-pink-600 font-medium">{exp.company}</div>
                  <div className="text-xs text-gray-600 mb-2">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    {exp.location && ` • ${exp.location}`}
                  </div>
                  {exp.description && (
                    <p className="text-sm text-gray-700 whitespace-pre-line">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {projects?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-pink-600 mb-4">Projects</h2>
              {projects.map((project, index) => (
                <div key={index} className="mb-3">
                  <h3 className="font-bold text-gray-900">{project.name}</h3>
                  {project.description && <p className="text-sm text-gray-700">{project.description}</p>}
                  {project.link && <p className="text-sm text-pink-600">{project.link}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Awards */}
          {awards?.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-pink-600 mb-4">Awards</h2>
              {awards.map((award, index) => (
                <div key={index} className="mb-2">
                  <h3 className="font-bold text-gray-900">{award.title}</h3>
                  <p className="text-sm text-gray-700">
                    {award.issuer} • {award.date}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}