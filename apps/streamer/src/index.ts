import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { streamSSE } from "hono/streaming";

const app = new Hono();

app.use(cors());

app.get("/events", async (c) => {
  return await streamSSE(c, async (stream) => {
    let id = 0;
    // Send initial welcome message
    await stream.writeSSE({
      event: "welcome",
      data: "Connection established. Waiting for events ...",
      id: String(id++),
    });

    let counter = 0;
    while (!stream.closed) {
      counter++;
      const message = `The current count is: ${counter}`;
      console.log(`Sending event: ${message}`);

      await stream.writeSSE({
        event: "counter-update",
        data: message,
        id: String(id++),
      });

      // wait 3s before sending next one
      await stream.sleep(3000);
    }
  });
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
