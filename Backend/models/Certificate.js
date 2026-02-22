import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    /* =========================================
       RELATIONS
    ========================================= */

    // event reference (analytics + queries)
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,

    },

    // ONE certificate per submission
    submission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Submission",
      required: true,
      unique: true
    },

    // user who receives certificate
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
   
    },

    /* =========================================
       CERTIFICATE FILE
    ========================================= */

    // Cloudinary/S3 URL
    fileUrl: {
      type: String
    },

    /* =========================================
       STATUS / LIFECYCLE
    ========================================= */

    // whether certificate was issued
    issued: {
      type: Boolean,
      default: false
    },

    // how many times downloaded
    downloads: {
      type: Number,
      default: 0
    },

    // when issued
    issuedAt: {
      type: Date
    },

    /* =========================================
       FUTURE READY (optional but useful)
    ========================================= */

    // email delivery tracking (optional)
    emailSent: {
      type: Boolean,
      default: false
    },

    // delivery errors (optional debug)
    deliveryError: String
  },
  {
    timestamps: true
  }
);


/* =========================================
   INDEXES (VERY IMPORTANT)
========================================= */

certificateSchema.index({ event: 1 });
certificateSchema.index({ user: 1 });
certificateSchema.index({ submission: 1 }, { unique: true });

export default mongoose.model("Certificate", certificateSchema);
