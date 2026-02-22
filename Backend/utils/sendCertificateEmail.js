import transporter from "../config/mailer.js";

export const sendCertificateEmail = async ({
  to,
  name,
  eventName,
  certificateUrl
}) => {
  await transporter.sendMail({
    from: `"Event Team" <${process.env.EMAIL_USER}>`,
    to,
    subject: `🎉 Your Certificate - ${eventName}`,
    html: `
      <div style="font-family:sans-serif">
        <h2>Hi ${name},</h2>

        <p>
          Your certificate for <b>${eventName}</b> is ready 🎉
        </p>

        <a href="${certificateUrl}"
           style="padding:10px 18px;
                  background:#2563eb;
                  color:white;
                  text-decoration:none;
                  border-radius:6px;">
          Download Certificate
        </a>

        <p style="margin-top:20px;">
          Thanks for participating!
        </p>
      </div>
    `
  });
};
