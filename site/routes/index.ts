import { Request, Response } from 'express';

export async function get (req: Request, res: Response) {
  res.send(`<h1>HTTX</h1><p>Hopefully just worked!</p>`);
}