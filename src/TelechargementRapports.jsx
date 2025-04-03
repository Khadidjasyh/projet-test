import React from "react";

export default function TelechargementRapports() {
  const handleDownload = () => {
    // Simuler un téléchargement de rapport
    const link = document.createElement("a");
    link.href = "/exemple-rapport.pdf"; // Remplace par le vrai fichier
    link.download = "rapport-audit.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <p className="text-gray-700">Cliquez ci-dessous pour télécharger le rapport.</p>
      <button
        onClick={handleDownload}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
      >
        Télécharger le rapport
      </button>
    </div>
  );
}
