import express from 'express';

import tool from '../utils/index';
import shopifyService from '../services/shopify';

const router = express.Router();

/* GET home page. */
router.post('/product/import', async (req: express.Request, res: express.Response) => {
  try {
    const result = await shopifyService.importProdcut(req, res);
    tool.sendResult(req, res, result);
  } catch (e) {
    tool.sendErr(req, res, e);
  }
});

export default router;
