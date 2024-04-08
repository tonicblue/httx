import { Request, Response } from 'express';
import layout from '../views/layout'

export async function get (req: Request, res: Response) {
  const title = 'About the demo site';
  const body = /*html*/`
    <h1>What is this?</h1>
    <p>Here is an example httx setup that uses most of its very limited feature set</p>
  `;
  res.send(layout(title, body));
}