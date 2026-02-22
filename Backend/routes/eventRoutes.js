import express from "express";
import {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  publishEvent,
  getEventShowcase
} from "../controllers/eventController.js";

import { protect, authorize } from "../middleware/auth.js";

import submissionRoutes from "./submissionRoutes.js";
import { submissionLimiter } from "../middleware/rateLimit.js";
import {
  getEventAnalytics,
  getEventTimeline
} from "../controllers/analyticsController.js";
import reactionRoutes from "./reactionRoutes.js";
import commentRoutes from "./commentRoutes.js";
import certificateRoutes from "./certificateRoutes.js";
const router = express.Router();



/* public */
router.get("/", getEvents);
router.get("/:id", getEvent);



/* admin */
router.post("/", protect, authorize("admin", "organizer"), createEvent);
router.put("/:id", protect, authorize("admin", "organizer"), updateEvent);
router.delete("/:id", protect, authorize("admin","organizer"), deleteEvent);
router.patch("/:id/publish", protect, authorize("admin", "organizer"), publishEvent);



/* nested route */
router.use("/:eventId/submissions",   submissionLimiter,submissionRoutes);
router.get("/:eventId/showcase", getEventShowcase);
router.get(
  "/:eventId/analytics",
  protect,
  authorize("admin", "organizer"),
  getEventAnalytics
);

router.get(
  "/:eventId/analytics/timeline",
  protect,
  authorize("admin", "organizer"),
  getEventTimeline
);
router.use("/:eventId/comments", commentRoutes);
router.use("/:eventId/reactions", reactionRoutes);
router.use("/:eventId/certificates", certificateRoutes);

export default router;
