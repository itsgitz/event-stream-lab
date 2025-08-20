import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { streamSSE } from "hono/streaming";

const app = new Hono();

app.use(cors());

app.get("/events", (c) => {
  return streamSSE(c, async (stream) => {
    // Send an initial welcome message.
    await stream.writeSSE({
      event: "welcome",
      data: "Connection established. Waiting for events ...",
    });

    let counter = 0;
    const interval = setInterval(() => {
      counter++;

      const message = `The current count is: ${counter}`;
      console.log(`Sending event: ${message}`);

      // The `writeSSE` method sends a new event to the client.
      // 'id' is optional but useful for clients to track the last received event.
      // 'event' is the event type, which the client can listen for specifically.
      // 'data' is the payload of the event.
      stream.writeSSE({
        event: "message",
        data: message,
      });

      // If the client disconnects, clear the interval to stop sending events.
      if (stream.closed) {
        clearInterval(interval);
        console.log("Client disconnected, closing stream.");
      }
    }, 3000);

    // Clean up the interval when the stream is closed (e.g., client disconnects).
    // This is important to prevent resource leaks.
    stream.onAbort(() => {
      clearInterval(interval);
      console.log("Stream aborted, closing interval.");
    });
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
