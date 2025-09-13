// src/routes/buyingRoutes.ts

import { Router, Request, Response } from 'express';
import { createShippingLabel } from '../dhl/postage.service.js';
import { Address } from '../dhl/types.js';

const router = Router();

router.get('/', async (req, res) => {
  const { name, name2, street, zip, city, country, orderid } = req.query;

  const requestData: Address = {
    name: name as string,
    additionalName: name2 as string,
    addressLine1: street as string,
    postalCode: zip as string,
    city: city as string,
    country: country as string,
  };

  try {
    const result = await createShippingLabel(requestData, orderid as string);
    let success = result.success;
    let data = result.data;

    console.log(result);

    if (success) {
      res.status(200).json({ link: data });
    } else {
      res.status(500).send('Fehler beim Erstellen des Etiketts: ' + data);
    }
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).send('Ein unerwarteter Fehler ist aufgetreten.');
  }
});

export default router;
