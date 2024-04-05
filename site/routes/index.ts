import { Request, Response } from 'express';

export async function get (req: Request, res: Response) {
  res.send(`<h1>Test: ${req.url} - ${req.params.slug}</h1><p>It worked!</p>`);
}