import express from "express";
import { protect } from "../middleware/auth.js";
import {
  toggleReaction,
  getReactionCount
} from "../controllers/reactionController.js";

const router = express.Router({ mergeParams: true });

/* ===================================================
   REACTIONS (nested under event)
   Base: /events/:eventId/reactions
=================================================== */

/*
  Toggle like/unlike
  POST /events/:eventId/reactions
*/
router.post(
  "/",
  protect,
  toggleReaction
);

/*
  Get total reactions count
  GET /events/:eventId/reactions
*/
router.get(
  "/",
  getReactionCount
);

export default router;
