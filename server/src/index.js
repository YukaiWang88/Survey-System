const express = require('express');
const http = require('http');
const cors = require('cors');
const surveyRoutes = require('./routes/surveyRoutes');
// Comment out mongoose until we need it
const mongoose = require('mongoose');
const socketIo = require('socket.io');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection for now
const MONGO_URI = 'mongodb+srv://kwokhinchi:comp3421@surveysystemcluster.zbzscfk.mongodb.net/survey-system?retryWrites=true&w=majority';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.log('Continuing without database for development...');
  });


// Simple socket setup for now
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// API Routes
app.use('/api/surveys', surveyRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});