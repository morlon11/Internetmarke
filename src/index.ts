import express, { Express, Request, Response } from 'express';
import { purchasePostage } from './services/dhlservice.js';

const app: Express = express();
const port: number = 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('API for Deutsche Post Internetmarke is running!');
});

app.post('/api/purchase-postage', async (req: Request, res: Response) => {
  try {
    const trackingNumbers = await purchasePostage(req.body);
    res.status(200).json({ trackingNumbers });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error during postage purchase:', error.message);
      res.status(500).json({
        error: 'Failed to process postage purchase',
        details: error.message,
      });
    } else {
      console.error('An unknown error occurred:', error);
      res.status(500).json({ error: 'An unknown error occurred.' });
    }
  }
});

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
