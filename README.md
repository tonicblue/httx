# Hyper Text Transfer Xotocol (httx)

*An extremely limited and straightforward File System Routing setup for Express, inspired to work with HTMX <3*

---

** BTW! If it wasn't clear, this is a complete work in progress and isn't exactly functional. It's a small project I'm trying to finish with less than 2 days work so I can get on with my main project. Don't use this, or if you do, expect things to change a bit **

## Usage

### Basic usage

To get up and running, simply add it as a development dependency using your favourite NPM-alike:

```bash
npm i --save-dev httx_
pnpm add -D httx_
yarn add -D httx_
bun add -D httx_         # May not actually work with bun
```
For fastest results, create a directory called `routes` in the root of your project and stick the following file in it:

```typescript
import { Request, Response } from 'express';

export async function get (req: Request, res: Response) {
  res.send(`<h1>httx</h1><p>Hopefully just worked!</p>`);
}
```

Then run the following:

```bash
npx httx --port 27374 && tsc && node main.js
```

If you navigate to `http://localhost:27374` you should get a response. If you have a directory called `public` in the root of your project it will be used as a rudimentary static server.

### Not so basic usage

If you don't want it to create the Express application for you, you can still generate the `main.ts` file which exports a function called `addRoutesToApp(app: Express.Application)` which will take your existing Express app and add your routes for you. This is where in my mind the only draw back to using code generation comes in. You have to have at least generated that `main.ts` once for you to import that `addRoutesToApp()` method but it's a small price to pay.

### BIG BLEEPING WARNING

**This is code generation so if you make changes to the `main.ts` file you are doing it wrong and rightfully your hard work will be overwritten the next time your build process is triggered.**

## Introduction

Yes this section comes after the "[Usage](#usage)" section, I know what you people want. Also the intro section is an imaginary FAQ.

### Why?

Ever wanted to just stick some TS files in some folders and then call them from your browser. Well now you can! I mean, you probably could before, but now you can using my code!

### But Express?!

I haven't used Express in over half a decade so I don't really know what's up, I've rolled my own for a couple of different platforms I've built and run but I'm increasingly wanting to tinker with an idea here and there, and wiring up routes is boring.

As far as I'm aware with minimal recent research, there's nothing inherently wrong with Express. I'm sure there are faster alternatives that provide their own type definitions but Express works and has worked for millions of people for an extremely long time (in JS timescales). There are a gazillion extensions and middleware available for it and for what I'm using it for, it does enough.

### What exactly?

In essence it goes through your file tree and uses code generation to create a single output `.ts` file which provides all you need to start serving traffic to your `.ts` files. The only thing you need to do is make sure your `.ts` files export Express `RequestHandler`s with names that match the various Express `Application` methods (`get`, `post`, `head`, `all`, etc.). It allows for Express style paths for gathering parameters and such. Not sure how many of these characters are allowed in filenames on Windows so if you're in that boat, I can't help you, nobody can.

### Code generation, isn't that really annoying?

Not really.

### No, seriously?

Look, we're developers. Everything else in the JS ecosystem requires several extra build steps to get up and running with each other. If you are already doing that then what's one more command in the chain? If you don't want to do that and have a project where you don't want all the dependencies, generating a `main.ts` file whenever you want to restart your code is a tiny step for the benefits.

There are probably arguments about it not being safe to use generated code but this is pretty much just generating a list of imports and a list of calls to a function. It can go wrong if you're a dumbass, but it's easy to debug and works in most use cases.

### Why HTTX?

I'm assuming you are asking about the name. I like HTMX, like **REALLY** like HTMX. I don't think it's ground breaking or anything but it seems to have made people who have only been developing since the year 1AR (after React), that things weren't always this way and really don't need to be. React and the likes are cool ideas and have their places but they are not by definition how you build things. They are tools which people use when they really don't need them. Browsers and where we are at with web standards these days is amazing and most of what you need to build an amazing application is already there without the need for dependencies.

I'm still convinced that 3/4 of projects using React don't require it and could have much smaller and cleaner codebases if they were designed with a more full understanding of what is capable with bare bones tech.

### But you're using TypeScript and preaching the virtues of fewer dependencies?

You're right, you're right, you got me. I mostly targeted TypeScript because that is one compromise I'm willing to make. Big fan JS with JSDoc over here but can't quite commit fully. I don't think calling `tsc` is that much of a hassle and plus, it's a developer dependency.

### Can we get some proper documentation?

Soon my child, but right now nobody has even read this document, so why would i start writing another?

### Where are the tests?

Haha, good one!

### Roadmap?

I just want to use it in anger until i feel it's "done". I don't want it to do any more than it already does, I just need to make sure it does that properly. and inevitably, if anyone ever does use it and they're on something I don't have access to, they might run into an issue and I'd be happy to take pull requests or little fixes. Just no feature requests please. That's kinda not the point.

### What about security, is it tight?

🤷‍♂️ I don't know. Is Express secure? If so, this ain't doing much more than that. Like with anything that is generating code which opens portals to other files and code on your system you should use with caution. Like, check it's output before you go live and don't do anything stupid.
