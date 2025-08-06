// Express backend entry
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

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

  const prompt = `Write a professional, personalized cold email for a job application.\n
Job Description:\n${jobDescription}\n
Candidate Profile:\n${userProfile}\n
Be concise, enthusiastic, and tailored to the job.`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4', // You can use 'gpt-3.5-turbo' if needed
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

module.exports = app;
