const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  sport: { type: String, required: true },
  team1: { type: String, required: true },
  team2: { type: String, required: true },
  additionalPlayers: { type: Number, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  venue: { type: String, required: true },
  status: { type: String, default: 'Active' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  cancelReason: { type: String },
});

module.exports = mongoose.model('Session', sessionSchema);
