import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./DemandeParticulier.scss";

import { LISTE_METIERS } from "../../constants/metiers";

const DemandeParticulier = () => {
  const [step, setStep] = useState(1);
  const [isSent, setIsSent] = useState(false);
  const [villes, setVilles] = useState([]);
  const [loadingVilles, setLoadingVilles] = useState(false);

  // --- ÉTATS POUR LE COMPTE À REBOURS ---
  const [timeLeft, setTimeLeft] = useState(null); // Temps restant en secondes
  const SPAM_DELAY = 30 * 60 * 1000; // 30 minutes

  const [formData, setFormData] = useState({
    typeTravaux: "",
    description: "",
    codePostal: "",
    ville: "",
    prenom: "",
    nom: "",
    email: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // --- LOGIQUE DU COMPTE À REBOURS (SÉCURITÉ) ---
  useEffect(() => {
    // [DÉBUT SÉCURITÉ DÉSACTIVABLE]
    const checkSpam = () => {
      const lastSubmission = localStorage.getItem("last_submission_time");
      if (lastSubmission) {
        const diff = Date.now() - parseInt(lastSubmission);
        if (diff < SPAM_DELAY) {
          setTimeLeft(Math.ceil((SPAM_DELAY - diff) / 1000));
        }
      }
    };

    checkSpam();
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev && prev > 0 ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(timer);
    // [FIN SÉCURITÉ DÉSACTIVABLE]
  }, []);

  // Formate les secondes en MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "typeTravaux":
        if (!value) error = "Sélectionnez un métier";
        break;
      case "description":
        if (value.trim().length < 10)
          error = "Détaillez votre projet (min 10 car.)";
        break;
      case "codePostal":
        if (!/^\d{5}$/.test(value)) error = "5 chiffres requis";
        break;
      case "ville":
        if (!value) error = "Ville obligatoire";
        break;
      case "prenom":
        if (value.trim().length < 2) error = "Prénom trop court";
        break;
      case "nom":
        if (value.trim().length < 2) error = "Nom trop court";
        break;
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Email invalide";
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) validateField(name, value);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  // API GOUV VILLES
  useEffect(() => {
    if (formData.codePostal.length === 5) {
      setLoadingVilles(true);
      axios
        .get(
          `https://geo.api.gouv.fr/communes?codePostal=${formData.codePostal}`,
        )
        .then((res) => {
          setVilles(res.data);
          if (res.data.length === 1)
            setFormData((p) => ({ ...p, ville: res.data[0].nom }));
        })
        .finally(() => setLoadingVilles(false));
    }
  }, [formData.codePostal]);

  const canGoNext = () => {
    if (step === 1)
      return (
        formData.typeTravaux &&
        formData.description.length >= 10 &&
        !errors.description
      );
    if (step === 2)
      return formData.codePostal && formData.ville && !errors.codePostal;
    if (step === 3)
      return formData.prenom && formData.nom && formData.email && !errors.email;
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //On vérifie que tout est ok avant l'envoi
    if (canGoNext()) {
      try {
        // On prépare les données
        const dataForBackend = {
          client_nom: `${formData.prenom} ${formData.nom}`,
          client_email: formData.email,
          description: formData.description,
          metier_requis: formData.typeTravaux, //On mappe le métier
          code_postal: formData.codePostal,
          ville_chantier: formData.ville,
        };

        // Envoi de la requête au serveur
        const response = await axios.post(
          "http://localhost:5050/api/tickets/create",
          dataForBackend,
        );

        if (response.data.success) {
          //Sécurité anti spam
          localStorage.setItem("last_submission_time", Date.now().toString());
          //Affichage de l'écran de succès
          setIsSent(true);
        }
      } catch (err) {
        console.log("Erreur envoi formulaire :", err);
        alert("Une erreur est survenue lors de l'envoi de la demande.");
      }
    }
  };

  // --- RENDU SI BLOQUÉ ---
  if (timeLeft !== null) {
    return (
      <div className="spam-blocked anim-in">
        <div className="timer-circle">{formatTime(timeLeft)}</div>
        <h2>Patience !</h2>
        <p>
          Pour éviter les doublons, merci de patienter avant de renvoyer une
          nouvelle demande.
        </p>
        <Link to="/" className="btn-home">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  // --- RENDU SUCCÈS ---
  if (isSent) {
    return (
      <div className="success-container anim-in">
        <div className="check-icon">✓</div>
        <h2>Demande transmise !</h2>
        <p>
          Merci {formData.prenom}, nos artisans partenaires reviendront vers
          vous rapidement.
        </p>
        <Link to="/" className="btn-home">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="devis-page">
      <div className="form-card">
        <div className="stepper">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`step ${step >= s ? "active" : ""} ${step > s ? "completed" : ""}`}
            >
              {s}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="form-step anim-in">
              <h2>Votre projet</h2>
              <div
                className={`input-group ${touched.typeTravaux && errors.typeTravaux ? "error" : ""}`}
              >
                <label>Métier</label>
                <select
                  name="typeTravaux"
                  value={formData.typeTravaux}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value="">Sélectionnez...</option>
                  {LISTE_METIERS.map((metier) => (
                    <option key={metier} value={metier}>
                      {metier}
                    </option>
                  ))}
                </select>
              </div>
              <div
                className={`input-group ${touched.description && errors.description ? "error" : ""}`}
              >
                <label>Description (obligatoire)</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Détaillez votre besoin..."
                />
                {touched.description && errors.description && (
                  <span className="error-text">{errors.description}</span>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="form-step anim-in">
              <h2>Localisation</h2>
              <div
                className={`input-group ${touched.codePostal && errors.codePostal ? "error" : ""}`}
              >
                <label>Code Postal</label>
                <input
                  name="codePostal"
                  type="text"
                  maxLength="5"
                  value={formData.codePostal}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="24000"
                />
                {touched.codePostal && errors.codePostal && (
                  <span className="error-text">{errors.codePostal}</span>
                )}
              </div>
              <div
                className={`input-group ${touched.ville && errors.ville ? "error" : ""}`}
              >
                <label>Ville</label>
                <select
                  name="ville"
                  value={formData.ville}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={villes.length === 0}
                >
                  <option value="">
                    {loadingVilles ? "Chargement..." : "Sélectionner une ville"}
                  </option>
                  {villes.map((v) => (
                    <option key={v.code} value={v.nom}>
                      {v.nom}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="form-step anim-in">
              <h2>Vos informations</h2>
              <div className="input-row">
                <div
                  className={`input-group ${touched.prenom && errors.prenom ? "error" : ""}`}
                >
                  <label>Prénom</label>
                  <input
                    name="prenom"
                    type="text"
                    value={formData.prenom}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <div
                  className={`input-group ${touched.nom && errors.nom ? "error" : ""}`}
                >
                  <label>Nom</label>
                  <input
                    name="nom"
                    type="text"
                    value={formData.nom}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </div>
              <div
                className={`input-group ${touched.email && errors.email ? "error" : ""}`}
              >
                <label>Email</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
            </div>
          )}

          <div className="form-actions">
            {step > 1 && (
              <button
                type="button"
                className="btn-back"
                onClick={() => setStep(step - 1)}
              >
                Retour
              </button>
            )}
            <button
              type={step < 3 ? "button" : "submit"}
              className={step < 3 ? "btn-next" : "btn-submit"}
              disabled={!canGoNext()}
              onClick={() => step < 3 && setStep(step + 1)}
            >
              {step < 3 ? "Continuer" : "Envoyer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DemandeParticulier;
