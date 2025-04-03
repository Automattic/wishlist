This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Prepare the DB with products

### 1. Run the scraper

First you will need to run a scraper to build the database and fill it with products.
You will need to supply a `shops.csv` file, where each line is a different shop (name,url).

    $ tsx src/scraper/scrape.ts

The command accepts 2 parameters:

 - `--workers` will tweak the concurrent shops to be scraped (default: `1`)
 - `--csv` can be used to supply a custom csv path (default: `shops.csv`)

### 2. Run the prepare db script

Next you need to run the script to prepare the db for vector search:

    $ tsx src/scraper/prepDb.ts

This will take a bit of time, while it downloads the model for creating the embedding and calculates those too.
