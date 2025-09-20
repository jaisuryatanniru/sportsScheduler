const Sport = require("../models/sport");

exports.createSport = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Sport name is required." });
  try {
    if (await Sport.findOne({ name })) {
      return res.status(400).json({ error: "Sport already exists." });
    }
    const sport = await Sport.create({ name });
    res.status(201).json({ message: "Sport created successfully.", sport });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while creating sport." });
  }
};
