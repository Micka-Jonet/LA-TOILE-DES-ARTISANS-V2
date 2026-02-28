import React, { useState, useEffect } from 'react'; 
import './Hero.scss';

// Import de tes images (vérifie que les noms de fichiers sont les bons)
import heroBg1 from '../../assets/images/hero-bg-1.jpg';
import heroBg2 from '../../assets/images/hero-bg-2.jpg';
import heroBg3 from '../../assets/images/hero-bg-3.jpg';
import heroBg4 from '../../assets/images/hero-bg-4.jpg';

const backgroundImages = [heroBg1, heroBg2, heroBg3, heroBg4];

const Hero = ({ title, subtitle, isSmall }) => {
  const [currentBg, setCurrentBg] = useState('');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    setCurrentBg(backgroundImages[randomIndex]);
  }, [title, subtitle]);

  return (
    <section 
      className={`hero ${!isSmall ? 'hero-small' : ''}`}
      style={{ backgroundImage: `url(${currentBg})` }}
    >
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </section>
  );
};

export default Hero;