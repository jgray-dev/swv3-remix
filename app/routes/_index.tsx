import {
  json,
  LoaderFunction,
  ActionFunction,
  redirect,
} from "@remix-run/cloudflare";
import LocationService, { LocationData } from "~/components/LocationService";
import { useLoaderData } from "@remix-run/react";

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

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const locationDataString = formData.get("locationData");
  if (typeof locationDataString !== "string") {
    return json({ error: "Invalid location data" }, { status: 400 });
  }
  try {
    const parsedData = JSON.parse(locationDataString);
    if (isLocationData(parsedData)) {
      const locationData: LocationData = parsedData;
      console.log(locationData);
      // Process the locationData here
      if (locationData.type === "geolocation") {
        return redirect(
          `/?lat=${encodeURIComponent(
            locationData.data.coords.latitude
          )}&lon=${encodeURIComponent(locationData.data.coords.longitude)}`
        );
      } else if (locationData.type === "input") {
        // call google api
      }
      return json({ success: true });
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
  return { lat, lon };
};



export default function Sunwatch() {
  const locationData = useLoaderData();
  console.log(locationData);
  return (
    <div className={"w-screen min-h-screen bg-gray-950"}>
      <LocationService />
    </div>
  );
}
