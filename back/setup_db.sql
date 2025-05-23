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