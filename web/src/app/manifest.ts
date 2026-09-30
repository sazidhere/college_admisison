import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Lets Android users "Add to Home screen" and open the site like an app.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} · US admissions from Bangladesh`,
    short_name: site.name,
    description: site.description,
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#121212",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
