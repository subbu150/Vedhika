import mongoose from "mongoose";

/* =========================================================
   DYNAMIC FORM FIELD CONFIG
========================================================= */
const fieldSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    name: { type: String, required: true },

    type: {
      type: String,
      enum: [
        "text",
        "textarea",
        "number",
        "email",
        "file",
        "radio",
        "checkbox",
        "select",
        "password"
      ],
      default: "text",
    },

    required: { type: Boolean, default: false },

    /* for radio/checkbox/select */
    options: [String],
  },
  { _id: false }
);

/* =========================================================
   THEME CONFIG
   Controls ONLY visuals (layout + animation + media)
========================================================= */
const themeSchema = new mongoose.Schema(
  {
    /* PRESET NAME (optional future use) */
    preset: {
      type: String,
      default: "default"
    },

    /* COLORS */
    primaryColor: { type: String, default: "#3b82f6" },
    backgroundColor: { type: String, default: "#0f172a" },
    textColor: { type: String, default: "#ffffff" },

    /* BRANDING MEDIA */
    logo: String,
    bannerImage: String,
    backgroundImage: String,

    /* HERO MEDIA (image/video) */
    heroMediaType: {
      type: String,
      enum: ["image", "video"],
      default: "image"
    },
    heroMediaUrl: String,

    /* 🎨 LAYOUT PRESET (ADMIN SELECT ONLY) */
    layout: {
      type: String,
      enum: [
        "minimal",
        "glass",
        "festival",
        "elegant",
        "playful",
        "patriotic",
        "corporate",
        "modern",
        "neon",
        "vintage",
        "silk_flow", // <--- ADD THIS LINE HERE
    "plexus"
      ],
      default: "minimal"
    },

    /* ✨ ANIMATION PRESET */
    animation: {
      type: String,
      enum: [
        "none",
        "confetti",
        "snowfall",
        "particles",
        "gradient",
        "waves",
        "fireworks"
      ],
      default: "none"
    }
  },
  { _id: false }
);

/* =========================================================
   SOCIAL LINKS (DISPLAY ON EVENT HOME)
========================================================= */
const socialSchema = new mongoose.Schema(
  {
    website: String,
    instagram: String,
    twitter: String,
    linkedin: String,
    youtube: String,
  },
  { _id: false }
);

/* =========================================================
   BOOKING CONFIG
========================================================= */
const bookingSchema = new mongoose.Schema(
  {
    capacity: { type: Number, default: 0 },

    seatsBooked: {
      type: Number,
      default: 0,
    },

    seatLabels: [String],
  },
  { _id: false }
);

/* =========================================================
   EVENT MAIN SCHEMA
========================================================= */
const eventSchema = new mongoose.Schema(
  {
    /* BASIC INFO */
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: String,

    /* =====================================================
       BEHAVIOR (WHAT EVENT DOES)
    ===================================================== */
    mode: {
      type: String,
      enum: ["showcase", "submission", "booking"],
      default: "showcase",
    },

    /* =====================================================
       DYNAMIC FORM STRUCTURE
    ===================================================== */
    fields: [fieldSchema],

    /* =====================================================
       THEME (HOW EVENT LOOKS)
    ===================================================== */
    theme: {
      type: themeSchema,
      default: () => ({}),
    },

    /* =====================================================
       SOCIAL LINKS
    ===================================================== */
    socials: socialSchema,

    /* =====================================================
       BOOKING (only if booking mode)
    ===================================================== */
    booking: bookingSchema,

    /* =====================================================
       ANALYTICS
    ===================================================== */
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    submissionsCount: { type: Number, default: 0 },

    /* =====================================================
       STATUS
    ===================================================== */
    status: {
      type: String,
      enum: ["draft", "published", "closed"],
      default: "draft",
    },

    /* =====================================================
       OWNER
    ===================================================== */
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

/* =========================================================
   EXPORT
========================================================= */
const Event =
  mongoose.models.Event ||
  mongoose.model("Event", eventSchema);

export default Event;
