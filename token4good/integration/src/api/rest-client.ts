import fetch from 'node-fetch';
import { ConfigManager } from '../config/environment';
import { 
  ApiResponse, 
  RgbAsset, 
  LightningPayment, 
  HybridPayment, 
  Certificate 
} from '../types';

export class Token4GoodRestClient {
  private config;
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.config = ConfigManager.getInstance().getToken4GoodConfig();
    this.baseUrl = this.config.baseUrl;
    this.apiKey = this.config.apiKey;
  }

  private async makeRequest<T>(
    endpoint: string, 
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: any
  ): Promise<ApiResponse<T>> {
    try {
      const headers: Record<string, string> = {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Daznode-T4G-Integration/1.0.0'
      };

      const options: any = {
        method,
        headers
      };

      if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, options);
      const result = await response.json() as any;

      if (!response.ok) {
        return {
          success: false,
          error: result.error || `HTTP ${response.status}: ${response.statusText}`
        };
      }

      return {
        success: true,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // ==================== ASSET MANAGEMENT ====================

  async issueEducationalToken(params: {
    name: string;
    ticker: string;
    amount: number;
    precision: number;
    description?: string;
  }): Promise<ApiResponse<RgbAsset>> {
    return this.makeRequest<RgbAsset>('/api/assets/issue/fungible', 'POST', params);
  }

  async issueEducationalNFT(params: {
    name: string;
    description: string;
    metadata_uri: string;
    recipient?: string;
  }): Promise<ApiResponse<RgbAsset>> {
    return this.makeRequest<RgbAsset>('/api/assets/issue/nft', 'POST', params);
  }

  async issueCertificate(params: {
    studentId: string;
    courseName: string;
    completionData: {
      grade: string;
      completionDate: string;
      instructor: string;
      skills: string[];
    };
    certificateType: 'completion' | 'achievement' | 'specialization';
  }): Promise<ApiResponse<Certificate>> {
    const certParams = {
      name: `Certificate: ${params.courseName}`,
      description: `${params.certificateType} certificate for student ${params.studentId}`,
      metadata_uri: `https://certificates.daznode.com/${params.studentId}_${Date.now()}.json`,
      recipient: params.studentId,
      metadata: params.completionData
    };

    return this.makeRequest<Certificate>('/api/assets/issue/certificate', 'POST', certParams);
  }

  async getAssetInfo(contractId: string): Promise<ApiResponse<RgbAsset>> {
    return this.makeRequest<RgbAsset>(`/api/assets/${contractId}`);
  }

  async listAssets(filters?: {
    type?: 'fungible' | 'nft' | 'certificate';
    owner?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<RgbAsset[]>> {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/api/assets${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.makeRequest<RgbAsset[]>(endpoint);
  }

  // ==================== PAYMENT PROCESSING ====================

  async createRgbInvoice(params: {
    contract_id: string;
    amount: number;
    description: string;
    expiry_minutes?: number;
    recipient?: string;
  }): Promise<ApiResponse<{
    rgb_invoice: string;
    invoice_id: string;
    expires_at: string;
  }>> {
    return this.makeRequest('/api/invoices/rgb', 'POST', params);
  }

  async createLightningInvoice(params: {
    amount_msats: number;
    description: string;
    expiry_seconds?: number;
    recipient?: string;
  }): Promise<ApiResponse<LightningPayment>> {
    return this.makeRequest<LightningPayment>('/api/invoices/lightning', 'POST', params);
  }

  async createHybridInvoice(params: {
    contract_id: string;
    rgb_amount: number;
    ln_amount_msats: number;
    description: string;
    expiry_minutes?: number;
  }): Promise<ApiResponse<HybridPayment>> {
    return this.makeRequest<HybridPayment>('/api/invoices/hybrid', 'POST', params);
  }

  async processRgbTransfer(params: {
    contract_id: string;
    amount: number;
    recipient_invoice: string;
    description?: string;
  }): Promise<ApiResponse<{
    transfer_id: string;
    status: 'pending' | 'completed' | 'failed';
    tx_id?: string;
  }>> {
    return this.makeRequest('/api/assets/transfer', 'POST', params);
  }

  async processLightningPayment(params: {
    invoice: string;
    amount_msats?: number;
    timeout_seconds?: number;
  }): Promise<ApiResponse<{
    payment_id: string;
    status: 'pending' | 'completed' | 'failed';
    preimage?: string;
  }>> {
    return this.makeRequest('/api/lightning/pay', 'POST', params);
  }

  async getPaymentStatus(paymentId: string, type: 'rgb' | 'lightning' | 'hybrid'): Promise<ApiResponse<{
    id: string;
    status: 'pending' | 'completed' | 'failed';
    amount: number;
    created_at: string;
    completed_at?: string;
  }>> {
    return this.makeRequest(`/api/payments/${type}/${paymentId}`);
  }

  // ==================== CHANNEL MANAGEMENT ====================

  async openRgbLightningChannel(params: {
    peer_node_id: string;
    capacity_sats: number;
    rgb_contracts?: string[];
    push_amount_sats?: number;
  }): Promise<ApiResponse<{
    channel_id: string;
    status: 'opening' | 'active' | 'closed';
    capacity: number;
    balance_local: number;
    balance_remote: number;
  }>> {
    return this.makeRequest('/api/channels/open', 'POST', params);
  }

  async listChannels(): Promise<ApiResponse<Array<{
    channel_id: string;
    peer_node_id: string;
    capacity: number;
    balance_local: number;
    balance_remote: number;
    status: string;
    rgb_contracts: string[];
  }>>> {
    return this.makeRequest('/api/channels/list');
  }

  async closeChannel(channelId: string, force: boolean = false): Promise<ApiResponse<{
    closing_tx_id: string;
    status: 'closing' | 'closed';
  }>> {
    return this.makeRequest(`/api/channels/${channelId}/close`, 'POST', { force });
  }

  // ==================== TOKEN4GOOD STREAMING PAYMENTS ====================

  async createPaymentStream(params: {
    payer: string;
    ratePerSecond: number;
    maxDuration: number;
    autoClose?: boolean;
  }): Promise<ApiResponse<{
    streamId: string;
    status: 'active' | 'paused' | 'completed';
    ratePerSecond: number;
    maxDuration: number;
  }>> {
    return this.makeRequest('/api/payments/stream/create', 'POST', params);
  }

  async controlPaymentStream(streamId: string, action: 'pause' | 'resume' | 'close'): Promise<ApiResponse<{
    streamId: string;
    status: string;
    totalPaid: number;
  }>> {
    return this.makeRequest(`/api/payments/stream/${streamId}/${action}`, 'POST');
  }
}