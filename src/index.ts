import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import authRoutes from './routes/authRoutes.js';

// Load variables for authentication
dotenv.config();

// Middleware
const app: Express = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

// Main route
app.get('/', (req: Request, res: Response) => {
  res.send('Willkommen bei Internetmarke API');
});

// Route module for authentication
app.use('/auth', authRoutes);

// additional routes
// TODO ...

// start server
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
