import { createBrowserRouter } from "react-router-dom";
import CopilotPage from "./pages/copilot";
import FormPage from "./pages/formpage";
import PowerAppsPage from "./pages/power-apps";
import PowerAutomatePage from "./pages/power-automate";
import SharePointPage from "./pages/sharepoint";
import SolutionGalleryPage from "./pages/solution-gallery";
import SolutionPage from "./pages/solution";
import { MicrositeLayout } from "./layouts/MicrositeLayout";

export const router = createBrowserRouter([
  {
    element: <MicrositeLayout />,
    children: [
      { path: "/", element: <FormPage /> },
      { path: "/about", element: <FormPage /> },
      { path: "/form", element: <FormPage /> },
      { path: "/copilot", element: <CopilotPage /> },
      { path: "/power-apps", element: <PowerAppsPage /> },
      { path: "/power-automate", element: <PowerAutomatePage /> },
      { path: "/sharepoint", element: <SharePointPage /> },
      { path: "/solution-gallery", element: <SolutionGalleryPage /> },
      { path: "/solution/:slug", element: <SolutionPage /> }
    ]
  }
]);