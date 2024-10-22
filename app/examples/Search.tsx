import { Form } from "@remix-run/react";

export function Search() {
  return (
    <Form method="post">
      <input
        type="text"
        name="query"
        placeholder="Enter a location"
        required
      />
      <button type="submit">Search</button>
    </Form>
  );
}