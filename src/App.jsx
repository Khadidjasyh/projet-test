import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./Home";
import Contact from "./Contact";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white text-gray-900">
        {/* Navbar */}
        <nav className="bg-white shadow-md w-full">
          <div className="max-w-full mx-auto px-8 py-4 flex justify-between items-center">
            {/* Logo */}
            <div>
              <Link to="/">
                <img
                  src="/Mobilis_(Algeria)-Logo.png.svg"
                  alt="Mobilis Logo"
                  className="h-10"
                />
              </Link>
            </div>

            {/* Navigation */}
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

            {/* Boutons Sign In / Sign Up */}
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

        {/* Définition des Routes */}
        <div className="p-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

