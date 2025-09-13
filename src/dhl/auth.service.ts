/**
 * @file auth.service.ts
 * @description A service to handle authentication with the Deutsche Post API.
 * It retrieves credentials from a central location.
 */

import axios, { AxiosResponse } from 'axios';
import { getCredentials } from '../credentials.js';

/**
 * @typedef {Object} AuthResponse
 * @property {string} access_token - The authentication token.
 * @property {string} token_type - The type of token (e.g., "Bearer").
 * @property {number} expires_in - The expiration time in seconds.
 */
type AuthResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

/**
 * Fetches an authentication token from the DHL API.
 * @returns {Promise<string | null>} The access token on success, otherwise null.
 */
export async function getAuthToken(): Promise<string | null> {
  const data = new URLSearchParams();
  data.append('grant_type', 'client_credentials');
  data.append('client_id', getCredentials().client_id);
  data.append('client_secret', getCredentials().client_secret);
  data.append('username', getCredentials().username);
  data.append('password', getCredentials().password);

  try {
    const response: AxiosResponse<AuthResponse> = await axios.post(
      'https://api-eu.dhl.com/post/de/shipping/im/v1/user',
      data,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
    return response.data.access_token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        'API authentication error:',
        error.response?.data || error.message,
      );
      console.log(data);
    } else {
      console.error('An unexpected error occurred:', error);
    }
    return null;
  }
}
