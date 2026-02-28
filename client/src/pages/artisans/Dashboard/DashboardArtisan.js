import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./DashboardArtisan.scss";

const DashboardArtisan = () => {
  // --- ÉTATS ---
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMetier, setFilterMetier] = useState("Tous");

  const ticketsPerPage = 6;

  // --- RÉCUPÉRATION USER ---
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;

  useEffect(() => {
    // Sécurité : Si pas de session, on dégage au login
    if (!user) {
      console.log("Accès refusé : pas d'utilisateur trouvé.");
      navigate("/login");
    } else {
      // ton appel axios pour les tickets
      axios
        .get("http://localhost:5050/api/tickets/all")
        .then((res) => {
          if (res.data.success) setTickets(res.data.tickets);
        })
        .finally(() => setLoading(false));
    }
  }, []);

  // --- LOGIQUE DES INITIALES (Le correctif) ---
  const getInitials = () => {
    if (!user) return "??";
    const p = user.prenom || "";
    const n = user.nom || "";
    // Si on a les deux, on les affiche, sinon on met ??
    return p && n ? (p[0] + n[0]).toUpperCase() : "??";
  };

  // --- FILTRAGE ET RECHERCHE ---
  const filteredTickets = tickets.filter((t) => {
    const matchSearch =
      t.client_nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.ville_chantier?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchMetier =
      filterMetier === "Tous" || t.metier_requis === filterMetier;
    return matchSearch && matchMetier;
  });

  // --- PAGINATION ---
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = filteredTickets.slice(
    indexOfFirstTicket,
    indexOfLastTicket,
  );
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (!user) return null;

  return (
    <div className="dashboard-wrapper anim-in">
      {/* --- SIDEBAR COMPLÈTE --- */}
      <aside className="dashboard-sidebar">
        <div className="user-profile-header">
          <div className="avatar-large">{getInitials()}</div>
          <div className="user-info">
            <h3 className="user-name">
              {user.prenom} {user.nom}
            </h3>
            <p className="user-status">{user.entreprise}</p>
          </div>
        </div>

        <nav className="main-nav">
          <button className="active">🏠 Tableau de bord</button>
          <button>📁 Mes Chantiers</button>
          <button>💬 Messagerie</button>
          <button>👤 Mon Profil</button>
          <button>⚙️ Paramètres</button>
        </nav>
      </aside>

      {/* --- CONTENU PRINCIPAL --- */}
      <main className="dashboard-main">
        <header className="view-header">
          <div className="header-left">
            <h1>Tableau de bord</h1>
            <p>
              Bienvenue, <strong>{user.prenom}</strong>. Voici les opportunités
              du jour.
            </p>
          </div>

          <div className="header-filters">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Rechercher une ville..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={filterMetier}
              onChange={(e) => setFilterMetier(e.target.value)}
            >
              <option value="Tous">Tous les métiers</option>
              <option value="Plomberie">Plomberie</option>
              <option value="Électricité">Électricité</option>
              <option value="Peinture">Peinture</option>
            </select>
          </div>
        </header>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Chargement des demandes en cours...</p>
          </div>
        ) : (
          <div className="content-grid">
            {/* COLONNE DES TICKETS */}
            <div className="tickets-column">
              <div className="section-title">
                <h3>Demandes à proximité ({filteredTickets.length})</h3>
              </div>

              {currentTickets.length > 0 ? (
                <div className="tickets-list">
                  {currentTickets.map((t) => (
                    <div key={t.id} className="ticket-card anim-in">
                      <div className="card-header">
                        <span className="metier-tag">{t.metier_requis}</span>
                        <span className="date-tag">
                          {new Date(t.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h4>{t.client_nom}</h4>
                      <div className="location">
                        📍 {t.ville_chantier} ({t.code_postal})
                      </div>
                      <p className="description">{t.description}</p>
                      <div className="card-footer">
                        <button className="btn-details">
                          Voir le chantier
                        </button>
                        <button className="btn-save">⭐</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-results">
                  <p>Aucun chantier ne correspond à votre recherche.</p>
                </div>
              )}

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="pagination">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => paginate(i + 1)}
                      className={currentPage === i + 1 ? "active" : ""}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* COLONNE DES STATS / RÉSUMÉ */}
            <div className="stats-column">
              <div className="stats-card user-summary">
                <h3>Mon Activité</h3>
                <div className="stat-item">
                  <span>Entreprise</span>
                  <strong>{user.entreprise}</strong>
                </div>
                <div className="stat-item">
                  <span>SIRET</span>
                  <strong>{user.siret}</strong>
                </div>
                <div className="stat-item">
                  <span>Métier principal</span>
                  <strong>{user.metier}</strong>
                </div>
              </div>

              <div className="stats-card info-box">
                <h4>Conseil du jour </h4>
                <p>
                  Répondez aux demandes en moins de 2h pour augmenter vos
                  chances de succès de 40%.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardArtisan;
