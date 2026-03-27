import createMDX from '@next/mdx';
import type { NextConfig } from "next";

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
});

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  experimental: {
    mcpServer: true,
    typedEnv: true,
    inlineCss: true,
  },
  async redirects() {
    return [
      {
        source: '/en',
        destination: '/',
        permanent: true,
      },
      {
        source: '/en/:path*',
        destination: '/:path*',
        permanent: true,
      },
      {
        source: '/es/guides/american-odds-to-decimal',
        destination: '/es/guides/lineas-americanas-a-decimales',
        permanent: true,
      },
      {
        source: '/es/guides/implied-probability-guide',
        destination: '/es/guides/guia-probabilidad-implicita',
        permanent: true,
      },
      {
        source: '/es/guides/parlay-odds-formula',
        destination: '/es/guides/formula-cuotas-parlay',
        permanent: true,
      },
      {
        source: '/es/guides/what-does-minus-110-mean',
        destination: '/es/guides/que-significa-menos-110',
        permanent: true,
      },
      {
        source: '/es/guides/value-betting-with-implied-probability',
        destination: '/es/guides/valor-en-apuestas-con-probabilidad-implicita',
        permanent: true,
      },
      {
        source: '/es/guides/parlay-vs-straight-bets',
        destination: '/es/guides/parlay-vs-apuesta-simple',
        permanent: true,
      },
      {
        source: '/es/guides/positive-ev-betting-formula',
        destination: '/es/guides/formula-apuestas-ev-positivo',
        permanent: true,
      },
      {
        source: '/es/guides/how-to-use-ev-calculator',
        destination: '/es/guides/como-usar-calculadora-ev',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=86400, stale-while-revalidate=604800',
          },
        ],
      },
    ];
  },
};

export default withMDX(nextConfig);
