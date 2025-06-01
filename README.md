# MobSF-MCP 

Architecture based on [https://github.com/GH05TCREW/mobsf-mcp](https://github.com/GH05TCREW/mobsf-mcp)

## 📑 Overview

MobSF MCP is a Node.js-based Model Context Protocol implementation for Mobile Security Framework (MobSF). It provides a standardized interface for integrating MobSF's security analysis capabilities into automated workflows and third-party tools.

## 🛠️ Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- Running instance of [MobSF](https://github.com/MobSF/Mobile-Security-Framework-MobSF) with API access 
---

## ⚙️ Installation  And Usage

Clone the repository or navigate to the mobsf-mcp directory, and install dependencies:

```bash
npm install -g mobsf-mcp
```

Configure environment variables and start the MobSF MCP server by using the npx command:

> 📚 Open PowerShell as an administrator
```bash
$env:MOBSF_URL="http://localhost:8000"; 
$env:MOBSF_API_KEY="your_api_key_here"; 
npx mobsf-mcp
```


## 📂 API Reference

### Available Endpoints

| Endpoint | Description | Parameters |
|----------|-------------|------------|
| `uploadFile` | Upload a mobile application file (APK, IPA, or APPX) for security analysis | `file`: File path to upload |
| `getScanLogs` | Retrieve detailed scan logs for analyzed application | `hash`: MD5 hash of the scan |
| `getJsonReport` | Get full JSON security analysis report | `hash`: MD5 hash of the scan |
| `getJsonReportSection` | Get specific section of the report | `hash`: MD5 hash, `section`: Section name |
| `getJsonReportSections` | List all available report sections | `hash`: MD5 hash of the scan |
| `getRecentScans` | Retrieve list of recent security scans | `page`: Page number, `pageSize`: Results per page |
| `searchScanResult` | Search scan results by various criteria | `query`: Search term (hash/name/package) |
| `deleteScan` | Delete scan results | `hash`: MD5 hash of the scan |
| `getScorecard` | Get application security scorecard | `hash`: MD5 hash of the scan |
| `generatePdfReport` | Generate PDF security report | `hash`: MD5 hash of the scan |
| `viewSource` | View source files from analysis | `hash`: MD5 hash, `file`: File path, `type`: File type |
| `getScanTasks` | Get scan tasks queue (async scan queue) | None |
| `compareApps` | Compare two scan results | `hash1`: First scan hash, `hash2`: Second scan hash |
| `suppressByRule` | Suppress findings by rule ID | `hash`: MD5 hash, `type`: code/manifest, `rule`: Rule ID |
| `suppressByFiles` | Suppress findings by files | `hash`: MD5 hash, `type`: code, `rule`: Rule ID |
| `listSuppressions` | View scan suppressions | `hash`: MD5 hash of the scan |
| `deleteSuppression` | Delete suppressions | `hash`: MD5 hash, `type`: code/manifest, `rule`: Rule ID, `kind`: rule/file |
| `listAllHashes` | Get all report MD5 hash values | `page`: Page number, `pageSize`: Results per page |

### JSON Report Sections

The following sections are available when using `getJsonReportSection`:

#### Basic Information
- `version`: MobSF version
- `title`: Report title
- `file_name`: Analyzed file name
- `app_name`: Application name
- `app_type`: Application type
- `size`: File size
- `md5`, `sha1`, `sha256`: File hashes
- `package_name`: Application package name

#### Application Components
- `main_activity`: Main activity name
- `exported_activities`: List of exported activities
- `browsable_activities`: List of browsable activities
- `activities`: All activities
- `receivers`: Broadcast receivers
- `providers`: Content providers
- `services`: Services
- `libraries`: Native libraries

#### Security Analysis
- `target_sdk`, `max_sdk`, `min_sdk`: SDK versions
- `version_name`, `version_code`: App version info
- `permissions`: Declared permissions
- `malware_permissions`: Potentially dangerous permissions
- `certificate_analysis`: Certificate security analysis
- `manifest_analysis`: AndroidManifest.xml analysis
- `network_security`: Network security configuration
- `binary_analysis`: Binary file analysis
- `code_analysis`: Source code security analysis
- `niap_analysis`: NIAP compliance analysis

#### Additional Analysis
- `permission_mapping`: Permission usage mapping
- `urls`, `domains`, `emails`: Extracted strings
- `firebase_urls`: Firebase URL analysis
- `exported_count`: Count of exported components
- `apkid`: APK identifier information
- `behaviour`: Application behavior analysis
- `trackers`: Tracking libraries detection
- `playstore_details`: Google Play Store details
- `secrets`: Detected secrets/keys
- `logs`: Analysis logs
- `sbom`: Software Bill of Materials
- `average_cvss`: Average CVSS score
- `appsec`: Application security score
- `virus_total`: VirusTotal scan results

### 🖥️ VSCode Cline Extension Configuration

To use this project with the [cline](https://marketplace.visualstudio.com/items?itemName=cline-tools.cline) extension in VSCode, add the following configuration to your cline configuration file:

```json
{
  "mcpServers": {
    "MobSF MCP Server": {
      "disabled": false,
      "timeout": 60,
      "command": "Nodejs\\node.exe",
      "args": [
        "index.js"
      ],
      "env": {
        "MOBSF_URL": "http://localhost:8000",
        "MOBSF_API_KEY": "your_api_key_here"
      },
      "transportType": "stdio"
    }
  }
}
```

> ⚠️  Path to your Node.js executable (adjust according to your system, e.g., `C:\\Program Files\\nodejs\\node.exe`).
> Make sure to fill in your actual `MOBSF_API_KEY` in the configuration.

## ⚠️ Disclaimer and Legal Notice

This tool is designed and provided for security researchers, penetration testers, and developers for **LEGAL USE ONLY**. The primary purpose is to assist in:
- Security assessment of your own applications
- Applications you have explicit permission to test
- Research and educational purposes

The following uses are strictly prohibited:
- Any malicious or harmful activities
- Unauthorized access to systems or data
- Testing applications without proper authorization
- Any illegal activities or violation of laws

By using this tool, you agree to:
1. Use it only for legal and authorized purposes
2. Take full responsibility for your actions
3. Comply with all applicable laws and regulations
4. Hold the developers and contributors harmless from any claims

## 📄 License

This project is licensed under the Apache 2.0 License - see the LICENSE file for details.

## ✨ Acknowledgments

- [Mobile Security Framework (MobSF)](https://github.com/MobSF/Mobile-Security-Framework-MobSF)
- [gc-mobsf-mcp](https://github.com/GH05TCREW/mobsf-mcp) 