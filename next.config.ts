import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	devIndicators: false,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '*',
			},
		],
	},
	serverExternalPackages: [
		'@anush008/tokenizers',
		'@anush008/tokenizers-darwin-universal',
		'sqlite-vec',
	],
};

export default nextConfig;
