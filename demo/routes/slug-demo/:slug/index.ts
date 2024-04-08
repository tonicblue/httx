import { Request, Response } from 'express';
import layout from '../../../views/layout'

export async function get (req: Request, res: Response) {
  const title = `Slug: ${req.params.slug}`;
  const body = /*html*/`
    <h1>URL Parameters</h1>
    <p>
      This is a dynamic page that takes any path part and sticks it into a parameter called
      <code>slug</code>. The current parameter is: <code>${req.params.slug}</code>
    </p>
  `;
  res.send(layout(title, body));
}