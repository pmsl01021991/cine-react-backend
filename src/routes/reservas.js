// src/routes/reservas.js
import express from "express";
import sgMail from "@sendgrid/mail";

const router = express.Router();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.post("/enviar-voucher", async (req, res) => {
  try {
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
      return res.status(400).json({ error: "Correo del cliente requerido" });
    }

    const html = `
      <h2>Gracias por tu compra 🎉</h2>
      <p><b>Cliente:</b> ${nombre_cliente}</p>
      <p><b>Cine:</b> ${cine}</p>
      <p><b>Película:</b> ${titulo}</p>
      <p><b>Tipo:</b> ${tipoCine}</p>
      <p><b>Horario:</b> ${horario}</p>
      <p><b>Asientos:</b> ${asientos?.join(", ")}</p>
      <p><b>Productos:</b> ${
        productos && productos.length
          ? productos.map(p => `${p.nombre} x${p.cantidad}`).join(", ")
          : "No se compraron productos"
      }</p>
      <p><b>Total pagado:</b> S/ ${total_final}</p>
      <hr/>
      <b>Cinerama</b>
    `;

    await sgMail.send({
      to: correo_cliente,
      from: "tucorreo_verificado@tudominio.com", // ⚠️ DEBE estar verificado en SendGrid
      subject: "🎟️ Tu voucher de compra - Cinerama",
      html,
    });

    res.json({ ok: true });
  } catch (error) {
    console.error(
      "❌ SENDGRID ERROR:",
      error?.response?.body || error
    );

    res.status(500).json({
      error: "Error enviando voucher",
      details: error?.response?.body || null,
    });
  }
});

export default router;
