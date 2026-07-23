/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { serverComponentsExternalPackages: ['better-sqlite3', '@react-pdf/renderer'] },
}
export default nextConfig
