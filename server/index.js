require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
const router = require('./router/index')
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/api', router);

const PORT = process.env.PORT || 3030;

const start = async () => {
  try {
    mongoose.set('useCreateIndex', true);
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`)
    })
  } catch (error) {
    console.log(error);
  }
}

start();