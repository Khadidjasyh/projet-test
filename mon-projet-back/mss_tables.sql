-- Table pour l'analyse IMSI
CREATE TABLE IF NOT EXISTS mss_imsi_analysis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    node_name VARCHAR(50) NOT NULL,
    imsi_series VARCHAR(20) NOT NULL,
    m_value VARCHAR(10),
    na_value VARCHAR(10),
    anres_value VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table pour l'analyse B-Number
CREATE TABLE IF NOT EXISTS mss_bnumber_analysis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    node_name VARCHAR(50) NOT NULL,
    b_number VARCHAR(20) NOT NULL,
    miscell TEXT,
    f_n VARCHAR(50),
    route VARCHAR(10),
    charge VARCHAR(10),
    l_value VARCHAR(10),
    a_value VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table pour les séries GT
CREATE TABLE IF NOT EXISTS mss_gt_series (
    id INT AUTO_INCREMENT PRIMARY KEY,
    node_name VARCHAR(50) NOT NULL,
    tt VARCHAR(10) NOT NULL,
    np VARCHAR(10),
    na VARCHAR(10),
    ns VARCHAR(10),
    gtrc VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 