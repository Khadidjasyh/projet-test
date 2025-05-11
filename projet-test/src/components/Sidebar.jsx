import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaGlobe, FaUsers, FaNetworkWired, FaShieldAlt } from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    { path: '/', icon: <FaHome />, label: 'Tableau de bord' },
    { path: '/situation-globale', icon: <FaGlobe />, label: 'Situation Globale' },
    { path: '/roaming-partners', icon: <FaUsers />, label: 'Partenaires' },
    { path: '/mss-huawei', icon: <FaNetworkWired />, label: 'MSS Huawei' },
    { path: '/firewall-ips', icon: <FaShieldAlt />, label: 'Firewall' },
  ];

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-4">
        <h1 className="text-xl font-bold text-gray-800">Roaming Manager</h1>
      </div>
      <nav className="mt-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
              isActive(item.path) ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar; 