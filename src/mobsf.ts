import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import FormData from 'form-data';
import fs from 'fs';


export class MobSFClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    this.apiKey = apiKey;
  }

  private createRequestConfig(
    path: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: any,
    headers?: Record<string, string>,
    params?: Record<string, any>
  ): AxiosRequestConfig {
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

  private async sendRequest<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios(config);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
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
  public async uploadFile(filePath: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));

    // When using FormData, we need to let Axios handle the Content-Type
    // to ensure proper multipart/form-data boundaries
    const config: AxiosRequestConfig = {
      url: `${this.baseUrl}/api/v1/upload`,
      method: 'POST',
      headers: {
        'Authorization': this.apiKey,
        'X-Mobsf-Api-Key': this.apiKey,
        ...formData.getHeaders()
      },
      data: formData
    };

    return this.sendRequest<string>(config);
  }

  /**
 * Get scan logs for a specific file
 * @param hash Hash of the file to get logs for
 * @returns Scan logs as a string
 */
  public async getScanLogs(hash: string): Promise<string> {
    const formData = new URLSearchParams();
    formData.append('hash', hash);

    const config: AxiosRequestConfig = {
      url: `${this.baseUrl}/api/v1/scan_logs`,
      method: 'POST',
      headers: {
        'Authorization': this.apiKey,
        'X-Mobsf-Api-Key': this.apiKey,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: formData.toString()
    };

    return this.sendRequest<string>(config);
  }

  /**
   * Generate a detailed JSON report for a scanned file
   * @param hash Hash of the file to generate a report for
   * @returns Detailed JSON report
   */
  public async generateJsonReport(hash: string): Promise<string> {
    const formData = new URLSearchParams();
    formData.append('hash', hash);

    const config: AxiosRequestConfig = {
      url: `${this.baseUrl}/api/v1/report_json`,
      method: 'POST',
      headers: {
        'Authorization': this.apiKey,
        'X-Mobsf-Api-Key': this.apiKey,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: formData.toString()
    };

    return this.sendRequest<string>(config);
  }

  /**
   * Get a list of recent scans
   * @param page Page number for pagination
   * @param pageSize Number of items per page
   * @returns List of recent scans with pagination info
   */
  public async getRecentScans(page: number = 1, pageSize: number = 10): Promise<string> {
    const config = this.createRequestConfig(
      '/api/v1/scans',
      'GET',
      undefined,
      {
        'Authorization': this.apiKey,
        'X-Mobsf-Api-Key': this.apiKey
      },
      {
        page,
        page_size: pageSize
      }
    );

    return this.sendRequest<string>(config);
  }

  /**
   * Search scan results by hash, app name, package name, or file name
   * @param query Hash, app name, package name, or file name to search
   * @returns Search result as a string
   */
  public async searchScanResult(query: string): Promise<string> {
    const formData = new URLSearchParams();
    formData.append('query', query);

    const config: AxiosRequestConfig = {
      url: `${this.baseUrl}/api/v1/search`,
      method: 'POST',
      headers: {
        'Authorization': this.apiKey,
        'X-Mobsf-Api-Key': this.apiKey,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: formData.toString()
    };

    return this.sendRequest<string>(config);
  }

  /**
   * Delete scan results by hash
   * @param hash Hash of the scan to delete
   * @returns Delete result as a string
   */
  public async deleteScan(hash: string): Promise<string> {
    const formData = new URLSearchParams();
    formData.append('hash', hash);

    const config: AxiosRequestConfig = {
      url: `${this.baseUrl}/api/v1/delete_scan`,
      method: 'POST',
      headers: {
        'Authorization': this.apiKey,
        'X-Mobsf-Api-Key': this.apiKey,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: formData.toString()
    };

    return this.sendRequest<string>(config);
  }

  /**
   * Get MobSF Application Security Scorecard by hash
   * @param hash Hash of the scan
   * @returns Scorecard result as a string
   */
  public async getScorecard(hash: string): Promise<string> {
    const formData = new URLSearchParams();
    formData.append('hash', hash);

    const config: AxiosRequestConfig = {
      url: `${this.baseUrl}/api/v1/scorecard`,
      method: 'POST',
      headers: {
        'Authorization': this.apiKey,
        'X-Mobsf-Api-Key': this.apiKey,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: formData.toString()
    };

    return this.sendRequest<string>(config);
  }

  /**
   * Generate PDF Report by hash
   * @param hash Hash of the scan
   * @returns PDF Buffer
   */
  public async generatePdfReport(hash: string): Promise<Buffer> {
    const formData = new URLSearchParams();
    formData.append('hash', hash);

    const config: AxiosRequestConfig = {
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
      const response = await axios(config);
      return Buffer.from(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
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
  public async viewSource(hash: string, file: string, type: string): Promise<string> {
    const formData = new URLSearchParams();
    formData.append('hash', hash);
    formData.append('file', file);
    formData.append('type', type);

    const config: AxiosRequestConfig = {
      url: `${this.baseUrl}/api/v1/view_source`,
      method: 'POST',
      headers: {
        'Authorization': this.apiKey,
        'X-Mobsf-Api-Key': this.apiKey,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: formData.toString()
    };

    return this.sendRequest<string>(config);
  }

  /**
   * Get scan tasks queue (async scan queue must be enabled)
   * @returns Scan tasks queue as a string
   */
  public async getScanTasks(): Promise<string> {
    const config: AxiosRequestConfig = {
      url: `${this.baseUrl}/api/v1/tasks`,
      method: 'POST',
      headers: {
        'Authorization': this.apiKey,
        'X-Mobsf-Api-Key': this.apiKey,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    return this.sendRequest<string>(config);
  }

  /**
   * Compare scan results by two hashes
   * @param hash1 First scan hash
   * @param hash2 Second scan hash to compare with
   * @returns Comparison result as a string
   */
  public async compareApps(hash1: string, hash2: string): Promise<string> {
    const formData = new URLSearchParams();
    formData.append('hash1', hash1);
    formData.append('hash2', hash2);

    const config: AxiosRequestConfig = {
      url: `${this.baseUrl}/api/v1/compare`,
      method: 'POST',
      headers: {
        'Authorization': this.apiKey,
        'X-Mobsf-Api-Key': this.apiKey,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: formData.toString()
    };

    return this.sendRequest<string>(config);
  }

  /**
   * Suppress findings by rule id
   * @param hash Hash of the scan
   * @param type code or manifest
   * @param rule Rule id
   * @returns Suppress result as a string
   */
  public async suppressByRule(hash: string, type: string, rule: string): Promise<string> {
    const formData = new URLSearchParams();
    formData.append('hash', hash);
    formData.append('type', type);
    formData.append('rule', rule);

    const config: AxiosRequestConfig = {
      url: `${this.baseUrl}/api/v1/suppress_by_rule`,
      method: 'POST',
      headers: {
        'Authorization': this.apiKey,
        'X-Mobsf-Api-Key': this.apiKey,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: formData.toString()
    };

    return this.sendRequest<string>(config);
  }

  /**
   * Suppress findings by files
   * @param hash Hash of the scan
   * @param type code
   * @param rule Rule id
   * @returns Suppress result as a string
   */
  public async suppressByFiles(hash: string, type: string, rule: string): Promise<string> {
    const formData = new URLSearchParams();
    formData.append('hash', hash);
    formData.append('type', type);
    formData.append('rule', rule);

    const config: AxiosRequestConfig = {
      url: `${this.baseUrl}/api/v1/suppress_by_files`,
      method: 'POST',
      headers: {
        'Authorization': this.apiKey,
        'X-Mobsf-Api-Key': this.apiKey,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: formData.toString()
    };

    return this.sendRequest<string>(config);
  }

  /**
   * View suppressions associated with a scan
   * @param hash Hash of the scan
   * @returns Suppressions as a string
   */
  public async listSuppressions(hash: string): Promise<string> {
    const formData = new URLSearchParams();
    formData.append('hash', hash);

    const config: AxiosRequestConfig = {
      url: `${this.baseUrl}/api/v1/list_suppressions`,
      method: 'POST',
      headers: {
        'Authorization': this.apiKey,
        'X-Mobsf-Api-Key': this.apiKey,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: formData.toString()
    };

    return this.sendRequest<string>(config);
  }

  /**
   * Delete suppressions
   * @param hash Hash of the scan
   * @param type code or manifest
   * @param rule Rule id
   * @param kind rule or file
   * @returns Delete result as a string
   */
  public async deleteSuppression(hash: string, type: string, rule: string, kind: string): Promise<string> {
    const formData = new URLSearchParams();
    formData.append('hash', hash);
    formData.append('type', type);
    formData.append('rule', rule);
    formData.append('kind', kind);

    const config: AxiosRequestConfig = {
      url: `${this.baseUrl}/api/v1/delete_suppression`,
      method: 'POST',
      headers: {
        'Authorization': this.apiKey,
        'X-Mobsf-Api-Key': this.apiKey,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: formData.toString()
    };

    return this.sendRequest<string>(config);
  }
}

export const createMobSFClient = (baseUrl: string, apiKey: string): MobSFClient => {
  return new MobSFClient(baseUrl, apiKey);
};