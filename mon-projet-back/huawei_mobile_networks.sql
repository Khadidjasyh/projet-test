-- Création de la table huawei_mobile_networks
USE mon_projet_db;

CREATE TABLE IF NOT EXISTS huawei_mobile_networks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    imsi_prefix VARCHAR(20),
    msisdn_prefix VARCHAR(20),
    network_name VARCHAR(255),
    managed_object_group VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
