// server.js
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const multer = require('multer');
const handleImage = require('./describe'); // Import the handler

const upload = multer({ dest: 'uploads/' });
const app = express();

app.use(cors());

app.post('/api/describe-image', upload.single('image'), handleImage); // Use the handler here

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
