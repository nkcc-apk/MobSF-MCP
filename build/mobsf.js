"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMobSFClient = exports.MobSFClient = void 0;
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const fs_1 = __importDefault(require("fs"));
class MobSFClient {
    baseUrl;
    apiKey;
    constructor(baseUrl, apiKey) {
        this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        this.apiKey = apiKey;
    }
    createRequestConfig(path, method = 'GET', data, headers, params) {
        return {
            url: `${this.baseUrl}${path}`,
            method,
            headers: {
                'Authorization': this.apiKey,
                'X-Mobsf-Api-Key': this.apiKey,
                'Content-Type': 'application/json',
                ...headers
            },
            data,
            params
        };
    }
    async sendRequest(config) {
        try {
            const response = await (0, axios_1.default)(config);
            return response.data;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                const errorData = error.response?.data ? JSON.stringify(error.response.data, null, 2) : error.message;
                throw new Error(`MobSF API Error: ${errorData}`);
            }
            throw error;
        }
    }
    /**
    * Upload a file to MobSF for analysis
    * Supported file types: apk, zip, ipa, and appx
    * @param filePath Path to the file to upload
    * @returns Upload response containing file_name, hash, and scan_type
    */
    async uploadFile(filePath) {
        const formData = new form_data_1.default();
        formData.append('file', fs_1.default.createReadStream(filePath));
        // When using FormData, we need to let Axios handle the Content-Type
        // to ensure proper multipart/form-data boundaries
        const config = {
            url: `${this.baseUrl}/api/v1/upload`,
            method: 'POST',
            headers: {
                'Authorization': this.apiKey,
                'X-Mobsf-Api-Key': this.apiKey,
                ...formData.getHeaders()
            },
            data: formData
        };
        return this.sendRequest(config);
    }
    /**
   * Get scan logs for a specific file
   * @param hash Hash of the file to get logs for
   * @returns Scan logs as a string
   */
    async getScanLogs(hash) {
        const formData = new URLSearchParams();
        formData.append('hash', hash);
        const config = {
            url: `${this.baseUrl}/api/v1/scan_logs`,
            method: 'POST',
            headers: {
                'Authorization': this.apiKey,
                'X-Mobsf-Api-Key': this.apiKey,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: formData.toString()
        };
        return this.sendRequest(config);
    }
    /**
     * Generate a detailed JSON report for a scanned file
     * @param hash Hash of the file to generate a report for
     * @returns Detailed JSON report
     */
    async generateJsonReport(hash) {
        const formData = new URLSearchParams();
        formData.append('hash', hash);
        const config = {
            url: `${this.baseUrl}/api/v1/report_json`,
            method: 'POST',
            headers: {
                'Authorization': this.apiKey,
                'X-Mobsf-Api-Key': this.apiKey,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: formData.toString()
        };
        return this.sendRequest(config);
    }
    /**
     * Get a list of recent scans
     * @param page Page number for pagination
     * @param pageSize Number of items per page
     * @returns List of recent scans with pagination info
     */
    async getRecentScans(page = 1, pageSize = 10) {
        const config = this.createRequestConfig('/api/v1/scans', 'GET', undefined, {
            'Authorization': this.apiKey,
            'X-Mobsf-Api-Key': this.apiKey
        }, {
            page,
            page_size: pageSize
        });
        return this.sendRequest(config);
    }
    /**
     * Search scan results by hash, app name, package name, or file name
     * @param query Hash, app name, package name, or file name to search
     * @returns Search result as a string
     */
    async searchScanResult(query) {
        const formData = new URLSearchParams();
        formData.append('query', query);
        const config = {
            url: `${this.baseUrl}/api/v1/search`,
            method: 'POST',
            headers: {
                'Authorization': this.apiKey,
                'X-Mobsf-Api-Key': this.apiKey,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: formData.toString()
        };
        return this.sendRequest(config);
    }
    /**
     * Delete scan results by hash
     * @param hash Hash of the scan to delete
     * @returns Delete result as a string
     */
    async deleteScan(hash) {
        const formData = new URLSearchParams();
        formData.append('hash', hash);
        const config = {
            url: `${this.baseUrl}/api/v1/delete_scan`,
            method: 'POST',
            headers: {
                'Authorization': this.apiKey,
                'X-Mobsf-Api-Key': this.apiKey,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: formData.toString()
        };
        return this.sendRequest(config);
    }
    /**
     * Get MobSF Application Security Scorecard by hash
     * @param hash Hash of the scan
     * @returns Scorecard result as a string
     */
    async getScorecard(hash) {
        const formData = new URLSearchParams();
        formData.append('hash', hash);
        const config = {
            url: `${this.baseUrl}/api/v1/scorecard`,
            method: 'POST',
            headers: {
                'Authorization': this.apiKey,
                'X-Mobsf-Api-Key': this.apiKey,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: formData.toString()
        };
        return this.sendRequest(config);
    }
    /**
     * Generate PDF Report by hash
     * @param hash Hash of the scan
     * @returns PDF Buffer
     */
    async generatePdfReport(hash) {
        const formData = new URLSearchParams();
        formData.append('hash', hash);
        const config = {
            url: `${this.baseUrl}/api/v1/download_pdf`,
            method: 'POST',
            headers: {
                'Authorization': this.apiKey,
                'X-Mobsf-Api-Key': this.apiKey,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/pdf'
            },
            data: formData.toString(),
            responseType: 'arraybuffer'
        };
        try {
            const response = await (0, axios_1.default)(config);
            return Buffer.from(response.data);
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                const errorData = error.response?.data ? JSON.stringify(error.response.data, null, 2) : error.message;
                throw new Error(`MobSF API Error: ${errorData}`);
            }
            throw error;
        }
    }
    /**
     * View source files by hash, file path, and type
     * @param hash Hash of the scan
     * @param file Relative file path
     * @param type File type (apk/ipa/studio/eclipse/ios)
     * @returns Source file content as a string
     */
    async viewSource(hash, file, type) {
        const formData = new URLSearchParams();
        formData.append('hash', hash);
        formData.append('file', file);
        formData.append('type', type);
        const config = {
            url: `${this.baseUrl}/api/v1/view_source`,
            method: 'POST',
            headers: {
                'Authorization': this.apiKey,
                'X-Mobsf-Api-Key': this.apiKey,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: formData.toString()
        };
        return this.sendRequest(config);
    }
    /**
     * Get scan tasks queue (async scan queue must be enabled)
     * @returns Scan tasks queue as a string
     */
    async getScanTasks() {
        const config = {
            url: `${this.baseUrl}/api/v1/tasks`,
            method: 'POST',
            headers: {
                'Authorization': this.apiKey,
                'X-Mobsf-Api-Key': this.apiKey,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        return this.sendRequest(config);
    }
    /**
     * Compare scan results by two hashes
     * @param hash1 First scan hash
     * @param hash2 Second scan hash to compare with
     * @returns Comparison result as a string
     */
    async compareApps(hash1, hash2) {
        const formData = new URLSearchParams();
        formData.append('hash1', hash1);
        formData.append('hash2', hash2);
        const config = {
            url: `${this.baseUrl}/api/v1/compare`,
            method: 'POST',
            headers: {
                'Authorization': this.apiKey,
                'X-Mobsf-Api-Key': this.apiKey,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: formData.toString()
        };
        return this.sendRequest(config);
    }
    /**
     * Suppress findings by rule id
     * @param hash Hash of the scan
     * @param type code or manifest
     * @param rule Rule id
     * @returns Suppress result as a string
     */
    async suppressByRule(hash, type, rule) {
        const formData = new URLSearchParams();
        formData.append('hash', hash);
        formData.append('type', type);
        formData.append('rule', rule);
        const config = {
            url: `${this.baseUrl}/api/v1/suppress_by_rule`,
            method: 'POST',
            headers: {
                'Authorization': this.apiKey,
                'X-Mobsf-Api-Key': this.apiKey,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: formData.toString()
        };
        return this.sendRequest(config);
    }
    /**
     * Suppress findings by files
     * @param hash Hash of the scan
     * @param type code
     * @param rule Rule id
     * @returns Suppress result as a string
     */
    async suppressByFiles(hash, type, rule) {
        const formData = new URLSearchParams();
        formData.append('hash', hash);
        formData.append('type', type);
        formData.append('rule', rule);
        const config = {
            url: `${this.baseUrl}/api/v1/suppress_by_files`,
            method: 'POST',
            headers: {
                'Authorization': this.apiKey,
                'X-Mobsf-Api-Key': this.apiKey,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: formData.toString()
        };
        return this.sendRequest(config);
    }
    /**
     * View suppressions associated with a scan
     * @param hash Hash of the scan
     * @returns Suppressions as a string
     */
    async listSuppressions(hash) {
        const formData = new URLSearchParams();
        formData.append('hash', hash);
        const config = {
            url: `${this.baseUrl}/api/v1/list_suppressions`,
            method: 'POST',
            headers: {
                'Authorization': this.apiKey,
                'X-Mobsf-Api-Key': this.apiKey,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: formData.toString()
        };
        return this.sendRequest(config);
    }
    /**
     * Delete suppressions
     * @param hash Hash of the scan
     * @param type code or manifest
     * @param rule Rule id
     * @param kind rule or file
     * @returns Delete result as a string
     */
    async deleteSuppression(hash, type, rule, kind) {
        const formData = new URLSearchParams();
        formData.append('hash', hash);
        formData.append('type', type);
        formData.append('rule', rule);
        formData.append('kind', kind);
        const config = {
            url: `${this.baseUrl}/api/v1/delete_suppression`,
            method: 'POST',
            headers: {
                'Authorization': this.apiKey,
                'X-Mobsf-Api-Key': this.apiKey,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: formData.toString()
        };
        return this.sendRequest(config);
    }
}
exports.MobSFClient = MobSFClient;
const createMobSFClient = (baseUrl, apiKey) => {
    return new MobSFClient(baseUrl, apiKey);
};
exports.createMobSFClient = createMobSFClient;
