/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: { unoptimized: true },
    async rewrites() {
        return [
            {
                source: '/signup/:path*',
                destination: 'http://localhost:8000/signup/:path*',
            },
            {
                source: '/login/password/:path*',
                destination: 'http://localhost:8000/login/password/:path*',
            },
            {
                source: '/mfa/verify/:path*',
                destination: 'http://localhost:8000/mfa/verify/:path*',
            },
            {
                source: '/mfa/confirm/:path*',
                destination: 'http://localhost:8000/mfa/confirm/:path*',
            },
            {
                source: '/mfa/setup/:path*',
                destination: 'http://localhost:8000/mfa/setup/:path*',
            },
            {
                source: '/o/:path*',
                destination: 'http://localhost:8000/o/:path*',
            },
            {
                source: '/graphql/:path*',
                destination: 'http://localhost:8000/graphql/:path*',
            },
        ];
    },
};

export default nextConfig;
