// app.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');
const helmet= require('helmet');
const productRoutes = require('./routes/productRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use(bodyParser.json());

app.use('/users', userRoutes);
app.use('/home', productRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
