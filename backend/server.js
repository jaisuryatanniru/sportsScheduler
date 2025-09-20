const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDb = require("./config/db");
require("dotenv").config();
const cron = require("node-cron");
const { deleteExpiredSessions } = require("./controllers/sessionsController");

cron.schedule("0 0 * * *", () => {
  console.log("Running scheduled task to delete expired sessions...");
  deleteExpiredSessions();
});

connectDb();

const app = express();
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1/authentication/admin", require("./routes/admin"));
app.use("/api/v1/authentication/player", require("./routes/player"));

app.get("/", (req, res) => {
  res.status(200).send("<h1>Welcome to Sports Scheduler API</h1>");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
