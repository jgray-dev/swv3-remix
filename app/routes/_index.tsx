import {
  json,
  LoaderFunction,
  ActionFunction,
} from "@remix-run/cloudflare";
import LocationService from "~/components/LocationService";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const locationDataString = formData.get("locationData");
  console.log(locationDataString)
  return {}
};

export const loader: LoaderFunction = async ({ request, context }) => {
  return {};
};

export default function Component() {
  return <LocationService />;
}
