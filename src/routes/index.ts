import express from 'express';

import shopify from './shopify';

export default function (app: express.Express) {
  app.use('/api/shopify', shopify);
}
