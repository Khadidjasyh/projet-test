-- Table pour les partenaires roaming
CREATE TABLE IF NOT EXISTS roaming_partners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    operateur VARCHAR(255),
    imsi_prefix VARCHAR(20),
    gt VARCHAR(20),
    mcc VARCHAR(3),
    mnc VARCHAR(3),
    country VARCHAR(100),
    bilateral TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 