const nodemailer = require("nodemailer");

exports.transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use true for port 465, false for port 587
  auth: {
    user: "englishbybudi@gmail.com",
    pass: "2017101071989bud!030107215bud!",
  },
});
exports.sendEmailto = async (req, res) => {
  const emailUser = req.body.email; // ⬅️ email PENERIMA

  await transporter.sendMail({
    from: '"Website Kamu" <admin@domain.com>',
    to: emailUser, // ⬅️ DI SINI
    subject: "Kode OTP",
    text: "Kode OTP kamu adalah 123456",
  });

  res.json({ message: "OTP dikirim" });
};
