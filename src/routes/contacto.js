import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

/**
 * 📩 POST /api/contacto
 * Envía mensaje de contacto por correo
 */
router.post("/", async (req, res) => {
  const { nombre, apellidos, email, asunto, cine, mensaje } = req.body;

  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ error: "Campos obligatorios incompletos" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `Contacto Cinerama 🎬 <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_USER, // correo del admin
      replyTo: email,
      subject: asunto || "Nuevo mensaje de contacto - Cinerama",
      html: `
        <h2>📩 Nuevo mensaje de contacto</h2>
        <p><b>Nombre:</b> ${nombre} ${apellidos || ""}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Cine:</b> ${cine || "No especificado"}</p>
        <p><b>Mensaje:</b></p>
        <p>${mensaje}</p>
      `,
    });

    res.json({ ok: true });
  } catch (error) {
    console.error("❌ Error enviando mensaje de contacto:", error);
    res.status(500).json({ error: "Error enviando mensaje" });
  }
});

export default router;
