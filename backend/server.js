const express = require("express");

const cors = require("cors");
const morgan = require("morgan");
const connectDb = require("./config/db");
require('dotenv').config();


//DB connection
connectDb();


const app = express();


const corsOptions = {
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST'],
};

app.use(cors(corsOptions));



//middlewares

app.use(express.json());
app.use(morgan("dev"));



app.use("/api/v1/authentication/admin",require('./routes/admin'))
app.use("/api/v1/authentication/player",require('./routes/player'))





app.get("/", (req, res) => {
  return res
    .status(200)
    .send("<h1>Welcome</h1>");
});

const PORT =  process.env.PORT ;


app.listen(PORT, () => {
  console.log(`Server running on ${PORT}.white.bgMagenta`);
});