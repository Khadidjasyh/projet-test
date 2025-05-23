-- Création de la table audit_reports
CREATE TABLE IF NOT EXISTS audit_reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  test_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  status ENUM('pending', 'validated', 'rejected') NOT NULL DEFAULT 'pending',
  created_by VARCHAR(100) NOT NULL,
  validated_by VARCHAR(100),
  critical_issues INT NOT NULL DEFAULT 0,
  major_issues INT NOT NULL DEFAULT 0,
  minor_issues INT NOT NULL DEFAULT 0,
  results_data JSON,
  solutions JSON,
  attachments JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (test_id) REFERENCES tests(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Création de la table tests si elle n'existe pas
CREATE TABLE IF NOT EXISTS tests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertion des tests initiaux
INSERT INTO tests (name, description) VALUES
('Partenaires Roaming & Services', 'Vérification des accords et services disponibles (GSM, CAMEL, GPRS, LTE).'),
('Inbound Roaming', 'Analyse du provisioning et de la configuration pour les visiteurs étrangers.'),
('Outbound Roaming', 'Test de connectivité pour les abonnés voyageant à l\'étranger.'),
('Tests CAMEL Phase Service Inbound Roaming', 'Vérification des services CAMEL pour les visiteurs étrangers (USSD, VPN, etc.).'),
('Tests CAMEL Phase Service Outbound Roaming', 'Vérification des services CAMEL pour les abonnés à l\'étranger (USSD, VPN, etc.).'),
('Tests Data Inbound Roaming', 'Vérification de la connectivité data (3G/4G) pour les visiteurs étrangers.'); 