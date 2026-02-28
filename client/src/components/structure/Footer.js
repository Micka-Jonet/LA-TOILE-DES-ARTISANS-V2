import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.scss';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Pour un défilement fluide
    });
  };

  return (
    <footer className="main-footer">
      <div className="footer-container">
        {/* Colonne 1 : Branding */}
        <div className="footer-col branding">
          <h2 className="footer-logo">La Toile <span>des Artisans</span></h2>
          <p>La première plateforme de mise en relation dédiée aux artisans de confiance et aux particuliers exigeants.</p>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="social-circle">
              <i className="fab fa-facebook-f"></i> {/* Si tu as FontAwesome */}
              {!window.FontAwesome} {/* Fallback texte */}
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="social-circle">
              <i className="fab fa-instagram"></i>
              {!window.FontAwesome}
            </a>
          </div>
        </div>

        {/* Colonne 2 : Navigation */}
        <div className="footer-col">
          <h4>Navigation</h4>
          <ul>
            <li><Link to="/annuaire-artisans">Annuaire</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Colonne 3 : Services */}
        <div className="footer-col">
          <h4>Services</h4>
          <ul>
            <li><Link to="/">Demander un devis</Link></li>
            <li><Link to="/inscription-artisan">Devenir partenaire</Link></li>
          </ul>
        </div>

        {/* Colonne 4 : Contact Direct */}
        <div className="footer-col contact">
          <h4>Contact</h4>
          <p>📍 Périgueux</p>
          <p>📧 jonet.micka@gmail.com</p>
          <p>📞 05 53 XX XX XX</p>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="bottom-content">
          <p>&copy; {currentYear} La Toile des Artisans - Tous droits réservés.</p>
          <div className="legal-links">
            <Link to="/mentions-legales">Mentions Légales</Link>
            <Link to="/confidentialite">Confidentialité</Link>
          </div>
        </div>
        
        {/* Flèche Retour en haut */}
        <button className="scroll-top" onClick={scrollToTop} aria-label="Remonter en haut">
          <span className="arrow">↑</span>
        </button>
      </div>
    </footer>
  );
};

export default Footer;