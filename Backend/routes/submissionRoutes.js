import express from "express";
import {
  createSubmission,
  getEventSubmissions,
  getSubmission,
  updateSubmissionStatus,
  deleteSubmission,
  searchEvents,
  getMySubmission,
  updateMySubmission,
  deleteMySubmission,
  bookEventSeat
 
  
} from "../controllers/submissionController.js";

import { protect, authorize } from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import { submissionLimiter } from "../middleware/rateLimit.js"; 
const router = express.Router({ mergeParams: true });



/* ===================================================
   USER ROUTES
=================================================== */

/* Create submission (upload files + answers) */
router.post(
  "/",
  protect,
  upload.array("files"),   // multer here ⭐
  createSubmission
);

/* Delete own submission */




/* ===================================================
   ORGANIZER / ADMIN ROUTES
=================================================== */

/* View all submissions of event */
router.get(
  "/",
  protect,
  authorize("admin", "organizer","participant"),
  getEventSubmissions
);
router.get("/events", searchEvents);
router.get("/me",protect,getMySubmission);
router.put(
  "/me",
  protect,
  upload.array("files"),   // 🔥 THIS LINE REQUIRED
  updateMySubmission
);

router.delete("/me", protect, deleteMySubmission);
router.delete("/:submissionId", protect, deleteSubmission);
/* View single submission */
router.get(
  "/:submissionId",
  protect,
  authorize("admin", "organizer"),
  getSubmission
);

/* Approve / Reject submission */
router.patch(
  "/:submissionId/status",
  protect,
  authorize("admin", "organizer"),
  updateSubmissionStatus
);

// Route for booking a specific seat
router.post(
  "/book-seat",
  protect,
  // This assumes your controller handles the logic below
  bookEventSeat 
);

export default router;
