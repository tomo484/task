import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Azure Static Web Apps最適化設定 // 静的エクスポートを有効化
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  images: {
    unoptimized: true,
  },
  // 静的エクスポート用の設定
  reactStrictMode: true,
  // Server Actionsの設定はNext.js 15では不要
  // experimental: {
  //   serverActions: false  // 不要
  // },
};

export default nextConfig;
