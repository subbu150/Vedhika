import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import Providers from "./app/providers";
import IntroLoader from "./features/dashboard/pages/IntroLoader";
import { useState } from "react";

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <Providers>
      {loading && (
        <IntroLoader onFinish={() => setLoading(false)} />
      )}

      {!loading && <RouterProvider router={router} />}
    </Providers>
  );
}
