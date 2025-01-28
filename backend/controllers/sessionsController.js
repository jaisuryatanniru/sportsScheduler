const Session = require('../models/sessionsModel');

const createSession = async (req, res) => {
  try {
    const {
      sport,
      team1,
      team2,
      additionalPlayers,
      date,
      time,
      venue,
      createdBy,
    } = req.body;

    if (
      !sport ||
      !team1 ||
      !team2 ||
      additionalPlayers === undefined ||
      !date ||
      !time ||
      !venue ||
      !createdBy
    ) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const newSession = await Session.create({
      sport,
      team1,
      team2,
      additionalPlayers,
      date,
      time,
      venue,
      createdBy,
      status: 'Active', 
      participants: [], 
    });

    res.status(201).json({
      message: 'Session created successfully.',
      session: newSession,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create session.' });
  }
};

module.exports = { createSession };
