import Event from "../models/Event.js";
import Submission from "../models/Submission.js";

/* =============================
   CREATE EVENT (admin)
============================= */
export const createEvent = async (req, res) => {
  try {
    const event = await Event.create({
      ...req.body,
      createdBy: req.user._id
    });
    console.log("Reached:",event)
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



/* =============================
   GET ALL EVENTS (public)
============================= */
export const getEvents = async (req, res) => {
 const events = await Event.find({
  status: { $in: ["draft", "published"] }
}).sort("-createdAt");

  res.json(events);
};



/* =============================
   GET SINGLE EVENT
============================= */
export const getEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) return res.status(404).json({ message: "Event not found" });

  res.json(event);
};



/* =============================
   UPDATE
============================= */
export const updateEvent = async (req, res) => {
  const event = await Event.findByIdAndUpdate(
    req.params.id,
    { ...req.body }, // now can update title, mode, status etc
    { new: true }
  );

  res.json(event);
};



/* =============================
   DELETE (soft delete)
============================= */
export const deleteEvent = async (req, res) => {
  await Event.findByIdAndUpdate(req.params.id, {
    status: "closed"
  });

  res.json({ message: "Event closed" });
};



/* =============================
   PUBLISH
============================= */
export const publishEvent = async (req, res) => {
  const event = await Event.findByIdAndUpdate(
    req.params.id,
    { status: "published" },
    { new: true }
  );

  res.json(event);
};
export const getEventShowcase = async (req, res) => {
  try {
    const { eventId } = req.params;

    const submissions = await Submission.find({
      event: eventId,
      status: "approved", // Only show approved submissions
    })
      .populate("user", "name avatar") // Populate user details (adjust fields as needed)
      .select("answers files createdAt user status") 
      .sort("-createdAt");

    // Handle 304 Not Modified automatically via Express etags, 
    // but ensure we send a 200 with data if content changed
    res.status(200).json(submissions);

  } catch (err) {
    console.error("Showcase Error:", err);
    res.status(500).json({ message: "Failed to fetch showcase items" });
  }
};
