// Express backend entry
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const nodemailer = require('nodemailer');
const { findHiringManagers } = require('./apollo');
const { generateResume } = require('./resume');

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const scrapeLinkedInJob = require('./puppeteerJob');

app.post('/scrape-job', async (req, res) => {
  const { jobUrl } = req.body;
  if (!jobUrl) return res.status(400).json({ error: 'Missing jobUrl' });

  try {
    const jobData = await scrapeLinkedInJob(jobUrl);
    res.json(jobData);
  } catch (err) {
    console.error('Scraping failed:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/', (req, res) => {
  res.send('Job Assistant backend is running');
});

// Email generation endpoint
app.post('/generate-email', async (req, res) => {
  const { jobDescription, userProfile } = req.body;

  if (!jobDescription || !userProfile) {
    return res.status(400).json({ error: 'Missing job description or user profile' });
  }

  const prompt = `Write a professional, personalized cold email for a job application.\nJob Description:\n${jobDescription}\nCandidate Profile:\n${userProfile}\nBe concise, enthusiastic, and tailored to the job.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'user', content: prompt }
      ]
    });

    const emailContent = completion.choices[0].message.content;
    res.json({ email: emailContent });
  } catch (error) {
    console.error('Error from OpenAI:', error.message);
    res.status(500).json({ error: 'Failed to generate email using OpenAI.' });
  }
});

// Find hiring manager emails
app.post('/find-hiring-manager', async (req, res) => {
  const { company } = req.body;
  if (!company) return res.status(400).json({ error: 'Missing company' });

  try {
    const contacts = await findHiringManagers(company);
    res.json({ contacts });
  } catch (err) {
    console.error('Apollo search failed:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Resume generation endpoint
app.post('/generate-resume', async (req, res) => {
  const { jobDescription, userProfile } = req.body;
  if (!jobDescription || !userProfile) {
    return res.status(400).json({ error: 'Missing job description or user profile' });
  }

  try {
    const pdfBuffer = await generateResume(jobDescription, userProfile);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"');
    res.send(pdfBuffer);
  } catch (err) {
    console.error('Resume generation failed:', err.message);
    res.status(500).json({ error: 'Resume generation failed' });
  }
});

// Send email endpoint
app.post('/send-email', async (req, res) => {
  const { to, subject, text } = req.body;
  if (!to || !text) return res.status(400).json({ error: 'Missing recipient or content' });

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });

    await transporter.sendMail({ from: process.env.SMTP_USER, to, subject: subject || 'Job Application', text });
    res.json({ status: 'sent' });
  } catch (err) {
    console.error('Email send failed:', err.message);
    res.status(500).json({ error: 'Email send failed' });
  }
});

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
