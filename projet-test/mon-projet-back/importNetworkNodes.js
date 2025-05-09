const mysql = require("mysql2");
const xlsx = require("xlsx");

// MySQL Connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "mon_projet_db",
});

connection.connect((err) => {
  if (err) {
    console.error("❌ Error connecting to MySQL:", err);
    return;
  }
  console.log("✅ Connected to MySQL");
  importNetworkNodes();
});

function importNetworkNodes() {
  // Sample data with the correct structure
  const networkNodes = [
    {
      node_name: 'MSCBMR1',
      node_type: 'MSC',
      vendor: 'Ericsson',
      ip_address: '10.0.1.1',
      gt: '21421',
      location: 'BMR',
      active: 1
    },
    {
      node_name: 'MSCMUS1',
      node_type: 'MSC',
      vendor: 'Ericsson',
      ip_address: '10.0.1.2',
      gt: '21422',
      location: 'MUS',
      active: 1
    },
    {
      node_name: 'HLR1',
      node_type: 'HLR',
      vendor: 'Huawei',
      ip_address: '10.0.2.1',
      gt: '21431',
      location: 'ALG',
      active: 1
    },
    {
      node_name: 'HLR2',
      node_type: 'HLR',
      vendor: 'Huawei',
      ip_address: '10.0.2.2',
      gt: '21432',
      location: 'ALG',
      active: 1
    },
    {
      node_name: 'SGSN1',
      node_type: 'SGSN',
      vendor: 'Cisco',
      ip_address: '10.0.3.1',
      gt: '21441',
      location: 'ALG',
      active: 1
    },
    {
      node_name: 'SGSN2',
      node_type: 'SGSN',
      vendor: 'Cisco',
      ip_address: '10.0.3.2',
      gt: '21442',
      location: 'ALG',
      active: 1
    },
    {
      node_name: 'FW1',
      node_type: 'Firewall',
      vendor: 'Cisco',
      ip_address: '10.0.4.1',
      gt: '',
      location: 'ALG',
      active: 1
    },
    {
      node_name: 'STP1',
      node_type: 'STP',
      vendor: 'Ericsson',
      ip_address: '10.0.5.1',
      gt: '21451',
      location: 'ALG',
      active: 1
    },
    {
      node_name: 'STP2',
      node_type: 'STP',
      vendor: 'Ericsson',
      ip_address: '10.0.5.2',
      gt: '21452',
      location: 'ALG',
      active: 1
    }
  ];

  // Clear existing data
  connection.query("TRUNCATE TABLE network_nodes", (err) => {
    if (err) {
      console.error("❌ Error clearing table:", err);
      connection.end();
      return;
    }

    console.log("✅ Table cleared successfully");

    // Insert each node
    let insertedCount = 0;
    networkNodes.forEach((node) => {
      connection.query(
        'INSERT INTO network_nodes SET ?',
        node,
        (err, result) => {
          if (err) {
            console.error(`❌ Error inserting node ${node.node_name}:`, err);
          } else {
            console.log(`✅ Inserted node: ${node.node_name}`);
            insertedCount++;
          }

          // Close connection after all inserts are done
          if (insertedCount === networkNodes.length) {
            console.log(`✅ All nodes inserted successfully (${insertedCount} nodes)`);
            connection.end();
          }
        }
      );
    });
  });
} 