// Keep Render warm: pings /health every few minutes.
// Run anywhere else: GitHub Actions cron, local cron, Fly, etc.
// Usage: BACKEND_URL=https://bitchess-za11.onrender.com node keep-warm.js
const BACKEND_URL = process.env.BACKEND_URL || process.argv[2];

if (!BACKEND_URL) {
    console.error('Usage: BACKEND_URL=<url> node keep-warm.js');
    process.exit(1);
}

const url = BACKEND_URL.replace(/\/$/, '') + '/health';

async function ping() {
    try {
        const res = await fetch(url);
        console.log(new Date().toISOString(), res.status, await res.text());
    } catch (e) {
        console.error(new Date().toISOString(), 'warm ping failed:', e.message);
    }
}

ping();
