import dotenv from 'dotenv';
dotenv.config();

import { getAuthToken } from '../../src/dhl/auth.service.js';
import { getCredentials } from '../../src/dhl/credentials.js';

// global handler for unhandled promises
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

async function testAuthService() {
  console.log(
    'ID: ' +
      getCredentials().client_id +
      ', Secret: ' +
      getCredentials().client_secret +
      ', Usert: ' +
      getCredentials().username +
      ', Password: ' +
      getCredentials().password,
  );
  if (
    !getCredentials().client_id ||
    !getCredentials().client_secret ||
    !getCredentials().username ||
    !getCredentials().password
  ) {
    console.error(
      'Fehler: Die Authentifizierungsdaten fehlen in den Umgebungsvariablen. Bitte stellen Sie sicher, dass Ihre .env-Datei korrekt ist.',
    );
    process.exit(1);
  }

  try {
    console.log('Try to get an auth token...');
    const token = await getAuthToken();
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
