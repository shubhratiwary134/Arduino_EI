// Import necessary libraries
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Connect to the backend WebSocket server
const socket = io("http://localhost:5000");

const Oscilloscope = () => {
  const [signalData, setSignalData] = useState([]);

  // Listen for incoming signal data from the backend
  useEffect(() => {
    socket.on("signalData", (data) => {
      const parsedData = { time: Date.now(), value: parseFloat(data) };
      setSignalData((prevData) => [...prevData.slice(-50), parsedData]); // Keep last 50 data points
    });

    return () => {
      socket.off("signalData"); // Clean up the listener when component unmounts
    };
  }, []);

  // Start capturing data
  const startCapture = () => {
    socket.emit("startCapture");
  };

  // Stop capturing data
  const stopCapture = () => {
    socket.emit("stopCapture");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">PC-Based Oscilloscope</h1>
      <div className="mb-4">
        <button
          onClick={startCapture}
          className="bg-green-500 text-white px-4 py-2 rounded-lg mr-2"
        >
          Start Capture
        </button>
        <button
          onClick={stopCapture}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Stop Capture
        </button>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-2">Signal Data:</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={signalData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              tickFormatter={(time) => new Date(time).toLocaleTimeString()}
            />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Oscilloscope;
