// src/routes/reservas.js
import express from "express";

const router = express.Router();

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
      return res.status(400).json({ error: "Correo requerido" });
    }

    // 🔥 SIMULACIÓN (por ahora)
    console.log("📩 Simulando envío de voucher a:", correo_cliente);
    console.log({
      nombre_cliente,
      cine,
      titulo,
      tipoCine,
      horario,
      asientos,
      total_final,
    });

    return res.json({ ok: true, simulated: true });
  } catch (error) {
    console.error("❌ ERROR:", error);
    return res.status(500).json({ error: "Error enviando voucher" });
  }
});

export default router;
