# Email Validator API 📧✅

High-performance email validation API with comprehensive checks including syntax validation, MX record verification, disposable email detection, and reputation scoring.

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/your-template-id)

## 🚀 Features

- **Syntax Validation**: RFC 5322 compliant email syntax checking
- **MX Record Verification**: Real-time DNS MX record validation
- **Disposable Email Detection**: Identifies temporary/disposable email services
- **Reputation Scoring**: Advanced scoring algorithm for email trustworthiness
- **Rate Limiting**: Configurable rate limits by API key tier
- **Usage Tracking**: Built-in usage analytics and billing integration hooks
- **OpenAPI/Swagger Documentation**: Complete API documentation
- **Production Ready**: Deployed on Railway.app with monitoring

## 📊 Business Model

- **Revenue**: $0.05 per API call
- **Market**: RapidAPI marketplace with automatic customer discovery
- **Tiers**: Freemium model with usage-based pricing
- **Potential**: $500-5K/month by month 3

## 🔧 Quick Start

### Demo API

Try the live API instantly:

```bash
curl -X POST "https://email-validator-api-production.up.railway.app/validate" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: demo-key-123" \
  -d '{"email": "user@example.com"}'
```

### API Response

```json
{
  "valid": true,
  "reason": "Valid email address",
  "confidence": 0.95,
  "checks": {
    "syntax": true,
    "mx": true,
    "disposable": false,
    "reputation": 0.95
  }
}
```

## 📋 API Reference

### Authentication

Include your API key in the request header:

```
X-API-Key: your-api-key
```

**Demo API Keys:**
- `demo-key-123` - Free tier (100 requests/day)
- `premium-key-456` - Premium tier (10,000 requests/day)

### Endpoints

#### POST /validate
Validate an email address

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "valid": true,
  "reason": "Valid email address",
  "confidence": 0.95,
  "checks": {
    "syntax": true,
    "mx": true,
    "disposable": false,
    "reputation": 0.95
  }
}
```

#### GET /health
Health check endpoint

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "version": "1.0.0"
}
```

#### GET /usage
Get API usage statistics

**Response:**
```json
{
  "apiKey": "demo-key...",
  "tier": "free",
  "dailyLimit": 100,
  "dailyUsage": 25,
  "remaining": 75
}
```

## 🛠️ Local Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
git clone https://github.com/atlas/email-validator-api.git
cd email-validator-api
npm install
```

### Environment Setup

```bash
cp .env.example .env
```

Edit `.env` with your configuration.

### Run Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

### Documentation

Visit `http://localhost:3000/docs` for interactive Swagger documentation.

## 🚢 Deployment

### Railway.app (Recommended)

1. Fork this repository
2. Connect to Railway.app
3. Deploy with one click
4. Set environment variables in Railway dashboard

### Manual Deployment

```bash
# Build and start
npm install --production
npm start
```

## 📱 Code Examples

### JavaScript/Node.js

```javascript
const axios = require('axios');

async function validateEmail(email) {
  try {
    const response = await axios.post(
      'https://email-validator-api-production.up.railway.app/validate',
      { email },
      { headers: { 'X-API-Key': 'your-api-key' } }
    );
    return response.data;
  } catch (error) {
    console.error('Validation failed:', error.response.data);
  }
}

validateEmail('user@example.com').then(console.log);
```

### Python

```python
import requests

def validate_email(email, api_key):
    url = "https://email-validator-api-production.up.railway.app/validate"
    headers = {"X-API-Key": api_key}
    data = {"email": email}
    
    response = requests.post(url, json=data, headers=headers)
    return response.json()

result = validate_email("user@example.com", "your-api-key")
print(result)
```

### cURL

```bash
curl -X POST "https://email-validator-api-production.up.railway.app/validate" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{"email": "user@example.com"}'
```

### PHP

```php
<?php
$url = 'https://email-validator-api-production.up.railway.app/validate';
$data = ['email' => 'user@example.com'];
$headers = [
    'Content-Type: application/json',
    'X-API-Key: your-api-key'
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
curl_close($ch);

$result = json_decode($response, true);
print_r($result);
?>
```

## ❌ Error Codes

| Code | Description |
|------|-------------|
| `MISSING_EMAIL` | Email address is required in request body |
| `MISSING_API_KEY` | API key is required in headers |
| `INVALID_API_KEY` | Provided API key is invalid |
| `RATE_LIMIT_EXCEEDED` | Too many requests within time window |
| `DAILY_LIMIT_EXCEEDED` | Daily usage limit reached |
| `INTERNAL_ERROR` | Server error occurred |

## 📊 Validation Checks

### Syntax Validation
- RFC 5322 compliant regex checking
- Proper email format validation
- Special character handling

### MX Record Verification
- Real-time DNS lookup
- Mail exchanger record validation
- Domain deliverability check

### Disposable Email Detection
- Known disposable email service detection
- Temporary email provider identification
- Updated disposable domain database

### Reputation Scoring
- Trust scoring algorithm (0.0 to 1.0)
- Domain reputation analysis
- Historical validation patterns

## 💰 Pricing & Plans

### Free Tier
- 100 validations/day
- Basic support
- API key: `demo-key-123`

### Premium Tier  
- 10,000 validations/day
- Priority support
- Advanced analytics
- API key: `premium-key-456`

### Enterprise
- Unlimited validations
- Custom integrations
- Dedicated support
- Contact for pricing

## 🔗 RapidAPI Integration

This API is designed for seamless RapidAPI marketplace integration:

1. **OpenAPI Specification**: Complete Swagger documentation
2. **Standard Authentication**: API key in headers
3. **Rate Limiting**: Built-in usage tracking
4. **Error Handling**: Consistent error responses
5. **Monitoring**: Health checks and metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [API Docs](https://email-validator-api-production.up.railway.app/docs)
- **Issues**: [GitHub Issues](https://github.com/atlas/email-validator-api/issues)
- **Email**: support@email-validator-api.com

## 🎯 Roadmap

- [ ] Bulk email validation endpoint
- [ ] Webhook notifications
- [ ] Advanced analytics dashboard
- [ ] Machine learning reputation scoring
- [ ] Custom domain whitelist/blacklist
- [ ] International domain support

---

Built with ❤️ by Atlas for the RapidAPI marketplace