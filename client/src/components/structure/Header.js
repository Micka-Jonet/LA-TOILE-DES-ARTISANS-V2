import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Header.scss";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ CORRECTION : On écoute la clé "user" (celle qu'on utilise partout ailleurs)
  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, [location]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Fonction de déconnexion
  const handleLogout = () => {
    // ✅ CORRECTION : On vide la clé "user"
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    closeMenu();
    navigate("/");
  };

  return (
    <header className="main-header">
      <div className="logo">
        <Link to="/" onClick={closeMenu}>
          La Toile <span>des Artisans</span>
        </Link>
      </div>

      <div
        className={`burger-icon ${isMenuOpen ? "open" : ""}`}
        onClick={toggleMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      <nav className={`header-nav ${isMenuOpen ? "active" : ""}`}>
        <div className="header-actions">
          {/* ✅ Si l'artisan n'est PAS connecté */}
          {!isLoggedIn ? (
            <>
              <Link
                to="/particulier/demande"
                className="nav-link-request"
                onClick={closeMenu}
              >
                Déposer une demande
              </Link>
              <Link
                to="/artisan/login"
                className="btn-artisan"
                onClick={closeMenu}
              >
                Espace Artisan
              </Link>
            </>
          ) : (
            /* ✅ Si l'artisan EST connecté */
            <>
              <Link
                to="/artisan/dashboard"
                className="nav-link-dashboard"
                onClick={closeMenu}
              >
                Mon Tableau de Bord
              </Link>
              <button onClick={handleLogout} className="btn-logout">
                Déconnexion
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
