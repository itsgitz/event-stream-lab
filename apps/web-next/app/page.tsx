"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

export default function Home() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] =
    useState<string>("Connecting...");
  const [messages, setMessages] = useState<string[]>([]);
  // const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const disconnect = () => {
    setIsConnected(false);
    setConnectionStatus("Disconnected.");
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      console.log("Connection closed by user.");
    } else {
      console.log("No event source to close.");
    }
  };

  const connect = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      console.log("Previous event source closed.");
    }

    const eventSource = new EventSource("http://localhost:3000/events");

    eventSource.onopen = () => {
      console.log("Connection to server established.");
      setIsConnected(true);
      setConnectionStatus("Connected! Waiting for messages...");
    };

    eventSource.onerror = (error) => {
      console.error("EventSource failed:", error);
    };

    eventSource.addEventListener("welcome", (event: MessageEvent) => {
      const data: string = event.data;
      setMessages((prevMessages) => [...prevMessages, `Server says: ${data}`]);
      console.log('Received "welcome" event:', data);
    });

    eventSource.addEventListener("counter-update", (event: MessageEvent) => {
      const data: string = event.data;
      setMessages((prevMessages) => [
        ...prevMessages,
        `Counter update: ${data}`,
      ]);
      console.log('Received "counter-update" event:', data);
    });

    eventSourceRef.current = eventSource;
  };

  const toggleConnection = () => {
    if (isConnected) {
      disconnect();
    } else {
      connect();
    }
  };

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, []);

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <div className="p-8 rounded-xl shadow-lg w-full max-w-2xl bg-gray-600">
          <h1 className="text-3xl font-bold mb-4 text-center">
            Real-Time Event Stream
          </h1>
          <p className="text-sm  mb-6 text-center">
            This page is connected to a Hono server via Server-Sent Events.
            Messages from the server will appear below.
          </p>
          <div
            className={clsx(
              "bg-blue-100 text-blue-800 p-4 rounded-lg mb-4 text-center",
              isConnected
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            )}
          >
            {connectionStatus}
          </div>
          <div className="p-6 rounded-lg border border-gray-200 h-96 overflow-y-auto">
            <ul>
              {messages.map((message, index) => (
                <li
                  key={index}
                  className="text-gray-700 mb-2 p-2 bg-white rounded shadow-sm"
                >
                  {message}
                </li>
              ))}
            </ul>
          </div>
          <button
            onClick={toggleConnection}
            className={clsx(
              "mt-6 w-full  text-white font-bold py-2 px-4 rounded-lg transition duration-200",
              isConnected ? "bg-red-500  hover:bg-red-600 " : "bg-green-500"
            )}
          >
            {isConnected ? "Disconnect" : "Connect"}
          </button>
        </div>
      </main>
    </div>
  );
}
