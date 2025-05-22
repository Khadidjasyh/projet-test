import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBell, FaCheck, FaTrash } from 'react-icons/fa';

const Alertes = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData) {
          throw new Error('Utilisateur non connecté');
        }

        const response = await fetch(`http://localhost:5178/notifications/user/${userData.id}`);
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des notifications');
        }

        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la récupération des notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await fetch(`http://localhost:5178/notifications/${notificationId}/read`, {
        method: 'PUT'
      });

      if (!response.ok) {
        throw new Error('Erreur lors du marquage de la notification');
      }

      setNotifications(notifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, status: 'read' }
          : notification
      ));
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du marquage de la notification');
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      const response = await fetch(`http://localhost:5178/notifications/${notificationId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la notification');
      }

      setNotifications(notifications.filter(notification => notification.id !== notificationId));
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression de la notification');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 max-w-7xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
          Alertes et Notifications
        </h1>
        <p className="text-gray-600 text-center">
          Gérez vos notifications et alertes
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <FaBell className="mx-auto h-12 w-12 mb-4" />
            <p>Aucune notification pour le moment</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-6 flex items-center justify-between ${
                  notification.status === 'unread' ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  {notification.status === 'unread' && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="text-green-600 hover:text-green-800"
                      title="Marquer comme lu"
                    >
                      <FaCheck />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notification.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Supprimer"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Alertes; 