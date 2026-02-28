import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./RegisterArtisan.scss";

import { LISTE_METIERS } from "../../../constants/metiers";

const InscriptionArtisan = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false); // ✅ On réactive l'état de succès

  const [formData, setFormData] = useState({
    siret: "",
    entreprise: "",
    dirigeantNom: "",
    dirigeantPrenom: "",
    email: "",
    password: "",
    metier: "",
    codePostal: "",
    ville: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateField = (name, value) => {
    let error = "";
    if (name === "siret" && value.length > 0 && value.length < 14) {
      error = "Le SIRET doit comporter 14 chiffres.";
    }
    if (name === "metier" && !value) {
      error = "Veuillez sélectionner votre corps de métier.";
    }
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) error = "Format d'email invalide.";
    }
    if (name === "password") {
      if (value.length > 0 && value.length < 6) error = "Trop court (min 6).";
      if (value.length > 21) error = "Trop long (max 21).";
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const checkSiret = async (siret) => {
    if (siret.length !== 14) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `https://recherche-entreprises.api.gouv.fr/search?q=${siret}`,
      );
      const result = response.data.results[0];

      if (result) {
        setFormData((prev) => ({
          ...prev,
          entreprise: result.nom_complet,
          dirigeantNom: result.dirigeants[0]?.nom || "Non renseigné",
          dirigeantPrenom: result.dirigeants[0]?.prenoms || "Non renseigné",
          codePostal: result.siege?.code_postal || "",
          ville: result.siege?.libelle_commune || "",
        }));
        setErrors((prev) => ({ ...prev, siret: "" }));
      } else {
        setErrors((prev) => ({ ...prev, siret: "SIRET inconnu." }));
      }
    } catch (err) {
      setErrors((prev) => ({ ...prev, siret: "Erreur Insee." }));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const cleanValue = name === "siret" ? value.replace(/\D/g, "") : value;
    setFormData((prev) => ({ ...prev, [name]: cleanValue }));
    validateField(name, cleanValue);
    if (name === "siret" && cleanValue.length === 14) {
      checkSiret(cleanValue);
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        "http://localhost:5050/api/artisans/register",
        formData,
      );

      if (response.status === 201 || response.data.success) {
        // ✅ 1. On affiche l'écran de succès
        setIsRegistered(true);

        // ✅ 2. On lance le compte à rebours pour la redirection
        setTimeout(() => {
          navigate("/artisan/login");
        }, 3000); // 3 secondes pour laisser le temps de lire
      }
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        submit:
          err.response?.data?.message || "Erreur lors de l'enregistrement",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ VUE DE SUCCÈS (Avant redirection)
  if (isRegistered) {
    return (
      <div className="inscription-page">
        <div className="form-card success-card">
          <div className="icon-box">✓</div>
          <h2>Bienvenue sur la Toile !</h2>
          <p>
            Compte créé pour <strong>{formData.entreprise}</strong>.
          </p>
          <p className="redirect-info">Redirection vers la connexion...</p>
          <div className="progress-container">
            <div className="progress-bar"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="inscription-page anim-in">
      <div className="form-card">
        <div className="stepper">
          <div className={`step ${step >= 1 ? "active" : ""}`}>1</div>
          <div className={`step ${step >= 2 ? "active" : ""}`}>2</div>
        </div>

        {errors.submit && <div className="error-banner">{errors.submit}</div>}

        {step === 1 ? (
          <div className="step-content">
            <h2>Identification</h2>
            <div className="input-group">
              <label>N° SIRET (14 chiffres)</label>
              <input
                type="text"
                name="siret"
                maxLength="14"
                value={formData.siret}
                onChange={handleInputChange}
                className={errors.siret ? "input-error" : ""}
              />
              {loading && (
                <p className="loader-inline">Vérification Insee...</p>
              )}
              {errors.siret && (
                <span className="error-text">{errors.siret}</span>
              )}
            </div>

            <div className="input-group">
              <label>Entreprise</label>
              <input
                type="text"
                value={formData.entreprise}
                readOnly
                className="read-only-input"
              />
            </div>

            <div className="input-row">
              <div className="input-group">
                <label>Prénom du dirigeant</label>
                <input
                  type="text"
                  value={formData.dirigeantPrenom}
                  readOnly
                  className="read-only-input"
                />
              </div>
              <div className="input-group">
                <label>Nom du dirigeant</label>
                <input
                  type="text"
                  value={formData.dirigeantNom}
                  readOnly
                  className="read-only-input"
                />
              </div>
            </div>

            <div className="input-row">
              <div className="input-group">
                <label>Code postal</label>
                <input
                  type="text"
                  value={formData.codePostal}
                  readOnly
                  className="read-only-input"
                />
              </div>
              <div className="input-group">
                <label>Ville</label>
                <input
                  type="text"
                  value={formData.ville}
                  readOnly
                  className="read-only-input"
                />
              </div>
            </div>

            <div className="input-group">
              <label>Votre métier</label>
              <select
                name="metier"
                value={formData.metier}
                onChange={handleInputChange}
                className={errors.metier ? "input-error" : ""}
              >
                <option value="" disabled>
                  -- Choisir un métier --
                </option>
                {LISTE_METIERS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              {errors.metier && (
                <span className="error-text">{errors.metier}</span>
              )}
            </div>

            <button
              disabled={
                !formData.entreprise ||
                !formData.metier ||
                loading ||
                !!errors.siret
              }
              onClick={() => setStep(2)}
              className="btn-primary"
            >
              Continuer
            </button>
          </div>
        ) : (
          <div className="step-content">
            <h2>Sécurité</h2>
            <div className="input-group">
              <label>Email Pro</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? "input-error" : ""}
              />
              {errors.email && (
                <span className="error-text">{errors.email}</span>
              )}
            </div>
            <div className="input-group">
              <label>Mot de passe</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={errors.password ? "input-error" : ""}
              />
              {errors.password && (
                <span className="error-text">{errors.password}</span>
              )}
            </div>
            <div className="btn-group">
              <button onClick={() => setStep(1)} className="btn-back">
                Retour
              </button>
              <button
                disabled={
                  !!errors.email ||
                  !!errors.password ||
                  !formData.email ||
                  !formData.password ||
                  isSubmitting
                }
                className="btn-primary"
                onClick={handleFinalSubmit}
              >
                {isSubmitting ? "Enregistrement..." : "Créer mon compte"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InscriptionArtisan;
