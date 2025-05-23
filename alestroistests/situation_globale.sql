-- Création de la table situation_globale
CREATE TABLE IF NOT EXISTS situation_globale (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pays VARCHAR(100) NOT NULL,
    operateur VARCHAR(255) NOT NULL,
    plmn VARCHAR(20),
    accord ENUM('Bilatéral', 'Unilatéral') NOT NULL,
    gsm VARCHAR(50),
    camel VARCHAR(50),
    gprs VARCHAR(50),
    troisg VARCHAR(50),
    lte VARCHAR(50),
    commentaire TEXT,
    erreurs BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertion de quelques données de test
INSERT INTO situation_globale (pays, operateur, plmn, accord, gsm, camel, gprs, troisg, lte, commentaire, erreurs) VALUES
('Afghanistan', 'Telecom Development Company Afghanistan Ltd.', '41201', 'Bilatéral', 'Oui', 'Non', 'Non', 'Non', 'Non', 'Services limités', TRUE),
('Albania', 'Albanian Mobile Communications', '27601', 'Bilatéral', 'Oui', 'Oui', 'Oui', 'Oui', 'Oui', 'Tous les services disponibles', FALSE),
('Angola', 'Unitel S.A', '63102', 'Unilatéral', 'Oui', 'Non', 'Oui', 'Non', 'Non', 'Services de base uniquement', TRUE),
('Argentina', 'Telefonica', '722310', 'Bilatéral', 'Oui', 'Oui', 'Oui', 'Oui', 'Oui', 'Tous les services disponibles', FALSE),
('Armenia', 'K Telecom CJSC', '28301', 'Bilatéral', 'Oui', 'Oui', 'Oui', 'Oui', 'Non', 'Pas de LTE', TRUE); 