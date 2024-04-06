import { Request, Response } from 'express';

export async function get (req: Request, res: Response) {
  res.send(`<h1>About</h1><p>This is an about page</p>`);
}