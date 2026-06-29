import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Personal Dashboard",
    short_name: "Dashboard",
    description:
      "Track to-dos and goals, time spent, gym workouts, and nutrition in one place.",
    start_url: "/",
    display: "standalone",
    background_color: "#1d242a",
    theme_color: "#1d242a",
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
