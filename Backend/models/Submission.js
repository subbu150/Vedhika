import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true
    },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  /* dynamic answers */
  answers: mongoose.Schema.Types.Mixed,
  /* uploaded files */
  files: [String],
  /* social contacts */
 
  /* booking seat */
  seatNumber: String,
  /* approval */
  status: {
    type: String,
    enum: [ "approved", "rejected"],
    default: "approved"
  }
},
{ timestamps: true }
);

submissionSchema.index(
  { event: 1, user: 1 },
  { unique: true }
);

const Submission =
  mongoose.models.Submission ||
  mongoose.model("Submission", submissionSchema);

export default Submission;
