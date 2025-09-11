/**
 * @file credentials.ts
 * @description Centralized handling of authentication credentials, retrieved from environment variables.
 */

import { AuthCredentials } from './dhl/auth.types.js';

/**
 * Retrieves authentication credentials from environment variables.
 * This function should be called after environment variables are loaded (e.g., via dotenv.config()).
 * @returns {AuthCredentials} The authentication credentials object.
 */
export function getCredentials(): AuthCredentials {
  return {
    grant_type: 'client_credentials',
    client_id: process.env.DHL_CLIENT_ID || '',
    client_secret: process.env.DHL_CLIENT_SECRET || '',
    username: process.env.DHL_USERNAME || '',
    password: process.env.DHL_PASSWORD || '',
  };
}
