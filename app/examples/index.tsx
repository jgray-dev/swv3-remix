import { json, redirect } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { Search } from "~/examples/OldLocationService";
import { Details } from "~/components/Details";

// Mock external API call
async function fetchLocationData(query: string) {
  // In a real app, this would be an actual API call
  return {
    name: query,
    coordinates: { lat: 40.7128, lon: -74.0060 },
    weather: { temperature: 72, condition: "Sunny" },
  };
}




export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const query = formData.get("query") as string;
  return redirect(`/?q=${encodeURIComponent(query)}`);
};




export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("q");

  if (!query) {
    return json({ locationData: null });
  }

  const locationData = await fetchLocationData(query);
  return json({ locationData });
};




export default function Index() {
  const { locationData } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Sunrise and Sunset Tracker</h1>
      <Search />
      {locationData && <Details data={locationData} />}
    </div>
  );
}