USE roaming_audit;

CREATE TABLE IF NOT EXISTS ir21_documents (
  document_id INT AUTO_INCREMENT PRIMARY KEY,
  partner_id INT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  file_format ENUM('RAEX', 'PDF', 'Word', 'Excel', 'Other') NOT NULL,
  content LONGTEXT,
  uploaded_by INT NOT NULL,
  status ENUM('Pending', 'Processed', 'Error') DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (partner_id) REFERENCES partners(partner_id),
  FOREIGN KEY (uploaded_by) REFERENCES users(user_id)
); 