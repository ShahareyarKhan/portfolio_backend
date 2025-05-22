const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./mongodb');
const { configDotenv } = require('dotenv');
configDotenv();
const app = express();
const PORT =  5000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('images'));

connectDB();
app.get('/', (req, res) => {
  res.send('hello user');
});

app.use('/otp', require('./routes/handleOtp'));
app.use('/blog', require('./routes/Blogroutes'));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});