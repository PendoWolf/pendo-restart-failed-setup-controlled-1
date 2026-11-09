import * as pendo from "pendo-server-sdk";
import { createApp } from "./app.js";

// Pendo Agent Analytics for the Tripwise Assistant (writeAssistantReply). Set PENDO_DISABLED=true to turn it off.
pendo.init({
  apiKey: "cf741676-617e-4b03-b077-6a18683b1fca",
  agentId: "z1ANauMgCMAGxPNEGZEWGU3zbLo",
  endpoint: "https://app.pendo-dev.pendo-dev.com",
  autoPatch: true,
});

const port = Number(process.env.PORT) || 3001;
const corsOrigin = process.env.CORS_ORIGIN ?? "http://localhost:5173";

const server = createApp(corsOrigin).listen(port, () => {
  console.log(`Tripwise API on port ${port}, allowing ${corsOrigin}`);
});

// Flush buffered Pendo events before the process exits.
server.on("close", () => {
  void pendo.shutdown();
});
for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, async () => {
    await pendo.shutdown();
    process.exit(0);
  });
}
