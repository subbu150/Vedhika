import express from "express";
import { protect } from "../middleware/auth.js";
import {
  createComment,
  getComments,
  deleteComment
} from "../controllers/commentController.js";

const router = express.Router({ mergeParams: true });

router.post("/", protect, createComment);
router.get("/", getComments);
router.delete("/:commentId", protect, deleteComment);

export default router;
