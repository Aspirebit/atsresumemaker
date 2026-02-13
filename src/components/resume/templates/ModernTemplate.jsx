import React from 'react';

export default function ModernTemplate({ data }) {
  const { contact, summary, experience, education, skills, projects, awards } = data;

  return (
    <div className="bg-white" style={{ minHeight: '11in' }}>
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8">
        <h1 className="text-4xl font-bold mb-2">{contact?.fullName || 'Your Name'}</h1>
        <div className="flex flex-wrap gap-4 text-sm">
          {contact?.email && <span>{contact.email}</span>}
          {contact?.phone && <span>{contact.phone}</span>}
          {contact?.location && <span>{contact.location}</span>}
        </div>
        {(contact?.linkedin || contact?.website) && (
          <div className="flex flex-wrap gap-4 text-sm mt-1 opacity-90">
            {contact?.linkedin && <span>{contact.linkedin}</span>}
            {contact?.website && <span>{contact.website}</span>}
          </div>
        )}
      </div>

      <div className="p-8">
        {/* Summary */}
        {summary && (
          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700 leading-relaxed italic">{summary}</p>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="col-span-2 space-y-6">
            {/* Experience */}
            {experience?.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-purple-600 mb-4 pb-2 border-b-2 border-purple-600">
                  Experience
                </h2>
                {experience.map((exp, index) => (
                  <div key={index} className="mb-4">
                    <h3 className="font-bold text-gray-900 text-base">{exp.position}</h3>
                    <div className="text-sm text-purple-600 font-medium mb-1">{exp.company}</div>
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
              <div>
                <h2 className="text-xl font-bold text-purple-600 mb-4 pb-2 border-b-2 border-purple-600">
                  Projects
                </h2>
                {projects.map((project, index) => (
                  <div key={index} className="mb-3">
                    <h3 className="font-bold text-gray-900">{project.name}</h3>
                    {project.description && <p className="text-sm text-gray-700">{project.description}</p>}
                    {project.link && (
                      <p className="text-sm text-purple-600 underline">{project.link}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Education */}
            {education?.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-purple-600 mb-4 pb-2 border-b-2 border-purple-600">
                  Education
                </h2>
                {education.map((edu, index) => (
                  <div key={index} className="mb-4">
                    <h3 className="font-bold text-gray-900 text-sm">{edu.degree}</h3>
                    <div className="text-xs text-gray-700">{edu.school}</div>
                    {edu.field && <div className="text-xs text-gray-600">{edu.field}</div>}
                    <div className="text-xs text-gray-600 mt-1">
                      {edu.startDate} - {edu.endDate}
                    </div>
                    {edu.gpa && <div className="text-xs text-gray-600">GPA: {edu.gpa}</div>}
                  </div>
                ))}
              </div>
            )}

            {/* Skills */}
            {skills?.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-purple-600 mb-4 pb-2 border-b-2 border-purple-600">
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Awards */}
            {awards?.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-purple-600 mb-4 pb-2 border-b-2 border-purple-600">
                  Awards
                </h2>
                {awards.map((award, index) => (
                  <div key={index} className="mb-3">
                    <h3 className="font-bold text-gray-900 text-sm">{award.title}</h3>
                    <p className="text-xs text-gray-700">{award.issuer}</p>
                    <p className="text-xs text-gray-600">{award.date}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}