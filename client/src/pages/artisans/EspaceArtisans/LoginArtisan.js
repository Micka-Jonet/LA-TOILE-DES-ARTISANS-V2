import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginArtisan.scss";

const LoginArtisan = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // --- ÉTATS POUR LES MULTI-COMPTES ---
  const [multipleAccounts, setMultipleAccounts] = useState([]);
  const [showAccountSelector, setShowAccountSelector] = useState(false);

  const navigate = useNavigate();

  const validate = (name, value) => {
    let error = "";
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) error = "L'email est requis";
      else if (!emailRegex.test(value)) error = "Format d'email invalide";
    }
    if (name === "password") {
      if (!value) error = "Le mot de passe est requis";
    }
    setErrors((prev) => ({ ...prev, [name]: error, auth: "" }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    validate(name, value);
  };

  // --- FONCTION POUR FINALISER LA CONNEXION ---
  const finalizeLogin = (artisanData) => {
    // ON STOCK
    localStorage.setItem("user", JSON.stringify(artisanData));

    setIsLoggingIn(true);

    // ON ATTEND QUE LE STATE VISUEL DE SUCCES SOIT PASSE
    setTimeout(() => {
      // ON REDIRIGE VERS TA ROUTE
      window.location.href = "/artisan/dashboard";
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      errors.email ||
      errors.password ||
      !credentials.email ||
      !credentials.password
    )
      return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await axios.post(
        "http://localhost:5050/api/artisans/login",
        {
          email: credentials.email,
          password: credentials.password,
        },
      );

      if (response.data.multipleAccounts) {
        setMultipleAccounts(response.data.accounts);
        setShowAccountSelector(true);
      } else if (response.data.success) {
        finalizeLogin(response.data.artisan);
      }
    } catch (err) {
      setErrors({
        auth: err.response?.data?.message || "Identifiants incorrects.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // --- VUE 1 : CHARGEMENT / SUCCÈS ---
  if (isLoggingIn) {
    return (
      <div className="login-page">
        <div className="login-card success-login">
          <div className="check-icon">✓</div>
          <h2>Connexion réussie !</h2>
          <p>Préparation de votre tableau de bord...</p>
          <div className="loader-container">
            <div className="loader-bar"></div>
          </div>
        </div>
      </div>
    );
  }

  // --- VUE 2 : SÉLECTEUR D'ENTREPRISE ---
  if (showAccountSelector) {
    return (
      <div className="login-page">
        <div className="login-card account-selector anim-in">
          <h2>
            Choisissez votre <span>Entreprise</span>
          </h2>
          <p>Plusieurs comptes sont liés à cet email :</p>
          <div className="accounts-list">
            {multipleAccounts.map((acc) => (
              <div
                key={acc.id}
                className="account-item"
                onClick={() => finalizeLogin(acc)}
              >
                <div className="acc-info">
                  <strong>{acc.entreprise}</strong>
                  <span>SIRET : {acc.siret}</span>
                </div>
                <div className="acc-arrow">➔</div>
              </div>
            ))}
          </div>
          <button
            className="btn-back-login"
            onClick={() => setShowAccountSelector(false)}
          >
            Retour au formulaire
          </button>
        </div>
      </div>
    );
  }

  // --- VUE 3 : FORMULAIRE DE LOGIN ---
  return (
    <div className="login-page anim-in">
      <div className="login-card">
        <div className="login-header">
          <h2>
            Espace <span>Artisan</span>
          </h2>
          <p>Connectez-vous pour gérer vos demandes</p>
        </div>

        {errors.auth && <div className="error-banner">{errors.auth}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className={`input-group ${errors.email ? "has-error" : ""}`}>
            <label htmlFor="email">Email professionnel</label>
            <input
              type="email"
              name="email"
              placeholder="artisan@exemple.fr"
              value={credentials.email}
              onChange={handleChange}
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className={`input-group ${errors.password ? "has-error" : ""}`}>
            <div className="label-row">
              <label htmlFor="password">Mot de passe</label>
              <Link to="/forgot-password" id="forgot-link">
                Oublié ?
              </Link>
            </div>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={credentials.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "🙈"}
              </button>
            </div>
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <button
            type="submit"
            className="btn-login"
            disabled={isLoading || !!errors.email || !!errors.password}
          >
            {isLoading ? "Vérification..." : "Se connecter"}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Pas de compte professionnel ?{" "}
            <Link to="/artisan/register">Rejoindre les artisans</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginArtisan;
