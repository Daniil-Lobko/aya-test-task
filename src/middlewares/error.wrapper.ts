import { Request, Response, NextFunction, json } from 'express';

export const errorWrapper = (cntrl: Function) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await cntrl(req, res, next);
    res.status(200);
  } catch (error: unknown) {
    if (error instanceof Error) res.status(400).json({ message: error.message });
    next();
  }
};
