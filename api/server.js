// Import necessary libraries
const express = require('express'); // Express framework to set up the web server
const http = require('http'); // HTTP module to create the server
const { SerialPort, ReadlineParser } = require('serialport'); // Libraries to handle serial communication
const { Server } = require('socket.io'); // Socket.io for real-time communication between backend and frontend

// Create an Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Set up Socket.io for real-time bidirectional event-based communication
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', // Allow requests from frontend running on this origin
        methods: ['GET', 'POST']
    }
});

// Middleware to parse JSON requests
app.use(express.json());

// Endpoint to check server status
app.get('/', (req, res) => {
    res.send('Oscilloscope server is running');
});

// Configure the serial port (update the port and baudRate based on your hardware setup)
const port = new SerialPort({
    path: 'COM3', // Replace with your actual serial port path
    baudRate: 9600 // Must match the rate set on the microcontroller
});

// Set up a parser to read incoming serial data line by line
const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

// Listen for data from the serial port and send it to the frontend
parser.on('data', (data) => {
    console.log('Received data:', data);
    io.emit('signalData', data); // Emit incoming data to the frontend
});

// Handle socket connections
io.on('connection', (socket) => {
    console.log('Client connected');

    // Listen for control messages from the frontend (like start/stop commands)
    socket.on('startCapture', () => {
        console.log('Start capture command received');
        // Future scope: Add logic to start capturing if needed
    });

    socket.on('stopCapture', () => {
        console.log('Stop capture command received');
        // Future scope: Add logic to stop capturing if needed
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    
});
