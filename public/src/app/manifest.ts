import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kiddnest - ইনভেন্টরি ম্যানেজমেন্ট সিস্টেম",
    short_name: "Kiddnest",
    description: "Kiddnest — small things, happy feelings! পণ্য, স্টক, ক্রয়-বিক্রয় ব্যবস্থাপনা",
    start_url: "/",
    display: "standalone",
    background_color: "#F5F8FC",
    theme_color: "#F28482",
    icons: [
      {
        src: "/logo-icon.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/logo-icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/logo-icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
