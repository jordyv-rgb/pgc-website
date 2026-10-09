const test = require('node:test');
const assert = require('node:assert');
const { handler } = require('../netlify/functions/project-inquiry');

const valid = {
  division: 'COMMERCIAL', name: 'Pat Rivera', email: 'pat@example.com', location: 'Houston, TX',
  projectType: 'DRYWALL', budgetRange: 'FROM_50K_TO_100K', timeline: 'ONE_TO_THREE_MONTHS',
  details: 'Tenant finish-out, about 4,000 sq ft.', contactPermission: true,
};
const post = (body) => handler({ httpMethod: 'POST', body: JSON.stringify(body) });

test.beforeEach(() => {
  process.env.CONTRACTOR_OS_URL = 'https://os.example.com/';
  process.env.BOT_API_SECRET_INTAKE = 'intake-test';
});

test('rejects non-POST', async () => {
  assert.strictEqual((await handler({ httpMethod: 'GET' })).statusCode, 405);
});

test('honeypot returns success without calling Contractor OS', async () => {
  let called = false;
  global.fetch = async () => { called = true; };
  const res = await post({ ...valid, website: 'spam.example' });
  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(called, false);
});

test('rejects missing contact permission and missing contact method', async () => {
  assert.strictEqual((await post({ ...valid, contactPermission: false })).statusCode, 400);
  assert.strictEqual((await post({ ...valid, email: '', phone: '' })).statusCode, 400);
});

test('relays a valid inquiry with the intake secret server-side', async () => {
  let seen;
  global.fetch = async (url, opts) => { seen = { url, opts }; return { ok: true, status: 200 }; };
  const res = await post(valid);
  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(seen.url, 'https://os.example.com/api/bot/website-intake');
  assert.strictEqual(seen.opts.headers.Authorization, 'Bearer intake-test');
  const sent = JSON.parse(seen.opts.body);
  assert.ok(sent.submissionId.length >= 8);
  assert.strictEqual(sent.contactPermission, true);
  assert.ok(!res.body.includes('intake-test'));
});

test('upstream failure surfaces a calm fallback, not the secret or status', async () => {
  global.fetch = async () => ({ ok: false, status: 401 });
  const res = await post(valid);
  assert.strictEqual(res.statusCode, 502);
  assert.match(JSON.parse(res.body).error, /call or text/);
});

test('unconfigured server returns 503', async () => {
  delete process.env.BOT_API_SECRET_INTAKE;
  assert.strictEqual((await post(valid)).statusCode, 503);
});
