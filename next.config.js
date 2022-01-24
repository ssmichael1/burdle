/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

const isProd = process.env.NODE_ENV === 'production'

/*assetPrefix: isProd ? "/burdle/" : "",*/

module.exports = {
  assetPrefix: "/burdle/"
}
