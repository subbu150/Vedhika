import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import Providers from "./app/providers";
import IntroLoader from "./features/dashboard/pages/IntroLoader";
import { useState } from "react";

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <Providers>
      {/* Router must always exist */}
      <RouterProvider router={router} />

      {/* Loader overlays UI, not router */}
      {loading && (
        <IntroLoader onFinish={() => setLoading(false)} />
      )}
    </Providers>
  );
}