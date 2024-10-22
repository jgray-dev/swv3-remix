import {
  json,
  LoaderFunction,
  ActionFunction,
  redirect,
} from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

export const action: ActionFunction = async ({ request, context }) => {
  const formData = await request.formData();
  const address = formData.get("address"); // => the "name" field of our form input field needs to match this.
  if (address) return redirect(`/?q=${encodeURIComponent(address)}`); //=> Redirect URL based on form data posted to us
  return {};
};

// Example form that would POST data to our action function above:
//          <Form method="post">                  // => Make sure we POST the form data on submit
//           <input
//             type="text"
//             name="address"                     // => THIS LINE NEEDS TO MATCH THE `formData.get("XXX")` IN THE ACTION FUNCTION
//             placeholder="Enter location"
//             required
//           />
//           <button type="submit">Submit</button>
//         </Form>

export const loader: LoaderFunction = async ({ request, context }) => {
  const url = new URL(request.url);
  const apiKey = context.cloudflare.env.GOOGLE_MAPS_API_KEY;      // => .dev.vars => GOOGLE_MAPS_API_KEY ++ Cloudflare deployed env var
  //Do something with our API key if required - this is just an example of getting context when working with cloudflare

  return json({
    "penis-length": url.searchParams.get("penisLength"),        // Will return whatever is after `?penisLength=` in our URL
    "funny-number": 69,
  }); // => Return data to be used by our component
};

export default function Component() {
  const data = useLoaderData();
  console.log(data)
}
