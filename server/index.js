// app.js
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const { verify } = require("jsonwebtoken");
const http = require('http');
const cors = require('cors');
const socketIo = require ('socket.io');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const favoritesRoutes = require('./routes/favoritesRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const notificationRoutes = require('./routes/notificationRoutes'); 
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Adjust according to your security needs
    methods: ["GET", "POST"]
  }
});

app.use(bodyParser.json());

app.use('/home', userRoutes);
app.use('/home', cartRoutes);
app.use('/home', productRoutes);
app.use('/home', favoritesRoutes);
// app.use('/home', orderRoutes);
app.use('/home', notificationRoutes);
app.use('/users', userRoutes);
app.use('/doctors', doctorRoutes);

const userSockets = {};

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on("register", (token) => {
    try {
      if (!token) {
        console.log("No token provided, disconnecting socket");
        return socket.disconnect(true);
      }
  
      const decoded = verify(token, process.env.SECRET_KEY);
      console.log(decoded);
  
      if (!decoded) {
        console.log("Invalid Token, disconnecting socket");
        return socket.disconnect(true);
      }
  
      userSockets[decoded.userId] = { socketId: socket.id, type: decoded.role};
      console.log("Registered:", decoded.userId, decoded.role, socket.id);
  
      socket.on("disconnect", () => {
        delete userSockets[decoded.userId];
        console.log("Client disconnected", socket.id);
      });
  
    } catch (error) {
      console.log("Invalid Token, disconnecting socket:", error.message);
      return socket.disconnect(true);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});
const orderRoutes = require('./routes/orderRoutes')(io, userSockets);
app.use('/home', orderRoutes);
app.use('/home', prescriptionRoutes(io, userSockets));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});