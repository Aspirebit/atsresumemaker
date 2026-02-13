import React from 'react';

export default function ExecutiveTemplate({ data }) {
  const { contact, summary, experience, education, skills, projects, awards } = data;

  return (
    <div className="bg-white" style={{ minHeight: '11in' }}>
      {/* Header */}
      <div className="bg-gray-900 text-white p-8">
        <h1 className="text-3xl font-bold mb-3">{contact?.fullName || 'Your Name'}</h1>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {contact?.email && <div>Email: {contact.email}</div>}
          {contact?.phone && <div>Phone: {contact.phone}</div>}
          {contact?.location && <div>Location: {contact.location}</div>}
          {contact?.linkedin && <div>LinkedIn: {contact.linkedin}</div>}
        </div>
      </div>

      <div className="p-8">
        {/* Summary */}
        {summary && (
          <div className="mb-6 border-l-4 border-gray-900 pl-4">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Executive Summary</h2>
            <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience?.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b-2 border-gray-900 pb-2">
              Professional Experience
            </h2>
            {experience.map((exp, index) => (
              <div key={index} className="mb-5">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">{exp.position}</h3>
                    <div className="text-sm text-gray-700 font-medium">
                      {exp.company} {exp.location && `| ${exp.location}`}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </div>
                </div>
                {exp.description && (
                  <p className="text-sm text-gray-700 whitespace-pre-line ml-4">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {education?.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b-2 border-gray-900 pb-2">
              Education & Qualifications
            </h2>
            {education.map((edu, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                    <div className="text-sm text-gray-700">
                      {edu.school} {edu.location && `• ${edu.location}`}
                    </div>
                    {edu.field && <div className="text-sm text-gray-600">{edu.field}</div>}
                  </div>
                  <div className="text-sm text-gray-600">
                    {edu.startDate} - {edu.endDate}
                  </div>
                </div>
                {edu.gpa && <div className="text-sm text-gray-600 ml-4">GPA: {edu.gpa}</div>}
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">
          {/* Skills */}
          {skills?.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3 border-b-2 border-gray-900 pb-2">
                Core Competencies
              </h2>
              <div className="space-y-1">
                {skills.map((skill, index) => (
                  <div key={index} className="text-sm text-gray-700">
                    • {skill}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Awards */}
          {awards?.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3 border-b-2 border-gray-900 pb-2">
                Honors & Awards
              </h2>
              {awards.map((award, index) => (
                <div key={index} className="mb-3">
                  <h3 className="font-bold text-gray-900 text-sm">{award.title}</h3>
                  <p className="text-sm text-gray-700">
                    {award.issuer} • {award.date}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Projects */}
        {projects?.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3 border-b-2 border-gray-900 pb-2">
              Key Projects
            </h2>
            {projects.map((project, index) => (
              <div key={index} className="mb-3">
                <h3 className="font-bold text-gray-900">{project.name}</h3>
                {project.description && <p className="text-sm text-gray-700">{project.description}</p>}
                {project.link && <p className="text-sm text-gray-600 underline">{project.link}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}