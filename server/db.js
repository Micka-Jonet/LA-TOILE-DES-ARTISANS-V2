// Connexion à la bdd
const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 8889, // On ajoute le port spécifique à MAMP
  waitForConnections: true,
  connectionLimit: 10,
});

// Tester la connexion immédiat
pool.getConnection((err, connection) => {
  if (err) {
    console.log("---");
    console.log("❌ ERREUR : Impossible de se connecter à MySQL.");
    console.log("Détail :", err.message);
    console.log("Vérifier que MAMP est lancé et que le port est le bon");
    console.log("---");
  } else {
    console.log("---");
    console.log("✅ CONNEXION BDD : Réussi ! Le pont vers MAMP est actif.");
    console.log("---");
    connection.release(); // On libère la connexion après le test
  }
});

module.exports = pool.promise();
