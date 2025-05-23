const express = require('express');
const router = express.Router();

// Obtenir toutes les notifications d'un utilisateur
router.get('/user/:userId', async (req, res) => {
  try {
    const notifications = await notificationController.getUserNotifications(req.params.userId);
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Marquer une notification comme lue
router.put('/:notificationId/read', async (req, res) => {
  try {
    const notification = await notificationController.markAsRead(req.params.notificationId);
    res.json(notification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

// Supprimer une notification
router.delete('/:notificationId', async (req, res) => {
  try {
    await notificationController.deleteNotification(req.params.notificationId);
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

module.exports = router; 