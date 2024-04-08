import { Request } from 'express';
export default (req: Request, title: string, body: string) => req.header('hx-boosted') ? body : /*html*/`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>${title}</title>

  <link rel="stylesheet" type="text/css" href="/style.css">
  <script src="https://unpkg.com/htmx.org@1.9.11" integrity="sha384-0gxUXCCR8yv9FM2b+U3FDbsKthCI66oH5IA9fHppQq9DDMHuMauqq1ZHBpJxQ0J0" crossorigin="anonymous"></script>
</head>
<body hx-boost="true" hx-target="main">
  <nav>
    <a href="/">Home</a>
    <a href="/about">About</a>
    <a href="/slug-demo/any-slug">Slug demo</a>
  </nav>

  <header>
    ${title}
  </header>

  <main>
    ${body}
  </main>

  <footer>
    <p>
      This is a demo site for <a href="https://github.com/tonicblue/httx">httx</a>.
    </p>
  </footer>
</body>
</html>
`;