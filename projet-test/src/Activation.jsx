import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Activation() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    try {
      const response = await fetch(`/api/auth/activate/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess(data.message || 'Compte activé avec succès');
        setPassword('');

        // Redirection vers la page de connexion après 3 secondes
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        const data = await response.json();
        setError(data.error || 'Échec de l’activation du compte');
      }
    } catch (err) {
      setError('Erreur réseau ou serveur. Veuillez réessayer.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
          Activation de compte
        </h2>

        {error && (
          <div className="mb-4 text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 text-green-600 text-sm text-center">
            {success} <br />
            Redirection vers la connexion...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="8 caractères minimum"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition duration-200"
          >
            Activer le compte
          </button>
        </form>
      </div>
    </div>
  );
}

export default Activation;
