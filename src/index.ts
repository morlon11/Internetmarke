import express, { Express, Request, Response } from 'express';
import axios from 'axios';

const app: Express = express();
const port: number = 3000;

// Middleware, um JSON-Bodies zu parsen
app.use(express.json());

// Ein einfacher Root-Endpunkt zur Überprüfung der API
app.get('/', (req: Request, res: Response) => {
  res.status(200).send('API for Deutsche Post Internetmarke is running!');
});

// Ein Platzhalter für den API-Endpunkt zum Kauf von Briefmarken
app.post('/api/purchase-postage', async (req: Request, res: Response) => {
  try {
    // Hier wird die Logik für den Kauf der Briefmarke implementiert.
    // Beispiel für einen typisierten Payload:
    // const payload: { address: string, weight: number } = req.body;
    // const response = await axios.post('https://api.deutschepost.de/internetmarke/v1/purchase', payload);
    // res.status(200).json(response.data);

    console.log('Received a request to purchase postage.');
    res.status(200).json({ message: 'Postage purchase request received successfully!' });

  } catch (error) {
    console.error('Error during postage purchase:', error);
    res.status(500).json({ error: 'Failed to process postage purchase' });
  }
});

// Server starten
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});