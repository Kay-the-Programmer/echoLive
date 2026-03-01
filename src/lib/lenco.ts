
/**
 * Lenco API Client (by Broadpay Zambia)
 * Documentation: https://docs.broadpay.co.zm/ (Hypothetical/Inferred)
 */

const LENCO_API_BASE_URL = 'https://api.lenco.co/v1'; // Adjust base URL as per actual docs

export interface LencoCollectionRequest {
    amount: number;
    currency: 'ZMW';
    external_reference: string;
    phone_number: string;
    narration: string;
    customer: {
        name: string;
        email?: string;
    };
}

export interface LencoCollectionResponse {
    status: 'success' | 'failed' | 'pending';
    message: string;
    data?: {
        reference: string;
        status: string;
    };
}

export interface LencoPayoutRequest {
    amount: number;
    currency: 'ZMW';
    external_reference: string;
    phone_number: string;
    narration: string;
    bank_code?: string; // For bank transfers
}

export class LencoClient {
    private apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const response = await fetch(`${LENCO_API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `Lenco API error: ${response.statusText}`);
        }

        return data as T;
    }

    /**
     * Initiate a Mobile Money collection request.
     * This typically triggers a STK Push (USSD Prompt) on the user's phone.
     */
    async initiateMobileMoneyCollection(payload: LencoCollectionRequest): Promise<LencoCollectionResponse> {
        return this.request<LencoCollectionResponse>('/collections/mobile-money', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    }

    /**
     * Check the status of a collection or payout.
     */
    async getTransactionStatus(reference: string): Promise<any> {
        return this.request<any>(`/transactions/${reference}`, {
            method: 'GET',
        });
    }

    /**
     * Initiate a Payout (Mobile Money or Bank).
     */
    async initiatePayout(payload: LencoPayoutRequest): Promise<any> {
        return this.request<any>('/payouts', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    }
}

// Export a singleton or helper to get the client
export const getLencoClient = () => {
    const apiKey = process.env.LENCO_API_KEY;
    if (!apiKey) {
        throw new Error('LENCO_API_KEY is not defined in environment variables.');
    }
    return new LencoClient(apiKey);
};

// Conversion Utility
export const ZMW_TO_COIN_RATE = 320; // 1 ZMW = 320 Coins (approx $1 = 25 ZMW = 8000 Coins)
export const COIN_TO_ZMW_RATE = 1 / ZMW_TO_COIN_RATE;
