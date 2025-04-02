
import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./Home";
import Contact from "./Contact";
import Dashboard from "./Dashboard";
import Login from "./login";  // Import du composant Login
import Register from "./Register";
import AboutUs from "./AboutUs";
import RapportAudit from "./RapportAudit";


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white text-gray-900">
        
        <nav className="bg-white shadow-md w-full">
          <div className="max-w-full mx-auto px-8 py-4 flex justify-between items-center">
            
            <div>
              <Link to="/">
                <img
                  src="/Mobilis_(Algeria)-Logo.png.svg"
                  alt="Mobilis Logo"
                  className="h-10"
                />
              </Link>
            </div>
            <div className="space-x-8">
              <Link to="/" className="text-green-600 font-semibold hover:text-green-800">
                Accueil
              </Link>
              <Link to="/dashboard" className="text-green-600 font-semibold hover:text-green-800">
                Dashboard
              </Link>
              <Link to="/rapportaudit" className="text-green-600 font-semibold hover:text-green-800">
                Rapport Audit
              </Link>
              <Link to="/contact" className="text-green-600 font-semibold hover:text-green-800">
                Contact
              </Link>
              <Link to="/aboutus" className="text-green-600 font-semibold hover:text-green-800">
                About Us
              </Link>
            </div>
            <div className="space-x-4">
              <Link to="/login" className="px-4 py-2 border border-green-600 text-red-600 font-semibold rounded-lg hover:bg-green-600 hover:text-white transition">
                Sign In
              </Link>
              <Link to="/register" className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">
                Sign Up
              </Link>
            </div>
          </div>
        </nav>

        
        <div className="p-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/dashboard" element={<Dashboard />}/>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/rapportaudit" element={<RapportAudit /> } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}


export default App;

import { useState, useEffect } from "react";
/*
function App() {
  const [users, setUsers] = useState([]); // Liste des utilisateurs
  const [name, setName] = useState(""); // Nom utilisateur
  const [email, setEmail] = useState(""); // Email utilisateur
  const [responseData, setResponseData] = useState(null);

  // Récupérer les utilisateurs (GET)
  useEffect(() => {
    fetch("http://localhost:3001/users")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur GET: " + response.statusText);
        }
        return response.json();
      })
      .then((data) => setUsers(data))
      .catch((error) => console.error(error));
  }, []);

  // Ajouter un utilisateur (POST)
  const sendDataToBackend = () => {
    const userData = { name, email };

    fetch("http://localhost:3001/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur POST: " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        setResponseData(data);
        return fetch("http://localhost:3001/users");
      })
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error(error));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Connexion Frontend - Backend MySQL
      </h1>

      
      <div className="max-w-2xl mx-auto bg-white p-6 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Liste des utilisateurs :</h2>
        <ul className="space-y-2">
          {users.map((user) => (
            <li key={user.id} className="p-2 border-b">
              {user.name} - {user.email}
            </li>
          ))}
        </ul>
      </div>

      
      <div className="max-w-lg mx-auto bg-white p-6 shadow-lg rounded-lg mt-6">
        <h2 className="text-2xl font-semibold mb-4">Ajouter un utilisateur :</h2>
        <input
          type="text"
          placeholder="Nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mb-3 border rounded-lg"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-3 border rounded-lg"
        />
        <button
          onClick={sendDataToBackend}
          className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700 transition"
        >
          Ajouter
        </button>

        {responseData && (
          <p className="mt-4 text-green-600">Réponse : {JSON.stringify(responseData)}</p>
        )}
      </div>
    </div>
  );
}
*/
/*
function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
    
      <nav className="bg-white shadow-md w-full">
        <div className="max-w-full mx-auto px-8 py-4 flex justify-between items-center">
          <div>
            <a href="/">
              <img src="/Mobilis_(Algeria)-Logo.png.svg" alt="Mobilis Logo" className="h-10" />
            </a>
          </div>
          <div className="space-x-8">
            <a href="/" className="text-green-600 font-semibold hover:text-green-800">
              Accueil
            </a>
            <a href="/dashboard" className="text-green-600 font-semibold hover:text-green-800">
              Dashboard
            </a>
            <a href="/rapport-audit" className="text-green-600 font-semibold hover:text-green-800">
              Rapport Audit
            </a>
            <a href="/contact" className="text-green-600 font-semibold hover:text-green-800">
              Contact
            </a>
            <a href="/about" className="text-green-600 font-semibold hover:text-green-800">
              About Us
            </a>
          </div>
          <div className="space-x-4">
            <a
              href="/login"
              className="px-4 py-2 border border-green-600 text-red-600 font-semibold rounded-lg hover:bg-green-600 hover:text-white transition"
            >
              Sign In
            </a>
            <a
              href="/register"
              className="px-4 py-2 bg-green-600 text-red-600 font-semibold rounded-lg hover:bg-green-700 hover:text-white transition"
            >
              Sign Up
            </a>
          </div>
        </div>
      </nav>

    
      <div className="flex items-center justify-center min-h-screen w-full">
        <div className="text-center p-10 w-full max-w-4xl">
          <h1 className="text-5xl font-extrabold text-green-600 mb-6">
            Roaming Intelligent avec Mobilis 🇩🇿
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Accédez à une connectivité fiable où que vous soyez. Gérez votre compte, consultez votre usage,
            et profitez des meilleures offres roaming en quelques clics !
          </p>

          <div className="flex justify-center space-x-4 mb-8">
            <a
              href="/register"
              className="px-8 py-3 bg-green-600 text-white text-lg font-semibold rounded-lg shadow hover:bg-green-700 transition"
            >
              Créer un compte
            </a>
            <a
              href="/login"
              className="px-8 py-3 border border-green-600 text-red-600 text-lg font-semibold rounded-lg hover:bg-green-600 hover:text-white transition"
            >
              Se connecter
            </a>
          </div>

          <div className="bg-gray-100 p-8 rounded-lg">
            <h2 className="text-3xl font-bold text-green-600 mb-4">Offres Roaming Avantages :</h2>
            <p className="text-lg text-gray-700 mb-4">
              Découvrez nos offres spéciales pour un roaming sans souci à l’étranger.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 text-left">
              <li>Tarifs compétitifs pour plus de 50 pays.</li>
              <li>Suivi en temps réel de votre consommation.</li>
              <li>Activation/désactivation instantanée du roaming.</li>
              <li>Support client 24/7 pour plus de sérénité.</li>
            </ul>
            <a
              href="/offers"
              className="mt-6 inline-block text-green-600 font-semibold hover:underline"
            >
              Découvrir nos offres
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;*/

/*
export default App;*/

