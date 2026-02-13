export const exportResumeToWord = async (resumeData) => {
  // Create a simple HTML representation that Word can open
  let html = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${resumeData.title}</title>
      <style>
        body { font-family: Calibri, sans-serif; font-size: 11pt; line-height: 1.6; }
        h1 { font-size: 24pt; font-weight: bold; margin-bottom: 10pt; }
        h2 { font-size: 14pt; font-weight: bold; margin-top: 15pt; margin-bottom: 8pt; color: #2E5090; }
        h3 { font-size: 12pt; font-weight: bold; margin-top: 10pt; margin-bottom: 5pt; }
        p { margin: 5pt 0; }
        .contact { font-size: 10pt; color: #666; }
        .section { margin-bottom: 15pt; }
        ul { margin: 5pt 0; padding-left: 20pt; }
        li { margin: 3pt 0; }
      </style>
    </head>
    <body>
      <h1>${resumeData.contact?.fullName || 'Resume'}</h1>
      <div class="contact">
        ${resumeData.contact?.email ? `${resumeData.contact.email} | ` : ''}
        ${resumeData.contact?.phone ? `${resumeData.contact.phone} | ` : ''}
        ${resumeData.contact?.location || ''}
      </div>
      ${resumeData.contact?.linkedin ? `<p class="contact">${resumeData.contact.linkedin}</p>` : ''}
      
      ${resumeData.summary ? `
        <div class="section">
          <h2>Professional Summary</h2>
          <p>${resumeData.summary}</p>
        </div>
      ` : ''}
      
      ${resumeData.experience && resumeData.experience.length > 0 ? `
        <div class="section">
          <h2>Experience</h2>
          ${resumeData.experience.map(exp => `
            <h3>${exp.position} - ${exp.company}</h3>
            <p><i>${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</i></p>
            <p>${exp.description || ''}</p>
          `).join('')}
        </div>
      ` : ''}
      
      ${resumeData.education && resumeData.education.length > 0 ? `
        <div class="section">
          <h2>Education</h2>
          ${resumeData.education.map(edu => `
            <h3>${edu.degree} in ${edu.field}</h3>
            <p>${edu.school} - ${edu.startDate} to ${edu.endDate}</p>
            ${edu.gpa ? `<p>GPA: ${edu.gpa}</p>` : ''}
          `).join('')}
        </div>
      ` : ''}
      
      ${resumeData.skills && resumeData.skills.length > 0 ? `
        <div class="section">
          <h2>Skills</h2>
          <p>${resumeData.skills.join(', ')}</p>
        </div>
      ` : ''}
      
      ${resumeData.projects && resumeData.projects.length > 0 ? `
        <div class="section">
          <h2>Projects</h2>
          ${resumeData.projects.map(proj => `
            <h3>${proj.name}</h3>
            <p>${proj.description}</p>
            ${proj.link ? `<p><a href="${proj.link}">${proj.link}</a></p>` : ''}
          `).join('')}
        </div>
      ` : ''}
      
      ${resumeData.awards && resumeData.awards.length > 0 ? `
        <div class="section">
          <h2>Awards</h2>
          ${resumeData.awards.map(award => `
            <h3>${award.title}</h3>
            <p>${award.issuer} - ${award.date}</p>
          `).join('')}
        </div>
      ` : ''}
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', html], {
    type: 'application/msword'
  });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${resumeData.title || 'Resume'}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};