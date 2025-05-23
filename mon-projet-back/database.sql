-- Ajout des colonnes pour l'assignation des rapports
ALTER TABLE audit_reports
ADD COLUMN assigned_to TEXT,
ADD COLUMN assigned_at DATETIME; 