import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  //On vérifie si l'utilisateur est présent dans le stockage
  const isAuthenticated = localStorage.getItem("user");

  if (!isAuthenticated) {
    //Si pas de session, on redirige vers le login
    return <Navigate to="/artisan/login" replace />;
  }

  //Si ok, on affiche la page demandée
  return children;
};

export default ProtectedRoute;
