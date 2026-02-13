import React from 'react';

export default function MinimalistTemplate({ data }) {
  const { contact, summary, experience, education, skills, projects, awards } = data;

  return (
    <div className="p-12 bg-white text-gray-900" style={{ minHeight: '11in' }}>
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-light tracking-wider mb-2">
          {contact?.fullName || 'YOUR NAME'}
        </h1>
        <div className="flex justify-center gap-3 text-xs text-gray-600">
          {contact?.email && <span>{contact.email}</span>}
          {contact?.phone && <span>|</span>}
          {contact?.phone && <span>{contact.phone}</span>}
          {contact?.location && <span>|</span>}
          {contact?.location && <span>{contact.location}</span>}
        </div>
        {(contact?.linkedin || contact?.website) && (
          <div className="flex justify-center gap-3 text-xs text-gray-500 mt-1">
            {contact?.linkedin && <span>{contact.linkedin}</span>}
            {contact?.website && <span>|</span>}
            {contact?.website && <span>{contact.website}</span>}
          </div>
        )}
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-8">
          <div className="w-16 h-px bg-gray-900 mb-3"></div>
          <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-bold tracking-widest uppercase mb-4">Experience</h2>
          {experience.map((exp, index) => (
            <div key={index} className="mb-5">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                <span className="text-xs text-gray-500">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-2">
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
        <div className="mb-8">
          <h2 className="text-sm font-bold tracking-widest uppercase mb-4">Education</h2>
          {education.map((edu, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                <span className="text-xs text-gray-500">
                  {edu.startDate} - {edu.endDate}
                </span>
              </div>
              <div className="text-sm text-gray-600">
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
        <div className="mb-8">
          <h2 className="text-sm font-bold tracking-widest uppercase mb-4">Skills</h2>
          <p className="text-sm text-gray-700">{skills.join(' • ')}</p>
        </div>
      )}

      {/* Projects */}
      {projects?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-bold tracking-widest uppercase mb-4">Projects</h2>
          {projects.map((project, index) => (
            <div key={index} className="mb-3">
              <h3 className="font-semibold text-gray-900">{project.name}</h3>
              {project.description && <p className="text-sm text-gray-700">{project.description}</p>}
              {project.link && <p className="text-sm text-gray-600 underline">{project.link}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Awards */}
      {awards?.length > 0 && (
        <div>
          <h2 className="text-sm font-bold tracking-widest uppercase mb-4">Awards</h2>
          {awards.map((award, index) => (
            <div key={index} className="mb-2">
              <div className="flex justify-between items-baseline">
                <h3 className="font-semibold text-gray-900">{award.title}</h3>
                <span className="text-xs text-gray-500">{award.date}</span>
              </div>
              <p className="text-sm text-gray-700">{award.issuer}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}