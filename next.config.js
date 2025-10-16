/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disable React.StrictMode to prevent double rendering
  // Enable SWC minifier for better performance
  // swcMinify: true,
  // Optimize CSS and JS
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react'],
  },
  // Enable compression
  compress: true,
  // Optimize images
  images: {
    domains: ['i.pravatar.cc', 'images.unsplash.com'],
    formats: ['image/webp', 'image/avif'],
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
}

export default nextConfig
