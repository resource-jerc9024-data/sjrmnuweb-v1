module.exports = (req, res) => {
  // Layer 1: Origin validation
  const allowedOrigins = ['http://sjrmnu.vercel.app', 'http://sjrmnuweb-v1.vercel.app'];
  const origin = req.headers.origin;
  const isAllowed = allowedOrigins.includes(origin);
  
  if (!isAllowed) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // Set CORS headers for allowed origin
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  
  try {
    // Return ALL Firebase config fields your application expects
    res.status(200).json({
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY || '',
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN || '',
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || '',
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET || '',
      FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID || ''
    });
  } catch (error) {
    console.error('Error in env API:', error);
    res.status(500).json({ error: 'Failed to load environment variables' });
  }
};
