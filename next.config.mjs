/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // 95 is used for the full-screen hero photo so it isn't compressed twice
    qualities: [75, 95],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/vr-experience-cape-town',
        destination: '/virtual-reality-cape-town',
        permanent: true,
      },
      // Static VR school experiences (built from /experiences into /public/experiences)
      { source: '/experiences', destination: '/experiences/index.html', permanent: false },
      { source: '/experiences/solar-system', destination: '/experiences/solar-system/index.html', permanent: false },
    ]
  },
}

export default nextConfig
