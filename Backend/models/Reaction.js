import mongoose from "mongoose";
const reactionSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

/* 1 reaction per user per event */
reactionSchema.index({ event: 1, user: 1 }, { unique: true });

export default mongoose.model("Reaction", reactionSchema);