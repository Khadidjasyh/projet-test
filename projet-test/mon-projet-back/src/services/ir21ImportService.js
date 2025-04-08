const IR21Parser = require('../utils/ir21Parser');
const db = require('../config/db.config');
const path = require('path');
const fs = require('fs').promises;

class IR21ImportService {
    constructor() {
        this.parser = new IR21Parser();
    }

    async importIR21Document(filePath, uploadedBy) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Parse the IR.21 XML file
            const parsedData = await this.parser.parseXMLFile(filePath);
            
            // Create or update partner first
            const partnerId = await this.createOrUpdatePartner(connection, parsedData.basicInfo);
            
            // Store the document with the partner ID
            const documentId = await this.storeDocument(connection, filePath, parsedData, uploadedBy, partnerId);
            
            // Store network configurations
            await this.storeNetworkConfigs(connection, partnerId, parsedData.networkConfigs);
            
            // Store SCCP routes
            await this.storeSCCPRoutes(connection, partnerId, parsedData.sccpRoutes);
            
            // Store IMSI configurations
            await this.storeIMSIConfigs(connection, partnerId, parsedData.imsiConfigs);

            await connection.commit();
            return { success: true, documentId, partnerId };
        } catch (error) {
            await connection.rollback();
            console.error('Error importing IR.21:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    async storeDocument(connection, filePath, parsedData, uploadedBy, partnerId) {
        const fileName = path.basename(filePath);
        const query = `
            INSERT INTO ir21_documents (
                partner_id,
                file_name,
                file_path,
                file_format,
                content,
                uploaded_by,
                status
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await connection.execute(query, [
            partnerId,
            fileName,
            filePath,
            'RAEX',
            JSON.stringify(parsedData.rawData),
            uploadedBy,
            'Pending'
        ]);

        return result.insertId;
    }

    async createOrUpdatePartner(connection, basicInfo) {
        // If basicInfo is not provided, create a temporary partner
        if (!basicInfo) {
            const [result] = await connection.execute(`
                INSERT INTO partners (
                    name,
                    status,
                    created_at
                ) VALUES (?, 'Testing', NOW())
            `, ['Temporary Partner']);
            return result.insertId;
        }

        const checkQuery = 'SELECT partner_id FROM partners WHERE tadig_code = ?';
        const [existing] = await connection.execute(checkQuery, [basicInfo.tadigCode]);

        if (existing.length > 0) {
            // Update existing partner
            const updateQuery = `
                UPDATE partners 
                SET name = ?,
                    country = ?,
                    status = ?,
                    last_updated = NOW()
                WHERE partner_id = ?
            `;
            await connection.execute(updateQuery, [
                basicInfo.operatorName,
                basicInfo.countryCode,
                'Active',
                existing[0].partner_id
            ]);
            return existing[0].partner_id;
        } else {
            // Create new partner
            const insertQuery = `
                INSERT INTO partners (
                    name,
                    country,
                    tadig_code,
                    status,
                    created_at
                ) VALUES (?, ?, ?, 'Active', NOW())
            `;
            const [result] = await connection.execute(insertQuery, [
                basicInfo.operatorName || 'Unknown Operator',
                basicInfo.countryCode || 'Unknown',
                basicInfo.tadigCode || 'UNKNOWN'
            ]);
            return result.insertId;
        }
    }

    async storeNetworkConfigs(connection, partnerId, configs) {
        // First, mark all existing configs as inactive
        await connection.execute(
            'UPDATE network_configs SET status = ? WHERE partner_id = ?',
            ['Inactive', partnerId]
        );

        // Insert new configurations
        const insertQuery = `
            INSERT INTO network_configs (
                partner_id,
                node_type,
                vendor,
                gt,
                status
            ) VALUES (?, ?, ?, ?, ?)
        `;

        for (const config of configs) {
            await connection.execute(insertQuery, [
                partnerId,
                config.nodeType,
                config.vendor,
                config.gt,
                config.status
            ]);
        }
    }

    async storeSCCPRoutes(connection, partnerId, routes) {
        // First, mark all existing routes as invalid
        await connection.execute(
            'UPDATE sccp_routes SET status = ? WHERE partner_id = ?',
            ['Invalid', partnerId]
        );

        // Insert new routes
        const insertQuery = `
            INSERT INTO sccp_routes (
                partner_id,
                tt,
                np,
                na,
                gtrc,
                status,
                direction
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        for (const route of routes) {
            await connection.execute(insertQuery, [
                partnerId,
                0, // Default values for tt, np, na - adjust as needed
                0,
                0,
                route.dpc,
                route.status,
                route.direction
            ]);
        }
    }

    async storeIMSIConfigs(connection, partnerId, imsiConfig) {
        const insertQuery = `
            INSERT INTO imsi_configs (
                partner_id,
                imsi_prefix,
                mgt,
                msisdn_range,
                msrn_range
            ) VALUES (?, ?, ?, ?, ?)
        `;

        await connection.execute(insertQuery, [
            partnerId,
            imsiConfig.imsiPrefix,
            imsiConfig.mgt,
            JSON.stringify(imsiConfig.msisdnRanges),
            JSON.stringify(imsiConfig.msrnRanges)
        ]);
    }
}

module.exports = IR21ImportService; 