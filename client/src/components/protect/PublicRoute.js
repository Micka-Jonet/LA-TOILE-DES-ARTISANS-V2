import React from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const user = localStorage.getItem("user");

  //Debug dans la console du navigateur
  console.log("Vérification PublicRoute, user trouvé :", user);

  if (user) {
    //Si déjà connecté, on redirige vers le dashboard
    return <Navigate to="/artisan/dashboard" replace />;
  }

  //Sinon on affiche la page demandée
  return children;
};

export default PublicRoute;
