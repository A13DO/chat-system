const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io"); // Ensure this line is correct

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // Ensure this matches your front-end origin
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// Middleware
app.use(cors({
    origin: '*', // Ensure this matches your front-end origin
    methods: ['GET', 'POST'],
    optionsSuccessStatus: 204 // For older browsers
}));

// Middleware

// // Serve static files from the public directory
// app.use(express.static('public'));

const users = {};
// Socket.IO connection
io.on("connection", (socket) => {
    console.log("New client connected: ", socket.id);

    // ROOMS
    socket.on('joinRoom', (roomId, peerId) => {
        socket.join(roomId);
        console.log(`${socket.id} joined room: ${roomId}, With peerID: ${peerId}`);
        socket.to(roomId).emit('newPeer', { peerId: peerId, userId: socket.id });
    });

    // Handle Room Chat Messages
    socket.on('chat-room', (roomId, data) => {
        if (roomId == '') {
            console.log(`no Room`);
        } else {
            io.to(roomId).emit('chat-room', data);
            console.log(`Message in room ${roomId}: ${data.text}`);
            
        }
    });



    socket.on('disconnect', () => {
        socket.broadcast.emit("user-disconnected", users[socket.id])
        delete users[socket.id];
    });
});
const selfReload = () => {
    setInterval(() => {
        const appUrl = 'https://e-commerce-api-wvh5.onrender.com';
        fetch(`${appUrl}/ping`)
            .then(response => console.log(`Reload successful: ${response.status}`))
            .catch(error => console.error('Reload failed:', error));
    }, 12 * 60 * 1000); // Ping every 12 minutes
};

const PORT = process.env.PORT || 3000; // Use environment variable or default to 3000
server.listen(PORT, () => {
    selfReload()
    console.log(`Server is running on http://localhost:${PORT}`);
});
