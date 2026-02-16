const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const { promises: dns } = require('dns');
const validator = require('validator');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security and middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Load disposable email domains (common ones)
const DISPOSABLE_DOMAINS = new Set([
  '10minutemail.com', 'guerrillamail.com', 'mailinator.com', 'tempmail.org',
  'throwaway.email', 'temp-mail.org', 'getairmail.com', 'yopmail.com',
  'maildrop.cc', 'tempail.com', 'dispostable.com', 'trashmail.com'
]);

// In-memory storage for API usage (in production, use Redis/MongoDB)
const apiUsage = new Map();
const apiKeys = new Map([
  ['demo-key-123', { tier: 'free', limit: 100 }],
  ['premium-key-456', { tier: 'premium', limit: 10000 }]
]);

// Rate limiting by tier
const createRateLimit = (windowMs, max) => rateLimit({
  windowMs,
  max,
  message: { error: 'Too many requests', code: 'RATE_LIMIT_EXCEEDED' },
  standardHeaders: true,
  legacyHeaders: false
});

// Authentication middleware
const authenticate = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API key required', code: 'MISSING_API_KEY' });
  }
  
  const keyData = apiKeys.get(apiKey);
  if (!keyData) {
    return res.status(401).json({ error: 'Invalid API key', code: 'INVALID_API_KEY' });
  }
  
  req.apiKey = apiKey;
  req.keyData = keyData;
  next();
};

// Usage tracking middleware
const trackUsage = (req, res, next) => {
  const { apiKey } = req;
  const today = new Date().toISOString().split('T')[0];
  const usageKey = `${apiKey}:${today}`;
  
  const currentUsage = apiUsage.get(usageKey) || 0;
  if (currentUsage >= req.keyData.limit) {
    return res.status(429).json({ 
      error: 'Daily limit exceeded', 
      code: 'DAILY_LIMIT_EXCEEDED',
      limit: req.keyData.limit,
      usage: currentUsage
    });
  }
  
  apiUsage.set(usageKey, currentUsage + 1);
  next();
};

// Apply rate limiting
app.use('/validate', createRateLimit(15 * 60 * 1000, 100)); // 100 requests per 15 minutes

// Email validation functions
const validateSyntax = (email) => {
  return validator.isEmail(email);
};

const isDisposableEmail = (email) => {
  const domain = email.split('@')[1]?.toLowerCase();
  return DISPOSABLE_DOMAINS.has(domain);
};

const checkMXRecord = async (domain) => {
  try {
    const records = await dns.resolveMx(domain);
    return records.length > 0;
  } catch (error) {
    return false;
  }
};

const calculateReputation = (email, hasMX, isDisposable) => {
  let score = 0.5; // Base score
  
  const domain = email.split('@')[1]?.toLowerCase();
  
  // Common email providers get higher scores
  const trustedDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'];
  if (trustedDomains.includes(domain)) {
    score += 0.3;
  }
  
  // MX record exists
  if (hasMX) {
    score += 0.2;
  }
  
  // Not disposable
  if (!isDisposable) {
    score += 0.2;
  }
  
  // Domain length (reasonable domains)
  if (domain && domain.length > 3 && domain.length < 50) {
    score += 0.1;
  }
  
  return Math.min(1.0, Math.max(0.0, score));
};

// API Routes
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.post('/validate', authenticate, trackUsage, async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        error: 'Email address is required', 
        code: 'MISSING_EMAIL' 
      });
    }
    
    // Syntax validation
    const syntaxValid = validateSyntax(email);
    if (!syntaxValid) {
      return res.json({
        valid: false,
        reason: 'Invalid email syntax',
        confidence: 0.0,
        checks: {
          syntax: false,
          mx: null,
          disposable: null,
          reputation: 0.0
        }
      });
    }
    
    const domain = email.split('@')[1];
    
    // Parallel checks
    const [hasMX, isDisposable] = await Promise.all([
      checkMXRecord(domain),
      Promise.resolve(isDisposableEmail(email))
    ]);
    
    const reputation = calculateReputation(email, hasMX, isDisposable);
    
    // Determine validity
    const valid = syntaxValid && hasMX && !isDisposable && reputation > 0.6;
    
    let reason = '';
    if (!hasMX) reason = 'Domain has no MX record';
    else if (isDisposable) reason = 'Disposable email address';
    else if (reputation <= 0.6) reason = 'Low reputation score';
    else reason = 'Valid email address';
    
    res.json({
      valid,
      reason,
      confidence: reputation,
      checks: {
        syntax: syntaxValid,
        mx: hasMX,
        disposable: isDisposable,
        reputation
      }
    });
    
  } catch (error) {
    console.error('Validation error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      code: 'INTERNAL_ERROR' 
    });
  }
});

// API usage stats endpoint
app.get('/usage', authenticate, (req, res) => {
  const { apiKey } = req;
  const today = new Date().toISOString().split('T')[0];
  const usageKey = `${apiKey}:${today}`;
  const usage = apiUsage.get(usageKey) || 0;
  
  res.json({
    apiKey: apiKey.substring(0, 8) + '...',
    tier: req.keyData.tier,
    dailyLimit: req.keyData.limit,
    dailyUsage: usage,
    remaining: req.keyData.limit - usage
  });
});

// Swagger documentation
try {
  const swaggerDocument = YAML.load('./swagger.yaml');
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (error) {
  console.log('Swagger documentation not available');
}

app.get('/', (req, res) => {
  res.json({
    name: 'Email Validator API',
    version: '1.0.0',
    description: 'High-performance email validation API',
    endpoints: {
      validate: 'POST /validate',
      health: 'GET /health',
      usage: 'GET /usage',
      docs: 'GET /docs'
    }
  });
});

app.listen(PORT, () => {
  console.log(`Email Validator API running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Documentation: http://localhost:${PORT}/docs`);
});

module.exports = app;