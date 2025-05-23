const Notification = require('../models/Notification');
const User = require('../models/User');
const AuditReport = require('../models/AuditReport');

// Créer une notification
const createNotification = async (userId, reportId, message) => {
  try {
    const notification = await Notification.create({
      userId,
      reportId,
      message,
      status: 'unread',
      type: 'report_assignment'
    });
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Obtenir toutes les notifications d'un utilisateur
const getUserNotifications = async (userId) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      include: [{
        model: AuditReport,
        attributes: ['id', 'title']
      }]
    });
    return notifications;
  } catch (error) {
    console.error('Error fetching user notifications:', error);
    throw error;
  }
};

// Marquer une notification comme lue
const markAsRead = async (notificationId) => {
  try {
    const notification = await Notification.findByPk(notificationId);
    if (notification) {
      notification.status = 'read';
      await notification.save();
    }
    return notification;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

// Supprimer une notification
const deleteNotification = async (notificationId) => {
  try {
    const notification = await Notification.findByPk(notificationId);
    if (notification) {
      await notification.destroy();
    }
    return true;
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead,
  deleteNotification
}; 