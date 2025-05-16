CREATE TABLE mme_imsi_analysis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    imsi VARCHAR(20) NOT NULL,
    default_apn_operator_id VARCHAR(50),
    digits_to_add VARCHAR(20),
    misc_info1 VARCHAR(100),
    hss_realm_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 
CREATE TABLE audits (
  id INT PRIMARY KEY AUTO_INCREMENT,
  filename VARCHAR(255) NOT NULL,
  erp_code VARCHAR(50),
  erp_nom VARCHAR(255),
  date_audit DATETIME,
  statut VARCHAR(50),
  raw_data JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ir85_data (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    tadig VARCHAR(20),
    pays VARCHAR(10),
    e212 TEXT,
    e214 TEXT,
    apn TEXT,
    ipaddress TEXT,
    date_ajout DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ir21_data (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    tadig VARCHAR(20),
    pays VARCHAR(10),
    e212 TEXT,
    e214 TEXT,
    apn TEXT,
    ipaddress TEXT,
    date_ajout DATETIME DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS mobile_networks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  imsi_prefix VARCHAR(20),
  msisdn_prefix VARCHAR(20),
  network_name VARCHAR(255),
  managed_object_group VARCHAR(50)
);

    
INSERT INTO mobile_networks (imsi_prefix,
 msisdn_prefix, network_name, managed_object_group)
VALUES
  ('20201', '3097', 'Greece_Cosmote', 'PUBLIC'),
  ('20205', '30694', 'MnName', 'PUBLIC'),
  ('20209', '30699', 'Q_tel_Greece', 'PUBLIC'),
  ('20210', '30693', 'Greece STET-Hellas', 'PUBLIC'),
  ('20404', '31654', 'Holland Libertel', 'PUBLIC'),
  ('20408', '31653', 'Holland KPN', 'PUBLIC'),
  ('20412', '31626', 'Holland TELFORT', 'PUBLIC'),
  ('20416', '31624', 'T-mobile_Netherlands', 'PUBLIC'),
  ('20420', '31628', 'Orange_Netherlands', 'PUBLIC'),
  ('20601', '32475', 'Belgacom', 'PUBLIC'),
  ('20605', '32468', 'Telenet BidCo Belgium', 'PUBLIC'),
  ('20610', '32495', 'Belgium Mobistar', 'PUBLIC'),
  ('20620', '32486', 'Base_Belgium', 'PUBLIC'),
  ('20801', '33689', 'France TELECOM', 'PUBLIC'),
  ('20809', '33611', 'France', 'PUBLIC'),
  ('20810', '33609', 'France SFR', 'PUBLIC'),
  ('20815', '33695', 'FRA free Mobile', 'PUBLIC'),
  ('20820', '33660', 'France SFR', 'PUBLIC'),
  ('21401', '34607', 'Spain_Vodafone', 'PUBLIC'),
  ('21403', '34656', 'Amena_Spain', 'PUBLIC'),
  ('21405', '34648', 'MnName', 'PUBLIC'),
  ('21406', '34607', 'Spain_Vodafone', 'PUBLIC'),
  ('21407', '34609', 'Spain Telefonica', 'PUBLIC'),
  ('21630', '3630', 'Hungary Westel', 'PUBLIC'),
  ('21670', '3670', 'Vodafone_Hungary', 'PUBLIC'),
  ('21803', '38763', 'HT mobile_Bosnia', 'PUBLIC'),
  ('21805', '38765', 'MnName', 'PUBLIC'),
  ('21901', '38598', 'Hrvatski_Telekom_Croatian', 'PUBLIC'),
  ('21902', '38595', 'Tele_2_craotia', 'PUBLIC'),
  ('22001', '38163', 'Yugoslavia MOBTEL', 'PUBLIC'),
  ('22002', '38269', 'Promonte_Serbia and Montenegro', 'PUBLIC'),
  ('22003', '38164', 'Telekom_Srbija', 'PUBLIC'),
  ('22201', '39339', 'Italy TIM', 'PUBLIC'),
  ('22210', '39349', 'Vodafone_Omnitel_Italy', 'PUBLIC'),
  ('22250', '393519', 'ITAFM_ILIAD Italia', 'PUBLIC'),
  ('22601', '40722', 'vodafone_Connex GSM_Romania', 'PUBLIC'),
  ('22603', '4076', 'Cosmote_Romania', 'PUBLIC'),
  ('22801', '4179', 'Swisscom', 'PUBLIC'),
  ('22802', '4176', 'SUNRISE_SWITZERLAND', 'PUBLIC'),
  ('22803', '41788', 'Orange_Switzerland', 'PUBLIC'),
  ('23001', '420603', 'T-Mobile Czech Republic', 'PUBLIC'),
  ('23002', '420602', 'Czechoslovakia EruoTel', 'PUBLIC'),
  ('23003', '420608', 'MnName', 'PUBLIC'),
  ('23101', '421905', 'Czechoslovakia Globtel', 'PUBLIC'),
  ('23102', '421903', 'Slovak Telecom SVKET', 'PUBLIC'),
  ('23203', '43676', 'Austria MAXMobil', 'PUBLIC'),
  ('23207', '43650', 'MnName', 'PUBLIC'),
  ('23410', '447802', 'England Cellnet', 'PUBLIC'),
  ('23415', '44385', 'England Vodafone', 'PUBLIC'),
  ('23430', '447953', 'England One 2 One', 'PUBLIC'),
  ('23433', '44973', 'England One 2 One', 'PUBLIC'),
  ('23450', '447797', 'MnName', 'PUBLIC'),
  ('23455', '447781', 'MnName', 'PUBLIC'),
  ('23801', '45401', 'TDC Mobile_Denmark', 'PUBLIC'),
  ('23802', '45405', 'Sonofon_Denmark', 'PUBLIC'),
  ('23820', '4528', 'Telia Mobile_Denmark', 'PUBLIC'),
  ('23830', '4526', 'Orange_Telia Mobile_Denmark', 'PUBLIC'),
  ('24001', '46705', 'Sweden Telia', 'PUBLIC'),
  ('24007', '46707', 'Tele 2_Russia', 'PUBLIC'),
  ('24010', '46765', 'Tele 2_Sweden', 'PUBLIC'),
  ('24014', '4676720', 'MnName', 'PUBLIC'),
  ('24201', '47900', 'Norway Telenor Mobil', 'PUBLIC'),
  ('24208', '479451', 'MnName', 'PUBLIC'),
  ('24405', '35850', 'Finland Radiolinjia', 'PUBLIC'),
  ('24414', '3584570', 'Alands Mobiltelefon_ Finland', 'PUBLIC'),
  ('24421', '358451', 'MnName', 'PUBLIC'),
  ('24603', '370684', 'tele2_Lithunia', 'PUBLIC'),
  ('24701', '371292', 'Latvia LMT', 'PUBLIC'),
  ('24702', '371295', 'Tele2_Latvia', 'PUBLIC'),
  ('24802', '37256', 'Elisa_Estonia', 'PUBLIC'),
  ('24803', '37255', 'Tele2_Estonia', 'PUBLIC'),
  ('25001', '79160', 'Russia Mobile-Telesystems', 'PUBLIC'),
  ('25002', '792', 'Russia North-WestGS', 'PUBLIC'),
  ('25016', '7902557', 'Vladivostok NTC_Russia', 'PUBLIC'),
  ('25020', '790434', 'MnName', 'PUBLIC'),
  ('25099', '79037', 'KB Impuls_Russia', 'PUBLIC'),
  ('25501', '38050', 'Ukraine UMC', 'PUBLIC'),
  ('25502', '38068', 'Ukranian Radio System_Ukrain', 'PUBLIC'),
  ('25503', '38067', 'Kyivstar GSM_Ukraine', 'PUBLIC'),
  ('25505', '38039', 'Astelit_Ukraine', 'PUBLIC'),
  ('25506', '38063', 'Golden Telekom_Ukraine', 'PUBLIC'),
  ('25701', '375296', 'Velcom_Belarus', 'PUBLIC'),
  ('25702', '375297', 'MTN_BELARUS', 'PUBLIC'),
  ('25901', '373691', 'MnName', 'PUBLIC'),
  ('25905', '37367', 'Moldtelecom S.A MOLDOVA', 'PUBLIC'),
  ('26002', '48602', 'MnName', 'PUBLIC'),
  ('26003', '48501', 'Poland CENTERTEL', 'PUBLIC'),
  ('26006', '48790', 'MnName', 'PUBLIC'),
  ('26201', '49171', 'MnName', 'PUBLIC'),
  ('26202', '49172', 'Vodafone D2 Manesman_Germany', 'PUBLIC'),
  ('26203', '49177', 'Eplus_Germany', 'PUBLIC'),
  ('26207', '49176', 'MnName', 'PUBLIC'),
  ('26801', '35191', 'Vodafone_Portugal', 'PUBLIC'),
  ('26806', '35196', 'Portugal TMN', 'PUBLIC'),
  ('27001', '352021', 'Luxemburg P&T', 'PUBLIC'),
  ('27077', '352091', 'Tango_Luxembourg', 'PUBLIC'),
  ('27099', '352061', 'VOXmobile_Luxembourg', 'PUBLIC'),
  ('27201', '35387', 'vodafone_Ireland', 'PUBLIC'),
  ('27203', '35385', 'MnName', 'PUBLIC'),
  ('27401', '35489', 'Iceland LANDSSIMINN', 'PUBLIC'),
  ('27404', '354650', 'viking wireless IMC_ISLAND', 'PUBLIC'),
  ('27601', '35568', 'Albanian Mobile TEL_ALBANIAN', 'PUBLIC'),
  ('27602', '35569', 'Vodafone_ALBANIAN', 'PUBLIC'),
  ('27801', '35694', 'vodafone_malta', 'PUBLIC'),
  ('27821', '35679', 'Malta_go_mobile', 'PUBLIC'),
  ('28001', '35799', 'Cyprus CYTA', 'PUBLIC'),
  ('28010', '35796', 'Areeba_MTN_Cyprus', 'PUBLIC'),
  ('28301', '37491', 'ArmenTel_Ktelecom_Armenia', 'PUBLIC'),
  ('28305', '37493', 'Vivacell_Armenia', 'PUBLIC'),
  ('28401', '35988', 'Bulgaria MOBILTEL', 'PUBLIC'),
  ('28403', '35987', 'Vivatel_Bulgaria', 'PUBLIC'),
  ('28405', '35989', 'Globul_Bulgaria', 'PUBLIC'),
  ('28601', '90532', 'Turkey Turkcell', 'PUBLIC'),
  ('28602', '90542', 'Turkey Telsim', 'PUBLIC'),
  ('28603', '90559', 'Avea Istanbul_Turkey', 'PUBLIC'),
  ('28604', '90505', 'Avea Istanbul_Turkey', 'PUBLIC'),
  ('28802', '29850', 'Kall_Faroe_Island', 'PUBLIC'),
  ('29341', '38641', 'Slovenia Mobtel', 'PUBLIC'),
  ('29402', '38975', 'Cosmofon_Macedonia', 'PUBLIC'),
  ('29403', '38977', 'MnName', 'PUBLIC'),
  ('29701', '38269', 'Promonte_Serbia and Montenegro', 'PUBLIC'),
  ('29703', '38268', 'MnName', 'PUBLIC'),
  ('302220', '164758', 'MnName', 'PUBLIC'),
  ('302370', '151499', 'Canada Mocrocell', 'PUBLIC'),
  ('302500', '151442', 'MnName', 'PUBLIC'),
  ('302610', '190561', 'MnName', 'PUBLIC'),
  ('302720', '170579', 'Rogers Wireless_Canada', 'PUBLIC'),
  ('302780', '130652', 'MnName', 'PUBLIC'),
  ('310030', '126057', 'T-Mobile USA', 'PUBLIC'),
  ('310150', '170450', 'MnName', 'PUBLIC'),
  ('310160', '140445', 'America Omnipoint', 'PUBLIC'),
  ('310170', '120990', 'America PACIFICBELL', 'PUBLIC'),
  ('310200', '150351', 'T---Mobile-USA', 'PUBLIC'),
  ('310210', '130333', 'T---Mobile-USA', 'PUBLIC'),
  ('310220', '140541', 'T---Mobile-USA', 'PUBLIC'),
  ('310230', '180185', 'T---Mobile-USA', 'PUBLIC'),
  ('310240', '150545', 'T---Mobile-USA', 'PUBLIC'),
  ('310250', '180825', 'T---Mobile-USA', 'PUBLIC'),
  ('310260', '140547', 'T---Mobile-USA', 'PUBLIC'),
  ('310270', '133433', 'America POWERTEL', 'PUBLIC'),
  ('310280', '126053', 'T-Mobile USA', 'PUBLIC'),
  ('310310', '164662', 'T---Mobile-USA', 'PUBLIC'),
  ('310380', '197037', 'MnName', 'PUBLIC'),
  ('310410', '131231', 'AT T Mobility', 'PUBLIC'),
  ('310420', '151324', 'CINCINNATI BELL WIRELESS_USA', 'PUBLIC'),
  ('310490', '170434', 'T---Mobile-USA', 'PUBLIC'),
  ('310580', '171720', 'T---Mobile-USA', 'PUBLIC'),
  ('310660', '191790', 'T---Mobile-USA', 'PUBLIC'),
  ('310800', '181326', 'T---Mobile-USA', 'PUBLIC'),
  ('311270', '190370299', 'MnName', 'PUBLIC'),
  ('311480', '190370299', 'MnName', 'PUBLIC'),
  ('334020', '52941', 'Telcel_Mexico', 'PUBLIC'),
  ('334030', '52942', 'MnName', 'PUBLIC'),
  ('33805', '1876380', 'MnName', 'PUBLIC'),
  ('338050', '187638', 'Digicel Jamaica', 'PUBLIC'),
  ('34020', '59669690', 'Digicel Antilles Française Guyane', 'PUBLIC'),
  ('348770', '128434', 'Digicel BVI Limited', 'PUBLIC'),
  ('36269', '599969', 'Curaçao Telecom N.V', 'PUBLIC'),
  ('3630207', '1876387', 'New Millennium Telecom Services NV', 'PUBLIC'),
  ('36449', '124289', 'ALIV BAHAMAS', 'PUBLIC'),
  ('36801', '537264', 'MnName', 'PUBLIC'),
  ('37001', '180985', 'Orange_dominicana_DOMINICANA', 'PUBLIC'),
  ('374130', '18683', 'Digicel Trinidad and Tobago', 'PUBLIC'),
  ('40001', '99450', 'Azerbaijan Azercell', 'PUBLIC'),
  ('40002', '99455', 'Bakcell Limited Liable Company', 'PUBLIC'),
  ('40004', '99470', 'Azerfon_Azerbaijan', 'PUBLIC'),
  ('40101', '7705', 'Kazakhstan Kar-Tel', 'PUBLIC'),
  ('40402', '919815', 'Punjab Airtel_India', 'PUBLIC'),
  ('40403', '919816', 'Himachal Pradech Airtel_India', 'PUBLIC'),
  ('40405', '919825', 'Fascel Hutch Gujarat_India', 'PUBLIC'),
  ('40410', '919810', 'Delhi Airtel_India', 'PUBLIC'),
  ('40411', '919811', 'Hutchison Essar_India', 'PUBLIC'),
  ('40416', '919862', 'Airtel North East', 'PUBLIC'),
  ('40420', '919820', 'India HMTL', 'PUBLIC'),
  ('40421', '919821', 'BPL MOBILE_LTD-MUMBAI_India', 'PUBLIC'),
  ('40427', '919823', 'vodafone_India', 'PUBLIC'),
  ('40430', '919830', 'Hutch East_India', 'PUBLIC'),
  ('40431', '919831', 'Kolkata Airtel_India', 'PUBLIC'),
  ('40440', '919840', 'Chennai Airtel_India', 'PUBLIC'),
  ('40443', '919843', 'INDIA', 'PUBLIC'),
  ('40445', '919845', 'Karnataka_Airtel_India', 'PUBLIC'),
  ('40449', '919849', 'Andrha Pracech_Airtel_India', 'PUBLIC'),
  ('40467', '919827', 'Reliance_India', 'PUBLIC'),
  ('40470', '919829', 'Rajasthan_Airtel_India', 'PUBLIC'),
  ('40490', '919890', 'Maharachtra-Goa_Airtel_India', 'PUBLIC'),
  ('40492', '919892', 'Mumbai_Airtel_India', 'PUBLIC'),
  ('40493', '919893', 'Madhya Pradech_Airtel_India', 'PUBLIC'),
  ('40494', '919894', 'Tamilnadu_Airtel_India', 'PUBLIC'),
  ('40495', '919895', 'Kerala_Airtel_India', 'PUBLIC'),
  ('40496', '919896', 'Haryana_Airtel_India', 'PUBLIC'),
  ('40497', '919897', 'Up West_Airtel_India', 'PUBLIC'),
  ('40498', '919898', 'Gujarat_Airtel_India', 'PUBLIC'),
  ('405025', '919030', 'MnName', 'PUBLIC'),
  ('405027', '919031', 'MnName', 'PUBLIC'),
  ('405029', '917796', 'MnName', 'PUBLIC'),
  ('405030', '919033', 'MnName', 'PUBLIC'),
  ('405031', '919034', 'MnName', 'PUBLIC'),
  ('405032', '918091', 'MnName', 'PUBLIC'),
  ('405034', '919036', 'MnName', 'PUBLIC'),
  ('405035', '919037', 'MnName', 'PUBLIC'),
  ('405036', '919038', 'MnName', 'PUBLIC'),
  ('405037', '919028', 'MnName', 'PUBLIC'),
  ('405038', '919039', 'MnName', 'PUBLIC'),
  ('405039', '919029', 'MnName', 'PUBLIC'),
  ('405041', '919040', 'MnName', 'PUBLIC'),
  ('405042', '919041', 'MnName', 'PUBLIC'),
  ('405043', '917737', 'MnName', 'PUBLIC'),
  ('405044', '919043', 'MnName', 'PUBLIC'),
  ('405045', '919044', 'MnName', 'PUBLIC'),
  ('405046', '919045', 'MnName', 'PUBLIC'),
  ('405047', '919046', 'MnName', 'PUBLIC'),
  ('40551', '919932', 'Airtel West Bengal', 'PUBLIC'),
  ('40552', '919934', 'Airtel Bihar_india', 'PUBLIC'),
  ('40553', '919937', 'Airtel Orissa_india', 'PUBLIC'),
  ('40554', '919935', 'Airtel UP East_india', 'PUBLIC'),
  ('405550', '9199060', 'AIRTEL INDIA IND13', 'PUBLIC'),
  ('405551', '9199065', 'AIRTEL INDIA IND13', 'PUBLIC'),
  ('405552', '9199069', 'AIRTEL INDIA IND13', 'PUBLIC'),
  ('40556', '919954', 'Airtel Assam', 'PUBLIC'),
  ('41004', '9231', 'CMPak-Paktel_Pakistan', 'PUBLIC'),
  ('41006', '92345', 'Telnor_Pakistan', 'PUBLIC'),
  ('41007', '92321', 'warid-telecom_Pakistan', 'PUBLIC'),
  ('41201', '9370', 'Afghan-Wireless_Afghanistan', 'PUBLIC'),
  ('41220', '9379', 'Roshan-TDAC_Afghanistan', 'PUBLIC'),
  ('41250', '9378', 'MnName', 'PUBLIC'),
  ('41301', '9471', 'Mobitel_Sri Lanka', 'PUBLIC'),
  ('41302', '9477', 'Sri Lanka MTN', 'PUBLIC'),
  ('41308', '9478', 'Hutchison Telecommunications Lanka', 'PUBLIC'),
  ('41405', '95997', 'OOREDOO MYANMAR', 'PUBLIC'),
  ('41501', '96134', 'Lebanon FTML', 'PUBLIC'),
  ('41503', '96139', 'MnName', 'PUBLIC'),
  ('41601', '96279', 'Fast-Link_Jordan', 'PUBLIC'),
  ('41602', '96274', 'Xpress_Jordan', 'PUBLIC'),
  ('41603', '96278', 'Umniah_Jordan', 'PUBLIC'),
  ('41677', '96277', 'Mobilcom_Jordan', 'PUBLIC'),
  ('41701', '96393', 'Syriatel_Syria', 'PUBLIC'),
  ('41702', '96394', 'Spacetel_Syria', 'PUBLIC'),
  ('41805', '9647701', 'Asia-Cell-Wataniya_Iraq', 'PUBLIC'),
  ('41820', '9647802', 'Zain-Iraq', 'PUBLIC'),
  ('41830', '96479', 'Iraqna-Iraq', 'PUBLIC'),
  ('41902', '96596', 'Kuwait MTC', 'PUBLIC'),
  ('41903', '9656', 'Wataniya-Telekom_Kuwait', 'PUBLIC'),
  ('41904', '965500', 'KTC-Kuwait Telecom Company', 'PUBLIC'),
  ('42001', '96650', 'Saudi Arabia STC', 'PUBLIC'),
  ('42003', '96656', 'Etihad Etissalat-Saudi_Arabia', 'PUBLIC'),
  ('42004', '96659', 'Zain_Saudi Arabia', 'PUBLIC'),
  ('42005', '96657', 'Virgin Mobile Saudi', 'PUBLIC'),
  ('42101', '96771', 'Sabafon_Yemen', 'PUBLIC'),
  ('42102', '96773', 'Spacetel_Yemen', 'PUBLIC'),
  ('42104', '96770', 'telecom-Y_Yemen', 'PUBLIC'),
  ('42202', '96892', 'Oman-Mobile_Oman', 'PUBLIC'),
  ('42203', '96895', 'Nawras_Oman', 'PUBLIC'),
  ('42402', '97150', 'UAE Etisalat', 'PUBLIC'),
  ('42403', '97155', 'DU_United Arab Emirates', 'PUBLIC'),
  ('42505', '97259', 'Jawal_Palestine', 'PUBLIC'),
  ('42506', '97256', 'MnName', 'PUBLIC'),
  ('42601', '97339', 'Batelco_Bahrein', 'PUBLIC'),
  ('42602', '97336', 'MTC-Vodafone_Bahrein', 'PUBLIC'),
  ('42604', '97333', 'MnName', 'PUBLIC'),
  ('42701', '97455', 'Qatar QTEL', 'PUBLIC'),
  ('42702', '97477', 'Vodafone Qatar', 'PUBLIC'),
  ('42888', '97688', 'MnName', 'PUBLIC'),
  ('43211', '98911', 'MCI_Iran', 'PUBLIC'),
  ('43220', '98920', 'MnName', 'PUBLIC'),
  ('43235', '98935', 'MnName', 'PUBLIC'),
  ('43404', '99890', 'MnName', 'PUBLIC'),
  ('43405', '99893', 'MnName', 'PUBLIC'),
  ('43601', '99292', 'Indigo-south_Tajikistan', 'PUBLIC'),
  ('43602', '99293', 'Indigo-north_Tajikistan', 'PUBLIC'),
  ('43701', '99677', 'Bitel-SKY-Mobile_kyrgyzstan', 'PUBLIC'),
  ('43709', '99670', 'MnName', 'PUBLIC'),
  ('43801', '993663', 'MnName', 'PUBLIC'),
  ('43802', '99365', 'TMCEL Turkmanistan', 'PUBLIC'),
  ('44010', '8190542', 'MnName', 'PUBLIC'),
  ('44050', '8180931', 'MnName', 'PUBLIC'),
  ('44051', '8180984', 'Japan', 'PUBLIC'),
  ('45008', '8210291', 'MnName', 'PUBLIC'),
  ('45201', '8490', 'Vietnam VMS', 'PUBLIC'),
  ('45202', '8491', 'Vietnam VNPT', 'PUBLIC'),
  ('45204', '8498', 'MnName', 'PUBLIC'),
  ('45205', '8492', 'Hanoi-telecom-mobile_Vietnam', 'PUBLIC'),
  ('45400', '852902', 'Hongkong CSL', 'PUBLIC'),
  ('45403', '852633', 'Hutchison 3G_Hong Kong', 'PUBLIC'),
  ('45404', '852949', 'Hongkong HUTEL', 'PUBLIC'),
  ('45412', '852920', 'Hongkong popular', 'PUBLIC'),
  ('45416', '852923', 'Hongkong Sunday North-West', 'PUBLIC'),
  ('45419', '852923', 'China', 'PUBLIC'),
  ('45501', '85368989', 'MnName', 'PUBLIC'),
  ('45618', '85511', 'Mfone-CAMSHIN_CAMBODGE', 'PUBLIC'),
  ('46001', '86130', 'China UniCom', 'PUBLIC'),
  ('46009', '86186', 'MnName', 'PUBLIC'),
  ('46689', '886986', 'MnName', 'PUBLIC'),
  ('47002', '88018', 'Aktel_Banglades', 'PUBLIC'),
  ('47007', '88016', 'warid telecom_Bangladesh', 'PUBLIC'),
  ('47202', '96096', 'Wataniya-Telecom_Maldives', 'PUBLIC'),
  ('50212', '6012', 'Malaysia Maxis', 'PUBLIC'),
  ('50218', '6018', 'U Mobile Sdn Bhd_Maxisbhd', 'PUBLIC'),
  ('50503', '61415', 'Australia VODAFONE', 'PUBLIC'),
  ('51001', '62816', 'Indonesia SATELIND', 'PUBLIC'),
  ('51010', '62811', 'Indonesia TELKOMSE', 'PUBLIC'),
  ('51401', '67073', 'Telkomcel', 'PUBLIC'),
  ('51502', '63917', 'Philippine GLOBALTELCOM', 'PUBLIC'),
  ('51503', '63918', 'SMART 3G_Philippines', 'PUBLIC'),
  ('52000', '66830', 'MnName', 'PUBLIC'),
  ('52004', '66938', 'MnName', 'PUBLIC'),
  ('52005', '66950', 'DTAC_Thailand THADT', 'PUBLIC'),
  ('52018', '66816', 'DTAC_Thailand', 'PUBLIC'),
  ('52099', '66891', 'True move_Thailand', 'PUBLIC'),
  ('52503', '659', 'Singapore MogileOne', 'PUBLIC'),
  ('52802', '67381', 'BRNBR', 'PUBLIC'),
  ('52811', '67387', 'MnName', 'PUBLIC'),
  ('52941', '334020', 'TELCEL MEXICO', 'PUBLIC'),
  ('53001', '6421', 'vodafone_new_Zealand', 'PUBLIC'),
  ('53024', '6422', 'New_zeland_2_degree', 'PUBLIC'),
  ('54601', '68777', 'OPT New Caledonia', 'PUBLIC'),
  ('54720', '68987', 'MnName', 'PUBLIC'),
  ('60201', '2012', 'Mobinil_Egypt', 'PUBLIC'),
  ('60202', '2010', 'Vodafone_Egypt', 'PUBLIC'),
  ('60203', '2011', 'Etisalat Misr_Egypt', 'PUBLIC'),
  ('60301', '21366', 'ATM_MOBILIS', 'PUBLIC'),
  ('60308', '2136606', 'MnName', 'PUBLIC'),
  ('60400', '2126639', 'Meditel_Morocco', 'PUBLIC'),
  ('60401', '212661', 'Morocco IAM', 'PUBLIC'),
  ('60402', '212640', 'MnName', 'PUBLIC'),
  ('60501', '2165', 'MnName', 'PUBLIC'),
  ('60502', '21698', 'Tunisie Telecom_Tunisie', 'PUBLIC'),
  ('60503', '21622', 'Tunisiana_Tunisie', 'PUBLIC'),
  ('60506', '2164300', 'MnName', 'PUBLIC'),
  ('60601', '21891', 'Al Madar_Libya', 'PUBLIC'),
  ('60701', '22099', 'GAMCEL', 'PUBLIC'),
  ('60702', '22077', 'Africell_Gambia', 'PUBLIC'),
  ('60801', '22177', 'Sonatel_Orange_Senegal', 'PUBLIC'),
  ('60802', '22176', 'Tigo_Senegal', 'PUBLIC'),
  ('60902', '22222', 'MnName', 'PUBLIC'),
  ('60910', '22240', 'Mauritel_Mauritania', 'PUBLIC'),
  ('61001', '223667', 'Malitel_Mali', 'PUBLIC'),
  ('61002', '223760', 'Ikatel-ORANGE_Mali', 'PUBLIC'),
  ('61101', '22462', 'MnName', 'PUBLIC'),
  ('61103', '22463', 'GUINEE-INTERCEL_GUINEE', 'PUBLIC'),
  ('61203', '22507', 'SIM-Orange_Ivory Coast', 'PUBLIC'),
  ('61302', '22676', 'MnName', 'PUBLIC'),
  ('61303', '226788', 'Telcel_Burkina Faso', 'PUBLIC'),
  ('61402', '22796', 'MnName', 'PUBLIC'),
  ('61403', '22794', 'NIGER-ATALANTIQUE-TELECOM_NIGER', 'PUBLIC'),
  ('61501', '22804', 'Togo Telecom', 'PUBLIC'),
  ('61603', '22997', 'Spacetel_MTN_Benin', 'PUBLIC'),
  ('61701', '23025', 'Mauritius CELLPLUS', 'PUBLIC'),
  ('61804', '23155', 'Liberia-Comium_Liberia', 'PUBLIC'),
  ('61905', '23277', 'AFRICEL- Lintel (SL) Ltd. Sierra Leone', 'PUBLIC'),
  ('62001', '23324', 'Areeba scancom_GHana', 'PUBLIC'),
  ('62002', '23320', 'Onetouch_ GHana', 'PUBLIC'),
  ('62003', '23327', 'Millicom_ GHana', 'PUBLIC'),
  ('62120', '234802', 'Vmobile_Nigeria', 'PUBLIC'),
  ('62130', '234803', 'MTN_Nigeria', 'PUBLIC'),
  ('62160', '234809', 'MnName', 'PUBLIC'),
  ('62201', '2356', 'Tchad-Zain-Celtel-Tchad', 'PUBLIC'),
  ('62203', '2359', 'MIC_Tchad', 'PUBLIC'),
  ('62401', '23767', 'MTN_Cameroun', 'PUBLIC'),
  ('62402', '23769', '0range_Cameroun', 'PUBLIC'),
  ('62502', '23891', 'MnName', 'PUBLIC'),
  ('62701', '2402', 'MnName', 'PUBLIC'),
  ('62703', '24055', 'MnName', 'PUBLIC'),
  ('62803', '24107', 'GA-GABON-Celtel_Gabon', 'PUBLIC'),
  ('62901', '24205', 'MnName', 'PUBLIC'),
  ('62907', '24204', 'MnName', 'PUBLIC'),
  ('63001', '24381', 'DRC-Vodacom_Congo', 'PUBLIC'),
  ('63086', '24384', 'Orange_DRC', 'PUBLIC'),
  ('63089', '24389', 'Orange_DRC', 'PUBLIC'),
  ('63102', '24492', 'Unitel_Angola', 'PUBLIC'),
  ('63202', '24596', 'MTN_Guinea', 'PUBLIC'),
  ('63310', '24827', 'MnName', 'PUBLIC'),
  ('63401', '24991', 'Sudan-Mobitel-ZAIN-SD_Sudan', 'PUBLIC'),
  ('63402', '24992', 'Areeba-Bashair_Sudan', 'PUBLIC'),
  ('63510', '25078', 'MTN-Rwanda_RWANDA', 'PUBLIC'),
  ('63601', '25191', 'MnName', 'PUBLIC'),
  ('63801', '25377', 'Djibouti Telecom_Djibouti', 'PUBLIC'),
  ('63902', '254722', 'Safaricom_Kenya', 'PUBLIC'),
  ('63907', '254770', 'MnName', 'PUBLIC'),
  ('64002', '25571', 'MIC_Tanzania-Ltd_Tanzania', 'PUBLIC'),
  ('64004', '25575', 'MnName', 'PUBLIC'),
  ('64005', '25578', 'Celtel Tanzania', 'PUBLIC'),
  ('64008', '25579', 'MnName', 'PUBLIC'),
  ('64101', '25675', 'Uganda-Celtel_Uganda', 'PUBLIC'),
  ('64118', '25674', 'MnName', 'PUBLIC'),
  ('64207', '25775', 'MnName', 'PUBLIC'),
  ('64304', '25884', 'vodacom_Mozambique', 'PUBLIC'),
  ('64501', '26097', 'MnName', 'PUBLIC'),
  ('64601', '26133', 'Madacom_Madagascar', 'PUBLIC'),
  ('64602', '26132', 'Orange_Madagascar', 'PUBLIC'),
  ('64803', '26373', 'MnName', 'PUBLIC'),
  ('64901', '26481', 'NAMIBIA-MTC_Namibia', 'PUBLIC'),
  ('65001', '26588', 'Malawi Telekom Networks_Malawi', 'PUBLIC'),
  ('65101', '2665', 'MnName', 'PUBLIC'),
  ('65102', '2666', 'MnName', 'PUBLIC'),
  ('65201', '26771', 'Mascom Botswana', 'PUBLIC'),
  ('65202', '26772', 'MnName', 'PUBLIC'),
  ('65310', '26876', 'MnName', 'PUBLIC'),
  ('65501', '2782', 'South Africa VODACOM', 'PUBLIC'),
  ('65507', '2784', 'Cell_c_South Africa', 'PUBLIC'),
  ('65510', '2783', 'South Africa MTN', 'PUBLIC'),
  ('65902', '21192', 'MnName', 'PUBLIC'),
  ('70401', '502530', 'SECOM -CLARO_ Guatemala', 'PUBLIC'),
  ('70601', '503786', 'MnName', 'PUBLIC'),
  ('70602', '503776', 'Digicel El Salvador', 'PUBLIC'),
  ('70603', '50387', 'Telemovil_Salvador', 'PUBLIC'),
  ('71021', '50585', 'MnName', 'PUBLIC'),
  ('71073', '50585', 'MnName', 'PUBLIC'),
  ('71201', '506300', 'MnName', 'PUBLIC'),
  ('71203', '5067000', 'Claro Costa Rica', 'PUBLIC'),
  ('71401', '50769', 'panama_cable-wireless_panama', 'PUBLIC'),
  ('71404', '50760', 'DIGICEL PANAMA', 'PUBLIC'),
  ('71606', '511955', 'Telef¨®nica del Peru', 'PUBLIC'),
  ('71610', '51997', 'Peru-TIM_Peru', 'PUBLIC'),
  ('72207', '5407', 'Telefonica Agrentine', 'PUBLIC'),
  ('722310', '54320', 'CTI movil_Argentina', 'PUBLIC'),
  ('72402', '55002', 'MnName', 'PUBLIC'),
  ('72403', '55003', 'MnName', 'PUBLIC'),
  ('72404', '55004', 'MnName', 'PUBLIC'),
  ('72405', '55005', 'MnName', 'PUBLIC'),
  ('72406', '55006', 'Vivo_Brasil_2', 'PUBLIC'),
  ('72410', '55010', 'Vivo_Brasil', 'PUBLIC'),
  ('72411', '55011', 'Vivo_Brasil_3', 'PUBLIC'),
  ('72423', '55023', 'Vivo_Brasil_4', 'PUBLIC'),
  ('73002', '56916', 'Telefónica Movil de Chile S.A', 'PUBLIC'),
  ('73003', '56920', 'Claro_CHILE', 'PUBLIC'),
  ('73007', '56983', 'Telef¨®nica Movil de Chile S.A', 'PUBLIC'),
  ('732123', '57316', 'MnName', 'PUBLIC'),
  ('73402', '58412', 'MnName', 'PUBLIC'),
  ('73801', '59266', 'Digicel Guyana Inc', 'PUBLIC'),
  ('74001', '593994', 'Conecel S.A_Ecouador', 'PUBLIC'),
  ('74402', '595991', 'CTI movil_Paraguay', 'PUBLIC'),
  ('74603', '59781', 'MnName', 'PUBLIC'),
  ('74801', '59899', 'Uruguay-ANTEL_Uruguay', 'PUBLIC'),
  ('74807', '59894', 'MOVISTAR Uruguay', 'PUBLIC'),
  ('74810', '59896', 'cti movil_Uruguay', 'PUBLIC'),
  ('90105', '88216', 'MnName', 'PUBLIC'),
  ('90128', '88239', 'Malta_Vodafone_M2M', 'PUBLIC'),
  ('90131', '883130', 'France TELECOM', 'PUBLIC'),
  ('90140', '88228', 'Telekom Deutschland Global SIM', 'PUBLIC'),
  ('20201', '3097', 'Greece_Cosmote', 'PUBLIC'),
  ('20205', '30694', 'MnName', 'PUBLIC'),
  ('20209', '30699', 'Q_tel_Greece', 'PUBLIC'),
  ('20210', '30693', 'Greece STET-Hellas', 'PUBLIC'),
  ('20404', '31654', 'Holland Libertel', 'PUBLIC'),
  ('20408', '31653', 'Holland KPN', 'PUBLIC'),
  ('20412', '31626', 'Holland TELFORT', 'PUBLIC'),
  ('20416', '31624', 'T-mobile_Netherlands', 'PUBLIC'),
  ('20420', '31628', 'Orange_Netherlands', 'PUBLIC'),
  ('20601', '32475', 'Belgacom', 'PUBLIC'),
  ('20605', '32468', 'Telenet BidCo Belgium', 'PUBLIC'),
  ('20610', '32495', 'Belgium Mobistar', 'PUBLIC'),
  ('20620', '32486', 'Base_Belgium', 'PUBLIC'),
  ('20801', '33689', 'France TELECOM', 'PUBLIC'),
  ('20809', '33611', 'France', 'PUBLIC'),
  ('20810', '33609', 'France SFR', 'PUBLIC'),
  ('20815', '33695', 'FRA free Mobile', 'PUBLIC'),
  ('20820', '33660', 'France SFR', 'PUBLIC'),
  ('21401', '34607', 'Spain_Vodafone', 'PUBLIC'),
  ('21403', '34656', 'Amena_Spain', 'PUBLIC'),
  ('21405', '34648', 'MnName', 'PUBLIC'),
  ('21406', '34607', 'Spain_Vodafone', 'PUBLIC'),
  ('21407', '34609', 'Spain Telefonica', 'PUBLIC'),
  ('21630', '3630', 'Hungary Westel', 'PUBLIC'),
  ('21670', '3670', 'Vodafone_Hungary', 'PUBLIC'),
  ('21803', '38763', 'HT mobile_Bosnia', 'PUBLIC'),
  ('21805', '38765', 'MnName', 'PUBLIC'),
  ('21901', '38598', 'Hrvatski_Telekom_Croatian', 'PUBLIC'),
  ('21902', '38595', 'Tele_2_craotia', 'PUBLIC'),
  ('22001', '38163', 'Yugoslavia MOBTEL', 'PUBLIC'),
  ('22002', '38269', 'Promonte_Serbia and Montenegro', 'PUBLIC'),
  ('22003', '38164', 'Telekom_Srbija', 'PUBLIC'),
  ('22201', '39339', 'Italy TIM', 'PUBLIC'),
  ('22210', '39349', 'Vodafone_Omnitel_Italy', 'PUBLIC'),
  ('22250', '393519', 'ITAFM_ILIAD Italia', 'PUBLIC'),
  ('22601', '40722', 'vodafone_Connex GSM_Romania', 'PUBLIC'),
  ('22603', '4076', 'Cosmote_Romania', 'PUBLIC'),
  ('22801', '4179', 'Swisscom', 'PUBLIC'),
  ('22802', '4176', 'SUNRISE_SWITZERLAND', 'PUBLIC'),
  ('22803', '41788', 'Orange_Switzerland', 'PUBLIC'),
  ('23001', '420603', 'T-Mobile Czech Republic', 'PUBLIC'),
  ('23002', '420602', 'Czechoslovakia EruoTel', 'PUBLIC'),
  ('23003', '420608', 'MnName', 'PUBLIC'),
  ('23101', '421905', 'Czechoslovakia Globtel', 'PUBLIC'),
  ('23102', '421903', 'Slovak Telecom SVKET', 'PUBLIC'),
  ('23203', '43676', 'Austria MAXMobil', 'PUBLIC'),
  ('23207', '43650', 'MnName', 'PUBLIC'),
  ('23410', '447802', 'England Cellnet', 'PUBLIC'),
  ('23415', '44385', 'England Vodafone', 'PUBLIC'),
  ('23430', '447953', 'England One 2 One', 'PUBLIC'),
  ('23433', '44973', 'England One 2 One', 'PUBLIC'),
  ('23450', '447797', 'MnName', 'PUBLIC'),
  ('23455', '447781', 'MnName', 'PUBLIC'),
  ('23801', '45401', 'TDC Mobile_Denmark', 'PUBLIC'),
  ('23802', '45405', 'Sonofon_Denmark', 'PUBLIC'),
  ('23820', '4528', 'Telia Mobile_Denmark', 'PUBLIC'),
  ('23830', '4526', 'Orange_Telia Mobile_Denmark', 'PUBLIC'),
  ('24001', '46705', 'Sweden Telia', 'PUBLIC'),
  ('24007', '46707', 'Tele 2_Russia', 'PUBLIC'),
  ('24010', '46765', 'Tele 2_Sweden', 'PUBLIC'),
  ('24014', '4676720', 'MnName', 'PUBLIC'),
  ('24201', '47900', 'Norway Telenor Mobil', 'PUBLIC'),
  ('24208', '479451', 'MnName', 'PUBLIC'),
  ('24405', '35850', 'Finland Radiolinjia', 'PUBLIC'),
  ('24414', '3584570', 'Alands Mobiltelefon_ Finland', 'PUBLIC'),
  ('24421', '358451', 'MnName', 'PUBLIC'),
  ('24603', '370684', 'tele2_Lithunia', 'PUBLIC'),
  ('24701', '371292', 'Latvia LMT', 'PUBLIC'),
  ('24702', '371295', 'Tele2_Latvia', 'PUBLIC'),
  ('24802', '37256', 'Elisa_Estonia', 'PUBLIC'),
  ('24803', '37255', 'Tele2_Estonia', 'PUBLIC'),
  ('25001', '79160', 'Russia Mobile-Telesystems', 'PUBLIC'),
  ('25002', '792', 'Russia North-WestGS', 'PUBLIC'),
  ('25016', '7902557', 'Vladivostok NTC_Russia', 'PUBLIC'),
  ('25020', '790434', 'MnName', 'PUBLIC'),
  ('25099', '79037', 'KB Impuls_Russia', 'PUBLIC'),
  ('25501', '38050', 'Ukraine UMC', 'PUBLIC'),
  ('25502', '38068', 'Ukranian Radio System_Ukrain', 'PUBLIC'),
  ('25503', '38067', 'Kyivstar GSM_Ukraine', 'PUBLIC'),
  ('25505', '38039', 'Astelit_Ukraine', 'PUBLIC'),
  ('25506', '38063', 'Golden Telekom_Ukraine', 'PUBLIC'),
  ('25701', '375296', 'Velcom_Belarus', 'PUBLIC'),
  ('25702', '375297', 'MTN_BELARUS', 'PUBLIC'),
  ('25901', '373691', 'MnName', 'PUBLIC'),
  ('25905', '37367', 'Moldtelecom S.A MOLDOVA', 'PUBLIC'),
  ('26002', '48602', 'MnName', 'PUBLIC'),
  ('26003', '48501', 'Poland CENTERTEL', 'PUBLIC'),
  ('26006', '48790', 'MnName', 'PUBLIC'),
  ('26201', '49171', 'MnName', 'PUBLIC'),
  ('26202', '49172', 'Vodafone D2 Manesman_Germany', 'PUBLIC'),
  ('26203', '49177', 'Eplus_Germany', 'PUBLIC'),
  ('26207', '49176', 'MnName', 'PUBLIC'),
  ('26801', '35191', 'Vodafone_Portugal', 'PUBLIC'),
  ('26806', '35196', 'Portugal TMN', 'PUBLIC'),
  ('27001', '352021', 'Luxemburg P&T', 'PUBLIC'),
  ('27077', '352091', 'Tango_Luxembourg', 'PUBLIC'),
  ('27099', '352061', 'VOXmobile_Luxembourg', 'PUBLIC'),
  ('27201', '35387', 'vodafone_Ireland', 'PUBLIC'),
  ('27203', '35385', 'MnName', 'PUBLIC'),
  ('27401', '35489', 'Iceland LANDSSIMINN', 'PUBLIC'),
  ('27404', '354650', 'viking wireless IMC_ISLAND', 'PUBLIC'),
  ('27601', '35568', 'Albanian Mobile TEL_ALBANIAN', 'PUBLIC'),
  ('27602', '35569', 'Vodafone_ALBANIAN', 'PUBLIC'),
  ('27801', '35694', 'vodafone_malta', 'PUBLIC'),
  ('27821', '35679', 'Malta_go_mobile', 'PUBLIC'),
  ('28001', '35799', 'Cyprus CYTA', 'PUBLIC'),
  ('28010', '35796', 'Areeba_MTN_Cyprus', 'PUBLIC'),
  ('28301', '37491', 'ArmenTel_Ktelecom_Armenia', 'PUBLIC'),
  ('28305', '37493', 'Vivacell_Armenia', 'PUBLIC'),
  ('28401', '35988', 'Bulgaria MOBILTEL', 'PUBLIC'),
  ('28403', '35987', 'Vivatel_Bulgaria', 'PUBLIC'),
  ('28405', '35989', 'Globul_Bulgaria', 'PUBLIC'),
  ('28601', '90532', 'Turkey Turkcell', 'PUBLIC'),
  ('28602', '90542', 'Turkey Telsim', 'PUBLIC'),
  ('28603', '90559', 'Avea Istanbul_Turkey', 'PUBLIC'),
  ('28604', '90505', 'Avea Istanbul_Turkey', 'PUBLIC'),
  ('28802', '29850', 'Kall_Faroe_Island', 'PUBLIC'),
  ('29341', '38641', 'Slovenia Mobtel', 'PUBLIC'),
  ('29402', '38975', 'Cosmofon_Macedonia', 'PUBLIC'),
  ('29403', '38977', 'MnName', 'PUBLIC'),
  ('29701', '38269', 'Promonte_Serbia and Montenegro', 'PUBLIC'),
  ('29703', '38268', 'MnName', 'PUBLIC'),
  ('302220', '164758', 'MnName', 'PUBLIC'),
  ('302370', '151499', 'Canada Mocrocell', 'PUBLIC'),
  ('302500', '151442', 'MnName', 'PUBLIC'),
  ('302610', '190561', 'MnName', 'PUBLIC'),
  ('302720', '170579', 'Rogers Wireless_Canada', 'PUBLIC'),
  ('302780', '130652', 'MnName', 'PUBLIC'),
  ('310030', '126057', 'T-Mobile USA', 'PUBLIC'),
  ('310150', '170450', 'MnName', 'PUBLIC'),
  ('310160', '140445', 'America Omnipoint', 'PUBLIC'),
  ('310170', '120990', 'America PACIFICBELL', 'PUBLIC'),
  ('310200', '150351', 'T---Mobile-USA', 'PUBLIC'),
  ('310210', '130333', 'T---Mobile-USA', 'PUBLIC'),
  ('310220', '140541', 'T---Mobile-USA', 'PUBLIC'),
  ('310230', '180185', 'T---Mobile-USA', 'PUBLIC'),
  ('310240', '150545', 'T---Mobile-USA', 'PUBLIC'),
  ('310250', '180825', 'T---Mobile-USA', 'PUBLIC'),
  ('310260', '140547', 'T---Mobile-USA', 'PUBLIC'),
  ('310270', '133433', 'America POWERTEL', 'PUBLIC'),
  ('310280', '126053', 'T-Mobile USA', 'PUBLIC'),
  ('310310', '164662', 'T---Mobile-USA', 'PUBLIC'),
  ('310380', '197037', 'MnName', 'PUBLIC'),
  ('310410', '131231', 'AT T Mobility', 'PUBLIC'),
  ('310420', '151324', 'CINCINNATI BELL WIRELESS_USA', 'PUBLIC'),
  ('310490', '170434', 'T---Mobile-USA', 'PUBLIC'),
  ('310580', '171720', 'T---Mobile-USA', 'PUBLIC'),
  ('310660', '191790', 'T---Mobile-USA', 'PUBLIC'),
  ('310800', '181326', 'T---Mobile-USA', 'PUBLIC'),
  ('311270', '190370299', 'MnName', 'PUBLIC'),
  ('311480', '190370299', 'MnName', 'PUBLIC'),
  ('334020', '52941', 'Telcel_Mexico', 'PUBLIC'),
  ('334030', '52942', 'MnName', 'PUBLIC'),
  ('33805', '1876380', 'MnName', 'PUBLIC'),
  ('338050', '187638', 'Digicel Jamaica', 'PUBLIC'),
  ('34020', '59669690', 'Digicel Antilles Française Guyane', 'PUBLIC'),
  ('348770', '128434', 'Digicel BVI Limited', 'PUBLIC'),
  ('36269', '599969', 'Curaçao Telecom N.V', 'PUBLIC'),
  ('3630207', '1876387', 'New Millennium Telecom Services NV', 'PUBLIC'),
  ('36449', '124289', 'ALIV BAHAMAS', 'PUBLIC'),
  ('36801', '537264', 'MnName', 'PUBLIC'),
  ('37001', '180985', 'Orange_dominicana_DOMINICANA', 'PUBLIC'),
  ('374130', '18683', 'Digicel Trinidad and Tobago', 'PUBLIC'),
  ('40001', '99450', 'Azerbaijan Azercell', 'PUBLIC'),
  ('40002', '99455', 'Bakcell Limited Liable Company', 'PUBLIC'),
  ('40004', '99470', 'Azerfon_Azerbaijan', 'PUBLIC'),
  ('40101', '7705', 'Kazakhstan Kar-Tel', 'PUBLIC'),
  ('40402', '919815', 'Punjab Airtel_India', 'PUBLIC'),
  ('40403', '919816', 'Himachal Pradech Airtel_India', 'PUBLIC'),
  ('40405', '919825', 'Fascel Hutch Gujarat_India', 'PUBLIC'),
  ('40410', '919810', 'Delhi Airtel_India', 'PUBLIC'),
  ('40411', '919811', 'Hutchison Essar_India', 'PUBLIC'),
  ('40416', '919862', 'Airtel North East', 'PUBLIC'),
  ('40420', '919820', 'India HMTL', 'PUBLIC'),
  ('40421', '919821', 'BPL MOBILE_LTD-MUMBAI_India', 'PUBLIC'),
  ('40427', '919823', 'vodafone_India', 'PUBLIC'),
  ('40430', '919830', 'Hutch East_India', 'PUBLIC'),
  ('40431', '919831', 'Kolkata Airtel_India', 'PUBLIC'),
  ('40440', '919840', 'Chennai Airtel_India', 'PUBLIC'),
  ('40443', '919843', 'INDIA', 'PUBLIC'),
  ('40445', '919845', 'Karnataka_Airtel_India', 'PUBLIC'),
  ('40449', '919849', 'Andrha Pracech_Airtel_India', 'PUBLIC'),
  ('40467', '919827', 'Reliance_India', 'PUBLIC'),
  ('40470', '919829', 'Rajasthan_Airtel_India', 'PUBLIC'),
  ('40490', '919890', 'Maharachtra-Goa_Airtel_India', 'PUBLIC'),
  ('40492', '919892', 'Mumbai_Airtel_India', 'PUBLIC'),
  ('40493', '919893', 'Madhya Pradech_Airtel_India', 'PUBLIC'),
  ('40494', '919894', 'Tamilnadu_Airtel_India', 'PUBLIC'),
  ('40495', '919895', 'Kerala_Airtel_India', 'PUBLIC'),
  ('40496', '919896', 'Haryana_Airtel_India', 'PUBLIC'),
  ('40497', '919897', 'Up West_Airtel_India', 'PUBLIC'),
  ('40498', '919898', 'Gujarat_Airtel_India', 'PUBLIC'),
  ('405025', '919030', 'MnName', 'PUBLIC'),
  ('405027', '919031', 'MnName', 'PUBLIC'),
  ('405029', '917796', 'MnName', 'PUBLIC'),
  ('405030', '919033', 'MnName', 'PUBLIC'),
  ('405031', '919034', 'MnName', 'PUBLIC'),
  ('405032', '918091', 'MnName', 'PUBLIC'),
  ('405034', '919036', 'MnName', 'PUBLIC'),
  ('405035', '919037', 'MnName', 'PUBLIC'),
  ('405036', '919038', 'MnName', 'PUBLIC'),
  ('405037', '919028', 'MnName', 'PUBLIC'),
  ('405038', '919039', 'MnName', 'PUBLIC'),
  ('405039', '919029', 'MnName', 'PUBLIC'),
  ('405041', '919040', 'MnName', 'PUBLIC'),
  ('405042', '919041', 'MnName', 'PUBLIC'),
  ('405043', '917737', 'MnName', 'PUBLIC'),
  ('405044', '919043', 'MnName', 'PUBLIC'),
  ('405045', '919044', 'MnName', 'PUBLIC'),
  ('405046', '919045', 'MnName', 'PUBLIC'),
  ('405047', '919046', 'MnName', 'PUBLIC'),
  ('40551', '919932', 'Airtel West Bengal', 'PUBLIC'),
  ('40552', '919934', 'Airtel Bihar_india', 'PUBLIC'),
  ('40553', '919937', 'Airtel Orissa_india', 'PUBLIC'),
  ('40554', '919935', 'Airtel UP East_india', 'PUBLIC'),
  ('405550', '9199060', 'AIRTEL INDIA IND13', 'PUBLIC'),
  ('405551', '9199065', 'AIRTEL INDIA IND13', 'PUBLIC'),
  ('405552', '9199069', 'AIRTEL INDIA IND13', 'PUBLIC'),
  ('40556', '919954', 'Airtel Assam', 'PUBLIC'),
  ('41004', '9231', 'CMPak-Paktel_Pakistan', 'PUBLIC'),
  ('41006', '92345', 'Telnor_Pakistan', 'PUBLIC'),
  ('41007', '92321', 'warid-telecom_Pakistan', 'PUBLIC'),
  ('41201', '9370', 'Afghan-Wireless_Afghanistan', 'PUBLIC'),
  ('41220', '9379', 'Roshan-TDAC_Afghanistan', 'PUBLIC'),
  ('41250', '9378', 'MnName', 'PUBLIC'),
  ('41301', '9471', 'Mobitel_Sri Lanka', 'PUBLIC'),
  ('41302', '9477', 'Sri Lanka MTN', 'PUBLIC'),
  ('41308', '9478', 'Hutchison Telecommunications Lanka', 'PUBLIC'),
  ('41405', '95997', 'OOREDOO MYANMAR', 'PUBLIC'),
  ('41501', '96134', 'Lebanon FTML', 'PUBLIC'),
  ('41503', '96139', 'MnName', 'PUBLIC'),
  ('41601', '96279', 'Fast-Link_Jordan', 'PUBLIC'),
  ('41602', '96274', 'Xpress_Jordan', 'PUBLIC'),
  ('41603', '96278', 'Umniah_Jordan', 'PUBLIC'),
  ('41677', '96277', 'Mobilcom_Jordan', 'PUBLIC'),
  ('41701', '96393', 'Syriatel_Syria', 'PUBLIC'),
  ('41702', '96394', 'Spacetel_Syria', 'PUBLIC'),
  ('41805', '9647701', 'Asia-Cell-Wataniya_Iraq', 'PUBLIC'),
  ('41820', '9647802', 'Zain-Iraq', 'PUBLIC'),
  ('41830', '96479', 'Iraqna-Iraq', 'PUBLIC'),
  ('41902', '96596', 'Kuwait MTC', 'PUBLIC'),
  ('41903', '9656', 'Wataniya-Telekom_Kuwait', 'PUBLIC'),
  ('41904', '965500', 'KTC-Kuwait Telecom Company', 'PUBLIC'),
  ('42001', '96650', 'Saudi Arabia STC', 'PUBLIC'),
  ('42003', '96656', 'Etihad Etissalat-Saudi_Arabia', 'PUBLIC'),
  ('42004', '96659', 'Zain_Saudi Arabia', 'PUBLIC'),
  ('42005', '96657', 'Virgin Mobile Saudi', 'PUBLIC'),
  ('42101', '96771', 'Sabafon_Yemen', 'PUBLIC'),
  ('42102', '96773', 'Spacetel_Yemen', 'PUBLIC'),
  ('42104', '96770', 'telecom-Y_Yemen', 'PUBLIC'),
  ('42202', '96892', 'Oman-Mobile_Oman', 'PUBLIC'),
  ('42203', '96895', 'Nawras_Oman', 'PUBLIC'),
  ('42402', '97150', 'UAE Etisalat', 'PUBLIC'),
  ('42403', '97155', 'DU_United Arab Emirates', 'PUBLIC'),
  ('42505', '97259', 'Jawal_Palestine', 'PUBLIC'),
  ('42506', '97256', 'MnName', 'PUBLIC'),
  ('42601', '97339', 'Batelco_Bahrein', 'PUBLIC'),
  ('42602', '97336', 'MTC-Vodafone_Bahrein', 'PUBLIC'),
  ('42604', '97333', 'MnName', 'PUBLIC'),
  ('42701', '97455', 'Qatar QTEL', 'PUBLIC'),
  ('42702', '97477', 'Vodafone Qatar', 'PUBLIC'),
  ('42888', '97688', 'MnName', 'PUBLIC'),
  ('43211', '98911', 'MCI_Iran', 'PUBLIC'),
  ('43220', '98920', 'MnName', 'PUBLIC'),
  ('43235', '98935', 'MnName', 'PUBLIC'),
  ('43404', '99890', 'MnName', 'PUBLIC'),
  ('43405', '99893', 'MnName', 'PUBLIC'),
  ('43601', '99292', 'Indigo-south_Tajikistan', 'PUBLIC'),
  ('43602', '99293', 'Indigo-north_Tajikistan', 'PUBLIC'),
  ('43701', '99677', 'Bitel-SKY-Mobile_kyrgyzstan', 'PUBLIC'),
  ('43709', '99670', 'MnName', 'PUBLIC'),
  ('43801', '993663', 'MnName', 'PUBLIC'),
  ('43802', '99365', 'TMCEL Turkmanistan', 'PUBLIC'),
  ('44010', '8190542', 'MnName', 'PUBLIC'),
  ('44050', '8180931', 'MnName', 'PUBLIC'),
  ('44051', '8180984', 'Japan', 'PUBLIC'),
  ('45008', '8210291', 'MnName', 'PUBLIC'),
  ('45201', '8490', 'Vietnam VMS', 'PUBLIC'),
  ('45202', '8491', 'Vietnam VNPT', 'PUBLIC'),
  ('45204', '8498', 'MnName', 'PUBLIC'),
  ('45205', '8492', 'Hanoi-telecom-mobile_Vietnam', 'PUBLIC'),
  ('45400', '852902', 'Hongkong CSL', 'PUBLIC'),
  ('45403', '852633', 'Hutchison 3G_Hong Kong', 'PUBLIC'),
  ('45404', '852949', 'Hongkong HUTEL', 'PUBLIC'),
  ('45412', '852920', 'Hongkong popular', 'PUBLIC'),
  ('45416', '852923', 'Hongkong Sunday North-West', 'PUBLIC'),
  ('45419', '852923', 'China', 'PUBLIC'),
  ('45501', '85368989', 'MnName', 'PUBLIC'),
  ('45618', '85511', 'Mfone-CAMSHIN_CAMBODGE', 'PUBLIC'),
  ('46001', '86130', 'China UniCom', 'PUBLIC'),
  ('46009', '86186', 'MnName', 'PUBLIC'),
  ('46689', '886986', 'MnName', 'PUBLIC'),
  ('47002', '88018', 'Aktel_Banglades', 'PUBLIC'),
  ('47007', '88016', 'warid telecom_Bangladesh', 'PUBLIC'),
  ('47202', '96096', 'Wataniya-Telecom_Maldives', 'PUBLIC'),
  ('50212', '6012', 'Malaysia Maxis', 'PUBLIC'),
  ('50218', '6018', 'U Mobile Sdn Bhd_Maxisbhd', 'PUBLIC'),
  ('50503', '61415', 'Australia VODAFONE', 'PUBLIC'),
  ('51001', '62816', 'Indonesia SATELIND', 'PUBLIC'),
  ('51010', '62811', 'Indonesia TELKOMSE', 'PUBLIC'),
  ('51401', '67073', 'Telkomcel', 'PUBLIC'),
  ('51502', '63917', 'Philippine GLOBALTELCOM', 'PUBLIC'),
  ('51503', '63918', 'SMART 3G_Philippines', 'PUBLIC'),
  ('52000', '66830', 'MnName', 'PUBLIC'),
  ('52004', '66938', 'MnName', 'PUBLIC'),
  ('52005', '66950', 'DTAC_Thailand THADT', 'PUBLIC'),
  ('52018', '66816', 'DTAC_Thailand', 'PUBLIC'),
  ('52099', '66891', 'True move_Thailand', 'PUBLIC'),
  ('52503', '659', 'Singapore MogileOne', 'PUBLIC'),
  ('52802', '67381', 'BRNBR', 'PUBLIC'),
  ('52811', '67387', 'MnName', 'PUBLIC'),
  ('52941', '334020', 'TELCEL MEXICO', 'PUBLIC'),
  ('53001', '6421', 'vodafone_new_Zealand', 'PUBLIC'),
  ('53024', '6422', 'New_zeland_2_degree', 'PUBLIC'),
  ('54601', '68777', 'OPT New Caledonia', 'PUBLIC'),
  ('54720', '68987', 'MnName', 'PUBLIC'),
  ('60201', '2012', 'Mobinil_Egypt', 'PUBLIC'),
  ('60202', '2010', 'Vodafone_Egypt', 'PUBLIC'),
  ('60203', '2011', 'Etisalat Misr_Egypt', 'PUBLIC'),
  ('60301', '21366', 'ATM_MOBILIS', 'PUBLIC'),
  ('60308', '2136606', 'MnName', 'PUBLIC'),
  ('60400', '2126639', 'Meditel_Morocco', 'PUBLIC'),
  ('60401', '212661', 'Morocco IAM', 'PUBLIC'),
  ('60402', '212640', 'MnName', 'PUBLIC'),
  ('60501', '2165', 'MnName', 'PUBLIC'),
  ('60502', '21698', 'Tunisie Telecom_Tunisie', 'PUBLIC'),
  ('60503', '21622', 'Tunisiana_Tunisie', 'PUBLIC'),
  ('60506', '2164300', 'MnName', 'PUBLIC'),
  ('60601', '21891', 'Al Madar_Libya', 'PUBLIC'),
  ('60701', '22099', 'GAMCEL', 'PUBLIC'),
  ('60702', '22077', 'Africell_Gambia', 'PUBLIC'),
  ('60801', '22177', 'Sonatel_Orange_Senegal', 'PUBLIC'),
  ('60802', '22176', 'Tigo_Senegal', 'PUBLIC'),
  ('60902', '22222', 'MnName', 'PUBLIC'),
  ('60910', '22240', 'Mauritel_Mauritania', 'PUBLIC'),
  ('61001', '223667', 'Malitel_Mali', 'PUBLIC'),
  ('61002', '223760', 'Ikatel-ORANGE_Mali', 'PUBLIC'),
  ('61101', '22462', 'MnName', 'PUBLIC'),
  ('61103', '22463', 'GUINEE-INTERCEL_GUINEE', 'PUBLIC'),
  ('61203', '22507', 'SIM-Orange_Ivory Coast', 'PUBLIC'),
  ('61302', '22676', 'MnName', 'PUBLIC'),
  ('61303', '226788', 'Telcel_Burkina Faso', 'PUBLIC'),
  ('61402', '22796', 'MnName', 'PUBLIC'),
  ('61403', '22794', 'NIGER-ATALANTIQUE-TELECOM_NIGER', 'PUBLIC'),
  ('61501', '22804', 'Togo Telecom', 'PUBLIC'),
  ('61603', '22997', 'Spacetel_MTN_Benin', 'PUBLIC'),
  ('61701', '23025', 'Mauritius CELLPLUS', 'PUBLIC'),
  ('61804', '23155', 'Liberia-Comium_Liberia', 'PUBLIC'),
  ('61905', '23277', 'AFRICEL- Lintel (SL) Ltd. Sierra Leone', 'PUBLIC'),
  ('62001', '23324', 'Areeba scancom_GHana', 'PUBLIC'),
  ('62002', '23320', 'Onetouch_ GHana', 'PUBLIC'),
  ('62003', '23327', 'Millicom_ GHana', 'PUBLIC'),
  ('62120', '234802', 'Vmobile_Nigeria', 'PUBLIC'),
  ('62130', '234803', 'MTN_Nigeria', 'PUBLIC'),
  ('62160', '234809', 'MnName', 'PUBLIC'),
  ('62201', '2356', 'Tchad-Zain-Celtel-Tchad', 'PUBLIC'),
  ('62203', '2359', 'MIC_Tchad', 'PUBLIC'),
  ('62401', '23767', 'MTN_Cameroun', 'PUBLIC'),
  ('62402', '23769', '0range_Cameroun', 'PUBLIC'),
  ('62502', '23891', 'MnName', 'PUBLIC'),
  ('62701', '2402', 'MnName', 'PUBLIC'),
  ('62703', '24055', 'MnName', 'PUBLIC'),
  ('62803', '24107', 'GA-GABON-Celtel_Gabon', 'PUBLIC'),
  ('62901', '24205', 'MnName', 'PUBLIC'),
  ('62907', '24204', 'MnName', 'PUBLIC'),
  ('63001', '24381', 'DRC-Vodacom_Congo', 'PUBLIC'),
  ('63086', '24384', 'Orange_DRC', 'PUBLIC'),
  ('63089', '24389', 'Orange_DRC', 'PUBLIC'),
  ('63102', '24492', 'Unitel_Angola', 'PUBLIC'),
  ('63202', '24596', 'MTN_Guinea', 'PUBLIC'),
  ('63310', '24827', 'MnName', 'PUBLIC'),
  ('63401', '24991', 'Sudan-Mobitel-ZAIN-SD_Sudan', 'PUBLIC'),
  ('63402', '24992', 'Areeba-Bashair_Sudan', 'PUBLIC'),
  ('63510', '25078', 'MTN-Rwanda_RWANDA', 'PUBLIC'),
  ('63601', '25191', 'MnName', 'PUBLIC'),
  ('63801', '25377', 'Djibouti Telecom_Djibouti', 'PUBLIC'),
  ('63902', '254722', 'Safaricom_Kenya', 'PUBLIC'),
  ('63907', '254770', 'MnName', 'PUBLIC'),
  ('64002', '25571', 'MIC_Tanzania-Ltd_Tanzania', 'PUBLIC'),
  ('64004', '25575', 'MnName', 'PUBLIC'),
  ('64005', '25578', 'Celtel Tanzania', 'PUBLIC'),
  ('64008', '25579', 'MnName', 'PUBLIC'),
  ('64101', '25675', 'Uganda-Celtel_Uganda', 'PUBLIC'),
  ('64118', '25674', 'MnName', 'PUBLIC'),
  ('64207', '25775', 'MnName', 'PUBLIC'),
  ('64304', '25884', 'vodacom_Mozambique', 'PUBLIC'),
  ('64501', '26097', 'MnName', 'PUBLIC'),
  ('64601', '26133', 'Madacom_Madagascar', 'PUBLIC'),
  ('64602', '26132', 'Orange_Madagascar', 'PUBLIC'),
  ('64803', '26373', 'MnName', 'PUBLIC'),
  ('64901', '26481', 'NAMIBIA-MTC_Namibia', 'PUBLIC'),
  ('65001', '26588', 'Malawi Telekom Networks_Malawi', 'PUBLIC'),
  ('65101', '2665', 'MnName', 'PUBLIC'),
  ('65102', '2666', 'MnName', 'PUBLIC'),
  ('65201', '26771', 'Mascom Botswana', 'PUBLIC'),
  ('65202', '26772', 'MnName', 'PUBLIC'),
  ('65310', '26876', 'MnName', 'PUBLIC'),
  ('65501', '2782', 'South Africa VODACOM', 'PUBLIC'),
  ('65507', '2784', 'Cell_c_South Africa', 'PUBLIC'),
  ('65510', '2783', 'South Africa MTN', 'PUBLIC'),
  ('65902', '21192', 'MnName', 'PUBLIC'),
  ('70401', '502530', 'SECOM -CLARO_ Guatemala', 'PUBLIC'),
  ('70601', '503786', 'MnName', 'PUBLIC'),
  ('70602', '503776', 'Digicel El Salvador', 'PUBLIC'),
  ('70603', '50387', 'Telemovil_Salvador', 'PUBLIC'),
  ('71021', '50585', 'MnName', 'PUBLIC'),
  ('71073', '50585', 'MnName', 'PUBLIC'),
  ('71201', '506300', 'MnName', 'PUBLIC'),
  ('71203', '5067000', 'Claro Costa Rica', 'PUBLIC'),
  ('71401', '50769', 'panama_cable-wireless_panama', 'PUBLIC'),
  ('71404', '50760', 'DIGICEL PANAMA', 'PUBLIC'),
  ('71606', '511955', 'Telef¨®nica del Peru', 'PUBLIC'),
  ('71610', '51997', 'Peru-TIM_Peru', 'PUBLIC'),
  ('72207', '5407', 'Telefonica Agrentine', 'PUBLIC'),
  ('722310', '54320', 'CTI movil_Argentina', 'PUBLIC'),
  ('72402', '55002', 'MnName', 'PUBLIC'),
  ('72403', '55003', 'MnName', 'PUBLIC'),
  ('72404', '55004', 'MnName', 'PUBLIC'),
  ('72405', '55005', 'MnName', 'PUBLIC'),
  ('72406', '55006', 'Vivo_Brasil_2', 'PUBLIC'),
  ('72410', '55010', 'Vivo_Brasil', 'PUBLIC'),
  ('72411', '55011', 'Vivo_Brasil_3', 'PUBLIC'),
  ('72423', '55023', 'Vivo_Brasil_4', 'PUBLIC'),
  ('73002', '56916', 'Telefónica Movil de Chile S.A', 'PUBLIC'),
  ('73003', '56920', 'Claro_CHILE', 'PUBLIC'),
  ('73007', '56983', 'Telef¨®nica Movil de Chile S.A', 'PUBLIC'),
  ('732123', '57316', 'MnName', 'PUBLIC'),
  ('73402', '58412', 'MnName', 'PUBLIC'),
  ('73801', '59266', 'Digicel Guyana Inc', 'PUBLIC'),
  ('74001', '593994', 'Conecel S.A_Ecouador', 'PUBLIC'),
  ('74402', '595991', 'CTI movil_Paraguay', 'PUBLIC'),
  ('74603', '59781', 'MnName', 'PUBLIC'),
  ('74801', '59899', 'Uruguay-ANTEL_Uruguay', 'PUBLIC'),
  ('74807', '59894', 'MOVISTAR Uruguay', 'PUBLIC'),
  ('74810', '59896', 'cti movil_Uruguay', 'PUBLIC'),
  ('90105', '88216', 'MnName', 'PUBLIC'),
  ('90128', '88239', 'Malta_Vodafone_M2M', 'PUBLIC'),
  ('90131', '883130', 'France TELECOM', 'PUBLIC'),
  ('90140', '88228', 'Telekom Deutschland Global SIM', 'PUBLIC'),
  ('20201', '3097', 'Greece_Cosmote', 'PUBLIC'),
  ('20205', '30694', 'MnName', 'PUBLIC'),
  ('20209', '30699', 'Q_tel_Greece', 'PUBLIC'),
  ('20210', '30693', 'Greece STET-Hellas', 'PUBLIC'),
  ('20404', '31654', 'Holland Libertel', 'PUBLIC'),
  ('20408', '31653', 'Holland KPN', 'PUBLIC'),
  ('20412', '31626', 'Holland TELFORT', 'PUBLIC'),
  ('20416', '31624', 'T-mobile_Netherlands', 'PUBLIC'),
  ('20420', '31628', 'Orange_Netherlands', 'PUBLIC'),
  ('20601', '32475', 'Belgacom', 'PUBLIC'),
  ('20605', '32468', 'Telenet BidCo Belgium', 'PUBLIC'),
  ('20610', '32495', 'Belgium Mobistar', 'PUBLIC'),
  ('20620', '32486', 'Base_Belgium', 'PUBLIC'),
  ('20801', '33689', 'France TELECOM', 'PUBLIC'),
  ('20809', '33611', 'France', 'PUBLIC'),
  ('20810', '33609', 'France SFR', 'PUBLIC'),
  ('20815', '33695', 'FRA free Mobile', 'PUBLIC'),
  ('20820', '33660', 'France SFR', 'PUBLIC'),
  ('21401', '34607', 'Spain_Vodafone', 'PUBLIC'),
  ('21403', '34656', 'Amena_Spain', 'PUBLIC'),
  ('21405', '34648', 'MnName', 'PUBLIC'),
  ('21406', '34607', 'Spain_Vodafone', 'PUBLIC'),
  ('21407', '34609', 'Spain Telefonica', 'PUBLIC'),
  ('21630', '3630', 'Hungary Westel', 'PUBLIC'),
  ('21670', '3670', 'Vodafone_Hungary', 'PUBLIC'),
  ('21803', '38763', 'HT mobile_Bosnia', 'PUBLIC'),
  ('21805', '38765', 'MnName', 'PUBLIC'),
  ('21901', '38598', 'Hrvatski_Telekom_Croatian', 'PUBLIC'),
  ('21902', '38595', 'Tele_2_craotia', 'PUBLIC'),
  ('22001', '38163', 'Yugoslavia MOBTEL', 'PUBLIC'),
  ('22002', '38269', 'Promonte_Serbia and Montenegro', 'PUBLIC'),
  ('22003', '38164', 'Telekom_Srbija', 'PUBLIC'),
  ('22201', '39339', 'Italy TIM', 'PUBLIC'),
  ('22210', '39349', 'Vodafone_Omnitel_Italy', 'PUBLIC'),
  ('22250', '393519', 'ITAFM_ILIAD Italia', 'PUBLIC'),
  ('22601', '40722', 'vodafone_Connex GSM_Romania', 'PUBLIC'),
  ('22603', '4076', 'Cosmote_Romania', 'PUBLIC'),
  ('22801', '4179', 'Swisscom', 'PUBLIC'),
  ('22802', '4176', 'SUNRISE_SWITZERLAND', 'PUBLIC'),
  ('22803', '41788', 'Orange_Switzerland', 'PUBLIC'),
  ('23001', '420603', 'T-Mobile Czech Republic', 'PUBLIC'),
  ('23002', '420602', 'Czechoslovakia EruoTel', 'PUBLIC'),
  ('23003', '420608', 'MnName', 'PUBLIC'),
  ('23101', '421905', 'Czechoslovakia Globtel', 'PUBLIC'),
  ('23102', '421903', 'Slovak Telecom SVKET', 'PUBLIC'),
  ('23203', '43676', 'Austria MAXMobil', 'PUBLIC'),
  ('23207', '43650', 'MnName', 'PUBLIC'),
  ('23410', '447802', 'England Cellnet', 'PUBLIC'),
  ('23415', '44385', 'England Vodafone', 'PUBLIC'),
  ('23430', '447953', 'England One 2 One', 'PUBLIC'),
  ('23433', '44973', 'England One 2 One', 'PUBLIC'),
  ('23450', '447797', 'MnName', 'PUBLIC'),
  ('23455', '447781', 'MnName', 'PUBLIC'),
  ('23801', '45401', 'TDC Mobile_Denmark', 'PUBLIC'),
  ('23802', '45405', 'Sonofon_Denmark', 'PUBLIC'),
  ('23820', '4528', 'Telia Mobile_Denmark', 'PUBLIC'),
  ('23830', '4526', 'Orange_Telia Mobile_Denmark', 'PUBLIC'),
  ('24001', '46705', 'Sweden Telia', 'PUBLIC'),
  ('24007', '46707', 'Tele 2_Russia', 'PUBLIC'),
  ('24010', '46765', 'Tele 2_Sweden', 'PUBLIC'),
  ('24014', '4676720', 'MnName', 'PUBLIC'),
  ('24201', '47900', 'Norway Telenor Mobil', 'PUBLIC'),
  ('24208', '479451', 'MnName', 'PUBLIC'),
  ('24405', '35850', 'Finland Radiolinjia', 'PUBLIC'),
  ('24414', '3584570', 'Alands Mobiltelefon_ Finland', 'PUBLIC'),
  ('24421', '358451', 'MnName', 'PUBLIC'),
  ('24603', '370684', 'tele2_Lithunia', 'PUBLIC'),
  ('24701', '371292', 'Latvia LMT', 'PUBLIC'),
  ('24702', '371295', 'Tele2_Latvia', 'PUBLIC'),
  ('24802', '37256', 'Elisa_Estonia', 'PUBLIC'),
  ('24803', '37255', 'Tele2_Estonia', 'PUBLIC'),
  ('25001', '79160', 'Russia Mobile-Telesystems', 'PUBLIC'),
  ('25002', '792', 'Russia North-WestGS', 'PUBLIC'),
  ('25016', '7902557', 'Vladivostok NTC_Russia', 'PUBLIC'),
  ('25020', '790434', 'MnName', 'PUBLIC'),
  ('25099', '79037', 'KB Impuls_Russia', 'PUBLIC'),
  ('25501', '38050', 'Ukraine UMC', 'PUBLIC'),
  ('25502', '38068', 'Ukranian Radio System_Ukrain', 'PUBLIC'),
  ('25503', '38067', 'Kyivstar GSM_Ukraine', 'PUBLIC'),
  ('25505', '38039', 'Astelit_Ukraine', 'PUBLIC'),
  ('25506', '38063', 'Golden Telekom_Ukraine', 'PUBLIC'),
  ('25701', '375296', 'Velcom_Belarus', 'PUBLIC'),
  ('25702', '375297', 'MTN_BELARUS', 'PUBLIC'),
  ('25901', '373691', 'MnName', 'PUBLIC'),
  ('25905', '37367', 'Moldtelecom S.A MOLDOVA', 'PUBLIC'),
  ('26002', '48602', 'MnName', 'PUBLIC'),
  ('26003', '48501', 'Poland CENTERTEL', 'PUBLIC'),
  ('26006', '48790', 'MnName', 'PUBLIC'),
  ('26201', '49171', 'MnName', 'PUBLIC'),
  ('26202', '49172', 'Vodafone D2 Manesman_Germany', 'PUBLIC'),
  ('26203', '49177', 'Eplus_Germany', 'PUBLIC'),
  ('26207', '49176', 'MnName', 'PUBLIC'),
  ('26801', '35191', 'Vodafone_Portugal', 'PUBLIC'),
  ('26806', '35196', 'Portugal TMN', 'PUBLIC'),
  ('27001', '352021', 'Luxemburg P&T', 'PUBLIC'),
  ('27077', '352091', 'Tango_Luxembourg', 'PUBLIC'),
  ('27099', '352061', 'VOXmobile_Luxembourg', 'PUBLIC'),
  ('27201', '35387', 'vodafone_Ireland', 'PUBLIC'),
  ('27203', '35385', 'MnName', 'PUBLIC'),
  ('27401', '35489', 'Iceland LANDSSIMINN', 'PUBLIC'),
  ('27404', '354650', 'viking wireless IMC_ISLAND', 'PUBLIC'),
  ('27601', '35568', 'Albanian Mobile TEL_ALBANIAN', 'PUBLIC'),
  ('27602', '35569', 'Vodafone_ALBANIAN', 'PUBLIC'),
  ('27801', '35694', 'vodafone_malta', 'PUBLIC'),
  ('27821', '35679', 'Malta_go_mobile', 'PUBLIC'),
  ('28001', '35799', 'Cyprus CYTA', 'PUBLIC'),
  ('28010', '35796', 'Areeba_MTN_Cyprus', 'PUBLIC'),
  ('28301', '37491', 'ArmenTel_Ktelecom_Armenia', 'PUBLIC'),
  ('28305', '37493', 'Vivacell_Armenia', 'PUBLIC'),
  ('28401', '35988', 'Bulgaria MOBILTEL', 'PUBLIC'),
  ('28403', '35987', 'Vivatel_Bulgaria', 'PUBLIC'),
  ('28405', '35989', 'Globul_Bulgaria', 'PUBLIC'),
  ('28601', '90532', 'Turkey Turkcell', 'PUBLIC'),
  ('28602', '90542', 'Turkey Telsim', 'PUBLIC'),
  ('28603', '90559', 'Avea Istanbul_Turkey', 'PUBLIC'),
  ('28604', '90505', 'Avea Istanbul_Turkey', 'PUBLIC'),
  ('28802', '29850', 'Kall_Faroe_Island', 'PUBLIC'),
  ('29341', '38641', 'Slovenia Mobtel', 'PUBLIC'),
  ('29402', '38975', 'Cosmofon_Macedonia', 'PUBLIC'),
  ('29403', '38977', 'MnName', 'PUBLIC'),
  ('29701', '38269', 'Promonte_Serbia and Montenegro', 'PUBLIC'),
  ('29703', '38268', 'MnName', 'PUBLIC'),
  ('302220', '164758', 'MnName', 'PUBLIC'),
  ('302370', '151499', 'Canada Mocrocell', 'PUBLIC'),
  ('302500', '151442', 'MnName', 'PUBLIC'),
  ('302610', '190561', 'MnName', 'PUBLIC'),
  ('302720', '170579', 'Rogers Wireless_Canada', 'PUBLIC'),
  ('302780', '130652', 'MnName', 'PUBLIC'),
  ('310030', '126057', 'T-Mobile USA', 'PUBLIC'),
  ('310150', '170450', 'MnName', 'PUBLIC'),
  ('310160', '140445', 'America Omnipoint', 'PUBLIC'),
  ('310170', '120990', 'America PACIFICBELL', 'PUBLIC'),
  ('310200', '150351', 'T---Mobile-USA', 'PUBLIC'),
  ('310210', '130333', 'T---Mobile-USA', 'PUBLIC'),
  ('310220', '140541', 'T---Mobile-USA', 'PUBLIC'),
  ('310230', '180185', 'T---Mobile-USA', 'PUBLIC'),
  ('310240', '150545', 'T---Mobile-USA', 'PUBLIC'),
  ('310250', '180825', 'T---Mobile-USA', 'PUBLIC'),
  ('310260', '140547', 'T---Mobile-USA', 'PUBLIC'),
  ('310270', '133433', 'America POWERTEL', 'PUBLIC'),
  ('310280', '126053', 'T-Mobile USA', 'PUBLIC'),
  ('310310', '164662', 'T---Mobile-USA', 'PUBLIC'),
  ('310380', '197037', 'MnName', 'PUBLIC'),
  ('310410', '131231', 'AT T Mobility', 'PUBLIC'),
  ('310420', '151324', 'CINCINNATI BELL WIRELESS_USA', 'PUBLIC'),
  ('310490', '170434', 'T---Mobile-USA', 'PUBLIC'),
  ('310580', '171720', 'T---Mobile-USA', 'PUBLIC'),
  ('310660', '191790', 'T---Mobile-USA', 'PUBLIC'),
  ('310800', '181326', 'T---Mobile-USA', 'PUBLIC'),
  ('311270', '190370299', 'MnName', 'PUBLIC'),
  ('311480', '190370299', 'MnName', 'PUBLIC'),
  ('334020', '52941', 'Telcel_Mexico', 'PUBLIC'),
  ('334030', '52942', 'MnName', 'PUBLIC'),
  ('33805', '1876380', 'MnName', 'PUBLIC'),
  ('338050', '187638', 'Digicel Jamaica', 'PUBLIC'),
  ('34020', '59669690', 'Digicel Antilles Française Guyane', 'PUBLIC'),
  ('348770', '128434', 'Digicel BVI Limited', 'PUBLIC'),
  ('36269', '599969', 'Curaçao Telecom N.V', 'PUBLIC'),
  ('3630207', '1876387', 'New Millennium Telecom Services NV', 'PUBLIC'),
  ('36449', '124289', 'ALIV BAHAMAS', 'PUBLIC'),
  ('36801', '537264', 'MnName', 'PUBLIC'),
  ('37001', '180985', 'Orange_dominicana_DOMINICANA', 'PUBLIC'),
  ('374130', '18683', 'Digicel Trinidad and Tobago', 'PUBLIC'),
  ('40001', '99450', 'Azerbaijan Azercell', 'PUBLIC'),
  ('40002', '99455', 'Bakcell Limited Liable Company', 'PUBLIC'),
  ('40004', '99470', 'Azerfon_Azerbaijan', 'PUBLIC'),
  ('40101', '7705', 'Kazakhstan Kar-Tel', 'PUBLIC'),
  ('40402', '919815', 'Punjab Airtel_India', 'PUBLIC'),
  ('40403', '919816', 'Himachal Pradech Airtel_India', 'PUBLIC'),
  ('40405', '919825', 'Fascel Hutch Gujarat_India', 'PUBLIC'),
  ('40410', '919810', 'Delhi Airtel_India', 'PUBLIC'),
  ('40411', '919811', 'Hutchison Essar_India', 'PUBLIC'),
  ('40416', '919862', 'Airtel North East', 'PUBLIC'),
  ('40420', '919820', 'India HMTL', 'PUBLIC'),
  ('40421', '919821', 'BPL MOBILE_LTD-MUMBAI_India', 'PUBLIC'),
  ('40427', '919823', 'vodafone_India', 'PUBLIC'),
  ('40430', '919830', 'Hutch East_India', 'PUBLIC'),
  ('40431', '919831', 'Kolkata Airtel_India', 'PUBLIC'),
  ('40440', '919840', 'Chennai Airtel_India', 'PUBLIC'),
  ('40443', '919843', 'INDIA', 'PUBLIC'),
  ('40445', '919845', 'Karnataka_Airtel_India', 'PUBLIC'),
  ('40449', '919849', 'Andrha Pracech_Airtel_India', 'PUBLIC'),
  ('40467', '919827', 'Reliance_India', 'PUBLIC'),
  ('40470', '919829', 'Rajasthan_Airtel_India', 'PUBLIC'),
  ('40490', '919890', 'Maharachtra-Goa_Airtel_India', 'PUBLIC'),
  ('40492', '919892', 'Mumbai_Airtel_India', 'PUBLIC'),
  ('40493', '919893', 'Madhya Pradech_Airtel_India', 'PUBLIC'),
  ('40494', '919894', 'Tamilnadu_Airtel_India', 'PUBLIC'),
  ('40495', '919895', 'Kerala_Airtel_India', 'PUBLIC'),
  ('40496', '919896', 'Haryana_Airtel_India', 'PUBLIC'),
  ('40497', '919897', 'Up West_Airtel_India', 'PUBLIC'),
  ('40498', '919898', 'Gujarat_Airtel_India', 'PUBLIC'),
  ('405025', '919030', 'MnName', 'PUBLIC'),
  ('405027', '919031', 'MnName', 'PUBLIC'),
  ('405029', '917796', 'MnName', 'PUBLIC'),
  ('405030', '919033', 'MnName', 'PUBLIC'),
  ('405031', '919034', 'MnName', 'PUBLIC'),
  ('405032', '918091', 'MnName', 'PUBLIC'),
  ('405034', '919036', 'MnName', 'PUBLIC'),
  ('405035', '919037', 'MnName', 'PUBLIC'),
  ('405036', '919038', 'MnName', 'PUBLIC'),
  ('405037', '919028', 'MnName', 'PUBLIC'),
  ('405038', '919039', 'MnName', 'PUBLIC'),
  ('405039', '919029', 'MnName', 'PUBLIC'),
  ('405041', '919040', 'MnName', 'PUBLIC'),
  ('405042', '919041', 'MnName', 'PUBLIC'),
  ('405043', '917737', 'MnName', 'PUBLIC'),
  ('405044', '919043', 'MnName', 'PUBLIC'),
  ('405045', '919044', 'MnName', 'PUBLIC'),
  ('405046', '919045', 'MnName', 'PUBLIC'),
  ('405047', '919046', 'MnName', 'PUBLIC'),
  ('40551', '919932', 'Airtel West Bengal', 'PUBLIC'),
  ('40552', '919934', 'Airtel Bihar_india', 'PUBLIC'),
  ('40553', '919937', 'Airtel Orissa_india', 'PUBLIC'),
  ('40554', '919935', 'Airtel UP East_india', 'PUBLIC'),
  ('405550', '9199060', 'AIRTEL INDIA IND13', 'PUBLIC'),
  ('405551', '9199065', 'AIRTEL INDIA IND13', 'PUBLIC'),
  ('405552', '9199069', 'AIRTEL INDIA IND13', 'PUBLIC'),
  ('40556', '919954', 'Airtel Assam', 'PUBLIC'),
  ('41004', '9231', 'CMPak-Paktel_Pakistan', 'PUBLIC'),
  ('41006', '92345', 'Telnor_Pakistan', 'PUBLIC'),
  ('41007', '92321', 'warid-telecom_Pakistan', 'PUBLIC'),
  ('41201', '9370', 'Afghan-Wireless_Afghanistan', 'PUBLIC'),
  ('41220', '9379', 'Roshan-TDAC_Afghanistan', 'PUBLIC'),
  ('41250', '9378', 'MnName', 'PUBLIC'),
  ('41301', '9471', 'Mobitel_Sri Lanka', 'PUBLIC'),
  ('41302', '9477', 'Sri Lanka MTN', 'PUBLIC'),
  ('41308', '9478', 'Hutchison Telecommunications Lanka', 'PUBLIC'),
  ('41405', '95997', 'OOREDOO MYANMAR', 'PUBLIC'),
  ('41501', '96134', 'Lebanon FTML', 'PUBLIC'),
  ('41503', '96139', 'MnName', 'PUBLIC'),
  ('41601', '96279', 'Fast-Link_Jordan', 'PUBLIC'),
  ('41602', '96274', 'Xpress_Jordan', 'PUBLIC'),
  ('41603', '96278', 'Umniah_Jordan', 'PUBLIC'),
  ('41677', '96277', 'Mobilcom_Jordan', 'PUBLIC'),
  ('41701', '96393', 'Syriatel_Syria', 'PUBLIC'),
  ('41702', '96394', 'Spacetel_Syria', 'PUBLIC'),
  ('41805', '9647701', 'Asia-Cell-Wataniya_Iraq', 'PUBLIC'),
  ('41820', '9647802', 'Zain-Iraq', 'PUBLIC'),
  ('41830', '96479', 'Iraqna-Iraq', 'PUBLIC'),
  ('41902', '96596', 'Kuwait MTC', 'PUBLIC'),
  ('41903', '9656', 'Wataniya-Telekom_Kuwait', 'PUBLIC'),
  ('41904', '965500', 'KTC-Kuwait Telecom Company', 'PUBLIC'),
  ('42001', '96650', 'Saudi Arabia STC', 'PUBLIC'),
  ('42003', '96656', 'Etihad Etissalat-Saudi_Arabia', 'PUBLIC'),
  ('42004', '96659', 'Zain_Saudi Arabia', 'PUBLIC'),
  ('42005', '96657', 'Virgin Mobile Saudi', 'PUBLIC'),
  ('42101', '96771', 'Sabafon_Yemen', 'PUBLIC'),
  ('42102', '96773', 'Spacetel_Yemen', 'PUBLIC'),
  ('42104', '96770', 'telecom-Y_Yemen', 'PUBLIC'),
  ('42202', '96892', 'Oman-Mobile_Oman', 'PUBLIC'),
  ('42203', '96895', 'Nawras_Oman', 'PUBLIC'),
  ('42402', '97150', 'UAE Etisalat', 'PUBLIC'),
  ('42403', '97155', 'DU_United Arab Emirates', 'PUBLIC'),
  ('42505', '97259', 'Jawal_Palestine', 'PUBLIC'),
  ('42506', '97256', 'MnName', 'PUBLIC'),
  ('42601', '97339', 'Batelco_Bahrein', 'PUBLIC'),
  ('42602', '97336', 'MTC-Vodafone_Bahrein', 'PUBLIC'),
  ('42604', '97333', 'MnName', 'PUBLIC'),
  ('42701', '97455', 'Qatar QTEL', 'PUBLIC'),
  ('42702', '97477', 'Vodafone Qatar', 'PUBLIC'),
  ('42888', '97688', 'MnName', 'PUBLIC'),
  ('43211', '98911', 'MCI_Iran', 'PUBLIC'),
  ('43220', '98920', 'MnName', 'PUBLIC'),
  ('43235', '98935', 'MnName', 'PUBLIC'),
  ('43404', '99890', 'MnName', 'PUBLIC'),
  ('43405', '99893', 'MnName', 'PUBLIC'),
  ('43601', '99292', 'Indigo-south_Tajikistan', 'PUBLIC'),
  ('43602', '99293', 'Indigo-north_Tajikistan', 'PUBLIC'),
  ('43701', '99677', 'Bitel-SKY-Mobile_kyrgyzstan', 'PUBLIC'),
  ('43709', '99670', 'MnName', 'PUBLIC'),
  ('43801', '993663', 'MnName', 'PUBLIC'),
  ('43802', '99365', 'TMCEL Turkmanistan', 'PUBLIC'),
  ('44010', '8190542', 'MnName', 'PUBLIC'),
  ('44050', '8180931', 'MnName', 'PUBLIC'),
  ('44051', '8180984', 'Japan', 'PUBLIC'),
  ('45008', '8210291', 'MnName', 'PUBLIC'),
  ('45201', '8490', 'Vietnam VMS', 'PUBLIC'),
  ('45202', '8491', 'Vietnam VNPT', 'PUBLIC'),
  ('45204', '8498', 'MnName', 'PUBLIC'),
  ('45205', '8492', 'Hanoi-telecom-mobile_Vietnam', 'PUBLIC'),
  ('45400', '852902', 'Hongkong CSL', 'PUBLIC'),
  ('45403', '852633', 'Hutchison 3G_Hong Kong', 'PUBLIC'),
  ('45404', '852949', 'Hongkong HUTEL', 'PUBLIC'),
  ('45412', '852920', 'Hongkong popular', 'PUBLIC'),
  ('45416', '852923', 'Hongkong Sunday North-West', 'PUBLIC'),
  ('45419', '852923', 'China', 'PUBLIC'),
  ('45501', '85368989', 'MnName', 'PUBLIC'),
  ('45618', '85511', 'Mfone-CAMSHIN_CAMBODGE', 'PUBLIC'),
  ('46001', '86130', 'China UniCom', 'PUBLIC'),
  ('46009', '86186', 'MnName', 'PUBLIC'),
  ('46689', '886986', 'MnName', 'PUBLIC'),
  ('47002', '88018', 'Aktel_Banglades', 'PUBLIC'),
  ('47007', '88016', 'warid telecom_Bangladesh', 'PUBLIC'),
  ('47202', '96096', 'Wataniya-Telecom_Maldives', 'PUBLIC'),
  ('50212', '6012', 'Malaysia Maxis', 'PUBLIC'),
  ('50218', '6018', 'U Mobile Sdn Bhd_Maxisbhd', 'PUBLIC'),
  ('50503', '61415', 'Australia VODAFONE', 'PUBLIC'),
  ('51001', '62816', 'Indonesia SATELIND', 'PUBLIC'),
  ('51010', '62811', 'Indonesia TELKOMSE', 'PUBLIC'),
  ('51401', '67073', 'Telkomcel', 'PUBLIC'),
  ('51502', '63917', 'Philippine GLOBALTELCOM', 'PUBLIC'),
  ('51503', '63918', 'SMART 3G_Philippines', 'PUBLIC'),
  ('52000', '66830', 'MnName', 'PUBLIC'),
  ('52004', '66938', 'MnName', 'PUBLIC'),
  ('52005', '66950', 'DTAC_Thailand THADT', 'PUBLIC'),
  ('52018', '66816', 'DTAC_Thailand', 'PUBLIC'),
  ('52099', '66891', 'True move_Thailand', 'PUBLIC'),
  ('52503', '659', 'Singapore MogileOne', 'PUBLIC'),
  ('52802', '67381', 'BRNBR', 'PUBLIC'),
  ('52811', '67387', 'MnName', 'PUBLIC'),
  ('52941', '334020', 'TELCEL MEXICO', 'PUBLIC'),
  ('53001', '6421', 'vodafone_new_Zealand', 'PUBLIC'),
  ('53024', '6422', 'New_zeland_2_degree', 'PUBLIC'),
  ('54601', '68777', 'OPT New Caledonia', 'PUBLIC'),
  ('54720', '68987', 'MnName', 'PUBLIC'),
  ('60201', '2012', 'Mobinil_Egypt', 'PUBLIC'),
  ('60202', '2010', 'Vodafone_Egypt', 'PUBLIC'),
  ('60203', '2011', 'Etisalat Misr_Egypt', 'PUBLIC'),
  ('60301', '21366', 'ATM_MOBILIS', 'PUBLIC'),
  ('60308', '2136606', 'MnName', 'PUBLIC'),
  ('60400', '2126639', 'Meditel_Morocco', 'PUBLIC'),
  ('60401', '212661', 'Morocco IAM', 'PUBLIC'),
  ('60402', '212640', 'MnName', 'PUBLIC'),
  ('60501', '2165', 'MnName', 'PUBLIC'),
  ('60502', '21698', 'Tunisie Telecom_Tunisie', 'PUBLIC'),
  ('60503', '21622', 'Tunisiana_Tunisie', 'PUBLIC'),
  ('60506', '2164300', 'MnName', 'PUBLIC'),
  ('60601', '21891', 'Al Madar_Libya', 'PUBLIC'),
  ('60701', '22099', 'GAMCEL', 'PUBLIC'),
  ('60702', '22077', 'Africell_Gambia', 'PUBLIC'),
  ('60801', '22177', 'Sonatel_Orange_Senegal', 'PUBLIC'),
  ('60802', '22176', 'Tigo_Senegal', 'PUBLIC'),
  ('60902', '22222', 'MnName', 'PUBLIC'),
  ('60910', '22240', 'Mauritel_Mauritania', 'PUBLIC'),
  ('61001', '223667', 'Malitel_Mali', 'PUBLIC'),
  ('61002', '223760', 'Ikatel-ORANGE_Mali', 'PUBLIC'),
  ('61101', '22462', 'MnName', 'PUBLIC'),
  ('61103', '22463', 'GUINEE-INTERCEL_GUINEE', 'PUBLIC'),
  ('61203', '22507', 'SIM-Orange_Ivory Coast', 'PUBLIC'),
  ('61302', '22676', 'MnName', 'PUBLIC'),
  ('61303', '226788', 'Telcel_Burkina Faso', 'PUBLIC'),
  ('61402', '22796', 'MnName', 'PUBLIC'),
  ('61403', '22794', 'NIGER-ATALANTIQUE-TELECOM_NIGER', 'PUBLIC'),
  ('61501', '22804', 'Togo Telecom', 'PUBLIC'),
  ('61603', '22997', 'Spacetel_MTN_Benin', 'PUBLIC'),
  ('61701', '23025', 'Mauritius CELLPLUS', 'PUBLIC'),
  ('61804', '23155', 'Liberia-Comium_Liberia', 'PUBLIC'),
  ('61905', '23277', 'AFRICEL- Lintel (SL) Ltd. Sierra Leone', 'PUBLIC'),
  ('62001', '23324', 'Areeba scancom_GHana', 'PUBLIC'),
  ('62002', '23320', 'Onetouch_ GHana', 'PUBLIC'),
  ('62003', '23327', 'Millicom_ GHana', 'PUBLIC'),
  ('62120', '234802', 'Vmobile_Nigeria', 'PUBLIC'),
  ('62130', '234803', 'MTN_Nigeria', 'PUBLIC'),
  ('62160', '234809', 'MnName', 'PUBLIC'),
  ('62201', '2356', 'Tchad-Zain-Celtel-Tchad', 'PUBLIC'),
  ('62203', '2359', 'MIC_Tchad', 'PUBLIC'),
  ('62401', '23767', 'MTN_Cameroun', 'PUBLIC'),
  ('62402', '23769', '0range_Cameroun', 'PUBLIC'),
  ('62502', '23891', 'MnName', 'PUBLIC'),
  ('62701', '2402', 'MnName', 'PUBLIC'),
  ('62703', '24055', 'MnName', 'PUBLIC'),
  ('62803', '24107', 'GA-GABON-Celtel_Gabon', 'PUBLIC'),
  ('62901', '24205', 'MnName', 'PUBLIC'),
  ('62907', '24204', 'MnName', 'PUBLIC'),
  ('63001', '24381', 'DRC-Vodacom_Congo', 'PUBLIC'),
  ('63086', '24384', 'Orange_DRC', 'PUBLIC'),
  ('63089', '24389', 'Orange_DRC', 'PUBLIC'),
  ('63102', '24492', 'Unitel_Angola', 'PUBLIC'),
  ('63202', '24596', 'MTN_Guinea', 'PUBLIC'),
  ('63310', '24827', 'MnName', 'PUBLIC'),
  ('63401', '24991', 'Sudan-Mobitel-ZAIN-SD_Sudan', 'PUBLIC'),
  ('63402', '24992', 'Areeba-Bashair_Sudan', 'PUBLIC'),
  ('63510', '25078', 'MTN-Rwanda_RWANDA', 'PUBLIC'),
  ('63601', '25191', 'MnName', 'PUBLIC'),
  ('63801', '25377', 'Djibouti Telecom_Djibouti', 'PUBLIC'),
  ('63902', '254722', 'Safaricom_Kenya', 'PUBLIC'),
  ('63907', '254770', 'MnName', 'PUBLIC'),
  ('64002', '25571', 'MIC_Tanzania-Ltd_Tanzania', 'PUBLIC'),
  ('64004', '25575', 'MnName', 'PUBLIC'),
  ('64005', '25578', 'Celtel Tanzania', 'PUBLIC'),
  ('64008', '25579', 'MnName', 'PUBLIC'),
  ('64101', '25675', 'Uganda-Celtel_Uganda', 'PUBLIC'),
  ('64118', '25674', 'MnName', 'PUBLIC'),
  ('64207', '25775', 'MnName', 'PUBLIC'),
  ('64304', '25884', 'vodacom_Mozambique', 'PUBLIC'),
  ('64501', '26097', 'MnName', 'PUBLIC'),
  ('64601', '26133', 'Madacom_Madagascar', 'PUBLIC'),
  ('64602', '26132', 'Orange_Madagascar', 'PUBLIC'),
  ('64803', '26373', 'MnName', 'PUBLIC'),
  ('64901', '26481', 'NAMIBIA-MTC_Namibia', 'PUBLIC'),
  ('65001', '26588', 'Malawi Telekom Networks_Malawi', 'PUBLIC'),
  ('65101', '2665', 'MnName', 'PUBLIC'),
  ('65102', '2666', 'MnName', 'PUBLIC'),
  ('65201', '26771', 'Mascom Botswana', 'PUBLIC'),
  ('65202', '26772', 'MnName', 'PUBLIC'),
  ('65310', '26876', 'MnName', 'PUBLIC'),
  ('65501', '2782', 'South Africa VODACOM', 'PUBLIC'),
  ('65507', '2784', 'Cell_c_South Africa', 'PUBLIC'),
  ('65510', '2783', 'South Africa MTN', 'PUBLIC'),
  ('65902', '21192', 'MnName', 'PUBLIC'),
  ('70401', '502530', 'SECOM -CLARO_ Guatemala', 'PUBLIC'),
  ('70601', '503786', 'MnName', 'PUBLIC'),
  ('70602', '503776', 'Digicel El Salvador', 'PUBLIC'),
  ('70603', '50387', 'Telemovil_Salvador', 'PUBLIC'),
  ('71021', '50585', 'MnName', 'PUBLIC'),
  ('71073', '50585', 'MnName', 'PUBLIC'),
  ('71201', '506300', 'MnName', 'PUBLIC'),
  ('71203', '5067000', 'Claro Costa Rica', 'PUBLIC'),
  ('71401', '50769', 'panama_cable-wireless_panama', 'PUBLIC'),
  ('71404', '50760', 'DIGICEL PANAMA', 'PUBLIC'),
  ('71606', '511955', 'Telef¨®nica del Peru', 'PUBLIC'),
  ('71610', '51997', 'Peru-TIM_Peru', 'PUBLIC'),
  ('72207', '5407', 'Telefonica Agrentine', 'PUBLIC'),
  ('722310', '54320', 'CTI movil_Argentina', 'PUBLIC'),
  ('72402', '55002', 'MnName', 'PUBLIC'),
  ('72403', '55003', 'MnName', 'PUBLIC'),
  ('72404', '55004', 'MnName', 'PUBLIC'),
  ('72405', '55005', 'MnName', 'PUBLIC'),
  ('72406', '55006', 'Vivo_Brasil_2', 'PUBLIC'),
  ('72410', '55010', 'Vivo_Brasil', 'PUBLIC'),
  ('72411', '55011', 'Vivo_Brasil_3', 'PUBLIC'),
  ('72423', '55023', 'Vivo_Brasil_4', 'PUBLIC'),
  ('73002', '56916', 'Telefónica Movil de Chile S.A', 'PUBLIC'),
  ('73003', '56920', 'Claro_CHILE', 'PUBLIC'),
  ('73007', '56983', 'Telef¨®nica Movil de Chile S.A', 'PUBLIC'),
  ('732123', '57316', 'MnName', 'PUBLIC'),
  ('73402', '58412', 'MnName', 'PUBLIC'),
  ('73801', '59266', 'Digicel Guyana Inc', 'PUBLIC'),
  ('74001', '593994', 'Conecel S.A_Ecouador', 'PUBLIC'),
  ('74402', '595991', 'CTI movil_Paraguay', 'PUBLIC'),
  ('74603', '59781', 'MnName', 'PUBLIC'),
  ('74801', '59899', 'Uruguay-ANTEL_Uruguay', 'PUBLIC'),
  ('74807', '59894', 'MOVISTAR Uruguay', 'PUBLIC'),
  ('74810', '59896', 'cti movil_Uruguay', 'PUBLIC'),
  ('90105', '88216', 'MnName', 'PUBLIC'),
  ('90128', '88239', 'Malta_Vodafone_M2M', 'PUBLIC'),
  ('90131', '883130', 'France TELECOM', 'PUBLIC'),
  ('90140', '88228', 'Telekom Deutschland Global SIM', 'PUBLIC');
  
CREATE TABLE IF NOT EXISTS mss_imsi_analysis
 (id INT AUTO_INCREMENT PRIMARY KEY,
  node_name VARCHAR(50),
   imsi_series VARCHAR(20),
    m_value VARCHAR(20),
     na_value VARCHAR(20), 
     anres_value VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
       CREATE TABLE IF NOT EXISTS mss_bnumber_analysis
        (id INT AUTO_INCREMENT PRIMARY KEY,
         node_name VARCHAR(50),
          b_number VARCHAR(20), 
          miscell VARCHAR(20),
           f_n VARCHAR(10), 
           route VARCHAR(50), 
           charge_l VARCHAR(20), 
           a_value VARCHAR(20),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP); 
            CREATE TABLE IF NOT EXISTS mss_gt_series
             (id INT AUTO_INCREMENT PRIMARY KEY,
              node_name VARCHAR(50),
               tt VARCHAR(10), 
               np VARCHAR(10), 
               na VARCHAR(10), 
               ns VARCHAR(50), 
               gtrc VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);

DROP TABLE IF EXISTS `Adresse_IP`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Adresse_IP` (
  `id` int NOT NULL AUTO_INCREMENT,
  `configuration_ir21_id` int DEFAULT NULL,
  `ip_address` varchar(45) NOT NULL,
  `type_ip` enum('IPv4','IPv6') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `configuration_ir21_id` (`configuration_ir21_id`),
  CONSTRAINT `adresse_ip_ibfk_1` FOREIGN KEY (`configuration_ir21_id`) REFERENCES `Configuration_IR21` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Adresse_IP`
--

LOCK TABLES `Adresse_IP` WRITE;
/*!40000 ALTER TABLE `Adresse_IP` DISABLE KEYS */;
INSERT INTO `Adresse_IP` VALUES (1,1,'192.168.10.1','IPv4'),(2,2,'2001:db8::1','IPv6');
/*!40000 ALTER TABLE `Adresse_IP` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Alerte`
--

DROP TABLE IF EXISTS `Alerte`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Alerte` (
  `id` int NOT NULL AUTO_INCREMENT,
  `operateur_id` int NOT NULL,
  `type` enum('critical','warning','info') NOT NULL,
  `message` text NOT NULL,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `operateur_id` (`operateur_id`),
  CONSTRAINT `alerte_ibfk_1` FOREIGN KEY (`operateur_id`) REFERENCES `Operateur` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Alerte`
--

LOCK TABLES `Alerte` WRITE;
/*!40000 ALTER TABLE `Alerte` DISABLE KEYS */;
INSERT INTO `Alerte` VALUES (1,1,'critical','Problème de signalement sur le réseau Mobilis.','2025-04-05 08:07:14'),(2,2,'warning','Diminution des performances du réseau Orange France.','2025-04-05 08:07:14'),(3,5,'critical','Incident majeur détecté chez Telekom Deutschland.','2025-04-05 08:07:14'),(4,6,'info','Maintenance planifiée sur le réseau Swisscom.','2025-04-05 08:07:14'),(5,7,'critical','Défaillance du routage des appels internationaux.','2025-04-05 08:07:14');
/*!40000 ALTER TABLE `Alerte` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `alerts`
--

DROP TABLE IF EXISTS `alerts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alerts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `message` text NOT NULL,
  `severity` varchar(50) DEFAULT 'Faible',
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alerts`
--

LOCK TABLES `alerts` WRITE;
/*!40000 ALTER TABLE `alerts` DISABLE KEYS */;
/*!40000 ALTER TABLE `alerts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `APN`
--

DROP TABLE IF EXISTS `APN`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `APN` (
  `id` int NOT NULL AUTO_INCREMENT,
  `configuration_ir21_id` int DEFAULT NULL,
  `nom_apn` varchar(50) NOT NULL,
  `type_service` enum('Internet','MMS','VoLTE') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `configuration_ir21_id` (`configuration_ir21_id`),
  CONSTRAINT `apn_ibfk_1` FOREIGN KEY (`configuration_ir21_id`) REFERENCES `Configuration_IR21` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `APN`
--

LOCK TABLES `APN` WRITE;
/*!40000 ALTER TABLE `APN` DISABLE KEYS */;
INSERT INTO `APN` VALUES (1,1,'internet.mobilis.dz','Internet'),(2,2,'orange.fr','Internet');
/*!40000 ALTER TABLE `APN` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Audit`
--

DROP TABLE IF EXISTS `Audit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Audit` (
  `id` int NOT NULL AUTO_INCREMENT,
  `configuration_ir21_id` int DEFAULT NULL,
  `configuration_reelle_id` int DEFAULT NULL,
  `date_audit` date NOT NULL,
  `resultat` enum('OK','Erreur') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `configuration_ir21_id` (`configuration_ir21_id`),
  KEY `configuration_reelle_id` (`configuration_reelle_id`),
  CONSTRAINT `audit_ibfk_1` FOREIGN KEY (`configuration_ir21_id`) REFERENCES `Configuration_IR21` (`id`) ON DELETE CASCADE,
  CONSTRAINT `audit_ibfk_2` FOREIGN KEY (`configuration_reelle_id`) REFERENCES `Configuration_Reelle` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Audit`
--

LOCK TABLES `Audit` WRITE;
/*!40000 ALTER TABLE `Audit` DISABLE KEYS */;
INSERT INTO `Audit` VALUES (1,1,1,'2024-02-10','Erreur'),(2,2,2,'2024-02-12','OK'),(3,1,1,'2025-04-04','Erreur');
/*!40000 ALTER TABLE `Audit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audits`
--

DROP TABLE IF EXISTS `audits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audits` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  `operateur` varchar(255) NOT NULL,
  `status` varchar(50) DEFAULT 'En cours',
  `erreurs` int DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audits`
--

LOCK TABLES `audits` WRITE;
/*!40000 ALTER TABLE `audits` DISABLE KEYS */;
INSERT INTO `audits` VALUES (1,'2025-04-05 18:16:25','Orange','Terminé',2);
/*!40000 ALTER TABLE `audits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Configuration_IR21`
--

DROP TABLE IF EXISTS `Configuration_IR21`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Configuration_IR21` (
  `id` int NOT NULL AUTO_INCREMENT,
  `operateur_id` int DEFAULT NULL,
  `date_reception` date NOT NULL,
  `version` varchar(10) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `operateur_id` (`operateur_id`),
  CONSTRAINT `configuration_ir21_ibfk_1` FOREIGN KEY (`operateur_id`) REFERENCES `Operateur` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Configuration_IR21`
--

LOCK TABLES `Configuration_IR21` WRITE;
/*!40000 ALTER TABLE `Configuration_IR21` DISABLE KEYS */;
INSERT INTO `Configuration_IR21` VALUES (1,1,'2024-01-10','v1.0'),(2,2,'2024-01-15','v1.0');
/*!40000 ALTER TABLE `Configuration_IR21` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Configuration_Reelle`
--

DROP TABLE IF EXISTS `Configuration_Reelle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Configuration_Reelle` (
  `id` int NOT NULL AUTO_INCREMENT,
  `operateur_id` int DEFAULT NULL,
  `date_derniere_mise_a_jour` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `operateur_id` (`operateur_id`),
  CONSTRAINT `configuration_reelle_ibfk_1` FOREIGN KEY (`operateur_id`) REFERENCES `Operateur` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Configuration_Reelle`
--

LOCK TABLES `Configuration_Reelle` WRITE;
/*!40000 ALTER TABLE `Configuration_Reelle` DISABLE KEYS */;
INSERT INTO `Configuration_Reelle` VALUES (1,1,'2024-02-01'),(2,2,'2024-02-05');
/*!40000 ALTER TABLE `Configuration_Reelle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Contact_Technique`
--

DROP TABLE IF EXISTS `Contact_Technique`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Contact_Technique` (
  `id` int NOT NULL AUTO_INCREMENT,
  `operateur_id` int DEFAULT NULL,
  `nom` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `telephone` varchar(20) NOT NULL,
  `role` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `operateur_id` (`operateur_id`),
  CONSTRAINT `contact_technique_ibfk_1` FOREIGN KEY (`operateur_id`) REFERENCES `Operateur` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Contact_Technique`
--

LOCK TABLES `Contact_Technique` WRITE;
/*!40000 ALTER TABLE `Contact_Technique` DISABLE KEYS */;
INSERT INTO `Contact_Technique` VALUES (1,1,'Ahmed Benali','ahmed.benali@mobilis.dz','+213550000000','Responsable Roaming'),(2,2,'Claire Dupont','claire.dupont@orange.fr','+33600000000','Ingénieur Core Network');
/*!40000 ALTER TABLE `Contact_Technique` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contacts`
--

DROP TABLE IF EXISTS `contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contacts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contacts`
--

LOCK TABLES `contacts` WRITE;
/*!40000 ALTER TABLE `contacts` DISABLE KEYS */;
INSERT INTO `contacts` VALUES (1,'Alice','alice@example.com','Bonjour, ceci est un test.','2025-03-22 04:50:36'),(2,'John Doe','john@example.com','Ceci est un test.','2025-03-22 05:24:45'),(3,'John Doe','john@example.com','Ceci est un test.','2025-03-22 05:31:14'),(4,'dfghj','ouafiazaoual@gmail.com','asdfghj','2025-03-22 11:18:17'),(5,'Test','test@example.com','Hello','2025-03-22 11:19:46'),(6,'khas','nedjmeddine@gmail.com','awzsexdrcftvgybhu','2025-03-22 18:46:31'),(7,'nedjmeddine','sayah@gmail.com','awesdrftgyh','2025-03-22 19:18:29'),(8,'aya','ayah@gmail.com','zsdxfcgvhbjn','2025-03-22 19:19:07'),(9,'nedjmeddine','sayah@gmail.com','awesdrftgyh','2025-03-22 19:21:33'),(10,'aya','ayah@gmail.com','zsdxfcgvhbjn','2025-03-22 19:29:42'),(11,'nedjmeddine','sayah@gmail.com','awesdrftgyh','2025-03-22 19:31:56'),(12,'khaf','sadfdg@gmail.com','`awzsexdcfvgbhjnkm','2025-03-22 19:34:39'),(13,'khaf','sadfdg@gmail.com','`awzsexdcfvgbhjnkm','2025-03-22 21:09:52'),(14,'ff','dd@gmail.com','cc','2025-03-29 10:37:44'),(15,'Test','test@test.com','Ceci est un test','2025-03-30 16:04:12'),(16,'f','asdfghj@gmail.com','derftgyhujiko','2025-03-30 16:33:55'),(17,'xcvbn','zxcvbnm@gmail.com','ertyjhgfd','2025-03-30 17:47:13'),(18,'dd','dd@gmail.com','ertyui','2025-03-30 18:21:37'),(19,'asdfgh','asfg@gmail.com','sedrftgyhujimko','2025-03-30 19:15:44'),(20,'dfghjkl;','xcvbnm@gmail.com','dxcfvgbhjn','2025-03-30 19:44:55'),(21,'sdfghjkl','sdfghjklkjhgfdcvbnm@gmail.com','mnbvcxlkjhgfdoiuytr','2025-03-30 20:11:08'),(22,'rr','rr@gmail.com','sdfghj','2025-03-31 18:08:10'),(23,'jsdf','sssss@gmail.com','eeeeee','2025-04-02 09:15:13'),(24,'as3w4ed5rf6tg7hyopl','zesxdrcftvgybhunijmkl@gmail.com','sdrctfvgbhnjkmlmjnhbgvftcdrxsedcvfybguhnijmoknjhbugyftdrserctvybunm,kmjnihbug\n','2025-04-02 10:18:23'),(25,'as3w4ed5rf6tg7hyopl','zesxdrcftvgybhunijmkl@gmail.com','sdrctfvgbhnjkmlmjnhbgvftcdrxsedcvfybguhnijmoknjhbugyftdrserctvybunm,kmjnihbug\n','2025-04-02 10:21:19'),(26,'as3w4ed5rf6tg7hyopl','zesxdrcftvgybhunijmkl@gmail.com','sdrctfvgbhnjkmlmjnhbgvftcdrxsedcvfybguhnijmoknjhbugyftdrserctvybunm,kmjnihbug\n','2025-04-02 10:21:20'),(27,'as3w4ed5rf6tg7hyopl','zesxdrcftvgybhunijmkl@gmail.com','sdrctfvgbhnjkmlmjnhbgvftcdrxsedcvfybguhnijmoknjhbugyftdrserctvybunm,kmjnihbug\n','2025-04-02 10:22:38'),(28,'asdfghjk','awzsexdrcftvygbhunj@gmail.com','sedrftgyhuji','2025-04-02 10:22:53'),(29,'eeee','ss@gmail.com','ddddd','2025-04-02 10:27:44'),(30,'eeee','ss@gmail.com','ddddd','2025-04-02 10:33:07'),(31,'eeee','ss@gmail.com','ddddd','2025-04-02 10:33:08'),(32,'eeee','ss@gmail.com','ddddd','2025-04-02 10:34:06'),(33,'eeee','ss@gmail.com','ddddd','2025-04-02 10:34:08'),(34,'eeee','ss@gmail.com','ddddd','2025-04-02 10:34:08'),(35,'eeee','ss@gmail.com','ddddd','2025-04-02 10:34:08'),(36,'eeee','ss@gmail.com','ddddd','2025-04-02 12:45:08'),(37,'eeee','ss@gmail.com','ddddd','2025-04-02 12:45:09'),(38,'eeee','ss@gmail.com','ddddd','2025-04-02 12:47:37'),(39,'eeee','ss@gmail.com','ddddd','2025-04-02 12:51:16'),(40,'eeee','ss@gmail.com','ddddd','2025-04-02 12:51:34'),(41,'sdfff','qqqq@gmail.com','awsedrftgyhujik','2025-04-02 19:42:38'),(42,'ww','ww@gmail.com','ww','2025-04-03 06:49:53'),(43,'mnbvc','mnbvc@gmail.com','sdfghjkl','2025-04-03 12:04:58'),(44,'s','s@gmail.com','bbbbb','2025-04-03 18:53:14'),(45,'khadi','asdfghjk@gmail.com','mmmm','2025-04-04 08:12:32'),(46,'kha','kha@gmail.com','zxcvbnm','2025-04-04 08:23:44'),(47,'kha','kha@gmail.com','zxcvbnm','2025-04-04 14:23:09'),(48,'khadidja','saya@gmail.com','qqqq','2025-04-04 14:23:25'),(49,'khadidja','saya@gmail.com','qqqq','2025-04-04 14:23:30'),(50,'sss','sss@gmail.com','eee','2025-04-04 14:25:41'),(51,'sa','ssaa@gmaail.com','dddd','2025-04-05 14:33:15'),(52,'ss','ssss@gmail.com','ccccc','2025-04-05 14:40:38'),(53,'nnn','sdf@gmail.com','xx','2025-04-05 14:51:12'),(54,'sayah','sayah@gmail.com','eeeeeee','2025-04-08 19:10:00'),(55,'sss','ss@gmail.com','dddd','2025-04-13 10:00:55');
/*!40000 ALTER TABLE `contacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Erreur`
--

DROP TABLE IF EXISTS `Erreur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Erreur` (
  `id` int NOT NULL AUTO_INCREMENT,
  `audit_id` int DEFAULT NULL,
  `description` text NOT NULL,
  `statut` enum('Non corrigée','corrigée','En cours') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `audit_id` (`audit_id`),
  CONSTRAINT `erreur_ibfk_1` FOREIGN KEY (`audit_id`) REFERENCES `Audit` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Erreur`
--

LOCK TABLES `Erreur` WRITE;
/*!40000 ALTER TABLE `Erreur` DISABLE KEYS */;
INSERT INTO `Erreur` VALUES (1,1,'Problème de correspondance IMSI détecté','Non corrigée'),(4,2,'Problème de configuration détecté','En cours'),(5,3,'Problème de correspondance IMSI détecté','Non corrigée');
/*!40000 ALTER TABLE `Erreur` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `errors`
--

DROP TABLE IF EXISTS `errors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `errors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` text NOT NULL,
  `status` varchar(50) DEFAULT 'Non corrigée',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `errors`
--

LOCK TABLES `errors` WRITE;
/*!40000 ALTER TABLE `errors` DISABLE KEYS */;
/*!40000 ALTER TABLE `errors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Global_Title`
--

DROP TABLE IF EXISTS `Global_Title`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Global_Title` (
  `id` int NOT NULL AUTO_INCREMENT,
  `configuration_ir21_id` int DEFAULT NULL,
  `gt_number` varchar(30) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `configuration_ir21_id` (`configuration_ir21_id`),
  CONSTRAINT `global_title_ibfk_1` FOREIGN KEY (`configuration_ir21_id`) REFERENCES `Configuration_IR21` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Global_Title`
--

LOCK TABLES `Global_Title` WRITE;
/*!40000 ALTER TABLE `Global_Title` DISABLE KEYS */;
INSERT INTO `Global_Title` VALUES (1,1,'88213000123456'),(2,2,'88233000987654');
/*!40000 ALTER TABLE `Global_Title` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `GRX_IPX`
--

DROP TABLE IF EXISTS `GRX_IPX`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `GRX_IPX` (
  `id` int NOT NULL AUTO_INCREMENT,
  `configuration_ir21_id` int DEFAULT NULL,
  `grx_ip` varchar(45) NOT NULL,
  `provider` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `configuration_ir21_id` (`configuration_ir21_id`),
  CONSTRAINT `grx_ipx_ibfk_1` FOREIGN KEY (`configuration_ir21_id`) REFERENCES `Configuration_IR21` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `GRX_IPX`
--

LOCK TABLES `GRX_IPX` WRITE;
/*!40000 ALTER TABLE `GRX_IPX` DISABLE KEYS */;
INSERT INTO `GRX_IPX` VALUES (1,1,'10.20.30.40','Tata Communications'),(2,2,'10.10.10.10','Orange International Carriers');
/*!40000 ALTER TABLE `GRX_IPX` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `IMSI`
--

DROP TABLE IF EXISTS `IMSI`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `IMSI` (
  `id` int NOT NULL AUTO_INCREMENT,
  `configuration_ir21_id` int DEFAULT NULL,
  `plage_imsi` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `configuration_ir21_id` (`configuration_ir21_id`),
  CONSTRAINT `imsi_ibfk_1` FOREIGN KEY (`configuration_ir21_id`) REFERENCES `Configuration_IR21` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `IMSI`
--

LOCK TABLES `IMSI` WRITE;
/*!40000 ALTER TABLE `IMSI` DISABLE KEYS */;
INSERT INTO `IMSI` VALUES (1,1,'603010000000000 - 603019999999999'),(2,2,'208010000000000 - 208019999999999');
/*!40000 ALTER TABLE `IMSI` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `IMSIGT`
--

DROP TABLE IF EXISTS `IMSIGT`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `IMSIGT` (
  `id` int NOT NULL AUTO_INCREMENT,
  `IMSI_PREFIX` varchar(10) NOT NULL,
  `MSISDN_PREFIX` varchar(20) NOT NULL,
  `MOBILE_NETWORK_NAME` varchar(100) NOT NULL,
  `MANAGED_OBJECT_GROUP` varchar(50) NOT NULL,
  `CREATED_AT` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_IMSI_PREFIX` (`IMSI_PREFIX`),
  KEY `idx_MSISDN_PREFIX` (`MSISDN_PREFIX`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `IMSIGT`
--

LOCK TABLES `IMSIGT` WRITE;
/*!40000 ALTER TABLE `IMSIGT` DISABLE KEYS */;
/*!40000 ALTER TABLE `IMSIGT` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `MSRN`
--

DROP TABLE IF EXISTS `MSRN`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MSRN` (
  `id` int NOT NULL AUTO_INCREMENT,
  `configuration_ir21_id` int DEFAULT NULL,
  `numero_msrn` varchar(30) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `configuration_ir21_id` (`configuration_ir21_id`),
  CONSTRAINT `msrn_ibfk_1` FOREIGN KEY (`configuration_ir21_id`) REFERENCES `Configuration_IR21` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MSRN`
--

LOCK TABLES `MSRN` WRITE;
/*!40000 ALTER TABLE `MSRN` DISABLE KEYS */;
INSERT INTO `MSRN` VALUES (1,1,'+213660123456'),(2,2,'+33689123456');
/*!40000 ALTER TABLE `MSRN` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mss_analyse`
--

DROP TABLE IF EXISTS `mss_analyse`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mss_analyse` (
  `id` int NOT NULL AUTO_INCREMENT,
  `IMSIS` varchar(10) NOT NULL,
  `M` varchar(20) NOT NULL,
  `NA` int NOT NULL,
  `ANRES` varchar(50) NOT NULL,
  `CREATED_AT` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_IMSIS` (`IMSIS`),
  KEY `idx_M` (`M`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mss_analyse`
--

LOCK TABLES `mss_analyse` WRITE;
/*!40000 ALTER TABLE `mss_analyse` DISABLE KEYS */;
/*!40000 ALTER TABLE `mss_analyse` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `network_nodes`
--

DROP TABLE IF EXISTS `network_nodes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `network_nodes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `node_name` varchar(100) DEFAULT NULL,
  `node_type` enum('MSC','MSS','HLR','SGSN','MME','Firewall','GGSN','STP','DRA') DEFAULT NULL,
  `vendor` enum('Ericsson','Huawei','Cisco','Nokia','Other') DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `gt` varchar(50) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `network_nodes`
--

LOCK TABLES `network_nodes` WRITE;
/*!40000 ALTER TABLE `network_nodes` DISABLE KEYS */;
INSERT INTO `network_nodes` VALUES (1,'BCORN1','MSS','Ericsson',NULL,NULL,NULL,1),(2,'BCMUS1','MSS','Ericsson',NULL,NULL,NULL,1),(3,'BCCNM1','MSS','Ericsson',NULL,NULL,NULL,1),(4,'BCCNE1','MSS','Ericsson',NULL,NULL,NULL,1),(5,'BCBMR1','MSS','Ericsson',NULL,NULL,NULL,1),(6,'BCANA1','MSS','Ericsson',NULL,NULL,NULL,1),(7,'MSSBCH','MSS','Huawei',NULL,NULL,NULL,1),(8,'MSSBTN','MSS','Huawei',NULL,NULL,NULL,1),(9,'MSSOUR','MSS','Huawei',NULL,NULL,NULL,1),(10,'ANB','SGSN','Huawei',NULL,NULL,NULL,1),(11,'CONST','SGSN','Huawei',NULL,NULL,NULL,1),(12,'BMR','SGSN','Huawei',NULL,NULL,NULL,1),(13,'OUAGLA','SGSN','Huawei',NULL,NULL,NULL,1),(14,'MEBECH','SGSN','Ericsson',NULL,NULL,NULL,1),(15,'MEMUST','SGSN','Ericsson',NULL,NULL,NULL,1),(16,'MEOARAN','SGSN','Ericsson',NULL,NULL,NULL,1),(17,'HRFECNEA1','HLR','Ericsson',NULL,NULL,NULL,1),(18,'HRFEBMR1','HLR','Ericsson',NULL,NULL,NULL,1),(19,'HRFEORNI1','HLR','Ericsson',NULL,NULL,NULL,1),(20,'STPBCH','STP','Ericsson',NULL,NULL,NULL,1),(21,'STPBMR','STP','Ericsson',NULL,NULL,NULL,1),(22,'STPCNE','STP','Ericsson',NULL,NULL,NULL,1),(23,'STPMUS','STP','Ericsson',NULL,NULL,NULL,1),(24,'STPORN','STP','Ericsson',NULL,NULL,NULL,1),(25,'STPOUG','STP','Ericsson',NULL,NULL,NULL,1),(26,'MSCBMR1','MSC','Ericsson',NULL,NULL,NULL,1),(27,'MSCMUS1','MSC','Ericsson',NULL,NULL,NULL,1),(28,'MUSGiFW01','Firewall','Cisco',NULL,NULL,NULL,1);
/*!40000 ALTER TABLE `network_nodes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `network_stats`
--

DROP TABLE IF EXISTS `network_stats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `network_stats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `availability` decimal(5,2) DEFAULT '98.50',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `network_stats`
--

LOCK TABLES `network_stats` WRITE;
/*!40000 ALTER TABLE `network_stats` DISABLE KEYS */;
/*!40000 ALTER TABLE `network_stats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Operateur`
--

DROP TABLE IF EXISTS `Operateur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Operateur` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `code_tadig` varchar(10) NOT NULL,
  `mcc` int NOT NULL,
  `mnc` int NOT NULL,
  `pays` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code_tadig` (`code_tadig`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Operateur`
--

LOCK TABLES `Operateur` WRITE;
/*!40000 ALTER TABLE `Operateur` DISABLE KEYS */;
INSERT INTO `Operateur` VALUES (1,'Mobilis','DZALG',603,1,'Algérie'),(2,'Orange France','FRORG',208,1,'France'),(3,'Orange UK','GBROR',234,33,'United Kingdom'),(4,'Telekom Deutschland','DEDTM',262,1,'Germany'),(5,'Swisscom','CHSWI',228,1,'Switzerland'),(6,'Telecom Italia Mobile','ITTMN',222,1,'Italy'),(7,'Vodafone Germany','DEVOD',262,2,'Germany'),(8,'AT&T USA','USATT',310,410,'United States');
/*!40000 ALTER TABLE `Operateur` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partners`
--

DROP TABLE IF EXISTS `partners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `partners` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `status` varchar(50) DEFAULT 'Actif',
  `country_code` varchar(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partners`
--

LOCK TABLES `partners` WRITE;
/*!40000 ALTER TABLE `partners` DISABLE KEYS */;
/*!40000 ALTER TABLE `partners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `password_reset_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roaming_data`
--

DROP TABLE IF EXISTS `roaming_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roaming_data` (
  `id` int NOT NULL AUTO_INCREMENT,
  `country` varchar(100) NOT NULL,
  `operator` varchar(100) NOT NULL,
  `plmn` varchar(10) NOT NULL,
  `gsm` varchar(20) DEFAULT NULL,
  `camel` varchar(20) DEFAULT NULL,
  `gprs` varchar(20) DEFAULT NULL,
  `g3` varchar(20) DEFAULT NULL,
  `g4_lte` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roaming_data`
--

LOCK TABLES `roaming_data` WRITE;
/*!40000 ALTER TABLE `roaming_data` DISABLE KEYS */;
/*!40000 ALTER TABLE `roaming_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Roaming_Event`
--

DROP TABLE IF EXISTS `Roaming_Event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Roaming_Event` (
  `id` int NOT NULL AUTO_INCREMENT,
  `operateur_id` int NOT NULL,
  `roamers` int NOT NULL,
  `latitude` decimal(9,6) NOT NULL,
  `longitude` decimal(9,6) NOT NULL,
  `event_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `operateur_id` (`operateur_id`),
  CONSTRAINT `roaming_event_ibfk_1` FOREIGN KEY (`operateur_id`) REFERENCES `Operateur` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Roaming_Event`
--

LOCK TABLES `Roaming_Event` WRITE;
/*!40000 ALTER TABLE `Roaming_Event` DISABLE KEYS */;
INSERT INTO `Roaming_Event` VALUES (12,5,100,52.520000,13.405000,'2025-04-05 08:06:18'),(13,6,75,46.948000,7.447400,'2025-04-05 08:06:18'),(14,7,120,41.902800,12.496400,'2025-04-05 08:06:18'),(15,8,90,52.520000,13.405000,'2025-04-05 08:06:18');
/*!40000 ALTER TABLE `Roaming_Event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roaming_events`
--

DROP TABLE IF EXISTS `roaming_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roaming_events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` text NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roaming_events`
--

LOCK TABLES `roaming_events` WRITE;
/*!40000 ALTER TABLE `roaming_events` DISABLE KEYS */;
/*!40000 ALTER TABLE `roaming_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roaming_partners`
--

DROP TABLE IF EXISTS `roaming_partners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roaming_partners` (
  `id` int NOT NULL AUTO_INCREMENT,
  `imsi_prefix` varchar(255) DEFAULT NULL,
  `gt` varchar(255) DEFAULT NULL,
  `operateur` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=340 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roaming_partners`
--

LOCK TABLES `roaming_partners` WRITE;
/*!40000 ALTER TABLE `roaming_partners` DISABLE KEYS */;
INSERT INTO `roaming_partners` VALUES (1,'20201','3097','cosmote_greece'),(2,'202050','30694','Vodafone_Greece'),(3,'20210','30693','Wind_Hellas_Greece'),(4,'20214','30685','Vodafone_Greece'),(5,'20404','31654','Vodafone_Netherlands'),(6,'20408','31653','KPN_Netherlands'),(7,'20412','31626','Telfort_Netherlands'),(8,'204162443766381','31624','T-Mobile_Netherlands'),(9,'204201000211900','31628','T-Mobile_Netherlands'),(10,'20601','32475','Belgacom_BELGIUM'),(11,'206050004526678','32468','Telenet_Belgium'),(12,'20610','32495','Mobistar_BELGIUM'),(13,'20620','32486','Base_BELGIUM'),(14,'20801100010','33689','Orange_France'),(15,'20809','33611','SFR_France'),(16,'20810','33609','SFR_France'),(17,'20815','33695','Free_Mobile_FRANCE'),(18,'20820','33660','Bouygues_Telecom_France'),(19,'21401','34607','Vodafone_Spain'),(20,'214030','34656','Orange_Spain'),(21,'21405','34648','Telefonica_Spain_ESPT2'),(22,'21407','34609','Telefonica_Spain'),(23,'21630','3630','Hungary_Telekom'),(24,'21670','3670','Vodafone_Hungary'),(25,'21803','38763','Croatian_Telecom'),(26,'21901','38598','Telecom_Croatian'),(27,'21902','38595','TELE_2_CROATIA'),(28,'22001','38163','Mobtel_Serbia'),(29,'22003','38164','Telekom_Serbia'),(30,'22201','39339','TIM_ITALY'),(31,'22210','39349','Vodafone_Omnitel_ITALY'),(32,'22601','40722','Vodafone_Romania'),(33,'22603','4076','Telekom-Mobile_Romania'),(34,'22801','4179','Swisscom_Switzerland'),(35,'22803','4178','Orange_Switzerland'),(36,'23001','420603','T-Mobile_Czech-Republic'),(37,'23002','420602','Czech_Republic'),(38,'23003','420608','Vodafone_Czeech'),(39,'23101','421905','Orange_SLOVAKIA'),(40,'231020105243123','421903','T-Mobile_slovakia'),(41,'23203','43676','T-Mobile_Austria'),(42,'23207','43650','T-Mobile_Austria'),(43,'23410','447802','UK_TELEFONICA'),(44,'23415','44385','Vodafone_United_Kingdom'),(45,'23430','447953','T-Mobile_UK'),(46,'23450','447797','Telekom_Jersey'),(47,'23455','447781','Sure_Limited_Guernsey'),(48,'23801','45401','TDC_Denmark'),(49,'238201001789892','4528','TELIA_DANMARK'),(50,'24007','46707','Tele2_Sweeden'),(51,'24010','46765','Lycamobile_Sweeden'),(52,'24014','4676720','TDC_Sweden'),(53,'24201','47900','Telenor_Norway'),(54,'24208','479451','TDC_Norway'),(55,'24405','35850','Elisa_Finland'),(56,'244144573919427','3584570','NULL'),(57,'244212000908392','358451','Elisa_Finland'),(58,'24701','371292','Latvian_Mobile_Telephone'),(59,'24802','37256','Elisa_Estonia'),(60,'24803','37255','Tele2_Estonia'),(61,'25001','79160','MTS_Russia'),(62,'25002','792','MegaFon_Russia'),(63,'25016','7902557','NTC_Russia'),(64,'25020','790434','TELE2_RUSSIA'),(65,'25099','79037','Vimpelcom_russia'),(66,'25501','38050','MTS_UKraine'),(67,'25503','38067','KyivstarOperator'),(68,'25506','38063','lifecell_Ukraine'),(69,'25702','375297','MTS_Belarus'),(70,'259010103887776','373691','Orange_Moldova'),(71,'259050125057010','37367','Moldtelecom_MOLDOVA'),(72,'260021173107739','48602','T-Mobile_Poland'),(73,'260021372214393','48602','T-Mobile_Polska'),(74,'260032001805073','48501','Orange_Poland'),(75,'26006000','48790','Play_Poland'),(76,'262010','49171','Telekom_Germany'),(77,'26202','49172','Vodafone_Germany'),(78,'26203','49177','Telefonica_Germany'),(79,'26207','49176','Telefonica_Germany'),(80,'26801','35191','Vodafone_Portugal'),(81,'26806','35196','TMN_Portugal'),(82,'27001','352021','POST_Luxembourg'),(83,'27077','352091','Tango_Luxembourg'),(84,'27099','352061','Orange_Luxemburg'),(85,'272010','35387','Vodafone_Ireland'),(86,'272017113370529','90542','Vodafone_Turkey'),(87,'27203','35385','Meteor_Ireland'),(88,'274040299002034','354650','NULL'),(89,'27601','35568','AMC_Albania'),(90,'276020','35569','Vodafone_ALBANIA'),(91,'27801','35694','Vodafone_Malta'),(92,'27821','35679','Mobisle.C.L_Malta'),(93,'28001','35799','ICytamobile_Cyprus_Iran'),(94,'283010000109902','37491','Armentel_Armenia'),(95,'28403','35987','Vivacom_Bulgaria'),(96,'286010','90532','Turkcell_TURKEY'),(97,'28603','90559','Telecom_Turkey'),(98,'28604','90505','Avea_Turkey'),(99,'293411100329353','38641','Telekom_Slovenia'),(100,'297039000133574','38268','Mitel_Montenegro'),(101,'302220','164758','TELUS_Canada'),(102,'302370','151499','Fido_Canada'),(103,'302500','151442','Videotron_Canada'),(104,'302610','190561','Bell_Mobily_Canada'),(105,'302720','170579','Rogers_Canada'),(106,'302780','130652','Saskatel_Canada'),(107,'310150','170450','AT\\&T\\'),(108,'310160','191790','T-MobileUSA'),(109,'310170','120990','AT\\&T\\'),(110,'310200','150351','T-MobileUSA'),(111,'310210','140547','T-MobileUSA'),(112,'310220','140541','T-MobileUSA'),(113,'310230','180185','T-Mobile_USA'),(114,'310240','150545','T-MobileUSA'),(115,'310250','180825','T-MobileUSA'),(116,'310270','133433','T-MobileUSA'),(117,'310310','181326','T-MobileUSA'),(118,'310380','197037','AT\\&T_Mobility'),(119,'310410','131231','AT\\&T_USA'),(120,'310420','151324','CBW_USA'),(121,'310490','170434','T-MobileUSA'),(122,'310580','171720','T-Mobile\\'),(123,'310660','140445','T-Mobile\\'),(124,'310800','164662','T-Mobile\\'),(125,'311270','190370299','Verizon_USA'),(126,'334020','52941','Telecel_Mexico'),(127,'334030','52942','Telefonica_Mexico'),(128,'338050000539871','1876380','Digicel_Group'),(129,'370020019561818','182996','Claro_Dominicana'),(130,'40001','99450','Azecell_Azerbaijan'),(131,'400027010383903','99455','Backcell_Azerbaijan'),(132,'40004','99470','Azerfon_LLC_Azerbaijan'),(133,'401015577806612','7705','Kar-tel_Kazakhstan'),(134,'401018000000109','7057','KAR_TEL_KAZAKHSTAN'),(135,'40402','919815','AIRTEL_Bharti_india_Punjab'),(136,'40403','919816','AIRTEL_Bharti_india_Himachal_Pradesh'),(137,'40405','919825','Vodafone_West_India'),(138,'40410','919810','AIRTEL_Bharti_india_Delhi'),(139,'40411','919811','Vodafone_Essar_Mobile_India'),(140,'40416','919810','Bharti_Airtel'),(141,'40420','919820','VODAFONE_India'),(142,'40421','919821','LoopMobile_India'),(143,'40427','919823','Vodafone_MAHARASHTRA_India'),(144,'40430','919830','VODAFONE_East_India'),(145,'40431','919831','AIRTEL_Bharti_india_Kolkata'),(146,'40440','919840','AIRTEL_Bharti\\'),(147,'40445','919845','AIRTEL_Bharti_india_Karnataka'),(148,'40449','919849','AIRTEL_Bharti_india_Andhra_Pradesh'),(149,'40470','919829','AIRTEL_Bharti_india_Rajasthan'),(150,'40490','919890','AIRTEL_Bharti_india_Maharashtra'),(151,'40492','919892','AIRTEL_Bharti_india_Mumbai'),(152,'40493','919893','AIRTEL_Bharti_india_Madhya_pradesh'),(153,'40494','919894','AIRTEL_Bharti_india_Tamil'),(154,'40495','919895','AIRTEL_Bharti_india_Kerala'),(155,'40496','919896','AIRTEL_Bharti_india_Haryana'),(156,'40497','919897','AIRTEL_Bharti_india_Uttar_Pradesh_West'),(157,'40498','919898','AIRTEL_Bharti_india_Gujar'),(158,'405025','919030','TATA_Docomo_India'),(159,'405027','919031','TATA_Docomo_India'),(160,'405029','917796','TATA_Docomo_India'),(161,'405030','919033','TATA_Docomo_India'),(162,'405031','919034','TATA_Docomo_India'),(163,'405032','918091','TATA_Docomo_India'),(164,'405034','919036','TATA_Docomo_India'),(165,'405035','919037','TATA_Docomo_India'),(166,'405036','919038','TATA_Docomo_India'),(167,'405037','919028','TATA_Docomo_India'),(168,'405038','919039','TATA_Docomo_India'),(169,'405039','919029','TATA_Docomo_India'),(170,'405041','919040','TATA_Docomo_India'),(171,'405042','919041','TATA_Docomo_India'),(172,'405043','917737','TATA_Docomo_India'),(173,'405044','919043','TATA_Docomo_India'),(174,'405045','919044','TATA_Docomo_India'),(175,'405046','919045','TATA_Docomo_India'),(176,'405047','919046','TATA_Docomo_India'),(177,'41004','9231','CMPak_Pakistan'),(178,'41006','92345','Telenor_Pakistan'),(179,'41007','92321','Warid_Tel_Pakistan'),(180,'412012200202902','9370','Afghanistan_Wireless'),(181,'412500219534483','9378','Etisalat_Afghanistan'),(182,'41301','9471','Mobitel_Sirilanka'),(183,'41302','9477','Dialog_SriLanka'),(184,'41405','95997','Ooredoo_Myanmar'),(185,'41501','96134','MIC1_Libanon'),(186,'41503','96139','MIC2_Lebanon'),(187,'41601','96279','Zain_Jordan'),(188,'41603','96278','UMNIAH_JORDAN'),(189,'41677','96277','Orange_Jordan'),(190,'41701','96393','Syriatel_Syria'),(191,'41702','96394','MTN-SYRIA'),(192,'418050001949738','9647701','Asiacell_IRQ'),(193,'41820','9647802','Zain_Iraq'),(194,'41830','96479','Iraqna_Iraq'),(195,'41902','96596','Zain_Kuwait'),(196,'41903','9656','Ooredoo_Kuwait'),(197,'41904','965500','KTC_Viva_Kuwait'),(198,'42001','96650','Aljawal_Saudi'),(199,'42003','96656','Mobily_Saudi'),(200,'4200400','96659','Zain_Saudi'),(201,'42005','966570','SAUVG_KSA'),(202,'42101','96771','Sabafon_Yemen'),(203,'42202','96892','Omantel_Oman'),(204,'42203','96895','Ooredoo_Oman'),(205,'424020','97150','Etisalat_UAE'),(206,'4240300','97155','Du_UAE'),(207,'42506','97256','Wataniya_Oalestine'),(208,'42601','97339','Batelco_Bahrain'),(209,'42602','97336','Zain_Bahrain'),(210,'42604','97333','VIVA_BAHRAIN'),(211,'42701','97455','Qtel_Qatar'),(212,'42702','97477','Vodafone_Qatar'),(213,'42888','97688','UNITEL_MONGOLIE'),(214,'432110100943200','98911','MobileTelecom_IRAN'),(215,'43220','98920','Rightel_IRAN'),(216,'43235','98935','MTN_IRAN'),(217,'43404','99890','UNITEL_UZBAKISTAN'),(218,'43709','99670','NurTelekom_Kyrgyztan'),(219,'44010','8190542','NTT_DOCOMO_JAPAN'),(220,'44050','8180931','KDDI_JAPAN'),(221,'44051','8180984','KDDI_JAPAN_2'),(222,'450081210001404','8210291','KT_KOREA'),(223,'45201','8490','MobiFone_Vietnam'),(224,'45400','852902','CSL_Hongkong'),(225,'45403','852633','Hutchison_Hongkong_3G'),(226,'45404','852949','Hutchison_Hongkong'),(227,'45412','852920','Peoples_HongKong'),(228,'454161103730079','852923','HongKong_Telecom2G'),(229,'454195000450707','852923','Hong-Kong_Telecom3G'),(230,'45501','85368989','CTM_Macau'),(231,'45618','85511','Mfone_Cambodia'),(232,'460000153141128','86139','China_Mobile'),(233,'46001','86130','Unicom_China'),(234,'460020396050120','86138','China_Mobile'),(235,'460077110753652','86157','China_Mobile'),(236,'46009','86186','Unicom_China'),(237,'46689','886986','starTelecom_Taiwan'),(238,'47002','88018','Robi_Bangladesh'),(239,'470070030023637','88016','Airtel_Bengladech'),(240,'47202','96096','Ooredoo_Maldives'),(241,'50212','6012','Maxis_Malaysia'),(242,'50218','6018','uMobile-Malysia'),(243,'50503','61415','Vodafone_Australia'),(244,'51001','62816','Indosat_Indonesia'),(245,'51010','62811','TELKOMSELINDONESI'),(246,'514010073640010','67073','Telkomcel_Timor'),(247,'51502','63917','Globe_Telecom_Philippines'),(248,'51503','63918','SMART_PHILLIPINES'),(249,'52000','66830','True-Move_Thailand'),(250,'520044000035700','66938','True-Move_Thailand'),(251,'52005','66950','DTAC_Thailand'),(252,'52503','659','MobileOneLtd_Singapore'),(253,'52811','67387','DST_Brunei'),(254,'53001','6421','Vodafone_NewZealand'),(255,'53024','6422','Two-Degrees_NewZealand'),(256,'547200105044497','68987','Vini-French_Polenysia'),(257,'60201','2012','Mobinil_EGYPT'),(258,'60202','2010','Vodafone_Egypt'),(259,'6020300','2011','Etisalat_Egypt'),(260,'60301','21366','NULL'),(261,'60400','2126639','Meditel_Morocco'),(262,'60401','212661','Maroc_Itissalat'),(263,'60402','212640','Wana_Morocco'),(264,'6050100','2165','Orange_Tunisia'),(265,'60502','21698','Tunisie_Telecom'),(266,'60503','21622','Ooredoo_Tunisia'),(267,'60601','21891','ALMADAR_Libya'),(268,'60702','22077','Africell_Gambia'),(269,'60802','22176','SENTEL_Siniguel'),(270,'609020204725748','22222','Chinguitel_Mauritania'),(271,'610010100700675','223667','MALITEL_Mali'),(272,'610010342281031','223667','Malitel_Mali'),(273,'61002','223760','Orange_Mali'),(274,'61101','22462','Orange_Guine'),(275,'61203','22507','ORANGE_COTE_IVOIRE'),(276,'613020113989621','22676','Airtel_Burkinafaso'),(277,'614020200000868','22796','CELTEL_NIGER'),(278,'61701','23025','Cellplus-Mauritius'),(279,'61905','23277','AFRICELL_SIERA-LEONE'),(280,'62001','23324','Scancom_Limited_Ghana'),(281,'62002','23320','Vodafone_GHANA'),(282,'62003','23327','Millicom_Ghana'),(283,'62120','234802','Airtel_Nigeria'),(284,'62130','234803','MTN_Nigeria'),(285,'62160','234809','Etisalat_Nigeria'),(286,'622030110995247','2359','MIC_TCHAD'),(287,'623010171904629','96139','Atlantique_Telecom_Centrafrique'),(288,'62401','23767','MTN_Cameroon'),(289,'62502','23891','UNITEL_CAP_VER'),(290,'627010100795785','2402','Guinea_Equatorial'),(291,'62703','24055','Green_Com_S_A_Equatorial_Guinea'),(292,'62901','24205','Airtel_Congo'),(293,'62907','24204','Airtel_Congo'),(294,'63001','24381','Vodacom_Congo'),(295,'63086','24384','Orange_DRCongo'),(296,'63102','24492','Unitel_Angola'),(297,'631040002483368','24491','Angola_Movicel'),(298,'63310','24827','Airtel_Seychelles'),(299,'63601','25191','Ethio_Telecom'),(300,'63801','25377','GDjibouti_Telecom_SA'),(301,'639027300000257','254722','SAFARICOM_KENYA'),(302,'639070012609915','254770','Telecom_Kenya'),(303,'640040','25575','Vodacom_Tanzania'),(304,'64005','25578','CELTEL_Tanzania'),(305,'64008','25579','SMART_Tanzania'),(306,'641010280001898','25675','Airtel_Uganda'),(307,'64118','25674','smart_Uganda'),(308,'641220010330081','25670','Warid_Uganda'),(309,'64207','25775','Lacell-SU_Burundi'),(310,'64304','25884','Vodacom_Mozambique'),(311,'64601','26133','Airtel_Madagascar'),(312,'646020100058786','26132','Orange_Madagascar'),(313,'65001','26588','TNM_Malawi'),(314,'65101','2665','Vodacom_Lesotho'),(315,'65201','26771','Mascom_Bostwana'),(316,'655010','2782','Vodacome_SouthAfrica'),(317,'65507','2784','Cellc_South_Africa'),(318,'65510112172313','2783','NULL'),(319,'659020000936233','21192','MTN_South_Sudan'),(320,'70401','502530','Claro_Guatemala'),(321,'70601','503786','Claro_Salvador'),(322,'712011003446301','506300','ICE_Costa-Rica'),(323,'712030102558449','5067000','Claro_CostaRica'),(324,'71610','51997','claro_peru'),(325,'71615','51930','BITEL_Peru'),(326,'722310','54320','Claro_Argentina'),(327,'72405','55005','ClaroBrazil'),(328,'73003','56920','Claro_Chile'),(329,'732123','57316','Telecomunicaciones_Colombia'),(330,'734021001546026','58412','Venezuela_Digital'),(331,'74001','59394','Conecel_Ecuador'),(332,'74402','595991','Claro_Paraguay'),(333,'746030111269880','59781','Digicel_Group'),(334,'74801','59899','Ancel_Uruguay'),(335,'74807','59894','Telefonica_Uruguay'),(336,'74810','59896','Claro_Uruguay'),(337,'90105','88216','Thuraya_UAE'),(338,'901280','88239','Vodaphone_Malta'),(339,'90131','883130','Orange-M2M-AAZOR_France');
/*!40000 ALTER TABLE `roaming_partners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roaming_partners_backup`
--

DROP TABLE IF EXISTS `roaming_partners_backup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roaming_partners_backup` (
  `id` int NOT NULL DEFAULT '0',
  `imsi_prefix` varchar(255) DEFAULT NULL,
  `gt` varchar(255) DEFAULT NULL,
  `operateur` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roaming_partners_backup`
--

LOCK TABLES `roaming_partners_backup` WRITE;
/*!40000 ALTER TABLE `roaming_partners_backup` DISABLE KEYS */;
INSERT INTO `roaming_partners_backup` VALUES (1,'20201','3097','cosmote_greece'),(2,'202050','30694','Vodafone_Greece'),(3,'202051','30694','Vodafone_Greece'),(4,'2020520','30694','Vodafone_Greece'),(5,'2020521','30694','Vodafone_Greece'),(6,'2020522','30694','Vodafone_Greece'),(7,'2020523','30694','Vodafone_Greece'),(8,'2020524','30694','Vodafone_Greece'),(9,'2020525','30694','Vodafone_Greece'),(10,'2020526','30694','Vodafone_Greece'),(11,'2020527','30694','Vodafone_Greece'),(12,'2020528','30694','Vodafone_Greece'),(13,'20205290','30694','Vodafone_Greece'),(14,'20205291','30694','Vodafone_Greece'),(15,'20205292','30694','Vodafone_Greece'),(16,'20205293','30694','Vodafone_Greece'),(17,'20205294','30694','Vodafone_Greece'),(18,'20205295','30694','Vodafone_Greece'),(19,'202052960','30694','Vodafone_Greece'),(20,'202052961','30694','Vodafone_Greece'),(21,'202052962','30694','Vodafone_Greece'),(22,'202052963','30694','Vodafone_Greece'),(23,'2020529640','30694','Vodafone_Greece'),(24,'2020529641','30694','Vodafone_Greece'),(25,'2020529642','30694','Vodafone_Greece'),(26,'2020529643','30694','Vodafone_Greece'),(27,'2020529644','30694','Vodafone_Greece'),(28,'2020529645','30694','Vodafone_Greece'),(29,'2020529646','30694','Vodafone_Greece'),(30,'2020529647','30694','Vodafone_Greece'),(31,'20205296480','30694','Vodafone_Greece'),(32,'20205296481','30694','Vodafone_Greece'),(33,'20205296482','30694','Vodafone_Greece'),(34,'202052964830','30694','Vodafone_Greece'),(35,'202052964831','30694','Vodafone_Greece'),(36,'202052964832','30694','Vodafone_Greece'),(37,'202052964833','30694','Vodafone_Greece'),(38,'202052964834','30694','Vodafone_Greece'),(39,'202052964835','30694','Vodafone_Greece'),(40,'202052964836','30694','Vodafone_Greece'),(41,'2020529648370','30694','Vodafone_Greece'),(42,'2020529648371','30694','Vodafone_Greece'),(43,'2020529648372','30694','Vodafone_Greece'),(44,'2020529648373','30694','Vodafone_Greece'),(45,'2020529648374','30694','Vodafone_Greece'),(46,'2020529648375','30694','Vodafone_Greece'),(47,'2020529648376','30694','Vodafone_Greece'),(48,'20205296483770','30694','Vodafone_Greece'),(49,'20205296483771','30694','Vodafone_Greece'),(50,'20205296483772','30694','Vodafone_Greece'),(51,'20205296483773','30694','Vodafone_Greece'),(52,'20205296483774','30694','Vodafone_Greece'),(53,'20205296483775','30694','Vodafone_Greece'),(54,'20205296483776','30694','Vodafone_Greece'),(55,'202052964837770','30694','Vodafone_Greece'),(56,'202052964837771','30694','Vodafone_Greece'),(57,'202052964837772','30694','Vodafone_Greece'),(58,'202052964837773','30694','Vodafone_Greece'),(59,'202052964837774','30694','Vodafone_Greece'),(60,'202052964837775','30694','Vodafone_Greece'),(61,'202052964837776','30694','Vodafone_Greece'),(62,'202052964837777','30694','Vodafone_Greece'),(63,'202052964837778','30694','Vodafone_Greece'),(64,'202052964837779','30694','Vodafone_Greece'),(65,'202052964837780','30694','Vodafone_Greece'),(66,'202052964837781','30694','Vodafone_Greece'),(67,'202052964837782','30694','Vodafone_Greece'),(68,'202052964837783','30694','Vodafone_Greece'),(69,'202052964837784','30694','Vodafone_Greece'),(70,'202052964837785','30694','Vodafone_Greece'),(71,'202052964837786','30694','Vodafone_Greece'),(72,'202052964837787','30694','Vodafone_Greece'),(73,'202052964837788','30694','Vodafone_Greece'),(74,'202052964837789','30694','Vodafone_Greece'),(75,'20205296483779','30694','Vodafone_Greece'),(76,'2020529648378','30694','Vodafone_Greece'),(77,'2020529648379','30694','Vodafone_Greece'),(78,'202052964838','30694','Vodafone_Greece'),(79,'202052964839','30694','Vodafone_Greece'),(80,'20205296484','30694','Vodafone_Greece'),(81,'20205296485','30694','Vodafone_Greece'),(82,'20205296486','30694','Vodafone_Greece'),(83,'20205296487','30694','Vodafone_Greece'),(84,'20205296488','30694','Vodafone_Greece'),(85,'20205296489','30694','Vodafone_Greece'),(86,'2020529649','30694','Vodafone_Greece'),(87,'2020529650','30694','Vodafone_Greece'),(88,'2020529651','30694','Vodafone_Greece'),(89,'2020529652','30694','Vodafone_Greece'),(90,'20205296530','30694','Vodafone_Greece'),(91,'20205296531','30694','Vodafone_Greece'),(92,'20205296532','30694','Vodafone_Greece'),(93,'20205296533','30694','Vodafone_Greece'),(94,'20205296534','30694','Vodafone_Greece'),(95,'20205296535','30694','Vodafone_Greece'),(96,'20205296536','30694','Vodafone_Greece'),(97,'20205296537','30694','Vodafone_Greece'),(98,'20205296538','30694','Vodafone_Greece'),(99,'202052965390','30694','Vodafone_Greece'),(100,'202052965391','30694','Vodafone_Greece'),(101,'202052965392','30694','Vodafone_Greece'),(102,'2020529653930','30694','Vodafone_Greece'),(103,'2020529653931','30694','Vodafone_Greece'),(104,'2020529653932','30694','Vodafone_Greece'),(105,'2020529653933','30694','Vodafone_Greece'),(106,'2020529653934','30694','Vodafone_Greece'),(107,'2020529653935','30694','Vodafone_Greece'),(108,'2020529653936','30694','Vodafone_Greece'),(109,'20205296539370','30694','Vodafone_Greece'),(110,'20205296539371','30694','Vodafone_Greece'),(111,'20205296539372','30694','Vodafone_Greece'),(112,'20205296539373','30694','Vodafone_Greece'),(113,'20205296539374','30694','Vodafone_Greece'),(114,'20205296539375','30694','Vodafone_Greece'),(115,'20205296539376','30694','Vodafone_Greece'),(116,'202052965393770','30694','Vodafone_Greece'),(117,'202052965393771','30694','Vodafone_Greece'),(118,'202052965393772','30694','Vodafone_Greece'),(119,'202052965393773','30694','Vodafone_Greece'),(120,'202052965393774','30694','Vodafone_Greece'),(121,'202052965393775','30694','Vodafone_Greece'),(122,'202052965393776','30694','Vodafone_Greece'),(123,'202052965393777','30694','Vodafone_Greece'),(124,'202052965393778','30694','Vodafone_Greece'),(125,'202052965393779','30694','Vodafone_Greece'),(126,'20205296539378','30694','Vodafone_Greece'),(127,'20205296539379','30694','Vodafone_Greece'),(128,'2020529653938','30694','Vodafone_Greece'),(129,'2020529653939','30694','Vodafone_Greece'),(130,'202052965394','30694','Vodafone_Greece'),(131,'202052965395','30694','Vodafone_Greece'),(132,'202052965396','30694','Vodafone_Greece'),(133,'202052965397','30694','Vodafone_Greece'),(134,'202052965398','30694','Vodafone_Greece'),(135,'202052965399','30694','Vodafone_Greece'),(136,'2020529654','30694','Vodafone_Greece'),(137,'2020529655','30694','Vodafone_Greece'),(138,'2020529656','30694','Vodafone_Greece'),(139,'2020529657','30694','Vodafone_Greece'),(140,'2020529658','30694','Vodafone_Greece'),(141,'2020529659','30694','Vodafone_Greece'),(142,'202052966','30694','Vodafone_Greece'),(143,'202052967','30694','Vodafone_Greece'),(144,'202052968','30694','Vodafone_Greece'),(145,'202052969','30694','Vodafone_Greece'),(146,'20205297','30694','Vodafone_Greece'),(147,'20205298000','30694','Vodafone_Greece'),(148,'202052980010','30694','Vodafone_Greece'),(149,'202052980011','30694','Vodafone_Greece'),(150,'202052980012','30694','Vodafone_Greece'),(151,'202052980013','30694','Vodafone_Greece'),(152,'202052980014','30694','Vodafone_Greece'),(153,'202052980015','30694','Vodafone_Greece'),(154,'2020529800160','30694','Vodafone_Greece'),(155,'2020529800161','30694','Vodafone_Greece'),(156,'20205298001620','30694','Vodafone_Greece'),(157,'20205298001621','30694','Vodafone_Greece'),(158,'20205298001622','30694','Vodafone_Greece'),(159,'20205298001623','30694','Vodafone_Greece'),(160,'20205298001624','30694','Vodafone_Greece'),(161,'20205298001625','30694','Vodafone_Greece'),(162,'20205298001626','30694','Vodafone_Greece'),(163,'202052980016270','30694','Vodafone_Greece'),(164,'202052980016271','30694','Vodafone_Greece'),(165,'202052980016272','30694','Vodafone_Greece'),(166,'202052980016273','30694','Vodafone_Greece'),(167,'202052980016274','30694','Vodafone_Greece'),(168,'202052980016275','30694','Vodafone_Greece'),(169,'202052980016276','30694','Vodafone_Greece'),(170,'202052980016277','30694','Vodafone_Greece'),(171,'202052980016278','30694','Vodafone_Greece'),(172,'202052980016279','30694','Vodafone_Greece'),(173,'20205298001628','30694','Vodafone_Greece'),(174,'20205298001629','30694','Vodafone_Greece'),(175,'2020529800163','30694','Vodafone_Greece'),(176,'2020529800164','30694','Vodafone_Greece'),(177,'2020529800165','30694','Vodafone_Greece'),(178,'2020529800166','30694','Vodafone_Greece'),(179,'2020529800167','30694','Vodafone_Greece'),(180,'2020529800168','30694','Vodafone_Greece'),(181,'2020529800169','30694','Vodafone_Greece'),(182,'202052980017','30694','Vodafone_Greece'),(183,'202052980018','30694','Vodafone_Greece'),(184,'202052980019','30694','Vodafone_Greece'),(185,'20205298002','30694','Vodafone_Greece'),(186,'20205298003','30694','Vodafone_Greece'),(187,'20205298004','30694','Vodafone_Greece'),(188,'20205298005','30694','Vodafone_Greece'),(189,'20205298006','30694','Vodafone_Greece'),(190,'20205298007','30694','Vodafone_Greece'),(191,'20205298008','30694','Vodafone_Greece'),(192,'20205298009','30694','Vodafone_Greece'),(193,'2020529801','30694','Vodafone_Greece'),(194,'2020529802','30694','Vodafone_Greece'),(195,'2020529803','30694','Vodafone_Greece'),(196,'2020529804','30694','Vodafone_Greece'),(197,'2020529805','30694','Vodafone_Greece'),(198,'2020529806','30694','Vodafone_Greece'),(199,'2020529807','30694','Vodafone_Greece'),(200,'2020529808','30694','Vodafone_Greece'),(201,'2020529809','30694','Vodafone_Greece'),(202,'202052981','30694','Vodafone_Greece'),(203,'202052982','30694','Vodafone_Greece'),(204,'202052983','30694','Vodafone_Greece'),(205,'202052984','30694','Vodafone_Greece'),(206,'202052985','30694','Vodafone_Greece'),(207,'202052986','30694','Vodafone_Greece'),(208,'202052987','30694','Vodafone_Greece'),(209,'202052988','30694','Vodafone_Greece'),(210,'202052989','30694','Vodafone_Greece'),(211,'20205299','30694','Vodafone_Greece'),(212,'202053','30694','Vodafone_Greece'),(213,'202054','30694','Vodafone_Greece'),(214,'202055','30694','Vodafone_Greece'),(215,'202056','30694','Vodafone_Greece'),(216,'202057','30694','Vodafone_Greece'),(217,'202058','30694','Vodafone_Greece'),(218,'202059','30694','Vodafone_Greece'),(219,'20210','30693','Wind_Hellas_Greece'),(220,'20214','30685','Vodafone_Greece'),(221,'20404','31654','Vodafone_Netherlands'),(222,'20408','31653','KPN_Netherlands'),(223,'20412','31626','Telfort_Netherlands'),(224,'204162443766381','31624','T-Mobile_Netherlands'),(225,'204162443766382','31624','T-Mobile_Netherlands'),(226,'204162443766383','31624','T-Mobile_Netherlands'),(227,'204162443766384','31624','T-Mobile_Netherlands'),(228,'204201000211900','31628','T-Mobile_Netherlands'),(229,'204201000211967','31628','T-Mobile_Netherlands'),(230,'204202000000990','31628','T-Mobile_Netherlands'),(231,'204202000000991','31628','T-Mobile_Netherlands'),(232,'20601','32475','Belgacom_BELGIUM'),(233,'206050004526678','32468','Telenet_Belgium'),(234,'206050004526691','32468','Telenet_Belgium'),(235,'206050004526692','32468','Telenet_Belgium'),(236,'20610','32495','Mobistar_BELGIUM'),(237,'20620','32486','Base_BELGIUM'),(238,'20801100010','33689','Orange_France'),(239,'20801100011','33689','Orange_France'),(240,'208011000120','33689','Orange_France'),(241,'208011000121','33689','Orange_France'),(242,'208011000122','33689','Orange_France'),(243,'20801100012300','33689','Orange_France'),(244,'20801100012301','33689','Orange_France'),(245,'20801100012302','33689','Orange_France'),(246,'20801100012303','33689','Orange_France'),(247,'20801100012304','33689','Orange_France'),(248,'20801100012305','33689','Orange_France'),(249,'20801100012306','33689','Orange_France'),(250,'20801100012307','33689','Orange_France'),(251,'208011000123080','33689','Orange_France'),(252,'208011000123081','33689','Orange_France'),(253,'208011000123082','33689','Orange_France'),(254,'208011000123083','33689','Orange_France'),(255,'208011000123084','33689','Orange_France'),(256,'208011000123085','33689','Orange_France'),(257,'208011000123086','33689','Orange_France'),(258,'208011000123087','33689','Orange_France'),(259,'208011000123088','33689','Orange_France'),(260,'208011000123089','33689','Orange_France'),(261,'20801100012309','33689','Orange_France'),(262,'2080110001231','33689','Orange_France'),(263,'2080110001232','33689','Orange_France'),(264,'2080110001233','33689','Orange_France'),(265,'2080110001234','33689','Orange_France'),(266,'2080110001235','33689','Orange_France'),(267,'2080110001236','33689','Orange_France'),(268,'2080110001237','33689','Orange_France'),(269,'2080110001238','33689','Orange_France'),(270,'2080110001239','33689','Orange_France'),(271,'208011000124','33689','Orange_France'),(272,'208011000125','33689','Orange_France'),(273,'208011000126','33689','Orange_France'),(274,'208011000127','33689','Orange_France'),(275,'208011000128','33689','Orange_France'),(276,'208011000129','33689','Orange_France'),(277,'20801100013','33689','Orange_France'),(278,'20801100014','33689','Orange_France'),(279,'20801100015','33689','Orange_France'),(280,'20801100016','33689','Orange_France'),(281,'20801100017','33689','Orange_France'),(282,'20801100018','33689','Orange_France'),(283,'20801100019','33689','Orange_France'),(284,'2080110002','33689','Orange_France'),(285,'2080110003','33689','Orange_France'),(286,'2080110004','33689','Orange_France'),(287,'2080110005','33689','Orange_France'),(288,'2080110006','33689','Orange_France'),(289,'2080110007','33689','Orange_France'),(290,'2080110008','33689','Orange_France'),(291,'2080110009','33689','Orange_France'),(292,'208011001','33689','Orange_France'),(293,'208011002','33689','Orange_France'),(294,'208011003','33689','Orange_France'),(295,'208011004','33689','Orange_France'),(296,'208011005','33689','Orange_France'),(297,'208011006','33689','Orange_France'),(298,'208011007','33689','Orange_France'),(299,'208011008','33689','Orange_France'),(300,'208011009','33689','Orange_France'),(301,'20801101','33689','Orange_France'),(302,'20801102','33689','Orange_France'),(303,'20801103','33689','Orange_France'),(304,'20801104','33689','Orange_France'),(305,'20801105','33689','Orange_France'),(306,'20801106','33689','Orange_France'),(307,'20801107','33689','Orange_France'),(308,'20801108','33689','Orange_France'),(309,'20801109','33689','Orange_France'),(310,'2080111','33689','Orange_France'),(311,'2080112','33689','Orange_France'),(312,'2080113','33689','Orange_France'),(313,'2080114','33689','Orange_France'),(314,'2080115','33689','Orange_France'),(315,'2080116','33689','Orange_France'),(316,'2080117','33689','Orange_France'),(317,'2080118','33689','Orange_France'),(318,'2080119','33689','Orange_France'),(319,'208013','33689','Orange_France'),(320,'208014','33689','Orange_France'),(321,'208015','33689','Orange_France'),(322,'208016','33689','Orange_France'),(323,'208017','33689','Orange_France'),(324,'208018','33689','Orange_France'),(325,'208019','33689','Orange_France'),(326,'20809','33611','SFR_France'),(327,'20810','33609','SFR_France'),(328,'20815','33695','Free_Mobile_FRANCE'),(329,'20820','33660','Bouygues_Telecom_France'),(330,'21401','34607','Vodafone_Spain'),(331,'214030','34656','Orange_Spain'),(332,'214031','34656','Orange_Spain'),(333,'214032','34656','Orange_Spain'),(334,'2140330','34656','Orange_Spain'),(335,'2140331','34656','Orange_Spain'),(336,'2140332','34656','Orange_Spain'),(337,'2140333','34656','Orange_Spain'),(338,'2140334','34656','Orange_Spain'),(339,'2140335','34656','Orange_Spain'),(340,'2140336','34656','Orange_Spain'),(341,'21403370','34656','Orange_Spain'),(342,'21403371','34656','Orange_Spain'),(343,'21403372','34656','Orange_Spain'),(344,'2140337300','34656','Orange_Spain'),(345,'21403373010','34656','Orange_Spain'),(346,'21403373011','34656','Orange_Spain'),(347,'21403373012','34656','Orange_Spain'),(348,'21403373013','34656','Orange_Spain'),(349,'21403373014','34656','Orange_Spain'),(350,'21403373015','34656','Orange_Spain'),(351,'214033730160','34656','Orange_Spain'),(352,'214033730161','34656','Orange_Spain'),(353,'214033730162','34656','Orange_Spain'),(354,'214033730163','34656','Orange_Spain'),(355,'214033730164','34656','Orange_Spain'),(356,'214033730165','34656','Orange_Spain'),(357,'214033730166','34656','Orange_Spain'),(358,'214033730167','34656','Orange_Spain'),(359,'2140337301680','34656','Orange_Spain'),(360,'2140337301681','34656','Orange_Spain'),(361,'2140337301682','34656','Orange_Spain'),(362,'2140337301683','34656','Orange_Spain'),(363,'2140337301684','34656','Orange_Spain'),(364,'21403373016850','34656','Orange_Spain'),(365,'21403373016851','34656','Orange_Spain'),(366,'21403373016852','34656','Orange_Spain'),(367,'21403373016853','34656','Orange_Spain'),(368,'214033730168540','34656','Orange_Spain'),(369,'214033730168541','34656','Orange_Spain'),(370,'214033730168542','34656','Orange_Spain'),(371,'214033730168543','34656','Orange_Spain'),(372,'214033730168544','34656','Orange_Spain'),(373,'214033730168545','34656','Orange_Spain'),(374,'214033730168546','34656','Orange_Spain'),(375,'214033730168547','34656','Orange_Spain'),(376,'214033730168548','34656','Orange_Spain'),(377,'214033730168549','34656','Orange_Spain'),(378,'21403373016855','34656','Orange_Spain'),(379,'21403373016856','34656','Orange_Spain'),(380,'21403373016857','34656','Orange_Spain'),(381,'21403373016858','34656','Orange_Spain'),(382,'21403373016859','34656','Orange_Spain'),(383,'2140337301686','34656','Orange_Spain'),(384,'2140337301687','34656','Orange_Spain'),(385,'2140337301688','34656','Orange_Spain'),(386,'2140337301689','34656','Orange_Spain'),(387,'214033730169','34656','Orange_Spain'),(388,'21403373017','34656','Orange_Spain'),(389,'21403373018','34656','Orange_Spain'),(390,'21403373019','34656','Orange_Spain'),(391,'2140337302','34656','Orange_Spain'),(392,'2140337303','34656','Orange_Spain'),(393,'2140337304','34656','Orange_Spain'),(394,'2140337305','34656','Orange_Spain'),(395,'2140337306','34656','Orange_Spain'),(396,'2140337307','34656','Orange_Spain'),(397,'2140337308','34656','Orange_Spain'),(398,'2140337309','34656','Orange_Spain'),(399,'214033731','34656','Orange_Spain'),(400,'214033732','34656','Orange_Spain'),(401,'214033733','34656','Orange_Spain'),(402,'214033734','34656','Orange_Spain'),(403,'214033735','34656','Orange_Spain'),(404,'214033736','34656','Orange_Spain'),(405,'214033737','34656','Orange_Spain'),(406,'214033738','34656','Orange_Spain'),(407,'214033739','34656','Orange_Spain'),(408,'21403374','34656','Orange_Spain'),(409,'21403375','34656','Orange_Spain'),(410,'21403376','34656','Orange_Spain'),(411,'21403377','34656','Orange_Spain'),(412,'21403378','34656','Orange_Spain'),(413,'21403379','34656','Orange_Spain'),(414,'2140338','34656','Orange_Spain'),(415,'2140339','34656','Orange_Spain'),(416,'214034','34656','Orange_Spain'),(417,'214035','34656','Orange_Spain'),(418,'214036','34656','Orange_Spain'),(419,'214037','34656','Orange_Spain'),(420,'214038','34656','Orange_Spain'),(421,'214039','34656','Orange_Spain'),(422,'21405','34648','Telefonica_Spain_ESPT2'),(423,'21406','34607','Vodafone_Spain'),(424,'21407','34609','Telefonica_Spain'),(425,'21630','3630','Hungary_Telekom'),(426,'21670','3670','Vodafone_Hungary'),(427,'21803','38763','Croatian_Telecom'),(428,'21901','38598','Telecom_Croatian'),(429,'21902','38595','TELE_2_CROATIA'),(430,'22001','38163','Mobtel_Serbia'),(431,'22003','38164','Telekom_Serbia'),(432,'22201','39339','TIM_ITALY'),(433,'22210','39349','Vodafone_Omnitel_ITALY'),(434,'22601','40722','Vodafone_Romania'),(435,'22603','4076','Telekom-Mobile_Romania'),(436,'22801','4179','Swisscom_Switzerland'),(437,'22803','4178','Orange_Switzerland'),(438,'23001','420603','T-Mobile_Czech-Republic'),(439,'23002','420602','Czech_Republic'),(440,'23003','420608','Vodafone_Czeech'),(441,'23101','421905','Orange_SLOVAKIA'),(442,'231020105243123','421903','T-Mobile_slovakia'),(443,'231020105243124','421903','T-Mobile_slovakia'),(444,'231020105243125','421903','T-Mobile_slovakia'),(445,'231020105243126','421903','T-Mobile_slovakia'),(446,'231020105243127','421903','T-Mobile_slovakia'),(447,'231020107665554','421903','T-Mobile_slovakia'),(448,'231020107665555','421903','T-Mobile_slovakia'),(449,'231020107665556','421903','T-Mobile_slovakia'),(450,'231020107665557','421903','T-Mobile_slovakia'),(451,'23203','43676','T-Mobile_Austria'),(452,'23207','43650','T-Mobile_Austria'),(453,'23410','447802','UK_TELEFONICA'),(454,'23415','44385','Vodafone_United_Kingdom'),(455,'23430','447953','T-Mobile_UK'),(456,'23450','447797','Telekom_Jersey'),(457,'23455','447781','Sure_Limited_Guernsey'),(458,'23801','45401','TDC_Denmark'),(459,'238201001789892','4528','TELIA_DANMARK'),(460,'238201001789893','4528','TELIA_DANMARK'),(461,'238201001820509','4528','TELIA_DANMARK'),(462,'24007','46707','Tele2_Sweeden'),(463,'24010','46765','Lycamobile_Sweeden'),(464,'24014','4676720','TDC_Sweden'),(465,'24201','47900','Telenor_Norway'),(466,'24208','479451','TDC_Norway'),(467,'24405','35850','Elisa_Finland'),(468,'244144573919427','3584570','NULL'),(469,'244144573919429','3584570','NULL'),(470,'244212000908392','358451','Elisa_Finland'),(471,'244212000908393','358451','Elisa_Finland'),(472,'244212000908407','358451','Elisa_Finland'),(473,'24701','371292','Latvian_Mobile_Telephone'),(474,'24802','37256','Elisa_Estonia'),(475,'24803','37255','Tele2_Estonia'),(476,'25001','79160','MTS_Russia'),(477,'25002','792','MegaFon_Russia'),(478,'25016','7902557','NTC_Russia'),(479,'25020','790434','TELE2_RUSSIA'),(480,'25099','79037','Vimpelcom_russia'),(481,'25501','38050','MTS_UKraine'),(482,'25503','38067','KyivstarOperator'),(483,'25506','38063','lifecell_Ukraine'),(484,'25702','375297','MTS_Belarus'),(485,'259010103887776','373691','Orange_Moldova'),(486,'259010103887777','373691','Orange_Moldova'),(487,'259010103887778','373691','Orange_Moldova'),(488,'259010103887779','373691','Orange_Moldova'),(489,'259050125057010','37367','Moldtelecom_MOLDOVA'),(490,'259050125057011','37367','Moldtelecom_MOLDOVA'),(491,'259050125057012','37367','Moldtelecom_MOLDOVA'),(492,'259050125057013','37367','Moldtelecom_MOLDOVA'),(493,'259050125057014','37367','Moldtelecom_MOLDOVA'),(494,'259050125057015','37367','Moldtelecom_MOLDOVA'),(495,'259050125057016','37367','Moldtelecom_MOLDOVA'),(496,'259050125057017','37367','Moldtelecom_MOLDOVA'),(497,'259050125057018','37367','Moldtelecom_MOLDOVA'),(498,'259050125057019','37367','Moldtelecom_MOLDOVA'),(499,'259050125057020','37367','Moldtelecom_MOLDOVA'),(500,'259050125057021','37367','Moldtelecom_MOLDOVA'),(501,'260021173107739','48602','T-Mobile_Poland'),(502,'260021173107740','48602','T-Mobile_Poland'),(503,'260021271956453','48602','T-Mobile_Poland'),(504,'260021271956454','48602','T-Mobile_Poland'),(505,'260021372214393','48602','T-Mobile_Polska'),(506,'260021472116543','48602','T-Mobile_Polska'),(507,'260032001805073','48501','Orange_Poland'),(508,'260032660997605','48501','Orange_Poland'),(509,'26006000','48790','Play_Poland'),(510,'26006001','48790','Play_Poland'),(511,'26006002','48790','Play_Poland'),(512,'26006003','48790','Play_Poland'),(513,'26006004','48790','Play_Poland'),(514,'26006005','48790','Play_Poland'),(515,'26006006','48790','Play_Poland'),(516,'26006007','48790','Play_Poland'),(517,'260060080','48790','Play_Poland'),(518,'2600600810','48790','Play_Poland'),(519,'26006008110','48790','Play_Poland'),(520,'26006008111','48790','Play_Poland'),(521,'260060081120','48790','Play_Poland'),(522,'260060081121','48790','Play_Poland'),(523,'260060081122','48790','Play_Poland'),(524,'260060081123','48790','Play_Poland'),(525,'260060081124','48790','Play_Poland'),(526,'260060081125','48790','Play_Poland'),(527,'260060081126','48790','Play_Poland'),(528,'2600600811270','48790','Play_Poland'),(529,'2600600811271','48790','Play_Poland'),(530,'2600600811272','48790','Play_Poland'),(531,'2600600811273','48790','Play_Poland'),(532,'2600600811274','48790','Play_Poland'),(533,'2600600811275','48790','Play_Poland'),(534,'2600600811276','48790','Play_Poland'),(535,'260060081127700','48790','Play_Poland'),(536,'260060081127701','48790','Play_Poland'),(537,'260060081127702','48790','Play_Poland'),(538,'260060081127703','48790','Play_Poland'),(539,'260060081127704','48790','Play_Poland'),(540,'260060081127705','48790','Play_Poland'),(541,'260060081127706','48790','Play_Poland'),(542,'260060081127707','48790','Play_Poland'),(543,'260060081127708','48790','Play_Poland'),(544,'260060081127709','48790','Play_Poland'),(545,'26006008112771','48790','Play_Poland'),(546,'26006008112772','48790','Play_Poland'),(547,'26006008112773','48790','Play_Poland'),(548,'26006008112774','48790','Play_Poland'),(549,'26006008112775','48790','Play_Poland'),(550,'26006008112776','48790','Play_Poland'),(551,'26006008112777','48790','Play_Poland'),(552,'26006008112778','48790','Play_Poland'),(553,'26006008112779','48790','Play_Poland'),(554,'2600600811278','48790','Play_Poland'),(555,'2600600811279','48790','Play_Poland'),(556,'260060081128','48790','Play_Poland'),(557,'260060081129','48790','Play_Poland'),(558,'26006008113','48790','Play_Poland'),(559,'26006008114','48790','Play_Poland'),(560,'26006008115','48790','Play_Poland'),(561,'26006008116','48790','Play_Poland'),(562,'26006008117','48790','Play_Poland'),(563,'26006008118','48790','Play_Poland'),(564,'26006008119','48790','Play_Poland'),(565,'2600600812','48790','Play_Poland'),(566,'2600600813','48790','Play_Poland'),(567,'2600600814','48790','Play_Poland'),(568,'2600600815','48790','Play_Poland'),(569,'2600600816','48790','Play_Poland'),(570,'2600600817','48790','Play_Poland'),(571,'2600600818','48790','Play_Poland'),(572,'2600600819','48790','Play_Poland'),(573,'260060082','48790','Play_Poland'),(574,'260060083','48790','Play_Poland'),(575,'260060084','48790','Play_Poland'),(576,'260060085','48790','Play_Poland'),(577,'260060086','48790','Play_Poland'),(578,'260060087','48790','Play_Poland'),(579,'260060088','48790','Play_Poland'),(580,'260060089','48790','Play_Poland'),(581,'26006009','48790','Play_Poland'),(582,'2600601','48790','Play_Poland'),(583,'2600602','48790','Play_Poland'),(584,'2600603','48790','Play_Poland'),(585,'2600604','48790','Play_Poland'),(586,'2600605','48790','Play_Poland'),(587,'2600606','48790','Play_Poland'),(588,'2600607','48790','Play_Poland'),(589,'2600608','48790','Play_Poland'),(590,'2600609','48790','Play_Poland'),(591,'260061','48790','Play_Poland'),(592,'260062','48790','Play_Poland'),(593,'260063','48790','Play_Poland'),(594,'260064','48790','Play_Poland'),(595,'260065','48790','Play_Poland'),(596,'260066','48790','Play_Poland'),(597,'260067','48790','Play_Poland'),(598,'260068','48790','Play_Poland'),(599,'260069','48790','Play_Poland'),(600,'262010','49171','Telekom_Germany'),(601,'2620110','49171','Telekom_Germany'),(602,'2620111','49171','Telekom_Germany'),(603,'262011200','49171','Telekom_Germany'),(604,'262011201','49171','Telekom_Germany'),(605,'262011202','49171','Telekom_Germany'),(606,'262011203','49171','Telekom_Germany'),(607,'262011204','49171','Telekom_Germany'),(608,'2620112050','49171','Telekom_Germany'),(609,'2620112051','49171','Telekom_Germany'),(610,'26201120520','49171','Telekom_Germany'),(611,'26201120521','49171','Telekom_Germany'),(612,'26201120522','49171','Telekom_Germany'),(613,'262011205230','49171','Telekom_Germany'),(614,'262011205231','49171','Telekom_Germany'),(615,'262011205232','49171','Telekom_Germany'),(616,'262011205233','49171','Telekom_Germany'),(617,'262011205234','49171','Telekom_Germany'),(618,'262011205235','49171','Telekom_Germany'),(619,'262011205236','49171','Telekom_Germany'),(620,'262011205237','49171','Telekom_Germany'),(621,'262011205238','49171','Telekom_Germany'),(622,'26201120523900','49171','Telekom_Germany'),(623,'26201120523901','49171','Telekom_Germany'),(624,'262011205239020','49171','Telekom_Germany'),(625,'262011205239021','49171','Telekom_Germany'),(626,'262011205239022','49171','Telekom_Germany'),(627,'262011205239023','49171','Telekom_Germany'),(628,'262011205239024','49171','Telekom_Germany'),(629,'262011205239025','49171','Telekom_Germany'),(630,'262011205239026','49171','Telekom_Germany'),(631,'262011205239027','49171','Telekom_Germany'),(632,'262011205239028','49171','Telekom_Germany'),(633,'262011205239029','49171','Telekom_Germany'),(634,'262011205239030','49171','Telekom_Germany'),(635,'262011205239031','49171','Telekom_Germany'),(636,'262011205239032','49171','Telekom_Germany'),(637,'262011205239033','49171','Telekom_Germany'),(638,'262011205239034','49171','Telekom_Germany'),(639,'262011205239035','49171','Telekom_Germany'),(640,'262011205239036','49171','Telekom_Germany'),(641,'262011205239037','49171','Telekom_Germany'),(642,'262011205239038','49171','Telekom_Germany'),(643,'262011205239039','49171','Telekom_Germany'),(644,'26201120523904','49171','Telekom_Germany'),(645,'26201120523905','49171','Telekom_Germany'),(646,'26201120523906','49171','Telekom_Germany'),(647,'26201120523907','49171','Telekom_Germany'),(648,'26201120523908','49171','Telekom_Germany'),(649,'26201120523909','49171','Telekom_Germany'),(650,'2620112052391','49171','Telekom_Germany'),(651,'2620112052392','49171','Telekom_Germany'),(652,'2620112052393','49171','Telekom_Germany'),(653,'2620112052394','49171','Telekom_Germany'),(654,'2620112052395','49171','Telekom_Germany'),(655,'2620112052396','49171','Telekom_Germany'),(656,'2620112052397','49171','Telekom_Germany'),(657,'2620112052398','49171','Telekom_Germany'),(658,'2620112052399','49171','Telekom_Germany'),(659,'26201120524','49171','Telekom_Germany'),(660,'26201120525','49171','Telekom_Germany'),(661,'26201120526','49171','Telekom_Germany'),(662,'26201120527','49171','Telekom_Germany'),(663,'26201120528','49171','Telekom_Germany'),(664,'26201120529','49171','Telekom_Germany'),(665,'2620112053','49171','Telekom_Germany'),(666,'2620112054','49171','Telekom_Germany'),(667,'2620112055','49171','Telekom_Germany'),(668,'2620112056','49171','Telekom_Germany'),(669,'2620112057','49171','Telekom_Germany'),(670,'2620112058','49171','Telekom_Germany'),(671,'2620112059','49171','Telekom_Germany'),(672,'262011206','49171','Telekom_Germany'),(673,'262011207','49171','Telekom_Germany'),(674,'262011208','49171','Telekom_Germany'),(675,'262011209','49171','Telekom_Germany'),(676,'26201121','49171','Telekom_Germany'),(677,'26201122','49171','Telekom_Germany'),(678,'26201123','49171','Telekom_Germany'),(679,'26201124','49171','Telekom_Germany'),(680,'26201125','49171','Telekom_Germany'),(681,'26201126','49171','Telekom_Germany'),(682,'26201127','49171','Telekom_Germany'),(683,'26201128','49171','Telekom_Germany'),(684,'26201129','49171','Telekom_Germany'),(685,'2620113','49171','Telekom_Germany'),(686,'2620114','49171','Telekom_Germany'),(687,'2620115','49171','Telekom_Germany'),(688,'2620116','49171','Telekom_Germany'),(689,'2620117','49171','Telekom_Germany'),(690,'2620118','49171','Telekom_Germany'),(691,'2620119','49171','Telekom_Germany'),(692,'262012','49171','Telekom_Germany'),(693,'262013','49171','Telekom_Germany'),(694,'262014','49171','Telekom_Germany'),(695,'262015','49171','Telekom_Germany'),(696,'262016','49171','Telekom_Germany'),(697,'262017','49171','Telekom_Germany'),(698,'262018','49171','Telekom_Germany'),(699,'262019','49171','Telekom_Germany'),(700,'26202','49172','Vodafone_Germany'),(701,'26203','49177','Telefonica_Germany'),(702,'26207','49176','Telefonica_Germany'),(703,'26801','35191','Vodafone_Portugal'),(704,'26806','35196','TMN_Portugal'),(705,'27001','352021','POST_Luxembourg'),(706,'27077','352091','Tango_Luxembourg'),(707,'27099','352061','Orange_Luxemburg'),(708,'272010','35387','Vodafone_Ireland'),(709,'272011','35387','Vodafone_Ireland'),(710,'272012','35387','Vodafone_Ireland'),(711,'272013','35387','Vodafone_Ireland'),(712,'272014','35387','Vodafone_Ireland'),(713,'272015','35387','Vodafone_Ireland'),(714,'272016','35387','Vodafone_Ireland'),(715,'2720170','35387','Vodafone_Ireland'),(716,'27201710','35387','Vodafone_Ireland'),(717,'272017110','35387','Vodafone_Ireland'),(718,'272017111','35387','Vodafone_Ireland'),(719,'272017112','35387','Vodafone_Ireland'),(720,'2720171130','35387','Vodafone_Ireland'),(721,'2720171131','35387','Vodafone_Ireland'),(722,'2720171132','35387','Vodafone_Ireland'),(723,'27201711330','35387','Vodafone_Ireland'),(724,'27201711331','35387','Vodafone_Ireland'),(725,'27201711332','35387','Vodafone_Ireland'),(726,'27201711333','35387','Vodafone_Ireland'),(727,'27201711334','35387','Vodafone_Ireland'),(728,'27201711335','35387','Vodafone_Ireland'),(729,'27201711336','35387','Vodafone_Ireland'),(730,'2720171133700','35387','Vodafone_Ireland'),(731,'2720171133701','35387','Vodafone_Ireland'),(732,'2720171133702','35387','Vodafone_Ireland'),(733,'2720171133703','35387','Vodafone_Ireland'),(734,'2720171133704','35387','Vodafone_Ireland'),(735,'27201711337050','35387','Vodafone_Ireland'),(736,'27201711337051','35387','Vodafone_Ireland'),(737,'272017113370520','35387','Vodafone_Ireland'),(738,'272017113370521','35387','Vodafone_Ireland'),(739,'272017113370522','35387','Vodafone_Ireland'),(740,'272017113370523','35387','Vodafone_Ireland'),(741,'272017113370524','35387','Vodafone_Ireland'),(742,'272017113370525','35387','Vodafone_Ireland'),(743,'272017113370526','35387','Vodafone_Ireland'),(744,'272017113370527','35387','Vodafone_Ireland'),(745,'272017113370528','35387','Vodafone_Ireland'),(746,'272017113370529','90542','Vodafone_Turkey'),(747,'272017113370530','35387','Vodafone_Ireland'),(748,'272017113370531','35387','Vodafone_Ireland'),(749,'272017113370532','35387','Vodafone_Ireland'),(750,'272017113370533','35387','Vodafone_Ireland'),(751,'272017113370534','35387','Vodafone_Ireland'),(752,'272017113370535','90542','Vodafone_Turkey'),(753,'272017113370536','35387','Vodafone_Ireland'),(754,'272017113370537','35387','Vodafone_Ireland'),(755,'272017113370538','35387','Vodafone_Ireland'),(756,'272017113370539','35387','Vodafone_Ireland'),(757,'27201711337054','35387','Vodafone_Ireland'),(758,'27201711337055','35387','Vodafone_Ireland'),(759,'27201711337056','35387','Vodafone_Ireland'),(760,'27201711337057','35387','Vodafone_Ireland'),(761,'27201711337058','35387','Vodafone_Ireland'),(762,'27201711337059','35387','Vodafone_Ireland'),(763,'2720171133706','35387','Vodafone_Ireland'),(764,'2720171133707','35387','Vodafone_Ireland'),(765,'2720171133708','35387','Vodafone_Ireland'),(766,'2720171133709','35387','Vodafone_Ireland'),(767,'272017113371','35387','Vodafone_Ireland'),(768,'272017113372','35387','Vodafone_Ireland'),(769,'272017113373','35387','Vodafone_Ireland'),(770,'272017113374','35387','Vodafone_Ireland'),(771,'272017113375','35387','Vodafone_Ireland'),(772,'272017113376','35387','Vodafone_Ireland'),(773,'272017113377','35387','Vodafone_Ireland'),(774,'272017113378','35387','Vodafone_Ireland'),(775,'272017113379','35387','Vodafone_Ireland'),(776,'27201711338','35387','Vodafone_Ireland'),(777,'27201711339','35387','Vodafone_Ireland'),(778,'2720171134','35387','Vodafone_Ireland'),(779,'2720171135','35387','Vodafone_Ireland'),(780,'2720171136','35387','Vodafone_Ireland'),(781,'2720171137','35387','Vodafone_Ireland'),(782,'2720171138','35387','Vodafone_Ireland'),(783,'2720171139','35387','Vodafone_Ireland'),(784,'272017114','35387','Vodafone_Ireland'),(785,'272017115','35387','Vodafone_Ireland'),(786,'272017116','35387','Vodafone_Ireland'),(787,'272017117','35387','Vodafone_Ireland'),(788,'272017118','35387','Vodafone_Ireland'),(789,'272017119','35387','Vodafone_Ireland'),(790,'27201712','35387','Vodafone_Ireland'),(791,'27201713','35387','Vodafone_Ireland'),(792,'27201714','35387','Vodafone_Ireland'),(793,'27201715','35387','Vodafone_Ireland'),(794,'27201716','35387','Vodafone_Ireland'),(795,'27201717','35387','Vodafone_Ireland'),(796,'27201718','35387','Vodafone_Ireland'),(797,'27201719','35387','Vodafone_Ireland'),(798,'2720172','35387','Vodafone_Ireland'),(799,'2720173','35387','Vodafone_Ireland'),(800,'2720174','35387','Vodafone_Ireland'),(801,'2720175','35387','Vodafone_Ireland'),(802,'2720176','35387','Vodafone_Ireland'),(803,'2720177','35387','Vodafone_Ireland'),(804,'2720178','35387','Vodafone_Ireland'),(805,'2720179','35387','Vodafone_Ireland'),(806,'272018','35387','Vodafone_Ireland'),(807,'272019','35387','Vodafone_Ireland'),(808,'27203','35385','Meteor_Ireland'),(809,'274040299002034','354650','NULL'),(810,'274040299002035','354650','NULL'),(811,'274040299002036','354650','NULL'),(812,'27601','35568','AMC_Albania'),(813,'276020','35569','Vodafone_ALBANIA'),(814,'2760210','35569','Vodafone_ALBANIA'),(815,'2760211','35569','Vodafone_ALBANIA'),(816,'2760212','35569','Vodafone_ALBANIA'),(817,'2760213','35569','Vodafone_ALBANIA'),(818,'2760214','35569','Vodafone_ALBANIA'),(819,'2760215','35569','Vodafone_ALBANIA'),(820,'2760216','35569','Vodafone_ALBANIA'),(821,'2760217','35569','Vodafone_ALBANIA'),(822,'2760218','35569','Vodafone_ALBANIA'),(823,'27602190000','35569','Vodafone_ALBANIA'),(824,'276021900010','35569','Vodafone_ALBANIA'),(825,'276021900011','35569','Vodafone_ALBANIA'),(826,'276021900012','35569','Vodafone_ALBANIA'),(827,'276021900013','35569','Vodafone_ALBANIA'),(828,'2760219000140','35569','Vodafone_ALBANIA'),(829,'2760219000141','35569','Vodafone_ALBANIA'),(830,'2760219000142','35569','Vodafone_ALBANIA'),(831,'2760219000143','35569','Vodafone_ALBANIA'),(832,'2760219000144','35569','Vodafone_ALBANIA'),(833,'27602190001450','35569','Vodafone_ALBANIA'),(834,'27602190001451','35569','Vodafone_ALBANIA'),(835,'27602190001452','35569','Vodafone_ALBANIA'),(836,'27602190001453','35569','Vodafone_ALBANIA'),(837,'27602190001454','35569','Vodafone_ALBANIA'),(838,'27602190001455','35569','Vodafone_ALBANIA'),(839,'27602190001456','35569','Vodafone_ALBANIA'),(840,'27602190001457','35569','Vodafone_ALBANIA'),(841,'276021900014580','35569','Vodafone_ALBANIA'),(842,'276021900014581','35569','Vodafone_ALBANIA'),(843,'276021900014582','35569','Vodafone_ALBANIA'),(844,'276021900014583','35569','Vodafone_ALBANIA'),(845,'276021900014584','35569','Vodafone_ALBANIA'),(846,'276021900014585','35569','Vodafone_ALBANIA'),(847,'276021900014586','35569','Vodafone_ALBANIA'),(848,'276021900014587','35569','Vodafone_ALBANIA'),(849,'276021900014588','35569','Vodafone_ALBANIA'),(850,'276021900014589','35569','Vodafone_ALBANIA'),(851,'276021900014590','35569','Vodafone_ALBANIA'),(852,'276021900014591','35569','Vodafone_ALBANIA'),(853,'276021900014592','35569','Vodafone_ALBANIA'),(854,'276021900014593','35569','Vodafone_ALBANIA'),(855,'276021900014594','35569','Vodafone_ALBANIA'),(856,'276021900014595','35569','Vodafone_ALBANIA'),(857,'276021900014596','35569','Vodafone_ALBANIA'),(858,'276021900014597','35569','Vodafone_ALBANIA'),(859,'276021900014598','35569','Vodafone_ALBANIA'),(860,'276021900014599','35569','Vodafone_ALBANIA'),(861,'2760219000146','35569','Vodafone_ALBANIA'),(862,'2760219000147','35569','Vodafone_ALBANIA'),(863,'2760219000148','35569','Vodafone_ALBANIA'),(864,'2760219000149','35569','Vodafone_ALBANIA'),(865,'276021900015','35569','Vodafone_ALBANIA'),(866,'276021900016','35569','Vodafone_ALBANIA'),(867,'276021900017','35569','Vodafone_ALBANIA'),(868,'276021900018','35569','Vodafone_ALBANIA'),(869,'276021900019','35569','Vodafone_ALBANIA'),(870,'27602190002','35569','Vodafone_ALBANIA'),(871,'27602190003','35569','Vodafone_ALBANIA'),(872,'27602190004','35569','Vodafone_ALBANIA'),(873,'27602190005','35569','Vodafone_ALBANIA'),(874,'27602190006','35569','Vodafone_ALBANIA'),(875,'27602190007','35569','Vodafone_ALBANIA'),(876,'27602190008','35569','Vodafone_ALBANIA'),(877,'27602190009','35569','Vodafone_ALBANIA'),(878,'2760219001','35569','Vodafone_ALBANIA'),(879,'2760219002','35569','Vodafone_ALBANIA'),(880,'2760219003','35569','Vodafone_ALBANIA'),(881,'2760219004','35569','Vodafone_ALBANIA'),(882,'2760219005','35569','Vodafone_ALBANIA'),(883,'2760219006','35569','Vodafone_ALBANIA'),(884,'2760219007','35569','Vodafone_ALBANIA'),(885,'2760219008','35569','Vodafone_ALBANIA'),(886,'2760219009','35569','Vodafone_ALBANIA'),(887,'276021901','35569','Vodafone_ALBANIA'),(888,'276021902','35569','Vodafone_ALBANIA'),(889,'276021903','35569','Vodafone_ALBANIA'),(890,'276021904','35569','Vodafone_ALBANIA'),(891,'276021905','35569','Vodafone_ALBANIA'),(892,'276021906','35569','Vodafone_ALBANIA'),(893,'276021907','35569','Vodafone_ALBANIA'),(894,'276021908','35569','Vodafone_ALBANIA'),(895,'276021909','35569','Vodafone_ALBANIA'),(896,'27602191','35569','Vodafone_ALBANIA'),(897,'27602192','35569','Vodafone_ALBANIA'),(898,'27602193','35569','Vodafone_ALBANIA'),(899,'27602194','35569','Vodafone_ALBANIA'),(900,'27602195','35569','Vodafone_ALBANIA'),(901,'27602196','35569','Vodafone_ALBANIA'),(902,'27602197','35569','Vodafone_ALBANIA'),(903,'27602198','35569','Vodafone_ALBANIA'),(904,'27602199','35569','Vodafone_ALBANIA'),(905,'276022','35569','Vodafone_ALBANIA'),(906,'276023','35569','Vodafone_ALBANIA'),(907,'276024','35569','Vodafone_ALBANIA'),(908,'276025','35569','Vodafone_ALBANIA'),(909,'276026','35569','Vodafone_ALBANIA'),(910,'276027','35569','Vodafone_ALBANIA'),(911,'276028','35569','Vodafone_ALBANIA'),(912,'276029','35569','Vodafone_ALBANIA'),(913,'27801','35694','Vodafone_Malta'),(914,'27821','35679','Mobisle.C.L_Malta'),(915,'28001','35799','ICytamobile_Cyprus_Iran'),(916,'283010000109902','37491','Armentel_Armenia'),(917,'283010000109903','37491','Armentel_Armenia'),(918,'283010000109904','37491','Armentel_Armenia'),(919,'283010000109905','37491','Armentel_Armenia'),(920,'28403','35987','Vivacom_Bulgaria'),(921,'286010','90532','Turkcell_TURKEY'),(922,'286011','90532','Turkcell_TURKEY'),(923,'286012','90532','Turkcell_TURKEY'),(924,'286013','90532','Turkcell_TURKEY'),(925,'286014','90532','Turkcell_TURKEY'),(926,'2860150','90532','Turkcell_TURKEY'),(927,'2860151','90532','Turkcell_TURKEY'),(928,'2860152','90532','Turkcell_TURKEY'),(929,'2860153','90532','Turkcell_TURKEY'),(930,'2860154','90532','Turkcell_TURKEY'),(931,'2860155','90532','Turkcell_TURKEY'),(932,'2860156','90532','Turkcell_TURKEY'),(933,'28601570','90532','Turkcell_TURKEY'),(934,'28601571','90532','Turkcell_TURKEY'),(935,'286015720','90532','Turkcell_TURKEY'),(936,'286015721','90532','Turkcell_TURKEY'),(937,'286015722','90532','Turkcell_TURKEY'),(938,'2860157230','90532','Turkcell_TURKEY'),(939,'2860157231','90532','Turkcell_TURKEY'),(940,'2860157232','90532','Turkcell_TURKEY'),(941,'2860157233','90532','Turkcell_TURKEY'),(942,'2860157234','90532','Turkcell_TURKEY'),(943,'2860157235','90532','Turkcell_TURKEY'),(944,'2860157236','90532','Turkcell_TURKEY'),(945,'2860157237','90532','Turkcell_TURKEY'),(946,'2860157238','90532','Turkcell_TURKEY'),(947,'28601572390','90532','Turkcell_TURKEY'),(948,'28601572391','90532','Turkcell_TURKEY'),(949,'28601572392','90532','Turkcell_TURKEY'),(950,'28601572393','90532','Turkcell_TURKEY'),(951,'28601572394','90532','Turkcell_TURKEY'),(952,'28601572395','90532','Turkcell_TURKEY'),(953,'286015723960','90532','Turkcell_TURKEY'),(954,'28601572396100','90532','Turkcell_TURKEY'),(955,'28601572396101','90532','Turkcell_TURKEY'),(956,'286015723961020','90532','Turkcell_TURKEY'),(957,'286015723961021','90532','Turkcell_TURKEY'),(958,'286015723961022','90532','Turkcell_TURKEY'),(959,'286015723961023','90532','Turkcell_TURKEY'),(960,'286015723961024','90532','Turkcell_TURKEY'),(961,'286015723961025','90532','Turkcell_TURKEY'),(962,'286015723961026','90532','Turkcell_TURKEY'),(963,'286015723961027','90532','Turkcell_TURKEY'),(964,'286015723961028','90532','Turkcell_TURKEY'),(965,'286015723961030','90532','Turkcell_TURKEY'),(966,'286015723961031','90532','Turkcell_TURKEY'),(967,'286015723961032','90532','Turkcell_TURKEY'),(968,'286015723961033','90532','Turkcell_TURKEY'),(969,'286015723961034','90532','Turkcell_TURKEY'),(970,'286015723961035','90532','Turkcell_TURKEY'),(971,'286015723961036','90532','Turkcell_TURKEY'),(972,'286015723961037','90532','Turkcell_TURKEY'),(973,'286015723961038','90532','Turkcell_TURKEY'),(974,'286015723961039','90532','Turkcell_TURKEY'),(975,'28601572396104','90532','Turkcell_TURKEY'),(976,'28601572396105','90532','Turkcell_TURKEY'),(977,'28601572396106','90532','Turkcell_TURKEY'),(978,'28601572396107','90532','Turkcell_TURKEY'),(979,'28601572396108','90532','Turkcell_TURKEY'),(980,'28601572396109','90532','Turkcell_TURKEY'),(981,'2860157239611','90532','Turkcell_TURKEY'),(982,'2860157239612','90532','Turkcell_TURKEY'),(983,'2860157239613','90532','Turkcell_TURKEY'),(984,'2860157239614','90532','Turkcell_TURKEY'),(985,'2860157239615','90532','Turkcell_TURKEY'),(986,'2860157239616','90532','Turkcell_TURKEY'),(987,'2860157239617','90532','Turkcell_TURKEY'),(988,'2860157239618','90532','Turkcell_TURKEY'),(989,'2860157239619','90532','Turkcell_TURKEY'),(990,'286015723962','90532','Turkcell_TURKEY'),(991,'286015723963','90532','Turkcell_TURKEY'),(992,'286015723964','90532','Turkcell_TURKEY'),(993,'286015723965','90532','Turkcell_TURKEY'),(994,'286015723966','90532','Turkcell_TURKEY'),(995,'286015723967','90532','Turkcell_TURKEY'),(996,'286015723968','90532','Turkcell_TURKEY'),(997,'286015723969','90532','Turkcell_TURKEY'),(998,'28601572397','90532','Turkcell_TURKEY'),(999,'28601572398','90532','Turkcell_TURKEY'),(1000,'28601572399','90532','Turkcell_TURKEY'),(1001,'286015724','90532','Turkcell_TURKEY'),(1002,'286015725','90532','Turkcell_TURKEY'),(1003,'286015726','90532','Turkcell_TURKEY'),(1004,'286015727','90532','Turkcell_TURKEY'),(1005,'286015728','90532','Turkcell_TURKEY'),(1006,'286015729','90532','Turkcell_TURKEY'),(1007,'28601573','90532','Turkcell_TURKEY'),(1008,'28601574','90532','Turkcell_TURKEY'),(1009,'28601575','90532','Turkcell_TURKEY'),(1010,'28601576','90532','Turkcell_TURKEY'),(1011,'28601577','90532','Turkcell_TURKEY'),(1012,'28601578','90532','Turkcell_TURKEY'),(1013,'28601579','90532','Turkcell_TURKEY'),(1014,'2860158','90532','Turkcell_TURKEY'),(1015,'2860159','90532','Turkcell_TURKEY'),(1016,'286016','90532','Turkcell_TURKEY'),(1017,'286017','90532','Turkcell_TURKEY'),(1018,'286018','90532','Turkcell_TURKEY'),(1019,'286019','90532','Turkcell_TURKEY'),(1020,'28602','90542','Vodafone_Turkey'),(1021,'28603','90559','Telecom_Turkey'),(1022,'28604','90505','Avea_Turkey'),(1023,'293411100329353','38641','Telekom_Slovenia'),(1024,'293411100329354','38641','Telekom_Slovenia'),(1025,'293411100329355','38641','Telekom_Slovenia'),(1026,'293411100329356','38641','Telekom_Slovenia'),(1027,'293411100329357','38641','Telekom_Slovenia'),(1028,'297039000133574','38268','Mitel_Montenegro'),(1029,'297039000133575','38268','Mitel_Montenegro'),(1030,'297039000133576','38268','Mitel_Montenegro'),(1031,'297039000133577','38268','Mitel_Montenegro'),(1032,'297039000133578','38268','Mitel_Montenegro'),(1033,'302220','164758','TELUS_Canada'),(1034,'302370','151499','Fido_Canada'),(1035,'302500','151442','Videotron_Canada'),(1036,'302610','190561','Bell_Mobily_Canada'),(1037,'302720','170579','Rogers_Canada'),(1038,'302780','130652','Saskatel_Canada'),(1039,'310150','170450','AT\\&T\\'),(1040,'310160','191790','T-MobileUSA'),(1041,'310170','120990','AT\\&T\\'),(1042,'310200','150351','T-MobileUSA'),(1043,'310210','140547','T-MobileUSA'),(1044,'310220','140541','T-MobileUSA'),(1045,'310230','180185','T-Mobile_USA'),(1046,'310240','150545','T-MobileUSA'),(1047,'310250','180825','T-MobileUSA'),(1048,'3102600','140547','T-MobileUSA'),(1049,'31026010','140547','T-MobileUSA'),(1050,'310260110','140547','T-MobileUSA'),(1051,'310260111','140547','T-MobileUSA'),(1052,'310260112','140547','T-MobileUSA'),(1053,'310260113','140547','T-MobileUSA'),(1054,'310260114','140547','T-MobileUSA'),(1055,'310260115','140547','T-MobileUSA'),(1056,'310260116','140547','T-MobileUSA'),(1057,'3102601170','140547','T-MobileUSA'),(1058,'3102601171','140547','T-MobileUSA'),(1059,'31026011720','140547','T-MobileUSA'),(1060,'310260117210','140547','T-MobileUSA'),(1061,'310260117211','140547','T-MobileUSA'),(1062,'310260117212','140547','T-MobileUSA'),(1063,'310260117213','140547','T-MobileUSA'),(1064,'310260117214','140547','T-MobileUSA'),(1065,'310260117215','140547','T-MobileUSA'),(1066,'310260117216','140547','T-MobileUSA'),(1067,'310260117217','140547','T-MobileUSA'),(1068,'310260117218','140547','T-MobileUSA'),(1069,'3102601172190','140547','T-MobileUSA'),(1070,'3102601172191','140547','T-MobileUSA'),(1071,'3102601172192','140547','T-MobileUSA'),(1072,'3102601172193','140547','T-MobileUSA'),(1073,'3102601172194','140547','T-MobileUSA'),(1074,'310260117219500','140547','T-MobileUSA'),(1075,'310260117219501','140547','T-MobileUSA'),(1076,'310260117219502','140547','T-MobileUSA'),(1077,'310260117219503','140547','T-MobileUSA'),(1078,'310260117219504','140547','T-MobileUSA'),(1079,'310260117219505','140547','T-MobileUSA'),(1080,'310260117219506','140547','T-MobileUSA'),(1081,'310260117219507','140547','T-MobileUSA'),(1082,'310260117219508','140547','T-MobileUSA'),(1083,'310260117219509','140547','T-MobileUSA'),(1084,'31026011721951','140547','T-MobileUSA'),(1085,'31026011721952','140547','T-MobileUSA'),(1086,'31026011721953','140547','T-MobileUSA'),(1087,'31026011721954','140547','T-MobileUSA'),(1088,'31026011721955','140547','T-MobileUSA'),(1089,'31026011721956','140547','T-MobileUSA'),(1090,'31026011721957','140547','T-MobileUSA'),(1091,'31026011721958','140547','T-MobileUSA'),(1092,'31026011721959','140547','T-MobileUSA'),(1093,'3102601172196','140547','T-MobileUSA'),(1094,'3102601172197','140547','T-MobileUSA'),(1095,'3102601172198','140547','T-MobileUSA'),(1096,'3102601172199','140547','T-MobileUSA'),(1097,'31026011722','140547','T-MobileUSA'),(1098,'31026011723','140547','T-MobileUSA'),(1099,'31026011724','140547','T-MobileUSA'),(1100,'31026011725','140547','T-MobileUSA'),(1101,'31026011726','140547','T-MobileUSA'),(1102,'31026011727','140547','T-MobileUSA'),(1103,'31026011728','140547','T-MobileUSA'),(1104,'31026011729','140547','T-MobileUSA'),(1105,'3102601173','140547','T-MobileUSA'),(1106,'3102601174','140547','T-MobileUSA'),(1107,'3102601175','140547','T-MobileUSA'),(1108,'3102601176','140547','T-MobileUSA'),(1109,'3102601177','140547','T-MobileUSA'),(1110,'3102601178','140547','T-MobileUSA'),(1111,'3102601179','140547','T-MobileUSA'),(1112,'310260118','140547','T-MobileUSA'),(1113,'310260119','140547','T-MobileUSA'),(1114,'31026012','140547','T-MobileUSA'),(1115,'31026013','140547','T-MobileUSA'),(1116,'31026014','140547','T-MobileUSA'),(1117,'31026015','140547','T-MobileUSA'),(1118,'31026016','140547','T-MobileUSA'),(1119,'31026017','140547','T-MobileUSA'),(1120,'31026018','140547','T-MobileUSA'),(1121,'31026019','140547','T-MobileUSA'),(1122,'3102602','140547','T-MobileUSA'),(1123,'3102603','140547','T-MobileUSA'),(1124,'3102604','140547','T-MobileUSA'),(1125,'3102605','140547','T-MobileUSA'),(1126,'3102606','140547','T-MobileUSA'),(1127,'3102607','140547','T-MobileUSA'),(1128,'3102608','140547','T-MobileUSA'),(1129,'3102609','140547','T-MobileUSA'),(1130,'310270','133433','T-MobileUSA'),(1131,'310310','181326','T-MobileUSA'),(1132,'310380','197037','AT\\&T_Mobility'),(1133,'310410','131231','AT\\&T_USA'),(1134,'310420','151324','CBW_USA'),(1135,'310490','170434','T-MobileUSA'),(1136,'310580','171720','T-Mobile\\'),(1137,'310660','140445','T-Mobile\\'),(1138,'310800','164662','T-Mobile\\'),(1139,'311270','190370299','Verizon_USA'),(1140,'311480','190370299','Verizon_USA'),(1141,'334020','52941','Telecel_Mexico'),(1142,'334030','52942','Telefonica_Mexico'),(1143,'33420','52941','Telecel_Mexico'),(1144,'338050000539871','1876380','Digicel_Group'),(1145,'338050000539872','1876380','Digicel_Group'),(1146,'338050019742111','1876380','Digicel_Group'),(1147,'338050019742112','1876380','Digicel_Group'),(1148,'370020019561818','182996','Claro_Dominicana'),(1149,'370020223285967','182996','Claro_Dominicana'),(1150,'370020223285968','182996','Claro_Dominicana'),(1151,'370020223285969','182996','Claro_Dominicana'),(1152,'370020223285970','182996','Claro_Dominicana'),(1153,'370020223285971','182996','Claro_Dominicana'),(1154,'40001','99450','Azecell_Azerbaijan'),(1155,'400027010383903','99455','Backcell_Azerbaijan'),(1156,'400027010383904','99455','Backcell_Azerbaijan'),(1157,'400027010383905','99455','Backcell_Azerbaijan'),(1158,'400027010383906','99455','Backcell_Azerbaijan'),(1159,'400027010383907','99455','Backcell_Azerbaijan'),(1160,'400027010383908','99455','Backcell_Azerbaijan'),(1161,'400027010383956','99455','Backcell_Azerbaijan'),(1162,'400027010383957','99455','Backcell_Azerbaijan'),(1163,'400027010383958','99455','Backcell_Azerbaijan'),(1164,'400027010383959','99455','Backcell_Azerbaijan'),(1165,'40004','99470','Azerfon_LLC_Azerbaijan'),(1166,'401015577806612','7705','Kar-tel_Kazakhstan'),(1167,'401015577806613','7705','Kar-tel_Kazakhstan'),(1168,'401015577806615','7705','Kar-tel_Kazakhstan'),(1169,'401018000000109','7057','KAR_TEL_KAZAKHSTAN'),(1170,'401018000000110','7057','KAR_TEL_KAZAKHSTAN'),(1171,'401018000000111','7057','KAR_TEL_KAZAKHSTAN'),(1172,'401018000000112','7057','KAR_TEL_KAZAKHSTAN'),(1173,'40402','919815','AIRTEL_Bharti_india_Punjab'),(1174,'40403','919816','AIRTEL_Bharti_india_Himachal_Pradesh'),(1175,'40405','919825','Vodafone_West_India'),(1176,'40410','919810','AIRTEL_Bharti_india_Delhi'),(1177,'40411','919811','Vodafone_Essar_Mobile_India'),(1178,'40416','919810','Bharti_Airtel'),(1179,'40420','919820','VODAFONE_India'),(1180,'40421','919821','LoopMobile_India'),(1181,'40427','919823','Vodafone_MAHARASHTRA_India'),(1182,'40430','919830','VODAFONE_East_India'),(1183,'40431','919831','AIRTEL_Bharti_india_Kolkata'),(1184,'40440','919840','AIRTEL_Bharti\\'),(1185,'40445','919845','AIRTEL_Bharti_india_Karnataka'),(1186,'40449','919849','AIRTEL_Bharti_india_Andhra_Pradesh'),(1187,'40470','919829','AIRTEL_Bharti_india_Rajasthan'),(1188,'40490','919890','AIRTEL_Bharti_india_Maharashtra'),(1189,'40492','919892','AIRTEL_Bharti_india_Mumbai'),(1190,'40493','919893','AIRTEL_Bharti_india_Madhya_pradesh'),(1191,'40494','919894','AIRTEL_Bharti_india_Tamil'),(1192,'40495','919895','AIRTEL_Bharti_india_Kerala'),(1193,'40496','919896','AIRTEL_Bharti_india_Haryana'),(1194,'40497','919897','AIRTEL_Bharti_india_Uttar_Pradesh_West'),(1195,'40498','919898','AIRTEL_Bharti_india_Gujar'),(1196,'405025','919030','TATA_Docomo_India'),(1197,'405027','919031','TATA_Docomo_India'),(1198,'405029','917796','TATA_Docomo_India'),(1199,'405030','919033','TATA_Docomo_India'),(1200,'405031','919034','TATA_Docomo_India'),(1201,'405032','918091','TATA_Docomo_India'),(1202,'405034','919036','TATA_Docomo_India'),(1203,'405035','919037','TATA_Docomo_India'),(1204,'405036','919038','TATA_Docomo_India'),(1205,'405037','919028','TATA_Docomo_India'),(1206,'405038','919039','TATA_Docomo_India'),(1207,'405039','919029','TATA_Docomo_India'),(1208,'405041','919040','TATA_Docomo_India'),(1209,'405042','919041','TATA_Docomo_India'),(1210,'405043','917737','TATA_Docomo_India'),(1211,'405044','919043','TATA_Docomo_India'),(1212,'405045','919044','TATA_Docomo_India'),(1213,'405046','919045','TATA_Docomo_India'),(1214,'405047','919046','TATA_Docomo_India'),(1215,'40551','919810','Bharti_Airtel'),(1216,'40552','919810','Bharti_Airtel'),(1217,'40553','919810','Bharti_Airtel'),(1218,'40554','919810','Bharti_Airtel'),(1219,'40555','919810','Bharti_Airtel'),(1220,'40556','919810','Bharti_Airtel'),(1221,'41004','9231','CMPak_Pakistan'),(1222,'41006','92345','Telenor_Pakistan'),(1223,'41007','92321','Warid_Tel_Pakistan'),(1224,'412012200202902','9370','Afghanistan_Wireless'),(1225,'412012200202903','9370','Afghanistan_Wireless'),(1226,'412500219534483','9378','Etisalat_Afghanistan'),(1227,'412500219534484','9378','Etisalat_Afghanistan'),(1228,'412500219534485','9378','Etisalat_Afghanistan'),(1229,'412500219534486','9378','Etisalat_Afghanistan'),(1230,'412500219534487','9378','Etisalat_Afghanistan'),(1231,'412500219534488','9378','Etisalat_Afghanistan'),(1232,'412500219534489','9378','Etisalat_Afghanistan'),(1233,'412500219534490','9378','Etisalat_Afghanistan'),(1234,'412500219534491','9378','Etisalat_Afghanistan'),(1235,'412500219534492','9378','Etisalat_Afghanistan'),(1236,'41301','9471','Mobitel_Sirilanka'),(1237,'41302','9477','Dialog_SriLanka'),(1238,'41405','95997','Ooredoo_Myanmar'),(1239,'41501','96134','MIC1_Libanon'),(1240,'41503','96139','MIC2_Lebanon'),(1241,'41601','96279','Zain_Jordan'),(1242,'41603','96278','UMNIAH_JORDAN'),(1243,'41677','96277','Orange_Jordan'),(1244,'41701','96393','Syriatel_Syria'),(1245,'41702','96394','MTN-SYRIA'),(1246,'418050001949738','9647701','Asiacell_IRQ'),(1247,'418050001949741','9647701','Asiacell_IRQ'),(1248,'41820','9647802','Zain_Iraq'),(1249,'41830','96479','Iraqna_Iraq'),(1250,'41902','96596','Zain_Kuwait'),(1251,'41903','9656','Ooredoo_Kuwait'),(1252,'41904','965500','KTC_Viva_Kuwait'),(1253,'42001','96650','Aljawal_Saudi'),(1254,'42003','96656','Mobily_Saudi'),(1255,'4200400','96659','Zain_Saudi'),(1256,'4200401','96659','Zain_Saudi'),(1257,'42004020','96659','Zain_Saudi'),(1258,'42004021','96659','Zain_Saudi'),(1259,'420040220','96659','Zain_Saudi'),(1260,'420040221','96659','Zain_Saudi'),(1261,'420040222','96659','Zain_Saudi'),(1262,'420040223','96659','Zain_Saudi'),(1263,'420040224','96659','Zain_Saudi'),(1264,'420040225','96659','Zain_Saudi'),(1265,'4200402260','96659','Zain_Saudi'),(1266,'4200402261','96659','Zain_Saudi'),(1267,'4200402262','96659','Zain_Saudi'),(1268,'4200402263','96659','Zain_Saudi'),(1269,'4200402264','96659','Zain_Saudi'),(1270,'4200402265','96659','Zain_Saudi'),(1271,'4200402266','96659','Zain_Saudi'),(1272,'4200402267','96659','Zain_Saudi'),(1273,'4200402268','96659','Zain_Saudi'),(1274,'42004022690','96659','Zain_Saudi'),(1275,'42004022691','96659','Zain_Saudi'),(1276,'42004022692','96659','Zain_Saudi'),(1277,'42004022693','96659','Zain_Saudi'),(1278,'420040226940','96659','Zain_Saudi'),(1279,'420040226941','96659','Zain_Saudi'),(1280,'420040226942','96659','Zain_Saudi'),(1281,'420040226943','96659','Zain_Saudi'),(1282,'420040226944','96659','Zain_Saudi'),(1283,'4200402269450','96659','Zain_Saudi'),(1284,'4200402269451','96659','Zain_Saudi'),(1285,'4200402269452','96659','Zain_Saudi'),(1286,'4200402269453','96659','Zain_Saudi'),(1287,'4200402269454','96659','Zain_Saudi'),(1288,'4200402269455','96659','Zain_Saudi'),(1289,'42004022694560','96659','Zain_Saudi'),(1290,'42004022694561','96659','Zain_Saudi'),(1291,'42004022694562','96659','Zain_Saudi'),(1292,'42004022694563','96659','Zain_Saudi'),(1293,'420040226945640','96659','Zain_Saudi'),(1294,'420040226945641','96659','Zain_Saudi'),(1295,'420040226945642','96659','Zain_Saudi'),(1296,'420040226945643','96659','Zain_Saudi'),(1297,'420040226945644','96659','Zain_Saudi'),(1298,'420040226945645','96659','Zain_Saudi'),(1299,'420040226945646','96659','Zain_Saudi'),(1300,'420040226945647','96659','Zain_Saudi'),(1301,'420040226945648','96659','Zain_Saudi'),(1302,'420040226945649','96659','Zain_Saudi'),(1303,'42004022694565','96659','Zain_Saudi'),(1304,'42004022694566','96659','Zain_Saudi'),(1305,'42004022694567','96659','Zain_Saudi'),(1306,'42004022694568','96659','Zain_Saudi'),(1307,'42004022694569','96659','Zain_Saudi'),(1308,'4200402269457','96659','Zain_Saudi'),(1309,'4200402269458','96659','Zain_Saudi'),(1310,'4200402269459','96659','Zain_Saudi'),(1311,'420040226946','96659','Zain_Saudi'),(1312,'420040226947','96659','Zain_Saudi'),(1313,'420040226948','96659','Zain_Saudi'),(1314,'420040226949','96659','Zain_Saudi'),(1315,'42004022695','96659','Zain_Saudi'),(1316,'42004022696','96659','Zain_Saudi'),(1317,'42004022697','96659','Zain_Saudi'),(1318,'42004022698','96659','Zain_Saudi'),(1319,'42004022699','96659','Zain_Saudi'),(1320,'420040227','96659','Zain_Saudi'),(1321,'420040228','96659','Zain_Saudi'),(1322,'420040229','96659','Zain_Saudi'),(1323,'42004023','96659','Zain_Saudi'),(1324,'42004024','96659','Zain_Saudi'),(1325,'42004025','96659','Zain_Saudi'),(1326,'42004026','96659','Zain_Saudi'),(1327,'42004027','96659','Zain_Saudi'),(1328,'42004028','96659','Zain_Saudi'),(1329,'42004029','96659','Zain_Saudi'),(1330,'4200403','96659','Zain_Saudi'),(1331,'4200404','96659','Zain_Saudi'),(1332,'4200405','96659','Zain_Saudi'),(1333,'4200406','96659','Zain_Saudi'),(1334,'4200407','96659','Zain_Saudi'),(1335,'4200408','96659','Zain_Saudi'),(1336,'4200409','96659','Zain_Saudi'),(1337,'420041','96659','Zain_Saudi'),(1338,'420042','96659','Zain_Saudi'),(1339,'420043','96659','Zain_Saudi'),(1340,'420044','96659','Zain_Saudi'),(1341,'420045','96659','Zain_Saudi'),(1342,'420046','96659','Zain_Saudi'),(1343,'420047','96659','Zain_Saudi'),(1344,'420048','96659','Zain_Saudi'),(1345,'420049','96659','Zain_Saudi'),(1346,'42005','966570','SAUVG_KSA'),(1347,'42101','96771','Sabafon_Yemen'),(1348,'42202','96892','Omantel_Oman'),(1349,'42203','96895','Ooredoo_Oman'),(1350,'424020','97150','Etisalat_UAE'),(1351,'424021','97150','Etisalat_UAE'),(1352,'424022','97150','Etisalat_UAE'),(1353,'424023','97150','Etisalat_UAE'),(1354,'424024','97150','Etisalat_UAE'),(1355,'424025','97150','Etisalat_UAE'),(1356,'42402601','97150','Etisalat_UAE'),(1357,'424026020','97150','Etisalat_UAE'),(1358,'424026021','97150','Etisalat_UAE'),(1359,'424026022','97150','Etisalat_UAE'),(1360,'424026023','97150','Etisalat_UAE'),(1361,'424026024000','97150','Etisalat_UAE'),(1362,'424026024001','97150','Etisalat_UAE'),(1363,'424026024002','97150','Etisalat_UAE'),(1364,'4240260240030','97150','Etisalat_UAE'),(1365,'4240260240031','97150','Etisalat_UAE'),(1366,'4240260240032','97150','Etisalat_UAE'),(1367,'4240260240033','97150','Etisalat_UAE'),(1368,'4240260240034','97150','Etisalat_UAE'),(1369,'4240260240035','97150','Etisalat_UAE'),(1370,'42402602400360','97150','Etisalat_UAE'),(1371,'42402602400361','97150','Etisalat_UAE'),(1372,'42402602400362','97150','Etisalat_UAE'),(1373,'42402602400363','97150','Etisalat_UAE'),(1374,'42402602400364','97150','Etisalat_UAE'),(1375,'42402602400365','97150','Etisalat_UAE'),(1376,'42402602400366','97150','Etisalat_UAE'),(1377,'42402602400367','97150','Etisalat_UAE'),(1378,'424026024003680','97150','Etisalat_UAE'),(1379,'424026024003681','97150','Etisalat_UAE'),(1380,'424026024003682','97150','Etisalat_UAE'),(1381,'424026024003683','97150','Etisalat_UAE'),(1382,'424026024003684','97150','Etisalat_UAE'),(1383,'424026024003685','97150','Etisalat_UAE'),(1384,'424026024003686','97150','Etisalat_UAE'),(1385,'424026024003687','97150','Etisalat_UAE'),(1386,'424026024003688','97150','Etisalat_UAE'),(1387,'424026024003689','97150','Etisalat_UAE'),(1388,'42402602400369','97150','Etisalat_UAE'),(1389,'4240260240037','97150','Etisalat_UAE'),(1390,'4240260240038','97150','Etisalat_UAE'),(1391,'4240260240039','97150','Etisalat_UAE'),(1392,'424026024004','97150','Etisalat_UAE'),(1393,'424026024005','97150','Etisalat_UAE'),(1394,'424026024006','97150','Etisalat_UAE'),(1395,'424026024007','97150','Etisalat_UAE'),(1396,'424026024008','97150','Etisalat_UAE'),(1397,'424026024009','97150','Etisalat_UAE'),(1398,'42402602401','97150','Etisalat_UAE'),(1399,'42402602402','97150','Etisalat_UAE'),(1400,'42402602403','97150','Etisalat_UAE'),(1401,'42402602404','97150','Etisalat_UAE'),(1402,'42402602405','97150','Etisalat_UAE'),(1403,'42402602406','97150','Etisalat_UAE'),(1404,'42402602407','97150','Etisalat_UAE'),(1405,'42402602408','97150','Etisalat_UAE'),(1406,'42402602409','97150','Etisalat_UAE'),(1407,'4240260241','97150','Etisalat_UAE'),(1408,'4240260242','97150','Etisalat_UAE'),(1409,'4240260243','97150','Etisalat_UAE'),(1410,'4240260244','97150','Etisalat_UAE'),(1411,'4240260245','97150','Etisalat_UAE'),(1412,'4240260246','97150','Etisalat_UAE'),(1413,'4240260247','97150','Etisalat_UAE'),(1414,'4240260248','97150','Etisalat_UAE'),(1415,'4240260249','97150','Etisalat_UAE'),(1416,'424026025','97150','Etisalat_UAE'),(1417,'424026026','97150','Etisalat_UAE'),(1418,'424026027','97150','Etisalat_UAE'),(1419,'424026028','97150','Etisalat_UAE'),(1420,'424026029','97150','Etisalat_UAE'),(1421,'42402603','97150','Etisalat_UAE'),(1422,'42402604','97150','Etisalat_UAE'),(1423,'42402605','97150','Etisalat_UAE'),(1424,'42402606','97150','Etisalat_UAE'),(1425,'42402607','97150','Etisalat_UAE'),(1426,'42402608','97150','Etisalat_UAE'),(1427,'42402609','97150','Etisalat_UAE'),(1428,'4240261','97150','Etisalat_UAE'),(1429,'4240262','97150','Etisalat_UAE'),(1430,'4240263','97150','Etisalat_UAE'),(1431,'4240264','97150','Etisalat_UAE'),(1432,'4240265','97150','Etisalat_UAE'),(1433,'4240266','97150','Etisalat_UAE'),(1434,'4240267','97150','Etisalat_UAE'),(1435,'4240268','97150','Etisalat_UAE'),(1436,'4240269','97150','Etisalat_UAE'),(1437,'424027','97150','Etisalat_UAE'),(1438,'424028','97150','Etisalat_UAE'),(1439,'424029','97150','Etisalat_UAE'),(1440,'4240300','97155','Du_UAE'),(1441,'4240301','97155','Du_UAE'),(1442,'42403020','97155','Du_UAE'),(1443,'424030210','97155','Du_UAE'),(1444,'424030211','97155','Du_UAE'),(1445,'424030212','97155','Du_UAE'),(1446,'424030213','97155','Du_UAE'),(1447,'424030214','97155','Du_UAE'),(1448,'424030215','97155','Du_UAE'),(1449,'4240302160','97155','Du_UAE'),(1450,'42403021610','97155','Du_UAE'),(1451,'42403021611','97155','Du_UAE'),(1452,'424030216120','97155','Du_UAE'),(1453,'424030216121','97155','Du_UAE'),(1454,'424030216122','97155','Du_UAE'),(1455,'4240302161230','97155','Du_UAE'),(1456,'4240302161231','97155','Du_UAE'),(1457,'42403021612320','97155','Du_UAE'),(1458,'42403021612321','97155','Du_UAE'),(1459,'42403021612322','97155','Du_UAE'),(1460,'42403021612323','97155','Du_UAE'),(1461,'42403021612324','97155','Du_UAE'),(1462,'424030216123250','97155','Du_UAE'),(1463,'424030216123251','97155','Du_UAE'),(1464,'424030216123252','97155','Du_UAE'),(1465,'424030216123253','97155','Du_UAE'),(1466,'424030216123254','97155','Du_UAE'),(1467,'424030216123255','97155','Du_UAE'),(1468,'424030216123256','97155','Du_UAE'),(1469,'424030216123257','97155','Du_UAE'),(1470,'424030216123258','97155','Du_UAE'),(1471,'424030216123259','97155','Du_UAE'),(1472,'42403021612326','97155','Du_UAE'),(1473,'42403021612327','97155','Du_UAE'),(1474,'42403021612328','97155','Du_UAE'),(1475,'42403021612329','97155','Du_UAE'),(1476,'4240302161233','97155','Du_UAE'),(1477,'4240302161234','97155','Du_UAE'),(1478,'4240302161235','97155','Du_UAE'),(1479,'4240302161236','97155','Du_UAE'),(1480,'4240302161237','97155','Du_UAE'),(1481,'4240302161238','97155','Du_UAE'),(1482,'4240302161239','97155','Du_UAE'),(1483,'424030216124','97155','Du_UAE'),(1484,'424030216125','97155','Du_UAE'),(1485,'424030216126','97155','Du_UAE'),(1486,'424030216127','97155','Du_UAE'),(1487,'424030216128','97155','Du_UAE'),(1488,'424030216129','97155','Du_UAE'),(1489,'42403021613','97155','Du_UAE'),(1490,'42403021614','97155','Du_UAE'),(1491,'42403021615','97155','Du_UAE'),(1492,'42403021616','97155','Du_UAE'),(1493,'42403021617','97155','Du_UAE'),(1494,'42403021618','97155','Du_UAE'),(1495,'42403021619','97155','Du_UAE'),(1496,'4240302162','97155','Du_UAE'),(1497,'4240302163','97155','Du_UAE'),(1498,'4240302164','97155','Du_UAE'),(1499,'4240302165','97155','Du_UAE'),(1500,'4240302166','97155','Du_UAE'),(1501,'4240302167','97155','Du_UAE'),(1502,'4240302168','97155','Du_UAE'),(1503,'4240302169','97155','Du_UAE'),(1504,'424030217','97155','Du_UAE'),(1505,'424030218','97155','Du_UAE'),(1506,'424030219','97155','Du_UAE'),(1507,'42403022','97155','Du_UAE'),(1508,'42403023','97155','Du_UAE'),(1509,'42403024','97155','Du_UAE'),(1510,'42403025','97155','Du_UAE'),(1511,'42403026','97155','Du_UAE'),(1512,'42403027','97155','Du_UAE'),(1513,'42403028','97155','Du_UAE'),(1514,'42403029','97155','Du_UAE'),(1515,'4240303','97155','Du_UAE'),(1516,'4240304','97155','Du_UAE'),(1517,'4240305','97155','Du_UAE'),(1518,'4240306','97155','Du_UAE'),(1519,'4240307','97155','Du_UAE'),(1520,'4240308','97155','Du_UAE'),(1521,'4240309','97155','Du_UAE'),(1522,'424031','97155','Du_UAE'),(1523,'424032','97155','Du_UAE'),(1524,'424033','97155','Du_UAE'),(1525,'424034','97155','Du_UAE'),(1526,'424035','97155','Du_UAE'),(1527,'424036','97155','Du_UAE'),(1528,'424037','97155','Du_UAE'),(1529,'424038','97155','Du_UAE'),(1530,'424039','97155','Du_UAE'),(1531,'42506','97256','Wataniya_Oalestine'),(1532,'42601','97339','Batelco_Bahrain'),(1533,'42602','97336','Zain_Bahrain'),(1534,'42604','97333','VIVA_BAHRAIN'),(1535,'42701','97455','Qtel_Qatar'),(1536,'42702','97477','Vodafone_Qatar'),(1537,'42888','97688','UNITEL_MONGOLIE'),(1538,'432110100943200','98911','MobileTelecom_IRAN'),(1539,'432110100943201','98911','MobileTelecom_IRAN'),(1540,'432110200187192','98911','MobileTelecom_IRAN'),(1541,'432110200187193','98911','MobileTelecom_IRAN'),(1542,'43220','98920','Rightel_IRAN'),(1543,'43235','98935','MTN_IRAN'),(1544,'43404','99890','UNITEL_UZBAKISTAN'),(1545,'43709','99670','NurTelekom_Kyrgyztan'),(1546,'44010','8190542','NTT_DOCOMO_JAPAN'),(1547,'44050','8180931','KDDI_JAPAN'),(1548,'44051','8180984','KDDI_JAPAN_2'),(1549,'450081210001404','8210291','KT_KOREA'),(1550,'450081210001405','8210291','KT_KOREA'),(1551,'45201','8490','MobiFone_Vietnam'),(1552,'45400','852902','CSL_Hongkong'),(1553,'45403','852633','Hutchison_Hongkong_3G'),(1554,'45404','852949','Hutchison_Hongkong'),(1555,'45412','852920','Peoples_HongKong'),(1556,'454161103730079','852923','HongKong_Telecom2G'),(1557,'454161103730080','852923','HongKong_Telecom2G'),(1558,'454195000450707','852923','Hong-Kong_Telecom3G'),(1559,'454195000450708','852923','Hong-Kong_Telecom3G'),(1560,'45501','85368989','CTM_Macau'),(1561,'45618','85511','Mfone_Cambodia'),(1562,'460000153141128','86139','China_Mobile'),(1563,'46001','86130','Unicom_China'),(1564,'460020396050120','86138','China_Mobile'),(1565,'460077110753652','86157','China_Mobile'),(1566,'460079144822872','86157','China_Mobile'),(1567,'46009','86186','Unicom_China'),(1568,'46689','886986','starTelecom_Taiwan'),(1569,'47002','88018','Robi_Bangladesh'),(1570,'470070030023637','88016','Airtel_Bengladech'),(1571,'470070030023638','88016','Airtel_Bengladech'),(1572,'470070030023639','88016','Airtel_Bengladech'),(1573,'47202','96096','Ooredoo_Maldives'),(1574,'50212','6012','Maxis_Malaysia'),(1575,'50218','6018','uMobile-Malysia'),(1576,'50503','61415','Vodafone_Australia'),(1577,'51001','62816','Indosat_Indonesia'),(1578,'51010','62811','TELKOMSELINDONESI'),(1579,'514010073640010','67073','Telkomcel_Timor'),(1580,'514010073640011','67073','Telkomcel_Timor'),(1581,'514010073640012','67073','Telkomcel_Timor'),(1582,'514010073640013','67073','Telkomcel_Timor'),(1583,'51502','63917','Globe_Telecom_Philippines'),(1584,'51503','63918','SMART_PHILLIPINES'),(1585,'52000','66830','True-Move_Thailand'),(1586,'520044000035700','66938','True-Move_Thailand'),(1587,'520044000035701','66938','True-Move_Thailand'),(1588,'520044000035702','66938','True-Move_Thailand'),(1589,'52005','66950','DTAC_Thailand'),(1590,'52503','659','MobileOneLtd_Singapore'),(1591,'52811','67387','DST_Brunei'),(1592,'53001','6421','Vodafone_NewZealand'),(1593,'53024','6422','Two-Degrees_NewZealand'),(1594,'547200105044497','68987','Vini-French_Polenysia'),(1595,'547200105044498','68987','Vini-French_Polenysia'),(1596,'547200105044499','68987','Vini-French_Polenysia'),(1597,'547200105044500','68987','Vini-French_Polenysia'),(1598,'547200105044501','68987','Vini-French_Polenysia'),(1599,'60201','2012','Mobinil_EGYPT'),(1600,'60202','2010','Vodafone_Egypt'),(1601,'6020300','2011','Etisalat_Egypt'),(1602,'6020301','2011','Etisalat_Egypt'),(1603,'6020302','2011','Etisalat_Egypt'),(1604,'6020303','2011','Etisalat_Egypt'),(1605,'6020304','2011','Etisalat_Egypt'),(1606,'6020305','2011','Etisalat_Egypt'),(1607,'6020306','2011','Etisalat_Egypt'),(1608,'6020307','2011','Etisalat_Egypt'),(1609,'6020308','2011','Etisalat_Egypt'),(1610,'60203090','2011','Etisalat_Egypt'),(1611,'60203091','2011','Etisalat_Egypt'),(1612,'60203092','2011','Etisalat_Egypt'),(1613,'60203093','2011','Etisalat_Egypt'),(1614,'60203094','2011','Etisalat_Egypt'),(1615,'60203095','2011','Etisalat_Egypt'),(1616,'602030960','2011','Etisalat_Egypt'),(1617,'602030961','2011','Etisalat_Egypt'),(1618,'602030962','2011','Etisalat_Egypt'),(1619,'602030963','2011','Etisalat_Egypt'),(1620,'602030964','2011','Etisalat_Egypt'),(1621,'602030965','2011','Etisalat_Egypt'),(1622,'602030966','2011','Etisalat_Egypt'),(1623,'6020309670','2011','Etisalat_Egypt'),(1624,'60203096710','2011','Etisalat_Egypt'),(1625,'60203096711','2011','Etisalat_Egypt'),(1626,'6020309671200','2011','Etisalat_Egypt'),(1627,'6020309671201','2011','Etisalat_Egypt'),(1628,'60203096712020','2011','Etisalat_Egypt'),(1629,'60203096712021','2011','Etisalat_Egypt'),(1630,'60203096712022','2011','Etisalat_Egypt'),(1631,'60203096712023','2011','Etisalat_Egypt'),(1632,'60203096712024','2011','Etisalat_Egypt'),(1633,'602030967120250','2011','Etisalat_Egypt'),(1634,'602030967120251','2011','Etisalat_Egypt'),(1635,'602030967120252','2011','Etisalat_Egypt'),(1636,'602030967120253','2011','Etisalat_Egypt'),(1637,'602030967120254','2011','Etisalat_Egypt'),(1638,'602030967120255','2011','Etisalat_Egypt'),(1639,'602030967120256','2011','Etisalat_Egypt'),(1640,'602030967120257','2011','Etisalat_Egypt'),(1641,'602030967120258','2011','Etisalat_Egypt'),(1642,'602030967120259','2011','Etisalat_Egypt'),(1643,'60203096712026','2011','Etisalat_Egypt'),(1644,'60203096712027','2011','Etisalat_Egypt'),(1645,'60203096712028','2011','Etisalat_Egypt'),(1646,'60203096712029','2011','Etisalat_Egypt'),(1647,'6020309671203','2011','Etisalat_Egypt'),(1648,'6020309671204','2011','Etisalat_Egypt'),(1649,'6020309671205','2011','Etisalat_Egypt'),(1650,'6020309671206','2011','Etisalat_Egypt'),(1651,'6020309671207','2011','Etisalat_Egypt'),(1652,'6020309671208','2011','Etisalat_Egypt'),(1653,'6020309671209','2011','Etisalat_Egypt'),(1654,'602030967121','2011','Etisalat_Egypt'),(1655,'602030967122','2011','Etisalat_Egypt'),(1656,'602030967123','2011','Etisalat_Egypt'),(1657,'602030967124','2011','Etisalat_Egypt'),(1658,'602030967125','2011','Etisalat_Egypt'),(1659,'602030967126','2011','Etisalat_Egypt'),(1660,'602030967127','2011','Etisalat_Egypt'),(1661,'602030967128','2011','Etisalat_Egypt'),(1662,'602030967129','2011','Etisalat_Egypt'),(1663,'60203096713','2011','Etisalat_Egypt'),(1664,'60203096714','2011','Etisalat_Egypt'),(1665,'60203096715','2011','Etisalat_Egypt'),(1666,'60203096716','2011','Etisalat_Egypt'),(1667,'60203096717','2011','Etisalat_Egypt'),(1668,'60203096718','2011','Etisalat_Egypt'),(1669,'60203096719','2011','Etisalat_Egypt'),(1670,'6020309672','2011','Etisalat_Egypt'),(1671,'6020309673','2011','Etisalat_Egypt'),(1672,'6020309674','2011','Etisalat_Egypt'),(1673,'6020309675','2011','Etisalat_Egypt'),(1674,'6020309676','2011','Etisalat_Egypt'),(1675,'6020309677','2011','Etisalat_Egypt'),(1676,'6020309678','2011','Etisalat_Egypt'),(1677,'6020309679','2011','Etisalat_Egypt'),(1678,'602030968','2011','Etisalat_Egypt'),(1679,'602030969','2011','Etisalat_Egypt'),(1680,'60203097','2011','Etisalat_Egypt'),(1681,'60203098','2011','Etisalat_Egypt'),(1682,'60203099','2011','Etisalat_Egypt'),(1683,'602031','2011','Etisalat_Egypt'),(1684,'602032','2011','Etisalat_Egypt'),(1685,'602033','2011','Etisalat_Egypt'),(1686,'602034','2011','Etisalat_Egypt'),(1687,'602035','2011','Etisalat_Egypt'),(1688,'602036','2011','Etisalat_Egypt'),(1689,'602037','2011','Etisalat_Egypt'),(1690,'602038','2011','Etisalat_Egypt'),(1691,'602039','2011','Etisalat_Egypt'),(1692,'60301','21366','NULL'),(1693,'60400','2126639','Meditel_Morocco'),(1694,'60401','212661','Maroc_Itissalat'),(1695,'60402','212640','Wana_Morocco'),(1696,'6050100','2165','Orange_Tunisia'),(1697,'60501010','2165','Orange_Tunisia'),(1698,'60501011','2165','Orange_Tunisia'),(1699,'605010120','2165','Orange_Tunisia'),(1700,'6050101210','2165','Orange_Tunisia'),(1701,'6050101211','2165','Orange_Tunisia'),(1702,'6050101212','2165','Orange_Tunisia'),(1703,'6050101213','2165','Orange_Tunisia'),(1704,'6050101214','2165','Orange_Tunisia'),(1705,'605010121500','2165','Orange_Tunisia'),(1706,'605010121501','2165','Orange_Tunisia'),(1707,'605010121502','2165','Orange_Tunisia'),(1708,'605010121503','2165','Orange_Tunisia'),(1709,'605010121504','2165','Orange_Tunisia'),(1710,'605010121505','2165','Orange_Tunisia'),(1711,'605010121506','2165','Orange_Tunisia'),(1712,'6050101215070','2165','Orange_Tunisia'),(1713,'6050101215071','2165','Orange_Tunisia'),(1714,'6050101215072','2165','Orange_Tunisia'),(1715,'6050101215073','2165','Orange_Tunisia'),(1716,'6050101215074','2165','Orange_Tunisia'),(1717,'6050101215075','2165','Orange_Tunisia'),(1718,'6050101215076','2165','Orange_Tunisia'),(1719,'60501012150770','2165','Orange_Tunisia'),(1720,'60501012150771','2165','Orange_Tunisia'),(1721,'60501012150772','2165','Orange_Tunisia'),(1722,'60501012150773','2165','Orange_Tunisia'),(1723,'60501012150774','2165','Orange_Tunisia'),(1724,'60501012150775','2165','Orange_Tunisia'),(1725,'60501012150776','2165','Orange_Tunisia'),(1726,'60501012150777','2165','Orange_Tunisia'),(1727,'605010121507780','2165','Orange_Tunisia'),(1728,'605010121507781','2165','Orange_Tunisia'),(1729,'605010121507782','2165','Orange_Tunisia'),(1730,'605010121507783','2165','Orange_Tunisia'),(1731,'605010121507784','2165','Orange_Tunisia'),(1732,'605010121507785','2165','Orange_Tunisia'),(1733,'605010121507786','2165','Orange_Tunisia'),(1734,'605010121507787','2165','Orange_Tunisia'),(1735,'605010121507788','2165','Orange_Tunisia'),(1736,'605010121507789','2165','Orange_Tunisia'),(1737,'605010121507790','2165','Orange_Tunisia'),(1738,'605010121507791','2165','Orange_Tunisia'),(1739,'605010121507792','2165','Orange_Tunisia'),(1740,'605010121507793','2165','Orange_Tunisia'),(1741,'605010121507794','2165','Orange_Tunisia'),(1742,'605010121507795','2165','Orange_Tunisia'),(1743,'605010121507796','2165','Orange_Tunisia'),(1744,'605010121507797','2165','Orange_Tunisia'),(1745,'605010121507798','2165','Orange_Tunisia'),(1746,'605010121507799','2165','Orange_Tunisia'),(1747,'6050101215078','2165','Orange_Tunisia'),(1748,'6050101215079','2165','Orange_Tunisia'),(1749,'605010121508','2165','Orange_Tunisia'),(1750,'605010121509','2165','Orange_Tunisia'),(1751,'60501012151','2165','Orange_Tunisia'),(1752,'60501012152','2165','Orange_Tunisia'),(1753,'60501012153','2165','Orange_Tunisia'),(1754,'60501012154','2165','Orange_Tunisia'),(1755,'60501012155','2165','Orange_Tunisia'),(1756,'60501012156','2165','Orange_Tunisia'),(1757,'60501012157','2165','Orange_Tunisia'),(1758,'60501012158','2165','Orange_Tunisia'),(1759,'60501012159','2165','Orange_Tunisia'),(1760,'6050101216','2165','Orange_Tunisia'),(1761,'6050101217','2165','Orange_Tunisia'),(1762,'6050101218','2165','Orange_Tunisia'),(1763,'6050101219','2165','Orange_Tunisia'),(1764,'605010122','2165','Orange_Tunisia'),(1765,'605010123','2165','Orange_Tunisia'),(1766,'605010124','2165','Orange_Tunisia'),(1767,'605010125','2165','Orange_Tunisia'),(1768,'605010126','2165','Orange_Tunisia'),(1769,'605010127','2165','Orange_Tunisia'),(1770,'605010128','2165','Orange_Tunisia'),(1771,'605010129','2165','Orange_Tunisia'),(1772,'60501013','2165','Orange_Tunisia'),(1773,'60501014','2165','Orange_Tunisia'),(1774,'60501015','2165','Orange_Tunisia'),(1775,'60501016','2165','Orange_Tunisia'),(1776,'60501017','2165','Orange_Tunisia'),(1777,'60501018','2165','Orange_Tunisia'),(1778,'60501019','2165','Orange_Tunisia'),(1779,'6050102','2165','Orange_Tunisia'),(1780,'6050103','2165','Orange_Tunisia'),(1781,'6050104','2165','Orange_Tunisia'),(1782,'6050105','2165','Orange_Tunisia'),(1783,'6050106','2165','Orange_Tunisia'),(1784,'6050107','2165','Orange_Tunisia'),(1785,'6050108','2165','Orange_Tunisia'),(1786,'6050109','2165','Orange_Tunisia'),(1787,'605011','2165','Orange_Tunisia'),(1788,'605012','2165','Orange_Tunisia'),(1789,'605013','2165','Orange_Tunisia'),(1790,'605014','2165','Orange_Tunisia'),(1791,'605015','2165','Orange_Tunisia'),(1792,'605016','2165','Orange_Tunisia'),(1793,'605017','2165','Orange_Tunisia'),(1794,'605018','2165','Orange_Tunisia'),(1795,'605019','2165','Orange_Tunisia'),(1796,'60502','21698','Tunisie_Telecom'),(1797,'60503','21622','Ooredoo_Tunisia'),(1798,'60601','21891','ALMADAR_Libya'),(1799,'60702','22077','Africell_Gambia'),(1800,'60802','22176','SENTEL_Siniguel'),(1801,'609020204725748','22222','Chinguitel_Mauritania'),(1802,'609020204725749','22222','Chinguitel_Mauritania'),(1803,'609020204725750','22222','Chinguitel_Mauritania'),(1804,'609020204725751','22222','Chinguitel_Mauritania'),(1805,'609020204725752','22222','Chinguitel_Mauritania'),(1806,'609020204725753','22222','Chinguitel_Mauritania'),(1807,'609020204725754','22222','Chinguitel_Mauritania'),(1808,'609020204725755','22222','Chinguitel_Mauritania'),(1809,'609020204725756','22222','Chinguitel_Mauritania'),(1810,'609020204725757','22222','Chinguitel_Mauritania'),(1811,'610010100700675','223667','MALITEL_Mali'),(1812,'610010100700676','223667','MALITEL_Mali'),(1813,'610010100700677','223667','MALITEL_Mali'),(1814,'610010100700678','223667','MALITEL_Mali'),(1815,'610010100700679','223667','MALITEL_Mali'),(1816,'610010342281031','223667','Malitel_Mali'),(1817,'610010342281040','223667','Malitel_Mali'),(1818,'610010342281043','223667','Malitel_Mali'),(1819,'61002','223760','Orange_Mali'),(1820,'61101','22462','Orange_Guine'),(1821,'61203','22507','ORANGE_COTE_IVOIRE'),(1822,'613020113989621','22676','Airtel_Burkinafaso'),(1823,'613020113989622','22676','Airtel_Burkinafaso'),(1824,'613020113989635','22676','Airtel_Burkinafaso'),(1825,'613020113989640','22676','Airtel_Burkinafaso'),(1826,'613020200402043','22676','Airtel_Burkinafaso'),(1827,'613020200402044','22676','Airtel_Burkinafaso'),(1828,'613020200402045','22676','Airtel_Burkinafaso'),(1829,'613020200402046','22676','Airtel_Burkinafaso'),(1830,'613020200402047','22676','Airtel_Burkinafaso'),(1831,'613020200402048','22676','Airtel_Burkinafaso'),(1832,'614020200000868','22796','CELTEL_NIGER'),(1833,'614020200000872','22796','CELTEL_NIGER'),(1834,'61701','23025','Cellplus-Mauritius'),(1835,'61905','23277','AFRICELL_SIERA-LEONE'),(1836,'62001','23324','Scancom_Limited_Ghana'),(1837,'62002','23320','Vodafone_GHANA'),(1838,'62003','23327','Millicom_Ghana'),(1839,'62120','234802','Airtel_Nigeria'),(1840,'62130','234803','MTN_Nigeria'),(1841,'62160','234809','Etisalat_Nigeria'),(1842,'622030110995247','2359','MIC_TCHAD'),(1843,'622030110995249','2359','MIC_TCHAD'),(1844,'622030110995250','2359','MIC_TCHAD'),(1845,'623010171904629','96139','Atlantique_Telecom_Centrafrique'),(1846,'623010171904630','96139','Atlantique_Telecom_Centrafrique'),(1847,'623010171904631','96139','Atlantique_Telecom_Centrafrique'),(1848,'623010171904632','96139','Atlantique_Telecom_Centrafrique'),(1849,'623010171904633','96139','Atlantique_Telecom_Centrafrique'),(1850,'623010171904634','96139','Atlantique_Telecom_Centrafrique'),(1851,'623010171904635','96139','Atlantique_Telecom_Centrafrique'),(1852,'623010171904636','96139','Atlantique_Telecom_Centrafrique'),(1853,'62401','23767','MTN_Cameroon'),(1854,'62502','23891','UNITEL_CAP_VER'),(1855,'627010100795785','2402','Guinea_Equatorial'),(1856,'627010100795787','2402','Guinea_Equatorial'),(1857,'62703','24055','Green_Com_S_A_Equatorial_Guinea'),(1858,'62901','24205','Airtel_Congo'),(1859,'62907','24204','Airtel_Congo'),(1860,'63001','24381','Vodacom_Congo'),(1861,'63086','24384','Orange_DRCongo'),(1862,'63102','24492','Unitel_Angola'),(1863,'631040002483368','24491','Angola_Movicel'),(1864,'631040002483369','24491','Angola_Movicel'),(1865,'631040002483370','24491','Angola_Movicel'),(1866,'631040002483371','24491','Angola_Movicel'),(1867,'631040002483372','24491','Angola_Movicel'),(1868,'631040002483373','24491','Angola_Movicel'),(1869,'631040002483374','24491','Angola_Movicel'),(1870,'631040002483375','24491','Angola_Movicel'),(1871,'631040002483376','24491','Angola_Movicel'),(1872,'631040002483377','24491','Angola_Movicel'),(1873,'63310','24827','Airtel_Seychelles'),(1874,'63601','25191','Ethio_Telecom'),(1875,'63801','25377','GDjibouti_Telecom_SA'),(1876,'639027300000257','254722','SAFARICOM_KENYA'),(1877,'639027300000258','254722','SAFARICOM_KENYA'),(1878,'639027300000259','254722','SAFARICOM_KENYA'),(1879,'639070012609915','254770','Telecom_Kenya'),(1880,'639070012609916','254770','Telecom_Kenya'),(1881,'639070012609917','254770','Telecom_Kenya'),(1882,'639070012609918','254770','Telecom_Kenya'),(1883,'639070012609919','254770','Telecom_Kenya'),(1884,'639070012609920','254770','Telecom_Kenya'),(1885,'639070012609921','254770','Telecom_Kenya'),(1886,'639070012609922','254770','Telecom_Kenya'),(1887,'639070012609923','254770','Telecom_Kenya'),(1888,'639070012609924','254770','Telecom_Kenya'),(1889,'640040','25575','Vodacom_Tanzania'),(1890,'640041','25575','Vodacom_Tanzania'),(1891,'640042','25575','Vodacom_Tanzania'),(1892,'640043','25575','Vodacom_Tanzania'),(1893,'6400440','25575','Vodacom_Tanzania'),(1894,'64004410','25575','Vodacom_Tanzania'),(1895,'64004411','25575','Vodacom_Tanzania'),(1896,'64004412','25575','Vodacom_Tanzania'),(1897,'64004413','25575','Vodacom_Tanzania'),(1898,'64004414','25575','Vodacom_Tanzania'),(1899,'64004415','25575','Vodacom_Tanzania'),(1900,'640044160','25575','Vodacom_Tanzania'),(1901,'640044161','25575','Vodacom_Tanzania'),(1902,'640044162','25575','Vodacom_Tanzania'),(1903,'640044163','25575','Vodacom_Tanzania'),(1904,'640044164','25575','Vodacom_Tanzania'),(1905,'640044165','25575','Vodacom_Tanzania'),(1906,'640044166','25575','Vodacom_Tanzania'),(1907,'640044167','25575','Vodacom_Tanzania'),(1908,'6400441680','25575','Vodacom_Tanzania'),(1909,'6400441681','25575','Vodacom_Tanzania'),(1910,'6400441682','25575','Vodacom_Tanzania'),(1911,'6400441683','25575','Vodacom_Tanzania'),(1912,'6400441684','25575','Vodacom_Tanzania'),(1913,'6400441685','25575','Vodacom_Tanzania'),(1914,'6400441686','25575','Vodacom_Tanzania'),(1915,'6400441687','25575','Vodacom_Tanzania'),(1916,'6400441688','25575','Vodacom_Tanzania'),(1917,'64004416890','25575','Vodacom_Tanzania'),(1918,'64004416891','25575','Vodacom_Tanzania'),(1919,'64004416892','25575','Vodacom_Tanzania'),(1920,'64004416893','25575','Vodacom_Tanzania'),(1921,'64004416894','25575','Vodacom_Tanzania'),(1922,'64004416895','25575','Vodacom_Tanzania'),(1923,'64004416896','25575','Vodacom_Tanzania'),(1924,'64004416897','25575','Vodacom_Tanzania'),(1925,'64004416898','25575','Vodacom_Tanzania'),(1926,'6400441689900','25575','Vodacom_Tanzania'),(1927,'6400441689901','25575','Vodacom_Tanzania'),(1928,'6400441689902','25575','Vodacom_Tanzania'),(1929,'6400441689903','25575','Vodacom_Tanzania'),(1930,'6400441689904','25575','Vodacom_Tanzania'),(1931,'6400441689905','25575','Vodacom_Tanzania'),(1932,'6400441689906','25575','Vodacom_Tanzania'),(1933,'6400441689907','25575','Vodacom_Tanzania'),(1934,'6400441689908','25575','Vodacom_Tanzania'),(1935,'64004416899090','25575','Vodacom_Tanzania'),(1936,'64004416899091','25575','Vodacom_Tanzania'),(1937,'64004416899092','25575','Vodacom_Tanzania'),(1938,'640044168990930','25575','Vodacom_Tanzania'),(1939,'640044168990931','25575','Vodacom_Tanzania'),(1940,'640044168990932','25575','Vodacom_Tanzania'),(1941,'640044168990933','25575','Vodacom_Tanzania'),(1942,'640044168990934','25575','Vodacom_Tanzania'),(1943,'640044168990935','25575','Vodacom_Tanzania'),(1944,'640044168990936','25575','Vodacom_Tanzania'),(1945,'640044168990937','25575','Vodacom_Tanzania'),(1946,'640044168990938','25575','Vodacom_Tanzania'),(1947,'640044168990939','25575','Vodacom_Tanzania'),(1948,'64004416899094','25575','Vodacom_Tanzania'),(1949,'64004416899095','25575','Vodacom_Tanzania'),(1950,'64004416899096','25575','Vodacom_Tanzania'),(1951,'64004416899097','25575','Vodacom_Tanzania'),(1952,'64004416899098','25575','Vodacom_Tanzania'),(1953,'64004416899099','25575','Vodacom_Tanzania'),(1954,'640044168991','25575','Vodacom_Tanzania'),(1955,'640044168992','25575','Vodacom_Tanzania'),(1956,'640044168993','25575','Vodacom_Tanzania'),(1957,'640044168994','25575','Vodacom_Tanzania'),(1958,'640044168995','25575','Vodacom_Tanzania'),(1959,'640044168996','25575','Vodacom_Tanzania'),(1960,'640044168997','25575','Vodacom_Tanzania'),(1961,'640044168998','25575','Vodacom_Tanzania'),(1962,'640044168999','25575','Vodacom_Tanzania'),(1963,'640044169','25575','Vodacom_Tanzania'),(1964,'64004417','25575','Vodacom_Tanzania'),(1965,'64004418','25575','Vodacom_Tanzania'),(1966,'64004419','25575','Vodacom_Tanzania'),(1967,'6400442','25575','Vodacom_Tanzania'),(1968,'6400443','25575','Vodacom_Tanzania'),(1969,'6400444','25575','Vodacom_Tanzania'),(1970,'6400445','25575','Vodacom_Tanzania'),(1971,'6400446','25575','Vodacom_Tanzania'),(1972,'6400447','25575','Vodacom_Tanzania'),(1973,'6400448','25575','Vodacom_Tanzania'),(1974,'6400449','25575','Vodacom_Tanzania'),(1975,'640045','25575','Vodacom_Tanzania'),(1976,'640046','25575','Vodacom_Tanzania'),(1977,'640047','25575','Vodacom_Tanzania'),(1978,'640048','25575','Vodacom_Tanzania'),(1979,'640049','25575','Vodacom_Tanzania'),(1980,'64005','25578','CELTEL_Tanzania'),(1981,'64008','25579','SMART_Tanzania'),(1982,'641010280001898','25675','Airtel_Uganda'),(1983,'641010280001899','25675','Airtel_Uganda'),(1984,'64118','25674','smart_Uganda'),(1985,'641220010330081','25670','Warid_Uganda'),(1986,'641220010330082','25670','Warid_Uganda'),(1987,'64207','25775','Lacell-SU_Burundi'),(1988,'64304','25884','Vodacom_Mozambique'),(1989,'64601','26133','Airtel_Madagascar'),(1990,'646020100058786','26132','Orange_Madagascar'),(1991,'646020100058789','26132','Orange_Madagascar'),(1992,'646020100058794','26132','Orange_Madagascar'),(1993,'65001','26588','TNM_Malawi'),(1994,'65101','2665','Vodacom_Lesotho'),(1995,'65201','26771','Mascom_Bostwana'),(1996,'655010','2782','Vodacome_SouthAfrica'),(1997,'655011','2782','Vodacome_SouthAfrica'),(1998,'655012','2782','Vodacome_SouthAfrica'),(1999,'655013','2782','Vodacome_SouthAfrica'),(2000,'6550140','2782','Vodacome_SouthAfrica'),(2001,'655014100','2782','Vodacome_SouthAfrica'),(2002,'6550141010','2782','Vodacome_SouthAfrica'),(2003,'6550141011','2782','Vodacome_SouthAfrica'),(2004,'65501410120','2782','Vodacome_SouthAfrica'),(2005,'65501410121','2782','Vodacome_SouthAfrica'),(2006,'6550141012200','2782','Vodacome_SouthAfrica'),(2007,'6550141012201','2782','Vodacome_SouthAfrica'),(2008,'6550141012202','2782','Vodacome_SouthAfrica'),(2009,'6550141012203','2782','Vodacome_SouthAfrica'),(2010,'6550141012204','2782','Vodacome_SouthAfrica'),(2011,'65501410122050','2782','Vodacome_SouthAfrica'),(2012,'65501410122051','2782','Vodacome_SouthAfrica'),(2013,'65501410122052','2782','Vodacome_SouthAfrica'),(2014,'65501410122053','2782','Vodacome_SouthAfrica'),(2015,'65501410122054','2782','Vodacome_SouthAfrica'),(2016,'65501410122055','2782','Vodacome_SouthAfrica'),(2017,'65501410122056','2782','Vodacome_SouthAfrica'),(2018,'65501410122057','2782','Vodacome_SouthAfrica'),(2019,'655014101220580','2782','Vodacome_SouthAfrica'),(2020,'655014101220581','2782','Vodacome_SouthAfrica'),(2021,'655014101220582','2782','Vodacome_SouthAfrica'),(2022,'655014101220583','2782','Vodacome_SouthAfrica'),(2023,'655014101220584','2782','Vodacome_SouthAfrica'),(2024,'655014101220585','2782','Vodacome_SouthAfrica'),(2025,'655014101220586','2782','Vodacome_SouthAfrica'),(2026,'655014101220587','2782','Vodacome_SouthAfrica'),(2027,'655014101220588','2782','Vodacome_SouthAfrica'),(2028,'655014101220589','2782','Vodacome_SouthAfrica'),(2029,'65501410122059','2782','Vodacome_SouthAfrica'),(2030,'6550141012206','2782','Vodacome_SouthAfrica'),(2031,'65501410122070','2782','Vodacome_SouthAfrica'),(2032,'65501410122071','2782','Vodacome_SouthAfrica'),(2033,'65501410122072','2782','Vodacome_SouthAfrica'),(2034,'65501410122073','2782','Vodacome_SouthAfrica'),(2035,'65501410122074','2782','Vodacome_SouthAfrica'),(2036,'65501410122075','2782','Vodacome_SouthAfrica'),(2037,'655014101220760','2782','Vodacome_SouthAfrica'),(2038,'655014101220762','2782','Vodacome_SouthAfrica'),(2039,'655014101220764','2782','Vodacome_SouthAfrica'),(2040,'655014101220765','2782','Vodacome_SouthAfrica'),(2041,'655014101220766','2782','Vodacome_SouthAfrica'),(2042,'655014101220767','2782','Vodacome_SouthAfrica'),(2043,'655014101220768','2782','Vodacome_SouthAfrica'),(2044,'655014101220769','2782','Vodacome_SouthAfrica'),(2045,'65501410122077','2782','Vodacome_SouthAfrica'),(2046,'65501410122078','2782','Vodacome_SouthAfrica'),(2047,'65501410122079','2782','Vodacome_SouthAfrica'),(2048,'6550141012208','2782','Vodacome_SouthAfrica'),(2049,'6550141012209','2782','Vodacome_SouthAfrica'),(2050,'655014101221','2782','Vodacome_SouthAfrica'),(2051,'655014101222','2782','Vodacome_SouthAfrica'),(2052,'655014101223','2782','Vodacome_SouthAfrica'),(2053,'655014101224','2782','Vodacome_SouthAfrica'),(2054,'655014101225','2782','Vodacome_SouthAfrica'),(2055,'655014101226','2782','Vodacome_SouthAfrica'),(2056,'655014101227','2782','Vodacome_SouthAfrica'),(2057,'655014101228','2782','Vodacome_SouthAfrica'),(2058,'655014101229','2782','Vodacome_SouthAfrica'),(2059,'65501410123','2782','Vodacome_SouthAfrica'),(2060,'65501410124','2782','Vodacome_SouthAfrica'),(2061,'65501410125','2782','Vodacome_SouthAfrica'),(2062,'65501410126','2782','Vodacome_SouthAfrica'),(2063,'65501410127','2782','Vodacome_SouthAfrica'),(2064,'65501410128','2782','Vodacome_SouthAfrica'),(2065,'65501410129','2782','Vodacome_SouthAfrica'),(2066,'6550141013','2782','Vodacome_SouthAfrica'),(2067,'6550141014','2782','Vodacome_SouthAfrica'),(2068,'6550141015','2782','Vodacome_SouthAfrica'),(2069,'6550141016','2782','Vodacome_SouthAfrica'),(2070,'6550141017','2782','Vodacome_SouthAfrica'),(2071,'6550141018','2782','Vodacome_SouthAfrica'),(2072,'6550141019','2782','Vodacome_SouthAfrica'),(2073,'655014102','2782','Vodacome_SouthAfrica'),(2074,'655014103','2782','Vodacome_SouthAfrica'),(2075,'655014104','2782','Vodacome_SouthAfrica'),(2076,'655014105','2782','Vodacome_SouthAfrica'),(2077,'655014106','2782','Vodacome_SouthAfrica'),(2078,'655014107','2782','Vodacome_SouthAfrica'),(2079,'655014108','2782','Vodacome_SouthAfrica'),(2080,'655014109','2782','Vodacome_SouthAfrica'),(2081,'65501411','2782','Vodacome_SouthAfrica'),(2082,'65501412','2782','Vodacome_SouthAfrica'),(2083,'65501413','2782','Vodacome_SouthAfrica'),(2084,'65501414','2782','Vodacome_SouthAfrica'),(2085,'65501415','2782','Vodacome_SouthAfrica'),(2086,'65501416','2782','Vodacome_SouthAfrica'),(2087,'65501417','2782','Vodacome_SouthAfrica'),(2088,'65501418','2782','Vodacome_SouthAfrica'),(2089,'65501419','2782','Vodacome_SouthAfrica'),(2090,'6550142','2782','Vodacome_SouthAfrica'),(2091,'6550143','2782','Vodacome_SouthAfrica'),(2092,'6550144','2782','Vodacome_SouthAfrica'),(2093,'6550145','2782','Vodacome_SouthAfrica'),(2094,'6550146','2782','Vodacome_SouthAfrica'),(2095,'6550147','2782','Vodacome_SouthAfrica'),(2096,'6550148','2782','Vodacome_SouthAfrica'),(2097,'6550149','2782','Vodacome_SouthAfrica'),(2098,'655015','2782','Vodacome_SouthAfrica'),(2099,'655016','2782','Vodacome_SouthAfrica'),(2100,'655017','2782','Vodacome_SouthAfrica'),(2101,'655018','2782','Vodacome_SouthAfrica'),(2102,'655019','2782','Vodacome_SouthAfrica'),(2103,'65507','2784','Cellc_South_Africa'),(2104,'65510112172313','2783','NULL'),(2105,'65510112172314','2783','NULL'),(2106,'659020000936233','21192','MTN_South_Sudan'),(2107,'659020000936234','21192','MTN_South_Sudan'),(2108,'659020000936235','21192','MTN_South_Sudan'),(2109,'659020000936236','21192','MTN_South_Sudan'),(2110,'659020000936237','21192','MTN_South_Sudan'),(2111,'659020000936238','21192','MTN_South_Sudan'),(2112,'659020000937169','21192','MTN_South_Sudan'),(2113,'659020000937170','21192','MTN_South_Sudan'),(2114,'659020000937171','21192','MTN_South_Sudan'),(2115,'659020000937172','21192','MTN_South_Sudan'),(2116,'70401','502530','Claro_Guatemala'),(2117,'70601','503786','Claro_Salvador'),(2118,'712011003446301','506300','ICE_Costa-Rica'),(2119,'712011003446302','506300','ICE_Costa-Rica'),(2120,'712011003446303','506300','ICE_Costa-Rica'),(2121,'712011003446304','506300','ICE_Costa-Rica'),(2122,'712030102558449','5067000','Claro_CostaRica'),(2123,'712030102558452','5067000','Claro_CostaRica'),(2124,'71610','51997','claro_peru'),(2125,'71615','51930','BITEL_Peru'),(2126,'722310','54320','Claro_Argentina'),(2127,'72405','55005','ClaroBrazil'),(2128,'73003','56920','Claro_Chile'),(2129,'732123','57316','Telecomunicaciones_Colombia'),(2130,'734021001546026','58412','Venezuela_Digital'),(2131,'734021001546027','58412','Venezuela_Digital'),(2132,'734021001546028','58412','Venezuela_Digital'),(2133,'734021001546029','58412','Venezuela_Digital'),(2134,'734021001546030','58412','Venezuela_Digital'),(2135,'734021001546031','58412','Venezuela_Digital'),(2136,'734021001546032','58412','Venezuela_Digital'),(2137,'734021001546033','58412','Venezuela_Digital'),(2138,'734021001546034','58412','Venezuela_Digital'),(2139,'734021001546035','58412','Venezuela_Digital'),(2140,'74001','59394','Conecel_Ecuador'),(2141,'74402','595991','Claro_Paraguay'),(2142,'746030111269880','59781','Digicel_Group'),(2143,'746030111269896','59781','Digicel_Group'),(2144,'746030111450255','59781','Digicel_Group'),(2145,'746030111450265','59781','Digicel_Group'),(2146,'74801','59899','Ancel_Uruguay'),(2147,'74807','59894','Telefonica_Uruguay'),(2148,'74810','59896','Claro_Uruguay'),(2149,'90105','88216','Thuraya_UAE'),(2150,'901280','88239','Vodaphone_Malta'),(2151,'901281','88239','Vodaphone_Malta'),(2152,'901282','88239','Vodaphone_Malta'),(2153,'901283','88239','Vodaphone_Malta'),(2154,'901284','88239','Vodaphone_Malta'),(2155,'901285','88239','Vodaphone_Malta'),(2156,'901286','88239','Vodaphone_Malta'),(2157,'901287','88239','Vodaphone_Malta'),(2158,'901288','88239','Vodaphone_Malta'),(2159,'9012890','88239','Vodaphone_Malta'),(2160,'9012891','88239','Vodaphone_Malta'),(2161,'9012892','88239','Vodaphone_Malta'),(2162,'9012893','88239','Vodaphone_Malta'),(2163,'9012894','88239','Vodaphone_Malta'),(2164,'9012895','88239','Vodaphone_Malta'),(2165,'9012896','88239','Vodaphone_Malta'),(2166,'9012897','88239','Vodaphone_Malta'),(2167,'9012898','88239','Vodaphone_Malta'),(2168,'90128991','88239','Vodaphone_Malta'),(2169,'90128992','88239','Vodaphone_Malta'),(2170,'90128993','88239','Vodaphone_Malta'),(2171,'90128994','88239','Vodaphone_Malta'),(2172,'90128995','88239','Vodaphone_Malta'),(2173,'90128996','88239','Vodaphone_Malta'),(2174,'90128997','88239','Vodaphone_Malta'),(2175,'90128998','88239','Vodaphone_Malta'),(2176,'901289990','88239','Vodaphone_Malta'),(2177,'901289991','88239','Vodaphone_Malta'),(2178,'901289992','88239','Vodaphone_Malta'),(2179,'901289993','88239','Vodaphone_Malta'),(2180,'901289994','88239','Vodaphone_Malta'),(2181,'901289995','88239','Vodaphone_Malta'),(2182,'901289996','88239','Vodaphone_Malta'),(2183,'901289997','88239','Vodaphone_Malta'),(2184,'901289998','88239','Vodaphone_Malta'),(2185,'9012899990','88239','Vodaphone_Malta'),(2186,'9012899991','88239','Vodaphone_Malta'),(2187,'9012899992','88239','Vodaphone_Malta'),(2188,'9012899993','88239','Vodaphone_Malta'),(2189,'9012899994','88239','Vodaphone_Malta'),(2190,'9012899995','88239','Vodaphone_Malta'),(2191,'9012899996','88239','Vodaphone_Malta'),(2192,'9012899997','88239','Vodaphone_Malta'),(2193,'90128999980','88239','Vodaphone_Malta'),(2194,'90128999981','88239','Vodaphone_Malta'),(2195,'90128999982','88239','Vodaphone_Malta'),(2196,'90128999983','88239','Vodaphone_Malta'),(2197,'90128999984','88239','Vodaphone_Malta'),(2198,'90128999985','88239','Vodaphone_Malta'),(2199,'90128999986','88239','Vodaphone_Malta'),(2200,'90128999987','88239','Vodaphone_Malta'),(2201,'90128999988','88239','Vodaphone_Malta'),(2202,'901289999890','88239','Vodaphone_Malta'),(2203,'901289999891','88239','Vodaphone_Malta'),(2204,'901289999892','88239','Vodaphone_Malta'),(2205,'901289999893','88239','Vodaphone_Malta'),(2206,'901289999894','88239','Vodaphone_Malta'),(2207,'901289999895','88239','Vodaphone_Malta'),(2208,'901289999896','88239','Vodaphone_Malta'),(2209,'901289999897','88239','Vodaphone_Malta'),(2210,'901289999898','88239','Vodaphone_Malta'),(2211,'9012899998990','88239','Vodaphone_Malta'),(2212,'9012899998991','88239','Vodaphone_Malta'),(2213,'9012899998992','88239','Vodaphone_Malta'),(2214,'9012899998993','88239','Vodaphone_Malta'),(2215,'9012899998994','88239','Vodaphone_Malta'),(2216,'9012899998995','88239','Vodaphone_Malta'),(2217,'9012899998996','88239','Vodaphone_Malta'),(2218,'9012899998997','88239','Vodaphone_Malta'),(2219,'90128999989980','88239','Vodaphone_Malta'),(2220,'901289999899810','88239','Vodaphone_Malta'),(2221,'901289999899811','88239','Vodaphone_Malta'),(2222,'901289999899812','88239','Vodaphone_Malta'),(2223,'901289999899813','88239','Vodaphone_Malta'),(2224,'901289999899814','88239','Vodaphone_Malta'),(2225,'901289999899815','88239','Vodaphone_Malta'),(2226,'901289999899816','88239','Vodaphone_Malta'),(2227,'901289999899817','88239','Vodaphone_Malta'),(2228,'901289999899818','88239','Vodaphone_Malta'),(2229,'901289999899819','88239','Vodaphone_Malta'),(2230,'90128999989982','88239','Vodaphone_Malta'),(2231,'90128999989983','88239','Vodaphone_Malta'),(2232,'90128999989984','88239','Vodaphone_Malta'),(2233,'90128999989985','88239','Vodaphone_Malta'),(2234,'90128999989986','88239','Vodaphone_Malta'),(2235,'90128999989987','88239','Vodaphone_Malta'),(2236,'90128999989988','88239','Vodaphone_Malta'),(2237,'90128999989989','88239','Vodaphone_Malta'),(2238,'9012899998999','88239','Vodaphone_Malta'),(2239,'9012899999','88239','Vodaphone_Malta'),(2240,'90131','883130','Orange-M2M-AAZOR_France');
/*!40000 ALTER TABLE `roaming_partners_backup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roaming_partners_corrected`
--

DROP TABLE IF EXISTS `roaming_partners_corrected`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roaming_partners_corrected` (
  `id` int DEFAULT NULL,
  `imsi_prefix` varchar(255) DEFAULT NULL,
  `gt` varchar(255) DEFAULT NULL,
  `operateur` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roaming_partners_corrected`
--

LOCK TABLES `roaming_partners_corrected` WRITE;
/*!40000 ALTER TABLE `roaming_partners_corrected` DISABLE KEYS */;
INSERT INTO `roaming_partners_corrected` VALUES (1,'20201','3097','cosmote_greece'),(2,'202050','30694','Vodafone_Greece'),(219,'20210','30693','Wind_Hellas_Greece'),(220,'20214','30685','Vodafone_Greece'),(221,'20404','31654','Vodafone_Netherlands'),(222,'20408','31653','KPN_Netherlands'),(223,'20412','31626','Telfort_Netherlands'),(224,'204162443766381','31624','T-Mobile_Netherlands'),(228,'204201000211900','31628','T-Mobile_Netherlands'),(232,'20601','32475','Belgacom_BELGIUM'),(233,'206050004526678','32468','Telenet_Belgium'),(236,'20610','32495','Mobistar_BELGIUM'),(237,'20620','32486','Base_BELGIUM'),(238,'20801100010','33689','Orange_France'),(326,'20809','33611','SFR_France'),(327,'20810','33609','SFR_France'),(328,'20815','33695','Free_Mobile_FRANCE'),(329,'20820','33660','Bouygues_Telecom_France'),(330,'21401','34607','Vodafone_Spain'),(331,'214030','34656','Orange_Spain'),(422,'21405','34648','Telefonica_Spain_ESPT2'),(424,'21407','34609','Telefonica_Spain'),(425,'21630','3630','Hungary_Telekom'),(426,'21670','3670','Vodafone_Hungary'),(427,'21803','38763','Croatian_Telecom'),(428,'21901','38598','Telecom_Croatian'),(429,'21902','38595','TELE_2_CROATIA'),(430,'22001','38163','Mobtel_Serbia'),(431,'22003','38164','Telekom_Serbia'),(432,'22201','39339','TIM_ITALY'),(433,'22210','39349','Vodafone_Omnitel_ITALY'),(434,'22601','40722','Vodafone_Romania'),(435,'22603','4076','Telekom-Mobile_Romania'),(436,'22801','4179','Swisscom_Switzerland'),(437,'22803','4178','Orange_Switzerland'),(438,'23001','420603','T-Mobile_Czech-Republic'),(439,'23002','420602','Czech_Republic'),(440,'23003','420608','Vodafone_Czeech'),(441,'23101','421905','Orange_SLOVAKIA'),(442,'231020105243123','421903','T-Mobile_slovakia'),(451,'23203','43676','T-Mobile_Austria'),(452,'23207','43650','T-Mobile_Austria'),(453,'23410','447802','UK_TELEFONICA'),(454,'23415','44385','Vodafone_United_Kingdom'),(455,'23430','447953','T-Mobile_UK'),(456,'23450','447797','Telekom_Jersey'),(457,'23455','447781','Sure_Limited_Guernsey'),(458,'23801','45401','TDC_Denmark'),(459,'238201001789892','4528','TELIA_DANMARK'),(462,'24007','46707','Tele2_Sweeden'),(463,'24010','46765','Lycamobile_Sweeden'),(464,'24014','4676720','TDC_Sweden'),(465,'24201','47900','Telenor_Norway'),(466,'24208','479451','TDC_Norway'),(467,'24405','35850','Elisa_Finland'),(468,'244144573919427','3584570','NULL'),(470,'244212000908392','358451','Elisa_Finland'),(473,'24701','371292','Latvian_Mobile_Telephone'),(474,'24802','37256','Elisa_Estonia'),(475,'24803','37255','Tele2_Estonia'),(476,'25001','79160','MTS_Russia'),(477,'25002','792','MegaFon_Russia'),(478,'25016','7902557','NTC_Russia'),(479,'25020','790434','TELE2_RUSSIA'),(480,'25099','79037','Vimpelcom_russia'),(481,'25501','38050','MTS_UKraine'),(482,'25503','38067','KyivstarOperator'),(483,'25506','38063','lifecell_Ukraine'),(484,'25702','375297','MTS_Belarus'),(485,'259010103887776','373691','Orange_Moldova'),(489,'259050125057010','37367','Moldtelecom_MOLDOVA'),(501,'260021173107739','48602','T-Mobile_Poland'),(505,'260021372214393','48602','T-Mobile_Polska'),(507,'260032001805073','48501','Orange_Poland'),(509,'26006000','48790','Play_Poland'),(600,'262010','49171','Telekom_Germany'),(700,'26202','49172','Vodafone_Germany'),(701,'26203','49177','Telefonica_Germany'),(702,'26207','49176','Telefonica_Germany'),(703,'26801','35191','Vodafone_Portugal'),(704,'26806','35196','TMN_Portugal'),(705,'27001','352021','POST_Luxembourg'),(706,'27077','352091','Tango_Luxembourg'),(707,'27099','352061','Orange_Luxemburg'),(708,'272010','35387','Vodafone_Ireland'),(746,'272017113370529','90542','Vodafone_Turkey'),(808,'27203','35385','Meteor_Ireland'),(809,'274040299002034','354650','NULL'),(812,'27601','35568','AMC_Albania'),(813,'276020','35569','Vodafone_ALBANIA'),(913,'27801','35694','Vodafone_Malta'),(914,'27821','35679','Mobisle.C.L_Malta'),(915,'28001','35799','ICytamobile_Cyprus_Iran'),(916,'283010000109902','37491','Armentel_Armenia'),(920,'28403','35987','Vivacom_Bulgaria'),(921,'286010','90532','Turkcell_TURKEY'),(1020,'28602','90542','Vodafone_Turkey'),(1021,'28603','90559','Telecom_Turkey'),(1022,'28604','90505','Avea_Turkey'),(1023,'293411100329353','38641','Telekom_Slovenia'),(1028,'297039000133574','38268','Mitel_Montenegro'),(1033,'302220','164758','TELUS_Canada'),(1034,'302370','151499','Fido_Canada'),(1035,'302500','151442','Videotron_Canada'),(1036,'302610','190561','Bell_Mobily_Canada'),(1037,'302720','170579','Rogers_Canada'),(1038,'302780','130652','Saskatel_Canada'),(1039,'310150','170450','AT\\&T\\'),(1040,'310160','191790','T-MobileUSA'),(1041,'310170','120990','AT\\&T\\'),(1042,'310200','150351','T-MobileUSA'),(1043,'310210','140547','T-MobileUSA'),(1044,'310220','140541','T-MobileUSA'),(1045,'310230','180185','T-Mobile_USA'),(1046,'310240','150545','T-MobileUSA'),(1047,'310250','180825','T-MobileUSA'),(1130,'310270','133433','T-MobileUSA'),(1131,'310310','181326','T-MobileUSA'),(1132,'310380','197037','AT\\&T_Mobility'),(1133,'310410','131231','AT\\&T_USA'),(1134,'310420','151324','CBW_USA'),(1135,'310490','170434','T-MobileUSA'),(1136,'310580','171720','T-Mobile\\'),(1137,'310660','140445','T-Mobile\\'),(1138,'310800','164662','T-Mobile\\'),(1139,'311270','190370299','Verizon_USA'),(1140,'311480','190370299','Verizon_USA'),(1141,'334020','52941','Telecel_Mexico'),(1142,'334030','52942','Telefonica_Mexico'),(1143,'33420','52941','Telecel_Mexico'),(1144,'338050000539871','1876380','Digicel_Group'),(1148,'370020019561818','182996','Claro_Dominicana'),(1154,'40001','99450','Azecell_Azerbaijan'),(1155,'400027010383903','99455','Backcell_Azerbaijan'),(1165,'40004','99470','Azerfon_LLC_Azerbaijan'),(1166,'401015577806612','7705','Kar-tel_Kazakhstan'),(1169,'401018000000109','7057','KAR_TEL_KAZAKHSTAN'),(1173,'40402','919815','AIRTEL_Bharti_india_Punjab'),(1174,'40403','919816','AIRTEL_Bharti_india_Himachal_Pradesh'),(1175,'40405','919825','Vodafone_West_India'),(1176,'40410','919810','AIRTEL_Bharti_india_Delhi'),(1177,'40411','919811','Vodafone_Essar_Mobile_India'),(1178,'40416','919810','Bharti_Airtel'),(1179,'40420','919820','VODAFONE_India'),(1180,'40421','919821','LoopMobile_India'),(1181,'40427','919823','Vodafone_MAHARASHTRA_India'),(1182,'40430','919830','VODAFONE_East_India'),(1183,'40431','919831','AIRTEL_Bharti_india_Kolkata'),(1184,'40440','919840','AIRTEL_Bharti\\'),(1185,'40445','919845','AIRTEL_Bharti_india_Karnataka'),(1186,'40449','919849','AIRTEL_Bharti_india_Andhra_Pradesh'),(1187,'40470','919829','AIRTEL_Bharti_india_Rajasthan'),(1188,'40490','919890','AIRTEL_Bharti_india_Maharashtra'),(1189,'40492','919892','AIRTEL_Bharti_india_Mumbai'),(1190,'40493','919893','AIRTEL_Bharti_india_Madhya_pradesh'),(1191,'40494','919894','AIRTEL_Bharti_india_Tamil'),(1192,'40495','919895','AIRTEL_Bharti_india_Kerala'),(1193,'40496','919896','AIRTEL_Bharti_india_Haryana'),(1194,'40497','919897','AIRTEL_Bharti_india_Uttar_Pradesh_West'),(1195,'40498','919898','AIRTEL_Bharti_india_Gujar'),(1196,'405025','919030','TATA_Docomo_India'),(1197,'405027','919031','TATA_Docomo_India'),(1198,'405029','917796','TATA_Docomo_India'),(1199,'405030','919033','TATA_Docomo_India'),(1200,'405031','919034','TATA_Docomo_India'),(1201,'405032','918091','TATA_Docomo_India'),(1202,'405034','919036','TATA_Docomo_India'),(1203,'405035','919037','TATA_Docomo_India'),(1204,'405036','919038','TATA_Docomo_India'),(1205,'405037','919028','TATA_Docomo_India'),(1206,'405038','919039','TATA_Docomo_India'),(1207,'405039','919029','TATA_Docomo_India'),(1208,'405041','919040','TATA_Docomo_India'),(1209,'405042','919041','TATA_Docomo_India'),(1210,'405043','917737','TATA_Docomo_India'),(1211,'405044','919043','TATA_Docomo_India'),(1212,'405045','919044','TATA_Docomo_India'),(1213,'405046','919045','TATA_Docomo_India'),(1214,'405047','919046','TATA_Docomo_India'),(1215,'40551','919810','Bharti_Airtel'),(1221,'41004','9231','CMPak_Pakistan'),(1222,'41006','92345','Telenor_Pakistan'),(1223,'41007','92321','Warid_Tel_Pakistan'),(1224,'412012200202902','9370','Afghanistan_Wireless'),(1226,'412500219534483','9378','Etisalat_Afghanistan'),(1236,'41301','9471','Mobitel_Sirilanka'),(1237,'41302','9477','Dialog_SriLanka'),(1238,'41405','95997','Ooredoo_Myanmar'),(1239,'41501','96134','MIC1_Libanon'),(1240,'41503','96139','MIC2_Lebanon'),(1241,'41601','96279','Zain_Jordan'),(1242,'41603','96278','UMNIAH_JORDAN'),(1243,'41677','96277','Orange_Jordan'),(1244,'41701','96393','Syriatel_Syria'),(1245,'41702','96394','MTN-SYRIA'),(1246,'418050001949738','9647701','Asiacell_IRQ'),(1248,'41820','9647802','Zain_Iraq'),(1249,'41830','96479','Iraqna_Iraq'),(1250,'41902','96596','Zain_Kuwait'),(1251,'41903','9656','Ooredoo_Kuwait'),(1252,'41904','965500','KTC_Viva_Kuwait'),(1253,'42001','96650','Aljawal_Saudi'),(1254,'42003','96656','Mobily_Saudi'),(1255,'4200400','96659','Zain_Saudi'),(1346,'42005','966570','SAUVG_KSA'),(1347,'42101','96771','Sabafon_Yemen'),(1348,'42202','96892','Omantel_Oman'),(1349,'42203','96895','Ooredoo_Oman'),(1350,'424020','97150','Etisalat_UAE'),(1440,'4240300','97155','Du_UAE'),(1531,'42506','97256','Wataniya_Oalestine'),(1532,'42601','97339','Batelco_Bahrain'),(1533,'42602','97336','Zain_Bahrain'),(1534,'42604','97333','VIVA_BAHRAIN'),(1535,'42701','97455','Qtel_Qatar'),(1536,'42702','97477','Vodafone_Qatar'),(1537,'42888','97688','UNITEL_MONGOLIE'),(1538,'432110100943200','98911','MobileTelecom_IRAN'),(1542,'43220','98920','Rightel_IRAN'),(1543,'43235','98935','MTN_IRAN'),(1544,'43404','99890','UNITEL_UZBAKISTAN'),(1545,'43709','99670','NurTelekom_Kyrgyztan'),(1546,'44010','8190542','NTT_DOCOMO_JAPAN'),(1547,'44050','8180931','KDDI_JAPAN'),(1548,'44051','8180984','KDDI_JAPAN_2'),(1549,'450081210001404','8210291','KT_KOREA'),(1551,'45201','8490','MobiFone_Vietnam'),(1552,'45400','852902','CSL_Hongkong'),(1553,'45403','852633','Hutchison_Hongkong_3G'),(1554,'45404','852949','Hutchison_Hongkong'),(1555,'45412','852920','Peoples_HongKong'),(1556,'454161103730079','852923','HongKong_Telecom2G'),(1558,'454195000450707','852923','Hong-Kong_Telecom3G'),(1560,'45501','85368989','CTM_Macau'),(1561,'45618','85511','Mfone_Cambodia'),(1562,'460000153141128','86139','China_Mobile'),(1563,'46001','86130','Unicom_China'),(1564,'460020396050120','86138','China_Mobile'),(1565,'460077110753652','86157','China_Mobile'),(1567,'46009','86186','Unicom_China'),(1568,'46689','886986','starTelecom_Taiwan'),(1569,'47002','88018','Robi_Bangladesh'),(1570,'470070030023637','88016','Airtel_Bengladech'),(1573,'47202','96096','Ooredoo_Maldives'),(1574,'50212','6012','Maxis_Malaysia'),(1575,'50218','6018','uMobile-Malysia'),(1576,'50503','61415','Vodafone_Australia'),(1577,'51001','62816','Indosat_Indonesia'),(1578,'51010','62811','TELKOMSELINDONESI'),(1579,'514010073640010','67073','Telkomcel_Timor'),(1583,'51502','63917','Globe_Telecom_Philippines'),(1584,'51503','63918','SMART_PHILLIPINES'),(1585,'52000','66830','True-Move_Thailand'),(1586,'520044000035700','66938','True-Move_Thailand'),(1589,'52005','66950','DTAC_Thailand'),(1590,'52503','659','MobileOneLtd_Singapore'),(1591,'52811','67387','DST_Brunei'),(1592,'53001','6421','Vodafone_NewZealand'),(1593,'53024','6422','Two-Degrees_NewZealand'),(1594,'547200105044497','68987','Vini-French_Polenysia'),(1599,'60201','2012','Mobinil_EGYPT'),(1600,'60202','2010','Vodafone_Egypt'),(1601,'6020300','2011','Etisalat_Egypt'),(1692,'60301','21366','NULL'),(1693,'60400','2126639','Meditel_Morocco'),(1694,'60401','212661','Maroc_Itissalat'),(1695,'60402','212640','Wana_Morocco'),(1696,'6050100','2165','Orange_Tunisia'),(1796,'60502','21698','Tunisie_Telecom'),(1797,'60503','21622','Ooredoo_Tunisia'),(1798,'60601','21891','ALMADAR_Libya'),(1799,'60702','22077','Africell_Gambia'),(1800,'60802','22176','SENTEL_Siniguel'),(1801,'609020204725748','22222','Chinguitel_Mauritania'),(1811,'610010100700675','223667','MALITEL_Mali'),(1819,'61002','223760','Orange_Mali'),(1820,'61101','22462','Orange_Guine'),(1821,'61203','22507','ORANGE_COTE_IVOIRE'),(1822,'613020113989621','22676','Airtel_Burkinafaso'),(1832,'614020200000868','22796','CELTEL_NIGER'),(1834,'61701','23025','Cellplus-Mauritius'),(1835,'61905','23277','AFRICELL_SIERA-LEONE'),(1836,'62001','23324','Scancom_Limited_Ghana'),(1837,'62002','23320','Vodafone_GHANA'),(1838,'62003','23327','Millicom_Ghana'),(1839,'62120','234802','Airtel_Nigeria'),(1840,'62130','234803','MTN_Nigeria'),(1841,'62160','234809','Etisalat_Nigeria'),(1842,'622030110995247','2359','MIC_TCHAD'),(1845,'623010171904629','96139','Atlantique_Telecom_Centrafrique'),(1853,'62401','23767','MTN_Cameroon'),(1854,'62502','23891','UNITEL_CAP_VER'),(1855,'627010100795785','2402','Guinea_Equatorial'),(1857,'62703','24055','Green_Com_S_A_Equatorial_Guinea'),(1858,'62901','24205','Airtel_Congo'),(1859,'62907','24204','Airtel_Congo'),(1860,'63001','24381','Vodacom_Congo'),(1861,'63086','24384','Orange_DRCongo'),(1862,'63102','24492','Unitel_Angola'),(1863,'631040002483368','24491','Angola_Movicel'),(1873,'63310','24827','Airtel_Seychelles'),(1874,'63601','25191','Ethio_Telecom'),(1875,'63801','25377','GDjibouti_Telecom_SA'),(1876,'639027300000257','254722','SAFARICOM_KENYA'),(1879,'639070012609915','254770','Telecom_Kenya'),(1889,'640040','25575','Vodacom_Tanzania'),(1980,'64005','25578','CELTEL_Tanzania'),(1981,'64008','25579','SMART_Tanzania'),(1982,'641010280001898','25675','Airtel_Uganda'),(1984,'64118','25674','smart_Uganda'),(1985,'641220010330081','25670','Warid_Uganda'),(1987,'64207','25775','Lacell-SU_Burundi'),(1988,'64304','25884','Vodacom_Mozambique'),(1989,'64601','26133','Airtel_Madagascar'),(1990,'646020100058786','26132','Orange_Madagascar'),(1993,'65001','26588','TNM_Malawi'),(1994,'65101','2665','Vodacom_Lesotho'),(1995,'65201','26771','Mascom_Bostwana'),(1996,'655010','2782','Vodacome_SouthAfrica'),(2103,'65507','2784','Cellc_South_Africa'),(2104,'65510112172313','2783','NULL'),(2106,'659020000936233','21192','MTN_South_Sudan'),(2116,'70401','502530','Claro_Guatemala'),(2117,'70601','503786','Claro_Salvador'),(2118,'712011003446301','506300','ICE_Costa-Rica'),(2122,'712030102558449','5067000','Claro_CostaRica'),(2124,'71610','51997','claro_peru'),(2125,'71615','51930','BITEL_Peru'),(2126,'722310','54320','Claro_Argentina'),(2127,'72405','55005','ClaroBrazil'),(2128,'73003','56920','Claro_Chile'),(2129,'732123','57316','Telecomunicaciones_Colombia'),(2130,'734021001546026','58412','Venezuela_Digital'),(2140,'74001','59394','Conecel_Ecuador'),(2141,'74402','595991','Claro_Paraguay'),(2142,'746030111269880','59781','Digicel_Group'),(2146,'74801','59899','Ancel_Uruguay'),(2147,'74807','59894','Telefonica_Uruguay'),(2148,'74810','59896','Claro_Uruguay'),(2149,'90105','88216','Thuraya_UAE'),(2150,'901280','88239','Vodaphone_Malta'),(2240,'90131','883130','Orange-M2M-AAZOR_France');
/*!40000 ALTER TABLE `roaming_partners_corrected` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roaming_partners_temp`
--

DROP TABLE IF EXISTS `roaming_partners_temp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roaming_partners_temp` (
  `imsi_prefix` varchar(255) DEFAULT NULL,
  `gt` varchar(255) DEFAULT NULL,
  `operateur` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roaming_partners_temp`
--

LOCK TABLES `roaming_partners_temp` WRITE;
/*!40000 ALTER TABLE `roaming_partners_temp` DISABLE KEYS */;
INSERT INTO `roaming_partners_temp` VALUES ('20201','3097','cosmote_greece'),('202050','30694','Vodafone_Greece'),('202051','30694','Vodafone_Greece'),('2020520','30694','Vodafone_Greece'),('2020521','30694','Vodafone_Greece'),('2020522','30694','Vodafone_Greece'),('2020523','30694','Vodafone_Greece'),('2020524','30694','Vodafone_Greece'),('2020525','30694','Vodafone_Greece'),('2020526','30694','Vodafone_Greece'),('2020527','30694','Vodafone_Greece'),('2020528','30694','Vodafone_Greece'),('20205290','30694','Vodafone_Greece'),('20205291','30694','Vodafone_Greece'),('20205292','30694','Vodafone_Greece'),('20205293','30694','Vodafone_Greece'),('20205294','30694','Vodafone_Greece'),('20205295','30694','Vodafone_Greece'),('202052960','30694','Vodafone_Greece'),('202052961','30694','Vodafone_Greece'),('202052962','30694','Vodafone_Greece'),('202052963','30694','Vodafone_Greece'),('2020529640','30694','Vodafone_Greece'),('2020529641','30694','Vodafone_Greece'),('2020529642','30694','Vodafone_Greece'),('2020529643','30694','Vodafone_Greece'),('2020529644','30694','Vodafone_Greece'),('2020529645','30694','Vodafone_Greece'),('2020529646','30694','Vodafone_Greece'),('2020529647','30694','Vodafone_Greece'),('20205296480','30694','Vodafone_Greece'),('20205296481','30694','Vodafone_Greece'),('20205296482','30694','Vodafone_Greece'),('202052964830','30694','Vodafone_Greece'),('202052964831','30694','Vodafone_Greece'),('202052964832','30694','Vodafone_Greece'),('202052964833','30694','Vodafone_Greece'),('202052964834','30694','Vodafone_Greece'),('202052964835','30694','Vodafone_Greece'),('202052964836','30694','Vodafone_Greece'),('2020529648370','30694','Vodafone_Greece'),('2020529648371','30694','Vodafone_Greece'),('2020529648372','30694','Vodafone_Greece'),('2020529648373','30694','Vodafone_Greece'),('2020529648374','30694','Vodafone_Greece'),('2020529648375','30694','Vodafone_Greece'),('2020529648376','30694','Vodafone_Greece'),('20205296483770','30694','Vodafone_Greece'),('20205296483771','30694','Vodafone_Greece'),('20205296483772','30694','Vodafone_Greece'),('20205296483773','30694','Vodafone_Greece'),('20205296483774','30694','Vodafone_Greece'),('20205296483775','30694','Vodafone_Greece'),('20205296483776','30694','Vodafone_Greece'),('202052964837770','30694','Vodafone_Greece'),('202052964837771','30694','Vodafone_Greece'),('202052964837772','30694','Vodafone_Greece'),('202052964837773','30694','Vodafone_Greece'),('202052964837774','30694','Vodafone_Greece'),('202052964837775','30694','Vodafone_Greece'),('202052964837776','30694','Vodafone_Greece'),('202052964837777','30694','Vodafone_Greece'),('202052964837778','30694','Vodafone_Greece'),('202052964837779','30694','Vodafone_Greece'),('202052964837780','30694','Vodafone_Greece'),('202052964837781','30694','Vodafone_Greece'),('202052964837782','30694','Vodafone_Greece'),('202052964837783','30694','Vodafone_Greece'),('202052964837784','30694','Vodafone_Greece'),('202052964837785','30694','Vodafone_Greece'),('202052964837786','30694','Vodafone_Greece'),('202052964837787','30694','Vodafone_Greece'),('202052964837788','30694','Vodafone_Greece'),('202052964837789','30694','Vodafone_Greece'),('20205296483779','30694','Vodafone_Greece'),('2020529648378','30694','Vodafone_Greece'),('2020529648379','30694','Vodafone_Greece'),('202052964838','30694','Vodafone_Greece'),('202052964839','30694','Vodafone_Greece'),('20205296484','30694','Vodafone_Greece'),('20205296485','30694','Vodafone_Greece'),('20205296486','30694','Vodafone_Greece'),('20205296487','30694','Vodafone_Greece'),('20205296488','30694','Vodafone_Greece'),('20205296489','30694','Vodafone_Greece'),('2020529649','30694','Vodafone_Greece'),('2020529650','30694','Vodafone_Greece'),('2020529651','30694','Vodafone_Greece'),('2020529652','30694','Vodafone_Greece'),('20205296530','30694','Vodafone_Greece'),('20205296531','30694','Vodafone_Greece'),('20205296532','30694','Vodafone_Greece'),('20205296533','30694','Vodafone_Greece'),('20205296534','30694','Vodafone_Greece'),('20205296535','30694','Vodafone_Greece'),('20205296536','30694','Vodafone_Greece'),('20205296537','30694','Vodafone_Greece'),('20205296538','30694','Vodafone_Greece'),('202052965390','30694','Vodafone_Greece'),('202052965391','30694','Vodafone_Greece'),('202052965392','30694','Vodafone_Greece'),('2020529653930','30694','Vodafone_Greece'),('2020529653931','30694','Vodafone_Greece'),('2020529653932','30694','Vodafone_Greece'),('2020529653933','30694','Vodafone_Greece'),('2020529653934','30694','Vodafone_Greece'),('2020529653935','30694','Vodafone_Greece'),('2020529653936','30694','Vodafone_Greece'),('20205296539370','30694','Vodafone_Greece'),('20205296539371','30694','Vodafone_Greece'),('20205296539372','30694','Vodafone_Greece'),('20205296539373','30694','Vodafone_Greece'),('20205296539374','30694','Vodafone_Greece'),('20205296539375','30694','Vodafone_Greece'),('20205296539376','30694','Vodafone_Greece'),('202052965393770','30694','Vodafone_Greece'),('202052965393771','30694','Vodafone_Greece'),('202052965393772','30694','Vodafone_Greece'),('202052965393773','30694','Vodafone_Greece'),('202052965393774','30694','Vodafone_Greece'),('202052965393775','30694','Vodafone_Greece'),('202052965393776','30694','Vodafone_Greece'),('202052965393777','30694','Vodafone_Greece'),('202052965393778','30694','Vodafone_Greece'),('202052965393779','30694','Vodafone_Greece'),('20205296539378','30694','Vodafone_Greece'),('20205296539379','30694','Vodafone_Greece'),('2020529653938','30694','Vodafone_Greece'),('2020529653939','30694','Vodafone_Greece'),('202052965394','30694','Vodafone_Greece'),('202052965395','30694','Vodafone_Greece'),('202052965396','30694','Vodafone_Greece'),('202052965397','30694','Vodafone_Greece'),('202052965398','30694','Vodafone_Greece'),('202052965399','30694','Vodafone_Greece'),('2020529654','30694','Vodafone_Greece'),('2020529655','30694','Vodafone_Greece'),('2020529656','30694','Vodafone_Greece'),('2020529657','30694','Vodafone_Greece'),('2020529658','30694','Vodafone_Greece'),('2020529659','30694','Vodafone_Greece'),('202052966','30694','Vodafone_Greece'),('202052967','30694','Vodafone_Greece'),('202052968','30694','Vodafone_Greece'),('202052969','30694','Vodafone_Greece'),('20205297','30694','Vodafone_Greece'),('20205298000','30694','Vodafone_Greece'),('202052980010','30694','Vodafone_Greece'),('202052980011','30694','Vodafone_Greece'),('202052980012','30694','Vodafone_Greece'),('202052980013','30694','Vodafone_Greece'),('202052980014','30694','Vodafone_Greece'),('202052980015','30694','Vodafone_Greece'),('2020529800160','30694','Vodafone_Greece'),('2020529800161','30694','Vodafone_Greece'),('20205298001620','30694','Vodafone_Greece'),('20205298001621','30694','Vodafone_Greece'),('20205298001622','30694','Vodafone_Greece'),('20205298001623','30694','Vodafone_Greece'),('20205298001624','30694','Vodafone_Greece'),('20205298001625','30694','Vodafone_Greece'),('20205298001626','30694','Vodafone_Greece'),('202052980016270','30694','Vodafone_Greece'),('202052980016271','30694','Vodafone_Greece'),('202052980016272','30694','Vodafone_Greece'),('202052980016273','30694','Vodafone_Greece'),('202052980016274','30694','Vodafone_Greece'),('202052980016275','30694','Vodafone_Greece'),('202052980016276','30694','Vodafone_Greece'),('202052980016277','30694','Vodafone_Greece'),('202052980016278','30694','Vodafone_Greece'),('202052980016279','30694','Vodafone_Greece'),('20205298001628','30694','Vodafone_Greece'),('20205298001629','30694','Vodafone_Greece'),('2020529800163','30694','Vodafone_Greece'),('2020529800164','30694','Vodafone_Greece'),('2020529800165','30694','Vodafone_Greece'),('2020529800166','30694','Vodafone_Greece'),('2020529800167','30694','Vodafone_Greece'),('2020529800168','30694','Vodafone_Greece'),('2020529800169','30694','Vodafone_Greece'),('202052980017','30694','Vodafone_Greece'),('202052980018','30694','Vodafone_Greece'),('202052980019','30694','Vodafone_Greece'),('20205298002','30694','Vodafone_Greece'),('20205298003','30694','Vodafone_Greece'),('20205298004','30694','Vodafone_Greece'),('20205298005','30694','Vodafone_Greece'),('20205298006','30694','Vodafone_Greece'),('20205298007','30694','Vodafone_Greece'),('20205298008','30694','Vodafone_Greece'),('20205298009','30694','Vodafone_Greece'),('2020529801','30694','Vodafone_Greece'),('2020529802','30694','Vodafone_Greece'),('2020529803','30694','Vodafone_Greece'),('2020529804','30694','Vodafone_Greece'),('2020529805','30694','Vodafone_Greece'),('2020529806','30694','Vodafone_Greece'),('2020529807','30694','Vodafone_Greece'),('2020529808','30694','Vodafone_Greece'),('2020529809','30694','Vodafone_Greece'),('202052981','30694','Vodafone_Greece'),('202052982','30694','Vodafone_Greece'),('202052983','30694','Vodafone_Greece'),('202052984','30694','Vodafone_Greece'),('202052985','30694','Vodafone_Greece'),('202052986','30694','Vodafone_Greece'),('202052987','30694','Vodafone_Greece'),('202052988','30694','Vodafone_Greece'),('202052989','30694','Vodafone_Greece'),('20205299','30694','Vodafone_Greece'),('202053','30694','Vodafone_Greece'),('202054','30694','Vodafone_Greece'),('202055','30694','Vodafone_Greece'),('202056','30694','Vodafone_Greece'),('202057','30694','Vodafone_Greece'),('202058','30694','Vodafone_Greece'),('202059','30694','Vodafone_Greece'),('20210','30693','Wind_Hellas_Greece'),('20214','30685','Vodafone_Greece'),('20404','31654','Vodafone_Netherlands'),('20408','31653','KPN_Netherlands'),('20412','31626','Telfort_Netherlands'),('204162443766381','31624','T-Mobile_Netherlands'),('204162443766382','31624','T-Mobile_Netherlands'),('204162443766383','31624','T-Mobile_Netherlands'),('204162443766384','31624','T-Mobile_Netherlands'),('204201000211900','31628','T-Mobile_Netherlands'),('204201000211967','31628','T-Mobile_Netherlands'),('204202000000990','31628','T-Mobile_Netherlands'),('204202000000991','31628','T-Mobile_Netherlands'),('20601','32475','Belgacom_BELGIUM'),('206050004526678','32468','Telenet_Belgium'),('206050004526691','32468','Telenet_Belgium'),('206050004526692','32468','Telenet_Belgium'),('20610','32495','Mobistar_BELGIUM'),('20620','32486','Base_BELGIUM'),('20801100010','33689','Orange_France'),('20801100011','33689','Orange_France'),('208011000120','33689','Orange_France'),('208011000121','33689','Orange_France'),('208011000122','33689','Orange_France'),('20801100012300','33689','Orange_France'),('20801100012301','33689','Orange_France'),('20801100012302','33689','Orange_France'),('20801100012303','33689','Orange_France'),('20801100012304','33689','Orange_France'),('20801100012305','33689','Orange_France'),('20801100012306','33689','Orange_France'),('20801100012307','33689','Orange_France'),('208011000123080','33689','Orange_France'),('208011000123081','33689','Orange_France'),('208011000123082','33689','Orange_France'),('208011000123083','33689','Orange_France'),('208011000123084','33689','Orange_France'),('208011000123085','33689','Orange_France'),('208011000123086','33689','Orange_France'),('208011000123087','33689','Orange_France'),('208011000123088','33689','Orange_France'),('208011000123089','33689','Orange_France'),('20801100012309','33689','Orange_France'),('2080110001231','33689','Orange_France'),('2080110001232','33689','Orange_France'),('2080110001233','33689','Orange_France'),('2080110001234','33689','Orange_France'),('2080110001235','33689','Orange_France'),('2080110001236','33689','Orange_France'),('2080110001237','33689','Orange_France'),('2080110001238','33689','Orange_France'),('2080110001239','33689','Orange_France'),('208011000124','33689','Orange_France'),('208011000125','33689','Orange_France'),('208011000126','33689','Orange_France'),('208011000127','33689','Orange_France'),('208011000128','33689','Orange_France'),('208011000129','33689','Orange_France'),('20801100013','33689','Orange_France'),('20801100014','33689','Orange_France'),('20801100015','33689','Orange_France'),('20801100016','33689','Orange_France'),('20801100017','33689','Orange_France'),('20801100018','33689','Orange_France'),('20801100019','33689','Orange_France'),('2080110002','33689','Orange_France'),('2080110003','33689','Orange_France'),('2080110004','33689','Orange_France'),('2080110005','33689','Orange_France'),('2080110006','33689','Orange_France'),('2080110007','33689','Orange_France'),('2080110008','33689','Orange_France'),('2080110009','33689','Orange_France'),('208011001','33689','Orange_France'),('208011002','33689','Orange_France'),('208011003','33689','Orange_France'),('208011004','33689','Orange_France'),('208011005','33689','Orange_France'),('208011006','33689','Orange_France'),('208011007','33689','Orange_France'),('208011008','33689','Orange_France'),('208011009','33689','Orange_France'),('20801101','33689','Orange_France'),('20801102','33689','Orange_France'),('20801103','33689','Orange_France'),('20801104','33689','Orange_France'),('20801105','33689','Orange_France'),('20801106','33689','Orange_France'),('20801107','33689','Orange_France'),('20801108','33689','Orange_France'),('20801109','33689','Orange_France'),('2080111','33689','Orange_France'),('2080112','33689','Orange_France'),('2080113','33689','Orange_France'),('2080114','33689','Orange_France'),('2080115','33689','Orange_France'),('2080116','33689','Orange_France'),('2080117','33689','Orange_France'),('2080118','33689','Orange_France'),('2080119','33689','Orange_France'),('208013','33689','Orange_France'),('208014','33689','Orange_France'),('208015','33689','Orange_France'),('208016','33689','Orange_France'),('208017','33689','Orange_France'),('208018','33689','Orange_France'),('208019','33689','Orange_France'),('20809','33611','SFR_France'),('20810','33609','SFR_France'),('20815','33695','Free_Mobile_FRANCE'),('20820','33660','Bouygues_Telecom_France'),('21401','34607','Vodafone_Spain'),('214030','34656','Orange_Spain'),('214031','34656','Orange_Spain'),('214032','34656','Orange_Spain'),('2140330','34656','Orange_Spain'),('2140331','34656','Orange_Spain'),('2140332','34656','Orange_Spain'),('2140333','34656','Orange_Spain'),('2140334','34656','Orange_Spain'),('2140335','34656','Orange_Spain'),('2140336','34656','Orange_Spain'),('21403370','34656','Orange_Spain'),('21403371','34656','Orange_Spain'),('21403372','34656','Orange_Spain'),('2140337300','34656','Orange_Spain'),('21403373010','34656','Orange_Spain'),('21403373011','34656','Orange_Spain'),('21403373012','34656','Orange_Spain'),('21403373013','34656','Orange_Spain'),('21403373014','34656','Orange_Spain'),('21403373015','34656','Orange_Spain'),('214033730160','34656','Orange_Spain'),('214033730161','34656','Orange_Spain'),('214033730162','34656','Orange_Spain'),('214033730163','34656','Orange_Spain'),('214033730164','34656','Orange_Spain'),('214033730165','34656','Orange_Spain'),('214033730166','34656','Orange_Spain'),('214033730167','34656','Orange_Spain'),('2140337301680','34656','Orange_Spain'),('2140337301681','34656','Orange_Spain'),('2140337301682','34656','Orange_Spain'),('2140337301683','34656','Orange_Spain'),('2140337301684','34656','Orange_Spain'),('21403373016850','34656','Orange_Spain'),('21403373016851','34656','Orange_Spain'),('21403373016852','34656','Orange_Spain'),('21403373016853','34656','Orange_Spain'),('214033730168540','34656','Orange_Spain'),('214033730168541','34656','Orange_Spain'),('214033730168542','34656','Orange_Spain'),('214033730168543','34656','Orange_Spain'),('214033730168544','34656','Orange_Spain'),('214033730168545','34656','Orange_Spain'),('214033730168546','34656','Orange_Spain'),('214033730168547','34656','Orange_Spain'),('214033730168548','34656','Orange_Spain'),('214033730168549','34656','Orange_Spain'),('21403373016855','34656','Orange_Spain'),('21403373016856','34656','Orange_Spain'),('21403373016857','34656','Orange_Spain'),('21403373016858','34656','Orange_Spain'),('21403373016859','34656','Orange_Spain'),('2140337301686','34656','Orange_Spain'),('2140337301687','34656','Orange_Spain'),('2140337301688','34656','Orange_Spain'),('2140337301689','34656','Orange_Spain'),('214033730169','34656','Orange_Spain'),('21403373017','34656','Orange_Spain'),('21403373018','34656','Orange_Spain'),('21403373019','34656','Orange_Spain'),('2140337302','34656','Orange_Spain'),('2140337303','34656','Orange_Spain'),('2140337304','34656','Orange_Spain'),('2140337305','34656','Orange_Spain'),('2140337306','34656','Orange_Spain'),('2140337307','34656','Orange_Spain'),('2140337308','34656','Orange_Spain'),('2140337309','34656','Orange_Spain'),('214033731','34656','Orange_Spain'),('214033732','34656','Orange_Spain'),('214033733','34656','Orange_Spain'),('214033734','34656','Orange_Spain'),('214033735','34656','Orange_Spain'),('214033736','34656','Orange_Spain'),('214033737','34656','Orange_Spain'),('214033738','34656','Orange_Spain'),('214033739','34656','Orange_Spain'),('21403374','34656','Orange_Spain'),('21403375','34656','Orange_Spain'),('21403376','34656','Orange_Spain'),('21403377','34656','Orange_Spain'),('21403378','34656','Orange_Spain'),('21403379','34656','Orange_Spain'),('2140338','34656','Orange_Spain'),('2140339','34656','Orange_Spain'),('214034','34656','Orange_Spain'),('214035','34656','Orange_Spain'),('214036','34656','Orange_Spain'),('214037','34656','Orange_Spain'),('214038','34656','Orange_Spain'),('214039','34656','Orange_Spain'),('21405','34648','Telefonica_Spain_ESPT2'),('21406','34607','Vodafone_Spain'),('21407','34609','Telefonica_Spain'),('21630','3630','Hungary_Telekom'),('21670','3670','Vodafone_Hungary'),('21803','38763','Croatian_Telecom'),('21901','38598','Telecom_Croatian'),('21902','38595','TELE_2_CROATIA'),('22001','38163','Mobtel_Serbia'),('22003','38164','Telekom_Serbia'),('22201','39339','TIM_ITALY'),('22210','39349','Vodafone_Omnitel_ITALY'),('22601','40722','Vodafone_Romania'),('22603','4076','Telekom-Mobile_Romania'),('22801','4179','Swisscom_Switzerland'),('22803','4178','Orange_Switzerland'),('23001','420603','T-Mobile_Czech-Republic'),('23002','420602','Czech_Republic'),('23003','420608','Vodafone_Czeech'),('23101','421905','Orange_SLOVAKIA'),('231020105243123','421903','T-Mobile_slovakia'),('231020105243124','421903','T-Mobile_slovakia'),('231020105243125','421903','T-Mobile_slovakia'),('231020105243126','421903','T-Mobile_slovakia'),('231020105243127','421903','T-Mobile_slovakia'),('231020107665554','421903','T-Mobile_slovakia'),('231020107665555','421903','T-Mobile_slovakia'),('231020107665556','421903','T-Mobile_slovakia'),('231020107665557','421903','T-Mobile_slovakia'),('23203','43676','T-Mobile_Austria'),('23207','43650','T-Mobile_Austria'),('23410','447802','UK_TELEFONICA'),('23415','44385','Vodafone_United_Kingdom'),('23430','447953','T-Mobile_UK'),('23450','447797','Telekom_Jersey'),('23455','447781','Sure_Limited_Guernsey'),('23801','45401','TDC_Denmark'),('238201001789892','4528','TELIA_DANMARK'),('238201001789893','4528','TELIA_DANMARK'),('238201001820509','4528','TELIA_DANMARK'),('24007','46707','Tele2_Sweeden'),('24010','46765','Lycamobile_Sweeden'),('24014','4676720','TDC_Sweden'),('24201','47900','Telenor_Norway'),('24208','479451','TDC_Norway'),('24405','35850','Elisa_Finland'),('244144573919427','3584570','NULL'),('244144573919429','3584570','NULL'),('244212000908392','358451','Elisa_Finland'),('244212000908393','358451','Elisa_Finland'),('244212000908407','358451','Elisa_Finland'),('24701','371292','Latvian_Mobile_Telephone'),('24802','37256','Elisa_Estonia'),('24803','37255','Tele2_Estonia'),('25001','79160','MTS_Russia'),('25002','792','MegaFon_Russia'),('25016','7902557','NTC_Russia'),('25020','790434','TELE2_RUSSIA'),('25099','79037','Vimpelcom_russia'),('25501','38050','MTS_UKraine'),('25503','38067','KyivstarOperator'),('25506','38063','lifecell_Ukraine'),('25702','375297','MTS_Belarus'),('259010103887776','373691','Orange_Moldova'),('259010103887777','373691','Orange_Moldova'),('259010103887778','373691','Orange_Moldova'),('259010103887779','373691','Orange_Moldova'),('259050125057010','37367','Moldtelecom_MOLDOVA'),('259050125057011','37367','Moldtelecom_MOLDOVA'),('259050125057012','37367','Moldtelecom_MOLDOVA'),('259050125057013','37367','Moldtelecom_MOLDOVA'),('259050125057014','37367','Moldtelecom_MOLDOVA'),('259050125057015','37367','Moldtelecom_MOLDOVA'),('259050125057016','37367','Moldtelecom_MOLDOVA'),('259050125057017','37367','Moldtelecom_MOLDOVA'),('259050125057018','37367','Moldtelecom_MOLDOVA'),('259050125057019','37367','Moldtelecom_MOLDOVA'),('259050125057020','37367','Moldtelecom_MOLDOVA'),('259050125057021','37367','Moldtelecom_MOLDOVA'),('260021173107739','48602','T-Mobile_Poland'),('260021173107740','48602','T-Mobile_Poland'),('260021271956453','48602','T-Mobile_Poland'),('260021271956454','48602','T-Mobile_Poland'),('260021372214393','48602','T-Mobile_Polska'),('260021472116543','48602','T-Mobile_Polska'),('260032001805073','48501','Orange_Poland'),('260032660997605','48501','Orange_Poland'),('26006000','48790','Play_Poland'),('26006001','48790','Play_Poland'),('26006002','48790','Play_Poland'),('26006003','48790','Play_Poland'),('26006004','48790','Play_Poland'),('26006005','48790','Play_Poland'),('26006006','48790','Play_Poland'),('26006007','48790','Play_Poland'),('260060080','48790','Play_Poland'),('2600600810','48790','Play_Poland'),('26006008110','48790','Play_Poland'),('26006008111','48790','Play_Poland'),('260060081120','48790','Play_Poland'),('260060081121','48790','Play_Poland'),('260060081122','48790','Play_Poland'),('260060081123','48790','Play_Poland'),('260060081124','48790','Play_Poland'),('260060081125','48790','Play_Poland'),('260060081126','48790','Play_Poland'),('2600600811270','48790','Play_Poland'),('2600600811271','48790','Play_Poland'),('2600600811272','48790','Play_Poland'),('2600600811273','48790','Play_Poland'),('2600600811274','48790','Play_Poland'),('2600600811275','48790','Play_Poland'),('2600600811276','48790','Play_Poland'),('260060081127700','48790','Play_Poland'),('260060081127701','48790','Play_Poland'),('260060081127702','48790','Play_Poland'),('260060081127703','48790','Play_Poland'),('260060081127704','48790','Play_Poland'),('260060081127705','48790','Play_Poland'),('260060081127706','48790','Play_Poland'),('260060081127707','48790','Play_Poland'),('260060081127708','48790','Play_Poland'),('260060081127709','48790','Play_Poland'),('26006008112771','48790','Play_Poland'),('26006008112772','48790','Play_Poland'),('26006008112773','48790','Play_Poland'),('26006008112774','48790','Play_Poland'),('26006008112775','48790','Play_Poland'),('26006008112776','48790','Play_Poland'),('26006008112777','48790','Play_Poland'),('26006008112778','48790','Play_Poland'),('26006008112779','48790','Play_Poland'),('2600600811278','48790','Play_Poland'),('2600600811279','48790','Play_Poland'),('260060081128','48790','Play_Poland'),('260060081129','48790','Play_Poland'),('26006008113','48790','Play_Poland'),('26006008114','48790','Play_Poland'),('26006008115','48790','Play_Poland'),('26006008116','48790','Play_Poland'),('26006008117','48790','Play_Poland'),('26006008118','48790','Play_Poland'),('26006008119','48790','Play_Poland'),('2600600812','48790','Play_Poland'),('2600600813','48790','Play_Poland'),('2600600814','48790','Play_Poland'),('2600600815','48790','Play_Poland'),('2600600816','48790','Play_Poland'),('2600600817','48790','Play_Poland'),('2600600818','48790','Play_Poland'),('2600600819','48790','Play_Poland'),('260060082','48790','Play_Poland'),('260060083','48790','Play_Poland'),('260060084','48790','Play_Poland'),('260060085','48790','Play_Poland'),('260060086','48790','Play_Poland'),('260060087','48790','Play_Poland'),('260060088','48790','Play_Poland'),('260060089','48790','Play_Poland'),('26006009','48790','Play_Poland'),('2600601','48790','Play_Poland'),('2600602','48790','Play_Poland'),('2600603','48790','Play_Poland'),('2600604','48790','Play_Poland'),('2600605','48790','Play_Poland'),('2600606','48790','Play_Poland'),('2600607','48790','Play_Poland'),('2600608','48790','Play_Poland'),('2600609','48790','Play_Poland'),('260061','48790','Play_Poland'),('260062','48790','Play_Poland'),('260063','48790','Play_Poland'),('260064','48790','Play_Poland'),('260065','48790','Play_Poland'),('260066','48790','Play_Poland'),('260067','48790','Play_Poland'),('260068','48790','Play_Poland'),('260069','48790','Play_Poland'),('262010','49171','Telekom_Germany'),('2620110','49171','Telekom_Germany'),('2620111','49171','Telekom_Germany'),('262011200','49171','Telekom_Germany'),('262011201','49171','Telekom_Germany'),('262011202','49171','Telekom_Germany'),('262011203','49171','Telekom_Germany'),('262011204','49171','Telekom_Germany'),('2620112050','49171','Telekom_Germany'),('2620112051','49171','Telekom_Germany'),('26201120520','49171','Telekom_Germany'),('26201120521','49171','Telekom_Germany'),('26201120522','49171','Telekom_Germany'),('262011205230','49171','Telekom_Germany'),('262011205231','49171','Telekom_Germany'),('262011205232','49171','Telekom_Germany'),('262011205233','49171','Telekom_Germany'),('262011205234','49171','Telekom_Germany'),('262011205235','49171','Telekom_Germany'),('262011205236','49171','Telekom_Germany'),('262011205237','49171','Telekom_Germany'),('262011205238','49171','Telekom_Germany'),('26201120523900','49171','Telekom_Germany'),('26201120523901','49171','Telekom_Germany'),('262011205239020','49171','Telekom_Germany'),('262011205239021','49171','Telekom_Germany'),('262011205239022','49171','Telekom_Germany'),('262011205239023','49171','Telekom_Germany'),('262011205239024','49171','Telekom_Germany'),('262011205239025','49171','Telekom_Germany'),('262011205239026','49171','Telekom_Germany'),('262011205239027','49171','Telekom_Germany'),('262011205239028','49171','Telekom_Germany'),('262011205239029','49171','Telekom_Germany'),('262011205239030','49171','Telekom_Germany'),('262011205239031','49171','Telekom_Germany'),('262011205239032','49171','Telekom_Germany'),('262011205239033','49171','Telekom_Germany'),('262011205239034','49171','Telekom_Germany'),('262011205239035','49171','Telekom_Germany'),('262011205239036','49171','Telekom_Germany'),('262011205239037','49171','Telekom_Germany'),('262011205239038','49171','Telekom_Germany'),('262011205239039','49171','Telekom_Germany'),('26201120523904','49171','Telekom_Germany'),('26201120523905','49171','Telekom_Germany'),('26201120523906','49171','Telekom_Germany'),('26201120523907','49171','Telekom_Germany'),('26201120523908','49171','Telekom_Germany'),('26201120523909','49171','Telekom_Germany'),('2620112052391','49171','Telekom_Germany'),('2620112052392','49171','Telekom_Germany'),('2620112052393','49171','Telekom_Germany'),('2620112052394','49171','Telekom_Germany'),('2620112052395','49171','Telekom_Germany'),('2620112052396','49171','Telekom_Germany'),('2620112052397','49171','Telekom_Germany'),('2620112052398','49171','Telekom_Germany'),('2620112052399','49171','Telekom_Germany'),('26201120524','49171','Telekom_Germany'),('26201120525','49171','Telekom_Germany'),('26201120526','49171','Telekom_Germany'),('26201120527','49171','Telekom_Germany'),('26201120528','49171','Telekom_Germany'),('26201120529','49171','Telekom_Germany'),('2620112053','49171','Telekom_Germany'),('2620112054','49171','Telekom_Germany'),('2620112055','49171','Telekom_Germany'),('2620112056','49171','Telekom_Germany'),('2620112057','49171','Telekom_Germany'),('2620112058','49171','Telekom_Germany'),('2620112059','49171','Telekom_Germany'),('262011206','49171','Telekom_Germany'),('262011207','49171','Telekom_Germany'),('262011208','49171','Telekom_Germany'),('262011209','49171','Telekom_Germany'),('26201121','49171','Telekom_Germany'),('26201122','49171','Telekom_Germany'),('26201123','49171','Telekom_Germany'),('26201124','49171','Telekom_Germany'),('26201125','49171','Telekom_Germany'),('26201126','49171','Telekom_Germany'),('26201127','49171','Telekom_Germany'),('26201128','49171','Telekom_Germany'),('26201129','49171','Telekom_Germany'),('2620113','49171','Telekom_Germany'),('2620114','49171','Telekom_Germany'),('2620115','49171','Telekom_Germany'),('2620116','49171','Telekom_Germany'),('2620117','49171','Telekom_Germany'),('2620118','49171','Telekom_Germany'),('2620119','49171','Telekom_Germany'),('262012','49171','Telekom_Germany'),('262013','49171','Telekom_Germany'),('262014','49171','Telekom_Germany'),('262015','49171','Telekom_Germany'),('262016','49171','Telekom_Germany'),('262017','49171','Telekom_Germany'),('262018','49171','Telekom_Germany'),('262019','49171','Telekom_Germany'),('26202','49172','Vodafone_Germany'),('26203','49177','Telefonica_Germany'),('26207','49176','Telefonica_Germany'),('26801','35191','Vodafone_Portugal'),('26806','35196','TMN_Portugal'),('27001','352021','POST_Luxembourg'),('27077','352091','Tango_Luxembourg'),('27099','352061','Orange_Luxemburg'),('272010','35387','Vodafone_Ireland'),('272011','35387','Vodafone_Ireland'),('272012','35387','Vodafone_Ireland'),('272013','35387','Vodafone_Ireland'),('272014','35387','Vodafone_Ireland'),('272015','35387','Vodafone_Ireland'),('272016','35387','Vodafone_Ireland'),('2720170','35387','Vodafone_Ireland'),('27201710','35387','Vodafone_Ireland'),('272017110','35387','Vodafone_Ireland'),('272017111','35387','Vodafone_Ireland'),('272017112','35387','Vodafone_Ireland'),('2720171130','35387','Vodafone_Ireland'),('2720171131','35387','Vodafone_Ireland'),('2720171132','35387','Vodafone_Ireland'),('27201711330','35387','Vodafone_Ireland'),('27201711331','35387','Vodafone_Ireland'),('27201711332','35387','Vodafone_Ireland'),('27201711333','35387','Vodafone_Ireland'),('27201711334','35387','Vodafone_Ireland'),('27201711335','35387','Vodafone_Ireland'),('27201711336','35387','Vodafone_Ireland'),('2720171133700','35387','Vodafone_Ireland'),('2720171133701','35387','Vodafone_Ireland'),('2720171133702','35387','Vodafone_Ireland'),('2720171133703','35387','Vodafone_Ireland'),('2720171133704','35387','Vodafone_Ireland'),('27201711337050','35387','Vodafone_Ireland'),('27201711337051','35387','Vodafone_Ireland'),('272017113370520','35387','Vodafone_Ireland'),('272017113370521','35387','Vodafone_Ireland'),('272017113370522','35387','Vodafone_Ireland'),('272017113370523','35387','Vodafone_Ireland'),('272017113370524','35387','Vodafone_Ireland'),('272017113370525','35387','Vodafone_Ireland'),('272017113370526','35387','Vodafone_Ireland'),('272017113370527','35387','Vodafone_Ireland'),('272017113370528','35387','Vodafone_Ireland'),('272017113370529','90542','Vodafone_Turkey'),('272017113370530','35387','Vodafone_Ireland'),('272017113370531','35387','Vodafone_Ireland'),('272017113370532','35387','Vodafone_Ireland'),('272017113370533','35387','Vodafone_Ireland'),('272017113370534','35387','Vodafone_Ireland'),('272017113370535','90542','Vodafone_Turkey'),('272017113370536','35387','Vodafone_Ireland'),('272017113370537','35387','Vodafone_Ireland'),('272017113370538','35387','Vodafone_Ireland'),('272017113370539','35387','Vodafone_Ireland'),('27201711337054','35387','Vodafone_Ireland'),('27201711337055','35387','Vodafone_Ireland'),('27201711337056','35387','Vodafone_Ireland'),('27201711337057','35387','Vodafone_Ireland'),('27201711337058','35387','Vodafone_Ireland'),('27201711337059','35387','Vodafone_Ireland'),('2720171133706','35387','Vodafone_Ireland'),('2720171133707','35387','Vodafone_Ireland'),('2720171133708','35387','Vodafone_Ireland'),('2720171133709','35387','Vodafone_Ireland'),('272017113371','35387','Vodafone_Ireland'),('272017113372','35387','Vodafone_Ireland'),('272017113373','35387','Vodafone_Ireland'),('272017113374','35387','Vodafone_Ireland'),('272017113375','35387','Vodafone_Ireland'),('272017113376','35387','Vodafone_Ireland'),('272017113377','35387','Vodafone_Ireland'),('272017113378','35387','Vodafone_Ireland'),('272017113379','35387','Vodafone_Ireland'),('27201711338','35387','Vodafone_Ireland'),('27201711339','35387','Vodafone_Ireland'),('2720171134','35387','Vodafone_Ireland'),('2720171135','35387','Vodafone_Ireland'),('2720171136','35387','Vodafone_Ireland'),('2720171137','35387','Vodafone_Ireland'),('2720171138','35387','Vodafone_Ireland'),('2720171139','35387','Vodafone_Ireland'),('272017114','35387','Vodafone_Ireland'),('272017115','35387','Vodafone_Ireland'),('272017116','35387','Vodafone_Ireland'),('272017117','35387','Vodafone_Ireland'),('272017118','35387','Vodafone_Ireland'),('272017119','35387','Vodafone_Ireland'),('27201712','35387','Vodafone_Ireland'),('27201713','35387','Vodafone_Ireland'),('27201714','35387','Vodafone_Ireland'),('27201715','35387','Vodafone_Ireland'),('27201716','35387','Vodafone_Ireland'),('27201717','35387','Vodafone_Ireland'),('27201718','35387','Vodafone_Ireland'),('27201719','35387','Vodafone_Ireland'),('2720172','35387','Vodafone_Ireland'),('2720173','35387','Vodafone_Ireland'),('2720174','35387','Vodafone_Ireland'),('2720175','35387','Vodafone_Ireland'),('2720176','35387','Vodafone_Ireland'),('2720177','35387','Vodafone_Ireland'),('2720178','35387','Vodafone_Ireland'),('2720179','35387','Vodafone_Ireland'),('272018','35387','Vodafone_Ireland'),('272019','35387','Vodafone_Ireland'),('27203','35385','Meteor_Ireland'),('274040299002034','354650','NULL'),('274040299002035','354650','NULL'),('274040299002036','354650','NULL'),('27601','35568','AMC_Albania'),('276020','35569','Vodafone_ALBANIA'),('2760210','35569','Vodafone_ALBANIA'),('2760211','35569','Vodafone_ALBANIA'),('2760212','35569','Vodafone_ALBANIA'),('2760213','35569','Vodafone_ALBANIA'),('2760214','35569','Vodafone_ALBANIA'),('2760215','35569','Vodafone_ALBANIA'),('2760216','35569','Vodafone_ALBANIA'),('2760217','35569','Vodafone_ALBANIA'),('2760218','35569','Vodafone_ALBANIA'),('27602190000','35569','Vodafone_ALBANIA'),('276021900010','35569','Vodafone_ALBANIA'),('276021900011','35569','Vodafone_ALBANIA'),('276021900012','35569','Vodafone_ALBANIA'),('276021900013','35569','Vodafone_ALBANIA'),('2760219000140','35569','Vodafone_ALBANIA'),('2760219000141','35569','Vodafone_ALBANIA'),('2760219000142','35569','Vodafone_ALBANIA'),('2760219000143','35569','Vodafone_ALBANIA'),('2760219000144','35569','Vodafone_ALBANIA'),('27602190001450','35569','Vodafone_ALBANIA'),('27602190001451','35569','Vodafone_ALBANIA'),('27602190001452','35569','Vodafone_ALBANIA'),('27602190001453','35569','Vodafone_ALBANIA'),('27602190001454','35569','Vodafone_ALBANIA'),('27602190001455','35569','Vodafone_ALBANIA'),('27602190001456','35569','Vodafone_ALBANIA'),('27602190001457','35569','Vodafone_ALBANIA'),('276021900014580','35569','Vodafone_ALBANIA'),('276021900014581','35569','Vodafone_ALBANIA'),('276021900014582','35569','Vodafone_ALBANIA'),('276021900014583','35569','Vodafone_ALBANIA'),('276021900014584','35569','Vodafone_ALBANIA'),('276021900014585','35569','Vodafone_ALBANIA'),('276021900014586','35569','Vodafone_ALBANIA'),('276021900014587','35569','Vodafone_ALBANIA'),('276021900014588','35569','Vodafone_ALBANIA'),('276021900014589','35569','Vodafone_ALBANIA'),('276021900014590','35569','Vodafone_ALBANIA'),('276021900014591','35569','Vodafone_ALBANIA'),('276021900014592','35569','Vodafone_ALBANIA'),('276021900014593','35569','Vodafone_ALBANIA'),('276021900014594','35569','Vodafone_ALBANIA'),('276021900014595','35569','Vodafone_ALBANIA'),('276021900014596','35569','Vodafone_ALBANIA'),('276021900014597','35569','Vodafone_ALBANIA'),('276021900014598','35569','Vodafone_ALBANIA'),('276021900014599','35569','Vodafone_ALBANIA'),('2760219000146','35569','Vodafone_ALBANIA'),('2760219000147','35569','Vodafone_ALBANIA'),('2760219000148','35569','Vodafone_ALBANIA'),('2760219000149','35569','Vodafone_ALBANIA'),('276021900015','35569','Vodafone_ALBANIA'),('276021900016','35569','Vodafone_ALBANIA'),('276021900017','35569','Vodafone_ALBANIA'),('276021900018','35569','Vodafone_ALBANIA'),('276021900019','35569','Vodafone_ALBANIA'),('27602190002','35569','Vodafone_ALBANIA'),('27602190003','35569','Vodafone_ALBANIA'),('27602190004','35569','Vodafone_ALBANIA'),('27602190005','35569','Vodafone_ALBANIA'),('27602190006','35569','Vodafone_ALBANIA'),('27602190007','35569','Vodafone_ALBANIA'),('27602190008','35569','Vodafone_ALBANIA'),('27602190009','35569','Vodafone_ALBANIA'),('2760219001','35569','Vodafone_ALBANIA'),('2760219002','35569','Vodafone_ALBANIA'),('2760219003','35569','Vodafone_ALBANIA'),('2760219004','35569','Vodafone_ALBANIA'),('2760219005','35569','Vodafone_ALBANIA'),('2760219006','35569','Vodafone_ALBANIA'),('2760219007','35569','Vodafone_ALBANIA'),('2760219008','35569','Vodafone_ALBANIA'),('2760219009','35569','Vodafone_ALBANIA'),('276021901','35569','Vodafone_ALBANIA'),('276021902','35569','Vodafone_ALBANIA'),('276021903','35569','Vodafone_ALBANIA'),('276021904','35569','Vodafone_ALBANIA'),('276021905','35569','Vodafone_ALBANIA'),('276021906','35569','Vodafone_ALBANIA'),('276021907','35569','Vodafone_ALBANIA'),('276021908','35569','Vodafone_ALBANIA'),('276021909','35569','Vodafone_ALBANIA'),('27602191','35569','Vodafone_ALBANIA'),('27602192','35569','Vodafone_ALBANIA'),('27602193','35569','Vodafone_ALBANIA'),('27602194','35569','Vodafone_ALBANIA'),('27602195','35569','Vodafone_ALBANIA'),('27602196','35569','Vodafone_ALBANIA'),('27602197','35569','Vodafone_ALBANIA'),('27602198','35569','Vodafone_ALBANIA'),('27602199','35569','Vodafone_ALBANIA'),('276022','35569','Vodafone_ALBANIA'),('276023','35569','Vodafone_ALBANIA'),('276024','35569','Vodafone_ALBANIA'),('276025','35569','Vodafone_ALBANIA'),('276026','35569','Vodafone_ALBANIA'),('276027','35569','Vodafone_ALBANIA'),('276028','35569','Vodafone_ALBANIA'),('276029','35569','Vodafone_ALBANIA'),('27801','35694','Vodafone_Malta'),('27821','35679','Mobisle.C.L_Malta'),('28001','35799','ICytamobile_Cyprus_Iran'),('283010000109902','37491','Armentel_Armenia'),('283010000109903','37491','Armentel_Armenia'),('283010000109904','37491','Armentel_Armenia'),('283010000109905','37491','Armentel_Armenia'),('28403','35987','Vivacom_Bulgaria'),('286010','90532','Turkcell_TURKEY'),('286011','90532','Turkcell_TURKEY'),('286012','90532','Turkcell_TURKEY'),('286013','90532','Turkcell_TURKEY'),('286014','90532','Turkcell_TURKEY'),('2860150','90532','Turkcell_TURKEY'),('2860151','90532','Turkcell_TURKEY'),('2860152','90532','Turkcell_TURKEY'),('2860153','90532','Turkcell_TURKEY'),('2860154','90532','Turkcell_TURKEY'),('2860155','90532','Turkcell_TURKEY'),('2860156','90532','Turkcell_TURKEY'),('28601570','90532','Turkcell_TURKEY'),('28601571','90532','Turkcell_TURKEY'),('286015720','90532','Turkcell_TURKEY'),('286015721','90532','Turkcell_TURKEY'),('286015722','90532','Turkcell_TURKEY'),('2860157230','90532','Turkcell_TURKEY'),('2860157231','90532','Turkcell_TURKEY'),('2860157232','90532','Turkcell_TURKEY'),('2860157233','90532','Turkcell_TURKEY'),('2860157234','90532','Turkcell_TURKEY'),('2860157235','90532','Turkcell_TURKEY'),('2860157236','90532','Turkcell_TURKEY'),('2860157237','90532','Turkcell_TURKEY'),('2860157238','90532','Turkcell_TURKEY'),('28601572390','90532','Turkcell_TURKEY'),('28601572391','90532','Turkcell_TURKEY'),('28601572392','90532','Turkcell_TURKEY'),('28601572393','90532','Turkcell_TURKEY'),('28601572394','90532','Turkcell_TURKEY'),('28601572395','90532','Turkcell_TURKEY'),('286015723960','90532','Turkcell_TURKEY'),('28601572396100','90532','Turkcell_TURKEY'),('28601572396101','90532','Turkcell_TURKEY'),('286015723961020','90532','Turkcell_TURKEY'),('286015723961021','90532','Turkcell_TURKEY'),('286015723961022','90532','Turkcell_TURKEY'),('286015723961023','90532','Turkcell_TURKEY'),('286015723961024','90532','Turkcell_TURKEY'),('286015723961025','90532','Turkcell_TURKEY'),('286015723961026','90532','Turkcell_TURKEY'),('286015723961027','90532','Turkcell_TURKEY'),('286015723961028','90532','Turkcell_TURKEY'),('286015723961030','90532','Turkcell_TURKEY'),('286015723961031','90532','Turkcell_TURKEY'),('286015723961032','90532','Turkcell_TURKEY'),('286015723961033','90532','Turkcell_TURKEY'),('286015723961034','90532','Turkcell_TURKEY'),('286015723961035','90532','Turkcell_TURKEY'),('286015723961036','90532','Turkcell_TURKEY'),('286015723961037','90532','Turkcell_TURKEY'),('286015723961038','90532','Turkcell_TURKEY'),('286015723961039','90532','Turkcell_TURKEY'),('28601572396104','90532','Turkcell_TURKEY'),('28601572396105','90532','Turkcell_TURKEY'),('28601572396106','90532','Turkcell_TURKEY'),('28601572396107','90532','Turkcell_TURKEY'),('28601572396108','90532','Turkcell_TURKEY'),('28601572396109','90532','Turkcell_TURKEY'),('2860157239611','90532','Turkcell_TURKEY'),('2860157239612','90532','Turkcell_TURKEY'),('2860157239613','90532','Turkcell_TURKEY'),('2860157239614','90532','Turkcell_TURKEY'),('2860157239615','90532','Turkcell_TURKEY'),('2860157239616','90532','Turkcell_TURKEY'),('2860157239617','90532','Turkcell_TURKEY'),('2860157239618','90532','Turkcell_TURKEY'),('2860157239619','90532','Turkcell_TURKEY'),('286015723962','90532','Turkcell_TURKEY'),('286015723963','90532','Turkcell_TURKEY'),('286015723964','90532','Turkcell_TURKEY'),('286015723965','90532','Turkcell_TURKEY'),('286015723966','90532','Turkcell_TURKEY'),('286015723967','90532','Turkcell_TURKEY'),('286015723968','90532','Turkcell_TURKEY'),('286015723969','90532','Turkcell_TURKEY'),('28601572397','90532','Turkcell_TURKEY'),('28601572398','90532','Turkcell_TURKEY'),('28601572399','90532','Turkcell_TURKEY'),('286015724','90532','Turkcell_TURKEY'),('286015725','90532','Turkcell_TURKEY'),('286015726','90532','Turkcell_TURKEY'),('286015727','90532','Turkcell_TURKEY'),('286015728','90532','Turkcell_TURKEY'),('286015729','90532','Turkcell_TURKEY'),('28601573','90532','Turkcell_TURKEY'),('28601574','90532','Turkcell_TURKEY'),('28601575','90532','Turkcell_TURKEY'),('28601576','90532','Turkcell_TURKEY'),('28601577','90532','Turkcell_TURKEY'),('28601578','90532','Turkcell_TURKEY'),('28601579','90532','Turkcell_TURKEY'),('2860158','90532','Turkcell_TURKEY'),('2860159','90532','Turkcell_TURKEY'),('286016','90532','Turkcell_TURKEY'),('286017','90532','Turkcell_TURKEY'),('286018','90532','Turkcell_TURKEY'),('286019','90532','Turkcell_TURKEY'),('28602','90542','Vodafone_Turkey'),('28603','90559','Telecom_Turkey'),('28604','90505','Avea_Turkey'),('293411100329353','38641','Telekom_Slovenia'),('293411100329354','38641','Telekom_Slovenia'),('293411100329355','38641','Telekom_Slovenia'),('293411100329356','38641','Telekom_Slovenia'),('293411100329357','38641','Telekom_Slovenia'),('297039000133574','38268','Mitel_Montenegro'),('297039000133575','38268','Mitel_Montenegro'),('297039000133576','38268','Mitel_Montenegro'),('297039000133577','38268','Mitel_Montenegro'),('297039000133578','38268','Mitel_Montenegro'),('302220','164758','TELUS_Canada'),('302370','151499','Fido_Canada'),('302500','151442','Videotron_Canada'),('302610','190561','Bell_Mobily_Canada'),('302720','170579','Rogers_Canada'),('302780','130652','Saskatel_Canada'),('310150','170450','AT\\&T\\'),('310160','191790','T-MobileUSA'),('310170','120990','AT\\&T\\'),('310200','150351','T-MobileUSA'),('310210','140547','T-MobileUSA'),('310220','140541','T-MobileUSA'),('310230','180185','T-Mobile_USA'),('310240','150545','T-MobileUSA'),('310250','180825','T-MobileUSA'),('3102600','140547','T-MobileUSA'),('31026010','140547','T-MobileUSA'),('310260110','140547','T-MobileUSA'),('310260111','140547','T-MobileUSA'),('310260112','140547','T-MobileUSA'),('310260113','140547','T-MobileUSA'),('310260114','140547','T-MobileUSA'),('310260115','140547','T-MobileUSA'),('310260116','140547','T-MobileUSA'),('3102601170','140547','T-MobileUSA'),('3102601171','140547','T-MobileUSA'),('31026011720','140547','T-MobileUSA'),('310260117210','140547','T-MobileUSA'),('310260117211','140547','T-MobileUSA'),('310260117212','140547','T-MobileUSA'),('310260117213','140547','T-MobileUSA'),('310260117214','140547','T-MobileUSA'),('310260117215','140547','T-MobileUSA'),('310260117216','140547','T-MobileUSA'),('310260117217','140547','T-MobileUSA'),('310260117218','140547','T-MobileUSA'),('3102601172190','140547','T-MobileUSA'),('3102601172191','140547','T-MobileUSA'),('3102601172192','140547','T-MobileUSA'),('3102601172193','140547','T-MobileUSA'),('3102601172194','140547','T-MobileUSA'),('310260117219500','140547','T-MobileUSA'),('310260117219501','140547','T-MobileUSA'),('310260117219502','140547','T-MobileUSA'),('310260117219503','140547','T-MobileUSA'),('310260117219504','140547','T-MobileUSA'),('310260117219505','140547','T-MobileUSA'),('310260117219506','140547','T-MobileUSA'),('310260117219507','140547','T-MobileUSA'),('310260117219508','140547','T-MobileUSA'),('310260117219509','140547','T-MobileUSA'),('31026011721951','140547','T-MobileUSA'),('31026011721952','140547','T-MobileUSA'),('31026011721953','140547','T-MobileUSA'),('31026011721954','140547','T-MobileUSA'),('31026011721955','140547','T-MobileUSA'),('31026011721956','140547','T-MobileUSA'),('31026011721957','140547','T-MobileUSA'),('31026011721958','140547','T-MobileUSA'),('31026011721959','140547','T-MobileUSA'),('3102601172196','140547','T-MobileUSA'),('3102601172197','140547','T-MobileUSA'),('3102601172198','140547','T-MobileUSA'),('3102601172199','140547','T-MobileUSA'),('31026011722','140547','T-MobileUSA'),('31026011723','140547','T-MobileUSA'),('31026011724','140547','T-MobileUSA'),('31026011725','140547','T-MobileUSA'),('31026011726','140547','T-MobileUSA'),('31026011727','140547','T-MobileUSA'),('31026011728','140547','T-MobileUSA'),('31026011729','140547','T-MobileUSA'),('3102601173','140547','T-MobileUSA'),('3102601174','140547','T-MobileUSA'),('3102601175','140547','T-MobileUSA'),('3102601176','140547','T-MobileUSA'),('3102601177','140547','T-MobileUSA'),('3102601178','140547','T-MobileUSA'),('3102601179','140547','T-MobileUSA'),('310260118','140547','T-MobileUSA'),('310260119','140547','T-MobileUSA'),('31026012','140547','T-MobileUSA'),('31026013','140547','T-MobileUSA'),('31026014','140547','T-MobileUSA'),('31026015','140547','T-MobileUSA'),('31026016','140547','T-MobileUSA'),('31026017','140547','T-MobileUSA'),('31026018','140547','T-MobileUSA'),('31026019','140547','T-MobileUSA'),('3102602','140547','T-MobileUSA'),('3102603','140547','T-MobileUSA'),('3102604','140547','T-MobileUSA'),('3102605','140547','T-MobileUSA'),('3102606','140547','T-MobileUSA'),('3102607','140547','T-MobileUSA'),('3102608','140547','T-MobileUSA'),('3102609','140547','T-MobileUSA'),('310270','133433','T-MobileUSA'),('310310','181326','T-MobileUSA'),('310380','197037','AT\\&T_Mobility'),('310410','131231','AT\\&T_USA'),('310420','151324','CBW_USA'),('310490','170434','T-MobileUSA'),('310580','171720','T-Mobile\\'),('310660','140445','T-Mobile\\'),('310800','164662','T-Mobile\\'),('311270','190370299','Verizon_USA'),('311480','190370299','Verizon_USA'),('334020','52941','Telecel_Mexico'),('334030','52942','Telefonica_Mexico'),('33420','52941','Telecel_Mexico'),('338050000539871','1876380','Digicel_Group'),('338050000539872','1876380','Digicel_Group'),('338050019742111','1876380','Digicel_Group'),('338050019742112','1876380','Digicel_Group'),('370020019561818','182996','Claro_Dominicana'),('370020223285967','182996','Claro_Dominicana'),('370020223285968','182996','Claro_Dominicana'),('370020223285969','182996','Claro_Dominicana'),('370020223285970','182996','Claro_Dominicana'),('370020223285971','182996','Claro_Dominicana'),('40001','99450','Azecell_Azerbaijan'),('400027010383903','99455','Backcell_Azerbaijan'),('400027010383904','99455','Backcell_Azerbaijan'),('400027010383905','99455','Backcell_Azerbaijan'),('400027010383906','99455','Backcell_Azerbaijan'),('400027010383907','99455','Backcell_Azerbaijan'),('400027010383908','99455','Backcell_Azerbaijan'),('400027010383956','99455','Backcell_Azerbaijan'),('400027010383957','99455','Backcell_Azerbaijan'),('400027010383958','99455','Backcell_Azerbaijan'),('400027010383959','99455','Backcell_Azerbaijan'),('40004','99470','Azerfon_LLC_Azerbaijan'),('401015577806612','7705','Kar-tel_Kazakhstan'),('401015577806613','7705','Kar-tel_Kazakhstan'),('401015577806615','7705','Kar-tel_Kazakhstan'),('401018000000109','7057','KAR_TEL_KAZAKHSTAN'),('401018000000110','7057','KAR_TEL_KAZAKHSTAN'),('401018000000111','7057','KAR_TEL_KAZAKHSTAN'),('401018000000112','7057','KAR_TEL_KAZAKHSTAN'),('40402','919815','AIRTEL_Bharti_india_Punjab'),('40403','919816','AIRTEL_Bharti_india_Himachal_Pradesh'),('40405','919825','Vodafone_West_India'),('40410','919810','AIRTEL_Bharti_india_Delhi'),('40411','919811','Vodafone_Essar_Mobile_India'),('40416','919810','Bharti_Airtel'),('40420','919820','VODAFONE_India'),('40421','919821','LoopMobile_India'),('40427','919823','Vodafone_MAHARASHTRA_India'),('40430','919830','VODAFONE_East_India'),('40431','919831','AIRTEL_Bharti_india_Kolkata'),('40440','919840','AIRTEL_Bharti\\'),('40445','919845','AIRTEL_Bharti_india_Karnataka'),('40449','919849','AIRTEL_Bharti_india_Andhra_Pradesh'),('40470','919829','AIRTEL_Bharti_india_Rajasthan'),('40490','919890','AIRTEL_Bharti_india_Maharashtra'),('40492','919892','AIRTEL_Bharti_india_Mumbai'),('40493','919893','AIRTEL_Bharti_india_Madhya_pradesh'),('40494','919894','AIRTEL_Bharti_india_Tamil'),('40495','919895','AIRTEL_Bharti_india_Kerala'),('40496','919896','AIRTEL_Bharti_india_Haryana'),('40497','919897','AIRTEL_Bharti_india_Uttar_Pradesh_West'),('40498','919898','AIRTEL_Bharti_india_Gujar'),('405025','919030','TATA_Docomo_India'),('405027','919031','TATA_Docomo_India'),('405029','917796','TATA_Docomo_India'),('405030','919033','TATA_Docomo_India'),('405031','919034','TATA_Docomo_India'),('405032','918091','TATA_Docomo_India'),('405034','919036','TATA_Docomo_India'),('405035','919037','TATA_Docomo_India'),('405036','919038','TATA_Docomo_India'),('405037','919028','TATA_Docomo_India'),('405038','919039','TATA_Docomo_India'),('405039','919029','TATA_Docomo_India'),('405041','919040','TATA_Docomo_India'),('405042','919041','TATA_Docomo_India'),('405043','917737','TATA_Docomo_India'),('405044','919043','TATA_Docomo_India'),('405045','919044','TATA_Docomo_India'),('405046','919045','TATA_Docomo_India'),('405047','919046','TATA_Docomo_India'),('40551','919810','Bharti_Airtel'),('40552','919810','Bharti_Airtel'),('40553','919810','Bharti_Airtel'),('40554','919810','Bharti_Airtel'),('40555','919810','Bharti_Airtel'),('40556','919810','Bharti_Airtel'),('41004','9231','CMPak_Pakistan'),('41006','92345','Telenor_Pakistan'),('41007','92321','Warid_Tel_Pakistan'),('412012200202902','9370','Afghanistan_Wireless'),('412012200202903','9370','Afghanistan_Wireless'),('412500219534483','9378','Etisalat_Afghanistan'),('412500219534484','9378','Etisalat_Afghanistan'),('412500219534485','9378','Etisalat_Afghanistan'),('412500219534486','9378','Etisalat_Afghanistan'),('412500219534487','9378','Etisalat_Afghanistan'),('412500219534488','9378','Etisalat_Afghanistan'),('412500219534489','9378','Etisalat_Afghanistan'),('412500219534490','9378','Etisalat_Afghanistan'),('412500219534491','9378','Etisalat_Afghanistan'),('412500219534492','9378','Etisalat_Afghanistan'),('41301','9471','Mobitel_Sirilanka'),('41302','9477','Dialog_SriLanka'),('41405','95997','Ooredoo_Myanmar'),('41501','96134','MIC1_Libanon'),('41503','96139','MIC2_Lebanon'),('41601','96279','Zain_Jordan'),('41603','96278','UMNIAH_JORDAN'),('41677','96277','Orange_Jordan'),('41701','96393','Syriatel_Syria'),('41702','96394','MTN-SYRIA'),('418050001949738','9647701','Asiacell_IRQ'),('418050001949741','9647701','Asiacell_IRQ'),('41820','9647802','Zain_Iraq'),('41830','96479','Iraqna_Iraq'),('41902','96596','Zain_Kuwait'),('41903','9656','Ooredoo_Kuwait'),('41904','965500','KTC_Viva_Kuwait'),('42001','96650','Aljawal_Saudi'),('42003','96656','Mobily_Saudi'),('4200400','96659','Zain_Saudi'),('4200401','96659','Zain_Saudi'),('42004020','96659','Zain_Saudi'),('42004021','96659','Zain_Saudi'),('420040220','96659','Zain_Saudi'),('420040221','96659','Zain_Saudi'),('420040222','96659','Zain_Saudi'),('420040223','96659','Zain_Saudi'),('420040224','96659','Zain_Saudi'),('420040225','96659','Zain_Saudi'),('4200402260','96659','Zain_Saudi'),('4200402261','96659','Zain_Saudi'),('4200402262','96659','Zain_Saudi'),('4200402263','96659','Zain_Saudi'),('4200402264','96659','Zain_Saudi'),('4200402265','96659','Zain_Saudi'),('4200402266','96659','Zain_Saudi'),('4200402267','96659','Zain_Saudi'),('4200402268','96659','Zain_Saudi'),('42004022690','96659','Zain_Saudi'),('42004022691','96659','Zain_Saudi'),('42004022692','96659','Zain_Saudi'),('42004022693','96659','Zain_Saudi'),('420040226940','96659','Zain_Saudi'),('420040226941','96659','Zain_Saudi'),('420040226942','96659','Zain_Saudi'),('420040226943','96659','Zain_Saudi'),('420040226944','96659','Zain_Saudi'),('4200402269450','96659','Zain_Saudi'),('4200402269451','96659','Zain_Saudi'),('4200402269452','96659','Zain_Saudi'),('4200402269453','96659','Zain_Saudi'),('4200402269454','96659','Zain_Saudi'),('4200402269455','96659','Zain_Saudi'),('42004022694560','96659','Zain_Saudi'),('42004022694561','96659','Zain_Saudi'),('42004022694562','96659','Zain_Saudi'),('42004022694563','96659','Zain_Saudi'),('420040226945640','96659','Zain_Saudi'),('420040226945641','96659','Zain_Saudi'),('420040226945642','96659','Zain_Saudi'),('420040226945643','96659','Zain_Saudi'),('420040226945644','96659','Zain_Saudi'),('420040226945645','96659','Zain_Saudi'),('420040226945646','96659','Zain_Saudi'),('420040226945647','96659','Zain_Saudi'),('420040226945648','96659','Zain_Saudi'),('420040226945649','96659','Zain_Saudi'),('42004022694565','96659','Zain_Saudi'),('42004022694566','96659','Zain_Saudi'),('42004022694567','96659','Zain_Saudi'),('42004022694568','96659','Zain_Saudi'),('42004022694569','96659','Zain_Saudi'),('4200402269457','96659','Zain_Saudi'),('4200402269458','96659','Zain_Saudi'),('4200402269459','96659','Zain_Saudi'),('420040226946','96659','Zain_Saudi'),('420040226947','96659','Zain_Saudi'),('420040226948','96659','Zain_Saudi'),('420040226949','96659','Zain_Saudi'),('42004022695','96659','Zain_Saudi'),('42004022696','96659','Zain_Saudi'),('42004022697','96659','Zain_Saudi'),('42004022698','96659','Zain_Saudi'),('42004022699','96659','Zain_Saudi'),('420040227','96659','Zain_Saudi'),('420040228','96659','Zain_Saudi'),('420040229','96659','Zain_Saudi'),('42004023','96659','Zain_Saudi'),('42004024','96659','Zain_Saudi'),('42004025','96659','Zain_Saudi'),('42004026','96659','Zain_Saudi'),('42004027','96659','Zain_Saudi'),('42004028','96659','Zain_Saudi'),('42004029','96659','Zain_Saudi'),('4200403','96659','Zain_Saudi'),('4200404','96659','Zain_Saudi'),('4200405','96659','Zain_Saudi'),('4200406','96659','Zain_Saudi'),('4200407','96659','Zain_Saudi'),('4200408','96659','Zain_Saudi'),('4200409','96659','Zain_Saudi'),('420041','96659','Zain_Saudi'),('420042','96659','Zain_Saudi'),('420043','96659','Zain_Saudi'),('420044','96659','Zain_Saudi'),('420045','96659','Zain_Saudi'),('420046','96659','Zain_Saudi'),('420047','96659','Zain_Saudi'),('420048','96659','Zain_Saudi'),('420049','96659','Zain_Saudi'),('42005','966570','SAUVG_KSA'),('42101','96771','Sabafon_Yemen'),('42202','96892','Omantel_Oman'),('42203','96895','Ooredoo_Oman'),('424020','97150','Etisalat_UAE'),('424021','97150','Etisalat_UAE'),('424022','97150','Etisalat_UAE'),('424023','97150','Etisalat_UAE'),('424024','97150','Etisalat_UAE'),('424025','97150','Etisalat_UAE'),('42402601','97150','Etisalat_UAE'),('424026020','97150','Etisalat_UAE'),('424026021','97150','Etisalat_UAE'),('424026022','97150','Etisalat_UAE'),('424026023','97150','Etisalat_UAE'),('424026024000','97150','Etisalat_UAE'),('424026024001','97150','Etisalat_UAE'),('424026024002','97150','Etisalat_UAE'),('4240260240030','97150','Etisalat_UAE'),('4240260240031','97150','Etisalat_UAE'),('4240260240032','97150','Etisalat_UAE'),('4240260240033','97150','Etisalat_UAE'),('4240260240034','97150','Etisalat_UAE'),('4240260240035','97150','Etisalat_UAE'),('42402602400360','97150','Etisalat_UAE'),('42402602400361','97150','Etisalat_UAE'),('42402602400362','97150','Etisalat_UAE'),('42402602400363','97150','Etisalat_UAE'),('42402602400364','97150','Etisalat_UAE'),('42402602400365','97150','Etisalat_UAE'),('42402602400366','97150','Etisalat_UAE'),('42402602400367','97150','Etisalat_UAE'),('424026024003680','97150','Etisalat_UAE'),('424026024003681','97150','Etisalat_UAE'),('424026024003682','97150','Etisalat_UAE'),('424026024003683','97150','Etisalat_UAE'),('424026024003684','97150','Etisalat_UAE'),('424026024003685','97150','Etisalat_UAE'),('424026024003686','97150','Etisalat_UAE'),('424026024003687','97150','Etisalat_UAE'),('424026024003688','97150','Etisalat_UAE'),('424026024003689','97150','Etisalat_UAE'),('42402602400369','97150','Etisalat_UAE'),('4240260240037','97150','Etisalat_UAE'),('4240260240038','97150','Etisalat_UAE'),('4240260240039','97150','Etisalat_UAE'),('424026024004','97150','Etisalat_UAE'),('424026024005','97150','Etisalat_UAE'),('424026024006','97150','Etisalat_UAE'),('424026024007','97150','Etisalat_UAE'),('424026024008','97150','Etisalat_UAE'),('424026024009','97150','Etisalat_UAE'),('42402602401','97150','Etisalat_UAE'),('42402602402','97150','Etisalat_UAE'),('42402602403','97150','Etisalat_UAE'),('42402602404','97150','Etisalat_UAE'),('42402602405','97150','Etisalat_UAE'),('42402602406','97150','Etisalat_UAE'),('42402602407','97150','Etisalat_UAE'),('42402602408','97150','Etisalat_UAE'),('42402602409','97150','Etisalat_UAE'),('4240260241','97150','Etisalat_UAE'),('4240260242','97150','Etisalat_UAE'),('4240260243','97150','Etisalat_UAE'),('4240260244','97150','Etisalat_UAE'),('4240260245','97150','Etisalat_UAE'),('4240260246','97150','Etisalat_UAE'),('4240260247','97150','Etisalat_UAE'),('4240260248','97150','Etisalat_UAE'),('4240260249','97150','Etisalat_UAE'),('424026025','97150','Etisalat_UAE'),('424026026','97150','Etisalat_UAE'),('424026027','97150','Etisalat_UAE'),('424026028','97150','Etisalat_UAE'),('424026029','97150','Etisalat_UAE'),('42402603','97150','Etisalat_UAE'),('42402604','97150','Etisalat_UAE'),('42402605','97150','Etisalat_UAE'),('42402606','97150','Etisalat_UAE'),('42402607','97150','Etisalat_UAE'),('42402608','97150','Etisalat_UAE'),('42402609','97150','Etisalat_UAE'),('4240261','97150','Etisalat_UAE'),('4240262','97150','Etisalat_UAE'),('4240263','97150','Etisalat_UAE'),('4240264','97150','Etisalat_UAE'),('4240265','97150','Etisalat_UAE'),('4240266','97150','Etisalat_UAE'),('4240267','97150','Etisalat_UAE'),('4240268','97150','Etisalat_UAE'),('4240269','97150','Etisalat_UAE'),('424027','97150','Etisalat_UAE'),('424028','97150','Etisalat_UAE'),('424029','97150','Etisalat_UAE'),('4240300','97155','Du_UAE'),('4240301','97155','Du_UAE'),('42403020','97155','Du_UAE'),('424030210','97155','Du_UAE'),('424030211','97155','Du_UAE'),('424030212','97155','Du_UAE'),('424030213','97155','Du_UAE'),('424030214','97155','Du_UAE'),('424030215','97155','Du_UAE'),('4240302160','97155','Du_UAE'),('42403021610','97155','Du_UAE'),('42403021611','97155','Du_UAE'),('424030216120','97155','Du_UAE'),('424030216121','97155','Du_UAE'),('424030216122','97155','Du_UAE'),('4240302161230','97155','Du_UAE'),('4240302161231','97155','Du_UAE'),('42403021612320','97155','Du_UAE'),('42403021612321','97155','Du_UAE'),('42403021612322','97155','Du_UAE'),('42403021612323','97155','Du_UAE'),('42403021612324','97155','Du_UAE'),('424030216123250','97155','Du_UAE'),('424030216123251','97155','Du_UAE'),('424030216123252','97155','Du_UAE'),('424030216123253','97155','Du_UAE'),('424030216123254','97155','Du_UAE'),('424030216123255','97155','Du_UAE'),('424030216123256','97155','Du_UAE'),('424030216123257','97155','Du_UAE'),('424030216123258','97155','Du_UAE'),('424030216123259','97155','Du_UAE'),('42403021612326','97155','Du_UAE'),('42403021612327','97155','Du_UAE'),('42403021612328','97155','Du_UAE'),('42403021612329','97155','Du_UAE'),('4240302161233','97155','Du_UAE'),('4240302161234','97155','Du_UAE'),('4240302161235','97155','Du_UAE'),('4240302161236','97155','Du_UAE'),('4240302161237','97155','Du_UAE'),('4240302161238','97155','Du_UAE'),('4240302161239','97155','Du_UAE'),('424030216124','97155','Du_UAE'),('424030216125','97155','Du_UAE'),('424030216126','97155','Du_UAE'),('424030216127','97155','Du_UAE'),('424030216128','97155','Du_UAE'),('424030216129','97155','Du_UAE'),('42403021613','97155','Du_UAE'),('42403021614','97155','Du_UAE'),('42403021615','97155','Du_UAE'),('42403021616','97155','Du_UAE'),('42403021617','97155','Du_UAE'),('42403021618','97155','Du_UAE'),('42403021619','97155','Du_UAE'),('4240302162','97155','Du_UAE'),('4240302163','97155','Du_UAE'),('4240302164','97155','Du_UAE'),('4240302165','97155','Du_UAE'),('4240302166','97155','Du_UAE'),('4240302167','97155','Du_UAE'),('4240302168','97155','Du_UAE'),('4240302169','97155','Du_UAE'),('424030217','97155','Du_UAE'),('424030218','97155','Du_UAE'),('424030219','97155','Du_UAE'),('42403022','97155','Du_UAE'),('42403023','97155','Du_UAE'),('42403024','97155','Du_UAE'),('42403025','97155','Du_UAE'),('42403026','97155','Du_UAE'),('42403027','97155','Du_UAE'),('42403028','97155','Du_UAE'),('42403029','97155','Du_UAE'),('4240303','97155','Du_UAE'),('4240304','97155','Du_UAE'),('4240305','97155','Du_UAE'),('4240306','97155','Du_UAE'),('4240307','97155','Du_UAE'),('4240308','97155','Du_UAE'),('4240309','97155','Du_UAE'),('424031','97155','Du_UAE'),('424032','97155','Du_UAE'),('424033','97155','Du_UAE'),('424034','97155','Du_UAE'),('424035','97155','Du_UAE'),('424036','97155','Du_UAE'),('424037','97155','Du_UAE'),('424038','97155','Du_UAE'),('424039','97155','Du_UAE'),('42506','97256','Wataniya_Oalestine'),('42601','97339','Batelco_Bahrain'),('42602','97336','Zain_Bahrain'),('42604','97333','VIVA_BAHRAIN'),('42701','97455','Qtel_Qatar'),('42702','97477','Vodafone_Qatar'),('42888','97688','UNITEL_MONGOLIE'),('432110100943200','98911','MobileTelecom_IRAN'),('432110100943201','98911','MobileTelecom_IRAN'),('432110200187192','98911','MobileTelecom_IRAN'),('432110200187193','98911','MobileTelecom_IRAN'),('43220','98920','Rightel_IRAN'),('43235','98935','MTN_IRAN'),('43404','99890','UNITEL_UZBAKISTAN'),('43709','99670','NurTelekom_Kyrgyztan'),('44010','8190542','NTT_DOCOMO_JAPAN'),('44050','8180931','KDDI_JAPAN'),('44051','8180984','KDDI_JAPAN_2'),('450081210001404','8210291','KT_KOREA'),('450081210001405','8210291','KT_KOREA'),('45201','8490','MobiFone_Vietnam'),('45400','852902','CSL_Hongkong'),('45403','852633','Hutchison_Hongkong_3G'),('45404','852949','Hutchison_Hongkong'),('45412','852920','Peoples_HongKong'),('454161103730079','852923','HongKong_Telecom2G'),('454161103730080','852923','HongKong_Telecom2G'),('454195000450707','852923','Hong-Kong_Telecom3G'),('454195000450708','852923','Hong-Kong_Telecom3G'),('45501','85368989','CTM_Macau'),('45618','85511','Mfone_Cambodia'),('460000153141128','86139','China_Mobile'),('46001','86130','Unicom_China'),('460020396050120','86138','China_Mobile'),('460077110753652','86157','China_Mobile'),('460079144822872','86157','China_Mobile'),('46009','86186','Unicom_China'),('46689','886986','starTelecom_Taiwan'),('47002','88018','Robi_Bangladesh'),('470070030023637','88016','Airtel_Bengladech'),('470070030023638','88016','Airtel_Bengladech'),('470070030023639','88016','Airtel_Bengladech'),('47202','96096','Ooredoo_Maldives'),('50212','6012','Maxis_Malaysia'),('50218','6018','uMobile-Malysia'),('50503','61415','Vodafone_Australia'),('51001','62816','Indosat_Indonesia'),('51010','62811','TELKOMSELINDONESI'),('514010073640010','67073','Telkomcel_Timor'),('514010073640011','67073','Telkomcel_Timor'),('514010073640012','67073','Telkomcel_Timor'),('514010073640013','67073','Telkomcel_Timor'),('51502','63917','Globe_Telecom_Philippines'),('51503','63918','SMART_PHILLIPINES'),('52000','66830','True-Move_Thailand'),('520044000035700','66938','True-Move_Thailand'),('520044000035701','66938','True-Move_Thailand'),('520044000035702','66938','True-Move_Thailand'),('52005','66950','DTAC_Thailand'),('52503','659','MobileOneLtd_Singapore'),('52811','67387','DST_Brunei'),('53001','6421','Vodafone_NewZealand'),('53024','6422','Two-Degrees_NewZealand'),('547200105044497','68987','Vini-French_Polenysia'),('547200105044498','68987','Vini-French_Polenysia'),('547200105044499','68987','Vini-French_Polenysia'),('547200105044500','68987','Vini-French_Polenysia'),('547200105044501','68987','Vini-French_Polenysia'),('60201','2012','Mobinil_EGYPT'),('60202','2010','Vodafone_Egypt'),('6020300','2011','Etisalat_Egypt'),('6020301','2011','Etisalat_Egypt'),('6020302','2011','Etisalat_Egypt'),('6020303','2011','Etisalat_Egypt'),('6020304','2011','Etisalat_Egypt'),('6020305','2011','Etisalat_Egypt'),('6020306','2011','Etisalat_Egypt'),('6020307','2011','Etisalat_Egypt'),('6020308','2011','Etisalat_Egypt'),('60203090','2011','Etisalat_Egypt'),('60203091','2011','Etisalat_Egypt'),('60203092','2011','Etisalat_Egypt'),('60203093','2011','Etisalat_Egypt'),('60203094','2011','Etisalat_Egypt'),('60203095','2011','Etisalat_Egypt'),('602030960','2011','Etisalat_Egypt'),('602030961','2011','Etisalat_Egypt'),('602030962','2011','Etisalat_Egypt'),('602030963','2011','Etisalat_Egypt'),('602030964','2011','Etisalat_Egypt'),('602030965','2011','Etisalat_Egypt'),('602030966','2011','Etisalat_Egypt'),('6020309670','2011','Etisalat_Egypt'),('60203096710','2011','Etisalat_Egypt'),('60203096711','2011','Etisalat_Egypt'),('6020309671200','2011','Etisalat_Egypt'),('6020309671201','2011','Etisalat_Egypt'),('60203096712020','2011','Etisalat_Egypt'),('60203096712021','2011','Etisalat_Egypt'),('60203096712022','2011','Etisalat_Egypt'),('60203096712023','2011','Etisalat_Egypt'),('60203096712024','2011','Etisalat_Egypt'),('602030967120250','2011','Etisalat_Egypt'),('602030967120251','2011','Etisalat_Egypt'),('602030967120252','2011','Etisalat_Egypt'),('602030967120253','2011','Etisalat_Egypt'),('602030967120254','2011','Etisalat_Egypt'),('602030967120255','2011','Etisalat_Egypt'),('602030967120256','2011','Etisalat_Egypt'),('602030967120257','2011','Etisalat_Egypt'),('602030967120258','2011','Etisalat_Egypt'),('602030967120259','2011','Etisalat_Egypt'),('60203096712026','2011','Etisalat_Egypt'),('60203096712027','2011','Etisalat_Egypt'),('60203096712028','2011','Etisalat_Egypt'),('60203096712029','2011','Etisalat_Egypt'),('6020309671203','2011','Etisalat_Egypt'),('6020309671204','2011','Etisalat_Egypt'),('6020309671205','2011','Etisalat_Egypt'),('6020309671206','2011','Etisalat_Egypt'),('6020309671207','2011','Etisalat_Egypt'),('6020309671208','2011','Etisalat_Egypt'),('6020309671209','2011','Etisalat_Egypt'),('602030967121','2011','Etisalat_Egypt'),('602030967122','2011','Etisalat_Egypt'),('602030967123','2011','Etisalat_Egypt'),('602030967124','2011','Etisalat_Egypt'),('602030967125','2011','Etisalat_Egypt'),('602030967126','2011','Etisalat_Egypt'),('602030967127','2011','Etisalat_Egypt'),('602030967128','2011','Etisalat_Egypt'),('602030967129','2011','Etisalat_Egypt'),('60203096713','2011','Etisalat_Egypt'),('60203096714','2011','Etisalat_Egypt'),('60203096715','2011','Etisalat_Egypt'),('60203096716','2011','Etisalat_Egypt'),('60203096717','2011','Etisalat_Egypt'),('60203096718','2011','Etisalat_Egypt'),('60203096719','2011','Etisalat_Egypt'),('6020309672','2011','Etisalat_Egypt'),('6020309673','2011','Etisalat_Egypt'),('6020309674','2011','Etisalat_Egypt'),('6020309675','2011','Etisalat_Egypt'),('6020309676','2011','Etisalat_Egypt'),('6020309677','2011','Etisalat_Egypt'),('6020309678','2011','Etisalat_Egypt'),('6020309679','2011','Etisalat_Egypt'),('602030968','2011','Etisalat_Egypt'),('602030969','2011','Etisalat_Egypt'),('60203097','2011','Etisalat_Egypt'),('60203098','2011','Etisalat_Egypt'),('60203099','2011','Etisalat_Egypt'),('602031','2011','Etisalat_Egypt'),('602032','2011','Etisalat_Egypt'),('602033','2011','Etisalat_Egypt'),('602034','2011','Etisalat_Egypt'),('602035','2011','Etisalat_Egypt'),('602036','2011','Etisalat_Egypt'),('602037','2011','Etisalat_Egypt'),('602038','2011','Etisalat_Egypt'),('602039','2011','Etisalat_Egypt'),('60301','21366','NULL'),('60400','2126639','Meditel_Morocco'),('60401','212661','Maroc_Itissalat'),('60402','212640','Wana_Morocco'),('6050100','2165','Orange_Tunisia'),('60501010','2165','Orange_Tunisia'),('60501011','2165','Orange_Tunisia'),('605010120','2165','Orange_Tunisia'),('6050101210','2165','Orange_Tunisia'),('6050101211','2165','Orange_Tunisia'),('6050101212','2165','Orange_Tunisia'),('6050101213','2165','Orange_Tunisia'),('6050101214','2165','Orange_Tunisia'),('605010121500','2165','Orange_Tunisia'),('605010121501','2165','Orange_Tunisia'),('605010121502','2165','Orange_Tunisia'),('605010121503','2165','Orange_Tunisia'),('605010121504','2165','Orange_Tunisia'),('605010121505','2165','Orange_Tunisia'),('605010121506','2165','Orange_Tunisia'),('6050101215070','2165','Orange_Tunisia'),('6050101215071','2165','Orange_Tunisia'),('6050101215072','2165','Orange_Tunisia'),('6050101215073','2165','Orange_Tunisia'),('6050101215074','2165','Orange_Tunisia'),('6050101215075','2165','Orange_Tunisia'),('6050101215076','2165','Orange_Tunisia'),('60501012150770','2165','Orange_Tunisia'),('60501012150771','2165','Orange_Tunisia'),('60501012150772','2165','Orange_Tunisia'),('60501012150773','2165','Orange_Tunisia'),('60501012150774','2165','Orange_Tunisia'),('60501012150775','2165','Orange_Tunisia'),('60501012150776','2165','Orange_Tunisia'),('60501012150777','2165','Orange_Tunisia'),('605010121507780','2165','Orange_Tunisia'),('605010121507781','2165','Orange_Tunisia'),('605010121507782','2165','Orange_Tunisia'),('605010121507783','2165','Orange_Tunisia'),('605010121507784','2165','Orange_Tunisia'),('605010121507785','2165','Orange_Tunisia'),('605010121507786','2165','Orange_Tunisia'),('605010121507787','2165','Orange_Tunisia'),('605010121507788','2165','Orange_Tunisia'),('605010121507789','2165','Orange_Tunisia'),('605010121507790','2165','Orange_Tunisia'),('605010121507791','2165','Orange_Tunisia'),('605010121507792','2165','Orange_Tunisia'),('605010121507793','2165','Orange_Tunisia'),('605010121507794','2165','Orange_Tunisia'),('605010121507795','2165','Orange_Tunisia'),('605010121507796','2165','Orange_Tunisia'),('605010121507797','2165','Orange_Tunisia'),('605010121507798','2165','Orange_Tunisia'),('605010121507799','2165','Orange_Tunisia'),('6050101215078','2165','Orange_Tunisia'),('6050101215079','2165','Orange_Tunisia'),('605010121508','2165','Orange_Tunisia'),('605010121509','2165','Orange_Tunisia'),('60501012151','2165','Orange_Tunisia'),('60501012152','2165','Orange_Tunisia'),('60501012153','2165','Orange_Tunisia'),('60501012154','2165','Orange_Tunisia'),('60501012155','2165','Orange_Tunisia'),('60501012156','2165','Orange_Tunisia'),('60501012157','2165','Orange_Tunisia'),('60501012158','2165','Orange_Tunisia'),('60501012159','2165','Orange_Tunisia'),('6050101216','2165','Orange_Tunisia'),('6050101217','2165','Orange_Tunisia'),('6050101218','2165','Orange_Tunisia'),('6050101219','2165','Orange_Tunisia'),('605010122','2165','Orange_Tunisia'),('605010123','2165','Orange_Tunisia'),('605010124','2165','Orange_Tunisia'),('605010125','2165','Orange_Tunisia'),('605010126','2165','Orange_Tunisia'),('605010127','2165','Orange_Tunisia'),('605010128','2165','Orange_Tunisia'),('605010129','2165','Orange_Tunisia'),('60501013','2165','Orange_Tunisia'),('60501014','2165','Orange_Tunisia'),('60501015','2165','Orange_Tunisia'),('60501016','2165','Orange_Tunisia'),('60501017','2165','Orange_Tunisia'),('60501018','2165','Orange_Tunisia'),('60501019','2165','Orange_Tunisia'),('6050102','2165','Orange_Tunisia'),('6050103','2165','Orange_Tunisia'),('6050104','2165','Orange_Tunisia'),('6050105','2165','Orange_Tunisia'),('6050106','2165','Orange_Tunisia'),('6050107','2165','Orange_Tunisia'),('6050108','2165','Orange_Tunisia'),('6050109','2165','Orange_Tunisia'),('605011','2165','Orange_Tunisia'),('605012','2165','Orange_Tunisia'),('605013','2165','Orange_Tunisia'),('605014','2165','Orange_Tunisia'),('605015','2165','Orange_Tunisia'),('605016','2165','Orange_Tunisia'),('605017','2165','Orange_Tunisia'),('605018','2165','Orange_Tunisia'),('605019','2165','Orange_Tunisia'),('60502','21698','Tunisie_Telecom'),('60503','21622','Ooredoo_Tunisia'),('60601','21891','ALMADAR_Libya'),('60702','22077','Africell_Gambia'),('60802','22176','SENTEL_Siniguel'),('609020204725748','22222','Chinguitel_Mauritania'),('609020204725749','22222','Chinguitel_Mauritania'),('609020204725750','22222','Chinguitel_Mauritania'),('609020204725751','22222','Chinguitel_Mauritania'),('609020204725752','22222','Chinguitel_Mauritania'),('609020204725753','22222','Chinguitel_Mauritania'),('609020204725754','22222','Chinguitel_Mauritania'),('609020204725755','22222','Chinguitel_Mauritania'),('609020204725756','22222','Chinguitel_Mauritania'),('609020204725757','22222','Chinguitel_Mauritania'),('610010100700675','223667','MALITEL_Mali'),('610010100700676','223667','MALITEL_Mali'),('610010100700677','223667','MALITEL_Mali'),('610010100700678','223667','MALITEL_Mali'),('610010100700679','223667','MALITEL_Mali'),('610010342281031','223667','Malitel_Mali'),('610010342281040','223667','Malitel_Mali'),('610010342281043','223667','Malitel_Mali'),('61002','223760','Orange_Mali'),('61101','22462','Orange_Guine'),('61203','22507','ORANGE_COTE_IVOIRE'),('613020113989621','22676','Airtel_Burkinafaso'),('613020113989622','22676','Airtel_Burkinafaso'),('613020113989635','22676','Airtel_Burkinafaso'),('613020113989640','22676','Airtel_Burkinafaso'),('613020200402043','22676','Airtel_Burkinafaso'),('613020200402044','22676','Airtel_Burkinafaso'),('613020200402045','22676','Airtel_Burkinafaso'),('613020200402046','22676','Airtel_Burkinafaso'),('613020200402047','22676','Airtel_Burkinafaso'),('613020200402048','22676','Airtel_Burkinafaso'),('614020200000868','22796','CELTEL_NIGER'),('614020200000872','22796','CELTEL_NIGER'),('61701','23025','Cellplus-Mauritius'),('61905','23277','AFRICELL_SIERA-LEONE'),('62001','23324','Scancom_Limited_Ghana'),('62002','23320','Vodafone_GHANA'),('62003','23327','Millicom_Ghana'),('62120','234802','Airtel_Nigeria'),('62130','234803','MTN_Nigeria'),('62160','234809','Etisalat_Nigeria'),('622030110995247','2359','MIC_TCHAD'),('622030110995249','2359','MIC_TCHAD'),('622030110995250','2359','MIC_TCHAD'),('623010171904629','96139','Atlantique_Telecom_Centrafrique'),('623010171904630','96139','Atlantique_Telecom_Centrafrique'),('623010171904631','96139','Atlantique_Telecom_Centrafrique'),('623010171904632','96139','Atlantique_Telecom_Centrafrique'),('623010171904633','96139','Atlantique_Telecom_Centrafrique'),('623010171904634','96139','Atlantique_Telecom_Centrafrique'),('623010171904635','96139','Atlantique_Telecom_Centrafrique'),('623010171904636','96139','Atlantique_Telecom_Centrafrique'),('62401','23767','MTN_Cameroon'),('62502','23891','UNITEL_CAP_VER'),('627010100795785','2402','Guinea_Equatorial'),('627010100795787','2402','Guinea_Equatorial'),('62703','24055','Green_Com_S_A_Equatorial_Guinea'),('62901','24205','Airtel_Congo'),('62907','24204','Airtel_Congo'),('63001','24381','Vodacom_Congo'),('63086','24384','Orange_DRCongo'),('63102','24492','Unitel_Angola'),('631040002483368','24491','Angola_Movicel'),('631040002483369','24491','Angola_Movicel'),('631040002483370','24491','Angola_Movicel'),('631040002483371','24491','Angola_Movicel'),('631040002483372','24491','Angola_Movicel'),('631040002483373','24491','Angola_Movicel'),('631040002483374','24491','Angola_Movicel'),('631040002483375','24491','Angola_Movicel'),('631040002483376','24491','Angola_Movicel'),('631040002483377','24491','Angola_Movicel'),('63310','24827','Airtel_Seychelles'),('63601','25191','Ethio_Telecom'),('63801','25377','GDjibouti_Telecom_SA'),('639027300000257','254722','SAFARICOM_KENYA'),('639027300000258','254722','SAFARICOM_KENYA'),('639027300000259','254722','SAFARICOM_KENYA'),('639070012609915','254770','Telecom_Kenya'),('639070012609916','254770','Telecom_Kenya'),('639070012609917','254770','Telecom_Kenya'),('639070012609918','254770','Telecom_Kenya'),('639070012609919','254770','Telecom_Kenya'),('639070012609920','254770','Telecom_Kenya'),('639070012609921','254770','Telecom_Kenya'),('639070012609922','254770','Telecom_Kenya'),('639070012609923','254770','Telecom_Kenya'),('639070012609924','254770','Telecom_Kenya'),('640040','25575','Vodacom_Tanzania'),('640041','25575','Vodacom_Tanzania'),('640042','25575','Vodacom_Tanzania'),('640043','25575','Vodacom_Tanzania'),('6400440','25575','Vodacom_Tanzania'),('64004410','25575','Vodacom_Tanzania'),('64004411','25575','Vodacom_Tanzania'),('64004412','25575','Vodacom_Tanzania'),('64004413','25575','Vodacom_Tanzania'),('64004414','25575','Vodacom_Tanzania'),('64004415','25575','Vodacom_Tanzania'),('640044160','25575','Vodacom_Tanzania'),('640044161','25575','Vodacom_Tanzania'),('640044162','25575','Vodacom_Tanzania'),('640044163','25575','Vodacom_Tanzania'),('640044164','25575','Vodacom_Tanzania'),('640044165','25575','Vodacom_Tanzania'),('640044166','25575','Vodacom_Tanzania'),('640044167','25575','Vodacom_Tanzania'),('6400441680','25575','Vodacom_Tanzania'),('6400441681','25575','Vodacom_Tanzania'),('6400441682','25575','Vodacom_Tanzania'),('6400441683','25575','Vodacom_Tanzania'),('6400441684','25575','Vodacom_Tanzania'),('6400441685','25575','Vodacom_Tanzania'),('6400441686','25575','Vodacom_Tanzania'),('6400441687','25575','Vodacom_Tanzania'),('6400441688','25575','Vodacom_Tanzania'),('64004416890','25575','Vodacom_Tanzania'),('64004416891','25575','Vodacom_Tanzania'),('64004416892','25575','Vodacom_Tanzania'),('64004416893','25575','Vodacom_Tanzania'),('64004416894','25575','Vodacom_Tanzania'),('64004416895','25575','Vodacom_Tanzania'),('64004416896','25575','Vodacom_Tanzania'),('64004416897','25575','Vodacom_Tanzania'),('64004416898','25575','Vodacom_Tanzania'),('6400441689900','25575','Vodacom_Tanzania'),('6400441689901','25575','Vodacom_Tanzania'),('6400441689902','25575','Vodacom_Tanzania'),('6400441689903','25575','Vodacom_Tanzania'),('6400441689904','25575','Vodacom_Tanzania'),('6400441689905','25575','Vodacom_Tanzania'),('6400441689906','25575','Vodacom_Tanzania'),('6400441689907','25575','Vodacom_Tanzania'),('6400441689908','25575','Vodacom_Tanzania'),('64004416899090','25575','Vodacom_Tanzania'),('64004416899091','25575','Vodacom_Tanzania'),('64004416899092','25575','Vodacom_Tanzania'),('640044168990930','25575','Vodacom_Tanzania'),('640044168990931','25575','Vodacom_Tanzania'),('640044168990932','25575','Vodacom_Tanzania'),('640044168990933','25575','Vodacom_Tanzania'),('640044168990934','25575','Vodacom_Tanzania'),('640044168990935','25575','Vodacom_Tanzania'),('640044168990936','25575','Vodacom_Tanzania'),('640044168990937','25575','Vodacom_Tanzania'),('640044168990938','25575','Vodacom_Tanzania'),('640044168990939','25575','Vodacom_Tanzania'),('64004416899094','25575','Vodacom_Tanzania'),('64004416899095','25575','Vodacom_Tanzania'),('64004416899096','25575','Vodacom_Tanzania'),('64004416899097','25575','Vodacom_Tanzania'),('64004416899098','25575','Vodacom_Tanzania'),('64004416899099','25575','Vodacom_Tanzania'),('640044168991','25575','Vodacom_Tanzania'),('640044168992','25575','Vodacom_Tanzania'),('640044168993','25575','Vodacom_Tanzania'),('640044168994','25575','Vodacom_Tanzania'),('640044168995','25575','Vodacom_Tanzania'),('640044168996','25575','Vodacom_Tanzania'),('640044168997','25575','Vodacom_Tanzania'),('640044168998','25575','Vodacom_Tanzania'),('640044168999','25575','Vodacom_Tanzania'),('640044169','25575','Vodacom_Tanzania'),('64004417','25575','Vodacom_Tanzania'),('64004418','25575','Vodacom_Tanzania'),('64004419','25575','Vodacom_Tanzania'),('6400442','25575','Vodacom_Tanzania'),('6400443','25575','Vodacom_Tanzania'),('6400444','25575','Vodacom_Tanzania'),('6400445','25575','Vodacom_Tanzania'),('6400446','25575','Vodacom_Tanzania'),('6400447','25575','Vodacom_Tanzania'),('6400448','25575','Vodacom_Tanzania'),('6400449','25575','Vodacom_Tanzania'),('640045','25575','Vodacom_Tanzania'),('640046','25575','Vodacom_Tanzania'),('640047','25575','Vodacom_Tanzania'),('640048','25575','Vodacom_Tanzania'),('640049','25575','Vodacom_Tanzania'),('64005','25578','CELTEL_Tanzania'),('64008','25579','SMART_Tanzania'),('641010280001898','25675','Airtel_Uganda'),('641010280001899','25675','Airtel_Uganda'),('64118','25674','smart_Uganda'),('641220010330081','25670','Warid_Uganda'),('641220010330082','25670','Warid_Uganda'),('64207','25775','Lacell-SU_Burundi'),('64304','25884','Vodacom_Mozambique'),('64601','26133','Airtel_Madagascar'),('646020100058786','26132','Orange_Madagascar'),('646020100058789','26132','Orange_Madagascar'),('646020100058794','26132','Orange_Madagascar'),('65001','26588','TNM_Malawi'),('65101','2665','Vodacom_Lesotho'),('65201','26771','Mascom_Bostwana'),('655010','2782','Vodacome_SouthAfrica'),('655011','2782','Vodacome_SouthAfrica'),('655012','2782','Vodacome_SouthAfrica'),('655013','2782','Vodacome_SouthAfrica'),('6550140','2782','Vodacome_SouthAfrica'),('655014100','2782','Vodacome_SouthAfrica'),('6550141010','2782','Vodacome_SouthAfrica'),('6550141011','2782','Vodacome_SouthAfrica'),('65501410120','2782','Vodacome_SouthAfrica'),('65501410121','2782','Vodacome_SouthAfrica'),('6550141012200','2782','Vodacome_SouthAfrica'),('6550141012201','2782','Vodacome_SouthAfrica'),('6550141012202','2782','Vodacome_SouthAfrica'),('6550141012203','2782','Vodacome_SouthAfrica'),('6550141012204','2782','Vodacome_SouthAfrica'),('65501410122050','2782','Vodacome_SouthAfrica'),('65501410122051','2782','Vodacome_SouthAfrica'),('65501410122052','2782','Vodacome_SouthAfrica'),('65501410122053','2782','Vodacome_SouthAfrica'),('65501410122054','2782','Vodacome_SouthAfrica'),('65501410122055','2782','Vodacome_SouthAfrica'),('65501410122056','2782','Vodacome_SouthAfrica'),('65501410122057','2782','Vodacome_SouthAfrica'),('655014101220580','2782','Vodacome_SouthAfrica'),('655014101220581','2782','Vodacome_SouthAfrica'),('655014101220582','2782','Vodacome_SouthAfrica'),('655014101220583','2782','Vodacome_SouthAfrica'),('655014101220584','2782','Vodacome_SouthAfrica'),('655014101220585','2782','Vodacome_SouthAfrica'),('655014101220586','2782','Vodacome_SouthAfrica'),('655014101220587','2782','Vodacome_SouthAfrica'),('655014101220588','2782','Vodacome_SouthAfrica'),('655014101220589','2782','Vodacome_SouthAfrica'),('65501410122059','2782','Vodacome_SouthAfrica'),('6550141012206','2782','Vodacome_SouthAfrica'),('65501410122070','2782','Vodacome_SouthAfrica'),('65501410122071','2782','Vodacome_SouthAfrica'),('65501410122072','2782','Vodacome_SouthAfrica'),('65501410122073','2782','Vodacome_SouthAfrica'),('65501410122074','2782','Vodacome_SouthAfrica'),('65501410122075','2782','Vodacome_SouthAfrica'),('655014101220760','2782','Vodacome_SouthAfrica'),('655014101220762','2782','Vodacome_SouthAfrica'),('655014101220764','2782','Vodacome_SouthAfrica'),('655014101220765','2782','Vodacome_SouthAfrica'),('655014101220766','2782','Vodacome_SouthAfrica'),('655014101220767','2782','Vodacome_SouthAfrica'),('655014101220768','2782','Vodacome_SouthAfrica'),('655014101220769','2782','Vodacome_SouthAfrica'),('65501410122077','2782','Vodacome_SouthAfrica'),('65501410122078','2782','Vodacome_SouthAfrica'),('65501410122079','2782','Vodacome_SouthAfrica'),('6550141012208','2782','Vodacome_SouthAfrica'),('6550141012209','2782','Vodacome_SouthAfrica'),('655014101221','2782','Vodacome_SouthAfrica'),('655014101222','2782','Vodacome_SouthAfrica'),('655014101223','2782','Vodacome_SouthAfrica'),('655014101224','2782','Vodacome_SouthAfrica'),('655014101225','2782','Vodacome_SouthAfrica'),('655014101226','2782','Vodacome_SouthAfrica'),('655014101227','2782','Vodacome_SouthAfrica'),('655014101228','2782','Vodacome_SouthAfrica'),('655014101229','2782','Vodacome_SouthAfrica'),('65501410123','2782','Vodacome_SouthAfrica'),('65501410124','2782','Vodacome_SouthAfrica'),('65501410125','2782','Vodacome_SouthAfrica'),('65501410126','2782','Vodacome_SouthAfrica'),('65501410127','2782','Vodacome_SouthAfrica'),('65501410128','2782','Vodacome_SouthAfrica'),('65501410129','2782','Vodacome_SouthAfrica'),('6550141013','2782','Vodacome_SouthAfrica'),('6550141014','2782','Vodacome_SouthAfrica'),('6550141015','2782','Vodacome_SouthAfrica'),('6550141016','2782','Vodacome_SouthAfrica'),('6550141017','2782','Vodacome_SouthAfrica'),('6550141018','2782','Vodacome_SouthAfrica'),('6550141019','2782','Vodacome_SouthAfrica'),('655014102','2782','Vodacome_SouthAfrica'),('655014103','2782','Vodacome_SouthAfrica'),('655014104','2782','Vodacome_SouthAfrica'),('655014105','2782','Vodacome_SouthAfrica'),('655014106','2782','Vodacome_SouthAfrica'),('655014107','2782','Vodacome_SouthAfrica'),('655014108','2782','Vodacome_SouthAfrica'),('655014109','2782','Vodacome_SouthAfrica'),('65501411','2782','Vodacome_SouthAfrica'),('65501412','2782','Vodacome_SouthAfrica'),('65501413','2782','Vodacome_SouthAfrica'),('65501414','2782','Vodacome_SouthAfrica'),('65501415','2782','Vodacome_SouthAfrica'),('65501416','2782','Vodacome_SouthAfrica'),('65501417','2782','Vodacome_SouthAfrica'),('65501418','2782','Vodacome_SouthAfrica'),('65501419','2782','Vodacome_SouthAfrica'),('6550142','2782','Vodacome_SouthAfrica'),('6550143','2782','Vodacome_SouthAfrica'),('6550144','2782','Vodacome_SouthAfrica'),('6550145','2782','Vodacome_SouthAfrica'),('6550146','2782','Vodacome_SouthAfrica'),('6550147','2782','Vodacome_SouthAfrica'),('6550148','2782','Vodacome_SouthAfrica'),('6550149','2782','Vodacome_SouthAfrica'),('655015','2782','Vodacome_SouthAfrica'),('655016','2782','Vodacome_SouthAfrica'),('655017','2782','Vodacome_SouthAfrica'),('655018','2782','Vodacome_SouthAfrica'),('655019','2782','Vodacome_SouthAfrica'),('65507','2784','Cellc_South_Africa'),('65510112172313','2783','NULL'),('65510112172314','2783','NULL'),('659020000936233','21192','MTN_South_Sudan'),('659020000936234','21192','MTN_South_Sudan'),('659020000936235','21192','MTN_South_Sudan'),('659020000936236','21192','MTN_South_Sudan'),('659020000936237','21192','MTN_South_Sudan'),('659020000936238','21192','MTN_South_Sudan'),('659020000937169','21192','MTN_South_Sudan'),('659020000937170','21192','MTN_South_Sudan'),('659020000937171','21192','MTN_South_Sudan'),('659020000937172','21192','MTN_South_Sudan'),('70401','502530','Claro_Guatemala'),('70601','503786','Claro_Salvador'),('712011003446301','506300','ICE_Costa-Rica'),('712011003446302','506300','ICE_Costa-Rica'),('712011003446303','506300','ICE_Costa-Rica'),('712011003446304','506300','ICE_Costa-Rica'),('712030102558449','5067000','Claro_CostaRica'),('712030102558452','5067000','Claro_CostaRica'),('71610','51997','claro_peru'),('71615','51930','BITEL_Peru'),('722310','54320','Claro_Argentina'),('72405','55005','ClaroBrazil'),('73003','56920','Claro_Chile'),('732123','57316','Telecomunicaciones_Colombia'),('734021001546026','58412','Venezuela_Digital'),('734021001546027','58412','Venezuela_Digital'),('734021001546028','58412','Venezuela_Digital'),('734021001546029','58412','Venezuela_Digital'),('734021001546030','58412','Venezuela_Digital'),('734021001546031','58412','Venezuela_Digital'),('734021001546032','58412','Venezuela_Digital'),('734021001546033','58412','Venezuela_Digital'),('734021001546034','58412','Venezuela_Digital'),('734021001546035','58412','Venezuela_Digital'),('74001','59394','Conecel_Ecuador'),('74402','595991','Claro_Paraguay'),('746030111269880','59781','Digicel_Group'),('746030111269896','59781','Digicel_Group'),('746030111450255','59781','Digicel_Group'),('746030111450265','59781','Digicel_Group'),('74801','59899','Ancel_Uruguay'),('74807','59894','Telefonica_Uruguay'),('74810','59896','Claro_Uruguay'),('90105','88216','Thuraya_UAE'),('901280','88239','Vodaphone_Malta'),('901281','88239','Vodaphone_Malta'),('901282','88239','Vodaphone_Malta'),('901283','88239','Vodaphone_Malta'),('901284','88239','Vodaphone_Malta'),('901285','88239','Vodaphone_Malta'),('901286','88239','Vodaphone_Malta'),('901287','88239','Vodaphone_Malta'),('901288','88239','Vodaphone_Malta'),('9012890','88239','Vodaphone_Malta'),('9012891','88239','Vodaphone_Malta'),('9012892','88239','Vodaphone_Malta'),('9012893','88239','Vodaphone_Malta'),('9012894','88239','Vodaphone_Malta'),('9012895','88239','Vodaphone_Malta'),('9012896','88239','Vodaphone_Malta'),('9012897','88239','Vodaphone_Malta'),('9012898','88239','Vodaphone_Malta'),('90128991','88239','Vodaphone_Malta'),('90128992','88239','Vodaphone_Malta'),('90128993','88239','Vodaphone_Malta'),('90128994','88239','Vodaphone_Malta'),('90128995','88239','Vodaphone_Malta'),('90128996','88239','Vodaphone_Malta'),('90128997','88239','Vodaphone_Malta'),('90128998','88239','Vodaphone_Malta'),('901289990','88239','Vodaphone_Malta'),('901289991','88239','Vodaphone_Malta'),('901289992','88239','Vodaphone_Malta'),('901289993','88239','Vodaphone_Malta'),('901289994','88239','Vodaphone_Malta'),('901289995','88239','Vodaphone_Malta'),('901289996','88239','Vodaphone_Malta'),('901289997','88239','Vodaphone_Malta'),('901289998','88239','Vodaphone_Malta'),('9012899990','88239','Vodaphone_Malta'),('9012899991','88239','Vodaphone_Malta'),('9012899992','88239','Vodaphone_Malta'),('9012899993','88239','Vodaphone_Malta'),('9012899994','88239','Vodaphone_Malta'),('9012899995','88239','Vodaphone_Malta'),('9012899996','88239','Vodaphone_Malta'),('9012899997','88239','Vodaphone_Malta'),('90128999980','88239','Vodaphone_Malta'),('90128999981','88239','Vodaphone_Malta'),('90128999982','88239','Vodaphone_Malta'),('90128999983','88239','Vodaphone_Malta'),('90128999984','88239','Vodaphone_Malta'),('90128999985','88239','Vodaphone_Malta'),('90128999986','88239','Vodaphone_Malta'),('90128999987','88239','Vodaphone_Malta'),('90128999988','88239','Vodaphone_Malta'),('901289999890','88239','Vodaphone_Malta'),('901289999891','88239','Vodaphone_Malta'),('901289999892','88239','Vodaphone_Malta'),('901289999893','88239','Vodaphone_Malta'),('901289999894','88239','Vodaphone_Malta'),('901289999895','88239','Vodaphone_Malta'),('901289999896','88239','Vodaphone_Malta'),('901289999897','88239','Vodaphone_Malta'),('901289999898','88239','Vodaphone_Malta'),('9012899998990','88239','Vodaphone_Malta'),('9012899998991','88239','Vodaphone_Malta'),('9012899998992','88239','Vodaphone_Malta'),('9012899998993','88239','Vodaphone_Malta'),('9012899998994','88239','Vodaphone_Malta'),('9012899998995','88239','Vodaphone_Malta'),('9012899998996','88239','Vodaphone_Malta'),('9012899998997','88239','Vodaphone_Malta'),('90128999989980','88239','Vodaphone_Malta'),('901289999899810','88239','Vodaphone_Malta'),('901289999899811','88239','Vodaphone_Malta'),('901289999899812','88239','Vodaphone_Malta'),('901289999899813','88239','Vodaphone_Malta'),('901289999899814','88239','Vodaphone_Malta'),('901289999899815','88239','Vodaphone_Malta'),('901289999899816','88239','Vodaphone_Malta'),('901289999899817','88239','Vodaphone_Malta'),('901289999899818','88239','Vodaphone_Malta'),('901289999899819','88239','Vodaphone_Malta'),('90128999989982','88239','Vodaphone_Malta'),('90128999989983','88239','Vodaphone_Malta'),('90128999989984','88239','Vodaphone_Malta'),('90128999989985','88239','Vodaphone_Malta'),('90128999989986','88239','Vodaphone_Malta'),('90128999989987','88239','Vodaphone_Malta'),('90128999989988','88239','Vodaphone_Malta'),('90128999989989','88239','Vodaphone_Malta'),('9012899998999','88239','Vodaphone_Malta'),('9012899999','88239','Vodaphone_Malta'),('90131','883130','Orange-M2M-AAZOR_France');
/*!40000 ALTER TABLE `roaming_partners_temp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Routage`
--

DROP TABLE IF EXISTS `Routage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Routage` (
  `id` int NOT NULL AUTO_INCREMENT,
  `configuration_ir21_id` int DEFAULT NULL,
  `type_routage` enum('E.164','E.212','E.214') NOT NULL,
  `valeur` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `configuration_ir21_id` (`configuration_ir21_id`),
  CONSTRAINT `routage_ibfk_1` FOREIGN KEY (`configuration_ir21_id`) REFERENCES `Configuration_IR21` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Routage`
--

LOCK TABLES `Routage` WRITE;
/*!40000 ALTER TABLE `Routage` DISABLE KEYS */;
INSERT INTO `Routage` VALUES (1,1,'E.214','6030100000'),(2,2,'E.164','+33689123456');
/*!40000 ALTER TABLE `Routage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Serveur_DNS`
--

DROP TABLE IF EXISTS `Serveur_DNS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Serveur_DNS` (
  `id` int NOT NULL AUTO_INCREMENT,
  `configuration_ir21_id` int DEFAULT NULL,
  `dns_name` varchar(100) DEFAULT NULL,
  `dns_ip` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `configuration_ir21_id` (`configuration_ir21_id`),
  CONSTRAINT `serveur_dns_ibfk_1` FOREIGN KEY (`configuration_ir21_id`) REFERENCES `Configuration_IR21` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Serveur_DNS`
--

LOCK TABLES `Serveur_DNS` WRITE;
/*!40000 ALTER TABLE `Serveur_DNS` DISABLE KEYS */;
INSERT INTO `Serveur_DNS` VALUES (1,1,'dns1.mobilis.dz','192.168.1.1'),(2,2,'dns1.orange.fr','2001:db8::2');
/*!40000 ALTER TABLE `Serveur_DNS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Service_Supporte`
--

DROP TABLE IF EXISTS `Service_Supporte`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Service_Supporte` (
  `id` int NOT NULL AUTO_INCREMENT,
  `configuration_ir21_id` int DEFAULT NULL,
  `service` enum('Voix','SMS','Data','CAMEL') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `configuration_ir21_id` (`configuration_ir21_id`),
  CONSTRAINT `service_supporte_ibfk_1` FOREIGN KEY (`configuration_ir21_id`) REFERENCES `Configuration_IR21` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Service_Supporte`
--

LOCK TABLES `Service_Supporte` WRITE;
/*!40000 ALTER TABLE `Service_Supporte` DISABLE KEYS */;
INSERT INTO `Service_Supporte` VALUES (1,1,'Voix'),(2,1,'SMS'),(3,2,'Data'),(4,2,'CAMEL');
/*!40000 ALTER TABLE `Service_Supporte` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `situation_globales`
--

DROP TABLE IF EXISTS `situation_globales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `situation_globales` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pays` varchar(255) DEFAULT NULL,
  `operateur` varchar(255) DEFAULT NULL,
  `plmn` varchar(50) DEFAULT NULL,
  `gsm` varchar(50) DEFAULT NULL,
  `camel` varchar(50) DEFAULT NULL,
  `gprs` varchar(50) DEFAULT NULL,
  `troisg` varchar(50) DEFAULT NULL,
  `lte` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `imsi` varchar(255) DEFAULT NULL,
  `mcc` varchar(255) DEFAULT NULL,
  `mnc` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=484 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `situation_globales`
--

LOCK TABLES `situation_globales` WRITE;
/*!40000 ALTER TABLE `situation_globales` DISABLE KEYS */;
INSERT INTO `situation_globales` VALUES (1,'Afghanistan','Telecom Development Company Afghanistan Ltd.','AFGTD','Bilateral','',NULL,NULL,NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(2,'Afghanistan','Etisalat Afghanistan','AFGEA','Bilateral','Unilateral IN','Bilateral','Unilateral OUT',NULL,'2025-04-08 06:29:54','412500219534483',NULL,NULL),(3,'Afghanistan','MTN','AFGAR','Bilateral','Bilateral','Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(4,'Afghanistan','Afghan Wireless Communication Company','AFGAW','Bilateral','Bilateral','Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(5,'Albania','Albanian Mobile Communications','ALBAM','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(6,'Albania','Vodafone','ALBVF','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(7,'Angola','Unitel S,A','AGOUT','Bilateral','Bilateral','Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(8,'Angola','Movicel Angola','AGOMV','Unilateral OUT',NULL,'Uni OUT','UNI OUT',NULL,'2025-04-08 06:29:54','631040002483368',NULL,NULL),(9,'Argentina','Telefonica','ARGTM','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(10,'Argentina','Claro','ARGCM','Bilateral','Bilateral','bilateral','bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(11,'Armenia','K Telecom CJSC','ARM05','Bilateral',NULL,'Uni IN','Uni IN',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(12,'Armenia','Armentel','ARM01','Bilateral','Bilateral','bilateral','bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(13,'Aruba','Digicel','ABWDC','Bilateral',NULL,'Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(14,'Australia','Telstra','AUSTA','Bilateral',NULL,'Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(15,'Australia','Vodafone Hutchison','AUSVF','Bilateral','Bilateral','bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(16,'Austria','T-Mobile','AUTMM','Bilateral','Bilateral','bilateral','bilateral','Bilateral','2025-04-08 06:29:54','310800',NULL,NULL),(17,'Austria','T-Mobile','AUTTR','Unilateral IN','Unilateral IN','Uni IN','Uni IN','Uni IN','2025-04-08 06:29:54','310800',NULL,NULL),(18,'Austria','T-Mobile','AUTAT','Unilateral IN','Unilateral IN','Uni IN','Uni IN',NULL,'2025-04-08 06:29:54','310800',NULL,NULL),(19,'Azerbaijan','Azercell Telecom BM','AZEAC','Bilateral','Bilateral','bilateral','bilateral','Uni OUT/ IN','2025-04-08 06:29:54',NULL,NULL,NULL),(20,'Azerbaijan','Backcell','AZEBC','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(21,'Azerbaijan','K Telecom CJSC  / Azerfon LLC','AZEAF','Bilateral','Unilateral IN','bilateral','bilateral','Uni IN','2025-04-08 06:29:54',NULL,NULL,NULL),(22,'Bahamas','Be Aliv','BHSNC','Bilateral','Bilateral','bilateral','bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(23,'Bahrain','Bahrain Telecommunications Company','BHRBT','Bilateral',NULL,'bilateral','bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(24,'Bahrain','ZAIN BAHRAIN','BHRMV','Bilateral','Bilateral','bilateral','bilateral','bilateral','2025-04-08 06:29:54','42602',NULL,NULL),(25,'Bahrain','VIVA BAHRAIN','BHRST','Bilateral','Bilateral','bilateral',NULL,'Bilateral','2025-04-08 06:29:54','42604',NULL,NULL),(26,'Bangladesh','Robi Axiata','BGDAK','Bilateral',NULL,'bilateral','bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(27,'Bangladesh','Airtel Bangladesh Ltd','BGDWT','Bilateral',NULL,NULL,NULL,NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(28,'Belarus','JLLC Mobile TeleSystems','BLR02','Bilateral','Bilateral','bilateral','bilateral','billateral','2025-04-08 06:29:54',NULL,NULL,NULL),(29,'Belarus','Velcom','BLRMD','Bilateral','Bilateral','Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(30,'Belgium','Belgacom Mobile/Proximus','BELTB','Bilateral','Bilateral','bilateral','bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(31,'Belgium','BASE NV/SA','BELKO','Bilateral','Bilateral','bilateral','bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(32,'Belgium','Mobistar S.A. / Orange','BELMO','Bilateral','Bilateral','bilateral','bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(33,'Belgium','Bics','BELBX','Unilateral IN',NULL,'Unilateral IN',NULL,'Uni IN','2025-04-08 06:29:54',NULL,NULL,NULL),(34,'Belgium','Telenet BVBA, Belgium','BELTN','Unilateral IN','Unilateral IN','Uni IN','Uni IN','Uni IN','2025-04-08 06:29:54',NULL,NULL,NULL),(35,'Benin','SPACETEL','BENSP','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(36,'Birmanie','OOredOO Birmanie','MMROM','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(37,'Bosnia and Herzegovina','HT-ERONET','BIHER','Bilateral','Bilateral','bilateral','bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(38,'Bosnia and Herzegovina','RS Telecommunications JSC Banja Luka m:tel','BIHMS','Bilateral',NULL,'Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(39,'Bostwana','Mascom Bostwana','BWAGA','Bilateral','Bilateral','bilateral','bilateral',NULL,'2025-04-08 06:29:54','65201',NULL,NULL),(40,'Bostwana','Orange Bostwana','BWAVC','Bilateral','Bilateral','Bilateral','Bilateral','Unilateral OUT','2025-04-08 06:29:54',NULL,NULL,NULL),(41,'Burkina Faso','telecell','BFATL','Bilateral',NULL,NULL,NULL,NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(42,'Burkina Faso','Orange','BFACT','Bilateral','Unilateral OUT','Unilateral OUT','Unilateral OUT','Unilateral OUT','2025-04-08 06:29:54',NULL,NULL,NULL),(43,'Brazil','Vivo','BRAV1','Bilateral','Unilateral IN','Bilateral','Bilateral','Unilateral IN','2025-04-08 06:29:54',NULL,NULL,NULL),(44,'Brazil','Vivo','BRAV2','Bilateral','Unilateral IN','Bilateral','Bilateral','Unilateral IN','2025-04-08 06:29:54',NULL,NULL,NULL),(45,'Brazil','Vivo','BRAV3','Bilateral','Unilateral IN','Bilateral','Bilateral','Unilateral IN','2025-04-08 06:29:54',NULL,NULL,NULL),(46,'Brazil','Vivo','BRATC','Bilateral','Unilateral IN','Bilateral','Bilateral','Unilateral IN','2025-04-08 06:29:54',NULL,NULL,NULL),(47,'Brazil','TIM Cellular','BRACS','Bilateral','Unilateral  OUT','UNI OUT','UNI OUT',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(48,'Brazil','TIM Cellular','BRASP','Bilateral','Unilateral  OUT','UNI OUT','UNI OUT',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(49,'Brazil','TIM Cellular','BRARN','Bilateral','Unilateral  OUT','UNI OUT','UNI OUT',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(50,'Brazil','CLARO','BRACL','Bilateral','Bilateral','Bilateral','Bilateral','Uni IN','2025-04-08 06:29:54',NULL,NULL,NULL),(51,'British Virgin Island','Digicel','VGBDC','Unilateral OUT',NULL,'Unilateral OUT','Unilateral OUT','Unilateral OUT','2025-04-08 06:29:54',NULL,NULL,NULL),(52,'Brunei Darussalam','Datastream Technology Sdn Bhd','BRNDS','Bilateral','Bilateral','bilateral','bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(53,'Brunei Darussalam','Progressif Cellular Sdn Bhd','BRNBR','Bilateral','Unilateral IN','Bilateral','Bilateral','Unilateral IN','2025-04-08 06:29:54',NULL,NULL,NULL),(54,'Brunei Darussalam','Unified National Networks','BRNTB','Unilateral IN','Unilateral IN','Unilateral IN','Unilateral IN','Unilateral IN','2025-04-08 06:29:54',NULL,NULL,NULL),(55,'Brunei Darussalam','Unified National Networks','BRNUN','Unilateral IN',NULL,'Unilateral IN','Unilateral IN','Unilateral IN','2025-04-08 06:29:54',NULL,NULL,NULL),(56,'Bulgaria','Bulgarian Telecommunications Com VIVAcom','BGRVA','Bilateral','Unilateral IN','bilateral','bilateral','Unilateral OUT','2025-04-08 06:29:54',NULL,NULL,NULL),(57,'Bulgaria','Telenor Bulgaria Mobile EAD /telefonica','BGRCM','Bilateral','Unilateral OUT','Uni OUT','UNI OUT',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(58,'Bulgaria','Mobitel BULGARIA','BGR01','Bilateral','Bilateral','bilateral','Uni IN',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(59,'Burundi','Smart Burundi','BDIL1','Bilateral','Bilateral','Uni IN','Uni IN',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(60,'Burundi','Lumitel Burundi','BDIVG','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(61,'Cambodia','Metfone','KHMVT','Unilateral OUT',NULL,'Unilateral IN','Unilateral In',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(62,'Cambodia','Metfone','KHMVC','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(63,'Cambodia','Cambodia Shinawatra Co. Ltd','KHMSH','CLOSED','CLOSED','CLOSED','CLOSED',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(64,'Cameroon','MTN','CMRMT','Bilateral','Bilateral','Bilateral',NULL,'Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(65,'Cameroon','Orange','CMR02','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(66,'Canada','Microcell Telecommunications Inc (Fido)','CANMC','Bilateral','Unilateral IN','bilateral','bilateral','Uni IN','2025-04-08 06:29:54',NULL,NULL,NULL),(67,'Canada','Rogers Wireless Inc','CANRW','Bilateral','Bilateral','bilateral','bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(68,'Canada','Bell Mobility INC','CANBM','Bilateral','Bilateral','bilateral','bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(69,'Canada','Bell Mobility INC','CANMM','Unilateral IN',NULL,'Uni IN','Uni IN','Uni IN','2025-04-08 06:29:54',NULL,NULL,NULL),(70,'Canada','Sasktel','CANST','Bilateral',NULL,'bilateral','bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(71,'Canada','videotron','CANVT','Bilateral','Unilateral  OUT','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(72,'Canada','Telus Canada','CANTS','Bilateral','Bilateral','bilateral','Bilateral','Bilateral','2025-04-08 06:29:54','302220',NULL,NULL),(73,'Canada','Telus Canada','CANTE','Unilateral IN',NULL,'Uni IN','Uni IN','Uni IN','2025-04-08 06:29:54','302220',NULL,NULL),(74,'Cap Verde','Unitel+','CPVTM','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(75,'Center Africa','moov','CAFAT','Bilateral',NULL,NULL,NULL,NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(76,'Center Africa','ORANGE','CAF03','Bilateral','Bilateral','Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(77,'China','China Telecommunications','CHNDX','Unilateral IN',NULL,'Unilateral IN','Unilateral IN',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(78,'China','China Unicom','CHNCU','Bilateral','Unilateral  OUT','bilateral','bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(79,'China','China Unicom','CHNCN','Unilateral IN',NULL,'Uni IN','Uni IN','Uni IN','2025-04-08 06:29:54',NULL,NULL,NULL),(80,'China','Mobile','CHNCT','Bilateral',NULL,'Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(81,'China','Mobile','CHNCM','Unilateral IN',NULL,'Uni IN','Uni IN',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(82,'China','Mobile','CHNMM','Unilateral IN',NULL,'Unilateral IN','Unilateral IN',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(83,'China','Mobile','CHNTD','Unilateral IN',NULL,'Uni IN','Uni IN',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(84,'Chile','Claro','CHLSM','Bilateral',NULL,'bilateral','bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(85,'Chile','Telefonica','CHLB2','Unilateral IN',NULL,'Uni IN','Uni IN',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(86,'Chile','Telefonica','CHLTM','Bilateral',NULL,'Bilateral','Bilateral','Unilateral/ in','2025-04-08 06:29:54',NULL,NULL,NULL),(87,'Colombia','Telefonika Colombia','COLTM','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(88,'Congo','Africell','CODAC','Bilateral','Bilateral','Bilateral',NULL,NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(89,'Congo','Vodacom','CODVC','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(90,'Congo','Orange','CODOR','Bilateral','Bilateral','Bilateral','bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(91,'Congo','Orange','CODSA','Unilateral IN','Unilateral IN','Uni IN',NULL,NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(92,'Congo Brazaville','Airtel /Warid','COGCT','Bilateral',NULL,'Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(93,'Congo Brazaville','Airtel /Warid','COGWC','Bilateral',NULL,'Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(94,'Comores','Telecom Comores','COMHR','Uni IN','Bilateral','Uni IN','Uni IN',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(95,'Costa Rica','Ice','CRICR','Bilateral',NULL,'Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(96,'Costa Rica','Claro','CRICL','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(97,'Coast Ivory','MTN','CIVTL','Unilateral',NULL,'Unilateral IN','Unilateral IN','Unilateral IN','2025-04-08 06:29:54',NULL,NULL,NULL),(98,'Coast Ivory','Orange','CIV03','Bilateral','Bilateral','bilateral','bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(99,'Croatia','Tele 2 d.o.o','HRVT2','Bilateral','Bilateral','bilateral','bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(100,'Croatia','T-Mobile','HRVCN','Bilateral','Unilateral IN','bilateral','bilateral','Bilateral','2025-04-08 06:29:54','310800',NULL,NULL),(101,'Cuba','Cubacel','CUB01','Bilateral',NULL,'bilateral','bilateral','Unilateral out','2025-04-08 06:29:54',NULL,NULL,NULL),(102,'Curacao Bonaire','Digicel','ANTCT','Bilateral',NULL,'Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(103,'Cyprus','MTN Cyprus Limited/ Salt','CYPSC','Bilateral',NULL,NULL,NULL,NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(104,'Cyprus','Primetel','CYPPT','Bilateral','Bilateral','Bilateral','Bilateral','bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(105,'Cyprus','vodafone/Cytamobile','CYPCT','Bilateral','Bilateral','bilateral','bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(106,'Czech Republic','O2/EUROTEL PRAHA/Telefonica','CZEET','Bilateral','Bilateral','bilateral','bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(107,'Czech Republic','Vodafone','CZECM','Bilateral','bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(108,'Czech Republic','T-MOBILE','CZERM','Bilateral','Bilateral','bilateral','bilateral','Bilateral','2025-04-08 06:29:54','310800',NULL,NULL),(109,'Denmark','Sonofon Denmark  /Telenor A/S','DNKDM','Bilateral','Unilateral out','Bilateral','Unilateral out','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(110,'Denmark','TDC Mobil','DNKTD','Bilateral','Bilateral','bilateral','bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(111,'Denmark','Telia Nattjanster Norden AB','DNKIA','Bilateral',NULL,NULL,NULL,NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(112,'Denmark','Telia Nattjanster Norden AB','DNKMX','Bilateral',NULL,NULL,NULL,NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(113,'Djibouti','Djibouti Telecom SA','DJIDJ','Bilateral','Bilateral','Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(114,'Dominican Republic','ALTICE Dominicana','DOM01','Bilateral','Unilateral In','Bilateral','Bilateral','Unilateral / IN','2025-04-08 06:29:54',NULL,NULL,NULL),(115,'Ecuador','Telefonica','ECUOT','Bilateral',NULL,'Bilateral','Bilateral','Uni IN','2025-04-08 06:29:54',NULL,NULL,NULL),(116,'Ecuador','Claro Ecuador','ECUPG','Bilateral',NULL,'bilateral','bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(117,'Egypt','Etisalat Misr','EGYEM','Bilateral','Bilateral','bilateral','bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(118,'Egypt','Telecom','EGYTE','Uni IN','Uni IN','Uni IN','Uni IN','Uni IN','2025-04-08 06:29:54',NULL,NULL,NULL),(119,'Egypt','Mobinil/ Orange','EGYAR','Bilateral','Bilateral','bilateral','bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(120,'Egypt','Vodafone Egypt Telecommunications S.A.E','EGYMS','Bilateral','Bilateral','bilateral','bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(121,'Equatorial Guinea','Green Com S,A','GNQHT','Bilateral','Bilateral','bilateral','bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(122,'Equatorial Guinea','Getesa-Orange','GNQ01','Bilateral','Unilateral IN',NULL,NULL,NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(123,'Estonia','Elisa Eesti AS','ESTRE','Bilateral','Bilateral','bilateral','bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(124,'Estonia','Tele 2 Eesti Aktsiaselts','ESTRB','Bilateral','Bilateral','bilateral','bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(125,'Ethiopia','Ethiopian Telecommunications Corporation','ETH01','Bilateral','Unilateral  OUT','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(126,'Ethiopia','Safaricom Limited Ethiopia','ETH02','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(127,'Faroe Islands','P/F Kall/Vodafone','FROKA','Bilateral',NULL,NULL,NULL,NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(128,'Finland','Ålands Telekommunikation Ab','FINAM','Bilateral',NULL,'bilateral','bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(129,'Finland','Telenor Finland','FIN2G','BIlateral','Unilateral out','BIlateral','Unilateral In','BIlateral','2025-04-08 06:29:54',NULL,NULL,NULL),(130,'Finland','Elisa','FINRL','Bilateral','Unilateral  OUT','bilateral','bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(131,'Finland','Elisa','FINES','Unilateral IN',NULL,'Uni IN','Uni IN',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(132,'France','Orange','FRAF1','Bilateral','Unilateral  OUT','Bilateral','bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(133,'France','SFR','FRAF2','Bilateral','Bilateral','Bilateral','bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(134,'France','SFR','FRA09','Unilateral IN','Unilateral IN','Uni IN','Uni IN','Uni IN','2025-04-08 06:29:54',NULL,NULL,NULL),(135,'France','Bouygues Telecom','FRAF3','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(136,'France','Orange M2M','AAZOR','Unilateral IN','Unilateral IN','Uni IN','Uni IN','Uni IN','2025-04-08 06:29:54',NULL,NULL,NULL),(137,'French Guiana','FREE CARAIBE','MTQFM','Outbound','Outbound','Outbound','Outbound','Outbound','2025-04-08 06:29:54',NULL,NULL,NULL),(138,'France','Free Mobile','FRAFM','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(139,'Gabon','Airtel Gabon','GABCT','Bilateral','Unilateral  OUT','Uni OUT','UNI OUT',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(140,'Gambia','Gamcel','GMB01','Bilateral',NULL,NULL,NULL,NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(141,'Gambia','Africell','GMBAC','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(142,'Germany','Vodafone GmbH','DEUD2','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(143,'Germany','TELEKOM/ T-mobile','DEUD1','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(144,'Germany','Telekom M2M','AAZTD','Unilateral IN',NULL,'Uni IN','Uni IN','Uni IN','2025-04-08 06:29:54',NULL,NULL,NULL),(145,'Germany','E-Plus Mobilfunk GmbH & Co. KG','DEUE1','Bilateral','Bilateral','Uni IN','Uni IN','Uni IN','2025-04-08 06:29:54',NULL,NULL,NULL),(146,'Germany','Emnify','EMNDE','Unilateral IN',NULL,'Unilateral IN','Unilateral IN','Uni IN','2025-04-08 06:29:54',NULL,NULL,NULL),(147,'Germany','Telefonica','DEUE2','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(148,'Ghana','Ghana Telecommunications Compan/Vodafone','GHAGT','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(149,'Ghana','Millicom Ghana Limited/Celtel Ghana','GHAMT','Bilateral','Bilateral','Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(150,'Ghana','MTN Ghana','GHASC','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(151,'Greece','COSMOTE / Mobile Telecommunications S.A.','GRCCO','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(152,'Greece','Vodafone','GRCPF','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(153,'Greece','WIND HELLAS','GRCQT','Unilateral IN','Unilateral IN','Uni IN','Uni IN','Uni IN','2025-04-08 06:29:54',NULL,NULL,NULL),(154,'Greece','WIND HELLAS','GRCSH','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(155,'Guadeloupe /Frensh Guiana /Martinique','Digicel','FRAF4','Bilateral',NULL,'Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(156,'Guatemala','Telecomunicaciones de Guatemala','GTMSC','Bilateral','Bilateral','bilateral','bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(157,'Guinea','Orange','GINGS','Bilateral','Bilateral','Bilateral','Bilateral','Unilateral OUT','2025-04-08 06:29:54',NULL,NULL,NULL),(158,'Guinea','MTN','GINAG','Bilateral','Bilateral','Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(159,'Guinea','intercell','GIN03','Bilateral',NULL,NULL,NULL,NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(160,'Guinea Bissau','Orange','GNB03','Unilateral','Unilateral','Unilateral','Unilateral','Unilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(161,'Guinea Bissau','MTN GUINEA BISSAU','GNBSB','Bilateral','Bilateral','Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(162,'Guernsey','Sure limited Guernsey','GBRGT','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54','23455',NULL,NULL),(163,'Guyana','Digicel','GUYUM','Bilateral',NULL,'Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(164,'Haiti','Digicel','HTICL','Unilateral IN',NULL,NULL,NULL,NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(165,'Haiti','Natcom Viettel','HTIVT','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(166,'Honduras','claro','HNDME','Bilateral','Bilateral','bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(167,'Hong Kong','PCCW Mobile HK Limited','HKGM3','Unilateral IN',NULL,'Uni IN','Uni IN','Uni IN','2025-04-08 06:29:54',NULL,NULL,NULL),(168,'Hong Kong','PCCW Mobile HK Limited','HKGMC','closed','closed','closed','closed','closed','2025-04-08 06:29:54',NULL,NULL,NULL),(169,'Hong Kong','Hong Kong CSL Limited HKT','HKGTC','Bilateral','Unilateral OUT','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(170,'Hong Kong','Hutchison Telecom (HK) Ltd','HKGHT','Bilateral',NULL,'Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(171,'Hong Kong','Hutchison Telecom (HK) Ltd 3 g  HKT','HKGH3','Bilateral',NULL,'Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(172,'Hong Kong','China Mobile Peoples Telephone Co Ltd','HKGPP','Bilateral',NULL,'bilateral','bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(173,'Hungary','T-MOBILE','HUNH2','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54','310800',NULL,NULL),(174,'Hungary','Vodafone','HUNVR','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(175,'Iceland','Siminn hf','ISLPS','Bilateral','Unilateral OUT','Unilateral IN',NULL,'Unilateral IN','2025-04-08 06:29:54',NULL,NULL,NULL),(176,'Iceland','IMC Island ehf/ Viking','ISLVW','Bilateral',NULL,NULL,NULL,NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(177,'India','Bharti Airtel Limited','INDA1','Bilateral','Bilateral','bilateral','bilateral','Bilateral','2025-04-08 06:29:54','40416',NULL,NULL),(178,'India','Bharti Airtel Limited','INDA2','Bilateral','Bilateral','bilateral','bilateral','Bilateral','2025-04-08 06:29:54','40416',NULL,NULL),(179,'India','Bharti Airtel Limited','INDA3','Bilateral','Bilateral','bilateral','bilateral','Bilateral','2025-04-08 06:29:54','40416',NULL,NULL),(180,'India','Bharti Airtel Limited','INDA4','Bilateral','Bilateral','bilateral','bilateral','Bilateral','2025-04-08 06:29:54','40416',NULL,NULL),(181,'India','Bharti Airtel Limited','INDA5','Bilateral','Bilateral','bilateral','bilateral','Bilateral','2025-04-08 06:29:54','40416',NULL,NULL),(182,'India','Bharti Airtel Limited','INDA6','Bilateral','Bilateral','bilateral','bilateral','Bilateral','2025-04-08 06:29:54','40416',NULL,NULL),(183,'India','Bharti Airtel Limited','INDA7','Bilateral','Bilateral','bilateral','bilateral','Bilateral','2025-04-08 06:29:54','40416',NULL,NULL),(184,'India','Bharti Airtel Limited','INDA8','Bilateral','Bilateral','bilateral','bilateral','Bilateral','2025-04-08 06:29:54','40416',NULL,NULL),(185,'India','Bharti Airtel Limited','INDA9','Bilateral','Bilateral','bilateral','bilateral','Bilateral','2025-04-08 06:29:54','40416',NULL,NULL),(186,'India','Bharti Airtel Limited','IND10','Bilateral','Bilateral','bilateral','bilateral','Bilateral','2025-04-08 06:29:54','40416',NULL,NULL),(187,'India','Bharti Airtel Limited','IND11','Bilateral','Bilateral','bilateral','bilateral','Bilateral','2025-04-08 06:29:54','40416',NULL,NULL),(188,'India','Bharti Airtel Limited','IND12','Bilateral','Bilateral','bilateral','bilateral','Bilateral','2025-04-08 06:29:54','40416',NULL,NULL),(189,'India','Bharti Airtel Limited','IND13','Unilateral IN',NULL,'Uni IN','Uni IN','Uni IN','2025-04-08 06:29:54','40416',NULL,NULL),(190,'India','Bharti Airtel Limited','IND14','Bilateral','Bilateral','bilateral','bilateral','Bilateral','2025-04-08 06:29:54','40416',NULL,NULL),(191,'India','Bharti Airtel Limited','IND15','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54','40416',NULL,NULL),(192,'India','Bharti Airtel Limited','IND16','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54','40416',NULL,NULL),(193,'India','AIRTEL,Bharti Cellular,Ltd,INDIA','INDJB','Bilateral','Bilateral','bilateral','bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(194,'India','AIRTEL ,Bharti Cellular INDIA','INDMT','Bilateral','Bilateral','bilateral','bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(195,'India','AIRTEL BhartiRajasthan','INDH1','Bilateral','Bilateral','bilateral','bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(196,'India','AIRTEL ,Bharti Cellular INDIA','INDAT','Bilateral','Bilateral','bilateral','bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(197,'India','AIRTEL ,Bharti Cellular INDIA','INDJH','Bilateral','Bilateral','bilateral','bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(198,'India','AIRTEL Bharti Cellular','INDBL','Bilateral','Bilateral','bilateral','bilateral','Bilateral','2025-04-08 06:29:54','40440',NULL,NULL),(199,'India','AIRTEL ,Bharti Cellular INDIA','INDSC','Bilateral','Bilateral','bilateral','bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(200,'India','Vodafone Essar East Limited','INDCC','Bilateral','Bilateral','bilateral',NULL,NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(201,'India','Vodafone Essar Gujarat Limited','INDF1','Bilateral',NULL,'bilateral',NULL,NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(202,'India','Hutchison Max Telecom','INDHM','Bilateral','Bilateral','bilateral',NULL,NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(203,'India','Vodafone Essar Mobile Services Limited','INDBT','Bilateral',NULL,'Bilateral',NULL,NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(204,'India','BPL INDIA','INDB1','Bilateral',NULL,'Bilateral',NULL,NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(205,'India','Reliance telecom Ltd','INDRM','Bilateral',NULL,NULL,NULL,NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(206,'India','Vodafone India','INDE1','Bilateral','Bilateral','Bilateral','Bilateral',NULL,'2025-04-08 06:29:54','40420',NULL,NULL),(207,'Indonesia','PT Mobile/8 Telekom Tbk','IDNTS','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(208,'Indonesia','Indosat','IDNSL','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(209,'Iran','MCI','IRN11','Bilateral','Bilateral','Bilateral',NULL,'Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(210,'Iran','Rightel','IRNTT','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(211,'Iran','MTN Irancell','IRNMI','Bilateral','Unilateral IN','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(212,'Iraq','Asia Cell Telecommunications Company Ltd','IRQAC','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(213,'Iraq','IRAQNA IRAQ /Zain','IRQOR','Bilateral','Unilateral IN','Bilateral',NULL,NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(214,'Iraq','Zain Iraq','IRQAT','Bilateral','Unilateral IN','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54','41820',NULL,NULL),(215,'Ireland','Vodafone','IRLEC','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(216,'Ireland','Meteor','IRLME','Bilateral','Bilateral','bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(217,'Italy','Vodafone Omnitel N.V.','ITAOM','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(218,'Italy','Free Mobile Iliad','ITAFM','Unilateral IN/Out','Uni IN & Out','Uni IN & Out','Uni IN & Out','Uni IN & Out','2025-04-08 06:29:54',NULL,NULL,NULL),(219,'Italy','Telecom Italia SpA','ITASI','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(220,'Jamaica','Digicel','JAMDC','Bilateral','Unilateral OUT','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(221,'Japan','NTT Docomo , inc','JPNDO','Bilateral',NULL,'bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(222,'Japan','KNDDI','JPNKD','Unilateral IN',NULL,'Uni IN','Uni IN',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(223,'Japan','KNDDI','JPNKS','Unilateral IN',NULL,'Unilateral IN','Unilateral IN',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(224,'Japan','KNDDI','JPNKI','Unilateral IN',NULL,'Uni IN','Uni IN',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(225,'Jersey','Telekom Jersey','GBRJT','Bilateral','Unilateral OUT','Uni IN','Uni IN','Bilateral','2025-04-08 06:29:54','23450',NULL,NULL),(226,'Jordan','Zain','JORFL','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(227,'Jordan','Orange Jordan / Petra','JORMC','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(228,'Jordan','Umniah Mobile Company','JORUM','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(229,'Kazakhstan','Tele 2','KAZ77','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(230,'Kazakhstan','Kar / Tel LLP /Beeline','KAZKT','Bilateral','Bilateral','Bilateral','Unilateral IN',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(231,'Kenya','Safaricom Limited','KENSA','Bilateral','Bilateral','Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(232,'Kenya','TELEKOM KENYA (orange)','KENTK','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(233,'Korea Republic of','SKT Korea','KORSK','Bilateral',NULL,'Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(234,'Korea Republic of','KT Corporation','KORKF','Bilateral',NULL,'Bilateral','Bilateral','Unilateral Out','2025-04-08 06:29:54',NULL,NULL,NULL),(235,'Kuwait','Zain (MTC, Vodafone)','KWTMT','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(236,'Kuwait','National Mobile Telecommunications Co. (Wataniya)','KWTNM','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(237,'Kuwait','VIVA ( KTC)','KWTKT','Bilateral','Unilateral IN','Bilateral',NULL,'Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(238,'Kyrgyz Republic','Bitel Ltd,GSM/900 Kyrgyz Republi','KGZ01','Bilateral',NULL,NULL,NULL,NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(239,'Kyrgyz Republic','NUR','KGZNT','Bilateral',NULL,'Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(240,'Laos','Unitel Laos / Viettel','LAOAS','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(241,'Latvia','Latvian Mobile Telephone Co','LVALM','Bilateral',NULL,'bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(242,'Latvia','TELE 2 LATIVIA','LVABC','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(243,'Lebanon','MIC 1','LBNFL','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(244,'Lebanon','MIC 2','LBNLC','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(245,'Lesotho','Vodacom','LSOVL','Bilateral',NULL,'Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(246,'Lesotho','Econet Telecom','LSOET','Bilateral',NULL,NULL,NULL,NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(247,'Liberia','MTN','LBRLC','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(248,'Liberia','Comium Services BVI (Liberia)','LBRCM','Bilateral',NULL,NULL,NULL,NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(249,'Lithuania','Tele 2 Lithunia','LTU03','Bilateral','Bilateral','Bilateral','Bilateral','Uni IN','2025-04-08 06:29:54',NULL,NULL,NULL),(250,'Luxembourg','P & T Luxembourg','LUXPT','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(251,'Luxembourg','MTX','MTX01','Uni IN',NULL,'Uni IN','Uni IN','Uni IN','2025-04-08 06:29:54',NULL,NULL,NULL),(252,'Luxembourg','MTX','MTX02','Uni IN',NULL,'Uni IN','Uni IN','Uni IN','2025-04-08 06:29:54',NULL,NULL,NULL),(253,'Luxembourg','Tango SA','LUXTG','Bilateral','Bilateral','Bilateral','Bilateral','Uni IN','2025-04-08 06:29:54',NULL,NULL,NULL),(254,'Luxembourg','VOX LUXEMBOURG /Orange','LUXVM','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(255,'Lybia','AL MADAR Telecomm Company','LBY01','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(256,'Macau','CTM','MACCT','Bilateral',NULL,'Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(257,'Macedonia','One VIP','MKDNO','Bilateral',NULL,NULL,NULL,NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(258,'Macedonia','COSMOFON AD Skopje/ One VIP','MKDCC','Bilateral',NULL,NULL,NULL,NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(259,'Madagascar','Orange Madagascar S.A.','MDGAN','Bilateral',NULL,'Bilateral','Bilateral',NULL,'2025-04-08 06:29:54','646020100058786',NULL,NULL),(260,'Madagascar','Celtel Madagascar','MDGCO','Bilateral','Bilateral','Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(261,'Malawi','Telekom Networks Malawi Ltd','MWICP','Bilateral','Bilateral','Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(262,'Mali','Malitel','MLI01','Bilateral','Bilateral','Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(263,'Mali','Orange Mali SA','MLI02','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54','61002',NULL,NULL),(264,'Malta','Vodafone M2M','AAZVF','Unilateral IN','Unilateral IN','Uni IN','Uni IN','Uni IN','2025-04-08 06:29:54',NULL,NULL,NULL),(265,'Malta','Vodafone Maritime','MLTMA','Unilateral OUT','Unilateral OUT','Unilateral OUT','Unilateral OUT','Unilateral OUT','2025-04-08 06:29:54',NULL,NULL,NULL),(266,'Malta','Vodafone / Salt','MLTTL','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(267,'Malta','Go Mobile','MLTGO','Bilateral','Unilateral IN','Bilateral',NULL,'Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(268,'Malaysia','U mobile Sdn Bhd Malaysia','MYSMI','Bilateral','Bilateral','Bilateral','Bilateral','Unilateral OUT','2025-04-08 06:29:54',NULL,NULL,NULL),(269,'Malaysia','Maxis Communications Berhad','MYSBC','Bilateral','Bilateral','Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(270,'Mauritania','MAURITEL MOBILES','MRTMM','Bilateral','Bilateral','Bilateral','Bilateral','Uni IN','2025-04-08 06:29:54',NULL,NULL,NULL),(271,'Mauritania','Chinguitel','MRTCH','Bilateral','Bilateral','Uni OUT','UNI OUT',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(272,'Mauritus','Orange','MUSCP','Bilateral',NULL,'Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(273,'Mexico','Telcel','MEXTL','Bilateral','Unilateral IN','bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(274,'Mexico','AT&T Mexico','MEXIU','Unilateral In',NULL,'Unilateral In','Unilateral In','Unilateral In','2025-04-08 06:29:54',NULL,NULL,NULL),(275,'Mexico','Telefónica México','MEXMS','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54','334030',NULL,NULL),(276,'Moldova','Orange','MDAVX','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(277,'Moldova','Moldtelecom','MDAUN','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(278,'Monaco','Telecom','MCOM2','Unilateral OUT',NULL,'Uni OUT','UNI OUT',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(279,'Mongolia','Unitel S,A','MNGMN','Bilateral','Unilateral  OUT','Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(280,'Montenegro','Telefonica','MNEPM','Bilateral','Bilateral','Bilateral','Bilateral','Unilateral IN','2025-04-08 06:29:54',NULL,NULL,NULL),(281,'Montenegro','m:tel','MNEMT','Bilateral',NULL,'Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(282,'Morocco','Maroc Telecom','MARM1','Bilateral','Bilateral','Bilateral','Bilateral','Uni IN','2025-04-08 06:29:54',NULL,NULL,NULL),(283,'Morocco','Orange /meditel','MARMT','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(284,'Morocco','Wana Morocco','MARM3','Bilateral','Bilateral','Bilateral','Uni IN','Bilateral','2025-04-08 06:29:54','60402',NULL,NULL),(285,'Mozambique','Vodacom','MOZVC','Bilateral','Unilateral OUT/IN','Bilateral','Bilateral','Unilateral IN','2025-04-08 06:29:54',NULL,NULL,NULL),(286,'Mozambique','Movitel Mozambiqe','MOZVG','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(287,'Mozambique','Viettel','MOZVT','Unilateral OUT','Unilateral  OUT','Uni OUT',NULL,NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(288,'Namibia','MTC Namibia','NAM01','Bilateral',NULL,NULL,NULL,NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(289,'Netherlands','Orange Nederland N.V.','NLDDT','Bilateral',NULL,'Uni IN','Uni IN',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(290,'Netherlands','T-Mobile Netherlands','NLDPN','Bilateral',NULL,'Bilateral','Bilateral',NULL,'2025-04-08 06:29:54','204201000211900',NULL,NULL),(291,'Netherlands','KPN Mobile The Netherlands','NLDPT','Bilateral','Unilateral IN','bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(292,'Netherlands','Vodafone Nertherlands','NLDLT','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(293,'Netherlands','Telfort','NLDTM','Unilateral IN','Unilateral IN','Uni IN','Uni IN',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(294,'New Caledonia','OPT','NCLPT','Bilateral',NULL,'Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(295,'New Zealand','2 Degrees Mobile Ltd','NZLNH','Bilateral','Unilateral IN','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(296,'New Zealand','Vodafone','NZLBS','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(297,'Nicaragua','Claro','NICEN','Bilateral',NULL,'Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(298,'Nicaragua','Claro','NICSC','Unilateral IN',NULL,NULL,NULL,NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(299,'Niger','Atlantique (Moov)','NERTL','Bilateral',NULL,NULL,NULL,NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(300,'Niger','Orange','NEROR','Bilateral','Bilateral','Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(301,'Niger','Airtel','NERCT','Bilateral',NULL,NULL,NULL,NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(302,'Nigeria','Celtel nigeria','NGAET','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(303,'Nigeria','MTN Nigeria Communications Limited','NGAMN','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54','62130',NULL,NULL),(304,'Nigeria','Etisalat Nigeria','NGAEM','Bilateral','Bilateral','Bilateral','Bilateral',NULL,'2025-04-08 06:29:54','62160',NULL,NULL),(305,'Norway','Telenor','NORTM','Bilateral','Unilateral OUT','bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(306,'Norway','Tele2 Group / lyse norway','NORIC','Unilateral IN',NULL,'Unilateral IN','Unilateral IN','Unilateral IN','2025-04-08 06:29:54',NULL,NULL,NULL),(307,'Norway','Aeromobile','NORAM','Unilateral OUT','Unilateral OUT','Uni OUT','UNI OUT',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(308,'Norway','MCP','NORMC','Unilateral OUT','Unilateral OUT','Uni OUT','UNI OUT','Unilateral OUT','2025-04-08 06:29:54',NULL,NULL,NULL),(309,'Norway','TDC Norway','NORTD','Unilateral IN',NULL,'Uni IN','Uni IN',NULL,'2025-04-08 06:29:54','24208',NULL,NULL),(310,'Oman,Sultanateof','Omantel','OMNGT','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(311,'Oman,Sultanateof','Vodafone','OMNVF','Bilateral','Unilateral IN&out','Unilateral IN','Unilateral IN','Unilateral IN','2025-04-08 06:29:54',NULL,NULL,NULL),(312,'Oman,Sultanateof','Nawres/Ooredoo','OMNNT','Bilateral','Unilateral IN','Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(313,'Pakistan','CMPak Limited /paktel','PAKPL','Bilateral','Unilateral OUT','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(314,'Pakistan','Telenor Pakistan (Pvt) Ltd.','PAKTP','Bilateral',NULL,'Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(315,'Pakistan','Warid Telecom (PVT) Ltd','PAKWA','Bilateral',NULL,'bilateral','Uni IN',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(316,'Palestinian Territory','Palestine Telecomm Co Ltd','PSEJE','Bilateral','Bilateral','Bilateral','Bilateral','Uni IN','2025-04-08 06:29:54',NULL,NULL,NULL),(317,'Palestinian Territory','Wataniya  mobile','PSEWM','Bilateral','Bilateral','Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(318,'Panama','Digicel','PANDC','Bilateral',NULL,'Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(319,'Panama','Cable & Wireless Panama','PANCW','Bilateral','Unilateral OUT',NULL,NULL,NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(320,'PARAGUAY','AMX Paraguay S.A.','PRYHT','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(321,'Peru','Viettel','PERVT','Unilateral OUT',NULL,'Uni OUT',NULL,NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(322,'Peru','Bitel Peru / Viettel','PERVG','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(323,'Peru','Telefonica','PERMO','Bilateral','Unilateral OUT','Bilateral','Bilateral','Uni IN','2025-04-08 06:29:54',NULL,NULL,NULL),(324,'Peru','Claro','PERTM','Bilateral',NULL,'bilateral',NULL,NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(325,'Philippines','Globe Telecom','PHLGT','Bilateral','bilateral','Bilateral','Bilateral','BILATERAL','2025-04-08 06:29:54',NULL,NULL,NULL),(326,'Philippines','SMART Communications, Inc.','PHLSR','Bilateral',NULL,'Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(327,'Poland','Orange','POL03','Bilateral','Unilateral IN','Uni IN','Uni IN',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(328,'Poland','P4','POLP4','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(329,'Poland','T-Mobile','POL02','Bilateral','Unilateral IN','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54','310800',NULL,NULL),(330,'polynesia','vini frensh polynesia','FRATK','Bilateral',NULL,'Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(331,'Puerto Rico','Liberty Mobile','PRI01','Unilateral IN','Unilateral IN','Unilateral  IN','Unilateral IN','Unilateral IN','2025-04-08 06:29:54',NULL,NULL,NULL),(332,'Puerto Rico','Claro','PRICL','Unilateral IN/Out','Unilateral Out','Unilateral IN / Out','Unilateral IN / Out','Unilateral Out','2025-04-08 06:29:54',NULL,NULL,NULL),(333,'Puerto Rico','AT & T','USAPB','Bilateral',NULL,'Bilateral','Bilateral','Uni IN','2025-04-08 06:29:54',NULL,NULL,NULL),(334,'Portugal','TMN   / MEO - Serviços de Comunicações e…','PRTTM','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(335,'Portugal','Vodafone','PRTTL','Bilateral','Bilateral','Bilateral','Bilateral','Uni IN','2025-04-08 06:29:54',NULL,NULL,NULL),(336,'Qatar','ooredoo','QATQT','Bilateral','Unilateral  OUT','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(337,'Qatar','Vodafone','QATB1','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(338,'Republic of Maldives','ooredoo Maldives','MDVWM','Bilateral',NULL,'Bilateral','Bilateral','Unilateral OUT','2025-04-08 06:29:54','47202',NULL,NULL),(339,'Romania','Cosmote Romanian Mobile Telecommunications S.A.','ROMCS','Bilateral',NULL,'Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(340,'Romania','Orange','ROMMR','Bilateral',NULL,'Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(341,'Romania','Vodafone Romania S.A.','ROMMF','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54','22601',NULL,NULL),(342,'Russia','OJSC VimpelCom, KP IMPULS, Beeline','RUSBD','Bilateral','Bilateral','Bilateral','Bilateral','Unilateral OUT','2025-04-08 06:29:54',NULL,NULL,NULL),(343,'Russia','MegaFon, Open Joint Stock Company','RUSNW','Bilateral','Bilateral','Uni IN','Uni IN','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(344,'Russia','MTS','RUS01','Bilateral','Unilateral IN','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(345,'Russia','tele 2','RUST2','Unilateral IN','Unilateral IN','Bilateral','Bilateral','Uni IN','2025-04-08 06:29:54',NULL,NULL,NULL),(346,'Rwanda,Republicof','MTN RwandaCell','RWAMN','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(347,'Salvador/el salvador','Telemovil','SLVTM','Bilateral',NULL,NULL,NULL,NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(348,'Salvador/el salvador','Digicel','SLVDC','Bilateral',NULL,'Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(349,'Salvador/el salvador','Claro','SLVTP','Bilateral',NULL,'bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(350,'Saudi Arabia','Saudi Telecom Company (STC)','SAUAJ','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(351,'Saudi Arabia','Mobily Lebara','SAULB','Unilateral IN','Unilateral IN',NULL,NULL,NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(352,'Saudi Arabia','STC Virgin MVNO','SAUVG','Unilateral IN','Unilateral IN','Uni IN','Uni IN','Uni IN','2025-04-08 06:29:54',NULL,NULL,NULL),(353,'Saudi Arabia','Etihad Etisalat Company','SAUET','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(354,'Saudi Arabia','ZAIN KSA','SAUSM','Unilateral IN','Unilateral IN','Unilateral IN','Unilateral IN','Unilateral IN','2025-04-08 06:29:54',NULL,NULL,NULL),(355,'Saudi Arabia','ZAIN KSA','SAUZN','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(356,'Senegal','Sonatel/ orange','SENAZ','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(357,'Senegal','TIGO / Free','SENSG','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(358,'Serbia','Telefonika','YUGMT','Bilateral','Bilateral','bilateral',NULL,'Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(359,'Serbia','Telekom Srbija','YUGTS','Bilateral',NULL,'bilateral','bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(360,'seychelles','Airtel','SYCAT','Bilateral',NULL,'Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(361,'Sierra Leone','Africell','SLEAC','Bilateral','Unilateral  OUT','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(362,'Sierra Leone','QCell SL','SLEQC','Bilateral',NULL,NULL,NULL,NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(363,'Singapore','MOBILE ONE SANGAPORE','SGPM1','Bilateral',NULL,'Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(364,'Slovak republic','Orange Slovensko a.s.','SVKGT','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(365,'Slovak republic','Slovak Telekom a.s','SVKET','Bilateral','Unilateral IN','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(366,'Slovenia','T2','SVNT2','Unilateral IN',NULL,'Unilateral IN','Unilateral IN',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(367,'Slovenia','Telemach Slovenija','SVNVG','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(368,'Slovenia','Mobitel D.D.','SVNMT','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(369,'South Africa','Cell C (Pty) Ltd','ZAFCC','Bilateral',NULL,'Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(370,'South Africa','MTN / Mobile Telephone Networks (Pty) Ltd.','ZAFMN','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(371,'South Africa','Vodacom (Pty) Ltd','ZAFVC','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(372,'South Sudan','MTN','SSDMN','Bilateral','Bilateral','Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(373,'Spain','Vodafone Espana S.A.','ESPAT','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(374,'Spain','Vodafone Espana S.A.','ESPVV','Unilateral IN','Unilateral IN','Uni IN','Uni IN','Uni IN','2025-04-08 06:29:54',NULL,NULL,NULL),(375,'Spain','Orange Spain','ESPRT','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54','214030',NULL,NULL),(376,'Spain','Telefonica Moviles España S.A.','ESPT2','Unilateral IN',NULL,'Uni IN','Uni IN','Uni IN','2025-04-08 06:29:54',NULL,NULL,NULL),(377,'Spain','Telefonica Moviles España S.A.','ESPTE','Bilateral','Unilateral  OUT','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(378,'Sri Lanka','Mobitel (Pvt) Limited','LKA71','Bilateral','Unilateral IN','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(379,'Sri Lanka','Dialog Telekom Ltd','LKADG','Bilateral','Bilateral','Bilateral','Bilateral','Uni IN','2025-04-08 06:29:54',NULL,NULL,NULL),(380,'Sri Lanka','Hutchison','LKAHT','Bilateral',NULL,NULL,NULL,NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(381,'Sudan','Zain , Mobitel','SUDMO','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(382,'Sudan','MTN Sudan','SDNBT','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(383,'suriname','Digicel','SURDC','Bilateral',NULL,'Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(384,'Swaziland','Swazi MTN Limited','SWZMN','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(385,'Sweden','Tele 2 AB','SWEIQ','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(386,'Sweden','Tele 2 AB','SWESM','Unilateral IN',NULL,'Uni IN','Uni IN',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(387,'Sweden','TeliaSonera Mobile Networks AB Sweden','SWETR','Bilateral',NULL,NULL,NULL,NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(388,'Sweden','Telenor Nordic','SWEEP','Bilateral','Unilateral Out','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(389,'Sweden','Telenor Nordic','SWECN','Unilateral IN','Unilateral IN','Unilateral IN','Unilateral IN','Unilateral IN','2025-04-08 06:29:54',NULL,NULL,NULL),(390,'Sweden','TDC Sweden','SWETD','Unilateral IN',NULL,'Uni IN','Uni IN',NULL,'2025-04-08 06:29:54','24014',NULL,NULL),(391,'Switzerland','Swisscom (Switzerland) Ltd','CHEC1','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54','22801',NULL,NULL),(392,'Switzerland','Sunrise Commincation','CHEDX','Bilateral','Bilateral','Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(393,'Switzerland','Orange Communications SA','CHEOR','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(394,'Switzerland','OnAir  Switzerland','CHEOA','Unilateral OUT','Unilateral  OUT','Uni OUT','Uni OUT',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(395,'Syria','Syriatel Mobile Telecom SA','SYR01','Bilateral','Unilateral IN','Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(396,'Syria','MTN Syria (JSC)','SYRSP','Bilateral',NULL,'Uni IN','Uni IN',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(397,'Taiwan','Star Telecom Taiwan (vibo)','TWNTG','Bilateral','Unilateral  OUT','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(398,'Tajikistan/North','JV Somoncom','TJK01','Bilateral',NULL,NULL,NULL,NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(399,'Tajikistan/North','Indigo Tajikistan','TJKIT','Bilateral',NULL,NULL,NULL,NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(400,'Tanzania','Celtel Tanzania Ltd.','TZACT','Bilateral','Unilateral OUT','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54','64005',NULL,NULL),(401,'Tanzania','Mic Tanzania','TZAMB','Bilateral',NULL,'Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(402,'Tanzania','Vodafone','TZAVC','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(403,'Tanzania','Halotel Tanzania','TZAVG','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(404,'Tanzania','Smart','TZAYA','Bilateral','Unilateral  OUT','Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(405,'Tchad','Airtel Tchad','TCDCT','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(406,'Tchad','Mic Tchad','TCDML','Bilateral',NULL,NULL,NULL,NULL,'2025-04-08 06:29:54','622030110995247',NULL,NULL),(407,'Thailand','DTAC THAILAND','THAWP','Bilateral','Discontinued Operator',NULL,NULL,NULL,'2025-04-08 06:29:54','52005',NULL,NULL),(408,'Thailand','DTAC THAILAND','THADT','Bilateral',NULL,'Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54','52005',NULL,NULL),(409,'Thailand','Advanced Wireless Network','THAWN','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(410,'Thailand','True Move (Real Future Thailand)','THACT','Unilateral IN','Unilateral IN','Bilateral','Bilateral','Uni IN','2025-04-08 06:29:54',NULL,NULL,NULL),(411,'Thailand','True Move Company Ltd','THACA','Bilateral','Unilateral IN',NULL,'Uni IN','Unilateral IN','2025-04-08 06:29:54',NULL,NULL,NULL),(412,'Timor Leste','Telkomcel','TLSTC','Bilateral','Bilateral','Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(413,'Timor Leste','Telemor','TLSVG','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(414,'Togo','Togo Cellulaire','TGOTC','Bilateral',NULL,NULL,NULL,NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(415,'Tunisia','Ooredoo Tunisia','TUNTA','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54','60503',NULL,NULL),(416,'Tunisia','Tunisie Telecom','TUNTT','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54','60502',NULL,NULL),(417,'Tunisia','Tunisie Telecom','TUNCC',NULL,'Unilateral IN',NULL,NULL,NULL,'2025-04-08 06:29:54','60502',NULL,NULL),(418,'Tunisia','Orange Tunisie','TUNOR','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(419,'Tunisia','Lyca Mobile','TUNLM','Unilateral IN','Unilateral IN',NULL,NULL,NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(420,'Turkey','TT Mobile ex Avea Iletisim Hizmetleri A.S.','TURIS','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(421,'Turkey','TT Mobile ex Avea Iletisim Hizmetleri A.S.','TURAC','Bilateral','Unilateral IN','Uni IN','Uni IN',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(422,'Turkey','Turkcell Iletisim Hizmetleri A.S.','TURTC','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(423,'Turkey','Vodafone Telekomunikasyon A.S','TURTS','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(424,'Turkmenistan','MTS-Turkmenistan','TKMBC','Bilateral',NULL,NULL,NULL,NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(425,NULL,'TMCELL AMD Telecom','TKMAA TKM02','Bilateral',NULL,NULL,NULL,NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(426,'Trindad & Tobago','Digicel','TTODL','Bilateral',NULL,'Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(427,'Uganda','Celtel Uganda','UGACE','Bilateral',NULL,'Uni IN','Uni IN','Uni IN','2025-04-08 06:29:54',NULL,NULL,NULL),(428,'Uganda','Celtel Uganda','UGAWT','Uni IN',NULL,'Uni IN','Uni IN','Uni IN','2025-04-08 06:29:54',NULL,NULL,NULL),(429,'Uganda','Smart Uganda','UGASU','Bilateral','Bilateral','Bilateral','Bilateral',NULL,'2025-04-08 06:29:54','64118',NULL,NULL),(430,'Ukraine','Golden Telekom','UKRGT','Bilateral',NULL,NULL,NULL,NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(431,'Ukraine','Astelit LLC/lifecell','UKRAS','Bilateral','Unilateral IN','Bilateral','Bilateral','Unilateral OUT','2025-04-08 06:29:54',NULL,NULL,NULL),(432,'Ukraine','Kyivstar GSM JSC','UKRKS','Bilateral','Unilateral OUT','Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(433,'Ukraine','Ukrainian Radio Systems','UKRRS','Bilateral',NULL,'Uni IN','Uni IN',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(434,'Ukraine','Ukrainian Mobile Communications','UKRUM','Bilateral','Bilateral','Bilateral','Uni IN',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(435,'United Arab Emirates','Emirates Integrated Telecommunications Company PJSC','AREDU','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(436,'United Arab Emirates','Emirates Telecom Corp/ETISALAT','ARETC','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(437,'United Arab Emirates','THURAYA','ARETH','Bilateral','Unilateral IN','Bilateral','Uni IN',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(438,'UnitedKingdom','T-Mobile (EE)','GBRME','Bilateral',NULL,'Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(439,'UnitedKingdom','Vodafone','GBRVF','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(440,'UnitedKingdom','Truphone','GBRTR','Uni IN','Unilateral IN','Uni IN','Uni IN','Uni IN','2025-04-08 06:29:54',NULL,NULL,NULL),(441,'UnitedKingdom','Telefonica UK Limited / O2','GBRCN','Bilateral','Unilateral OUT','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(442,'United States of America','Limitless Mobile','USACW','Bilateral','Bilateral','Bilateral',NULL,'Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(443,'United States of America','T-Mobile  USA','USAW6','Bilateral','Bilateral','Bilateral','Bilateral','Unilateral OUT','2025-04-08 06:29:54','310230',NULL,NULL),(444,'United States of America','T-Mobile  USA','USA16','Bilateral','Unilateral IN','Bilateral','Bilateral',NULL,'2025-04-08 06:29:54','310230',NULL,NULL),(445,'United States of America','T-Mobile  USA','USAW0','Bilateral','Unilateral IN','Bilateral','Bilateral',NULL,'2025-04-08 06:29:54','310230',NULL,NULL),(446,'United States of America','T-Mobile  USA','USAW1','Bilateral',NULL,'Bilateral','Bilateral',NULL,'2025-04-08 06:29:54','310230',NULL,NULL),(447,'United States of America','T-Mobile  USA','USAW2','Bilateral',NULL,'Bilateral','Bilateral',NULL,'2025-04-08 06:29:54','310230',NULL,NULL),(448,'United States of America','T-Mobile  USA','USAW3','Bilateral',NULL,'Bilateral','Bilateral',NULL,'2025-04-08 06:29:54','310230',NULL,NULL),(449,'United States of America','T-Mobile  USA','USAW4','Bilateral','Unilateral IN','Bilateral','Bilateral',NULL,'2025-04-08 06:29:54','310230',NULL,NULL),(450,'United States of America','T-Mobile  USA','USAW5','Bilateral','Unilateral IN','Bilateral','Bilateral',NULL,'2025-04-08 06:29:54','310230',NULL,NULL),(451,'United States of America','T-Mobile  USA','USA27','Bilateral','Unilateral IN','Bilateral','Bilateral',NULL,'2025-04-08 06:29:54','310230',NULL,NULL),(452,'United States of America','T-Mobile  USA','USA31','Bilateral','Unilateral IN','Bilateral','Bilateral',NULL,'2025-04-08 06:29:54','310230',NULL,NULL),(453,'United States of America','T-Mobile  USA','USAD1','Bilateral',NULL,'Bilateral','Bilateral',NULL,'2025-04-08 06:29:54','310230',NULL,NULL),(454,'United States of America','T-Mobile  USA','USASC','Bilateral','Unilateral IN','Bilateral','Bilateral',NULL,'2025-04-08 06:29:54','310230',NULL,NULL),(455,'United States of America','T-Mobile  USA','USAST','Bilateral',NULL,'Bilateral','Bilateral',NULL,'2025-04-08 06:29:54','310230',NULL,NULL),(456,'United States of America','AT & T','USACG','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(457,'United States of America','AT & T','USABS','Bilateral',NULL,'Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(458,'United States of America','AT & T','USAMF','Bilateral','Unii IN','Bilateral','Bilateral','Uni IN','2025-04-08 06:29:54',NULL,NULL,NULL),(459,'United States of America','AT & T','USACC','Bilateral',NULL,'Bilateral','Bilateral','Uni IN','2025-04-08 06:29:54',NULL,NULL,NULL),(460,'United States of America','AT & T','USAFN','Unilateral IN','Unii IN','Uni IN','Uni IN','Uni IN','2025-04-08 06:29:54',NULL,NULL,NULL),(461,'United States of America','AT & T','USAAT','Bilateral',NULL,'Bilateral','Bilateral','Uni IN','2025-04-08 06:29:54',NULL,NULL,NULL),(462,'United States of America','AT & T  Maritime Cruise','BMU01','Unilateral OUT',NULL,'Uni OUT','UNI OUT',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(463,'United States of America','Cincinnati Bell Wireless LLC','USACB','Bilateral',NULL,'Bilateral',NULL,NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(464,'United States of America','Verizon','USAVZ','Unilateral IN',NULL,'Uni IN','Uni IN',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(465,'United States of America','Verizon','USAVM','Unilateral IN',NULL,'Uni IN','Uni IN',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(466,'Uruguay','AM Wireless Uruguay S.A. claro','URYAM','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(467,'Uruguay','Telefonica','URYTM','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(468,'Uruguay','Antel Ancel','URYAN','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(469,'Uzbekistan','COSCOM (TM UCell),','UZB05','Bilateral',NULL,'Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(470,'Uzbekistan','Uzbektelecom','UZB00','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(471,'Uzbekistan','UMS LLC','UZB07','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(472,'Uzbekistan','Unitel','UZBDU','Bilateral','Bilateral','bilateral','bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(473,'venezuela','Digitel GSM','VEND2','Bilateral',NULL,NULL,NULL,NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(474,'Vietnam','Vietnamobile Communications Center','VNMVM','Bilateral',NULL,NULL,NULL,NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(475,'Vietnam','Mobifone','VNMMO','Bilateral',NULL,'Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(476,'Vietnam','Vinaphone','VNMVI','Bilateral','Bilateral','Bilateral','Bilateral','Uni IN','2025-04-08 06:29:54',NULL,NULL,NULL),(477,'Vietnam','Viettel','VNMVT','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(478,'Yemen','Yemen Mobile Phone Company / Sabafon','YEMSA','Bilateral','Unilateral IN','Bilateral',NULL,NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(479,'Yemen','Spacetel','YEMSP','Bilateral',NULL,NULL,NULL,NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(480,'Yemen','Yemen Telecom','YEMYY','Bilateral',NULL,NULL,NULL,NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(481,'Zambia','MTN','ZMB02','Bilateral','Bilateral','Bilateral','Bilateral','Bilateral','2025-04-08 06:29:54',NULL,NULL,NULL),(482,'Zambia','Airtel','ZMBCE','Bilateral',NULL,NULL,NULL,NULL,'2025-04-08 06:29:54',NULL,NULL,NULL),(483,'Zimbabwe','Telcel','ZWEN3','Bilateral',NULL,'Bilateral','Bilateral',NULL,'2025-04-08 06:29:54',NULL,NULL,NULL);
/*!40000 ALTER TABLE `situation_globales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tasks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` text NOT NULL,
  `status` varchar(50) DEFAULT 'En attente',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `role` enum('user','admin') DEFAULT 'user',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Test','test@example.com','$2b$10$.vtIN5YChJUmtegEahSGPeRw8Y9hADd9CJ/l1FDxgNsPT8iaSdUPK','2025-03-31 18:14:27','user'),(2,'Test','nouveau@example.com','$2b$10$M0EEMi9Z3.EW9z6Q7Ij0TuM2NAoTtIgyIGbUv4Plz6Jkcp107eFza','2025-03-31 18:35:33','user'),(3,'Test','test2@example.com','$2b$10$3hHzdEzJJOLYTqZw0i.MCO9S8cF93qTYz26CsKBlj1RAwYUOjJ0MC','2025-03-31 19:26:57','user'),(7,'khadidja','khadidja@gmail.com','$2b$10$O4StXXo0xjagC67NanU5s.K84g/uwVDJGnSCMWv55Gnyj3jdhgZOu','2025-04-03 19:18:57','user'),(18,'dsa','ssaa@gmail.com','$2b$10$PLhxWbZZHgaZ3irupjceoeKeT6AQ0KdmBOrqfFnjGSgZH0zEB4YZq','2025-04-04 14:46:26','user'),(19,'sayah','sayahkhadidja7@gmail.com','$2b$10$1mT8lML2rlRNcXKXPHaTMe8.qjL2eddGahx.EonJCUGlblw4q3b7.','2025-04-04 14:56:16','user');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-14 15:48:34
CREATE TABLE firewall_ips (
    identifiant INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255),
    adresse_ip VARCHAR(45),
    longueur_masque INT,
    cidr_complet VARCHAR(50)
);
