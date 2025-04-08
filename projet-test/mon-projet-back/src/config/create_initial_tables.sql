USE roaming_audit;

-- Partners Table
CREATE TABLE IF NOT EXISTS partners (
  partner_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  country VARCHAR(50) NOT NULL,
  tadig_code VARCHAR(10) NOT NULL,
  agreement_type ENUM('Bilatéral', 'Unilatéral') NOT NULL,
  services JSON,
  ir21_file_path VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  status ENUM('Active', 'Inactive', 'Testing') DEFAULT 'Active'
);

-- IR.21 Documents Table
CREATE TABLE IF NOT EXISTS ir21_documents (
  document_id INT AUTO_INCREMENT PRIMARY KEY,
  partner_id INT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  file_format ENUM('RAEX', 'PDF', 'Word', 'Excel', 'Other') NOT NULL,
  converted BOOLEAN DEFAULT FALSE,
  conversion_date TIMESTAMP,
  upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  uploaded_by INT NOT NULL,
  content LONGTEXT,
  status ENUM('Pending', 'Processed', 'Error') DEFAULT 'Pending',
  FOREIGN KEY (partner_id) REFERENCES partners(partner_id)
);

-- Network Configurations Table
CREATE TABLE IF NOT EXISTS network_configs (
  config_id INT AUTO_INCREMENT PRIMARY KEY,
  partner_id INT NOT NULL,
  node_type ENUM('MSC', 'HLR', 'HSS', 'SGSN', 'MME', 'GGSN', 'Firewall', 'STP') NOT NULL,
  vendor VARCHAR(50),
  imsi_prefix VARCHAR(15),
  gt VARCHAR(20),
  ip_range VARCHAR(50),
  status ENUM('Active', 'Inactive') DEFAULT 'Active',
  last_verified TIMESTAMP,
  FOREIGN KEY (partner_id) REFERENCES partners(partner_id)
);

-- SCCP Routes Table
CREATE TABLE IF NOT EXISTS sccp_routes (
  route_id INT AUTO_INCREMENT PRIMARY KEY,
  partner_id INT NOT NULL,
  tt INT NOT NULL,
  np INT NOT NULL,
  na INT NOT NULL,
  ns VARCHAR(20),
  nsa VARCHAR(20),
  gtrc VARCHAR(20),
  css_present BOOLEAN DEFAULT FALSE,
  spc VARCHAR(20),
  status ENUM('Valid', 'Invalid') DEFAULT 'Valid',
  direction ENUM('Inbound', 'Outbound', 'Both') NOT NULL,
  FOREIGN KEY (partner_id) REFERENCES partners(partner_id)
);

-- IMSI Configurations Table
CREATE TABLE IF NOT EXISTS imsi_configs (
  imsi_id INT AUTO_INCREMENT PRIMARY KEY,
  partner_id INT NOT NULL,
  imsi_prefix VARCHAR(15) NOT NULL,
  mgt VARCHAR(20),
  e214_data JSON,
  e164_data JSON,
  conversion_rule VARCHAR(100),
  msisdn_range VARCHAR(50),
  msrn_range VARCHAR(50),
  FOREIGN KEY (partner_id) REFERENCES partners(partner_id)
); 