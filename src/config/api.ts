// API Configuration
// In development, fallback to localhost:3001 if REACT_APP_API_URL is not set
// In production, REACT_APP_API_URL must be set
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : '');

if (!API_BASE_URL) {
  console.error('REACT_APP_API_URL environment variable is not set');
}

export default API_BASE_URL;


