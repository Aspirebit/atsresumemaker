export const exportResumeToTXT = async (resumeData) => {
  let text = '';
  
  // Header
  text += `${resumeData.contact?.fullName || 'Resume'}\n`;
  text += '='.repeat((resumeData.contact?.fullName || 'Resume').length) + '\n\n';
  
  // Contact
  if (resumeData.contact) {
    const contactParts = [];
    if (resumeData.contact.email) contactParts.push(resumeData.contact.email);
    if (resumeData.contact.phone) contactParts.push(resumeData.contact.phone);
    if (resumeData.contact.location) contactParts.push(resumeData.contact.location);
    if (contactParts.length > 0) {
      text += contactParts.join(' | ') + '\n';
    }
    if (resumeData.contact.linkedin) text += `LinkedIn: ${resumeData.contact.linkedin}\n`;
    if (resumeData.contact.website) text += `Website: ${resumeData.contact.website}\n`;
    text += '\n';
  }
  
  // Summary
  if (resumeData.summary) {
    text += 'PROFESSIONAL SUMMARY\n';
    text += '-'.repeat(20) + '\n';
    text += resumeData.summary + '\n\n';
  }
  
  // Experience
  if (resumeData.experience && resumeData.experience.length > 0) {
    text += 'EXPERIENCE\n';
    text += '-'.repeat(20) + '\n';
    resumeData.experience.forEach(exp => {
      text += `${exp.position} - ${exp.company}\n`;
      text += `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}\n`;
      if (exp.location) text += `${exp.location}\n`;
      if (exp.description) text += `${exp.description}\n`;
      text += '\n';
    });
  }
  
  // Education
  if (resumeData.education && resumeData.education.length > 0) {
    text += 'EDUCATION\n';
    text += '-'.repeat(20) + '\n';
    resumeData.education.forEach(edu => {
      text += `${edu.degree} in ${edu.field}\n`;
      text += `${edu.school} - ${edu.startDate} to ${edu.endDate}\n`;
      if (edu.gpa) text += `GPA: ${edu.gpa}\n`;
      text += '\n';
    });
  }
  
  // Skills
  if (resumeData.skills && resumeData.skills.length > 0) {
    text += 'SKILLS\n';
    text += '-'.repeat(20) + '\n';
    text += resumeData.skills.join(', ') + '\n\n';
  }
  
  // Projects
  if (resumeData.projects && resumeData.projects.length > 0) {
    text += 'PROJECTS\n';
    text += '-'.repeat(20) + '\n';
    resumeData.projects.forEach(proj => {
      text += `${proj.name}\n`;
      if (proj.description) text += `${proj.description}\n`;
      if (proj.link) text += `Link: ${proj.link}\n`;
      text += '\n';
    });
  }
  
  // Awards
  if (resumeData.awards && resumeData.awards.length > 0) {
    text += 'AWARDS\n';
    text += '-'.repeat(20) + '\n';
    resumeData.awards.forEach(award => {
      text += `${award.title}\n`;
      text += `${award.issuer} - ${award.date}\n\n`;
    });
  }
  
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${resumeData.title || 'Resume'}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};