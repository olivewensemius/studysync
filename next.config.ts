import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      // Supabase storage domains
      'supabase.co',
      'supabase.in',
      'supabase.com',
      // Common avatar providers
      'avatars.githubusercontent.com',
      'githubusercontent.com',
      'gravatar.com',
      'ui-avatars.com',
      'lh3.googleusercontent.com', // Google user avatars
      'cdn.discordapp.com'
    ],
  },
};

export default nextConfig;
