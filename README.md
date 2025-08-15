# IPO Tracker

A Next.js application that tracks Initial Public Offerings (IPOs) using the Polygon.io API.

## Features

- Real-time IPO data from Polygon.io
- Beautiful, responsive UI with Tailwind CSS
- Error handling and loading states
- Refresh functionality

## API Configuration

This app requires a Polygon.io API key to fetch IPO data. To get started:

1. Sign up for a free account at [Polygon.io](https://polygon.io/)
2. Get your API key from your dashboard
3. Create a `.env.local` file in the root directory
4. Add your API key: `POLYGON_API_KEY=your_api_key_here`

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
