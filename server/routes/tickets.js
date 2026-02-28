const express = require("express");
const router = express.Router();
const db = require("../db");

// --- CRÉER UN TICKET (SANS TÉLÉPHONE) ---
router.post("/create", async (req, res) => {
  const {
    client_nom,
    client_email,
    description,
    metier_requis,
    code_postal,
    ville_chantier,
  } = req.body;

  const sql = `
    INSERT INTO tickets 
    (client_nom, client_email, description, metier_requis, code_postal, ville_chantier, statut) 
    VALUES (?, ?, ?, ?, ?, ?, 'en_attente')
  `;

  try {
    const [result] = await db.query(sql, [
      client_nom,
      client_email,
      description,
      metier_requis,
      code_postal,
      ville_chantier,
    ]);

    res.status(201).json({ success: true, ticketId: result.insertId });
  } catch (err) {
    console.error("Erreur SQL :", err.sqlMessage);
    res
      .status(500)
      .json({ message: "Erreur lors de l'enregistrement de la demande." });
  }
});

// --- RÉCUPÉRER LES TICKETS POUR UN MÉTIER ---
router.get("/all", async (req, res) => {
  try {
    const sql = `
          SELECT * FROM tickets WHERE statut = 'en_attente' ORDER BY created_at DESC
    `;
    const [rows] = await db.query(sql);
    res.json({ success: true, tickets: rows });
  } catch (err) {
    res.status(500).json({ message: "Erreur récupération." });
  }
});

module.exports = router;
