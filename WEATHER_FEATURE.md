# Weather-Based Watering Feature

## Overview
Your app now includes intelligent weather-based watering adjustments that automatically skip or modify watering reminders based on local weather conditions.

## How It Works

### Weather Conditions Checked:
- **Rainfall**: Skips watering if it rained more than 5mm recently
- **High Humidity + Cool**: Reduces watering when humidity > 85% and temp < 20°C
- **Hot & Dry**: Suggests extra watering when temp > 30°C and humidity < 40%

### Only Affects Watering Tasks
- Fertilizing schedules are not affected by weather
- Users can enable/disable this feature per account

## Setup Instructions

### 1. Get OpenWeatherMap API Key (Free)

1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Go to **API Keys** section
4. Copy your API key
5. Add to your `.env` file:
   ```bash
   OPENWEATHER_API_KEY="your-api-key-here"
   ```

### 2. Update Database Schema

Run the Prisma migration:
```bash
npx prisma db push
```

This adds:
- `city` field to User model (stores location)
- `weatherEnabled` field to User model (toggle feature)

### 3. User Configuration

Users can configure weather settings at `/settings`:
1. Enable "Weather-Based Watering"
2. Enter their city name (e.g., "London", "New York")
3. Save settings

## Features Added

### Files Created:
- `lib/weather/weather-service.ts` - Weather API integration
- `app/(dashboard)/settings/page.tsx` - Settings UI
- `app/api/user/settings/route.ts` - Settings API

### Files Modified:
- `prisma/schema.prisma` - Added city and weatherEnabled fields
- `app/api/cron/check-tasks/route.ts` - Weather checking logic
- `.env.example` - Added OPENWEATHER_API_KEY

## How Cron Job Works Now

1. Finds due watering tasks
2. Checks if user has weather enabled
3. Fetches current weather for user's city
4. Decides whether to send reminder:
   - **Skip**: If it rained or conditions are too humid
   - **Send**: Normal conditions or hot/dry weather
   - **Postpone**: Checks again tomorrow if skipped

## Testing

1. Enable weather in settings
2. Set your city
3. Create a watering schedule
4. The cron job will check weather before sending reminders

## API Limits

OpenWeatherMap Free Tier:
- 1,000 calls/day
- 60 calls/minute
- Weather data cached for 1 hour

This is sufficient for most use cases since weather is only checked when tasks are due.

## Future Enhancements

Potential improvements:
- Store user's exact coordinates for more accurate weather
- Add weather forecast to predict upcoming conditions
- Show weather info in the UI when viewing tasks
- Seasonal adjustments (winter vs summer watering)
- Plant-specific weather preferences
