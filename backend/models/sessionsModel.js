const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
  sport:             { type: String, required: true },
  team1:             { type: String, required: true },
  team2:             { type: String, required: true },
  additionalPlayers: { type: Number, required: true },
  date:              { type: Date,   required: true },
  time:              { type: String, required: true },
  venue:             { type: String, required: true },
  status:            { type: String, default: "Active" },
  createdBy:         { type: String, required: true },
  participants:      { type: [String], default: [] },
  cancelReason:      { type: String },
});

module.exports = mongoose.model("Session", SessionSchema);
