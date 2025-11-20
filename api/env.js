// Vercel Serverless Function to expose public Firebase config
module.exports = (req, res) => {
  // Layer 1: Origin validation - only allow your specific domains
  const allowedOrigins = [
    'https://sjrmnu.vercel.app',
    'https://sjrmnuweb-v1.vercel.app',
  ];
  
  const origin = req.headers.origin;
  const isAllowed = allowedOrigins.includes(origin);
  
  // Set CORS headers only for allowed origins
  if (isAllowed) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', 'none');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Layer 2: Block requests from non-allowed origins
  if (!isAllowed) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  
  try {
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
