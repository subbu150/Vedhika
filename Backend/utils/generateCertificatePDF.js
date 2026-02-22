import PDFDocument from "pdfkit";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import axios from "axios"; // Needed to fetch remote images for PDF inclusion

export const generateCertificatePDF = async ({
  participantName,
  eventName,
  theme, // Pass event.theme here
  logoUrl,
}) => {
  return new Promise(async (resolve, reject) => {
    // 1. Create Document
    const doc = new PDFDocument({
      layout: "landscape",
      size: "A4",
      margin: 0, // We will handle margins manually for the border
    });

    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", async () => {
      const pdfBuffer = Buffer.concat(buffers);
      try {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "certificates", resource_type: "raw" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );
        streamifier.createReadStream(pdfBuffer).pipe(uploadStream);
      } catch (err) { reject(err); }
    });

    // --- Helper: Fetch Image Buffer for PDFKit ---
    const fetchImage = async (url) => {
      const response = await axios.get(url, { responseType: "arraybuffer" });
      return Buffer.from(response.data, "utf-8");
    };

    // --- DESIGN SETTINGS ---
    const primaryColor = theme?.primaryColor || "#3b82f6";
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;

    // 2. DRAW BACKGROUND & BORDERS
    // Main technical border
    doc.rect(20, 20, pageWidth - 40, pageHeight - 40)
       .lineWidth(2)
       .stroke(primaryColor);

    // Inner accent border
    doc.rect(30, 30, pageWidth - 60, pageHeight - 60)
       .lineWidth(0.5)
       .stroke("#cccccc");

    // Decorative Technical Corners
    const cornerSize = 50;
    doc.rect(20, 20, cornerSize, cornerSize).fill(primaryColor); // Top Left
    doc.rect(pageWidth - 20 - cornerSize, pageHeight - 20 - cornerSize, cornerSize, cornerSize).fill(primaryColor); // Bottom Right

    // 3. ADD LOGO (Technical Placement)
    if (logoUrl) {
      try {
        const logoBuffer = await fetchImage(logoUrl);
        doc.image(logoBuffer, pageWidth / 2 - 40, 60, { width: 80 });
      } catch (e) { console.log("Logo load failed", e); }
    }

    // 4. TEXT CONTENT
    doc.fillColor("#1e293b"); // Dark Navy/Slate

    // Header
    doc.fontSize(14)
       .font("Helvetica-Bold")
       .text("OFFICIAL CERTIFICATE OF ACCOMPLISHMENT", 0, 160, { align: "center", characterSpacing: 2 });

    // Main Title
    doc.fontSize(45)
       .fillColor(primaryColor)
       .font("Times-Italic")
       .text("Certificate of Completion", 0, 200, { align: "center" });

    doc.fillColor("#1e293b"); // Reset to dark
    doc.fontSize(16).font("Helvetica").text("This is to certify that", 0, 270, { align: "center" });

    // Participant Name (Bold & Large)
    doc.fontSize(35)
       .font("Helvetica-Bold")
       .text(participantName.toUpperCase(), 0, 300, { align: "center" });

    // Technical Separator Line
    doc.moveTo(pageWidth / 2 - 150, 345)
       .lineTo(pageWidth / 2 + 150, 345)
       .lineWidth(1)
       .stroke(primaryColor);

    // Event Info
    doc.fontSize(16)
       .font("Helvetica")
       .text(`has successfully demonstrated proficiency in`, 0, 370, { align: "center" });

    doc.fontSize(22)
       .font("Helvetica-Bold")
       .text(eventName, 0, 400, { align: "center" });

    // 5. FOOTER / SIGNATURE AREA
    const footerY = 480;
    
    // Date
    doc.fontSize(10).font("Helvetica").text("ISSUED ON", 100, footerY);
    doc.fontSize(12).font("Helvetica-Bold").text(new Date().toLocaleDateString(), 100, footerY + 15);

    // Verify Link (Technical touch)
    doc.fontSize(10).font("Helvetica").text("CERTIFICATE ID", pageWidth - 250, footerY);
    doc.fontSize(10).fillColor("#64748b").text(`REF-${Math.random().toString(36).toUpperCase().substring(2, 10)}`, pageWidth - 250, footerY + 15);

    doc.end();
  });
};