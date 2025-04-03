import React from "react";

export default function Alertes() {
  const alertes = [
    { id: 1, message: "Problème détecté dans le rapport 2024" },
    { id: 2, message: "Mise à jour nécessaire pour le système" },
  ];

  return (
    <div className="space-y-2">
      {alertes.map((alerte) => (
        <div key={alerte.id} className="p-3 bg-red-100 border border-red-400 rounded-md">
          <p className="text-red-600">{alerte.message}</p>
        </div>
      ))}
    </div>
  );
}
