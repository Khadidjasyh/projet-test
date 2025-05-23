-- Modification de la table alerts
ALTER TABLE alerts
DROP COLUMN message,
DROP COLUMN severity,
DROP COLUMN timestamp,
ADD COLUMN titre varchar(255) NOT NULL AFTER id,
ADD COLUMN envoye_par varchar(100) NOT NULL AFTER titre,
ADD COLUMN severite enum('critique', 'urgent', 'normal', 'info') NOT NULL DEFAULT 'normal' AFTER envoye_par,
ADD COLUMN date_envoi datetime NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER severite,
ADD COLUMN date_limite datetime NOT NULL AFTER date_envoi,
ADD COLUMN statut enum('non traité', 'en cours', 'traité') NOT NULL DEFAULT 'non traité' AFTER date_limite,
ADD COLUMN commentaires text AFTER statut,
ADD COLUMN utilisateurs_concernes text AFTER commentaires; 