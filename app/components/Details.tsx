import { useEffect } from "react";
import { fetchWeatherApi } from "openmeteo";

async function fetchWeatherData(
  latitude: number,
  longitude: number
): Promise<WeatherData> {
  console.log(
    `[FETCH] Starting weather data fetch for lat: ${latitude}, lon: ${longitude}`
  );

  try {
    const params = {
      latitude: latitude,
      longitude: longitude,
      hourly: [
        "cloud_cover",
        "cloud_cover_low",
        "cloud_cover_mid",
        "cloud_cover_high",
        "is_day",
      ],
      past_days: 1,
      forecast_days: 1,
    };

    console.log("[FETCH] Params configured:", params);

    const url = "https://api.open-meteo.com/v1/forecast";
    console.log("[FETCH] Initiating API call to:", url);

    const responses = await fetchWeatherApi(url, params);
    console.log("[FETCH] Received API response");

    if (!responses || responses.length === 0) {
      throw new Error("No response received from weather API");
    }

    const response = responses[0];
    if (!response) {
      throw new Error("First response is undefined");
    }

    const utcOffsetSeconds = response.utcOffsetSeconds();
    const hourly = response.hourly();

    if (!hourly) {
      throw new Error("Hourly data is missing from response");
    }

    const range = (start: number, stop: number, step: number) =>
      Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

    const processedData = {
      hourly: {
        time: range(
          Number(hourly.time()),
          Number(hourly.timeEnd()),
          hourly.interval()
        ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
        cloudCover: hourly.variables(0)?.valuesArray() ?? new Float32Array(),
        cloudCoverLow: hourly.variables(1)?.valuesArray() ?? new Float32Array(),
        cloudCoverMid: hourly.variables(2)?.valuesArray() ?? new Float32Array(),
        cloudCoverHigh:
          hourly.variables(3)?.valuesArray() ?? new Float32Array(),
        isDay: hourly.variables(4)?.valuesArray() ?? new Float32Array(),
      },
    };
    return processedData;
  } catch (error) {
    console.error("[FETCH] Error in fetchWeatherData:", error);
    throw error; // Re-throw to be handled by caller
  }
}

export function Details({ data }: { data: { lat: number; lon: number, city: string } }) {
  console.log("Details component here. data: ", data);

  useEffect(() => {
    const weatherData = fetchWeatherData(data.lat, data.lon);
    console.log(weatherData);
  }, [data.lat, data.lon]);

  return (
    <div>
      Details component here. Lat: {data.lat}, Lon: {data.lon}, City: {data.city}
    </div>
  );
}

interface CloudData {
  high: number;
  mid: number;
  low: number;
}

interface WeatherData {
  hourly: {
    time: Date[];
    cloudCover: Float32Array;
    cloudCoverLow: Float32Array;
    cloudCoverMid: Float32Array;
    cloudCoverHigh: Float32Array;
    isDay: Float32Array;
  };
}
