// import "./style.css";
// import typescriptLogo from "./typescript.svg";
// import viteLogo from "/vite.svg";

window.onload = async () => {
  // Get references to the HTML elements we need to update.
  const statusMessage = document.getElementById("status-message");
  const messagesContainer = document.getElementById("messages");
  const disconnectButton = document.getElementById("disconnect-button");

  if (!statusMessage || !messagesContainer || !disconnectButton) {
    console.error(
      "Initialization failed: one or more required DOM elements are missing."
    );
    return;
  }

  let eventSource: EventSource | null = null; // Declare eventSource in a scope accessible by both connect and disconnect logic.

  function connect() {
    // The `EventSource` API is the browser's native way to handle SSE.
    // It automatically reconnects if the connection is dropped.
    eventSource = new EventSource("http://localhost:3000/events");
    // Listen for the 'open' event, which is fired when the connection is established.
    eventSource.onopen = () => {
      console.log("Connection to server established.");
      if (statusMessage) {
        statusMessage.textContent = "Connected. Waiting for messages...";
        statusMessage.classList.remove("bg-blue-100");
        statusMessage.classList.add("bg-green-100", "text-green-800");
      }
    };
    // Listen for a specific event type, in this case 'counter-update'.
    eventSource.addEventListener("counter-update", (event: MessageEvent) => {
      const data: string = event.data;
      const newMessage = document.createElement("p");
      newMessage.className =
        "text-gray-700 mb-2 p-2 bg-white rounded shadow-sm";
      newMessage.textContent = `Counter update: ${data}`;
      if (messagesContainer) {
        messagesContainer.prepend(newMessage); // Add new messages to the top.
      }
      console.log('Received "counter-update" event:', data);
    });

    // Listen for another specific event, 'welcome'.
    eventSource.addEventListener("welcome", (event: MessageEvent) => {
      const data: string = event.data;
      const newMessage = document.createElement("p");
      newMessage.className =
        "text-gray-500 italic mb-2 p-2 bg-white rounded shadow-sm";
      newMessage.textContent = `Server says: ${data}`;
      if (messagesContainer) {
        messagesContainer.prepend(newMessage);
      }
      console.log('Received "welcome" event:', data);
    });

    // Listen for any un-named events (e.g., those without an 'event' field).
    eventSource.onmessage = (event: MessageEvent) => {
      console.log("Received a generic message:", event.data);
    };

    // Listen for errors. The EventSource will attempt to reconnect automatically on error.
    eventSource.onerror = (error) => {
      console.error("EventSource failed:", error);
      if (statusMessage) {
        statusMessage.textContent =
          "Connection failed. Attempting to reconnect...";
        statusMessage.classList.remove("bg-green-100");
        statusMessage.classList.add("bg-red-100", "text-red-800");
      }
    };
  }

  // Add a click handler to the disconnect button.
  disconnectButton.onclick = () => {
    if (eventSource) {
      eventSource.close();
      if (statusMessage) {
        statusMessage.textContent = "Disconnected.";
        statusMessage.classList.remove("bg-green-100", "bg-red-100");
        statusMessage.classList.add("bg-gray-200", "text-gray-600");
      }
      console.log("Connection closed by user.");
    }
  };

  // Start the connection when the page loads.
  connect();
};

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
      <h1 class="text-3xl font-bold mb-4 text-gray-800 text-center">Real-Time Event Stream</h1>
      <p class="text-sm text-gray-500 mb-6 text-center">
          This page is connected to a Hono server via Server-Sent Events.
          Messages from the server will appear below.
      </p>
      
      <div id="status-message" class="bg-blue-100 text-blue-800 p-4 rounded-lg mb-4 text-center">
          Connecting...
      </div>

      <div id="messages" class="bg-gray-50 p-6 rounded-lg border border-gray-200 h-96 overflow-y-auto">
          <!-- Messages will be appended here dynamically -->
      </div>

      <button id="disconnect-button" class="mt-6 w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200">
          Disconnect
      </button>
  </div>
`;
