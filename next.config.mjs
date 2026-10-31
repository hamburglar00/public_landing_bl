/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [{ source: '/public-assets/template-entry/:path*', headers: [
      { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
    ] }];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fdkjkzpjqfbaavylapun.supabase.co'
      }
    ]
  }
};

export default nextConfig;
