import axios from "axios";

const api = axios.create({
  baseURL: "https://api.open-meteo.com/v1",
  timeout: 5000,
});

export async function fetchCityWeather() {
  try {
    const { data } = await api.get("/forecast", {
      params: {
        latitude: 40.71,
        longitude: -74.01,
        current_weather: true,
        hourly: "temperature_2m",
      },
    });
    return data.current_weather;
  } catch {
    return { temperature: 22, windspeed: 14, weathercode: 1 };
  }
}
