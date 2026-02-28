import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import ProtectedRoute from "./components/protect/ProtectedRoute";
import PublicRoute from "./components/protect/PublicRoute";
import LoadingScreen from "./components/LoadingScreen";
import Header from "./components/structure/Header";
import Hero from "./components/structure/Hero";
import Footer from "./components/structure/Footer";

import Home from "./pages/Home";
import DemandeParticulier from "./pages/particulier/DemandeParticulier";
import AnnuaireArtisans from "./pages/artisans/annuaire/AnnuaireArtisans";
import LoginArtisan from "./pages/artisans/EspaceArtisans/LoginArtisan";
import RegisterArtisan from "./pages/artisans/EspaceArtisans/RegisterArtisan";
import DashboardArtisan from "./pages/artisans/Dashboard/DashboardArtisan";

import "./App.scss";

// 1. Le composant qui gère l'affichage interne
const AppContent = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  // On définit la logique de contenu ici
  const getHeroContent = () => {
    switch (location.pathname) {
      case "/particulier/demande": // Attention, j'ai mis le chemin complet ici
        return {
          title: "Décrivez votre projet",
          subtitle: "Plus de détails pour des devis plus précis.",
        };
      default:
        return {
          title: "Trouvez l'artisan de confiance pour vos projets",
          subtitle:
            "La plateforme qui connecte particuliers et artisans locaux.",
        };
    }
  };

  const { title, subtitle } = getHeroContent();

  return (
    <div className="app-container">
      <Header />
      <Hero title={title} subtitle={subtitle} isSmall={isHomePage} />

      <main>
        <Routes>
          {/* 🔒 ROUTES PUBLIQUES : Inaccessibles si connecté */}
          <Route
            path="/artisan/register"
            element={
              <PublicRoute>
                <RegisterArtisan />
              </PublicRoute>
            }
          />
          <Route
            path="/artisan/login"
            element={
              <PublicRoute>
                <LoginArtisan />
              </PublicRoute>
            }
          />
          <Route
            path="/particulier/demande"
            element={
              <PublicRoute>
                <DemandeParticulier />
              </PublicRoute>
            }
          />

          {/* 🛡️ ROUTES PRIVEES : Inaccessibles si déconnecté */}
          <Route
            path="/artisan/dashboard"
            element={
              <ProtectedRoute>
                <DashboardArtisan />
              </ProtectedRoute>
            }
          />

          {/* ✅ ROUTES LIBRES */}
          <Route path="/" element={<Home />} />
          <Route path="/annuaire-artisans" element={<AnnuaireArtisans />} />
          <Route path="/artisan/dashboard" element={<DashboardArtisan />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

// 2. Le composant principal
function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
