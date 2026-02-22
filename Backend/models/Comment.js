import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    text: {
      type: String,
      required: true,
      maxlength: 500
    }
  },
  { timestamps: true }
);

/* for fast lookup */
commentSchema.index({ event: 1, createdAt: -1 });

export default mongoose.model("Comment", commentSchema);
