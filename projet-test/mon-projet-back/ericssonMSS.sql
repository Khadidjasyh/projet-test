mysql -u root -p"Aaa!121212" mon_projet_db -e 
"CREATE TABLE IF NOT EXISTS mss_imsi_analysis (
id INT AUTO_INCREMENT PRIMARY KEY,
 node_name VARCHAR(50), 
 imsi_series VARCHAR(20),
  m_value VARCHAR(20), 
  na_value VARCHAR(20), 
  anres_value VARCHAR(50), 
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP); 




  CREATE TABLE IF NOT EXISTS mss_bnumber_analysis (
  id INT AUTO_INCREMENT PRIMARY KEY, 
  node_name VARCHAR(50), 
  b_number VARCHAR(20),
   miscell VARCHAR(20),
    f_n VARCHAR(10), 
    route VARCHAR(50), 
    charge_l VARCHAR(20),
     a_value VARCHAR(20),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
      
      
CREATE TABLE IF NOT EXISTS mss_gt_series (
id INT AUTO_INCREMENT PRIMARY KEY, 
node_name VARCHAR(50), 
tt VARCHAR(10),
 np VARCHAR(10), 
 na VARCHAR(10),
  ns VARCHAR(50), 
  gtrc VARCHAR(50),
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);"