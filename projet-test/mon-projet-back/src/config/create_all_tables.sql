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

-- CAMEL Configurations Table
CREATE TABLE IF NOT EXISTS camel_configs (
  camel_id INT AUTO_INCREMENT PRIMARY KEY,
  partner_id INT NOT NULL,
  phase ENUM('Phase 1', 'Phase 2', 'Phase 3', 'Phase 4') NOT NULL,
  service_key VARCHAR(10),
  scp_gt VARCHAR(20),
  trigger_points JSON,
  inbound_restrictions JSON,
  outbound_gt_list JSON,
  in_platform_config JSON,
  status ENUM('Active', 'Inactive') DEFAULT 'Active',
  FOREIGN KEY (partner_id) REFERENCES partners(partner_id)
);

-- Data Configurations Table
CREATE TABLE IF NOT EXISTS data_configs (
  data_id INT AUTO_INCREMENT PRIMARY KEY,
  partner_id INT NOT NULL,
  services JSON,
  ip_dns_list JSON,
  backbone_vplmn VARCHAR(50),
  ip_ranges JSON,
  technology ENUM('2G', '3G', '4G', '5G'),
  FOREIGN KEY (partner_id) REFERENCES partners(partner_id)
);

-- IR.21 Documents Table (already created)
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
  FOREIGN KEY (partner_id) REFERENCES partners(partner_id),
  FOREIGN KEY (uploaded_by) REFERENCES users(user_id)
);

-- IR.85 Documents Table
CREATE TABLE IF NOT EXISTS ir85_documents (
  document_id INT AUTO_INCREMENT PRIMARY KEY,
  partner_id INT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  file_format ENUM('RAEX', 'PDF', 'Word', 'Excel', 'Other') NOT NULL,
  upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  uploaded_by INT NOT NULL,
  content LONGTEXT,
  status ENUM('Pending', 'Processed', 'Error') DEFAULT 'Pending',
  FOREIGN KEY (partner_id) REFERENCES partners(partner_id),
  FOREIGN KEY (uploaded_by) REFERENCES users(user_id)
);

-- Test Results Table
CREATE TABLE IF NOT EXISTS test_results (
  test_id INT AUTO_INCREMENT PRIMARY KEY,
  partner_id INT NOT NULL,
  config_id INT,
  test_type ENUM('Inbound', 'Outbound', 'CAMEL_Inbound', 'CAMEL_Outbound', 'Data_Inbound', 'Data_Outbound') NOT NULL,
  details JSON,
  passed BOOLEAN DEFAULT FALSE,
  error_count INT DEFAULT 0,
  warning_count INT DEFAULT 0,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ran_by INT NOT NULL,
  FOREIGN KEY (partner_id) REFERENCES partners(partner_id),
  FOREIGN KEY (config_id) REFERENCES network_configs(config_id),
  FOREIGN KEY (ran_by) REFERENCES users(user_id)
);

-- Test Errors Table
CREATE TABLE IF NOT EXISTS test_errors (
  error_id INT AUTO_INCREMENT PRIMARY KEY,
  test_id INT NOT NULL,
  error_code VARCHAR(50) NOT NULL,
  description TEXT,
  severity ENUM('Critical', 'Warning', 'Info') NOT NULL,
  FOREIGN KEY (test_id) REFERENCES test_results(test_id)
);

-- Test Logs Table
CREATE TABLE IF NOT EXISTS test_logs (
  log_id INT AUTO_INCREMENT PRIMARY KEY,
  test_id INT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  message TEXT,
  level ENUM('Info', 'Warning', 'Error', 'Critical') NOT NULL,
  FOREIGN KEY (test_id) REFERENCES test_results(test_id)
);

-- Alerts Table
CREATE TABLE IF NOT EXISTS alerts (
  alert_id INT AUTO_INCREMENT PRIMARY KEY,
  test_id INT,
  severity ENUM('Critique', 'Urgent', 'Info') NOT NULL,
  description TEXT,
  auto_generated BOOLEAN DEFAULT TRUE,
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  assigned_to INT,
  resolution_deadline TIMESTAMP,
  FOREIGN KEY (test_id) REFERENCES test_results(test_id),
  FOREIGN KEY (assigned_to) REFERENCES users(user_id)
);

-- Reports Table
CREATE TABLE IF NOT EXISTS reports (
  report_id INT AUTO_INCREMENT PRIMARY KEY,
  test_id INT,
  alert_id INT,
  user_id INT NOT NULL,
  correction_details TEXT,
  implemented_changes JSON,
  status ENUM('Validé', 'En attente', 'Rejeté') DEFAULT 'En attente',
  creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  validation_date TIMESTAMP,
  validated_by INT,
  attachments JSON,
  FOREIGN KEY (test_id) REFERENCES test_results(test_id),
  FOREIGN KEY (alert_id) REFERENCES alerts(alert_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (validated_by) REFERENCES users(user_id)
);

-- Permissions Table
CREATE TABLE IF NOT EXISTS permissions (
  permission_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  resource_type ENUM('Partner', 'NetworkConfig', 'Report', 'IR21', 'TestResult') NOT NULL,
  access_level ENUM('Read', 'Write', 'Admin') NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Dashboard Table
CREATE TABLE IF NOT EXISTS dashboards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  layout JSON,
  last_viewed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Dashboard Widgets Table
CREATE TABLE IF NOT EXISTS dashboard_widgets (
  widget_id INT AUTO_INCREMENT PRIMARY KEY,
  dashboard_id INT NOT NULL,
  widget_type ENUM('CoverageMap', 'ErrorCount', 'TestStatus', 'LatestAlerts') NOT NULL,
  position JSON,
  config JSON,
  FOREIGN KEY (dashboard_id) REFERENCES dashboards(id)
);

-- Audit Schedule Table
CREATE TABLE IF NOT EXISTS audit_schedules (
  schedule_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  frequency ENUM('Daily', 'Weekly', 'Monthly', 'OnDemand') NOT NULL,
  test_types JSON,
  partners JSON,
  last_run TIMESTAMP,
  next_run TIMESTAMP,
  created_by INT NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (created_by) REFERENCES users(user_id)
); 