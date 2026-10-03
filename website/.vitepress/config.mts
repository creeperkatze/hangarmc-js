import { version } from "../../package.json";
import { defineDocsConfig } from "./shared/docs";

export default defineDocsConfig({
  name: "hangarmc-js",
  description: "A framework-agnostic fully typed JavaScript client for the Hangar API by PaperMC.",
  repo: "creeperkatze/hangarmc-js",
  version,
  guide: [
    { text: "Getting Started", link: "/guide/getting-started" },
    { text: "Authentication", link: "/guide/authentication" },
    { text: "Error Handling", link: "/guide/error-handling" },
    { text: "Custom Fetch", link: "/guide/custom-fetch" },
    { text: "Projects", link: "/guide/projects" },
    { text: "Versions", link: "/guide/versions" },
  ],
  api: new URL("../api", import.meta.url),
});
