// Netlify Function — relays the project-inquiry form to Contractor OS.
// Env vars required: CONTRACTOR_OS_URL, BOT_API_SECRET_INTAKE (intake-only secret, never sent to the browser)
// Contractor OS re-validates everything; this layer only shapes and rate-limits the request.

const crypto = require('crypto');

const PROJECT_TYPES = ['DRYWALL', 'FINISHING', 'METAL_FRAMING', 'PAINTING', 'FLOORING', 'TENANT_IMPROVEMENT', 'KITCHEN', 'BATHROOM', 'OTHER'];
const BUDGETS = ['UNDER_25K', 'FROM_25K_TO_50K', 'FROM_50K_TO_100K', 'FROM_100K_TO_250K', 'FROM_250K_TO_500K', 'FROM_500K_TO_800K', 'ABOVE_800K', 'NOT_SURE'];
const TIMELINES = ['ASAP', 'ONE_TO_THREE_MONTHS', 'THREE_TO_SIX_MONTHS', 'PLANNING'];
const DIVISIONS = ['COMMERCIAL', 'RESIDENTIAL'];
const SITE_URL = 'https://prominentgcllc.com/';

const json = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  body: JSON.stringify(body),
});

const clean = (value, max) => (typeof value === 'string' ? value.trim().slice(0, max) : '');

function buildPayload(input) {
  const email = clean(input.email, 254);
  const phone = clean(input.phone, 40);
  const payload = {
    submissionId: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
    sourceUrl: /^https?:\/\//.test(input.sourceUrl || '') ? clean(input.sourceUrl, 1000) : SITE_URL,
    division: input.division,
    name: clean(input.name, 120),
    location: clean(input.location, 300),
    projectType: input.projectType,
    budgetRange: input.budgetRange,
    timeline: input.timeline,
    details: clean(input.details, 5000),
    contactPermission: input.contactPermission === true || input.contactPermission === 'on',
  };
  const company = clean(input.company, 200);
  if (company) payload.company = company;
  if (email) payload.email = email;
  if (phone) payload.phone = phone;
  return payload;
}

function validate(p) {
  if (p.name.length < 2) return 'Please share your name.';
  if (!p.email && !p.phone) return 'Please share an email or phone number.';
  if (p.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) return 'That email address looks incomplete.';
  if (p.location.length < 2) return 'Please share the project location.';
  if (p.details.length < 10) return 'A few more details about the project will help.';
  if (!DIVISIONS.includes(p.division) || !PROJECT_TYPES.includes(p.projectType) ||
      !BUDGETS.includes(p.budgetRange) || !TIMELINES.includes(p.timeline)) return 'Please complete each selection.';
  if (p.contactPermission !== true) return 'Please confirm we may contact you about this project.';
  return null;
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });

  let input;
  try { input = JSON.parse(event.body || ''); } catch { return json(400, { error: 'Invalid request.' }); }
  if (!input || typeof input !== 'object') return json(400, { error: 'Invalid request.' });

  // Honeypot: bots fill the hidden field. Pretend success so they learn nothing.
  if (clean(input.website, 200)) return json(200, { ok: true });

  const payload = buildPayload(input);
  const problem = validate(payload);
  if (problem) return json(400, { error: problem });

  const base = (process.env.CONTRACTOR_OS_URL || '').replace(/\/+$/, '');
  const secret = process.env.BOT_API_SECRET_INTAKE;
  if (!base || !secret) return json(503, { error: 'Inquiries are temporarily unavailable. Please call or text 713-823-6513.' });

  try {
    const res = await fetch(`${base}/api/bot/website-intake`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${secret}` },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      console.error('website-intake rejected', res.status);
      return json(502, { error: 'We could not record your request. Please call or text 713-823-6513.' });
    }
    return json(200, { ok: true });
  } catch (err) {
    console.error('website-intake unreachable', err && err.name);
    return json(502, { error: 'We could not record your request. Please call or text 713-823-6513.' });
  }
};

exports._internals = { buildPayload, validate };
