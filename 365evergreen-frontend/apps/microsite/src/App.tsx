import { RouterProvider } from "react-router-dom";
import { SiteHeader } from "@evergreen/ui";
import { router } from "./router";

const NAVIGATION_URL =
  "https://sa365evergreenwebsite.blob.core.windows.net/content/navigation/navigation.json";

export default function App() {
  return (
    <>
      <SiteHeader
        navUrl={NAVIGATION_URL}
        variant="content"
        brandLabel="365 Evergreen"
      />
      <RouterProvider router={router} />
    </>
  );
}