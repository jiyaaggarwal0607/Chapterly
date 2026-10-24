require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/manga', require('./routes/manga'));
app.use('/api/favourites', require('./routes/favourites'));
app.use('/api/products', require('./routes/products'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/wallet', require('./routes/wallet'));
app.use('/api/translation', require('./routes/translation'));
app.use('/api/insights', require('./routes/insights'));
app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);