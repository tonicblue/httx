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

    <label>
      Type any <abbr title="/^[a-z0-9-]+$/i">valid</abbr> slug here and hit enter:
      <input type="text" value="${req.params.slug}" onfocus="this.select();" autofocus required onkeypress="
        this.setCustomValidity('');

        if (event.key === 'Enter') {
          if ((/^[a-z0-9-]+$/i).test(this.value)) {
            this.readonly = true;
            location.href = '/slug-demo/' + this.value;
          } else {
            this.setCustomValidity('Bad slug, expected something that matches /^[a-z0-9-]+$/i');
            this.reportValidity();
            this.select();
          }
        }
      ">
    </label>
  `;
  res.send(layout(req, title, body));
}