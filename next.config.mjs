/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL:
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rchkrkbuuwxhplfqhhao.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjaGtya2J1dXd4aHBsZnFoaGFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzMjkwNzYsImV4cCI6MjEwNTkwNTA3Nn0.G9X1j4WPiz5iVbPKZuXpWogA24snNR8JDNL2rJjAF7w',
  },
};

export default nextConfig;
