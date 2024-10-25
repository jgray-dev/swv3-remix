import { WeatherDataResponse } from "~/functions/data";
import {skyRating} from "~/functions/rating";
import ColorGrid from "~/components/ColorGrid";

export function Details({
  data,
}: {
  data: {
    lat: number;
    lon: number;
    city: string;
    weatherData: WeatherDataResponse;
  };
}) {
  console.log(data.weatherData);
  const rating = skyRating(data.weatherData)
  console.log("RATING: ", rating)
  return (
    <div>
      Details component here. Lat: {data.lat}, Lon: {data.lon}, City:{" "}
      {data.city}
      <br/>
      <br/>
      <br/>
      TYPE: {data.weatherData["event-type"]}
      <br/>
      RATING: {rating}
      <br/>
      <br/>
      <ColorGrid data={data.weatherData.data}  event-time={data.weatherData["event-time"]} event-type={data.weatherData["event-type"]}/>
    </div>
  );
}
