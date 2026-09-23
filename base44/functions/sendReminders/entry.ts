import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Get all upcoming interviews in the next 24 hours
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    const interviews = await base44.asServiceRole.entities.Interview.filter({
      status: 'scheduled'
    });
    
    const reminders = [];
    
    for (const interview of interviews) {
      const interviewDate = new Date(interview.scheduledDate);
      const reminderTime = interview.reminderTime || 60;
      const reminderDate = new Date(interviewDate.getTime() - reminderTime * 60 * 1000);
      
      // Check if reminder should be sent now (within next hour)
      if (reminderDate > now && reminderDate < new Date(now.getTime() + 60 * 60 * 1000)) {
        // Get job application details
        const apps = await base44.asServiceRole.entities.JobApplication.filter({
          id: interview.jobApplicationId
        });
        
        if (apps.length > 0) {
          const app = apps[0];
          
          // Send email reminder
          try {
            await base44.asServiceRole.integrations.Core.SendEmail({
              to: interview.created_by || app.created_by,
              subject: `Interview Reminder: ${app.jobTitle} at ${app.company}`,
              body: `
                <h2>Interview Reminder</h2>
                <p>You have an interview scheduled:</p>
                <ul>
                  <li><strong>Position:</strong> ${app.jobTitle}</li>
                  <li><strong>Company:</strong> ${app.company}</li>
                  <li><strong>Type:</strong> ${interview.type}</li>
                  <li><strong>Date:</strong> ${new Date(interview.scheduledDate).toLocaleString()}</li>
                  <li><strong>Duration:</strong> ${interview.duration} minutes</li>
                  ${interview.location ? `<li><strong>Location:</strong> ${interview.location}</li>` : ''}
                </ul>
                <p>Good luck with your interview!</p>
              `
            });
            
            reminders.push({
              interview: interview.id,
              sent: true
            });
          } catch (error) {
            reminders.push({
              interview: interview.id,
              sent: false,
              error: error.message
            });
          }
        }
      }
    }
    
    // Check for job application follow-ups
    const applications = await base44.asServiceRole.entities.JobApplication.filter({
      status: 'Applied'
    });
    
    for (const app of applications) {
      const appliedDate = new Date(app.appliedDate);
      const followUpDate = new Date(appliedDate.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days after
      
      if (followUpDate > now && followUpDate < tomorrow) {
        try {
          await base44.asServiceRole.integrations.Core.SendEmail({
            to: app.created_by,
            subject: `Follow-up Reminder: ${app.jobTitle} at ${app.company}`,
            body: `
              <h2>Follow-up Reminder</h2>
              <p>It's been a week since you applied to:</p>
              <ul>
                <li><strong>Position:</strong> ${app.jobTitle}</li>
                <li><strong>Company:</strong> ${app.company}</li>
                <li><strong>Applied:</strong> ${new Date(app.appliedDate).toLocaleDateString()}</li>
              </ul>
              <p>Consider following up with the recruiter to show your continued interest!</p>
            `
          });
          
          reminders.push({
            application: app.id,
            type: 'follow-up',
            sent: true
          });
        } catch (error) {
          reminders.push({
            application: app.id,
            type: 'follow-up',
            sent: false,
            error: error.message
          });
        }
      }
    }
    
    return Response.json({
      success: true,
      reminders: reminders
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});