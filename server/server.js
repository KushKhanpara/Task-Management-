const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:4200"],
        methods: ["GET", "POST"]
    }
});

// Make io accessible to our routers
app.set('io', io);

// Socket.io connection logic
io.on('connection', (socket) => {
    // console.log('A user connected:', socket.id);

    // Join a room based on userId for private notifications
    socket.on('join', (userId) => {
        if (userId) {
            socket.join(userId);
            // console.log(`User ${userId} joined room`);
        }
    });

    // Join admin room
    socket.on('join_admin', () => {
        socket.join('admin_room');
        // console.log('User joined admin room');
    });

    socket.on('disconnect', () => {
        // console.log('User disconnected');
    });
});

// Middleware
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:4200"],
    credentials: true
}));
app.use(cookieParser());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/logs', require('./routes/dailyLogRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

// Make uploads folder static
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
