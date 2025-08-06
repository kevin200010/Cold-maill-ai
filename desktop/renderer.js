let emailText = '';
let primaryEmail = '';

window.onload = () => {
  const contentDiv = document.getElementById('email-content');
  const contactsDiv = document.getElementById('contacts');
  const resumeLink = document.getElementById('resumeLink');
  const profile = 'Kevin Patel – ML Engineer with 6+ years of experience in AI, LLMs and cloud.';

  window.electronAPI.onEmailGenerated((event, message) => {
    contentDiv.innerText = message;
    contentDiv.scrollTop = 0;
  });

  window.electronAPI.onJobData(async ({ company, jobDescription }) => {
    try {
      // Generate email
      const emailRes = await fetch('http://localhost:5000/generate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription, userProfile: profile })
      });
      const emailJson = await emailRes.json();
      emailText = emailJson.email || '';
      contentDiv.innerText = emailText;
    } catch (err) {
      contentDiv.innerText = 'Failed to generate email';
    }

    try {
      // Find hiring managers
      const mgrRes = await fetch('http://localhost:5000/find-hiring-manager', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company })
      });
      const mgrJson = await mgrRes.json();
      const contacts = mgrJson.contacts || [];
      primaryEmail = contacts[0]?.email || '';
      contactsDiv.innerText = contacts.map(c => `${c.name} <${c.email}>`).join('\n');
    } catch (err) {
      contactsDiv.innerText = 'No contacts found';
    }

    try {
      // Generate resume
      const resumeRes = await fetch('http://localhost:5000/generate-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription, userProfile: profile })
      });
      const blob = await resumeRes.blob();
      const url = window.URL.createObjectURL(blob);
      resumeLink.href = url;
      resumeLink.download = 'resume.pdf';
      resumeLink.textContent = 'Download Resume PDF';
      resumeLink.style.display = 'block';
    } catch (err) {
      resumeLink.style.display = 'none';
    }
  });

  window.electronAPI.onScrollUp(() => {
    contentDiv.scrollTop -= 50;
  });

  window.electronAPI.onScrollDown(() => {
    contentDiv.scrollTop += 50;
  });

  window.electronAPI.onTriggerCopy(() => {
    if (emailText) {
      navigator.clipboard.writeText(emailText).catch(() => {});
    }
  });

  window.electronAPI.onTriggerSend(() => {
    if (!primaryEmail || !emailText) return;
    fetch('http://localhost:5000/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: primaryEmail, subject: 'Job Application', text: emailText })
    }).catch(err => console.error('Send failed', err));
  });
};
