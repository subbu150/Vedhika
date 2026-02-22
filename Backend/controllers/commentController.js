import Comment from "../models/Comment.js";

/* create */
export const createComment = async (req, res) => {
  const { eventId } = req.params;

  const comment = await Comment.create({
    event: eventId,
    user: req.user._id,
    text: req.body.text
  });

  res.status(201).json(comment);
};


/* list */
export const getComments = async (req, res) => {
  const { eventId } = req.params;

  const comments = await Comment.find({ event: eventId })
    .populate("user", "name")
    .sort("-createdAt");

  res.json(comments);
};


/* delete */
export const deleteComment = async (req, res) => {
  await Comment.findByIdAndDelete(req.params.commentId);
  res.json({ message: "Deleted" });
};
