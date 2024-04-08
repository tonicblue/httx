import { Request, Response } from 'express';
import layout from '../views/layout'

export async function get (req: Request, res: Response) {
  const title = 'Welcome to the demo site';
  const body = /*html*/`
    <h1>Home</h1>

    <p>This is the home page</p>
  `;
  res.send(layout(req, title, body));
}