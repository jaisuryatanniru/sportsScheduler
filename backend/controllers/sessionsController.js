const Session = require("../models/session");

exports.createSession = async (req, res) => {
  const { sport, team1, team2, additionalPlayers, date, time, venue, createdBy } = req.body;
  if (![sport, team1, team2, additionalPlayers, date, time, venue, createdBy].every(Boolean)) {
    return res.status(400).json({ error: "All fields are required." });
  }
  try {
    const session = await Session.create({
      sport,
      team1,
      team2,
      additionalPlayers,
      date: new Date(date),
      time,
      venue,
      createdBy,
    });
    res.status(201).json({ message: "Session created successfully.", session });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while creating session." });
  }
};

exports.getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ status: "Active" });
    res.status(200).json(sessions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error fetching sessions." });
  }
};

exports.joinSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { userId } = req.body;
    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ error: "Session not found." });
    if (session.participants.includes(userId)) {
      return res.status(400).json({ error: "Already joined." });
    }
    session.participants.push(userId);
    await session.save();
    res.status(200).json({ message: "Joined session successfully.", session });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error joining session." });
  }
};

exports.cancelSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { cancelReason } = req.body;
    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ error: "Session not found." });
    session.status = "Cancelled";
    session.cancelReason = cancelReason;
    await session.save();
    res.status(200).json({ message: "Session cancelled successfully.", session });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error cancelling session." });
  }
};

exports.getMySessions = async (req, res) => {
  try {
    const { userId } = req.body;
    const created = await Session.find({ createdBy: userId });
    const joined = await Session.find({ participants: userId });
    res.status(200).json({ createdSessions: created, joinedSessions: joined });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error fetching user sessions." });
  }
};

exports.deleteExpiredSessions = async () => {
  try {
    const result = await Session.deleteMany({ date: { $lt: new Date() } });
    console.log(`Deleted ${result.deletedCount} expired sessions.`);
  } catch (err) {
    console.error("Error deleting expired sessions:", err);
  }
};
