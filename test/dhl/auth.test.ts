import dotenv from 'dotenv';
import { getAuthToken } from '../../src/dhl/auth.service.js';
import { AuthCredentials } from '../../src/dhl/auth.types.js';

// global handler for unhandled promises
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

// Variables for authentication
dotenv.config();
const credentials: AuthCredentials = {
  grant_type: 'client_credentials',
  client_id: process.env.DHL_CLIENT_ID || '',
  client_secret: process.env.DHL_CLIENT_SECRET || '',
  username: process.env.DHL_USERNAME || '',
  password: process.env.DHL_PASSWORD || '',
};

async function testAuthService() {
  console.log(
    'ID: ' +
      credentials.client_id +
      ', Secret: ' +
      credentials.client_secret +
      ', Usert: ' +
      credentials.username +
      ', Password: ' +
      credentials.password,
  );
  if (
    !credentials.client_id ||
    !credentials.client_secret ||
    !credentials.username ||
    !credentials.password
  ) {
    console.error(
      'Fehler: Die Authentifizierungsdaten fehlen in den Umgebungsvariablen. Bitte stellen Sie sicher, dass Ihre .env-Datei korrekt ist.',
    );
    process.exit(1);
  }

  try {
    console.log('Try to get an auth token...');
    const token = await getAuthToken(credentials);
    if (token) {
      console.log('Here the received token:', token);
      console.log('Test was successful.');
    } else {
      console.error('Error: No token received.');
    }
  } catch (error: unknown) {
    let errorMessage = 'Ein unbekannter Fehler ist aufgetreten.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error('Test fehlgeschlagen:', errorMessage);
    process.exit(1);
  }
}

testAuthService();
