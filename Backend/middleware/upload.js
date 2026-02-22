import multer from "multer";

/* store in memory (not disk) */
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});
console.log("Multer upload middleware configured with memory storage and 5MB file size limit.");
export default upload;
