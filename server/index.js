// app.js
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const http = require('http');
const cors = require('cors');
const socketIo = require ('socket.io');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const favoritesRoutes = require('./routes/favoritesRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const notificationRoutes = require('./routes/notificationRoutes'); 
const pharmacyRoutes = require('./routes/pharmacyRoutes'); 

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
app.use('/home', pharmacyRoutes);
app.use('/users', userRoutes);
app.use('/doctors', doctorRoutes);

const userSockets = {};

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('register', (userId, userType) => {
    userSockets[userId] = { socketId: socket.id, type: userType };
    console.log("Registered:", userId, userType, socket.id);

    socket.on('disconnect', () => {
      delete userSockets[userId];
      console.log('Client disconnected', socket.id);
    });
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