import React from 'react';
import Hero from '../components/structure/Hero';
import './Home.scss';

const Home = () => {
  return (
    <main className="home-page">      
      <section className="features">
        <div className="container">
          <div className="feature-card">
            <div className="icon-wrapper">🛡️</div>
              <div className="card-content">
                <h3>Artisans vérifiés</h3>
                <p>Tous nos professionnels sont sélectionnés selon des critères de qualité stricts.</p>
              </div>
          </div>
          <div className="feature-card">
            <div className="icon-wrapper">⏱️</div>
            <div className="card-content">
              <h3>Réponse rapide</h3>
              <p>Recevez vos devis rapidement pour tous vos projets de travaux.</p>
            </div>
          </div>
          <div className="feature-card">
            <div className="icon-wrapper">📍</div>
            <div className="card-content">
              <h3>Proximité</h3>
              <p>Trouvez l'artisan idéal juste à côté de chez vous, partout en France.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="steps">
        <h2 className="section-title">Comment ça marche ?</h2>
        <div className="steps-container">
          <div className="step">
            <span className="step-number">01</span>
            <h4>Déposez votre demande</h4>
            <p>Décrivez votre projet en quelques clics via notre formulaire dédié.</p>
          </div>
          <div className="step">
            <span className="step-number">02</span>
            <h4>Mise en relation</h4>
            <p>Nous sélectionnons les 3 meilleurs artisans pour votre besoin spécifique.</p>
          </div>
          <div className="step">
            <span className="step-number">03</span>
            <h4>Lancez vos travaux</h4>
            <p>Comparez les devis et choisissez l'artisan qui vous convient le mieux.</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;