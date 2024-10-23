import {
  json,
  LoaderFunction,
  ActionFunction,
  redirect,
} from "@remix-run/cloudflare";
import LocationService, { LocationData } from "~/components/LocationService";
import { useLoaderData } from "@remix-run/react";
import { Details } from "~/components/Details";

function isLocationData(data: any): data is LocationData {
  return (
    typeof data === "object" &&
    data !== null &&
    (data.type === "geolocation" || data.type === "input") &&
    (data.type === "geolocation"
      ? typeof data.data === "object" && "coords" in data.data
      : typeof data.data === "string")
  );
}

export const action: ActionFunction = async ({ request, context }) => {
  const formData = await request.formData();
  const locationDataString = formData.get("locationData");
  if (typeof locationDataString !== "string") {
    return json({ error: "Invalid location data" }, { status: 400 });
  }
  try {
    const parsedData = JSON.parse(locationDataString);
    if (isLocationData(parsedData)) {
      const locationData: LocationData = parsedData;
      let geocodingUrl = "";
      const apiKey = context.cloudflare.env.GOOGLE_MAPS_API_KEY;
      switch (locationData.type) {
        case "geolocation":
          geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            locationData.data.coords.latitude
          )},${encodeURIComponent(
            locationData.data.coords.longitude
          )}&key=${apiKey}`;
          break;
        case "input":
          geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            locationData.data
          )}&key=${apiKey}`;
          break;
        default:
          Error("Invalid locationData type");
      }

      const response = await fetch(geocodingUrl);
      const data = await response.json();
      if (data.status === "OK") {
        return redirect(
          `/?lat=${encodeURIComponent(
            data.results[0].geometry.location.lat
          )}&lon=${encodeURIComponent(
            data.results[0].geometry.location.lng
          )}&city=${encodeURIComponent(data.results[0].formatted_address)}`
        );
      } else {
        console.error("No geocoding results found")
        return {error: "No results found"}
      }
      
    } else {
      return json({ error: "Invalid location data format" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error parsing location data:", error);
    return json({ error: "Error parsing location data" }, { status: 400 });
  }
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const lat = url.searchParams.get("lat");
  const lon = url.searchParams.get("lon");
  const city = url.searchParams.get("city");
  return !lat || !lon ? null : { lat: parseFloat(lat), lon: parseFloat(lon), city: String(city) };
};

export default function Sunwatch() {
  const locationData = useLoaderData<{ lat: number; lon: number, city: string } | null>();
  return (
    <div className={"w-screen min-h-screen bg-gray-950"}>
      <div>
        <LocationService />
        {locationData && <Details data={locationData} />}
      </div>
    </div>
  );
}
