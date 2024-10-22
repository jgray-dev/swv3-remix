export function Details({ data }: { data: { lat: number; lon: number } }) {
  console.log("Details component here. data: ", data);
  return <div>Details component here. Lat: {data.lat}, Lon: {data.lon}</div>;
}