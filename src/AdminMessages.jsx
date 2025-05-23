import React, { useEffect, useState } from "react";

function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");

  // Fonction pour récupérer les messages du backend
  useEffect(() => {
    fetch("http://localhost:5178/admin/messages")
      .then((response) => response.json())
      .then((data) => setMessages(data))
      .catch((err) => setError("❌ Erreur lors du chargement des messages."));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-green-600 mb-4">📩 Messages reçus</h1>

      {error && <p className="text-red-500">{error}</p>}

      <div className="bg-white p-4 rounded-lg shadow-md">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-green-500 text-white">
              <th className="p-2">Nom</th>
              <th className="p-2">Email</th>
              <th className="p-2">Message</th>
              <th className="p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {messages.length > 0 ? (
              messages.map((msg) => (
                <tr key={msg.id} className="border-b">
                  <td className="p-2">{msg.name}</td>
                  <td className="p-2">{msg.email}</td>
                  <td className="p-2">{msg.message}</td>
                  <td className="p-2">{new Date(msg.created_at).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-2 text-center">Aucun message reçu</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminMessages;