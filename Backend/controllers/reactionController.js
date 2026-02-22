import Reaction from "../models/Reaction.js";

export const toggleReaction = async (req, res) => {
  const { eventId } = req.params;

  const existing = await Reaction.findOne({
    event: eventId,
    user: req.user._id
  });

  let liked;

  if (existing) {
    await existing.deleteOne();
    liked = false;
  } else {
    await Reaction.create({
      event: eventId,
      user: req.user._id
    });
    liked = true;
  }

  const count = await Reaction.countDocuments({ event: eventId });

  res.json({ liked, count });
};



export const getReactionCount = async (req, res) => {
  const count = await Reaction.countDocuments({ event: req.params.eventId });
  res.json({ count });
};
