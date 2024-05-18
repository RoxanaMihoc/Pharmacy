// app.js
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const favoritesRoutes = require('./routes/favoritesRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use(bodyParser.json());

app.use('/home', userRoutes);
app.use('/home', cartRoutes);
app.use('/home', productRoutes);
app.use('/home', favoritesRoutes);
app.use('/home', orderRoutes);
app.use('/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
