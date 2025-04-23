import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	devIndicators: false,
	images: {
		remotePatterns: [
			{
				protocol: 'http',
				hostname: '*',
			},
			{
				protocol: 'https',
				hostname: '*',
			},
		],
	},
	serverExternalPackages: [
		'@anush008/tokenizers',
		'@anush008/tokenizers-darwin-universal',
		'@anush008/tokenizers-linux-x64-gnu',
		'sqlite-vec',
	],
	experimental: {
		turbo: {
			resolveAlias: {
				'@': './src',
			},
		},
	},
};

export default nextConfig;
