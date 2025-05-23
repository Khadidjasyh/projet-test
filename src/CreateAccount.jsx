import { useState } from 'react';

function CreateAccount() {
  const [name, setName] = useState('');
  const [prenom, setPrenom] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const response = await fetch("http://localhost:5178/api/auth/create-user", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, prenom, username, email, telephone, role })
    });
    if (response.ok) {
      setSuccess("Utilisateur créé, lien d'activation envoyé !");
      setName('');
      setPrenom('');
      setUsername('');
      setEmail('');
      setTelephone('');
      setRole('user');
    } else {
      const data = await response.json();
      setError(data.error || "Échec de la création du compte");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-blue-200">
      <div className="p-10 bg-white rounded-xl shadow-2xl w-full max-w-lg border border-blue-100">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Créer un compte utilisateur</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-600 text-center mb-4">{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Nom</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Prenom</label>
            <input
              type="text"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Nom d'utilisateur</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Téléphone</label>
            <input
              type="text"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Rôle</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2 border rounded bg-white"
              required
            >
              <option value="user">Utilisateur</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>
          <button type="submit" className="w-full p-3 mt-2 bg-gradient-to-r from-blue-500 to-green-400 text-white font-semibold rounded-lg shadow hover:from-green-400 hover:to-blue-500 transition">
            Créer l'utilisateur
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateAccount; 