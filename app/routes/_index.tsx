import {
  json,
  LoaderFunction,
  ActionFunction,
  redirect,
} from "@remix-run/cloudflare";
import LocationService from "~/components/LocationService";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const locationDataString = formData.get('locationData');

  if (typeof locationDataString !== 'string') {
    return json({ error: 'Invalid location data' }, { status: 400 });
  }

  try {
    const locationData = JSON.parse(locationDataString);

    // Log the received data
    console.log('Received location data:', locationData);

    // Here you would typically process the data, save it to a database, etc.
    // For this example, we'll just return it

    return json({ success: true, locationData });
  } catch (error) {
    console.error('Error processing location data:', error);
    return json({ error: 'Failed to process location data' }, { status: 500 });
  }
};

export const loader: LoaderFunction = async ({ request, context }) => {
return {}
};

export default function Component() {
  return <LocationService />;
}
