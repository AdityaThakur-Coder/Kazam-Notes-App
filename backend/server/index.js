const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const mqttClient = require('./mqttHandler');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/', taskRoutes);
app.get('/',(req,res)=>{
  res.send("Welcome to server")
})
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
