const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../db");

// --- 1. ROUTE DE L'ENREGISTREMENT ---
router.post("/register", async (req, res) => {
  console.log("Tentative d'inscription artisan :", req.body.email);

  const {
    entreprise,
    siret,
    dirigeantNom,
    dirigeantPrenom,
    email,
    password,
    codePostal,
    ville,
    metier,
  } = req.body;

  try {
    const [existing] = await db.query(
      "SELECT id FROM artisans WHERE siret = ?",
      [siret],
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Un compte avec ce SIRET existe déjà.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const sql = `
            INSERT INTO artisans (entreprise, siret, nom, prenom, email, password, code_postal, ville, metier)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

    const [result] = await db.query(sql, [
      entreprise,
      siret,
      dirigeantNom,
      dirigeantPrenom,
      email.toLowerCase(),
      hashedPassword,
      codePostal,
      ville,
      metier,
    ]);

    res.status(201).json({
      success: true,
      message: "Artisan inscrit avec succès !",
      artisanId: result.insertId,
    });
  } catch (error) {
    console.error("Erreur inscription :", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'enregistrement serveur.",
    });
  }
});

// --- 2. ROUTE DE LA CONNEXION ---
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Veuillez remplir tous les champs.",
    });
  }

  try {
    const [rows] = await db.query("SELECT * FROM artisans WHERE email = ?", [
      email.toLowerCase(),
    ]);

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Aucun compte trouvé avec cet email.",
      });
    }

    const validAccounts = [];

    for (const artisan of rows) {
      const isMatch = await bcrypt.compare(password, artisan.password);
      if (isMatch) {
        validAccounts.push({
          id: artisan.id,
          nom: artisan.nom,
          prenom: artisan.prenom,
          entreprise: artisan.entreprise,
          metier: artisan.metier,
          ville: artisan.ville,
          siret: artisan.siret,
          email: artisan.email,
        });
      }
    }

    if (validAccounts.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Mot de passe incorrect.",
      });
    }

    if (validAccounts.length > 1) {
      return res.status(200).json({
        success: true,
        multipleAccounts: true,
        accounts: validAccounts,
      });
    }

    const artisanProfil = validAccounts[0];
    res.status(200).json({
      success: true,
      multipleAccounts: false,
      message: `Bienvenue chez ${artisanProfil.entreprise}`,
      artisan: artisanProfil,
    });
  } catch (error) {
    console.error("Erreur lors du login :", error);
    res.status(500).json({
      success: false,
      message: "Erreur technique serveur.",
    });
  }
});

module.exports = router;
