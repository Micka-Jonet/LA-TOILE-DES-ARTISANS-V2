import React, { useState, useEffect } from 'react';
import './AnnuaireArtisans.scss';

// Génération de 50 artisans réalistes
const MOCK_ARTISANS = [
  { id: 1, entreprise: "Elec Pro 24", departement: "24", ville: "Périgueux", metier: "Electricité", etoiles: 5 },
  { id: 2, entreprise: "Plomberie Service", departement: "33", ville: "Bordeaux", metier: "Plomberie", etoiles: 4 },
  { id: 3, entreprise: "Maçonnerie Duchamp", departement: "24", ville: "Bergerac", metier: "Maçonnerie", etoiles: 3 },
  { id: 4, entreprise: "Voltage Expert", departement: "75", ville: "Paris", metier: "Electricité", etoiles: 5 },
  { id: 5, entreprise: "Peinture & Co", departement: "17", ville: "La Rochelle", metier: "Peinture", etoiles: 4 },
  { id: 6, entreprise: "Menuiserie du Sud", departement: "31", ville: "Toulouse", metier: "Menuiserie", etoiles: 5 },
  { id: 7, entreprise: "Aqua Flux", departement: "33", ville: "Mérignac", metier: "Plomberie", etoiles: 2 },
  { id: 8, entreprise: "Bati Rénov", departement: "24", ville: "Sarlat", metier: "Maçonnerie", etoiles: 4 },
  { id: 9, entreprise: "Ampère 24", departement: "24", ville: "Trélissac", metier: "Electricité", etoiles: 5 },
  { id: 10, entreprise: "Design Peinture", departement: "33", ville: "Pessac", metier: "Peinture", etoiles: 3 },
  { id: 11, entreprise: "Menuiserie Moderne", departement: "16", ville: "Angoulême", metier: "Menuiserie", etoiles: 4 },
  { id: 12, entreprise: "Elec Concept", departement: "87", ville: "Limoges", metier: "Electricité", etoiles: 4 },
  { id: 13, entreprise: "Plombier du Coin", departement: "24", ville: "Boulazac", metier: "Plomberie", etoiles: 5 },
  { id: 14, entreprise: "Gros Oeuvre 33", departement: "33", ville: "Libourne", metier: "Maçonnerie", etoiles: 3 },
  { id: 15, entreprise: "Color'Home", departement: "24", ville: "Nontron", metier: "Peinture", etoiles: 5 },
  { id: 16, entreprise: "Atelier Bois", departement: "19", ville: "Brive", metier: "Menuiserie", etoiles: 4 },
  { id: 17, entreprise: "Flash Elec", departement: "33", ville: "Arcachon", metier: "Electricité", etoiles: 5 },
  { id: 18, entreprise: "SOS Fuites", departement: "24", ville: "Terrasson", metier: "Plomberie", etoiles: 3 },
  { id: 19, entreprise: "Pierre & Chaux", departement: "24", ville: "Montignac", metier: "Maçonnerie", etoiles: 4 },
  { id: 20, entreprise: "Nuance Peinture", departement: "33", ville: "Talence", metier: "Peinture", etoiles: 2 },
  { id: 21, entreprise: "Menuiserie 24", departement: "24", ville: "Ribérac", metier: "Menuiserie", etoiles: 5 },
  { id: 22, entreprise: "Watt Pro", departement: "47", ville: "Agen", metier: "Electricité", etoiles: 4 },
  { id: 23, entreprise: "Tuyau Net", departement: "24", ville: "Excideuil", metier: "Plomberie", etoiles: 5 },
  { id: 24, entreprise: "Brique & Bloc", departement: "33", ville: "Gradignan", metier: "Maçonnerie", etoiles: 4 },
  { id: 25, entreprise: "Pinceau d'Or", departement: "24", ville: "Le Bugue", metier: "Peinture", etoiles: 3 },
  { id: 26, entreprise: "L'Art du Bois", departement: "33", ville: "Cenon", metier: "Menuiserie", etoiles: 5 },
  { id: 27, entreprise: "Elec 33", departement: "33", ville: "Eysines", metier: "Electricité", etoiles: 4 },
  { id: 28, entreprise: "Plomberie 24/7", departement: "75", ville: "Paris", metier: "Plomberie", etoiles: 5 },
  { id: 29, entreprise: "Maçon du Périgord", departement: "24", ville: "Vergt", metier: "Maçonnerie", etoiles: 5 },
  { id: 30, entreprise: "Peinture 87", departement: "87", ville: "Limoges", metier: "Peinture", etoiles: 4 },
  { id: 31, entreprise: "Fenêtre & Porte", departement: "24", ville: "Neuvic", metier: "Menuiserie", etoiles: 3 },
  { id: 32, entreprise: "Courant Continu", departement: "33", ville: "Lormont", metier: "Electricité", etoiles: 5 },
  { id: 33, entreprise: "Sanitaire Pro", departement: "16", ville: "Cognac", metier: "Plomberie", etoiles: 4 },
  { id: 34, entreprise: "Murs & Toits", departement: "24", ville: "Saint-Astier", metier: "Maçonnerie", etoiles: 4 },
  { id: 35, entreprise: "Déco Façade", departement: "33", ville: "Bègles", metier: "Peinture", etoiles: 5 },
  { id: 36, entreprise: "Menuiserie Gironde", departement: "33", ville: "Blaye", metier: "Menuiserie", etoiles: 4 },
  { id: 37, entreprise: "Lumière Elec", departement: "24", ville: "Thiviers", metier: "Electricité", etoiles: 3 },
  { id: 38, entreprise: "Eau Vive", departement: "33", ville: "Langon", metier: "Plomberie", etoiles: 5 },
  { id: 39, entreprise: "Bati Dordogne", departement: "24", ville: "Lalinde", metier: "Maçonnerie", etoiles: 4 },
  { id: 40, entreprise: "Peinture Passion", departement: "17", ville: "Saintes", metier: "Peinture", etoiles: 5 },
  { id: 41, entreprise: "Menuiserie Artisanale", departement: "24", ville: "Mussidan", metier: "Menuiserie", etoiles: 4 },
  { id: 42, entreprise: "Power Elec", departement: "33", ville: "Bruges", metier: "Electricité", etoiles: 5 },
  { id: 43, entreprise: "Expert Plombier", departement: "24", ville: "Chancelade", metier: "Plomberie", etoiles: 2 },
  { id: 44, entreprise: "Façade Pro", departement: "33", ville: "Gujan-Mestras", metier: "Maçonnerie", etoiles: 5 },
  { id: 45, entreprise: "Arc en Ciel", departement: "24", ville: "Hautefort", metier: "Peinture", etoiles: 4 },
  { id: 46, entreprise: "Ebéniste 33", departement: "33", ville: "Le Bouscat", metier: "Menuiserie", etoiles: 5 },
  { id: 47, entreprise: "Connect Elec", departement: "24", ville: "Brantôme", metier: "Electricité", etoiles: 4 },
  { id: 48, entreprise: "Plomberie Neuve", departement: "33", ville: "Andernos", metier: "Plomberie", etoiles: 3 },
  { id: 49, entreprise: "Renov Plus", departement: "24", ville: "Eymet", metier: "Maçonnerie", etoiles: 5 },
  { id: 50, entreprise: "Peinture du Lac", departement: "33", ville: "Arcachon", metier: "Peinture", etoiles: 4 }
];

const AnnuaireArtisans = () => {
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const artisansPerPage = 10;

  const filteredArtisans = MOCK_ARTISANS.filter(artisan => 
    filter === '' ? true : artisan.metier === filter
  );

  const indexOfLastArtisan = currentPage * artisansPerPage;
  const indexOfFirstArtisan = indexOfLastArtisan - artisansPerPage;
  const currentArtisans = filteredArtisans.slice(indexOfFirstArtisan, indexOfLastArtisan);
  const totalPages = Math.ceil(filteredArtisans.length / artisansPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const renderStars = (count) => "⭐".repeat(count);

  return (
    <div className="annuaire-page anim-in">
      <div className="container">
        <header className="annuaire-header">
          <h1>Annuaire des Artisans</h1>
          <p>Découvrez nos {filteredArtisans.length} professionnels qualifiés</p>
        </header>

        <div className="filter-section">
          <label>Corps de métier :</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">Tous les métiers</option>
            <option value="Electricité">Électricité</option>
            <option value="Plomberie">Plomberie</option>
            <option value="Maçonnerie">Maçonnerie</option>
            <option value="Peinture">Peinture</option>
            <option value="Menuiserie">Menuiserie</option>
          </select>
        </div>

        <div className="table-container">
          <table className="artisan-table">
            <thead>
              <tr>
                <th>Entreprise</th>
                <th>Dépt</th>
                <th>Ville</th>
                <th>Domaine</th>
                <th>Avis</th>
              </tr>
            </thead>
            <tbody>
              {currentArtisans.map(artisan => (
                <tr key={artisan.id}>
                  <td className="name">{artisan.entreprise}</td>
                  <td>{artisan.departement}</td>
                  <td>{artisan.ville}</td>
                  <td><span className={`badge ${artisan.metier.normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`}>{artisan.metier}</span></td>
                  <td className="stars">{renderStars(artisan.etoiles)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>Précédent</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={currentPage === i + 1 ? 'active' : ''}>
                {i + 1}
              </button>
            ))}
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>Suivant</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnuaireArtisans;