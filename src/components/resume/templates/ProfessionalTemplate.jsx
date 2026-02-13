import React from 'react';

export default function ProfessionalTemplate({ data }) {
  const { contact, summary, experience, education, skills, projects, awards } = data;

  return (
    <div className="p-8 bg-white text-gray-900" style={{ minHeight: '11in' }}>
      {/* Header */}
      <div className="border-b-2 border-blue-600 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{contact?.fullName || 'Your Name'}</h1>
        <div className="flex flex-wrap gap-3 text-sm text-gray-600 mt-2">
          {contact?.email && <span>{contact.email}</span>}
          {contact?.phone && <span>•</span>}
          {contact?.phone && <span>{contact.phone}</span>}
          {contact?.location && <span>•</span>}
          {contact?.location && <span>{contact.location}</span>}
        </div>
        {(contact?.linkedin || contact?.website) && (
          <div className="flex flex-wrap gap-3 text-sm text-blue-600 mt-1">
            {contact?.linkedin && <span>{contact.linkedin}</span>}
            {contact?.website && <span>•</span>}
            {contact?.website && <span>{contact.website}</span>}
          </div>
        )}
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide">Professional Summary</h2>
          <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">Work Experience</h2>
          {experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-gray-900">{exp.position}</h3>
                <span className="text-sm text-gray-600">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <div className="text-sm text-gray-700 mb-2">
                {exp.company} {exp.location && `• ${exp.location}`}
              </div>
              {exp.description && (
                <p className="text-sm text-gray-700 whitespace-pre-line">{exp.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">Education</h2>
          {education.map((edu, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                <span className="text-sm text-gray-600">
                  {edu.startDate} - {edu.endDate}
                </span>
              </div>
              <div className="text-sm text-gray-700">
                {edu.school} {edu.location && `• ${edu.location}`}
              </div>
              {edu.field && <div className="text-sm text-gray-600">{edu.field}</div>}
              {edu.gpa && <div className="text-sm text-gray-600">GPA: {edu.gpa}</div>}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span key={index} className="text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">Projects</h2>
          {projects.map((project, index) => (
            <div key={index} className="mb-3">
              <h3 className="font-bold text-gray-900">{project.name}</h3>
              {project.description && <p className="text-sm text-gray-700">{project.description}</p>}
              {project.link && <p className="text-sm text-blue-600">{project.link}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Awards */}
      {awards?.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">Awards & Honors</h2>
          {awards.map((award, index) => (
            <div key={index} className="mb-2">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-gray-900">{award.title}</h3>
                <span className="text-sm text-gray-600">{award.date}</span>
              </div>
              <p className="text-sm text-gray-700">{award.issuer}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}