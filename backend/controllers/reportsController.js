const Sport = require('../models/sportsModel');
const Session = require('../models/sessionsModel');

const getReports = async (req, res) => {
  try {
    const sessionCount = await Session.countDocuments();
    const sports = await Sport.find();

    const popularSports = sports.length > 0 ? sports.map((sport) => sport.name) : [];

    res.status(200).json({
      sessionCount,
      popularSports,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reports.' });
  }
};


module.exports={getReports};