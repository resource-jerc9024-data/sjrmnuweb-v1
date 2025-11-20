module.exports = (req, res) => {
  // Layer 1: Origin validation
  const allowedOrigins = ['https://sjrmnu.vercel.app', 'https://sjrmnuweb-v1.vercel.app'];
  const origin = req.headers.origin;
  const isAllowed = allowedOrigins.includes(origin);
  
  if (!isAllowed) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // Layer 2: CORS setup
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Layer 3: Only return public config
  res.json({
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
    // NO API KEYS!
  });
};
