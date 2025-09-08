import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import { getAuthToken } from './dhl/auth.service.js';
import { AuthCredentials } from './dhl/auth.types.js';

dotenv.config();

const app: Express = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Willkommen bei Internetmarke API');
});

app.get('/token', async (req: Request, res: Response) => {
  const credentials: AuthCredentials = {
    grant_type: 'client_credentials',
    client_id: process.env.DHL_CLIENT_ID || '',
    client_secret: process.env.DHL_CLIENT_SECRET || '',
    username: process.env.DHL_USERNAME || '',
    password: process.env.DHL_PASSWORD || '',
  };

  if (
    !credentials.client_id ||
    !credentials.client_secret ||
    !credentials.username ||
    !credentials.password
  ) {
    return res
      .status(500)
      .send(
        'Fehler: Die Authentifizierungsdaten fehlen in den Umgebungsvariablen.',
      );
  }

  try {
    const token = await getAuthToken(credentials);
    res.status(200).send({ token });
  } catch (error: unknown) {
    let errorMessage = 'Ein unbekannter Fehler ist aufgetreten.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).send({ message: errorMessage });
  }
});

app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
