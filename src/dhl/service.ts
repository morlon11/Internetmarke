import axios from 'axios';
import { PostageRequest } from './types.js';

export async function purchasePostage(
  requestData: PostageRequest,
): Promise<string[]> {
  try {
    const response = await axios.post(
      'https://api.deutschepost.de/internetmarke/v1/purchase',
      requestData,
    );

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
