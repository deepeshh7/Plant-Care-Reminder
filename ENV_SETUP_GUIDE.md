# Environment Variables Setup Guide

This guide will help you set up all the required environment variables for the Plant Care Reminder App.

## Quick Setup

1. Copy the example file:
```bash
copy .env.example .env
```

2. Fill in your actual values in the `.env` file

## Required Environment Variables

### 1. Database Configuration

#### DATABASE_URL
PostgreSQL connection string for your database.

**Format:**
```
DATABASE_URL="postgresql://username:password@host:port/database"
```

**Example:**
```
DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/plantcare_db"
```

**Setup:**
1. Install PostgreSQL if not already installed
2. Create a new database: `CREATE DATABASE plantcare_db;`
3. Update the connection string with your credentials

---

### 2. NextAuth Configuration

#### NEXTAUTH_URL
The base URL of your application.

**Development:**
```
NEXTAUTH_URL="http://localhost:3000"
```

**Production:**
```
NEXTAUTH_URL="https://yourdomain.com"
```

#### NEXTAUTH_SECRET
Secret key used to encrypt JWT tokens.

**Generate:**
```bash
openssl rand -base64 32
```

**Example:**
```
NEXTAUTH_SECRET="Xk8vN2pQ9mR5tY7uI3oP6aS1dF4gH8jK"
```

---

### 3. Email Service (Resend)

#### RESEND_API_KEY
API key for sending emails via Resend.

**Setup:**
1. Sign up at [resend.com](https://resend.com)
2. Go to API Keys section
3. Create a new API key
4. Copy and paste into `.env`

**Example:**
```
RESEND_API_KEY="re_123456789abcdefghijklmnop"
```

**Note:** For testing, you can use a dummy key, but emails won't be sent.

---

### 4. Firebase Configuration (Push Notifications)

Firebase is used for push notifications. You need both Admin SDK (server-side) and Client SDK (client-side) credentials.

#### Firebase Admin SDK (Server Side)

**Setup:**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project (or create a new one)
3. Go to Project Settings > Service Accounts
4. Click "Generate New Private Key"
5. Download the JSON file

**Extract these values from the JSON:**

```
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
```

**Important:** Keep the `\n` characters in the private key.

#### Firebase Client SDK (Client Side)

**Setup:**
1. Go to Firebase Console > Project Settings > General
2. Scroll to "Your apps" section
3. Click on the Web app (or add one if none exists)
4. Copy the configuration values

```
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789012"
NEXT_PUBLIC_FIREBASE_APP_ID="1:123456789012:web:abcdef123456"
```

#### Firebase VAPID Key (for Web Push)

**Setup:**
1. Go to Firebase Console > Project Settings > Cloud Messaging
2. Scroll to "Web Push certificates"
3. Click "Generate key pair" if you don't have one
4. Copy the key

```
NEXT_PUBLIC_FIREBASE_VAPID_KEY="BAbCdEfGhIjKlMnOpQrStUvWxYz1234567890..."
```

---

### 5. Weather API (OpenWeather)

#### OPENWEATHER_API_KEY
API key for fetching weather data.

**Setup:**
1. Sign up at [openweathermap.org](https://openweathermap.org/api)
2. Go to API Keys section
3. Copy your API key (or generate a new one)

**Example:**
```
OPENWEATHER_API_KEY="your_openweather_api_key_here"
```

**Note:** Free tier allows 1,000 calls/day, which is sufficient for most use cases.

---

### 6. Cron Job Security

#### CRON_SECRET
Secret key for securing cron job endpoints.

**Generate:**
```bash
openssl rand -base64 32
```

**Example:**
```
CRON_SECRET="Ym9pN3pQ8mR4tY6uI2oP5aS0dF3gH7jK"
```

**Usage:**
When calling the cron endpoint, include this in the Authorization header:
```
Authorization: Bearer your-cron-secret-here
```

---

### 7. Node Environment

#### NODE_ENV
Specifies the environment mode.

**Development:**
```
NODE_ENV="development"
```

**Production:**
```
NODE_ENV="production"
```

---

## Complete .env File Example

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/plantcare_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="Xk8vN2pQ9mR5tY7uI3oP6aS1dF4gH8jK"

# Email
RESEND_API_KEY="re_123456789abcdefghijklmnop"

# Firebase Admin
FIREBASE_PROJECT_ID="plantcare-app-12345"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@plantcare-app-12345.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----"

# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="plantcare-app-12345.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="plantcare-app-12345"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="plantcare-app-12345.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789012"
NEXT_PUBLIC_FIREBASE_APP_ID="1:123456789012:web:abcdef123456"
NEXT_PUBLIC_FIREBASE_VAPID_KEY="BAbCdEfGhIjKlMnOpQrStUvWxYz1234567890..."

# Weather
OPENWEATHER_API_KEY="your_openweather_api_key_here"

# Cron
CRON_SECRET="Ym9pN3pQ8mR4tY6uI2oP5aS0dF3gH7jK"

# Environment
NODE_ENV="development"
```

---

## Testing Configuration

For running tests, you can create a separate `.env.test` file:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/plantcare_test"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="test-secret-key"
RESEND_API_KEY="test-key"
NODE_ENV="test"
```

---

## Verification

After setting up your `.env` file, verify the configuration:

### 1. Database Connection
```bash
npx prisma migrate dev
```

### 2. Start Development Server
```bash
pnpm dev
```

### 3. Test Email Notifications
Visit: `http://localhost:3000/api/notifications/test`

### 4. Check Environment Variables
Create a test endpoint or check the console logs to ensure variables are loaded.

---

## Security Best Practices

1. **Never commit `.env` to version control**
   - Add `.env` to `.gitignore`
   - Only commit `.env.example`

2. **Use strong secrets**
   - Generate random keys using `openssl rand -base64 32`
   - Don't use simple or predictable values

3. **Rotate keys regularly**
   - Change API keys periodically
   - Update secrets after team member changes

4. **Use different values for different environments**
   - Development, staging, and production should have separate credentials

5. **Restrict API key permissions**
   - Use minimum required permissions for each service
   - Set up usage limits and alerts

---

## Troubleshooting

### Database Connection Issues
```
Error: Can't reach database server
```
**Solution:** Check if PostgreSQL is running and credentials are correct.

### NextAuth Errors
```
Error: NEXTAUTH_SECRET is not set
```
**Solution:** Ensure NEXTAUTH_SECRET is set in `.env` file.

### Email Not Sending
```
Error: RESEND_API_KEY is not configured
```
**Solution:** Add valid Resend API key or use test mode.

### Firebase Push Notification Errors
```
Error: Firebase Admin not initialized
```
**Solution:** Verify all Firebase credentials are correctly set.

### Weather API Errors
```
Error: Invalid API key
```
**Solution:** Check OpenWeather API key is valid and active.

---

## Additional Resources

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Prisma Connection URLs](https://www.prisma.io/docs/reference/database-reference/connection-urls)
- [NextAuth Configuration](https://next-auth.js.org/configuration/options)
- [Resend Documentation](https://resend.com/docs)
- [Firebase Admin SDK Setup](https://firebase.google.com/docs/admin/setup)
- [OpenWeather API](https://openweathermap.org/api)

---

## Support

If you encounter issues:
1. Check this guide for common solutions
2. Verify all environment variables are set correctly
3. Check service status (Firebase, Resend, OpenWeather)
4. Review application logs for specific error messages
