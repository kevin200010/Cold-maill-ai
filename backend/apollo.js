const axios = require('axios');

/**
 * Find possible hiring manager contacts for a company using Apollo.io
 * @param {string} company - Company name to search
 * @returns {Promise<Array<{name: string, email: string}>>}
 */
async function findHiringManagers(company) {
  const apiKey = process.env.APOLLO_API_KEY;
  if (!apiKey) {
    throw new Error('Missing APOLLO_API_KEY');
  }

  const url = 'https://api.apollo.io/v1/people/search';
  const payload = {
    api_key: apiKey,
    q_organization: company,
    q_title: 'recruiter OR talent acquisition OR hiring manager',
    page: 1
  };

  const response = await axios.post(url, payload, {
    headers: { 'Content-Type': 'application/json' }
  });

  const people = response.data.people || [];
  return people
    .filter(p => p.email)
    .map(p => ({ name: `${p.first_name} ${p.last_name}`.trim(), email: p.email }));
}

module.exports = { findHiringManagers };
