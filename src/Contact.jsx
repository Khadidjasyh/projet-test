import React, { useState } from "react";

function Contact({ navigateTo }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fonction de mise à jour des champs du formulaire
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Fonction d'envoi du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus("");

    try {
      const response = await fetch("http://localhost:5177/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("📩 Réponse du serveur :", data);

      if (response.ok) {
        setStatus("✅ Message envoyé avec succès !");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus(`❌ Erreur : ${data.error || "Erreur lors de l'envoi."}`);
      }
    } catch (error) {
      console.error("❌ Erreur d'envoi :", error);
      setStatus("❌ Impossible de contacter le serveur.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-green-600 mb-4">Contactez-nous</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Nom</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            placeholder="Votre nom"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            placeholder="Votre email"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            rows="4"
            placeholder="Votre message"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className={`w-full bg-green-600 text-white py-2 rounded-lg transition ${
            isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Envoi en cours..." : "Envoyer"}
        </button>
      </form>

      {status && <p className={`mt-4 ${status.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>{status}</p>}

      <button
        onClick={() => navigateTo("home")}
        className="mt-6 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
      >
        Retour
      </button>
    </div>
  );
}

export default Contact;