import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Personal Dashboard",
    short_name: "Dashboard",
    description: "A daily to-do list with a calendar of what got done.",
    start_url: "/",
    id: "/",
    scope: "/",
    display: "standalone",
    background_color: "#1d242a",
    theme_color: "#1d242a",
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
