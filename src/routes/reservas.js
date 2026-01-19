// src/routes/reservas.js
import express from "express";
import { Resend } from "resend";

const router = express.Router();

// 🔑 Resend usa la API Key desde Render
const resend = new Resend(process.env.RESEND_API_KEY);

router.post("/enviar-voucher", async (req, res) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error("❌ RESEND_API_KEY NO DEFINIDA");
      return res.status(500).json({ error: "Email service not configured" });
    }

    const {
      nombre_cliente,
      correo_cliente,
      cine,
      titulo,
      tipoCine,
      horario,
      asientos,
      productos,
      total_final,
    } = req.body;

    if (!correo_cliente) {
      return res.status(400).json({ error: "Correo requerido" });
    }

    const html = `
      <h2>🎟️ Voucher Cinerama</h2>
      <p><b>Cliente:</b> ${nombre_cliente}</p>
      <p><b>Cine:</b> ${cine}</p>
      <p><b>Película:</b> ${titulo}</p>
      <p><b>Tipo:</b> ${tipoCine}</p>
      <p><b>Horario:</b> ${horario}</p>
      <p><b>Asientos:</b> ${asientos?.join(", ")}</p>
      <p><b>Total:</b> S/ ${total_final}</p>
    `;

    const result = await resend.emails.send({
      from: "Cinerama <onboarding@resend.dev>",
      to: correo_cliente,
      subject: "🎟️ Tu voucher de compra - Cinerama",
      html,
    });

    console.log("✅ Email enviado:", result);

    return res.json({ ok: true });
  } catch (error) {
    console.error("❌ ERROR RESEND:", error);
    return res.status(500).json({ error: "Error enviando voucher" });
  }
});


export default router;
