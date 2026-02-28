const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Importation de la connexion à la BDD (teste- de connexion automatique)
const db = require("./db");

// Importation des routes
const artisanRoutes = require("./routes/artisanRoutes");
const ticketRoutes = require("./routes/tickets");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Pour lire le JSON dans les requêtes

// Route de test (Santé serveur)
app.get("/test", (req, res) => {
  res.json({
    message: "Le serveur de La Toile des Artisans répond parfaitement ! 🚀",
  });
});

// Branchement des routes artisans (préfixés par /api/artisans)
app.use("/api/artisans", artisanRoutes);

app.use("/api/tickets", ticketRoutes);

// Lancement du serveur
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`---`);
  console.log(`🛜 SERVEUR : lancé sur : http://localhost:${PORT}`);
  console.log(`📡 ATTENTE : Prêt à reçevoir des requêtes...`);
  console.log(`---`);
});
