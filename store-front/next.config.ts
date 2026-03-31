/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        // 프론트엔드에서 /api/ 로 시작하는 모든 요청을
        source: '/api/:path*',
        // 백엔드(Spring Boot)의 /api/ 주소로 전달합니다.
        destination: 'http://localhost:8080/api/:path*',
      },
      {
        // 이전에 작성한 /login API 통신도 백엔드로 가야 하므로 추가해 줍니다.
        source: '/login',
        destination: 'http://localhost:8080/login',
      }
    ];
  },
};

export default nextConfig;