import Submission from "../models/Submission.js";
import Event from "../models/Event.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import { sendCertificateEmail } from "../utils/sendCertificateEmail.js";
import { generateCertificatePDF } from "../utils/generateCertificatePDF.js";
import mongoose from "mongoose";
import Certificate from "../models/Certificate.js";
export const createSubmission = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.user._id;
    console.log(userId)

    /* =====================================
       GET EVENT
    ===================================== */
    const event = await Event.findById(eventId);

    if (!event)
      return res.status(404).json({ message: "Event not found" });

    if (event.status !== "published")
      return res.status(400).json({ message: "Event not published" });

    /* =====================================
       PREVENT DUPLICATE SUBMISSION
    ===================================== */
    const exists = await Submission.findOne({
      event: eventId,
      user: userId,
    });

    if (exists){
      console.log(exists);
      return res.status(400).json({ message: "Already submitted" });
    }

    /* =====================================
       BOOKING MODE 🔥
    ===================================== */
    let seatNumber = null;

    if (event.mode === "booking" && event.booking?.capacity) {
      if (event.booking.seatsBooked >= event.booking.capacity) {
        return res.status(400).json({ message: "Seats full" });
      }

      event.booking.seatsBooked += 1;
      seatNumber = event.booking.seatsBooked;

      await event.save();
    }

    /* =====================================
       PARSE FORMDATA SAFE
    ===================================== */
    let answers = {};

    if (req.body && Object.keys(req.body).length) {
      answers =
        typeof req.body.answers === "string"
          ? JSON.parse(req.body.answers)
          : req.body;
    }

    /* =====================================
       FILE UPLOADS
    ===================================== */
    let fileUrls = [];

    if (req.files?.length) {
      for (const file of req.files) {
        const uploaded = await uploadToCloudinary(file.buffer);
        fileUrls.push(uploaded.secure_url);
      }
    }

    /* =====================================
       🔥 GENERATE CERTIFICATE FIRST
       (NO RACE CONDITION)
    ===================================== */
    const pdfUrl = await generateCertificatePDF({
      participantName: req.user.name,
      eventName: event.title,
      logoUrl: event.branding?.logoUrl,
      signatureUrl: event.branding?.signatureUrl,
    });

    if (!pdfUrl)
      return res.status(500).json({ message: "Certificate generation failed" });

    console.log("PDF generated:", pdfUrl);

    /* =====================================
       CREATE SUBMISSION
    ===================================== */
    const submission = await Submission.create({
      event: eventId,
      user: userId,
      answers,
      files: fileUrls,
      seatNumber,
      status: "approved",
    });
    console.log("This is Submission id",submission._id);
    /* =====================================
       CREATE CERTIFICATE (WITH URL)
    ===================================== */
   const cert= await Certificate.create({
      event: eventId,
      submission: submission._id,
      user: userId,
      issued: true,
      fileUrl: pdfUrl,
      downloads: 0,
      emailSent: false,
    });
    console.log("Certificate created:", cert._id);
    /* =====================================
       DONE
    ===================================== */
    res.status(201).json(submission);

  } catch (err) {
    console.error("Create submission error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =====================================
   GET ALL SUBMISSIONS OF EVENT (admin)
===================================== */

export const getSubmission = async (req, res) => {
  const submission = await Submission.findById(req.params.submissionId)
    .populate("user", "name email")
    .populate("event", "title");

  if (!submission) {
    return res.status(404).json([]);
  }
  console.log("Backend kuda vacchindra abbayi")
  res.json(submission);
};

export const updateSubmissionStatus = async (req, res) => {
  const session = await mongoose.startSession();

  let submission;
  let certificate = null;

  try {
    session.startTransaction();

    const { submissionId } = req.params;
    const { status } = req.body;

    /* ===============================
       UPDATE STATUS
    =============================== */
    submission = await Submission.findByIdAndUpdate(
      submissionId,
      { status },
      { new: true, session }
    )
      .populate("user", "name email")
      .populate("event", "title branding");

    if (!submission) throw new Error("Submission not found");

    /* ===============================
       CERTIFICATE RECORD (DB only)
    =============================== */
    if (status === "approved") {
      certificate = await Certificate.findOne({
        submission: submission._id
      }).session(session);

      // create DB record only (no PDF yet)
      if (!certificate) {
        certificate = await Certificate.create(
          [{
            event: submission.event._id,
            submission: submission._id,
            user: submission.user._id,
            issued: true
          }],
          { session }
        );

        certificate = certificate[0];
      }
    }

    await session.commitTransaction();

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return res.status(400).json({ message: err.message });
  }

  session.endSession();

  /* ===================================================
     🔥 HEAVY WORK OUTSIDE TRANSACTION
     (PDF + Cloudinary + Email)
  =================================================== */
  try {
    if (status === "approved" && certificate && !certificate.fileUrl) {
      const pdfUrl = await generateCertificatePDF({
        participantName: submission.user.name,
        eventName: submission.event.title,
        logoUrl: submission.event.branding?.logoUrl,
        signatureUrl: submission.event.branding?.signatureUrl
      });

      certificate.fileUrl = pdfUrl;
      await certificate.save();

      /* ---------- EMAIL DELIVERY ---------- */
      await sendCertificateEmail({
        to: submission.user.email,
        name: submission.user.name,
        eventName: submission.event.title,
        certificateUrl: pdfUrl
      });
    }
  } catch (err) {
    console.error("Certificate delivery failed:", err.message);
    // don't fail request if email fails
  }

  res.json(submission);
};

export const deleteSubmission = async (req, res) => {
  console.log("Reached Me")
  const submission = await Submission.findById(req.params.submissionId);
  console.log("submission",submission)
  if (!submission) {
    return res.status(404).json({ message: "Not found" });
  }

  /* only owner can delete */
  if (submission.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await submission.deleteOne();

  res.json({ message: "Deleted" });
};


export const getEventSubmissions = async (req, res) => {
  try {
    const { eventId } = req.params;



    /* ---------- check event exists ---------- */
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }



    /* ---------- pagination ---------- */
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;



    /* ---------- query submissions ---------- */
    const submissions = await Submission.find({ event: eventId })
      .populate("user", "name email role") // only needed fields
      .sort("-createdAt")                 // newest first
      .skip(skip)
      .limit(limit);



    /* ---------- total count ---------- */
    const total = await Submission.countDocuments({ event: eventId });



    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      count: submissions.length,
      submissions
    });

  } catch (err) {
    res.status(500).json([]);
  }
};

// GET /events?search=tech
export const searchEvents = async (req, res) => {
  const { search = "" } = req.query;

  const events = await Event.find({
    title: { $regex: search, $options: "i" },
  }).select("_id title");

  res.json(events);
};
export const getMySubmission = async (req, res) => {
  const sub = await Submission.findOne({
    event: req.params.eventId,
    user: req.user._id,
  });

  res.json(sub);
};



///update the Report 


export const updateMySubmission = async (req, res) => {
  try {
    const sub = await Submission.findOne({
      event: req.params.eventId,
      user: req.user._id,
    });

    if (!sub)
      return res.status(404).json({ message: "Not submitted yet" });

    /* answers */
    if (req.body.answers) {
      sub.answers = JSON.parse(req.body.answers);
    }

    /* files */
    if (req.files && req.files.length > 0) {
      const uploadedUrls = [];

      for (const file of req.files) {
        const result = await uploadToCloudinary(
          file.buffer,
          "certificates"
        );

        uploadedUrls.push(result.secure_url);
      }

      sub.files = uploadedUrls; // 🔥 replace old file
    }

    await sub.save();
    res.json(sub);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


export const deleteMySubmission = async (req, res) => {
  const sub = await Submission.findOneAndDelete({
    event: req.params.eventId,
    user: req.user._id,
  });
  console.log("Reached Delete My submiison")
  if (!sub)
    return res.status(404).json({ message: "No submission" });

  await Event.findByIdAndUpdate(req.params.eventId, {
    $inc: {
      submissionsCount: -1,
      "booking.seatsBooked": -1,
    },
  });

  res.json({ message: "Deleted" });
};
export const bookEventSeat = async (req, res) => {
  const { eventId } = req.params;
  const { seatNumber } = req.body; // e.g., "A1" or "5"

  const event = await Event.findById(eventId);
  
  if (event.booking.seatsBooked >= event.booking.capacity) {
    return res.status(400).json({ message: "Event is full" });
  }

  // 1. Update the Event (Mark seat as taken)
  event.booking.seatsBooked += 1;
  event.booking.seatLabels.push(seatNumber); 
  await event.save();

  // 2. Link to user's submission
  const submission = await Submission.findOneAndUpdate(
    { event: eventId, user: req.user._id },
    { $set: { "answers.bookedSeat": seatNumber } },
    { new: true }
  );

  res.status(200).json({ message: "Seat booked successfully", submission });
};