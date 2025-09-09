import { Router, Request, Response } from 'express';
import { getAuthToken } from '../dhl/auth.service.js';
import { AuthCredentials } from '../dhl/auth.types.js';

const router = Router();

router.post('/user', async (req: Request, res: Response) => {
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
    return res.status(500).send('Error: Auth credentials are missing.');
  }

  try {
    const token = await getAuthToken(credentials);
    res.status(200).send({ token });
  } catch (error: unknown) {
    let errorMessage = 'An unknown error occurred.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).send({ message: errorMessage });
  }
});

export default router;
