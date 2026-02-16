# Deployment Guide 🚀

## Quick Deploy to Railway

### Option 1: Direct Deploy (Recommended)

1. **Fork/Clone this repository**
2. **Connect to Railway:**
   - Go to [railway.app](https://railway.app)
   - Sign in with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select this repository

3. **Set Environment Variables:**
   - `NODE_ENV=production`
   - Optionally set `PORT` (Railway will set this automatically)

4. **Deploy:**
   - Railway will automatically build and deploy
   - Your API will be live at: `https://your-app-name.up.railway.app`

### Option 2: Railway CLI

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and Deploy:**
   ```bash
   railway login
   cd email-validator-api
   railway init
   railway up
   ```

## Environment Variables

Required for production:
- `NODE_ENV=production`
- `PORT` (automatically set by Railway)

Optional:
- `RATE_LIMIT_WINDOW_MS=900000` (15 minutes)
- `RATE_LIMIT_MAX_REQUESTS=100`

## Post-Deployment

1. **Test your deployment:**
   ```bash
   curl https://your-app-name.up.railway.app/health
   ```

2. **Verify API endpoint:**
   ```bash
   curl -X POST "https://your-app-name.up.railway.app/validate" \
     -H "Content-Type: application/json" \
     -H "X-API-Key: demo-key-123" \
     -d '{"email": "test@example.com"}'
   ```

3. **Check documentation:**
   Visit: `https://your-app-name.up.railway.app/docs`

## RapidAPI Integration

### Prepare for RapidAPI Listing:

1. **API is Ready:** The API is already configured with:
   - OpenAPI/Swagger specification
   - Proper authentication headers
   - Rate limiting
   - Error handling
   - Usage tracking

2. **Submit to RapidAPI:**
   - Go to [rapidapi.com](https://rapidapi.com/developer/dashboard)
   - Add new API
   - Upload the `swagger.yaml` file
   - Set base URL to your Railway deployment
   - Configure pricing ($0.05 per call)

3. **Update API Keys:**
   Replace demo keys with real RapidAPI keys in production

## Scaling

For higher traffic:

1. **Upgrade Railway Plan:** For more CPU/memory
2. **Add Redis:** For distributed usage tracking
   ```javascript
   // In server.js, replace Map with Redis
   const redis = require('redis');
   const client = redis.createClient(process.env.REDIS_URL);
   ```

3. **Add Database:** For persistent analytics
   ```javascript
   // Add MongoDB/PostgreSQL for usage analytics
   const mongoose = require('mongoose');
   mongoose.connect(process.env.MONGODB_URL);
   ```

## Monitoring

Railway provides built-in:
- CPU/Memory usage
- Request logs
- Uptime monitoring
- Health checks

## Troubleshooting

### Common Issues:

1. **Port Issues:** Railway automatically sets PORT, don't override
2. **DNS Timeouts:** Increase timeout for MX lookups in production
3. **Rate Limiting:** Adjust limits based on your Railway plan

### Health Check Fails:
- Check `/health` endpoint responds
- Verify app starts within 30 seconds
- Check Railway logs for errors

## Cost Estimation

Railway Free Tier:
- $0/month for starter usage
- Upgrade to $5/month for production

Potential Revenue at $0.05/call:
- 1,000 calls/month = $50/month
- 10,000 calls/month = $500/month
- 100,000 calls/month = $5,000/month

## Security

Production recommendations:
- Replace demo API keys
- Add rate limiting per IP
- Enable HTTPS only (Railway provides this)
- Add request logging
- Monitor for abuse patterns

Your Email Validator API is ready for production! 🎉