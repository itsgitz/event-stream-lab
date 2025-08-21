# Event Stream Lab

A monorepo project demonstrating real-time communication using Server-Sent Events (SSE). This lab includes a Hono backend that streams events, and two frontend clients (one built with Vite and vanilla TypeScript, another with Next.js and React) that consume and display these events.

## ✨ Features

-   **Monorepo**: Managed with pnpm workspaces for easy package management across applications.
-   **Hono Backend (`streamer`)**: A lightweight, fast server built with Hono to stream events using the SSE protocol.
-   **Vite + Vanilla TS Client (`web`)**: A simple, fast frontend application built with Vite, demonstrating how to consume SSE with plain TypeScript.
-   **Next.js + React Client (`web-next`)**: A modern React application built with Next.js, showcasing SSE integration using React hooks.
-   **Real-time Updates**: See messages from the server appear on the clients in real-time without page reloads.

## 📂 Project Structure

The project is organized as a monorepo with the following structure:

```
.
├── apps
│   ├── streamer      # Hono backend server for SSE
│   ├── web           # Vite + vanilla TypeScript frontend
│   └── web-next      # Next.js + React frontend
├── package.json
└── pnpm-workspace.yaml
```

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

-   Node.js (v18 or later recommended)
-   pnpm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/itsgitz/event-stream-lab.git
    cd event-stream-lab
    ```

2.  **Install dependencies:**
    This command will install dependencies for all workspaces (streamer, web, and web-next).
    ```bash
    pnpm install
    ```

### Running the Project

To run all applications concurrently in development mode, use the following command from the root of the project:

```bash
pnpm dev
```

This will start:
-   The **Hono streamer** on `http://localhost:3000`
-   The **Vite client (`web`)** on `http://localhost:5173` (or another available port)
-   The **Next.js client (`web-next`)** on `http://localhost:3001` (or another available port)

You can open the client URLs in your browser to see the event stream in action.

## 📜 Available Scripts

The following scripts are available in the root `package.json` and can be run with `pnpm`:

-   `pnpm dev`: Starts all applications in development mode.
-   `pnpm build`: Builds all applications for production.
-   `pnpm lint`: Lints the code in all applications.
-   `pnpm test`: Runs tests for all applications (if configured).