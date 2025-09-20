const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address:  { type: [String], required: true },
  phone:    { type: String, required: true },
  usertype: { type: String, required: true, enum: ["admin","player"], default: "admin" },
  answer:   { type: String, required: true },
});

module.exports = mongoose.model("Admin", AdminSchema);
