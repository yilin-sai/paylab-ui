"use client";

import { useEffect } from "react";

export default function ApiDocsPage() {
  useEffect(() => {
    // Dynamically load Swagger UI after script is loaded
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.min.js";
    script.onload = () => {
      // @ts-expect-error -- Swagger UI adds itself to the window object
      if (window.SwaggerUIBundle) {
        // @ts-expect-error -- Swagger UI adds itself to the window object
        window.SwaggerUIBundle({
          url: "/swagger.json",
          dom_id: "#swagger-ui",
        });
      }
    };
    document.body.appendChild(script);

    // Add Swagger UI CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css";
    document.head.appendChild(link);

    return () => {
      document.body.removeChild(script);
      document.head.removeChild(link);
    };
  }, []);

  return <div id="swagger-ui" />;
}
