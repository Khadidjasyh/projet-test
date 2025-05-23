-- Table pour la situation globale
CREATE TABLE IF NOT EXISTS situation_globales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pays VARCHAR(100),
    operateur VARCHAR(100),
    plmn VARCHAR(20),
    gsm VARCHAR(20),
    camel VARCHAR(20),
    gprs VARCHAR(20),
    troisg VARCHAR(20),
    lte VARCHAR(20),
    mcc VARCHAR(10),
    mnc VARCHAR(10),
    imsi VARCHAR(255),
    epcrealm VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
); 