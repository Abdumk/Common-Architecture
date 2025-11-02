const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
// const roleRoutes = require('./routes/');
// const groupRoutes = require('./routes/groupRoutes');
const { verifyToken } = require('./middleware/authMiddleware');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/users', verifyToken, userRoutes);
// app.use('/roles', verifyToken, roleRoutes);
// app.use('/groups', verifyToken, groupRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
