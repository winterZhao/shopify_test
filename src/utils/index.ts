import express from 'express';

const tool = {
  sendResult(req: express.Request, res: express.Response, data: any) {
    res.json({
      code: 0,
      data,
    });
  },
  sendErr(req: express.Request, res: express.Response, e: any) {
    res.json({
      code: 1,
      data: null,
      message: e.stack,
    });
  },
};

export default tool;
