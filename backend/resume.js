const { OpenAI } = require('openai');
const puppeteer = require('puppeteer');

/**
 * Generate a tailored resume and return it as a PDF buffer
 * @param {string} jobDescription
 * @param {string} userProfile
 * @returns {Promise<Buffer>}
 */
async function generateResume(jobDescription, userProfile) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `Using the job description below, write a customized professional resume for the candidate described.\n\nJob Description:\n${jobDescription}\n\nCandidate:\n${userProfile}\n\nResume:`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }]
  });

  const resumeText = completion.choices[0].message.content;

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setContent(`<pre style="font-family:Helvetica;white-space:pre-wrap;">${resumeText.replace(/</g, '&lt;')}</pre>`);
  const pdfBuffer = await page.pdf({ format: 'A4' });
  await browser.close();
  return pdfBuffer;
}

module.exports = { generateResume };
