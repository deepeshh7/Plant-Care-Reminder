interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
  description: string;
}

interface WateringAdjustment {
  shouldWater: boolean;
  adjustmentFactor: number; // 0.5 = skip, 1.0 = normal, 1.5 = water more
  reason: string;
}

export async function getWeatherData(location: string): Promise<WeatherData | null> {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    if (!apiKey) {
      console.warn('OpenWeather API key not configured');
      return null;
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!response.ok) {
      console.error('Weather API error:', response.statusText);
      return null;
    }

    const data = await response.json();

    return {
      temperature: data.main.temp,
      humidity: data.main.humidity,
      rainfall: data.rain?.['1h'] || 0,
      description: data.weather[0]?.description || 'unknown',
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    return null;
  }
}

export function calculateWateringAdjustment(
  weather: WeatherData | null,
  taskType: string
): WateringAdjustment {
  // Only adjust watering tasks
  if (taskType !== 'WATERING') {
    return {
      shouldWater: true,
      adjustmentFactor: 1.0,
      reason: 'Not a watering task',
    };
  }

  // If no weather data, proceed normally
  if (!weather) {
    return {
      shouldWater: true,
      adjustmentFactor: 1.0,
      reason: 'Weather data unavailable',
    };
  }

  const { temperature, humidity, rainfall } = weather;

  // Skip watering if it rained recently (more than 5mm)
  if (rainfall > 5) {
    return {
      shouldWater: false,
      adjustmentFactor: 0,
      reason: `Recent rainfall (${rainfall.toFixed(1)}mm) - skipping watering`,
    };
  }

  // Skip watering if very high humidity (>85%) and cool temperature
  if (humidity > 85 && temperature < 20) {
    return {
      shouldWater: false,
      adjustmentFactor: 0.5,
      reason: `High humidity (${humidity}%) and cool weather - reducing watering`,
    };
  }

  // Increase watering frequency in hot, dry conditions
  if (temperature > 30 && humidity < 40) {
    return {
      shouldWater: true,
      adjustmentFactor: 1.5,
      reason: `Hot (${temperature}°C) and dry (${humidity}% humidity) - may need extra water`,
    };
  }

  // Normal watering
  return {
    shouldWater: true,
    adjustmentFactor: 1.0,
    reason: `Normal conditions (${temperature}°C, ${humidity}% humidity)`,
  };
}

export async function shouldWaterBasedOnWeather(
  location: string | null,
  taskType: string
): Promise<WateringAdjustment> {
  if (!location) {
    return {
      shouldWater: true,
      adjustmentFactor: 1.0,
      reason: 'No location set',
    };
  }

  const weather = await getWeatherData(location);
  return calculateWateringAdjustment(weather, taskType);
}
