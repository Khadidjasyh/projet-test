CREATE DATABASE IF NOT EXISTS mon_projet_db;
USE mon_projet_db;

CREATE TABLE IF NOT EXISTS roaming_partners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    operator_name VARCHAR(255),
    imsi_prefix VARCHAR(20),
    gt VARCHAR(20),
    mcc VARCHAR(3),
    mnc VARCHAR(3),
    country VARCHAR(100),
    bilateral BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vérifier si la colonne date existe, sinon l'ajouter
ALTER TABLE ir21_data ADD COLUMN IF NOT EXISTS date DATE;

-- Mettre à jour les dates existantes si elles sont NULL
UPDATE ir21_data 
SET date = STR_TO_DATE(SUBSTRING_INDEX(SUBSTRING_INDEX(tadig, '_', -1), '.', 1), '%Y%m%d')
WHERE date IS NULL 
AND tadig REGEXP '_[0-9]{8}'; 