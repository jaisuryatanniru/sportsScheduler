const Sport = require('../models/sportsModel');

const createSport = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Sport name is required.' });
  }

  try {
    const existingSport = await Sport.findOne({ name });
    if (existingSport) {
      return res.status(400).json({ error: 'Sport already exists.' });
    }

    const newSport = await Sport.create({ name });
    res.status(201).json({ message: 'Sport created successfully.', sport: newSport });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating the sport.' });
  }
};

module.exports={createSport}