// Stand-in for the extension APIs and for Lemon Squeezy, so the free edition's real popup
// runs inside the Keyturn Kit homepage. Nothing here is sent anywhere.
const DEMO_KEY = 'KEYTURN-DEMO-2026';
const store = {};
const ev = { addListener() {}, removeListener() {}, hasListener() { return false; } };
// The popup re-renders when storage changes, so the stand-in has to announce changes like Chrome does.
const listeners = new Set();
const changed = { addListener: (f) => listeners.add(f), removeListener: (f) => listeners.delete(f), hasListener: (f) => listeners.has(f) };
const announce = (changes) => { for (const f of listeners) { try { f(changes, 'local'); } catch {} } };
const area = {
  get: async (k) => (k == null ? { ...store } : typeof k === 'string' ? { [k]: store[k] } : Array.isArray(k) ? Object.fromEntries(k.map((x) => [x, store[x]])) : { ...k, ...store }),
  set: async (o) => {
    const changes = Object.fromEntries(Object.entries(o).map(([k, v]) => [k, { oldValue: store[k], newValue: v }]));
    Object.assign(store, o);
    announce(changes);
  },
  remove: async (k) => {
    const changes = Object.fromEntries([].concat(k).map((x) => [x, { oldValue: store[x] }]));
    [].concat(k).forEach((x) => delete store[x]);
    announce(changes);
  },
  onChanged: changed,
  getBytesInUse: async () => 0,
};
globalThis.chrome = globalThis.browser = {
  runtime: { id: 'demo', getURL: (p) => p, onMessage: ev, onInstalled: ev, onStartup: ev, sendMessage: async () => undefined, getManifest: () => ({ version: '1.0.0', manifest_version: 3 }) },
  storage: { local: area, session: area, sync: area, onChanged: changed },
  alarms: { create() {}, clear: async () => true, onAlarm: ev, get: async () => undefined },
  tabs: { create: async () => ({}) },
};

const realFetch = globalThis.fetch.bind(globalThis);
globalThis.fetch = async (url, init) => {
  if (!String(url).startsWith('https://api.lemonsqueezy.com/')) return realFetch(url, init);
  await new Promise((r) => setTimeout(r, 450));
  const key = new URLSearchParams(String(init?.body ?? '')).get('license_key')?.trim();
  const json = (status, body) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
  if (key !== DEMO_KEY) return json(404, { activated: false, valid: false, error: 'license_key not found.' });
  const body = {
    license_key: { key, status: 'active', expires_at: null },
    instance: { id: 'demo-instance' },
    meta: { store_id: 0, product_id: 1, variant_name: 'Pro', customer_email: 'buyer@example.com' },
  };
  return json(200, { ...body, activated: true, valid: true, error: null });
};

// Links inside the demo point at placeholder checkout and settings pages; tell the host page instead.
document.addEventListener('click', (e) => {
  const a = e.target.closest?.('a');
  if (!a) return;
  e.preventDefault();
  parent.postMessage({ keyturnDemo: a.textContent.trim() }, location.origin);
}, true);
