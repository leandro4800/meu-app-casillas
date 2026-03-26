import { Request, Response } from 'express';

export default (req: Request, res: Response) => {
  res.json({ status: "ok", message: "Casillas API is running from /api folder" });
};

export const getHealth = (req: Request, res: Response) => {
  res.json({ status: "ok", message: "Casillas API is running from /api folder" });
};
