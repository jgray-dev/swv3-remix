import type { LoaderFunction, ActionFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData, useActionData, Form } from "@remix-run/react";
import { useState, useEffect } from "react";

export const loader: LoaderFunction = async ({ request, context }) => {
  const url = new URL(request.url);
  const address = url.searchParams.get("address");

  if (address) {
    const apiKey = context.cloudflare.env.GOOGLE_MAPS_API_KEY;
    const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`;

    try {
      const response = await fetch(geocodingUrl);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        return json({ latitude: lat, longitude: lng });
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  }

  return json({});
};

export const action: ActionFunction = async ({ request, context }) => {
  const formData = await request.formData();
  const address = formData.get("address");

  if (typeof address === "string") {
    const url = new URL(request.url);
    url.searchParams.set("address", address);
    return json({ redirect: url.toString() });
  }

  return json({});
};

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [geolocationFailed, setGeolocationFailed] = useState(false);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Error getting geolocation:", error);
          setGeolocationFailed(true);
        }
      );
    } else {
      console.log("Geolocation is not available in this browser.");
      setGeolocationFailed(true);
    }
  }, []);

  useEffect(() => {
    if (loaderData.latitude && loaderData.longitude) {
      setLatitude(loaderData.latitude);
      setLongitude(loaderData.longitude);
      setGeolocationFailed(false);
    }
  }, [loaderData]);

  useEffect(() => {
    if (actionData?.redirect) {
      window.location.href = actionData.redirect;
    }
  }, [actionData]);

  return (
    <div>
      Home page :P
      {latitude && longitude && (
        <span>
          {" "}
          (Location: {latitude.toFixed(2)}, {longitude.toFixed(2)})
        </span>
      )}
      {geolocationFailed && (
        <Form method="post">
          <input
            type="text"
            name="address"
            placeholder="Enter location"
            required
          />
          <button type="submit">Submit</button>
        </Form>
      )}
    </div>
  );
}
