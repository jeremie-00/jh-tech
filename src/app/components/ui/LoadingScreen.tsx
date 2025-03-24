"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";

export default function LoadingScreen() {
  const [progress, setProgress] = useState(10); // Commencer à 10%
  const queryClient = useQueryClient();

  useEffect(() => {
    // Liste des clés de requêtes à surveiller
    const queryKeys = [
      "education",
      "work",
      "skill",
      "experience",
      "service",
      "imageSection",
      "textSection",
    ];

    let loadedQueries = 0;
    const totalQueries = queryKeys.length;

    // Fonction pour vérifier toutes les requêtes
    const checkAllQueriesStatus = () => {
      loadedQueries = 0;

      for (const key of queryKeys) {
        const state = queryClient.getQueryState(key);
        if (state && state.status === "success") {
          loadedQueries++;
        }
      }

      // Calculer la progression en pourcentage
      // Réserver 10% pour l'initialisation et laisser 90% pour le chargement des données
      const calculatedProgress =
        10 + Math.floor((loadedQueries / totalQueries) * 90);
      setProgress(calculatedProgress);

      // Retourner vrai si toutes les requêtes sont chargées
      return loadedQueries === totalQueries;
    };

    // Vérifier immédiatement
    let allComplete = checkAllQueriesStatus();

    const timer = setInterval(() => {
      allComplete = checkAllQueriesStatus();

      if (allComplete) {
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [queryClient]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="text-center">
        <div className="text-primary text-xl mb-4 font-title">
          Chargement des données...
        </div>
        <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-primary/80 mt-2 font-body">{progress}%</div>
      </div>
    </div>
  );
}
