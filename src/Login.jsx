/*import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5177/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
  
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Erreur:', error);
    }
    // Simulation de connexion sans vérification
    navigate('/dashboard'); // Redirection directe
  
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <img
            className="mx-auto h-12 w-auto"
            src="/Mobilis_(Algeria)-Logo.png.svg"
            alt="Mobilis Logo"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-green-600">
            Connexion (Démo)
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Version démo - aucun identifiant requis
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email (simulation)
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                placeholder="exemple@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe (simulation)
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Se connecter
            </button>
          </div>
        </form>

        <div className="text-center">
          <Link
            to="/register"
            className="text-sm text-green-600 hover:text-green-800"
          >
            Pas encore de compte ? S'inscrire
          </Link>
        </div>
      </div>
    </div>
  );
}
*/
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Réinitialiser les erreurs
  
    try {
      const response = await fetch('http://localhost:5177/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),  // Vérifie que les données sont bien envoyées en JSON
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la connexion');
      }
  
      console.log('Connexion réussie:', data);
  
      // Vérifie que le token est bien présent
      if (!data.token) {
        throw new Error('Token JWT manquant dans la réponse');
      }
  
      // Stocker le token JWT
      localStorage.setItem('token', data.token);
  
      // Redirection après connexion
      navigate('/dashboard');
  
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <img
            className="mx-auto h-12 w-auto"
            src="/Mobilis_(Algeria)-Logo.png.svg"
            alt="Mobilis Logo"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-green-600">
            Connexion
          </h2>
        </div>

        {/* Affichage des erreurs */}
        {error && <p className="text-red-500 text-center">{error}</p>}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                placeholder="exemple@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Se connecter
            </button>
          </div>
        </form>

        <div className="text-center">
          <Link to="/register" className="text-sm text-green-600 hover:text-green-800">
            Pas encore de compte ? S'inscrire
          </Link>
        </div>
      </div>
    </div>
  );
}

