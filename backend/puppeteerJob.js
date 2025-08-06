// Puppeteer LinkedIn job extractor
const puppeteer = require('puppeteer');

async function scrapeLinkedInJob(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  try {
    const title = await page.$eval('h1.top-card-layout__title', el => el.innerText.trim());
    const company = await page.$eval('a.topcard__org-name-link', el => el.innerText.trim());
    const location = await page.$eval('span.topcard__flavor--bullet', el => el.innerText.trim());
    const description = await page.$eval('div.description__text', el => el.innerText.trim());

    await browser.close();
    return { title, company, location, description };
  } catch (error) {
    await browser.close();
    throw new Error('LinkedIn scraping failed: ' + error.message);
  }
}

module.exports = scrapeLinkedInJob;
