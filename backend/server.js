const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB } = require('./config/db');

// Import routes vừa tạo
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

connectDB();

// Đăng ký API Route
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.send('🍵 Chào mừng đến với TeaHerbShop API!');
});

app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});