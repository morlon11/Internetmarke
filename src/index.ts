import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import authRoutes from './routes/authRoutes.js';
import buyingRoutes from './routes/buyingRoutes.js';

// Load variables for authentication
dotenv.config();

// Middleware
const app: Express = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

// Main route
app.get('/', (req: Request, res: Response) => {
  res.send(
    'Willkommen bei Internetmarke API. Zum Kauf von Marken rufen Sie diesen Service auf: http://localhost:3000/buylabel?orderid=123456&name=Robert+Andraschko&street=Schwalbenweg&houseNo=1&zip=84140&city=Gangkofen&country=DEU&weight=500&drucker=test_etikett',
  );
});

// Route module for authentication
app.use('/auth', authRoutes);

// Route module for buying postage labels
app.use('/buylabel', buyingRoutes);

// start server
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
