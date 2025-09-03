import axios from 'axios';

interface PostageRequest {
    recipient: {
        name: string;
        street: string;
        zip: string;
        city: string;
    };
    packageDetails: {
        weight: number;
        length: number;
        width: number;
        height: number;
    };
}

export async function purchasePostage(requestData: PostageRequest): Promise<string[]> {
    try {
        const response = await axios.post('https://api.deutschepost.de/internetmarke/v1/purchase', requestData);

        if (response.data && response.data.trackingNumbers) {
            return response.data.trackingNumbers;
        }

        throw new Error('Invalid response from Deutsche Post API.');

    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(`DHL API Error: ${error.message}`);
        }
        throw new Error(`An unexpected error occurred during the API call.`);
    }
}