interface DetailsProps {
  data: {
    name: string;
    coordinates: { lat: number; lon: number };
    weather: { temperature: number; condition: string };
  };
}

export function Details({ data }: DetailsProps) {
  return (
    <div>
      <h2>Details for {data.name}</h2>
      <p>Coordinates: {data.coordinates.lat}, {data.coordinates.lon}</p>
      <h3>Weather</h3>
      <p>Temperature: {data.weather.temperature}°F</p>
      <p>Condition: {data.weather.condition}</p>
    </div>
  );
}