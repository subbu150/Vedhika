import express from "express";
import {
  getUsers,
  getUser,
  deleteUser,
  updateUserRole
} from "../controllers/userController.js";

import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, authorize("admin"), getUsers);
router.get("/:id", protect, getUser);
router.delete("/:id", protect, authorize("admin"), deleteUser);
router.patch(
  "/:id/role",
  protect,
  authorize("admin"),
  updateUserRole
);

export default router;
