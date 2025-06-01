#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const zod_1 = require("zod");
const mobsf_1 = require("./mobsf");
// Get MobSF configuration from environment variables instead of arguments
const baseUrl = process.env.MOBSF_URL;
const apiKey = process.env.MOBSF_API_KEY;
if (!baseUrl) {
    console.error("MOBSF_URL environment variable not set");
    process.exit(1);
}
if (!apiKey) {
    console.error("MOBSF_API_KEY environment variable not set");
    process.exit(1);
}
// Create MobSF client
const mobsfClient = (0, mobsf_1.createMobSFClient)(baseUrl, apiKey);
// Create server instance
const server = new mcp_js_1.McpServer({
    name: "mobsf",
    version: "1.1.2",
});
server.tool("uploadFile", "Upload a mobile application file (APK, IPA, or APPX) to MobSF for security analysis. This is the first step before scanning and must be done prior to using other analysis functions.", {
    file: zod_1.z.string().describe("Upload file path"),
}, async ({ file }) => {
    // Handle process completion
    return new Promise((resolve, reject) => {
        mobsfClient.uploadFile(file).then(result => {
            resolve({
                content: [{
                        type: "text",
                        text: JSON.stringify(result, null, 2),
                    }]
            });
        }).catch(error => {
            reject(error);
        });
    });
});
server.tool("getScanLogs", "Retrieve detailed scan logs for a previously analyzed mobile application using its hash value. These logs contain information about the scanning process and any issues encountered.", {
    hash: zod_1.z.string().describe("Hash file to getting scan logs"),
}, async ({ hash }) => {
    // Handle process completion
    return new Promise((resolve, reject) => {
        mobsfClient.getScanLogs(hash).then(result => {
            resolve({
                content: [{
                        type: "text",
                        text: JSON.stringify(result, null, 2),
                    }]
            });
        }).catch(error => {
            reject(error);
        });
    });
});
server.tool("getJsonReport", "Generate and retrieve a comprehensive security analysis report in JSON format for a scanned mobile application. This report includes detailed findings about security vulnerabilities, permissions, API calls, and other security-relevant information.", {
    hash: zod_1.z.string().describe("Hash file to getting scan logs"),
}, async ({ hash }) => {
    // Handle process completion
    return new Promise((resolve, reject) => {
        mobsfClient.generateJsonReport(hash).then(result => {
            resolve({
                content: [{
                        type: "text",
                        text: JSON.stringify(result, null, 2),
                    }]
            });
        }).catch(error => {
            reject(error);
        });
    });
});
server.tool("getJsonReportSection", "Get a specific section of the MobSF JSON report by hash and section name.", {
    hash: zod_1.z.string().describe("Hash of the scan"),
    section: zod_1.z.string().describe("Section name, e.g. permissions, android_api, security_analysis, etc."),
}, async ({ hash, section }) => {
    return new Promise((resolve, reject) => {
        mobsfClient.generateJsonReport(hash).then(result => {
            let data = typeof result === 'string' ? JSON.parse(result) : result;
            let sectionData = data[section];
            if (!sectionData) {
                resolve({
                    content: [{
                            type: "text",
                            text: `Section '${section}' not found in report.`,
                        }]
                });
            }
            else {
                resolve({
                    content: [{
                            type: "text",
                            text: JSON.stringify(sectionData, null, 2),
                        }]
                });
            }
        }).catch(error => {
            reject(error);
        });
    });
});
server.tool("getJsonReportSections", "Get all top-level section names of the MobSF JSON report.", {
    hash: zod_1.z.string().describe("Hash of the scan"),
}, async ({ hash }) => {
    return new Promise((resolve, reject) => {
        mobsfClient.generateJsonReport(hash).then(result => {
            let data = typeof result === 'string' ? JSON.parse(result) : result;
            let sections = Object.keys(data);
            resolve({
                content: [{
                        type: "text",
                        text: JSON.stringify(sections, null, 2),
                    }]
            });
        }).catch(error => {
            reject(error);
        });
    });
});
server.tool("getRecentScans", "Retrieve a list of recently performed security scans on the MobSF server, showing mobile applications that have been analyzed, their statuses, and basic scan information.", {
    page: zod_1.z.number().describe("Page number for result"),
    pageSize: zod_1.z.number().describe("Page size for result"),
}, async ({ page, pageSize }) => {
    // Handle process completion
    return new Promise((resolve, reject) => {
        mobsfClient.getRecentScans(page, pageSize).then(result => {
            resolve({
                content: [{
                        type: "text",
                        text: JSON.stringify(result, null, 2),
                    }]
            });
        }).catch(error => {
            reject(error);
        });
    });
});
server.tool("searchScanResult", "Search scan results by hash, app name, package name, or file name.", {
    query: zod_1.z.string().describe("Hash, app name, package name, or file name to search"),
}, async ({ query }) => {
    return new Promise((resolve, reject) => {
        mobsfClient.searchScanResult(query).then(result => {
            resolve({
                content: [{
                        type: "text",
                        text: JSON.stringify(result, null, 2),
                    }]
            });
        }).catch(error => {
            reject(error);
        });
    });
});
server.tool("deleteScan", "Delete scan results by hash.", {
    hash: zod_1.z.string().describe("Hash of the scan to delete"),
}, async ({ hash }) => {
    return new Promise((resolve, reject) => {
        mobsfClient.deleteScan(hash).then(result => {
            resolve({
                content: [{
                        type: "text",
                        text: JSON.stringify(result, null, 2),
                    }]
            });
        }).catch(error => {
            reject(error);
        });
    });
});
server.tool("getScorecard", "Get MobSF Application Security Scorecard by hash.", {
    hash: zod_1.z.string().describe("Hash of the scan to get scorecard"),
}, async ({ hash }) => {
    return new Promise((resolve, reject) => {
        mobsfClient.getScorecard(hash).then(result => {
            resolve({
                content: [{
                        type: "text",
                        text: JSON.stringify(result, null, 2),
                    }]
            });
        }).catch(error => {
            reject(error);
        });
    });
});
server.tool("generatePdfReport", "Generate PDF security report by hash. Returns PDF as base64 string.", {
    hash: zod_1.z.string().describe("Hash of the scan to generate PDF report"),
}, async ({ hash }) => {
    return new Promise((resolve, reject) => {
        mobsfClient.generatePdfReport(hash).then(buffer => {
            resolve({
                content: [{
                        type: "resource",
                        resource: {
                            uri: `mobsf_report_${hash}.pdf`,
                            blob: buffer.toString('base64'),
                            mimeType: "application/pdf"
                        }
                    }]
            });
        }).catch(error => {
            reject(error);
        });
    });
});
server.tool("viewSource", "View source files by hash, file path, and type.", {
    hash: zod_1.z.string().describe("Hash of the scan"),
    file: zod_1.z.string().describe("Relative file path"),
    type: zod_1.z.string().describe("File type (apk/ipa/studio/eclipse/ios)"),
}, async ({ hash, file, type }) => {
    return new Promise((resolve, reject) => {
        mobsfClient.viewSource(hash, file, type).then(result => {
            resolve({
                content: [{
                        type: "text",
                        text: typeof result === 'string' ? result : JSON.stringify(result, null, 2)
                    }]
            });
        }).catch(error => {
            reject(error);
        });
    });
});
server.tool("getScanTasks", "Get scan tasks queue (async scan queue must be enabled).", {}, async () => {
    return new Promise((resolve, reject) => {
        mobsfClient.getScanTasks().then(result => {
            resolve({
                content: [{
                        type: "text",
                        text: result,
                    }]
            });
        }).catch(error => {
            reject(error);
        });
    });
});
server.tool("compareApps", "Compare scan results by two hashes.", {
    hash1: zod_1.z.string().describe("First scan hash"),
    hash2: zod_1.z.string().describe("Second scan hash to compare with"),
}, async ({ hash1, hash2 }) => {
    return new Promise((resolve, reject) => {
        mobsfClient.compareApps(hash1, hash2).then(result => {
            resolve({
                content: [{
                        type: "text",
                        text: result,
                    }]
            });
        }).catch(error => {
            reject(error);
        });
    });
});
server.tool("suppressByRule", "Suppress findings by rule id.", {
    hash: zod_1.z.string().describe("Hash of the scan"),
    type: zod_1.z.string().describe("code or manifest"),
    rule: zod_1.z.string().describe("Rule id"),
}, async ({ hash, type, rule }) => {
    return new Promise((resolve, reject) => {
        mobsfClient.suppressByRule(hash, type, rule).then(result => {
            resolve({
                content: [{
                        type: "text",
                        text: typeof result === 'string' ? result : JSON.stringify(result, null, 2),
                    }]
            });
        }).catch(error => {
            reject(error);
        });
    });
});
server.tool("suppressByFiles", "Suppress findings by files.", {
    hash: zod_1.z.string().describe("Hash of the scan"),
    type: zod_1.z.string().describe("code"),
    rule: zod_1.z.string().describe("Rule id"),
}, async ({ hash, type, rule }) => {
    return new Promise((resolve, reject) => {
        mobsfClient.suppressByFiles(hash, type, rule).then(result => {
            resolve({
                content: [{
                        type: "text",
                        text: typeof result === 'string' ? result : JSON.stringify(result, null, 2),
                    }]
            });
        }).catch(error => {
            reject(error);
        });
    });
});
server.tool("listSuppressions", "View suppressions associated with a scan.", {
    hash: zod_1.z.string().describe("Hash of the scan"),
}, async ({ hash }) => {
    return new Promise((resolve, reject) => {
        mobsfClient.listSuppressions(hash).then(result => {
            resolve({
                content: [{
                        type: "text",
                        text: typeof result === 'string' ? result : JSON.stringify(result, null, 2),
                    }]
            });
        }).catch(error => {
            reject(error);
        });
    });
});
server.tool("deleteSuppression", "Delete suppressions.", {
    hash: zod_1.z.string().describe("Hash of the scan"),
    type: zod_1.z.string().describe("code or manifest"),
    rule: zod_1.z.string().describe("Rule id"),
    kind: zod_1.z.string().describe("rule or file"),
}, async ({ hash, type, rule, kind }) => {
    return new Promise((resolve, reject) => {
        mobsfClient.deleteSuppression(hash, type, rule, kind).then(result => {
            resolve({
                content: [{
                        type: "text",
                        text: typeof result === 'string' ? result : JSON.stringify(result, null, 2),
                    }]
            });
        }).catch(error => {
            reject(error);
        });
    });
});
server.tool("listAllHashes", "Get all report MD5 hash values.", {
    page: zod_1.z.number().describe("Page number for result"),
    pageSize: zod_1.z.number().describe("Page size for result"),
}, async ({ page, pageSize }) => {
    return new Promise((resolve, reject) => {
        mobsfClient.getRecentScans(page, pageSize).then(result => {
            let data = typeof result === 'string' ? JSON.parse(result) : result;
            let hashes = (data.content || []).map((item) => item.MD5);
            resolve({
                content: [{
                        type: "text",
                        text: JSON.stringify(hashes, null, 2),
                    }]
            });
        }).catch(error => {
            reject(error);
        });
    });
});
// 批量生成每个section的API
const jsonSections = [
    "version",
    "title",
    "file_name",
    "app_name",
    "app_type",
    "size",
    "md5",
    "sha1",
    "sha256",
    "package_name",
    "main_activity",
    "exported_activities",
    "browsable_activities",
    "activities",
    "receivers",
    "providers",
    "services",
    "libraries",
    "target_sdk",
    "max_sdk",
    "min_sdk",
    "version_name",
    "version_code",
    "permissions",
    "malware_permissions",
    "certificate_analysis",
    "manifest_analysis",
    "network_security",
    "binary_analysis",
    "file_analysis",
    "android_api",
    "code_analysis",
    "niap_analysis",
    "permission_mapping",
    "urls",
    "domains",
    "emails",
    "strings",
    "firebase_urls",
    "exported_count",
    "apkid",
    "behaviour",
    "trackers",
    "playstore_details",
    "secrets",
    "logs",
    "sbom",
    "average_cvss",
    "appsec",
    "virus_total",
    "base_url",
    "dwd_dir",
    "host_os",
];
jsonSections.forEach(section => {
    server.tool(`getJsonSection_${section}`, `Get the '${section}' section of the MobSF JSON report by hash.`, {
        hash: zod_1.z.string().describe("Hash of the scan"),
    }, async ({ hash }) => {
        return new Promise((resolve, reject) => {
            mobsfClient.generateJsonReport(hash).then(result => {
                let data = typeof result === 'string' ? JSON.parse(result) : result;
                let sectionData = data[section];
                resolve({
                    content: [{
                            type: "text",
                            text: JSON.stringify(sectionData, null, 2),
                        }]
                });
            }).catch(error => {
                reject(error);
            });
        });
    });
});
// Start the server
async function main() {
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
    console.error("MobSF MCP Server running on stdio");
}
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
