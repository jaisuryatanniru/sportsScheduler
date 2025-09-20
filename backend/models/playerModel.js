const mongoose = require("mongoose");

const PlayerSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address:  { type: [String], required: true },
  phone:    { type: String, required: true },
  usertype: { type: String, required: true, enum: ["admin","player"], default: "player" },
  answer:   { type: String, required: true },
});

module.exports = mongoose.model("Player", PlayerSchema);
