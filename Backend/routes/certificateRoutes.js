import express from "express";
import Certificate from "../models/Certificate.js";
import { protect } from "../middleware/auth.js"; // adjust path as needed
import axios from "axios";

const router = express.Router();

router.get("/:submissionId/download", protect, async (req, res) => {
  const cert =await Certificate.findOne({
    submission: req.params.submissionId,
    user: req.user._id,
  });

  if (!cert || !cert.fileUrl) {
    return res.status(404).json({ message: "Certificate not ready" });
  }

  const response = await axios.get(cert.fileUrl, {
    responseType: "stream",
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=certificate.pdf"
  );

  response.data.pipe(res);
});


export default router;
