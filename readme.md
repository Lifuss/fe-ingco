# FE-INGCO

This is a repository about the frontend side of the application of Ukrainian importer of Ingco products [ingco-service](https://ingco-service.win/home).

The application has routing for 3 different branches of application with strict private routing for different users such as non-registred users (can do retail but don't have history and favorite features), registered but non-verified users (only retail with history and fav features), verified user(all B2B and support features), admin(B2B features and CRM for managing site content, users, orders and support ticket)

## Built With

- TypeScript
- Next.js (app routing, try my best to optimize loading time, mixed of server-side rendering and client-side rendering, using next/routing|image, etc.)
- Redux Tool Kit (implemented in app routing as a component wrapper in global layout =D)
- Tailwind (clsx for complex conditional styling)
- Zod

## For local testing

#### (not for commercial, Copyright © 2025 [INGCO](https://www.ingco.com/) Inc. All rights reserved )

### Setup project

- clone repository `git clone https://github.com/yourusername/your-repo-name.git`

- navigate to the directory
    `cd your-repo-name`

- install dependencies `npm i`
- set environment variables in `.env` file, look for an example in the `.env.example` file (you need [backend](https://github.com/Lifuss/be-ingco.git) URL and mongoDB DB as well)
- for the live page start the `npm run dev` command
- for build application `npm run build` (my advice to lint before building project `npm run lint`)
