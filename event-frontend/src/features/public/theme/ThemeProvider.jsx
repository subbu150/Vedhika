import { useEffect } from "react";

export default function ThemeProvider({ theme, children }) {
  useEffect(() => {
    if (!theme) return;

    const root = document.documentElement;

    /* =========================
       CSS VARIABLES
    ========================= */

    root.style.setProperty("--primary", theme.primaryColor);
    root.style.setProperty("--bg", theme.backgroundColor);
    root.style.setProperty("--text", theme.textColor);

    /* =========================
       LAYOUT SWITCH
    ========================= */

    document.body.dataset.layout = theme.layout || "minimal";

    /* =========================
       BACKGROUND IMAGE
    ========================= */

    if (theme.backgroundImage) {
      document.body.style.backgroundImage = `url(${theme.backgroundImage})`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
    } else {
      document.body.style.backgroundImage = "none";
    }

  }, [theme]);

  return children;
}
