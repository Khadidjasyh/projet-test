const xml2js = require('xml2js');
const fs = require('fs').promises;

class IR21Parser {
    constructor() {
        this.parser = new xml2js.Parser({
            explicitArray: false,
            mergeAttrs: true
        });
    }

    async parseXMLFile(filePath) {
        try {
            const xmlContent = await fs.readFile(filePath, 'utf-8');
            const result = await this.parser.parseStringPromise(xmlContent);
            
            return {
                basicInfo: this.extractBasicInfo(result),
                networkConfigs: this.extractNetworkConfigs(result),
                sccpRoutes: this.extractSCCPRoutes(result),
                imsiConfigs: this.extractIMSIConfigs(result),
                rawData: result // Store the complete parsed XML for reference
            };
        } catch (error) {
            console.error('Error parsing IR.21 XML:', error);
            throw error;
        }
    }

    extractBasicInfo(data) {
        const ir21Data = data.IR21DOC || {};
        const networkInfo = ir21Data.NETWORK || {};
        
        return {
            tadigCode: networkInfo.TADIG || '',
            operatorName: networkInfo.NAME || '',
            countryCode: networkInfo.COUNTRY || '',
            status: 'Active' // Default status
        };
    }

    extractNetworkConfigs(data) {
        const ir21Data = data.IR21DOC || {};
        const networkNodes = ir21Data.NETWORK_NODES || {};
        const nodes = networkNodes.NODE || [];
        
        // Ensure nodes is always an array
        const nodeArray = Array.isArray(nodes) ? nodes : [nodes];
        
        return nodeArray.map(node => ({
            nodeType: node.TYPE || '',
            vendor: node.VENDOR || '',
            gt: node.GT || '',
            status: 'Active'
        }));
    }

    extractSCCPRoutes(data) {
        const ir21Data = data.IR21DOC || {};
        const sccpInfo = ir21Data.SCCP_INFO || {};
        const routes = sccpInfo.ROUTE || [];
        
        // Ensure routes is always an array
        const routeArray = Array.isArray(routes) ? routes : [routes];
        
        return routeArray.map(route => ({
            dpc: route.DPC || '',
            status: 'Active',
            direction: route.DIRECTION || 'Bidirectional'
        }));
    }

    extractIMSIConfigs(data) {
        const ir21Data = data.IR21DOC || {};
        const subscriberInfo = ir21Data.SUBSCRIBER_INFO || {};
        
        return {
            imsiPrefix: subscriberInfo.IMSI_PREFIX || '',
            mgt: subscriberInfo.MGT || '',
            msisdnRanges: this.extractRanges(subscriberInfo.MSISDN_RANGES),
            msrnRanges: this.extractRanges(subscriberInfo.MSRN_RANGES)
        };
    }

    extractRanges(rangeData) {
        if (!rangeData || !rangeData.RANGE) {
            return [];
        }

        const ranges = Array.isArray(rangeData.RANGE) ? 
            rangeData.RANGE : [rangeData.RANGE];

        return ranges.map(range => ({
            start: range.START || '',
            end: range.END || ''
        }));
    }
}

module.exports = IR21Parser; 